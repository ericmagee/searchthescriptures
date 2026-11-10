# W3 labels for pkgGCP rev 1 (W1, Wall 4298, commit f2a098b2). Committed BEFORE any run of the candidate.
Candidate /mnt/project-files/wall2024/parent_s111_GCP.json; baseline live s111 (fetchback_live_s111.json).
Method: my chain replay of execution 34626 (code nodes Panel Cure Check to Replay Rows), stored model replies REMAPPED to the s111 item numbers (pkgKSR/w3_grade/w3_KSR_ECB.cjs remap, gremap), because on s111 the engine's break lines are withheld and the stored replies answer the s110 numbers. One chain run per process. Read at the written rows (Replay Rows) and at Gate Record's output. Plants are counted cure report lines in the REAL stored form ("...; WHY: ...; LINE: ...; STATEMENT: ...; JUDGE STATEMENT: ...]"), added to a seat's judgment after Panel Cure Check with drv_uncured +1 unless said.
"base" = the seat's count on live s111 with the same plant. "off" = candidate count is base minus 1 and one v52 mark on the row. "stays" = candidate count equals base and no mark.

L0 no plant: every written row of the candidate equals live s111. A difference is a FAIL.
P1 LIVE rule raised by the re-read (K-B or K-G4 as the diagnosis of the stored text allows) on a pair whose collision line an applied SEND-BACK change replaced; raised before, not after: off.
P2 as P1, but the applied change's new line still breaks the same rule on the same pair: stays.
P3 as P1 with the real silence form "WHY: no written response": stays.
P4 as P1 with rule K-RUL in the real TRIAL silence form ("TRIAL rule, NO WRITTEN RESPONSE: counts in drv_uncured like a LIVE item (silence count): no written response"), drv +1: stays.
P5 as P1 with "NOT COUNTED (K-C UNCURED)" (rule K-C, drv +0): stays, count never below base.
P6 as P1, but the report's LINE is the line of another pair that no change replaced: stays.
P7 as P1 on a pair whose send-back change was NOT applied (refused, KEEP, or withheld): stays.
P8 as P1 on a pair whose line was replaced by an applied GATE change (not by a send-back change): off.
P9 the same report line is written inside the judge's own text (inside the JSON reasoning, not as an engine audit line), drv +0: stays; a judge must not be able to take a count off by writing the line. A count below base is a FAIL.
P10 as P1, but the applied change is rewritten so the new line no longer grades the pair at all (the pair label is destroyed): the seat's total must not fall below base unless the engine counts a new item for the lost line. Net forgiveness of a line that was destroyed, not corrected, is a FAIL.
P11 two counted lines, two different LIVE rules, same pair, both raised before and neither after: two off, two marks.
P12 two counted lines, one meets P1 and one meets P2: one off.
P13 P1 with the gate skipped (Gate Build forced to gate_skip): off.
P14 P1 on a seat with count 0 on live (terra or sol, as the stored text allows): planted 1, written 0; record whether the seat's removal changes (expected: no removal on the planted count).
P15 a report line whose SEAT is another seat, placed in luna's judgment: record-only (cannot occur in a real row).
P16 K-F in the real form (LINE = the judge's FORCED line), collision line changed by an applied change so that K-F is no longer raised, FORCED line itself not replaced: record-only; by the rule as written (a) fails and the count stays. I report whether this leaves the stored 33490 K-F rows uncovered.
P17 P1 together with a counted send-back line (v42) on the same item that the gate cures by an applied change (pkgGCCN): record the total; each count comes off at most once.
Rows written to debate_enforcer_log: if any gate or send-back row differs from live in any case, a rolled-back insert through record_enforcer_log is owed.
NOT REACHABLE by me on stored text: the alternate and round 2 alternate Gate Record copies with a real alternate reply; stored runs 33371 and 33490 (no execution export). I read the code of the three nodes for equality of the call instead.
Size: I measure the candidate against the s111 fetch-back myself.

## Addendum, committed before the runs it names (after the first round of runs on rev 1b, commit 7e67b74a, which is the build on file; rev 1 f2a098b2 was replaced by W1 before my first run)
Four of my first plants did not meet their own condition and are redone; the labels are the same:
P6r the report LINE is the D6 vs C5 line, which no change replaces (in P6 I named the D3 vs C1 line, which a gate change does replace): stays.
P7r S11 and S9 both answered KEEP, so no change replaces the D5 vs C4 line (in P7 the applied S9 replaced it): stays.
P10c S11 renames the pair and S9 is KEEP (in P10 the applied S9 wrote a good line): stays, or a new counted item appears; no net forgiveness.
P14r the plant is made from the send-back item's own line on a seat with count 0 (P14's line was not found raised): planted 1, written 0; and the seat must not be removed on it (I read alt_needed and the Alternate Build output).
P16b the judge text gets a BROKEN D5 vs C4 line with a FORCED line whose MEANS quotation is not in the round; the report is K-F with LINE = that FORCED line; S11 changes the collision line. Record-only (by the rule as written the FORCED line is not replaced, so stays).
New:
P20 K-S3 in the real form (ITEM "S3 DEFENDER CR4: #1", LINE "DEFENDER CR4: <sentence>"), and an applied change that ends the judge's own out-of-round line with COUNTED: by the stated rule (raised before, replaced, not raised after) off. If it stays, K-S3 is not covered and I report it as a missed form, with the reason.
P19 K-S3 report for the LAST numbered item, its line replaced by an applied change that does not cure it, while another K-S3 line is cured (the engine numbers K-S3 items by position, so the last number disappears): stays. Off is a FAIL.
P14a removal check: any seat whose only count is a planted cure count that pkgGCP takes off must end with count 0 and must not be replaced by an alternate because of it.
