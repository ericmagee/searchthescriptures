-- ASK 497 revert (W4). Run with SET LOCAL truth.session_id and truth.card.
DROP FUNCTION public.ask_aar_snapshots_check();
INSERT INTO audit_log(session_title, engine, notes)
VALUES ('ASK 497 revert: ask_aar_snapshots_check dropped', 'W4_2026_11_06',
 'card=' || coalesce(current_setting('truth.card', true),'NONE') || ' | session=' || coalesce(current_setting('truth.session_id', true),'NONE'));
DO $c$ BEGIN
  IF to_regprocedure('public.ask_aar_snapshots_check()') IS NOT NULL THEN RAISE EXCEPTION 'ASK 497 revert: function still present'; END IF;
END $c$;
