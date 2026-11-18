-- ASK 421 build (W1), plan rev 1 W2 8842, W3 grade 8845 (C1 Central date, C2 read-through past max refused, C3 p_summary).
-- Creates three functions. Changes no existing function body, drops nothing. Applied only on the operator's card in W4's thread.

-- (a) the stamp, from the database clock
CREATE OR REPLACE FUNCTION public.wall_stamp()
 RETURNS text LANGUAGE sql STABLE
AS $f$ SELECT '⏱ ' || to_char(now() at time zone 'America/Chicago','HH24:MI') || ' CST | ' || to_char(now() at time zone 'America/Chicago','YYYY-MM-DD') $f$;

-- (c) wall_reply with a read-through id: a new six-argument overload with no defaults; the five-argument form is untouched
CREATE OR REPLACE FUNCTION public.wall_reply(p_root bigint, p_body text, p_by text, p_session text, p_kind text, p_read_through bigint)
 RETURNS jsonb LANGUAGE plpgsql
AS $f$
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
  v_res := public.wall_reply(p_root, p_body, p_by, p_session, p_kind);
  RETURN v_res || jsonb_build_object('read_through',p_read_through);
END; $f$;

-- (b) engine manual apply: preview (p_write false) or write (p_write true) a new version from ordered {old,new} pairs
CREATE OR REPLACE FUNCTION public.engine_manual_apply(p_base_version integer, p_base_md5 text, p_pairs jsonb,
  p_expect_md5 text, p_expect_len integer, p_title text, p_summary text, p_log text, p_write boolean)
 RETURNS jsonb LANGUAGE plpgsql
AS $f$
DECLARE v_max int; v_txt text; v_pair jsonb; v_old text; v_new text; v_cnt int; v_i int := 0;
        v_counts jsonb := '[]'::jsonb; v_md5 text; v_len int; v_id bigint;
BEGIN
  SELECT max(version) INTO v_max FROM engine_manual;
  IF p_base_version IS DISTINCT FROM v_max THEN
    RETURN jsonb_build_object('success',false,'error','base version '||coalesce(p_base_version::text,'null')||' is not the max version '||v_max);
  END IF;
  SELECT content INTO v_txt FROM engine_manual WHERE version = v_max ORDER BY id DESC LIMIT 1;
  IF md5(v_txt) IS DISTINCT FROM p_base_md5 THEN
    RETURN jsonb_build_object('success',false,'error','base md5 '||md5(v_txt)||' is not '||coalesce(p_base_md5,'null'));
  END IF;
  IF jsonb_typeof(p_pairs) IS DISTINCT FROM 'array' OR jsonb_array_length(p_pairs) = 0 THEN
    RETURN jsonb_build_object('success',false,'error','pairs must be a non-empty json array of {old,new}');
  END IF;
  FOR v_pair IN SELECT value FROM jsonb_array_elements(p_pairs) LOOP
    v_i := v_i + 1;
    v_old := v_pair->>'old'; v_new := v_pair->>'new';
    IF v_old IS NULL OR v_old = '' OR v_new IS NULL THEN
      RETURN jsonb_build_object('success',false,'error','pair '||v_i||' lacks old or new text','pair',v_i);
    END IF;
    v_cnt := (length(v_txt) - length(replace(v_txt, v_old, ''))) / length(v_old);
    v_counts := v_counts || to_jsonb(v_cnt);
    IF v_cnt <> 1 THEN
      RETURN jsonb_build_object('success',false,'error','pair '||v_i||': old text occurs '||v_cnt||' times, not once','pair',v_i,'counts',v_counts);
    END IF;
    v_txt := replace(v_txt, v_old, v_new);
  END LOOP;
  v_md5 := md5(v_txt); v_len := length(v_txt);
  IF NOT coalesce(p_write,false) THEN
    RETURN jsonb_build_object('success',true,'preview',true,'md5',v_md5,'length',v_len,'counts',v_counts,'base_version',v_max);
  END IF;
  IF v_md5 IS DISTINCT FROM p_expect_md5 OR v_len IS DISTINCT FROM p_expect_len THEN
    RETURN jsonb_build_object('success',false,'error','result md5 '||v_md5||' length '||v_len||' is not the expected '||coalesce(p_expect_md5,'null')||' / '||coalesce(p_expect_len::text,'null'));
  END IF;
  IF coalesce(btrim(p_title),'') = '' OR coalesce(btrim(p_summary),'') = '' OR coalesce(btrim(p_log),'') = '' THEN
    RETURN jsonb_build_object('success',false,'error','title, summary and log are required to write');
  END IF;
  INSERT INTO engine_manual (version, content, summary) VALUES (v_max + 1, v_txt, p_summary) RETURNING id INTO v_id;
  INSERT INTO engine_manual_log (version, entry_date, title, content, char_len)
    VALUES (v_max + 1, (now() at time zone 'America/Chicago')::date, p_title, p_log, v_len);
  RETURN jsonb_build_object('success',true,'written',true,'id',v_id,'version',v_max + 1,'md5',v_md5,'length',v_len,'counts',v_counts);
END; $f$;

-- W3 8855 condition: only the database owner (the seats' SQL path) runs the manual writer
REVOKE EXECUTE ON FUNCTION public.engine_manual_apply(integer,text,jsonb,text,integer,text,text,text,boolean) FROM PUBLIC, anon, authenticated;
