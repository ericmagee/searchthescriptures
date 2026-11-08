# pkgKG7 (D40): K-G7 is cured by a count only when the witness went unanswered (W1, 11-08; W3 3093 ruling 3, HIGH)

Engine fix in the library (cure test and cure rule text). It is not a DeepSeek fix, so it rides with a gap's graded DeepSeek fix.

## Fault
K-G7 ("DEFENDER LINK BROKEN on D<n> while CONCEDED LINKS does not count premise n") offered CORRECTED COUNT as a cure for every such line, including lines that record an answer. 33592 grok: "D2 vs C4: DEFENDER LINK BROKEN ... answered in [CR3]" and "D5 vs C5: ... answered in [CR3] but the answer misses" were both CURED as "counted: DEFENDER COUNT 3". Under ruling 421 and E-PREM (W3 3093), a break on an answered witness is one of meaning: it stands only with a FORCED line and is not counted.

## Change (19 library nodes that carry cureVerdicts; base pkgLIB/strip_GDA19 = live LIB v19_GDA)
1. `kg7Ans2024(x,R)`: the K-G4 answered test applied to the K-G7 line. The line does not say the witness went unanswered (`g4Unans2024` false), or it does, but a later round of that side names every pressed witness it quotes (`kg4Split`, unanswered-false).
2. Cure: such a K-G7 item is CURED only by a FORCED line for the pair (read with KF_LINE, as in K-G4) or by a RETRACTED line (unchanged). A count leaves it UNCURED: "... so the break is one of meaning (ruling 421): a count does not cure it; cure it with one FORCED line for Dn vs Cm, or a RETRACTED line with one CORRECTED RESULT (pkgKG7)".
3. kNeed: such a premise is no longer required in the side's CORRECTED COUNT.
4. The CURE_RULE_G K-G7 text tells the judge 1 and 2.

## Pack
`node pkgLIB/pack.cjs pkgLIB/strip_KG7` -> pkgLIB_v20_KG7. Shared Library b23f6a8053ce -> 4899f53e2fb6 (library sha cc86a9c84ecbbe36, 2154 lines). All 22 stubs rebuild strip_KG7 byte for byte (unpack.cjs). Every stub is rewritten, so write the whole v20.

## Tests
- test_KG7.cjs: 26 OK. The replay covers every saved run. The only cure flips are 33592 Panel Cure Check grok K-G7 D2 vs C4 and D5 vs C5, CURED -> UNCURED with the pkgKG7 reason. There are no other flips and no uncured-count changes elsewhere.
- test_KG7_text.cjs: OK. There are 142 Cure Build node runs, and the 121 that changed differ only by the K-G7 rule passage.

## Note
In 33592 premise 2 (D2 vs C4) is also a meaning break ("answered in [CR3]"), not only premise 5. Panel result is unaffected (HELD 2-1 per W3 3087); grok gets 2 more uncured items unless it gives FORCED lines.

## Live bar
No K-G7 item whose line records an answer is cured by a CORRECTED COUNT.
