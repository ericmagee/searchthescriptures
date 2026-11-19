CREATE OR REPLACE FUNCTION public.wall_2024_check(p_body text, p_rt_ok boolean, p_now timestamptz)
 RETURNS text LANGUAGE plpgsql STABLE AS $f$
DECLARE s text; ts timestamp; g boolean; pl boolean; h text;
BEGIN
  IF NOT coalesce(p_rt_ok,false) THEN
    RETURN 'ASK 451: root 2024 takes posts only through wall_reply(root, body, by, session, kind, read_through).';
  END IF;
  s := substring(p_body from '⏱ ([0-2][0-9]:[0-5][0-9] C[SD]T \| 20[0-9]{2}-[01][0-9]-[0-3][0-9])\s*$');
  IF s IS NULL THEN
    RETURN 'ASK 451: the post must end with the database stamp; append wall_stamp().';
  END IF;
  ts := to_timestamp(split_part(s,' | ',2)||' '||split_part(s,' ',1),'YYYY-MM-DD HH24:MI')::timestamp;
  IF abs(extract(epoch FROM (ts - (p_now AT TIME ZONE 'America/Chicago')))) > 120 THEN
    RETURN 'ASK 451: the stamp '||s||' is more than 2 minutes from the database clock ('||to_char(p_now AT TIME ZONE 'America/Chicago','HH24:MI YYYY-MM-DD')||'); append wall_stamp().';
  END IF;
  h := regexp_replace(left(p_body,400), '\m(for|to|please|your|their|my|a|the|his)\s+(re)?grades?\M', '', 'gi');
  g := h ~* '\m(re)?grades?\M' AND p_body ~ '\m(PASS|FAIL)\M';
  IF g AND p_body !~ '\m(?=[0-9a-f]*[0-9])(?=[0-9a-f]*[a-f])[0-9a-f]{8,40}\M' THEN
    RETURN 'ASK 449: a grade (GRADE in its first 400 characters, with PASS or FAIL) names the commit of what it judged (8 or more hex characters).';
  END IF;
  IF g AND p_body !~ 'RULES READ:' THEN
    RETURN 'ASK 448: a grade carries a line RULES READ: naming each manual section whose rules the change touches, read in full.';
  END IF;
  pl := left(p_body,400) ~ '\mPLANS? rev' AND NOT g;
  IF pl AND p_body !~ '\mSEARCH' THEN
    RETURN 'ASK 450: a plan carries SEARCH: what was searched before the scope was set.';
  END IF;
  RETURN NULL;
END $f$;

CREATE OR REPLACE FUNCTION public.wall_2024_guard()
 RETURNS trigger LANGUAGE plpgsql AS $f$
DECLARE r text;
BEGIN
  IF NEW.root_id = 2024 THEN
    r := public.wall_2024_check(NEW.body, current_setting('wall.read_through_ok', true) = '1', now());
    IF r IS NOT NULL THEN RAISE EXCEPTION '%', r; END IF;
  END IF;
  RETURN NEW;
END $f$;

DROP TRIGGER IF EXISTS wall_2024_guard_trg ON public.the_wall;
CREATE TRIGGER wall_2024_guard_trg BEFORE INSERT ON public.the_wall FOR EACH ROW EXECUTE FUNCTION public.wall_2024_guard();

CREATE OR REPLACE FUNCTION public.wall_reply(p_root bigint, p_body text, p_by text, p_session text, p_kind text, p_read_through bigint)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE v_max bigint; v_later bigint[]; v_res jsonb;
BEGIN
  IF p_read_through IS NULL THEN
    RETURN jsonb_build_object('success',false,'error','read_through is required on this form');
  END IF;
  SELECT max(id) INTO v_max FROM the_wall;
  IF p_read_through > v_max THEN
    RETURN jsonb_build_object('success',false,'error','read_through '||p_read_through||' is past the last post '||v_max);
  END IF;
  SELECT array_agg(id ORDER BY id) INTO v_later FROM (SELECT id FROM the_wall WHERE id > p_read_through ORDER BY id LIMIT 20) s;
  IF v_later IS NOT NULL THEN
    RETURN jsonb_build_object('success',false,'later',to_jsonb(v_later),
      'error','LATE: posts after '||p_read_through||': '||array_to_string(v_later,', ')||'. Re-read and resend.');
  END IF;
  PERFORM set_config('wall.read_through_ok','1',true);
  v_res := public.wall_reply(p_root, p_body, p_by, p_session, p_kind);
  PERFORM set_config('wall.read_through_ok','',true);
  RETURN v_res || jsonb_build_object('read_through',p_read_through);
END; $function$;
