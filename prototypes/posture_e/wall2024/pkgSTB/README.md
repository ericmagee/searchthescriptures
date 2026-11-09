# pkgSTB (W3): stub form 3. A library fix rewrites one node, not 32

Authority: the operator's answer "1" (17:48 CST 11-09, W3 thread) to ASK 1: build offline, two other seats grade, live only after two passes.
Base: live s90 (418 nodes). Library strip: pkgLIB/strip_STB, a byte-equal copy of pkgLIB/strip_VP1_s84 (the live library). Graders: any two seats other than W3.
Not for write until two PASS grades.

## What is wrong today
The engine holds one copy of the shared code (the Shared Library node). Each of the 30 library nodes is a stub that holds a list of line numbers into that copy, its own lines, and the length and hash of its rebuilt source. A fix that adds or removes one line in the shared copy moves the line numbers, so all 30 stubs and Early Alternate Build are rewritten (pkgFUK rev 2: 32 nodes for one reader fix). Every write and every grade then carries 32 nodes.

## The change (stub form 3)
1. Each node's line list, own lines and length move out of its stub into the Shared Library, in a new block `/*MAP*/{"<node name>":{"n":<length>,"p":[...]}}` between `/*LIB*/[...]` and `/*END*/`.
2. A stub holds only: its name, the line naming the nodes it reads (unchanged), and the same rebuild, length check and run line as today. It reads its entry by its own name. Its header no longer carries the source hash and length.
3. A stub therefore changes only when the nodes its code reads change. Any other library fix changes the Shared Library node alone. Early Alternate Build's head is Alternate Build's stub, so it is stable too.
4. No line of any node's running code changes.
5. A partial write can no longer leave a stub that disagrees with the library: the list and the lines stand in the same node. Mixed forms stop with an error before any code runs (probe C); the first write must carry all 32 nodes together.

## Tools changed (shared; default behaviour unchanged)
- pkgLIB/pack.cjs: `STUBV=3` in the environment, or a file `gate/STUBV` holding `3`, packs in form 3. Default 2. Checked: with the edited tool, form 2 on strip_VP1_s84 gives all 30 stubs, the Shared Library and both e4 heads byte-equal to live s90.
- pkgLIB/e4_rebase.cjs: the stub head ends at the length-check line (it counted 8 lines; form 3 heads are shorter). Same result in form 2 (checked above).
- gate/pack.cjs, unpack.cjs, gate/replay.cjs, gate/src.cjs: unchanged. gate/pack.cjs still proves every stub rebuilds its strip source byte for byte.

## Build
    cp -r pkgLIB/strip_VP1_s84 pkgLIB/strip_STB
    STUBV=3 FB=/mnt/project-files/wall2024/fetchback_live_s90.json node gate/pack.cjs pkgLIB/strip_STB pkgLIB_STB
    node pkgSTB/build_STB.cjs      # pkgSTB/parent_s90_STB.json: 418 nodes, 32 changed, connections unchanged
    node pkgSTB/probe_STB.cjs      # probe_STB.txt

## Proof (probe_STB.txt: 12 OK, 0 FAIL)
- A. All 31 library nodes (30 stubs and Early Alternate Build) rebuild, each through its own stub and its own Shared Library, to the same source text in live and in the candidate: 9,947,807 bytes of running code, byte-equal. No other node differs; connections equal. The lines after the length check (the run line; the Early Alternate Build tail) are equal for all 31.
- B. Each of the 31 nodes run whole, stub included, on the saved inputs of runs 34108 and 34016, live against candidate: the same result for 31 of 31 in both runs (22 and 24 with output; the others give the same error because the run saved no input for them).
- C. A missing entry, an entry that does not fit the library, a form 3 stub on the form 2 library and a form 2 stub on the form 3 library each stop with an error before any node code runs.
- D. The gain: pkgFUK rev 2 (strip_FUK2) packed in form 3 changes 1 file (Shared_Library.js); packed in form 2 it changes 31. The unchanged form 3 stubs on the new Shared Library rebuild every pkgFUK rev 2 source byte for byte.
- The shared replay gate is not run: the strip folder equals the live library file for file, so base and candidate are the same sources.
- No enforcer log row is added or changed.

## Size
Shared Library 490,937 to 593,621 bytes (the nodes' own lines and lists now stand there); the 30 stubs fall to about 1.6 KB each (48 KB together). The total is about the same. Each node parses the map (about 100 KB of JSON) once more than today.

## At the write (W4) and after
1. Rebuild on the live base at that time: if a library package was written after s90, copy its strip folder as strip_STB, pack with STUBV=3, run build_STB.cjs with that fetch-back (NODES=<count>), rerun the probe.
2. Write all 32 nodes in one update. Revert copy first, as always.
3. In the same commit as the write record, add the file `gate/STUBV` holding `3`. From then on every seat's `node gate/pack.cjs ...` packs form 3 with no other change, and a library package's parent step changes the Shared Library only (plus a stub whose read list changed).
4. A package packed in form 2 after that would rewrite all stubs back to form 2: the `gate/STUBV` file prevents it; a grader checks the stubs open with "// pkgLIB stub, form 3".

## Limits
1. It does not make a debate faster and changes no rule.
2. A stub still changes when its code starts or stops reading a node (the line that names them), and a new library node still needs its own stub.
3. The length check is the only integrity check, as today; the hash that stood in the stub header was a comment and was never checked at run time.
4. Unproven until a live run executes the 31 nodes.

## Engine manual part (for v94)
Shared Library (pkgLIB, stub form 3, pkgSTB): the Shared Library node holds the shared lines once (`/*LIB*/`) and, for each library node by name, its line list, own lines and source length (`/*MAP*/`). A library node's stub reads its entry by name, rebuilds its source, checks the length and runs it. A stub changes only when the nodes it reads change; every other library change is a change to the Shared Library node alone. Packing: `gate/pack.cjs`, form set by `gate/STUBV`.
