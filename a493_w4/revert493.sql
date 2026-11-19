-- ASK 493 revert (W4). Valid only while the table holds no row (plan rev 4: after the first real row, the revert is "stop filling; keep the rows", on the operator's word). Run with SET LOCAL truth.session_id and truth.card.
DO $p$ BEGIN
  IF EXISTS (SELECT 1 FROM public.ask_aar_snapshots) THEN RAISE EXCEPTION 'ASK 493 revert: the table holds rows; do not drop it'; END IF;
END $p$;
DROP TABLE public.ask_aar_snapshots;
DROP FUNCTION public.ask_aar_snapshots_before_insert();
DROP FUNCTION public.ask_aar_snapshots_after_insert();
DROP FUNCTION public.ask_aar_snapshots_no_change();
INSERT INTO audit_log(session_title, engine, notes)
VALUES ('ASK 493 revert: ask_aar_snapshots dropped (empty)', 'W4_2026_11_06',
 'card=' || coalesce(current_setting('truth.card', true),'NONE') || ' | session=' || coalesce(current_setting('truth.session_id', true),'NONE'));
DO $c$ BEGIN
  IF to_regclass('public.ask_aar_snapshots') IS NOT NULL THEN RAISE EXCEPTION 'ASK 493 revert: table still present'; END IF;
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname LIKE 'ask_aar_snapshots%') THEN RAISE EXCEPTION 'ASK 493 revert: a function is still present'; END IF;
END $c$;
