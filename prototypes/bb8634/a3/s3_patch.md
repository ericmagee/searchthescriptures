# BB-8634 S3: derive_debate_outcome, PARTIAL follows the tie clause

Base: pg_get_functiondef md5 0d9d31832738778f1c92716439540e57 (22,675 chars). Each anchor asserted at its count before the write.

| # | anchor (count) | replacement |
|---|---|---|
| 1 | `IF v_fv = 'HELD' AND v_created >= v_tie_from THEN` (1) | `IF v_fv IN ('HELD', 'PARTIAL') AND v_created >= v_tie_from THEN` |
| 2 | `WHERE verdict_tag = 'HELD' AND NOT coalesce(truncated, false) AND coalesce(drv_uncured, 0) = 0` (2) | `WHERE verdict_tag = v_fv AND NOT coalesce(truncated, false) AND coalesce(drv_uncured, 0) = 0` |
| 3 | `-- TIE: the panel verdict is HELD and most of the counted HELD seats wrote RESULT: UNDERDETERMINED.` (1) | `-- TIE: the panel verdict is HELD or PARTIAL and most of its counted seats of that verdict wrote RESULT: UNDERDETERMINED (BB-8634 S3).` |
| 4 | `whose panel verdict is HELD, outcome also depends on the RESULT lines in verdict_raw of the HELD seats` (1) | `whose panel verdict is HELD or PARTIAL, outcome also depends on the RESULT lines in verdict_raw of the seats of that verdict` |

New: md5 2c39766e2bdcf7ecfcd1779a648f1db4 (22,742 chars).

UNDO: the same four replacements reversed, applied to the new source, give md5 0d9d31832738778f1c92716439540e57 (checked by SQL, 2026-10-30 23:30 CDT).

PROBE (rolled back by RAISE; function created as derive_debate_outcome_a3probe inside the aborted transaction): run 30091 outcome DEFENDER PREVAILS, WEAKENED -> UNDERDETERMINED; run B UNDERDETERMINED -> UNDERDETERMINED. After the probe: live md5 unchanged, one function of the name, 30091 outcome unchanged.

Population note: 7 PARTIAL rows created since v_tie_from (2026-10-14 01:45 UTC); 1 of them (30091) carries DEFENDER PREVAILS, WEAKENED. Only rows re-derived change; the plan re-derives 30091 only, on his word.

Write: only on the operator's word (S3 amends ruling 304's clause).
