# W1 grade: ASK 625 draft 1 (ask625/w3/ask625_draft1.md, md5 60b252b0da505baaac49905b49a4b51a, commit 07137051)

GRADE: PASS WITH N1, N2.
RULES READ: operational_doc v145 BODY LAW (1) to (8) and section 30 (THE REVIEW AFTER A RUN, read whole); the_wall_manual v19 BODY LAW and section 7.4 (read whole).
OBJECTIVE MET: yes. The paragraph makes every live-run AAR state the cost and say when the figure is short.
STANDARD (ASK 599): not applicable; no code.

CHECKS (SQL, this turn):
- Paragraph length: 477 characters, counted from the file (matches the draft and Wall 11799).
- Placement: op doc v145 holds "THE REVIEW AFTER A RUN" at position 72429, followed by "DENIALS, TIMEOUTS AND WRITES", as the draft says.
- Search: "cost" occurs twice in v145 (section 30 "limited to several a day, for cost"; the section 0 "cost an hour each"). Neither is a cost-reporting rule. The draft's claim that no rule exists to amend holds. The Wall manual v19 holds "cost" zero times.
- Pointer: the_wall_manual 7.4 is "AAR REPORT TO THE OPERATOR" and its RUN part reads "the run token, the live version, the outcome and the panel verdict, in one line." The pointer resolves.
- WALL-11796 exists (W3, copies the operator's words).
- debate_results.run_cost_usd exists; debate_results.call_costs exists, type jsonb.

BODY LAW:
- (2) PASS: no author, date or session in the body text.
- (3) PASS: one Why line, bare WALL-11796 pointer.
- (3b) PASS: manual + section + "AAR report", no version.
- (5) PASS: the cost rule has one home; 7.4 is pointed at, not restated.
- (5b) PASS: no changeable value written; column names are schema names (exempt).
- (7) PASS: the operator is not named in the paragraph.

N1 (wording, mechanics): "the sum of the run's call_costs rows" and "calls that have no call_costs row". call_costs is not a table; it is a jsonb array column of debate_results (65 entries on run 42373, each with "usd"). A reader following the words will look for a call_costs table. Suggest "the sum of the usd of the entries in debate_results.call_costs" and "calls that have no call_costs entry".
N2 (check value): on run 42373 the sum of call_costs usd equals run_cost_usd exactly (10.1216646225 both). The "sum beside it" is therefore not an independent check of the stored figure; it only proves the two agree. Not a fault in the rule; the draft's "as a check" (scope) overstates it. The shortfall is found only by naming the uncosted calls, which the paragraph already requires.

Neither note blocks the card. If W3 applies N1, I confirm the new text by diff.
