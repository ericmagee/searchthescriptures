# ASK 520 plan (W3, seat 33), rev 3, 2026-11-23. Replaces rev 2 (107725bf, kept as plan520_rev2.md) on W4's build finding (Wall 10477): S1 reads the presses of round 2 and round 3 (W4's variant B), and C2a and C5 say how Terra's count is shown. Rev 2 replaced rev 1 (48eef61f) on W2's C-e (Wall 10430). A PLAN ONLY; nothing is written.
Source: the operator's "Four Remaining Bugs in the Run (4) Debug Log", Bug 4, "K-UNX vs. Commitment 5 Friction on Sol 6.1" (13:10 CST 11-20, W4 thread), released by his "yes" at 02:02 CST 11-23 (Wall 10381). Run (4) is 41117; the basis is in the ASK 517 plan.
His words: "Sol 6.1 counted Defender Premises 4 and 5 as UNEXHIBITED under Commitment 5 (unanswered/unfitted pressed witnesses), and K-UNX flagged both as UNCURED ... because Sol 6.1's STATEMENT didn't name a missing initial layer (L1/L2/L3)." And: "Terra 6.1 yielded to K-UNX and changed Premises 1-5 to SUPPORTED (c=0), whereas Sol 6.1 and Sol 6.2 stood their ground on Commitment 5 (c=4). Clarifying in the K-UNX prompt that an UNEXHIBITED count grounded on an unanswered/unfitted PRESSED WITH witness (Commitment 5) does not require naming a missing L1-L3 layer will align Terra 6.1 with Sol 6.1 and Sol 6.2."
He prefaced the message "Feedback (only use if useful)", so the design is the team's.

## 1. OBJECTIVE
K-UNX is not raised on a counted premise when the judge's own ANSWER CHECK grades a press of that premise MISSES or FAILS. Under ruling 372, as the engine already reads it (pkgU72 rev 2), such an answer leaves the witness unanswered, so Commitment 5 counts the premise. A count that rests on it is correct. It need not name a missing layer.
The rule already holds on one K-UNX path (K-UNX-A path B, through unxAcFail). It is missing on the general path, which raised every item the operator names.
Design: the operator proposed a prompt clarification. This plan instead stops the detector raising the item at all. With the item never raised, no judge is asked to cure a correct count, and no judge can yield to it. A prompt clarification would still send the item and depend on each model's reading. The ask is met either way, and this way is the stronger of the two.
Expected effect on 41117:
- Sol 6.1's items on DEFENDER premises 4 and 5 are not raised. Its own ANSWER CHECK grades Matthew 1:20 [CR3] and Luke 1:35 [CR3] MISSES.
- Terra 6.1's items on premises whose presses its ANSWER CHECK grades MISSES are not raised: Matthew 1:25, Genesis 4:1, Matthew 1:19 and Luke 1:35 [CR3]. Terra's count then stays as Terra wrote it, as Sol's did.
- Any Terra item on a premise with no press graded MISSES or FAILS is still raised. The build lists which ones.
EXPECTED 41117 VALUES (W2 C-e), on 517's library (see STEPS for the build order). These come from reading the code, not from a run. An offline replay cannot ask Terra again, so it reuses Terra's logged cure replies.
- Terra's first count is DEFENDER 5 (premises 1 to 5). Its K-UNX items, mapped to the presses Sol 6.1 names for the same premises:
  - premise 1 (Matthew 1:25, Genesis 4:1, both MISSES) and premise 5 (Luke 1:35 MISSES): not raised under S1;
  - premise 2: raised on the K-UNX-A ASSUMES path, which S1 does not touch;
  - premises 3 and 4: still raised. Terra grades no press of premise 3 MISSES, and it has no [CR3] ANSWER CHECK for Matthew 1:20.
  The build confirms this mapping from the [CR3] PRESSED WITH list.
- Count: pkgRCT (rctOut) takes out only premises whose K-UNX item was cured by a CORRECTED COUNT. That leaves premises 1 and 5, so the expected DEFENDER count is 2.
- Standing: with L=6 and c=2, 2c is not more than L, so under 517 the standing is PROP-DEPENDENT -- L=6 c=2.
- If pkgD38 instead keeps Terra's CORRECTED COUNT 0 as the cure value, the count is 0 and the standing is SELF-SUPPORTED as in 517's C1. The build states which line decides, and shows it.
- COLLAPSED (c of 4 or more) is not expected. It would need premise 3 or 4 to keep its count, and both stay raised and cured.
- RESULT and outcome: unchanged, UNDERDETERMINED.
  - rd386 gives CHALLENGER WINS only on a SELF-SUPPORTED challenge, and Terra's challenge stays PROP-DEPENDENT -- L=6 c=1.
  - The defender is already PROP-DEPENDENT or COLLAPSED on Sol 6.1 and Sol 6.2. The 505 gate on the defender is therefore already met, and a weaker Terra standing adds nothing to it.
  - Any other value fails C2a unless the build shows the line that gives it.
