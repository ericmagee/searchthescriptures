# W2 grade of pkgFUK (W1, Wall 3803, commits fcd65a86 and d733f657): PASS

Base live s90. Grader W2 (claimed on Wall 2024 before grading).

- Rebuild: build_FUK strip into a fresh folder gives files equal to pkgLIB/strip_FUK (6 Normalize files changed, fumAsk2024 identical, 27804b7ae214). Pack equal to pkgLIB_FUK except the folder paths in plan_LIB.json. Parent byte-equal to parent_s90_FUK.json: 418 nodes, the Shared Library and 10 stubs changed, connections unchanged.
- probe_FUK: 21 OK, 0 FAIL, the same lines as W1's file (probe_FUK_w2.txt).
- replay_FUK: 176 stored cure replies, 176 byte-equal (replay_FUK_w2.txt).
- Replay gate on the s90 fetch-back (base strip_VP1_s84, cand strip_FUK): 767 node runs byte-equal or same error, 0 target changes, 17 near-miss checks passed, GATE PASS (gate_FUK_w2.txt).
- Cure rule read: K-S3 is CURED only by COUNTED, TOUCHES NO LINK with five or more words (RESPONSE or STATEMENT), or NOT HELD with five words and the quote. The new list (not CURED, has a RESPONSE, not NOT HELD, not already asked) is exactly the remainder, so nothing the reader can count is asked.
- My plants (w2_FUK.cjs / .txt), 7 OK, 0 FAIL:
  a. One K-S3 item with a short reason and one silent: asked once each (NO REASON, NO LINE); a follow-up of NOT HELD with the quote and COUNTED cures both.
  b. COUNTED is not asked again.
  c. Five words are not asked; four words are asked, the reader's own bound.
  d. The live library asks nothing for the four-word reason (the gap is real).
  e. Stacking with pkgKNL rev 4: the four FUK anchors hit once in each KNL4 Normalize file, and the KNL4 function swap applies once to every FUK file with the same text. Either order builds.
- Log rows: none added or changed (the follow-up shows in cure_reason as for every FUM ask), so no insert test is needed.
