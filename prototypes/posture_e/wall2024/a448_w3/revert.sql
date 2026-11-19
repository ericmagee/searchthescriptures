DROP TRIGGER IF EXISTS wall_2024_guard_trg ON public.the_wall;
DROP FUNCTION IF EXISTS public.wall_2024_guard();
DROP FUNCTION IF EXISTS public.wall_2024_check(text, boolean, timestamptz);
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
  v_res := public.wall_reply(p_root, p_body, p_by, p_session, p_kind);
  RETURN v_res || jsonb_build_object('read_through',p_read_through);
END; $function$;
