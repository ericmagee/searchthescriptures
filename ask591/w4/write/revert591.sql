-- ASK 591 revert (W4). Run the engine revert (revert_eng591.json) FIRST, so no run calls the read. Then this, as ONE call with SET LOCAL truth.session_id first.
DO $d$ DECLARE f text := pg_get_functiondef('public.dash_api(text,text,jsonb)'::regprocedure);
  a text := $n$    WHEN 'judge_order'      THEN dash_judge_order()  -- ASK 591
    WHEN 'judge_order_save' THEN odv1_judge_order_save(p_arg->'p_panel', p_arg->'p_alt', 'dashboard')  -- ASK 591
    WHEN 'judge_lineup'     THEN dash_judge_lineup(p_arg->>'p_def', p_arg->>'p_ch')  -- ASK 591
$n$;
BEGIN
  IF position(a in f) = 0 THEN RAISE EXCEPTION 'ASK 591 revert: dash_api lines not found'; END IF;
  EXECUTE replace(f, a, '');
END $d$;
DROP FUNCTION public.dash_judge_lineup(text,text,jsonb,text[]);
DROP FUNCTION public.dash_judge_order();
DROP FUNCTION public.odv1_judge_order_save(jsonb,jsonb,text);
DROP FUNCTION public.odv1_judge_order_read();
DROP FUNCTION public.odv1_judge_order_fault(text[],text[]);
DROP FUNCTION public.odv1_judge_order_lists();
-- The log is kept as a record unless the operator says to drop it; the order table is dropped.
DROP TABLE public.odv1_judge_order;
