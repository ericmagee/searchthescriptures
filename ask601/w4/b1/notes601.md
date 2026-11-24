# ASK 601 build rev 0 (W4, 11-24): same-model judge out
Plan: ask601/w4/plan601.md 7aab840d (W1 PASS, Wall 11612/11616).
Base: live engine ff7ab4cf (fetch-back base_eng.json), child ecdc6218 (base_child.json); DB odv1_record_panel_alternates 39d84307, dash_judge_lineup caea9e6c.

## Changes, in plain words
Engine, built by build601.cjs; target_engine_601.json, md5 9cb87181:
- Init Seats (7949df51 -> 0579c436)
  - Added a model match: trim, lower-case, drop "anthropic/", turn "." into "-".
  - Added a read of each seat's model from the Accept Models rows.
  - Added one more condition to the pfree0 filter: a seat whose model equals a debater's model is dropped, with the reason "runs the same model as a debater (<model>)". The condition sits after the family check, so a family reason still comes first.
- Resolve Seats (767dc7b0 -> ffb7b688)
  - Added the same model match on D.model and C.model.
  - A panel judge with a debater's model now fails the run, closed: 'judge seat "<seat>" runs <model>, the same model as a debater (ASK 601).'
  - The reserve and the alternates now skip a seat with a debater's model.
- Nothing is deleted. No other node, no prompt text and no model setting changes.

DB, in fix601_db.sql (md5-gated exact replaces); revert in revert601_db.sql:
- odv1_record_panel_alternates
  - Reads the debaters' models (v_deb_m).
  - New guard G-SAME raises "G-SAME: <model> is the model of a debater in this debate (ASK 601)". It sits before G2.
- dash_judge_lineup
  - Reads the debaters' models (dm).
  - The free-seat loop gains one branch, after the family branch, that drops a same-model seat with the reason.

## Tests
- T1 (t1_601.cjs): live and target Init Seats plus Resolve Seats on the 90 debater pairs the engine accepts. 88 are equal; 2 differ: claude vs opus and opus vs claude, where sonnet is dropped with the reason and the alternates become chatgpt, qwen4max, gemini, argon. No pair errors.
- T1b (t1b_601.cjs): with sonnet first on the panel list, live Resolve Seats seats sonnet; the target fails closed with the reason. PASS.
- T2 (t_db_601.sql): page copy, live against new, on 240 pairs. 238 are equal; the 2 that differ are the same two pairs, with the same drop.
- T3: odv1_record_panel_alternates, old and new, on temp copies of the 42234 and 42071 rows.
  - The only change is 42234 sol->sonnet: WRITTEN becomes RAISED G-SAME.
  - The other five cases are the same in both: G1 raises twice; WRITTEN three times.
- T4: standing 29/29; pair Library Check PASSES (out_standing_601.txt, out_pair_601.txt).
- T5: the new page copy equals the target engine on all 90 pairs (md5 59457aaf both).

## Write (card)
1. Run fix601_db.sql, then read back both functiondef md5s.
2. Run write601.sh. It refuses while a run is live or when live is not ff7ab4cf.

revert601_db.sql has not been rehearsed: it gates on its anchors and on the restored md5, and raises otherwise. The engine revert file is made by write601.sh at write time.

## Notes
- A same-model seat on the panel list (not the alternates) is dropped by Init Seats, but the existing dropped-seat report (alt_dropped) lists only alternate-list seats. That was already so for family drops. Today sonnet is only on the alternates list.
