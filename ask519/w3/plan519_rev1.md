# ASK 519 plan (W3, seat 33), rev 1, 2026-11-23. A PLAN ONLY; nothing is written.
Source: the operator's "Four Remaining Bugs in the Run (4) Debug Log", Bug 3 (13:10 CST 11-20, W4 thread), released by his "yes" at 02:02 CST 11-23 (Wall 10381). Run (4) is 41117 (basis in the ASK 517 plan).
His words: "every single one triggered by Sonnet saying \"I grant...\" on uncontested facts ... Every judge had to burn 16-18 cure blocks writing NOT HELD / TOUCHES NO LINK. Scoping the K-W / K-S3 detector to only fire when a grant/withdrawal targets a declared link ID (D1-D4 / C1-C6) or Premise number will drop your violation count from 63 down to ~11." He prefaced the message "Feedback (only use if useful)", so the design is the team's.

## 1. OBJECTIVE
K-W and K-S3 are raised only on a sentence that can give up a side's own footing. That is a withdrawal-class sentence (withdraw, drop, retract, give up, do not or no longer claim, do not or no longer rest), or a grant-class sentence (grant, concede, admit, accept that, agree that) that names a link, premise or press of the record (D<n>, C<n>, LINK <n>, premise <n>, P<n>.<m>). A grant-class sentence that names none of these is not raised.
Expected effect, measured on the cure log: K-W and K-S3 cure items fall from 51 to about 13 on 41117. On the five runs, no item whose cure was anything other than NOT HELD or TOUCHES NO LINK is dropped.

THE COUNT (debate_enforcer_log, kind cure, five runs; a "grant" is grant-class without a withdrawal verb; "named" means the sentence names an id as above; "real" means the reply was not NOT HELD or TOUCHES NO LINK):

| run | rule | items | withdrawal-class | grant, named | grant, none named (dropped) | real among dropped |
|---|---|---|---|---|---|---|
| 41117 | K-W | 36 | 6 | 6 | 24 | 0 |
| 41117 | K-S3 | 15 | 0 | 0 | 14 | 0 |
| 41102 | K-W | 55 | 5 | 10 | 40 | 0 |
| 41102 | K-S3 | 15 | 0 | 2 | 11 | 0 |
| 41043 | K-W | 45 | 15 | 0 | 30 | 0 |
| 41043 | K-S3 | 27 | 3 | 3 | 19 | 0 |
| 41024 | K-W | 36 | 6 | 0 | 30 | 0 |
| 41024 | K-S3 | 10 | 0 | 0 | 6 | 0 |
| 41090 | K-S3 | 9 | 2 | 0 | 4 | 0 |

This was measured with SQL regexes on the logged lines. The build re-measures it with the built code (C2).

## 2. ROLES
- Planner: W3 (seat 33).
- Builder: W4 (seat 35), per Wall 10381, after 516b and 502 A1.
- Graders: W1 and W2, per Wall 10381. Under op doc v139, one non-builder grade suffices.
- Write card: W4's thread. The engine manual entry is W3's, on a card in W3's thread.

## 3. SCOPE, with SEARCH
SEARCH:
- Read: live engine and child, W4's 07:53Z fetches (ask516/w4/b/live_*.json). Their libraries are equal, 3560 lines. Also read: SX4ZWtgHNs96uBOo and c7366RPLb8vdMQg6.
- Searched for: rule:'K-W', rule:'K-S3', orcLines and kwLines421.

HITS:
- L2209 to L2215, kwLines421: the main K-W reader. RX finds "I (grant|concede|admit|accept that|agree that|withdraw|drop|retract|give up|do not claim|no longer claim|do not rest|no longer rest)" in [CR2] to [CR4] and [DR2] to [DR4]. Grant-only sentences that name no link are already capped at 10 per side (pg, gn).
- L2217 to L2237, wpLines2024: a withdrawn premise asserted again. Withdrawal-class only. Unchanged.
- L710, orcLines, and L792, the K-S3 push: one K-S3 item per line of the judge's OUT-OF-ROUND CONCESSIONS section that does not end COUNTED.
- L3235 and L3236: the enforcer RULES for K-W and K-S3. Unchanged.
- Engine manual v231: the K-W and K-S3 rows. They gain one sentence each.
- Child: the same library. The two other workflows: no hit.

CHANGE:
- S1. In kwLines421, a match whose verb is grant-class (grant, concede, admit, accept that, agree that) is skipped unless its sentence s names an id. The test is /\b(?:[DC][1-9]\d*|LINK\s*\d+|[Pp]remise\s*\d+|P\d+\.\d+)\b/. Withdrawal-class matches are unchanged. The skip replaces the pg cap (gn) for grant-class matches, and "n" still counts every match, as today.
- S2. In the K-S3 push at L792, a line from orcLines whose sentence is grant-class, with no withdrawal-class verb, is skipped unless it names an id by the same test. Lines of neither class stay raised, as today.
- S3. Manual rows K-W and K-S3: "Not raised on a grant-class sentence that names no link, premise or press (ASK 519)."
- Not changed: the RULES text, the cure forms, wpLines2024, K-CON, K-CMT, and the judge's prompts.

## 4. CRITERIA and DONE
- C1: the library stays at 3560 lines, with engine and child equal. Only L2212 to L2213 (the kwLines421 match loop) and L792 change.
- C2: the built detectors run on the stored judge texts and rounds of the five runs. The K-W and K-S3 items they raise are listed against today's. Every dropped item is grant-class and names no id. None of them had a real reply, judged by the logged replies, as in the table.
- C3, known-good: on 41117, the 6 withdrawal-class K-W items, among them "[DR3] LINK 6: I drop the clause 'and it names no man as sowing it'" (replied STANDS WITHOUT IT), and the 6 named grant items are still raised.
- C4: one live run on the operator's word. No K-W or K-S3 item is raised on a grant-class sentence that names no id, and the count is reported next to 41117's 51.
- DONE: C1 to C4 pass, and the manual entry is written and read back.

## 5. WRONG-IF
This plan is wrong if C2 drops any item whose logged reply was CONCEDED, COUNTED, STANDS WITHOUT IT or REASSERTED. Any such case fails it.
- Known-bad: 41117 "[DR3] LINK 6: I drop the clause ..." must stay raised.
- Known-good: 41117 "[DR3] LINK 5: I grant the order." must drop.
Limit: a grant that gives up footing without naming an id would no longer be asked. None did in the five runs (the table's last column), but that is not proof it never happens. The judge's own CONCEDED LINKS count and the K-G rules still read concessions.

## 6. RUN EVIDENCE
NO PROBE in the ASK 417 registry (no registry table was found, W4 10395). C4 is read from the run's K-W and K-S3 cure rows.

## 7. INPUTS IN GIT
This plan's commit is on the Wall post. W4 commits the replay script, its inputs and the item lists at build.

## 8. STEPS
1. W1 or W2 grades this plan. Waits on: nothing.
2. W4 builds S1 and S2, and runs C1 to C3. Waits on: step 1, and W4's 516b and 502 A1.
3. Grade of the build. Waits on: step 2.
4. W4 writes on the operator's card in W4's thread. Waits on: step 3.
5. W3 writes S3 after a read, on the operator's card in W3's thread. Waits on: step 4.
6. A run on the operator's word (C4). Waits on: step 4.
