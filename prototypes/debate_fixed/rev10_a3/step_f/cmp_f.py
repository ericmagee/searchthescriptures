#!/usr/bin/env python3
"""BB-7397 rev 10 (f) step 3 compare.

Usage: python3 -I cmp_f.py <base_version.json> <new_version.json> <NODES14.txt>

base: get_workflow_version output for a82b4d29 (the pre-write head).
new:  get_workflow_version output for the new head after the 14 writes.
Checks:
  1. each of the 14 named nodes: md5(parameters.jsCode) in new == "after" in NODES14.txt
     (and md5 in base == "before").
  2. every other Code node: jsCode md5 unchanged base -> new.
  3. all nodes: same node names (set and order); every field except parameters.jsCode
     equal base -> new (for the 14; for all other nodes the whole node must be equal).
  4. connections equal.
Exit 0 only when every check passes.
"""
import hashlib
import json
import sys

CODE_TYPES = {"n8n-nodes-base.code"}


def md5(s):
    return hashlib.md5(s.encode("utf-8")).hexdigest()


def strip_js(node):
    n = json.loads(json.dumps(node))
    if isinstance(n.get("parameters"), dict):
        n["parameters"].pop("jsCode", None)
    return n


def main():
    base_p, new_p, nodes14_p = sys.argv[1:4]
    base = json.load(open(base_p, encoding="utf-8"))
    new = json.load(open(new_p, encoding="utf-8"))
    want = {}
    for line in open(nodes14_p, encoding="utf-8"):
        if not line.strip():
            continue
        before, after, fn = line.split()
        want[fn[:-3].replace("_", " ")] = (before, after, fn)

    ok = True
    print("base versionId:", base.get("versionId"))
    print("new  versionId:", new.get("versionId"))
    print("new  name     :", new.get("name"))
    print()

    bn = {n["name"]: n for n in base["nodes"]}
    nn = {n["name"]: n for n in new["nodes"]}

    # node names
    names_equal_set = set(bn) == set(nn)
    names_equal_order = [n["name"] for n in base["nodes"]] == [n["name"] for n in new["nodes"]]
    print("node count base/new: %d / %d" % (len(base["nodes"]), len(new["nodes"])))
    print("node names equal (set):", names_equal_set)
    print("node names equal (order):", names_equal_order)
    if not names_equal_set:
        ok = False
        print("  only in base:", sorted(set(bn) - set(nn)))
        print("  only in new :", sorted(set(nn) - set(bn)))
    print()

    # 14 targets
    print("== 14 target nodes ==")
    print("%-26s %-34s %-34s %s" % ("node", "fetched md5 (new)", "expected after", "result"))
    for name, (before, after, fn) in want.items():
        if name not in nn or name not in bn:
            print("%-26s MISSING" % name)
            ok = False
            continue
        bm = md5(bn[name]["parameters"]["jsCode"])
        nm = md5(nn[name]["parameters"]["jsCode"])
        res = "MATCH" if nm == after else "MISMATCH"
        if nm != after:
            ok = False
        bres = "base==before" if bm == before else "base!=before (base %s)" % bm
        if bm != before:
            ok = False
        print("%-26s %-34s %-34s %s; %s" % (name, nm, after, res, bres))
    print()

    # other code nodes
    print("== other Code nodes (jsCode must be unchanged) ==")
    others = [n for n in base["nodes"] if n.get("type") in CODE_TYPES and n["name"] not in want]
    changed = []
    for n in others:
        b = n.get("parameters", {}).get("jsCode")
        x = nn.get(n["name"], {}).get("parameters", {}).get("jsCode")
        if b != x:
            changed.append(n["name"])
    print("other Code nodes checked:", len(others))
    print("other Code nodes changed:", len(changed), changed if changed else "")
    if changed:
        ok = False
    print()

    # non-code fields, all nodes
    print("== non-jsCode fields, all nodes ==")
    diff_nodes = []
    for name, b in bn.items():
        if name not in nn:
            continue
        x = nn[name]
        if name in want:
            if strip_js(b) != strip_js(x):
                diff_nodes.append(name)
        else:
            if b != x:
                diff_nodes.append(name)
    print("nodes whose non-jsCode fields (or, for non-targets, any field) differ:", len(diff_nodes), diff_nodes if diff_nodes else "")
    if diff_nodes:
        ok = False
    print()

    # connections
    conn_equal = base.get("connections") == new.get("connections")
    print("connections equal:", conn_equal)
    if not conn_equal:
        ok = False
    for k in ("nodeGroups",):
        if k in base or k in new:
            eq = base.get(k) == new.get(k)
            print("%s equal: %s" % (k, eq))
            if not eq:
                ok = False
    print()
    print("OVERALL:", "PASS" if ok else "FAIL")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
