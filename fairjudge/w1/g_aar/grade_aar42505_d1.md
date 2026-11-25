# GRADE: AAR run ODV1-42505-rpenuzcb, draft 1 (W3, Wall 11911, aar/w3/aar_run42505_draft1.md md5 002344a0, commit b30a2a89)
W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. 21:44 CST 11-24.

GRADE: FAIL (F1, F2). RULES READ: Wall manual s7.4 order; op doc s29, s30. OBJECTIVE MET: no, until F1 and F2. STANDARD (ASK 599): not applicable (no code).

Checked by my SQL at 21:43 to 21:44 CST on debate_results id 12957d6e, debate_errors, debate_judgments, debate_enforcer_log, debate_rounds, audit_log, the_wall.

## Confirmed
- Row 12957d6e: token ODV1-42505-rpenuzcb, saved 21:38:22 CST; topic, variant ORACLE_DEBATE_V1, data_class contested; defender anthropic/claude-opus-5.5 profile oracle; challenger anthropic/claude-sonnet-5.5 profile plain.
- quarantine_reason text as quoted. debate_errors one row 21:38:26 CST at "Salvage Stop", partial row saved, Drive file named.
- run_cost_usd null, call_costs null. outcome, panel_verdict, judged_by, synthesis null. debate_judgments, debate_enforcer_log, debate_rounds: 0 rows after 21:08 CST.
- review_notes: 7 CACHE DIAG lines. No CLOSE PRESS LIST text.
- Defender close: opening sentence present (offset 431), heading "ANSWERS TO THE VERSES PRESSED" (948), 23 lines "ANSWER: <verse> -- D<n>" (bolded in the text), ends "GAPS: NONE". DG-8 sentence present. challenger_r4 null.
- audit row 41961 and Wall 11907 both 21:08:13 CST, the run's start minute.
- Section order follows s7.4. No verdict claimed. Cost stated NOT STORED, as s30 asks for a stopped run.

## Findings
F1 (required). The "Stored lengths" are not the stored lengths. 24,105 / 20,657 / 34,347 / 19,161 / 34,750 / 14,574 / 42,161 are length(to_jsonb(col)::text), the JSON-escaped form. The stored text, length(col), is 23,495 / 20,031 / 33,399 / 18,674 / 33,861 / 14,125 / 40,973 (claude_r1, engine_r1, claude_r2, engine_r2, engine_r3, challenger_r3, defender_r4). Use these, or name the measure.
F2 (required). Header time "21:41 to 21:46 CST", W3's own finding: correct to the true span.
N1 (not blocking). Start 21:08:13 and end 21:38:25 are from W4's polls, as stated; NOT CHECKED by me against n8n.
N2 (not blocking). "In run 42373 the close left 20 of 31 pressed verses with no answer line": from the 42373 AAR; NOT CHECKED by me this turn.
