-- W1 (pen Worker_A3): a row whose stored framework_verdict differs from its panel_verdict. Fires on any row returned.
SELECT id, framework_verdict, panel_verdict FROM debate_results WHERE framework_verdict IS NOT NULL AND panel_verdict IS NOT NULL AND framework_verdict<>panel_verdict;
