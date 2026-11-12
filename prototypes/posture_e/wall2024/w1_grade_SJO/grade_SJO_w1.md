# W1 grade: pkgSJO (W3), single judge switched off. parent_s158_SJO.json sha cd992b541ac74154

VERDICT: PASS WITH LIMITS. Non-builder. Offline only.

1. Identity (own script): 443 nodes against 442 on live s158. The only new node is "SJ Off" (Code v2). No node changed or removed. The only connection change: "Regrade After Quotes?" output 1 goes to SJ Off, not to Build Independent Verdict; SJ Off goes to Build Save Body. Code +414. mapcheck: 0 faults, rebuilt sources equal to live.
2. Branch: "Regrade After Quotes?" output 1 is the non-regrade path (`Init Seats.regrade === true` goes to output 0). So Final Output has always run when SJ Off reads it.
3. Base item: Build Independent Verdict built `{...$('Final Output').first().json, audit_prompt, verdictBody}`, and every later node in the chain spread that object. SJ Off returns `{...Final Output, judge_model:null}`, so Build Save Body gets the same base minus the single judge's fields. Quote Report's own `synthesis` field is a separate item, read by name, and is not affected.
4. Readers: no reachable node reads one of the 24 unreachable nodes without an isExecuted or try guard (heuristic scan of every `$('<node>')` in reachable code; the only hit was Early Alternate Build reading Shared Library params, as on live). Format Markdown uses String(r.independent_verdict_raw||''); the analyst name still comes from Init Seats.single_judge, which is still chosen (Build Synthesis needs it).
5. Build Save Body: W3's bsb.cjs re-run by W1. The save body differs only as W3 states: independent_verdict_raw, judge_model, both chain marks, out-of-round count and detail are null; data_class is "contested"; the defender's stored count is null.
6. Database: every affected column is nullable. data_class is NOT NULL with default 'study', and Build Save Body sends 'contested'. dash_odv1_by_id shows judge_model (null shows empty). jfl_* read the enforcer log, not this column.

LIMITS / to say in the write ask
- data_class: pattern_card_deck mines only rows with data_class='study'. After pkgSJO no new row is ever 'study'. Effect today is small: in the last 10 days 1 of 92 rows was 'study'.
- Lost: the second opinion's own contradiction catches (33846 1 John 5:1) and its synthesis diagnostic block. Saved: about 0.262 USD and four model calls per run (35554 figures).
- Not executed in n8n; the Payloads nodes and Format Markdown are read, not run. The first live run is the test.
- The 24 nodes stay in the flow unconnected (size unchanged; a later cleanup could remove them).
