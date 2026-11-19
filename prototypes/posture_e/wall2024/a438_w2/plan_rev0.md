# ASK 438 plan rev 0 (W2): raise the Part B gloss caps in L2 Gloss Plan

## 1. OBJECTIVE
No gloss and no gloss number is cut by a cap in Part B of the ASK 340 gloss check on any stored run. ASK 432 (Wall 9100, a432_w2) measured on 240 stored runs: the 60-gloss cap cut 2,746 glosses in 71 runs; the 30-number cap left 277 gloss parts NO ANSWER "not read" in 51 runs; the ASK 406 new-form test cut 1,037 glosses in 89 runs. After this ASK, the same replay shows 0 in each. Run 37510 is the largest case: 199 of today's glosses (139 cut), 73 numbers if nothing is cut.

## 2. ROLES
Planner and builder: W2 (coordinator 03:37Z: "Number the raise as ASK 438"). Graders: W1 and W3. Write: W4, on the operator's card in W4's thread. Manual entry: W3.

## 3. SCOPE with SEARCH
Change: engine node L2 Gloss Plan only (live 2d40e6ad), 3 places:
a. `const G=gl.slice(0,60)` becomes 250.
b. The ASK 406 add test: `G.length<60` becomes 250 and `.slice(0,30)` becomes 100.
c. The renderings read: `[...new Set(__G340.gloss.flatMap(g=>g.nums))].slice(0,30)` becomes 100.
The caps are written once as constants (GLOSS_CAP=250, NUM_CAP=100) at the top of __G340 so the three places cannot drift.
Not changed: the 40-candidate cap (`cand ... slice(0,40)`) and countsUrl's 40. They are Part A: Part A's English set-aside (e340.eng) is read by the round builders (C1..D4 Build and Extract) and so reaches the models; the cap cut 2 words in 1 run of 240. Raising it would be model-facing and is left out. The 24-rendering list is ASK 436.
SEARCH (my fetch of live 2d40e6ad):
- e340 is read by the round builders only through check(), which reads e340.eng (Part A), never e340.gloss.
- e340.gloss (Part B) is read by Build Save Body (the AUDIT v57 line) and Format Markdown (the run report section "[L2] English words and glosses"). Neither is sent to a model. So the change is record-only, as the engine manual ASK 406 entry states ("Reach: record-only").
- L2 Count Plan reads the rendering pages for whatever numbers L2 Gloss Plan planned; it has no 30 or 60 cap of its own on Part B (its caps are text-length slices and the 24-rendering list).
- L2 Gloss Pages Plan pages each number's rendering read; more numbers means more pages, no cap change there.

## 4. CRITERIA and DONE
C1. Diff confined to L2 Gloss Plan, the 3 places plus the 2 constants; ASK 385 check PASS; reasoning guard clean; connections equal; library untouched.
C2. Replay (a432_w2/m432.cjs pointed at the target, same 240 runs): 0 glosses cut by the gloss cap, 0 numbers beyond the number cap, 0 ASK 406 new-form glosses cut; today's glosses and their order unchanged at the head of the list; tags, the judges' __GLOSS line and Part A (cand, eng) identical on all 240 runs.
C3. Cost: the extra rendering reads per run, from the replay (worst run 37510: 73 numbers against 30, so up to 43 more reads plus their pages). Each read has the node's 30 s timeout; the time per read is taken from the stored execution of a recent run and the worst-case added time stated on the card.
C4. A replay of L2 Count Plan on run 37510 and 2 other cut runs: the new e340.gloss rows are listed by status (FOUND, LEXICON WORDING, NOT IN THE KJV RENDERINGS, NO ANSWER), and every pre-existing row is unchanged.
C5. rbx 0 diffs after the write, two readbacks.
DONE: C1 to C5 hold, the manual entry is written, and the ASK 417 entry is registered.

## 5. WRONG-IF
a. Any model-facing text changes (tags, __GLOSS, Part A, any round-builder input).
b. Any of today's existing e340.gloss rows changes or moves.
c. A cut remains on any stored run.
d. The worst-case added read time on the card exceeds the L2 chain's room in the workflow (stated against the stored execution's total time).

## 6. RUN EVIDENCE
ASK 417 entry. Case: a run whose gloss list exceeds 60 glosses or 30 numbers (before the raise, 97 of 240 stored runs; none of the last 8, so the case may not occur soon). Mark: that run's AUDIT v57 line shows "0 left out by the caps" and more than 60 glosses read (or more than 30 numbers). NOT EXERCISED if the run has no case.

## 7. INPUTS IN GIT
a432_w2 (m432.cjs, rp.cjs, shim.cjs, m432_out.txt; the dumps it names are not committed for size). The build adds build438.cjs, the target, and the C2 to C4 outputs.

## 8. STEPS
1. W1 and W3 grade this plan.
2. W2 builds on a fresh fetch of live, runs C1 to C4, posts the build.
3. W1 and W3 grade the build.
4. W4 posts the card in W4's thread and writes on the operator's press; two readbacks (C5).
5. W3 writes the manual entry (the ASK 406 limits line "the caps are unchanged" is replaced); W2 adds the ASK 417 entry.
