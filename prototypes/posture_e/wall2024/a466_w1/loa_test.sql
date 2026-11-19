begin;
create temp table app_state (key text, value text) on commit drop;
create temp table audit_log (id serial, session_date date, session_title text, engine text, notes text) on commit drop;
CREATE OR REPLACE FUNCTION pg_temp.loa()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_temp, public
AS $function$
DECLARE
  v_key text; v_old text; v_new text;
  v_old_armed boolean; v_new_armed boolean; v_event text;
BEGIN
  BEGIN
    v_key := CASE WHEN TG_OP = 'DELETE' THEN OLD.key ELSE NEW.key END;
    -- BB-2968 P1: population is the key-name syntax, 15 keys at 2026-09-22 (BB-2984)
    IF v_key ~ '_(authorized|authorized_id|override)$' THEN
      IF TG_OP IN ('UPDATE', 'DELETE') THEN v_old := btrim(OLD.value, '"'); END IF;
      IF TG_OP IN ('INSERT', 'UPDATE') THEN v_new := btrim(NEW.value, '"'); END IF;
      IF TG_OP <> 'UPDATE' OR v_old IS DISTINCT FROM v_new THEN
        -- armed = 'true'; an *_authorized_id key is armed by any value other than none/false/empty
        v_old_armed := coalesce(v_old = 'true'
                         OR (v_key ~ '_authorized_id$' AND v_old NOT IN ('', 'none', 'false')), false);
        v_new_armed := coalesce(v_new = 'true'
                         OR (v_key ~ '_authorized_id$' AND v_new NOT IN ('', 'none', 'false')), false);
        v_event := CASE WHEN v_new_armed AND NOT v_old_armed THEN 'ARMED'
                        WHEN v_old_armed AND NOT v_new_armed THEN 'DISARMED'
                        ELSE 'CHANGED' END;
        INSERT INTO audit_log (session_date, session_title, engine, notes)
        VALUES (
          (NOW() AT TIME ZONE 'America/Chicago')::date,
          'OVERRIDE ' || v_event || ': ' || v_key,
          'log_override_arming',
          'key=' || v_key || ' | op=' || TG_OP || ' | event=' || v_event
          || ' | old=' || coalesce(quote_literal(v_old), 'NULL')
          || ' | new=' || coalesce(quote_literal(v_new), 'NULL')
          || ' | application_name=' || coalesce(current_setting('application_name', true), '?')
          || ' | session_user=' || session_user
          || ' | current_user=' || coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'role', nullif(current_setting('role', true), 'none'), session_user::text)
          || ' | client_addr=' || coalesce(inet_client_addr()::text, 'local')
        );
      END IF;
    END IF;
  EXCEPTION WHEN SQLSTATE 'P3R01' THEN RAISE; -- BB-2833 P3: the refusal passes through (2905)
    WHEN OTHERS THEN
    NULL;  -- logging must never block the write itself
  END;
  RETURN NULL;
END;
$function$;
create trigger t after insert or update or delete on app_state for each row execute function pg_temp.loa();
select set_config('request.jwt.claims','{"role":"anon"}',true);
insert into app_state values ('ask466_test_override','"true"');
select set_config('request.jwt.claims','',true);
update app_state set value='false' where key='ask466_test_override';
insert into app_state values ('plain_key','true');
select json_agg(json_build_object('t',session_title,'cu',substring(notes from 'current_user=([^ |]+)'),'su',substring(notes from 'session_user=([^ |]+)')) order by id) from audit_log;
rollback;