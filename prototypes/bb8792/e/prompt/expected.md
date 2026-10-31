# BB-8792 step 3: expected verdicts, fixed before any call (Worker_E)

Rule texts: rules.json (served text, md5 each; each occurs once in live Panel Build eb0dee1e and live Build Independent Verdict eb53803a, active version 8a7f48d3).
K-S2 487343b6 | K-C 26542745 | K-G4 a1828be5 | RESULT e8f98881

## Known cases (A3's table, held at step 2)
| id | rule | expected |
|---|---|---|
| K1 | K-S2 | BREACH |
| K2 | K-G4 | CLEAN |
| K3a | K-C | BREACH |
| K3b | K-C | BREACH |
| K4 | K-G4 | BREACH |
| K6 | RESULT | CANDIDATE: BREACH on our reading (standing grounded only on the retracted break); by the rule's letter the stored PROP-DEPENDENT standing meets the first limb. Called and reported, outside the pass bar. |

## Clean set: 12 drawn, expected fixed against the served texts
CLEAN on K-S2, K-C and K-G4 (9 units): C_0ff61f2c, C_1ddbfc6d, C_25eae673, C_26901a7a, C_29b68494, C_3095de1f, C_43b88b0e, C_48d1bd68, C_54c2dc53. None grades BROKEN, so K-G4 does not apply; none rests UNDERDETERMINED on a verse not stating the link.

NOT CLEAN on my reading (3 units, A3's three): their ground for UNDERDETERMINED is that the text does not state the point, which K-S2 bars, and the witnesses set aside are the other side's chain, which K-C bars.
- C_2838a3b7: "neither text's own words state the other reading's contrary" (K-S2 BREACH, K-C BREACH)
- C_2539d24c: "without naming whose body is the channel, so the point stays open" (K-S2 BREACH, K-C BREACH)
- C_3c15e8ee: "without explicit textual resolution of paternity" (K-S2 BREACH, K-C BREACH)
These three are breaches the code missed, like K1. They leave the clean set and are graded as a separate CANDIDATE group, reported but not in the pass bar, because their expected verdicts rest on our reading alone.

## Counts this changes (P2D amendment for the pen)
Clean set 9 units (pass bar asks at least 8). Calls: known 6 x 3 = 18; clean 9 x 3 rules x 3 = 81; candidates 3 x 2 rules x 3 = 18; total 117 (plan said 126).
