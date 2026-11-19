-- ASK 493 step (W4, build of plan rev 4 b068cc76): the ASK AAR snapshot table. Run only on a card pressed in W4's thread, in one call with SET LOCAL truth.session_id and truth.card.
CREATE TABLE public.ask_aar_snapshots (
  id bigserial PRIMARY KEY,
  ask int NOT NULL,
  rev text NOT NULL,
  title text NOT NULL,
  objective text NOT NULL,
  objective_met text NOT NULL CHECK (objective_met IN ('yes','in part','no','not yet')),
  objective_met_reason text NOT NULL,
  objective_source text NOT NULL,
  aar_at timestamptz NOT NULL DEFAULT now(),
  written_by text NOT NULL,
  prior_row bigint REFERENCES public.ask_aar_snapshots(id),
  operator_words jsonb,
  card jsonb,
  owner_seat text,
  plan jsonb,
  build_files jsonb,
  revert jsonb,
  grades jsonb,
  md5_written text[],
  md5_match boolean,
  audit_ids jsonb,
  objects jsonb,
  tests jsonb,
  readbacks jsonb,
  run_evidence jsonb,
  manuals jsonb,
  status text NOT NULL CHECK (status IN ('planned','graded','carded','written','read back','proven by run','reverted','dropped')),
  sources jsonb NOT NULL CHECK (jsonb_typeof(sources) = 'array' AND jsonb_array_length(sources) >= 1)
);
ALTER TABLE public.ask_aar_snapshots ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.ask_aar_snapshots FROM PUBLIC, anon, authenticated;
REVOKE ALL ON SEQUENCE public.ask_aar_snapshots_id_seq FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.ask_aar_snapshots FROM service_role, lab_seat;
GRANT SELECT ON TABLE public.ask_aar_snapshots TO service_role, lab_seat;

CREATE FUNCTION public.ask_aar_snapshots_before_insert() RETURNS trigger LANGUAGE plpgsql AS $f$
DECLARE v_sid text := nullif(current_setting('truth.session_id', true), ''); g jsonb; m text; ok boolean; e jsonb;
BEGIN
  IF v_sid IS NULL THEN RAISE EXCEPTION 'ask_aar_snapshots: truth.session_id is not set'; END IF;
  IF md_notes_caller_seat() IS DISTINCT FROM 36 THEN RAISE EXCEPTION 'ask_aar_snapshots: only the coordinator seat (36) inserts rows'; END IF;
  IF NEW.written_by IS DISTINCT FROM v_sid THEN RAISE EXCEPTION 'ask_aar_snapshots: written_by must equal truth.session_id'; END IF;
  IF NEW.grades IS NOT NULL THEN
    IF jsonb_typeof(NEW.grades) <> 'array' THEN RAISE EXCEPTION 'ask_aar_snapshots: grades must be an array'; END IF;
    FOR g IN SELECT * FROM jsonb_array_elements(NEW.grades) LOOP
      IF coalesce(g->>'verdict_norm','') NOT IN ('PASS','FAIL','FAIL ON FORM') THEN
        RAISE EXCEPTION 'ask_aar_snapshots: every grades element needs verdict_norm PASS, FAIL or FAIL ON FORM';
      END IF;
    END LOOP;
  END IF;
  IF NEW.md5_written IS NULL OR cardinality(NEW.md5_written) = 0 THEN
    NEW.md5_match := NULL;
  ELSE
    ok := true;
    FOREACH m IN ARRAY NEW.md5_written LOOP
      IF EXISTS (SELECT 1 FROM jsonb_array_elements(coalesce(NEW.grades,'[]'::jsonb)) x
                 WHERE x->>'md5_graded' = m AND x->>'verdict_norm' IN ('FAIL','FAIL ON FORM')) THEN ok := false; EXIT; END IF;
      IF EXISTS (SELECT 1 FROM jsonb_array_elements(coalesce(NEW.grades,'[]'::jsonb)) x
                 WHERE x->>'md5_graded' = m AND x->>'verdict_norm' = 'PASS' AND x->'equal_to' IS NULL) THEN CONTINUE; END IF;
      IF EXISTS (SELECT 1 FROM jsonb_array_elements(coalesce(NEW.grades,'[]'::jsonb)) x
                 WHERE x->>'md5_graded' = m AND x->>'verdict_norm' = 'PASS' AND x->'equal_to' IS NOT NULL
                   AND EXISTS (SELECT 1 FROM jsonb_array_elements(NEW.grades) y
                               WHERE y->>'md5_graded' = x->'equal_to'->>'md5' AND y->>'verdict_norm' = 'PASS')
                   AND NOT EXISTS (SELECT 1 FROM jsonb_array_elements(NEW.grades) y
                               WHERE y->>'md5_graded' = x->'equal_to'->>'md5' AND y->>'verdict_norm' IN ('FAIL','FAIL ON FORM'))) THEN CONTINUE; END IF;
      ok := false; EXIT;
    END LOOP;
    NEW.md5_match := ok;
  END IF;
  RETURN NEW;
