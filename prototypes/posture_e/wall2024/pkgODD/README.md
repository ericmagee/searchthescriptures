# pkgODD (W1) — TIE on an exact even split of counted seats

Eric approved W3 ASK 1 at 10:14 CST 2026-11-07. Not a DeepSeek-enforcer fix; rides alongside one.

## Files
- `derive_debate_outcome_ODD.sql` — W4 applies. Guarded: refuses unless live md5 is 2c39766e2bdcf7ecfcd1779a648f1db4 and the anchor occurs once.
  Inserts one block before AMENDMENT THREE. defense_standing / challenge_standing only; conceded_links fields untouched.
- `revert_derive_debate_outcome_ODD.sql` — removes the block, refuses unless the result is md5 2c39766e...
- `replay_ODD.sql` — read-only recompute over stamped debates.

## Replay (16:5x UTC 2026-11-07, 71 stamped debates, last 8 days)
- 33345: challenge_standing null -> TIE (PROP-DEPENDENT 1, SELF-SUPPORTED 1 after sol removed). defense_standing SELF-SUPPORTED unchanged.
- 33197 (alternate pool empty): challenge_standing null -> TIE.
- 33218 (3 counted): unchanged. 33371, 33389 (3 counted): unchanged.
- Stored non-null standings equal the recomputed majority on every row (parity).
- 16 debates would carry at least one TIE: 29820 29912 29975 30268 30304 32194 32302 32595 32717 32749 32949 32973 33040 33060 33197 33345.
- 0-counted and 1-counted rows untouched.
- Applies at FIRST STAMP ONLY, as today: no stored row changes.

## Reserve half (not built)
At Alternate Build time an even count with a free pool model cannot occur: the pool is offered in order to each removed seat
(guard G4), so a free model means the removed seat was already offered one. An even count with a free model arises only after
an alternate itself fails or stays uncured, which needs a second alternate round (a loop). Observed: 33345 pool = grok only,
already seated; 33222 grok NOT SEATED; 33197 pool empty. Pool today = grok only, so a second round would never fire.
