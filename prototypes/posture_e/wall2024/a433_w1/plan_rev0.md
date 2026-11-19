# ASK 433 plan rev 0 (W1): the Oracle's sperma line names the KJV's own renderings of G4690

Assigned: coordinator relay of the operator's word (03:24Z 11-19), register W3 9071 (owner W1), order 9077. Source: W1 8750 item 4 (optional addition to the ASK 408 line).

1. OBJECTIVE. The ASK 408 guard line defines sperma only from the lexicon ("SEED is sperma (G4690): 'something sown, i.e. seed (including the male "sperm"); by implication, offspring'"). After this ASK it also gives the 1611's own renderings of G4690, so the definition rests on the KJV as well as the lexicon (the operator's standing rule: the 1611 answers itself). Measured now in kjv_word_map: seed 40 rows (38 verses), seeds 3 (Matthew 13:32, Mark 4:31, Galatians 3:16), issue 1 (Matthew 22:25); 44 rows in 41 verses. Expected effect: one clause added to the text the Oracle receives; no code check, count, judge prompt or debater prompt changes.
CORRECTION of my 8750 item 4: I wrote "seed or issue in 44 places". It is 44 rows in 41 verses, and it leaves out "seeds".

2. ROLES. Planner and builder W1 (coordinator assignment). Graders W2 and W4. WORDING: the operator's (8750 said so; it is Oracle-facing prompt text). Write: W4, on the operator's card in W4's thread, which shows the exact clause.

3. SCOPE. One string in one node: Init with Guards (engine; live 06967796), the ASK 408 sentence. After "by implication, offspring'" the clause is added, proposed form:
"; the KJV renders it seed (40 times), seeds (3) and issue (1, Matthew 22:25), in 41 verses"
Nothing else in the sentence changes. Reach as ASK 408: GUARDHOLD, R.gt, Oracle only (ruling 383: only the Debate Oracle is bound by guards).
SEARCH (W1, live engine 06967796 and child e1f2b1c4): "SEED is sperma" occurs once, in Init with Guards; the child holds no copy; the Shared Library holds only the unrelated layer example "[L2] sperma, seed". Inline MAP: no copy.

4. CRITERIA and DONE.
- C1. The target differs from live only in that string of Init with Guards; the reasoning guard shows no model-setting change; ASK 385 PASS; lib_sha unchanged.
- C2. The clause's numbers equal a fresh SQL count on kjv_word_map for strongs_number G4690 at build time (rows by word, distinct verses), posted beside it.
- C3. The built Oracle guard text, rendered by running Init with Guards on one stored run's inputs, holds the clause once, in the ASK 408 sentence, and is otherwise byte-equal to live.
DONE when C1 to C3 pass, W1 and W2 read back live, and the engine manual's ASK 408 entry quotes the clause.

5. WRONG-IF. If the KJV rows are not all one word sense (for example if "issue" in Matthew 22:25 is not sperma in the 1611 text), the clause misstates the KJV. Check at step 1: read Matthew 22:25 in kjv_verses and confirm the word map row; read each "seeds" verse. Known-good: Romans 1:3 "seed" is G4690. Known-bad: Revelation 22:16 "offspring" is G1085, so it must not be counted (it is not in the 44).

6. RUN EVIDENCE. NO PROBE: the Oracle prompt text is not stored per run. The mark is read by hand from the first run's Oracle request if stored, else the engine fetch-back is the only evidence.

7. INPUTS IN GIT. This plan at a433_w1/plan_rev0.md. Build in a433_w1/ (target, the SQL counts, C3 render).

8. STEPS.
1. W1: step 1 checks (C2 counts, WRONG-IF reads); post the clause for the operator's wording ruling on the Wall and through the coordinator. (No card.)
2. W1: build on a fresh fetch-back with the clause the operator rules. (No card.)
3. W2 and W4 grade. (No card.)
4. W4 posts the write card in W4's thread with the exact clause. (Waits on the operator's card.)
5. W4 writes; W1 and W2 read back; W3 writes the manual line on the operator's card in W3's thread.
Order (9077): after ASK 429. ASK 429 does not touch Init with Guards.
