# W2 grade: pkgKBG (Wall 3853, builder W3), seat W2_2026_11_04, 11-09 CST

VERDICT: PASS. One finding for a later build (not a fault of this package).

## What the package does
With a bare flagged answer, a send-back KEEP whose six-word window is found only in another bare grant or deferral sentence of the answering side (or runs into one) reads UNCURED, reason "... another bare grant or deferral of the answering side (...), not a fuller answer (pkgKBG)". Record-only. 3 Send Back nodes. Stacks on pkgKVQ.

## Checks
1. Base: pkgKBG/base_s94_KVQ.json is byte-equal (nodes and connections) to my own KVQ rebuild on s94 (pkgKVQ/w2_grade/parent_s94_KVQ_w2.json).
2. Rebuild: build_KBG.cjs on my KVQ s94 file gives p94_KBG.json, byte-equal to parent_s94_KBG.json. Against live s94 it changes only Send Back Record, Alt Send Back Record, R2 Alt Send Back Record. Writing it writes pkgKVQ too.
3. W3 probe: 18 OK, 0 FAIL. Replay: 42 node runs, 68 KEEP rows, 0 rows differ.
4. My plants on 33798 terra, Job 14:1 item, KVQ base against KBG (w2_plant_KBG.txt): 17 OK, 0 FAIL. Aimed at over-cutting:
   - Reasoned sentence right after a two-word grant "I grant it.": CURED.
   - Reasoned sentence after the Genesis 4:1 grant in the same bullet: CURED.
   - Reasoned sentence after a grant, next sentence opening with a bracket tag: CURED.
   - Grant joined to its reason by "for" in one sentence (planted): CURED.
   - Bare grant then a reasoned sentence in one KEEP: CURED.
   - Another bare grant (John 3:6 item): UNCURED, pkgKBG reason. Two bare grants together: UNCURED, pkgKBG reason.
   - Every other field equal in each case; 34108's 27 stored send-back rows equal to the base.
5. Rolled-back insert through record_enforcer_log (w2_rollback_KBG.sql), 2 rows (panel send_back UNCURED with the pkgKBG reason; panel send_back CURED): accepted, {"rows": 2, "recorded": true}; 0 rows remain for run token W2-ROLLBACK-TEST-KBG.

## Finding (for a later build)
"Matthew 17:5 is answered under Luke 9:34." (a deferral to another verse's answer, in the side's own CR3) is not a deferral under pkgKQG's test, which knows only "under LINK n", "in/see CRn" and "answered above/below/there". A KEEP quoting it still reads CURED, as live. pkgKBG says it uses pkgKQG's test, so this is within its stated scope; it errs lenient.
