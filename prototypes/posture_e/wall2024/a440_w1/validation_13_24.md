# ASK 440 run validation, items 13 to 24 of W3 9465 (W1, 11-19)

W2 holds items 1 to 12. Each item below names its CASE (the run reached the changed code) and its MARK (what proves it worked).
Run, read only, after the run: validation_13_24.sql (put the run token on its first line), the n8n checks N1 to N3, and Q474.
Grade words as in ASK 417: EXERCISED (case and mark), NO CASE, MISSED (case, mark fails), READ BY HAND, NO RUN PROBE.

| # | ASK | CASE | MARK | Where |
|---|---|---|---|---|
| 13 | 458 DeepSeek steps removed | any run | 0 debate_errors in the window naming deepseek, "doesn't exist" or Provider Removed | SQL row 458 |
| 14 | 459 Cure Call deepseek removed | a cure row in e | SQL 0 such errors; N1 | SQL row 459, N1 |
| 15 | 460 Panel Judge Call deepseek removed | judgments exist | 0 FAIL-CLOSED / Provider Removed errors; 0 ppj_replies naming deepseek | SQL row 460 |
| 16 | 461 only openrouter in Panel Judge Call | judgments exist | 0 ppj_replies with provider other than openrouter (461b shows the replies seen; 0 replies = NO CASE) | SQL rows 461, 461b |
| 17 | 462 OBJECTIVE MET guard | NO RUN PROBE | Wall guard; exercised by every grade post (W3 9464) | none |
| 18 | 464 sub-workflow comments removed | any run | SQL 0 errors naming Skip Return, Wrap, Early Alternate Shape; N2 | SQL row 464, N2 |
| 19 | 465 op doc SEARCH line | NO RUN PROBE | op doc text; used by ask forms, not by the engine | none |
| 20 | 468 B-round pass keeps lay_check | each B round ran | every <R>B Build item carries the lay_check key; on a pass with lay_check non-null, <R>B Extract bar.layers.first is non-null | N3 (check_exec.py) |
| 21 | 470 keystone BROKEN mirror (TRIAL) | a judge-written KEYSTONE Dk BROKEN, not "derived by the engine" | count of "[AUDIT v54: GRADE CONSISTENCY" lines with "is graded BROKEN on the pair"; a case with 0 is READ BY HAND (does that judge grade the keystone pair non-BROKEN?) | SQL row 470 |
| 22 | 472 E-APPLY record words | a "[AUDIT v37: SEND-BACK ITEM" line in j.verdict_raw | 0 such lines without "not counted on this row: the item goes to the E-GATE"; 472b counts E-APPLY rows with the words | SQL rows 472, 472b |
| 23 | 474 one psGrades text | a send_back E-PREM row whose flagged_line holds CONCEDED LINKS | SQL 0 errors naming psGrades or ri3Head2024; Q474 by hand: the send-back reading equals the E-GATE reading of the same line | SQL row 474, Q474 |
| 24 | 475 one LAY module | any run | SQL 0 errors naming pkgLAYB; N3: 0 "pkgLAYB:" in the run data and lay_check on all 6 B Builds | SQL row 475, N3 |

## Notes from the record
- 472: the item line is written into debate_judgments.verdict_raw (the Shared Library appends it to the seat's AUDIT v37 text), not into debate_results.review_notes (0 stored rows there hold "[AUDIT v37"; 254 judgments do). The live words are "not counted on this row".
- 468: the bar record lives in the execution only (W2's lead); Build Save Body keeps bar only for resent rounds.
- 474: sb_rows and gate_rows are pushed into enforcer_log, so they are in debate_enforcer_log (kind send_back; E-PREM rows hold the CONCEDED LINKS lines, E-GATE rows the gate's). ASSUMPTION to confirm with W4: the send_back E-PREM rows come from Send Back Record.
- ppj_replies and debate_errors have no run token; both use the window 3 hours before the results row to 10 minutes after.

## Control (run 39266, before all 12 items went live)
validation_13_24.sql on ODV1-39266-7g9lzgbr ran without error: every absence mark reads 0 (458, 459, 460, 461, 464, 474, 475), 461b 3 replies, 470 case met with mark 0, 472 NO CASE, 472b 0. LIMIT: the absence marks also read 0 on a run before the change, so for 458 to 464 and 475 EXERCISED means "ran without the fault", not "the new path was shown". 468 (N3) and 470 and 472 carry a positive mark.

## n8n checks
- N1 (459): search_workflow_executions for ODV1 Cure Call (c7366RPLb8vdMQg6) in the run window: every execution status success; none ran a node named "Call deepseek".
- N2 (464): the same for ODV1 Cure Call (c7366RPLb8vdMQg6), WALL-2024 Panel Judge Call (Y1VIsNB6KBrs1znP) and WALL-2024 Early Alternate (SX4ZWtgHNs96uBOo): every execution in the window status success; any error names no Skip Return, Wrap or Early Alternate Shape.
- N3 (468, 475): fetch the engine execution with data, save it, run python3 -I check_exec.py <file>.

## Q474 (read by hand)
    select seat, rule, item, cure_status, left(flagged_line,160) line from debate_enforcer_log
    where run_token='<token>' and kind='send_back' and rule in ('E-PREM','E-GATE') and flagged_line ~ 'CONCEDED LINKS'
    order by seat, left(flagged_line,160), rule;
For each seat, the conceded premises the E-PREM rows read from its CONCEDED LINKS line must agree with what its E-GATE rows say of the same premises. The two kinds do not quote the same line text (on 39266 the E-GATE row quotes a RULING or premise line), so the pairing is by seat and premise number, by hand.
