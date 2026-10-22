-- W1 v2 (pen Worker_A3, drift BB-7413): a row whose panel has written and whose stored framework_verdict is not the panel's, NULL included. Fires on any row returned.
SELECT id, framework_verdict, panel_verdict FROM debate_results WHERE panel_verdict IS NOT NULL AND framework_verdict IS DISTINCT FROM panel_verdict;
