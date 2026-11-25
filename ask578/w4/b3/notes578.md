# ASK 578 re-cut 2 on 579 (W4, 18:58 CST 11-24): the child reads the engine's library text from the call

Base: live engine 634afc23 / child 85515391 (after ASK 627 and 628), fetched as the ASK 628 fetchbacks: base_eng.json 0e574640, base_child.json 579e3035 (sha256, first 8).
Build: W3's t578b.js (ask578/w4/build, unchanged) finds the readers on the base and writes the targets. No hand edits.
Targets: target_engine_578.json c5bc9fd3, target_child_578.json bc5b5f08. Rebuilt twice; byte-equal.

## What changes (as graded before; unchanged in method)
- Engine: Alternate Pass Call sends `lib: $('Shared Library').params.jsCode` beside lib_sha. Only that node changes.
- Child: 14 readers (13 named stubs and R2 Alt Judge Enforcer Retry Build) read `$('Alternate Pass In').first().json.pass.lib` in place of the child's own Shared Library node. Library Check (ASK 422a) checks the passed text against the engine sha and map sha, takes `__MAPEXTRA422` from the engine, and strips the text from `pass` after the check. The child Shared Library node is removed. Connections unchanged.

## Results on this base
- t578b: ALL PASS (22 checks), out_t578b.txt. The child asks for 14 keys of 72, served by 3,494 of 3,858 library lines.
- Child nodes as JSON: 1,422,386 to 97,905 characters (saved 1,324,481). Text passed in the call: 1,276,323 characters (1,279,423 bytes UTF-8).
- Standing set on the targets: 31 PASS, 0 FAIL (out_standing_578.txt). On live: 31 PASS, 0 FAIL.
- Pair check on the targets: PASSES (child run on the engine text in the call).

## Tool modes added (ASK 578; behaviour with a child that has a Shared Library node is unchanged)
1. standing/lib.cjs + run.cjs: `serveFrom(C,E)`. A child with no Shared Library node whose Library Check reads `__p.lib` is given the engine's library for every library read. Before-copies: b3/lib_before.cjs, b3/run_before.cjs.
2. ask557/w4/build/test557.js `--pair`: with no child Shared Library node, the child's Library Check node is run offline on what the engine sends (`lib`, `lib_sha`, `map_sha`). The engine's Alternate Pass Call must send the library text, or the check THROWS. Before-copy: b3/test557_before.js. Controls: 578 engine + 578 child PASSES; live engine + 578 child THROWS (engine does not send); live pair PASSES; 578 engine + live child PASSES (the old child ignores the extra field, so an engine-only half write is safe). The default mode's one FAIL (D2 sheet, G1352) is the same before and after this change.
3. ask579/w4/b2/fixhdr579.js: a file with no Shared Library node is skipped (SKIP line). Before-copy: b3/fixhdr579_before.js.
After the write, a Library change is made on the engine only; the child takes it from the call.

## Write
write2/write578.sh: refuses on a running engine or child execution; rebuilds with t578b and requires byte-equal targets; requires each changed or removed live node to equal the base and connections unmoved; standing and pair on the PUT files; PUT engine, then child; fetchback compare; standing and pair on the fetchbacks. Revert files revert_*_578.json. Write order engine first is safe on its own (old child ignores `lib`).

## Open, for the card
- C7 showed a 1,203,331-character text passing in an Execute Workflow call (parent 42353, child 42354). The full call carries about 9.1 MB; the payload limit is NOT ESTABLISHED until the first live run.
- The try-node re-call path was not shown by run 42071 (re-call only in C2B, C3B).

## REV 1 (19:02 CST 11-24): W1 F1 (Wall 11842) fixed
- F1 (ASK 599 rule 10): the 14 readers and Library Check now carry an ASK 578 comment. Build test b3/t578c.js (36a02bef) = W3's t578b.js with two strings changed: the reader replacement ends `/* ASK 578: the engine library text, passed in the call */`, and the new Library Check tail opens with `/* ASK 578: ... */`. t578c ALL PASS (22 checks), out_t578c.txt.
- Targets now: target_engine_578.json c5bc9fd3 (unchanged), target_child_578.json 7eb149f4 (15 changed nodes, 15 tagged). Untagged cut kept in cut2_untagged/. Standing 31/0; pair PASSES. write2/write578.sh now rebuilds with t578c.js.
- W1 notes for the card: N1 pair578 matches the Alternate Pass Call expression text, it does not evaluate it; N2 payload limit unknown; N3 each child execution stores the 1.28 MB library text in its run data (on the Wall for team review first); N4 MISTAKE (W4): the three tool modes were put on the shared mount before W1's grade. They change nothing for a child that has a Shared Library node; before-copies are in b3/.
