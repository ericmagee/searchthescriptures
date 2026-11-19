-- revert: the live texts read 11-19 (md5 of pg_get_functiondef: engine_manual_guard 6d0aefc2, operational_doc_guard 8821ddbb)
BEGIN;
CREATE OR REPLACE FUNCTION public.engine_manual_guard()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_override text;
BEGIN
  IF TG_OP IN ('UPDATE','DELETE') THEN
    SELECT value INTO v_override FROM app_state WHERE key = 'engine_manual_mutation_authorized';

    IF v_override IS DISTINCT FROM 'true' THEN
      RAISE EXCEPTION
        'engine_manual is append-only. % blocked. To revise, INSERT a new version (bump version). If you genuinely must mutate in place, the operator must first: UPDATE app_state SET value=''true'' WHERE key=''engine_manual_mutation_authorized'';',
        TG_OP;
    END IF;

    UPDATE app_state SET value = 'false' WHERE key = 'engine_manual_mutation_authorized';
    INSERT INTO audit_log (session_date, session_title, engine, notes)
    VALUES (CURRENT_DATE,
            'GUARD: engine_manual ' || TG_OP || ' AUTHORIZED via one-shot override',
            'db-trigger',
            'In-place ' || TG_OP || ' on engine_manual permitted by engine_manual_mutation_authorized. '
            || 'old_version=' || COALESCE(OLD.version::text,'?')
            || ' old_hash=' || COALESCE(left(md5(OLD.content),12),'?'));

    IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
  END IF;

  INSERT INTO audit_log (session_date, session_title, engine, notes)
  VALUES (CURRENT_DATE,
          'GUARD: engine_manual v' || NEW.version || ' inserted',
          'db-trigger',
          'AUTO-GUARD engine_manual INSERT — version=' || NEW.version
          || ' hash=' || left(md5(NEW.content),12)
          || ' len=' || length(NEW.content)
          || '. This row is written by the trigger regardless of whether the editing model logged its own intent row.');
  RETURN NEW;
END;
$function$
;
CREATE OR REPLACE FUNCTION public.operational_doc_guard()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_override text;
BEGIN
  IF TG_OP IN ('UPDATE','DELETE') THEN
    -- In-place mutation of an existing version is forbidden by default.
    -- The operator may authorize a one-shot exception via app_state; it self-resets.
    SELECT value INTO v_override FROM app_state WHERE key = 'operational_doc_mutation_authorized';

    IF v_override IS DISTINCT FROM 'true' THEN
      RAISE EXCEPTION
        'operational_doc is append-only. % blocked. To revise, INSERT a new version (bump version). If you genuinely must mutate in place, the operator must first: UPDATE app_state SET value=''true'' WHERE key=''operational_doc_mutation_authorized'';',
        TG_OP;
    END IF;

    -- Authorized path: consume the one-shot flag and record that an in-place mutation was permitted.
    UPDATE app_state SET value = 'false' WHERE key = 'operational_doc_mutation_authorized';
    INSERT INTO audit_log (session_date, session_title, engine, notes)
    VALUES (CURRENT_DATE,
            'GUARD: operational_doc ' || TG_OP || ' AUTHORIZED via one-shot override',
            'db-trigger',
            'In-place ' || TG_OP || ' on operational_doc permitted by operational_doc_mutation_authorized. '
            || 'old_version=' || COALESCE(OLD.version::text,'?')
            || ' old_hash=' || COALESCE(left(md5(OLD.content),12),'?'));

    IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
  END IF;

  -- INSERT (AFTER): the legal edit path. Force a record so a change can never be silent.
  INSERT INTO audit_log (session_date, session_title, engine, notes)
  VALUES (CURRENT_DATE,
          'GUARD: operational_doc v' || NEW.version || ' inserted',
          'db-trigger',
          'AUTO-GUARD operational_doc INSERT — version=' || NEW.version
          || ' hash=' || left(md5(NEW.content),12)
          || ' len=' || length(NEW.content)
          || '. This row is written by the trigger regardless of whether the editing model logged its own intent row.');
  RETURN NEW;
END;
$function$
;
COMMIT;
