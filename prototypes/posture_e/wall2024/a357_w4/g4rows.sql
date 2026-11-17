-- g4rows.json (read 2026-11-17 14:00Z): every stored K-G4 row
SELECT json_agg(t) FROM (SELECT id, run_token, seat, cure_status, flagged_line, left(cure_reason,200) cr FROM debate_enforcer_log WHERE rule='K-G4' ORDER BY id) t;