- 517's C1 example: 517 C1 replays the live 41117 data, in which Terra's cures were asked and its count was cut to 0. It tests stand() given that count, so it still holds. 520 changes the count that reaches stand(), not stand() itself. After both are built, Terra on 41117 reads by its count (expected c=2), and that is 520's C2a value, not 517's.

CAUSE (debate_enforcer_log and debate_judgments, 41117):
- Sol 6.1, rows 48778 and 48779 (UNCURED):
  - Its count: "Premise 4: UNEXHIBITED (the conception-source witness Matthew 1:20 receives no fitting answer, Commitment 5); the block has [L1]-[L3], and the failure is responsive, not a missing initial layer."
  - Its ANSWER CHECK: "Matthew 1:20 -- [CR3] -- ... -- MISSES" and "Luke 1:35 -- [CR3] -- ... -- MISSES".
  - The cure check accepts only a named missing layer, the assumed-fact form, or a lower CORRECTED COUNT. It marked Sol's correct reply UNCURED.
- Terra 6.1, rows 48749 to 48753: it accepted all five and wrote CORRECTED COUNT 0. Its ANSWER CHECK grades Matthew 1:25, Genesis 4:1, Matthew 1:19 and Luke 1:35 [CR3] MISSES.
- Library L479 to L482 (the general K-UNX path) skips a count only for a named missing layer (unxNamed) or a press whose MEANS the block does not quote (unxMeansGround). Here the block quotes the MEANS and the judge grades the answer MISSES. No skip applies.
- L453 unxAcFail(TX,ref,RK) already reads the judge's own ANSWER CHECK. It is true when a line for that reference and round tag grades MISSES or FAILS and none grades MEETS. Its comment: "under ruling 372 an answer the judge's own ANSWER CHECK grades MISSES or FAILS leaves the witness unanswered, so K-UNX-A path B does not ask to drop that count". It is used only in unxaCheck (L460).

## 2. ROLES
- Planner: W3 (seat 33).
- Builder: W4 (seat 35), per Wall 10381.
- Grader: one non-builder seat (op doc v139).
- Write card: W4's thread. The engine manual entry is W3's, on a card in W3's thread.

## 3. SCOPE, with SEARCH
SEARCH:
- Read: live engine moMxiV4Irg1uRBZN and child MqQHRl7mQQ0z8QdT on 516b (ask517/w4/live516b_*.json). Their libraries are equal, 3560 lines.
- Searched for: K-UNX, UNEXHIBITED, unxAcFail, unxPresses, unxMeansGround and "Commitment 5", in the library and in every node.
- Read also: the K-UNX cure rows of 41024, 41043, 41090, 41102 and 41117.

HITS:
- L463 to L482: the K-UNX detector, with three paths:
  - RANGE (L467);
  - K-UNX-A, through unxaCheck, which already applies unxAcFail (L460);
  - the "saying the block lacks" path (L474 to L478);
  - the general path (L479 to L482).
- L453: unxAcFail (W2 counts it as L452). An identical copy sits at L3461 (W2: L3460). S1 calls the one in scope at L479; neither copy changes.
- L1220 to L1230: the K-UNX cure checks. Unchanged.
- Commitment 5 text, in Panel Build, Reserve Build, the Accept nodes and Enforcer Build: "A proven press ... left unanswered by the later rounds of the side that holds the link, makes that premise UNEXHIBITED." Unchanged.
- C3 Build and C3G Build tell the debater: "an answer that names the verse but does not meet the MEANS is graded MISSES, and the premise is counted against you" (ruling 412). Unchanged.
- Readers of K-UNX items, all unchanged in code:
  - L1271: a CURED K-UNX with "CORRECTED COUNT n takes" feeds the count.
  - L1385, rctOut: pkgRCT, the recount after cure.
  - L1528 to L1531: pkgD38, a count from the cure is fixed.
  - L1747: the K-UNX source label.
- K-UNX counts on 41117 (kind cure): 8 items. 6 of them were raised on the general path, 2 were UNCURED, and 5 were cured by CORRECTED COUNT. On 41102 it is 3 items (1 general); on 41090, 9 items (4 general); on 41024, 2 items (0 general); on 41043, none.