END $f$;

CREATE FUNCTION public.ask_aar_snapshots_after_insert() RETURNS trigger LANGUAGE plpgsql AS $f$
BEGIN
  INSERT INTO audit_log(session_title, engine, notes)
  VALUES ('ASK AAR snapshot: ASK ' || NEW.ask || ' rev ' || NEW.rev, NEW.written_by,
          'id=' || NEW.id || ' | status=' || NEW.status || ' | md5_match=' || coalesce(NEW.md5_match::text,'null'));
  RETURN NULL;
END $f$;

CREATE FUNCTION public.ask_aar_snapshots_no_change() RETURNS trigger LANGUAGE plpgsql AS $f$
BEGIN
  RAISE EXCEPTION 'ask_aar_snapshots: rows are never edited or deleted; insert a new row with prior_row';
END $f$;

REVOKE ALL ON FUNCTION public.ask_aar_snapshots_before_insert() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ask_aar_snapshots_after_insert() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ask_aar_snapshots_no_change() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER ask_aar_snapshots_bi BEFORE INSERT ON public.ask_aar_snapshots FOR EACH ROW EXECUTE FUNCTION public.ask_aar_snapshots_before_insert();
CREATE TRIGGER ask_aar_snapshots_ai AFTER INSERT ON public.ask_aar_snapshots FOR EACH ROW EXECUTE FUNCTION public.ask_aar_snapshots_after_insert();
CREATE TRIGGER ask_aar_snapshots_nochange BEFORE UPDATE OR DELETE ON public.ask_aar_snapshots FOR EACH ROW EXECUTE FUNCTION public.ask_aar_snapshots_no_change();
CREATE TRIGGER ask_aar_snapshots_notruncate BEFORE TRUNCATE ON public.ask_aar_snapshots FOR EACH STATEMENT EXECUTE FUNCTION public.ask_aar_snapshots_no_change();

INSERT INTO audit_log(session_title, engine, notes)
VALUES ('ASK 493: ask_aar_snapshots table created (insert-only, seat 36 only, audit on insert)', 'W4_2026_11_06',
 'card=' || coalesce(current_setting('truth.card', true),'NONE') || ' | session=' || coalesce(current_setting('truth.session_id', true),'NONE')
 || ' | table, RLS no policy, SELECT to service_role and lab_seat only, triggers bi/ai/nochange/notruncate');

DO $c$ BEGIN
  IF to_regclass('public.ask_aar_snapshots') IS NULL THEN RAISE EXCEPTION 'ASK 493 step: table missing'; END IF;
  IF has_table_privilege('anon','public.ask_aar_snapshots','insert') OR has_table_privilege('anon','public.ask_aar_snapshots','select')
     OR has_table_privilege('authenticated','public.ask_aar_snapshots','insert') OR has_table_privilege('authenticated','public.ask_aar_snapshots','select') THEN
    RAISE EXCEPTION 'ASK 493 step: anon or authenticated has access'; END IF;
  IF (SELECT count(*) FROM pg_trigger WHERE tgrelid='public.ask_aar_snapshots'::regclass AND NOT tgisinternal) <> 4 THEN RAISE EXCEPTION 'ASK 493 step: trigger count is not 4'; END IF;
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid='public.ask_aar_snapshots'::regclass) THEN RAISE EXCEPTION 'ASK 493 step: RLS off'; END IF;
END $c$;
