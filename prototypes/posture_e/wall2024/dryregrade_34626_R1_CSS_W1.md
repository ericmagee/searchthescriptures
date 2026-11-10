# Dry regrade 34108 (execution 34626, live s110): W1 check list results, 11:58 CST 11-10

Check list: dryregrade_34108_R1_CSS_checklist_W1.md. Tool: pkgR1/dr_R1.cjs (trial on 34299 first: 4 of 4).

## pkgR1
- R1.1 SHOWN: no stub error in any of the 8 R1 nodes that ran (W4: no node errors in 146 nodes).
- R1.2 SHOWN: 8 of 8 nodes that ran give output equal to their s106 full source rerun on the execution's own inputs, run-time stamps aside (measured):
  Send Back Record, Alt Send Back Record, Send Back Build, Alt Send Back Build, Judge Enforcer Build, Alt Judge Enforcer Build, Judge Enforcer Record, Alt Judge Enforcer Record.
  The Alt copies ran for the first time on any saved run.
- R1.3 NOT REACHED: R2 Alt Send Back Record, R2 Alt Send Back Build, R2 Alt Judge Enforcer Build, R2 Alt Judge Enforcer Record.
- R1.4 NOT REACHED for the insert: a dry regrade does not run Write Enforcer Log; the rows are in the Alternate Merge output (519 rows, W4).
- R1.5 SHOWN: execution times (ms, 34299 / 34626): Send Back Build 794/862, Judge Enforcer Build 782/808, Judge Enforcer Record 678/669, Send Back Record 702/2,367.
  Send Back Record's rise is not attributable to R1 from this alone: this run had 30 send-back items (luna 17) and a different input.

## pkgCSS rev 2
- S1 SHOWN: two items, two calls. S2 SHOWN: 63,071 (defender) and 89,593 (challenger) characters.
- S3 SHOWN: defender call CONFIRMED LINK 6, [CR3] "I drop the wording 'no biological father' as a bare statement. I rest it on these rows." against [round 4] "Christ had no biological father."
- S4 SHOWN: challenger NONE, logged NONE FOUND. S5 SHOWN for "[round 4]"; the bare "[N]" form NOT REACHED.
- S6 SHOWN for the panel: D6 vs C5 and D6 vs C6 read DEFENDER LINK BROKEN with the AUDIT line in all three; RESULT CHALLENGER WINS in all three. Single judge NOT REACHED (vc_single empty).
- S7: W3's hand reading. S8: challenger NONE, nothing to read. S9: RLF2 and ACM.

## KEYSTONE still "D6 -- STANDS" (display fault, the result is right)
- chatgpt and sol: they wrote STANDS themselves. The closing break goes through cureRecompute (Shared Library), which rewrites RESULT, both STANDING lines, CONCEDED LINKS and CLAUSE, but never the KEYSTONE line (it reads KEYSTONE only to test WITHDRAWN). So their bodies say RESULT CHALLENGER WINS (BROKEN-1) beside KEYSTONE: D6 -- STANDS.
- luna: wrote "KEYSTONE: D6 -- BROKEN -- ... broken by the confirmed closing contradiction." The send-back apply then changed its S6 and S8 lines, and the send-back keystone derivation (pkgRCD, W3 2362) rewrote the keystone to "D6 -- STANDS -- derived by the engine from the collision grades of D6 (none DEFENDER LINK BROKEN) after the change of S6, S8". The closing AUDIT break stands on its D6 lines in the final body, so the engine-derived line contradicts luna's own body. The K-RECHK audit records it: ORIGINAL BROKEN, CHANGE KEYSTONE (derived).
- So the engine wrote the wrong word for luna (it replaced a correct judge line) and failed to correct it for chatgpt and sol.
- Countermeasure, a sketch for the operator, not built: when a link is broken by a confirmed closing contradiction and it is the keystone link, cureRecompute rewrites KEYSTONE to BROKEN, and the send-back derivation counts the closing AUDIT break as DEFENDER LINK BROKEN. Size not measured.

## Haiku stand-in for luna
- Why called: after the send-back gate, luna stood REMOVED FOR "drv_uncured 2: COLLISION GRADE UNCURED x1; E-GATE CONTRADICTION x1" (Gate Record: 1 counted item uncured).
- Node: Alternate Call openrouter (anthropic/claude-haiku-5.5; 107,977 prompt tokens, 2,479 completion tokens, finish stop, 11.7 s). Alternate Payloads failed to parse it: 5,437 characters, the error at position 5435, at the reply's last characters ("...G1097 in CR3 NOT COUNTED.\"]}"). Its brackets do not close in order.
- What it cost (CORRECTED 12:05 CST, Wall 4215; my first text said luna stayed counted, which was wrong): luna's row carries drv_uncured 2, and aggregate_debate_panel counts a drv_uncured > 0 row as "not counted: debate rule". On a live write the panel would count 2 seats, both BROKEN. Second Alternate? found no untried pool model (pool: haiku only). The engine followed manual v93 (no retry on alternate calls; second round only with an untried model). Open rule question for Eric only: what happens when the only alternate's reply does not parse.
