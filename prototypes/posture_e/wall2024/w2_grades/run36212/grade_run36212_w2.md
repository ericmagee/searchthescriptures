# W2 grade: run 36212 on s177 (independent of W3). 23:14 CST 11-12

VERDICT: CLEAN for the packages whose path fired. The outcome is sound: HELD 3-0, then UNDERDETERMINED by the tie rule. Counted HELD seats are 3 (drv_uncured 0 on each). chatgpt and sol RESULT read UNDERDETERMINED, which is 2 of 3. ember reads DEFENDER WINS.

Sources (all MEASURED): debate_results, debate_judgments, debate_enforcer_log, and debater_fault_ledger by token ODV1-36212-ld47uzqy. Also the n8n execution 36212 output of D4 Build, C4 Build and Alternate Build, read after the run ended.

## Per package
| Package | Counts? | Evidence |
|---|---|---|
| pkgMUS rev 3 | YES | Alternate Build seated ember first (meta/muse-ember, reasoning {effort: low}) for luna. Record Alternates wrote it. ember's row is HELD, readable, 14,079 chars, cures CURED. gemini and spark were not reached. |
| pkgTWC rev 2 | YES | Close enforcer: 4 rows (NONE DEFENDER, NONE DEFENDER (second check), NONE CHALLENGER, NONE CHALLENGER (second check)), every call replied, no reply_error. Copy 2's prompt is logged by reference. The pairing and relabel paths were not reached (nothing was confirmed). |
| pkgSRA rev 3a | YES | Of 6 E-ANS batch prompts, all carry the rule text. 57 item blocks "THE SIDE'S LINES ELSEWHERE IN THE SAME ROUND" were served. 171 checks; 0 NOT CHECKED; 2 DISAGREE. |
| pkgOWR | YES | D4 Build carried "YOUR OWN RECORD" with the defender's 4 grant sentences (CR2, CR3 x3). C4 Build has no block. That is correct: the challenger's DR1 to DR3 hold no grant, narrowing or withdrawal of its own (scan). Close enforcer: NONE on both sides. |
| pkgRMQ rev 2 | NO (not reached) | No K-G4 retraction cured by a quoted reason in this run. luna's K-G4 was raised by a gate change and stayed UNCURED. |
| pkgDFL rev 3 | NO (not reached) | No CONFIRMED E-CLOSECON row, so 0 ledger rows, which is correct. |
| pkgCFO rev 3 | NO (not reached) | derive_debate_outcome md5 4ad4e2ab is live. cfo_sides(debate) = {}, so no forfeit, as wanted. The forfeit branch did not fire. |

## Limits / observations
- O1 (pkgSRA, cost only): the same-round lines can repeat a line already in THE ANSWER IN FULL. Example: B71, "The angel gives the reason with 'for' ...". The exclusion covers only the answer's own line. Grading is not harmed. About 100 to 400 chars per repeat (ESTIMATE).
- O2 (not tonight's packages): luna's removal (BROKEN after the cure) came through gate G2 (E-GATE M). Luna changed D5 vs C1 to BROKEN to match its own MISSES answer check. That change raised K-G4 (no FORCED line), which stayed UNCURED (W3 2341), and luna was removed. By my count (ESTIMATE) the outcome is the same with luna kept: with HELD 2-1, the counted HELD seats chatgpt and sol both read UNDERDETERMINED.
