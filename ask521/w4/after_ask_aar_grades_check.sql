CREATE OR REPLACE FUNCTION public.ask_aar_grades_check()
 RETURNS TABLE(snapshot_id bigint, md5 text, pass_seats text[], proof_seats text[], n integer, ok boolean, detail text)
 LANGUAGE plpgsql
 STABLE
 SET "TimeZone" TO 'UTC'
 SET "DateStyle" TO 'ISO, MDY'
AS $function$
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
        (cardinality(allp) >= 1 AND NOT bad AND (cardinality(via) = 0 OR cardinality(proofs) >= 1)),
        (CASE WHEN bad THEN 'a FAIL or FAIL ON FORM element on this md5 or its target' WHEN cardinality(allp) < 1 THEN 'no non-builder PASS seat' ELSE '' END
         || CASE WHEN cardinality(proofs) = 1 THEN ' | one-seat proof: ' || proofs[1] ELSE '' END)::text;
    END LOOP;
  END LOOP;
END $function$
;
