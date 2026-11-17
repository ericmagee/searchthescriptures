-- ecol_rows.json, read 2026-11-17 08:44Z. 679 rows: all 348 E-COL send_back rows, and the 331 E-COL enforcer_check rows whose
-- cure_reason begins ENFORCER DISAGREE, HELD or CONTRADICTED (the DB holds 596 E-COL enforcer_check rows; the other 265 are AGREE,
-- NO ANSWER or NO VERDICT, which ETC and the send-back never act on). Of the 331, 330 are DISAGREE and 1 is HELD.
SELECT json_agg(t) FROM (SELECT id, kind, run_token, seat, item, flagged_line, response_line, cure_status, cure_reason FROM debate_enforcer_log WHERE rule='E-COL' AND (kind='send_back' OR cure_reason ~ '^ENFORCER (DISAGREE|HELD|CONTRADICTED)') ORDER BY id) t;
