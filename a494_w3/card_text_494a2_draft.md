# Suggested card text for ASK 494 A2 (W3 draft; the card is W4's, posted in W4's thread)

Question: Revoke the public key's access to the nine engine write functions?
Option 1, "Write it": anon, authenticated and PUBLIC lose EXECUTE on record_debate_row, record_debate_row_tokens, record_debate_judgment, derive_debate_outcome, odv1_record_panel_substitution, odv1_record_panel_alternates, record_enforcer_log, record_replay_judgments and odv1_mark_grading_failed. The engine keeps saving through service_role, which run ODV1-40891-umeouul3 showed. Revert: revert494.sql.
Option 2, "Hold": nothing changes; the public key can still call them.
Recommended: Write it, only once the proving run's P1 to P5 have passed with two non-writer checks, and step494.sql and test494_rollback.sql have two grades on their md5s.
Reason: closes the forged-row path, and the engine's saves are already off the public key.

Gate (from the 11-19 AAR, What went wrong 13): the card names step494.sql's md5 and its two grade posts.
