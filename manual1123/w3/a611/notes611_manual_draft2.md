# ASK 611 engine manual entry, DRAFT 2 (W3, session_01H1X3ANsGiMnhnbkfphocmo, 18:19 CST 2026-11-24). NOT WRITTEN. Replaces draft 1 (2f420d05), which was not graded.

Pairs: manual1123/w3/a611/em_pairs_611_draft2.json (4367afee). Two parts.
- 10.0: base v310 532963e73872affbfcffe83139852a3f (58,634) to e28a7ed7a7dd712c977545579661e35e (62,222), +3,588; pair list md5 3d1db7ec7a0cb393130995bbd9162585; three pairs; preview counts [1,1,1].
- 11.2: base v309 c3c2960035a406a6c8949aaecf386c6f (16,643) to 59f3a6aff71d1af9ba4a126324f1ac46 (16,713), +70; pair list md5 01e54774f4d3767a79b8ece11542d3ff; one pair; preview counts [1].
Both previews by engine_manual_part_apply with p_write false at 18:19 CST: success. Written in the order 10.0 then 11.2 they become v311 and v312.
Section 0 read before drafting: part 00.1 v247 5bc72deb04ef4c43fba112bdd1c6380d.

CHANGES FROM DRAFT 1, all in the new entry of 10.0 except the last:
1. W4's fact (c): "the Shared Library's judge readers, its MAP entries Send Back Build and Late Gate Build" becomes "the Shared Library entries that rebuild each judge's full request after the question round, Send Back Build and Late Gate Build among them".
2. W4's fact (d): Close Group Retry Build takes the body from Close Group Batch Build and, when that item holds none, rebuilds it from Close Enforcer Build or Assume Check Build. Draft 1 said it fetches it from the Build step.
3. W4's fact (b): the node's full name, "Close Enforcer Needed?".
4. W4's facts (a) and (e): right as drafted, no change.
5. NEW pair in 11.2 (W1's answer on Wall 11821): the ASK 607 mark names cure_reason. Old: Mark: an E-GATE row whose reason begins "pkgFRM refused the gate change" and which is RECORD-ONLY, with the seat not removed for it. New: Mark: an E-GATE row of `debate_enforcer_log`, stored UNCURED and RECORD-ONLY, whose `cure_reason` begins "GATE CHANGE TO:" and holds "| pkgFRM refused the gate change", with the seat not removed for it.

The three pairs of 10.0 (unchanged in purpose from draft 1):
1. The PARALLEL JUDGES line: Prep puts out one item per slot with the nonce and without the body; Panel Judges Parallel builds the body in its request expression.
2. The ASK 623 entry is no longer named "the last entry of this section".
3. The new last entry of section 10, THE JUDGING HOLDS ONE COPY OF EACH REQUEST (ASK 611 with fix 1 and fix 2).

Sources: W4 Wall 11644, 11646, 11648, 11650, 11656, 11668, 11674, 11778, 11782, 11798; W4's thread note of 18:17 CST 2026-11-24 (the five facts, checked on live 6b2cc236); W1 Wall 11651, 11657, 11670, 11675, 11783, 11797, 11821; my AAR of run 42373.
NOT IN THIS DRAFT: a line in section 15 for the expression compile check (section 15 holds none; ASK 612's entry if one is wanted).
Write steps on PASS: one card in my thread; W4 poll that nothing runs; section 0 check; write base64 with guards (truth.card set), 10.0 then 11.2; audit; Wall; W1 readback; report every changed text.
