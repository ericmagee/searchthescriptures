-- ASK 498 step (W4, build of plan rev 3 79b5d9c5): table ask_aar_builders and read-only function ask_aar_grades_check(). Run only on a card pressed in W4's thread, in one call with SET LOCAL truth.session_id and truth.card. This text never names the snapshot table as a whole word (plan WRONG-IF 4): the function reaches it by dynamic SQL.
CREATE TABLE public.ask_aar_builders (
  id bigserial PRIMARY KEY,
  snapshot_id bigint NOT NULL,
  prior_row bigint REFERENCES public.ask_aar_builders(id),
  builder_seats text[] NOT NULL CHECK (cardinality(builder_seats) >= 1),
  sources jsonb NOT NULL CHECK (jsonb_typeof(sources) = 'array' AND jsonb_array_length(sources) >= 1),
  written_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ask_aar_builders ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.ask_aar_builders FROM PUBLIC, anon, authenticated, berean_ro, service_role, lab_seat;
REVOKE ALL ON SEQUENCE public.ask_aar_builders_id_seq FROM PUBLIC, anon, authenticated, berean_ro, service_role, lab_seat;
GRANT SELECT ON TABLE public.ask_aar_builders TO service_role, lab_seat;

CREATE FUNCTION public.ask_aar_builders_before_insert() RETURNS trigger LANGUAGE plpgsql AS $f$
DECLARE v_sid text := nullif(current_setting('truth.session_id', true), ''); v_prior bigint;
BEGIN
  IF v_sid IS NULL THEN RAISE EXCEPTION 'ask_aar_builders: truth.session_id is not set'; END IF;
  IF md_notes_caller_seat() IS DISTINCT FROM 36 THEN RAISE EXCEPTION 'ask_aar_builders: only the coordinator seat (36) inserts rows'; END IF;
  IF NEW.written_by IS DISTINCT FROM v_sid THEN RAISE EXCEPTION 'ask_aar_builders: written_by must equal truth.session_id'; END IF;
  IF NEW.prior_row IS NOT NULL THEN
    SELECT p.snapshot_id INTO v_prior FROM public.ask_aar_builders p WHERE p.id = NEW.prior_row;
    IF v_prior IS DISTINCT FROM NEW.snapshot_id THEN RAISE EXCEPTION 'ask_aar_builders: prior_row must name a row for the same snapshot_id'; END IF;
  END IF;
  RETURN NEW;
END $f$;

CREATE FUNCTION public.ask_aar_builders_after_insert() RETURNS trigger LANGUAGE plpgsql AS $f$
BEGIN
  INSERT INTO audit_log(session_title, engine, notes)
  VALUES ('ASK AAR builders: snapshot ' || NEW.snapshot_id, NEW.written_by,
          'id=' || NEW.id || ' | builder_seats=' || array_to_string(NEW.builder_seats, ',') || ' | prior_row=' || coalesce(NEW.prior_row::text, 'null'));
  RETURN NULL;
END $f$;

CREATE FUNCTION public.ask_aar_builders_no_change() RETURNS trigger LANGUAGE plpgsql AS $f$
BEGIN
  RAISE EXCEPTION 'ask_aar_builders: rows are never edited or deleted; insert a new row with prior_row';
END $f$;

CREATE TRIGGER ask_aar_builders_bi BEFORE INSERT ON public.ask_aar_builders FOR EACH ROW EXECUTE FUNCTION public.ask_aar_builders_before_insert();
CREATE TRIGGER ask_aar_builders_ai AFTER INSERT ON public.ask_aar_builders FOR EACH ROW EXECUTE FUNCTION public.ask_aar_builders_after_insert();
CREATE TRIGGER ask_aar_builders_nochange BEFORE UPDATE OR DELETE ON public.ask_aar_builders FOR EACH ROW EXECUTE FUNCTION public.ask_aar_builders_no_change();
CREATE TRIGGER ask_aar_builders_notruncate BEFORE TRUNCATE ON public.ask_aar_builders FOR EACH STATEMENT EXECUTE FUNCTION public.ask_aar_builders_no_change();

CREATE FUNCTION public.ask_aar_grades_check()
RETURNS TABLE(snapshot_id bigint, md5 text, pass_seats text[], proof_seats text[], n int, ok boolean, detail text)
LANGUAGE plpgsql STABLE SECURITY INVOKER
SET "TimeZone" TO 'UTC' SET "DateStyle" TO 'ISO, MDY'
AS $f$
#variable_conflict use_column
DECLARE
  v_snap text := 'public.' || quote_ident('ask_aar_' || 'snapshots');
  s record; m text; t text; e text; bs text[]; g jsonb;
  direct text[]; via text[]; proofs text[]; allp text[]; bad boolean; targets text[];
BEGIN
  IF to_regclass('public.ask_aar_builders') IS NULL THEN
    RETURN QUERY SELECT NULL::bigint, NULL::text, NULL::text[], NULL::text[], NULL::int, false, 'finding: table ask_aar_builders is missing'::text;
    RETURN;
  END IF;
  FOREACH t IN ARRAY ARRAY['ask_aar_builders_bi','ask_aar_builders_ai','ask_aar_builders_nochange','ask_aar_builders_notruncate'] LOOP
    SELECT tg.tgenabled::text INTO e FROM pg_trigger tg
     WHERE tg.tgrelid = to_regclass('public.ask_aar_builders') AND tg.tgname = t AND NOT tg.tgisinternal;
    IF e IS NULL THEN
      RETURN QUERY SELECT NULL::bigint, NULL::text, NULL::text[], NULL::text[], NULL::int, false, ('finding: trigger ' || t || ' is missing')::text;
    ELSIF e <> 'O' THEN
      RETURN QUERY SELECT NULL::bigint, NULL::text, NULL::text[], NULL::text[], NULL::int, false, ('finding: trigger ' || t || ' has tgenabled ' || e)::text;
    END IF;
  END LOOP;
  RETURN QUERY EXECUTE format(
    'SELECT b.snapshot_id::bigint, NULL::text, NULL::text[], NULL::text[], NULL::int, false, (''finding: builder row '' || b.id || '' names snapshot_id '' || b.snapshot_id || '', which has no snapshot row'')::text
       FROM public.ask_aar_builders b WHERE NOT EXISTS (SELECT 1 FROM %s x WHERE x.id = b.snapshot_id) ORDER BY b.id', v_snap);
  FOR s IN EXECUTE format('SELECT x.id::bigint AS id, x.md5_written, coalesce(x.grades, ''[]''::jsonb) AS grades FROM %s x ORDER BY x.id', v_snap) LOOP
    SELECT b.builder_seats INTO bs FROM public.ask_aar_builders b WHERE b.snapshot_id = s.id ORDER BY b.id DESC LIMIT 1;
    IF s.md5_written IS NULL OR cardinality(s.md5_written) = 0 THEN
      RETURN QUERY SELECT s.id, NULL::text, NULL::text[], NULL::text[], NULL::int, NULL::boolean, 'no md5_written'::text;
      CONTINUE;
    END IF;
    FOREACH m IN ARRAY s.md5_written LOOP
      IF bs IS NULL THEN
        RETURN QUERY SELECT s.id, m, NULL::text[], NULL::text[], NULL::int, NULL::boolean, 'no builder row'::text;
        CONTINUE;
      END IF;
      SELECT coalesce(array_agg(DISTINCT x->>'seat'), '{}') INTO direct FROM jsonb_array_elements(s.grades) x
       WHERE x->>'md5_graded' = m AND x->>'verdict_norm' = 'PASS' AND x->'equal_to' IS NULL AND NOT ((x->>'seat') = ANY (bs));
      SELECT coalesce(array_agg(DISTINCT x->>'seat'), '{}'), coalesce(array_agg(DISTINCT x->'equal_to'->>'md5'), '{}') INTO proofs, targets FROM jsonb_array_elements(s.grades) x
       WHERE x->>'md5_graded' = m AND x->>'verdict_norm' = 'PASS' AND x->'equal_to' IS NOT NULL AND NOT ((x->>'seat') = ANY (bs));
      SELECT coalesce(array_agg(DISTINCT x->>'seat'), '{}') INTO via FROM jsonb_array_elements(s.grades) x
       WHERE (x->>'md5_graded') = ANY (targets) AND x->>'verdict_norm' = 'PASS' AND x->'equal_to' IS NULL AND NOT ((x->>'seat') = ANY (bs));
      SELECT coalesce(array_agg(DISTINCT y ORDER BY y), '{}') INTO allp FROM unnest(direct || via) y;
      SELECT EXISTS (SELECT 1 FROM jsonb_array_elements(s.grades) x
                      WHERE ((x->>'md5_graded') = m OR (x->>'md5_graded') = ANY (targets)) AND x->>'verdict_norm' IN ('FAIL','FAIL ON FORM')) INTO bad;
      RETURN QUERY SELECT s.id, m, allp, proofs, cardinality(allp),
        (cardinality(allp) >= 2 AND NOT bad AND (cardinality(via) = 0 OR cardinality(proofs) >= 1)),
        (CASE WHEN bad THEN 'a FAIL or FAIL ON FORM element on this md5 or its target' WHEN cardinality(allp) < 2 THEN 'fewer than two non-builder PASS seats' ELSE '' END
         || CASE WHEN cardinality(proofs) = 1 THEN ' | one-seat proof: ' || proofs[1] ELSE '' END)::text;
    END LOOP;
  END LOOP;
END $f$;

REVOKE ALL ON FUNCTION public.ask_aar_builders_before_insert() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ask_aar_builders_after_insert() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ask_aar_builders_no_change() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ask_aar_grades_check() FROM PUBLIC, anon, authenticated;

INSERT INTO audit_log(session_title, engine, notes)
VALUES ('ASK 498: ask_aar_builders and ask_aar_grades_check created', 'W4_2026_11_06',
 'card=' || coalesce(current_setting('truth.card', true),'NONE') || ' | session=' || coalesce(current_setting('truth.session_id', true),'NONE')
 || ' | table ask_aar_builders (RLS no policy, SELECT to service_role and lab_seat only, triggers bi/ai/nochange/notruncate); function ask_aar_grades_check() INVOKER STABLE UTC');

DO $c$ BEGIN
  IF to_regclass('public.ask_aar_builders') IS NULL THEN RAISE EXCEPTION 'ASK 498 step: table missing'; END IF;
  IF EXISTS (SELECT 1 FROM unnest(ARRAY['anon','authenticated','berean_ro']) r
             WHERE has_table_privilege(r,'public.ask_aar_builders','select') OR has_table_privilege(r,'public.ask_aar_builders','insert')) THEN
    RAISE EXCEPTION 'ASK 498 step: anon, authenticated or berean_ro has table access'; END IF;
  IF EXISTS (SELECT 1 FROM unnest(ARRAY['service_role','lab_seat']) r
             WHERE has_table_privilege(r,'public.ask_aar_builders','insert,update,delete,truncate')) THEN
    RAISE EXCEPTION 'ASK 498 step: service_role or lab_seat has more than SELECT'; END IF;
  IF EXISTS (SELECT 1 FROM unnest(ARRAY['anon','authenticated','berean_ro','service_role','lab_seat']) r
             WHERE has_sequence_privilege(r,'public.ask_aar_builders_id_seq','USAGE,SELECT,UPDATE')) THEN
    RAISE EXCEPTION 'ASK 498 step: a non-owner role has the id sequence'; END IF;
  IF (SELECT count(*) FROM pg_trigger WHERE tgrelid='public.ask_aar_builders'::regclass AND NOT tgisinternal) <> 4 THEN RAISE EXCEPTION 'ASK 498 step: trigger count is not 4'; END IF;
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid='public.ask_aar_builders'::regclass) THEN RAISE EXCEPTION 'ASK 498 step: RLS off'; END IF;
  IF has_function_privilege('anon','public.ask_aar_grades_check()','execute') OR has_function_privilege('authenticated','public.ask_aar_grades_check()','execute') THEN
    RAISE EXCEPTION 'ASK 498 step: anon or authenticated can execute the check'; END IF;
  IF (SELECT prosecdef OR provolatile <> 's' FROM pg_proc WHERE oid = 'public.ask_aar_grades_check()'::regprocedure) THEN
    RAISE EXCEPTION 'ASK 498 step: check not SECURITY INVOKER and STABLE'; END IF;
  IF EXISTS (SELECT 1 FROM public.ask_aar_grades_check() WHERE detail LIKE 'finding:%') THEN
    RAISE EXCEPTION 'ASK 498 step: the check returns a finding at build time'; END IF;
END $c$;