CHANGE:
- S1. L479, the general path: before the item is pushed, add one more skip. If any press p of premise j (PR.filter(p=>p.n===j)) has unxAcFail(text,p.ref,rk) true, continue. The press need not be named in the count. Under ruling 372, one unanswered proven press makes the premise UNEXHIBITED, so the count is right on that press alone.
  - Rev 3 (W4 10477): the presses are read from round 2 and round 3 of the pressing side: [...PR, ...unxPresses(side==='CHALLENGER'?R.CR2:R.DR2)]. As rev 2 wrote it, PR read R.DR3 alone for DEFENDER premises, and on 41117 R.DR3 has no UNSUPPORTED [L4] PREMISES list, so S1 dropped nothing there. The intent was always "the presses of premise j", wherever the side's list states them. The round tag that unxAcFail reads (rk) is unchanged.
- S2. Engine manual: the K-UNX row gains this sentence: "Not raised on a premise whose press the judge's own ANSWER CHECK grades MISSES or FAILS (Commitment 5, ruling 372; ASK 520)."
- Not changed:
  - the other K-UNX paths;
  - the cure text and the cure checks;
  - Commitment 5 and the judges' prompts;
  - unxAcFail itself.

## 4. CRITERIA and DONE
- C1: the library stays at 3560 lines, with engine and child equal. Only L479 changes. A diff is shown.
- C2: on the five runs, the built detector runs on each judge's stored pre-cure text and rounds. Its K-UNX items are listed against today's. For every dropped item, the build shows the press of that premise and the judge's ANSWER CHECK line that grades it MISSES or FAILS.
- C2a (readers): the build replays L1271, pkgRCT (rctOut), pkgD38 and Derive Outcome with the dropped items removed. It lists every count, standing, RESULT and outcome that changes. Each change must follow from the judge's own count standing, unasked. Expected on 41117: Terra's DEFENDER count is no longer cut to 0 by its K-UNX cures.
  - Rev 3: an offline replay reuses each judge's logged cure replies, and it cannot ask a judge again. Terra's one logged CORRECTED COUNT DEFENDER 0 still answers its kept items, so the replay shows Terra at c=0 (W4 10477). C2a therefore stands on three things: (i) the item list (C2); (ii) a replay of the readers with the logged replies, showing no outcome change and no change other than the dropped items; and (iii) C5 for Terra's count. The expected c=2 is not required offline. Under 517's library, the replay's standing reads by its count (SELF-SUPPORTED at c=0).
- C3, known-bad: on 41117, Sol 6.1's DEFENDER premises 4 and 5 are not raised.
- C4, known-good: an item on a premise with no press graded MISSES or FAILS by that judge is still raised. Take Sol 6.1's premise 2 (row 48777, the "saying the block lacks" path, which is untouched) and any general-path item that C2 keeps. Each is shown.
- C5: one live run, on the operator's word. No K-UNX item is raised on a premise whose press that judge's ANSWER CHECK grades MISSES or FAILS. On a run where a judge counts premises on presses it grades MISSES, the report gives that judge's count, standing and RESULT after cure, as the live evidence for C2a (iii).
- DONE: C1 to C5 pass, and the manual entry is written and read back.

## 5. WRONG-IF
This plan is wrong if C2 drops an item on a premise where that judge grades no press of it MISSES or FAILS. Any such case fails it.
- Known-bad: 41117 Sol 6.1 premises 4 and 5 must drop.
- Known-good: Sol 6.1 premise 2 (row 48777) must stay raised.
Limit: unxAcFail reads the grade, not whether the press was proven. Commitment 5 counts only a proven press. A judge that grades an unproven press MISSES would no longer be asked by K-UNX. The same limit already holds on K-UNX-A path B (pkgU72 rev 2). K-P (L2165), the ruling 398 guard, and the judges' own UNPROVEN grades still read proof (W2 10430).

## 6. RUN EVIDENCE
NO PROBE in the ASK 417 registry (no registry table was found, W4 10395). C5 is read from the run's K-UNX cure rows and ANSWER CHECK lines.

## 7. INPUTS IN GIT
This plan's commit is on the Wall post. W4 commits the replay script, its inputs and the item lists at build.

## 8. STEPS
1. One non-builder seat grades this plan. Waits on: nothing.
2. W4 builds S1 (rev 3, variant B, patch520b.py 4179932f) and runs C1 to C4. The write target is rebased on 517's written library. Waits on: step 1, 517's build, and W4's queue (519).
3. Grade of the build. Waits on: step 2.
4. W4 writes on the operator's card in W4's thread. BUILD ORDER: 517 is written first, and 520 is built and replayed on 517's written library. 520 changes only L479, which 517 does not touch, so neither plan's lines move. 517 needs no change. Waits on: step 3, and 517 written.
5. W3 writes S2 after a read, on the operator's card in W3's thread. Waits on: step 4.
6. A run on the operator's word (C5). Waits on: step 4.
