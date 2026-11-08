# pkgRTB family 2: RETRACTED (D50 step 2; W2, 11-08). Design, posted before building (W3 3167).

## What the cure reader requires (library cureVerdicts / cureReasoned, strip_RTB)
A cure RETRACTED is CURED only when BOTH hold:
1. the reply has exactly ONE `CORRECTED RESULT: <tag>` line (else UNCURED "RETRACTED without exactly one CORRECTED RESULT line");
2. a reason for the pair names a round ([CRn]/[DRn]) AND quotes at least 3 words or cites a verse, on the RETRACTED line after " -- ",
   on a STATEMENT, in prose, or on a RESPONSE (else UNCURED "RETRACTED with no reason naming the round and its words or verse (rulings 105)").

## What the judges are told (10 ask variants, each in 26 library nodes, plus the CURE_FORM line)
| Ask text | RESULT rule | reason rule |
|---|---|---|
| CURE_FORM: `RETRACTED: D<n> vs C<m>` | no | no |
| "with RETRACTED for it and one CORRECTED RESULT" | yes | no |
| K-L2 "cure it with RETRACTED for the line and one CORRECTED RESULT" | yes | no |
| "It is then cured by RETRACTED or ... one FORCED line" | no | no |
| "Cure it with RETRACTED for that line and one CORRECTED RESULT, the reason naming the round and the verse" | yes | yes |
| K-C "or a RETRACTED line with one CORRECTED RESULT" | yes | no |
| K-G1 "or RETRACTED and one CORRECTED RESULT" | yes | no |
| "or RETRACTED the link, or RESTATED it" (30 nodes) | no | no |
| "or with RETRACTED for that link" | no | no |
| "with one RETRACTED line for each BROKEN link of that side" | no | no |
| "cure it with RETRACTED: D<n> vs C<m> and exactly one CORRECTED RESULT line" | yes | no |

Only one of eleven copies states both rules. The log shows the cost: 11 items UNCURED "RETRACTED with no reason" (K-F, K-G3, K-G4;
33299-33490) and 6 UNCURED "without exactly one CORRECTED RESULT" (K-B, K-G4; 32905-33014).

## Change
- Table row RETRACTED (cure phase): form `RETRACTED: D<n> vs C<m> -- <reason: the round in brackets, then its words quoted or the verse it cites>`,
  rules {one CORRECTED RESULT per reply; reason names round + words or verse}, reader ids (rxNoRes, rxNoWhy via cureReasoned), example.
- Render 1: the CURE_FORM line becomes the full form plus one sentence stating both rules (one copy per node, read by every cure item).
- Render 2: each per-rule ask keeps its own rule-specific choice (FORCED, RESTATED, CORRECTED STANDING ...) but its RETRACTED clause is the
  table's clause ("RETRACTED for that line, with its reason, and the one CORRECTED RESULT of your reply"), so no clause can omit a rule.
- Send-back phase is a different reader (Send Back Record: "CHANGE TO: RETRACTED: <pair>", FORCED lines only, no RESULT, pkgGRT). It gets
  its own table row so it is table-owned, but its text does not change in this step.
- No reader change. Replay bar as in step 1: only the RETRACTED text may move; cure status, items and verdicts byte-equal on every saved run.
