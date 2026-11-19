-- ASK 498 revert (W4). Valid only while ask_aar_builders holds no row; after the first real row the revert is "stop filling; keep the rows", on the operator's word. Run with SET LOCAL truth.session_id and truth.card.
DO $p$ BEGIN
  IF EXISTS (SELECT 1 FROM public.ask_aar_builders) THEN RAISE EXCEPTION 'ASK 498 revert: the table holds rows; do not drop it'; END IF;
END $p$;
DROP FUNCTION public.ask_aar_grades_check();
DROP TABLE public.ask_aar_builders;
DROP FUNCTION public.ask_aar_builders_before_insert();
DROP FUNCTION public.ask_aar_builders_after_insert();
DROP FUNCTION public.ask_aar_builders_no_change();
INSERT INTO audit_log(session_title, engine, notes)
VALUES ('ASK 498 revert: ask_aar_builders and ask_aar_grades_check dropped (empty)', 'W4_2026_11_06',
 'card=' || coalesce(current_setting('truth.card', true),'NONE') || ' | session=' || coalesce(current_setting('truth.session_id', true),'NONE'));
DO $c$ BEGIN
  IF to_regclass('public.ask_aar_builders') IS NOT NULL THEN RAISE EXCEPTION 'ASK 498 revert: table still present'; END IF;
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname LIKE 'ask_aar_builders%' OR proname = 'ask_aar_grades_check') THEN RAISE EXCEPTION 'ASK 498 revert: a function is still present'; END IF;
END $c$;
