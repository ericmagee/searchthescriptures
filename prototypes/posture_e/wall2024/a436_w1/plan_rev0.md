# ASK 436 plan rev 0 (W1): the gloss check's KJV renderings list shows the most-used renderings and says when it is cut

Assigned: coordinator relay of the operator's word (03:24Z 11-19), register W3 9071 (owner W1), order 9077.

1. OBJECTIVE. When the ASK 340 Part B gloss check writes a gloss NOT IN THE KJV RENDERINGS or LEXICON WORDING, the renderings it shows are the number's most-used KJV words, not the first 24 in alphabetical order, and a cut list says how many words it leaves out. Today the list is `[...R0.W].sort().slice(0,24)`: for H1121 (58 renderings, W1 SQL on kjv_word_map with the node's own word fold) it shows "a, age, also, and, ... daughters, father" and never "son" (1,898 rows), "children" (1,542) or "sons" (1,033), with no sign that it was cut (W4 8395 B2). Expected effect: on stored runs, the shown list changes only on rows of numbers with more than 24 renderings (count stated at step 1); no status, tag, count or judge line changes.
CORRECTION to the register line (9071, "no rendering a judge needs is cut"): the list reaches no judge. e340.gloss is read only by Build Save Body (AUDIT v57, the record) and Format Markdown (the report). The 8395 H1121 case was a FOUND row, whose list is not printed. The list is printed only on NOT IN THE KJV RENDERINGS rows (record and report) and LEXICON WORDING rows (report). So this ASK fixes what a reader of the record and the report sees.

2. ROLES. Planner and builder W1 (coordinator assignment). Graders W2 and W4. Write: W4, on the operator's card in W4's thread.

3. SCOPE. L2 Count Plan (engine; live 06967796), two lines:
- line 157, the REN build: beside the word set W, keep a count per word (rows of that number giving that KJV word). The set W and the phrase set PH are unchanged, so the matcher is unchanged.
- line 167: kjv becomes the words ordered by count (high first, then alphabetical), first 24, and, when more exist, one last entry "and N more". 24 is kept.
Not in scope: the matcher (ASK 430), the 60 and 30 caps (ASK 432), __GLOSS (ASK 431), Build Save Body and Format Markdown (they print x.kjv as given, joined by ", ").
SEARCH (W1, on live engine 06967796 and child e1f2b1c4): "slice(0,24)" is only in L2 Count Plan. x.kjv is read only by Build Save Body and Format Markdown; the Shared Library's one ".kjv" hit is K-KJV's quote field (x.kjv in kkjvCure), a different object. The child holds no L2 Count Plan. Inline MAP: no copy.

4. CRITERIA and DONE.
- C1. The target differs from live only in those two lines of L2 Count Plan (guard: no model-setting change; ASK 385 PASS; lib_sha unchanged).
- C2. Replay of the L2 chain on the stored ODV1 runs (a405_w4/chain.cjs), live against target: every e340 field except gloss[].kjv is equal; tags, e340.eng and __GLOSS are equal; the AUDIT v57 and report text differ only inside "(KJV renders: ...)" and "(...)" lists.
- C3. For every changed list: the same words when the number has 24 or fewer renderings (order may change); else the 24 most-used, with "and N more" where N = renderings minus 24. H1121, if a stored row prints it, shows "son" and "sons". Count of changed lists above zero, or the plan states none is printed in the stored runs and shows the H1121 case on a planted row.
DONE when C1 to C3 pass, W1 and W2 read back live (rbx 0 diffs), and the engine manual's ASK 340 line names the order and the "and N more" entry.

5. WRONG-IF. If any reader parses the kjv list as a set of KJV words (the "and N more" entry would then read as a word), the plan is wrong. Check at step 1: the two readers only join and print it (search above); a planted "and 3 more" row is printed as text in both. Known-good: H1121 shows son first. Known-bad plant: a number with 30 renderings where the 25th by count is the gloss word must show "and 6 more", not the word.

6. RUN EVIDENCE. NO PROBE in SQL for the order; the mark is read by hand: the first run whose AUDIT v57 PART B lists a NOT IN THE KJV RENDERINGS row of a number with more than 24 renderings shows "and N more".

7. INPUTS IN GIT. This plan at a436_w1/plan_rev0.md. Build and measure in a436_w1/ (patch, target, replay outputs, the changed-list file).

8. STEPS.
1. W1: patch and replay; post C1 to C3. (No card.)
2. W2 and W4 grade. (No card.)
3. W4 posts the write card in W4's thread; one card may carry ASK 430 and 436 together, since both change L2 Count Plan only (ASK 412 stacking: 436 built on 430's target). (Waits on the operator's card.)
4. W4 writes; W1 and W2 read back; W3 writes the manual lines on the operator's card in W3's thread.
Order (9077): after ASK 429, which does not touch L2 Count Plan.
