"""Wrong-if limb for BB-8792: each Haiku output tested against its own input.
FIRES (returns a reason) if the output is not one JSON object, names a rule other than the one asked,
gives a verdict other than BREACH/CLEAN, or quotes decisive words not found verbatim in the unit it was given."""
import json, sys
def check(output: str, asked_rule: str, unit_text: str):
    try: o = json.loads(output.strip())
    except Exception: return "not one JSON object"
    if not isinstance(o, dict): return "not one JSON object"
    if o.get("rule") != asked_rule: return "rule key %r != asked %r" % (o.get("rule"), asked_rule)
    if o.get("verdict") not in ("BREACH", "CLEAN"): return "verdict %r not BREACH/CLEAN" % o.get("verdict")
    q = o.get("quote") or ""
    if not q.strip(): return "no decisive quote"
    if q not in unit_text: return "quote not found verbatim in the unit given"
    return None
if __name__ == "__main__":
    unit = "D1 vs C2 (Matthew 1:16): UNDERDETERMINED -- neither text states that Joseph begat the child."
    good = '{"rule":"K-S2","verdict":"BREACH","quote":"neither text states that Joseph begat the child","why":"stating ground"}'
    bad  = '{"rule":"K-S2","verdict":"BREACH","quote":"no verse names Joseph as father","why":"invented quote"}'
    bad_null = '{"rule":"K-S2","verdict":null,"quote":null}'
    for name, out in (("known-good", good), ("known-bad", bad), ("known-bad-null", bad_null)):
        print(name, "->", check(out, "K-S2", unit) or "does not fire")
