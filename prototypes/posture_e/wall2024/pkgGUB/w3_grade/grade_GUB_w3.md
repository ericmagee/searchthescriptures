# GRADE (W3): pkgGUB (W2) rebased on pkgGCCN rev 3: FAIL, narrow (one form, two directions)

Candidate graded: /mnt/project-files/wall2024/parent_s110_GUB_on_GCCN3.json (W2 commit 59054865). The first candidate (on rev 2, commit 8ba44bbc) gave the same results in every case.
Labels: pkgGUB/w3_grade/labels_GUB_w3.md, commit a4163ef3, before any run of either candidate. Script w3_gub.cjs; outputs w3_gub_out.txt (on rev 2), w3_gub_on3_out.txt and w3_gub_on3_k_out.txt (on rev 3).
Method: my chain replay of the dry regrade of debate 34108 on s110 (Panel Cure Check to Replay Rows), read at the written rows. Plant: a counted pkgUND line for luna naming S10 added at the Send Back Record output with her count raised by one; the stored gate reply's G1 line replaced per case. Three files per case: s110, pkgGCCN rev 3, the candidate.

## Size and scope (measured)
- +1,719 code against s110; +984 over pkgGCCN rev 3. Code that differs: Shared Library +1,575, Gate Record, Alt Gate Record, R2 Alt Gate Record +48 each. No prompt text.
- Every other library node rebuilds to the same full source as on rev 3. Connections equal, non-code parameters equal, 418 nodes.
- What the +984 buys in the three gate nodes: the existing send-back rule (pkgECL and pkgUND text already in the library) is now also loaded into them, 86 more source lines each when rebuilt.

## Results at the written row (luna's count; s110 / rev 3 / candidate)
| Case | s110 | rev 3 | candidate | label | |
|---|---|---|---|---|---|
| no plant: rows equal s110 | 2 | 2 | 2 | equal | OK |
| a. new UNDERDETERMINED line, [L1] stands, states what is open | 3 | 2 | 2 | 2 | OK |
| b. [L1] words not in the verse | 3 | 2 | 3 | 3 | OK |
| c. nothing said of what is left open | 3 | 2 | 3 | 3 | OK |
| d. only an [L3] | 3 | 2 | 3 | 3 | OK |
| e. STANDS regrade with [L1] and the answer's words | 3 | 2 | 2 | 2 | OK |
| f. STANDS regrade with no quote of the answer | 3 | 2 | 3 | 3 | OK |
| g. straight quotation marks, as a | 3 | 2 | 2 | 2 | OK |
| h. counted by pkgECF (v41), failing new line (the stated limit) | 3 | 2 | 2 | 2 | OK |
| i1. pkgUND line for another seat | 3 | 3 | 3 | 3 | OK |
| i2. pkgUND line naming S1, gate item S10 | 3 | 3 | 3 | 3 | OK |
| m1. E-UNG item, graded line passes | 3 | 2 | 2 | 2 | OK |
| m2. E-UNG item, no counted [L1] | 3 | 2 | 3 | 3 | OK |
| j. [L1] of a verse the run did not read | 3 | 2 | 2 | recorded | as the send-back rule (counted as given) |
| l. verse rows not available, good line | 3 | 2 | 2 | recorded | as j |
| l2. verse rows not available, failing line c | 3 | 2 | 3 | 3 | OK |
| k1. G1's own answer FAILS the rule, the judge's later applied gate change G2 on the same line PASSES it | 3 | 2 | 3 | 2 | FAIL |
| k2. G1's own answer PASSES, the later applied G2 on the same line FAILS it | 3 | 2 | 2 | 3 | FAIL |

## The finding (k1, k2)
When the gate cures G1 with "the later gate change G2 of this judge rewrote the same line (the last change wins) and was applied", the candidate runs the send-back rule on G1's own answer, which is not the line in effect. The written row holds G2's line in both plants (shown in w3_gub_on3_k_out.txt).
- k2 is the form the package was built to close: the count comes off (3 to 2, with the "comes off" mark) while the line in the row is "UNDERDETERMINED -- Joseph acted as a just man.", which fails the rule.
- k1 is the other direction: the line in the row passes the rule and the count stays.
Stored cases: by W1's measurement (Wall 4281) the later-change form occurs in 10 gate items of 2 judgments, none with a counted send-back, so 0 stored cases would change. I did not repeat that scan. The plant is W4's superseded-line route (Wall 4283).
Closing condition: when the cure is by a later gate change, run the rule on that later change's line (the line in effect), not on the item's own answer.

## Other points
- Enforcer log rows: the gate rows are equal between rev 3 and the candidate in every plant, so no rolled-back insert is owed.
- Same rule, same sources (by reading): the recheck calls the same function Send Back Record calls, with verse rows from the same three nodes and the same filters.
- A recheck that throws returns "not cured" and the count stays, with nothing in the row saying the recheck could not run. Not reached by a plant of mine (empty verse rows do not throw; they read as j). Stated as a limit.
- NOT REACHED: Alt Gate Record and R2 Alt Gate Record (the alternate is not seated in the stored run). Their rebuilt sources carry the same added lines.
- Not judged here: whether +984 is worth one rule's recheck (the other seven counting rules keep rev 3's behaviour); that is the operator's call with the measured size.
