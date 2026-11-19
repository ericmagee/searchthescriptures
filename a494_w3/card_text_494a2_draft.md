# Suggested card text for ASK 494 A2 (W3 draft; the card is W4's, posted in W4's thread)

Question: Revoke the public key's access to the nine engine write functions?
Option 1, "Write it": anon, authenticated and PUBLIC lose EXECUTE on record_debate_row, record_debate_row_tokens, record_debate_judgment, derive_debate_outcome, odv1_record_panel_substitution, odv1_record_panel_alternates, record_enforcer_log, record_replay_judgments and odv1_mark_grading_failed. The engine keeps saving through service_role, which run ODV1-40891-umeouul3 showed. Revert: revert494.sql.
Option 2, "Hold": nothing changes; the public key can still call them.
Recommended: Write it, only once the proving run's P1 to P6 have passed with two non-writer checks, test494_rollback.sql has passed as a rolled-back test, and step494.sql fc32cec9, test494_rollback.sql b6f77465 and revert494.sql dfcfdd2f each have two grade posts, named on the card (<GRADE POSTS>).
Reason: closes the forged-row path, and the engine's saves are already off the public key.

Gate (from the 11-19 AAR, What went wrong 13): the card names the three file md5s above and their grade posts. Anchor note: the manual pair 2 shares the 493 Revert anchor with the 497 entry; whichever is written second is rebased first (W1 N1, W2 N1).
