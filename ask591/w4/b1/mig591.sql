-- ASK 591 migration (W4): the judge order lives in one table; the engine reads it at run start; the dashboard sets it.
-- Plan ask591/w3/plan591.md rev 4. Seeded from the live Init Seats ORDER0 and __ALT (engine 489b977b):
--   panel list: chatgpt, sol, sol62;  alternate list: gemini, spark, qwen4max, argon, sonnet.
-- Run as ONE call with SET LOCAL truth.session_id first, on the operator's card only.

CREATE TABLE public.odv1_judge_order (
  seat text PRIMARY KEY REFERENCES public.model_config(seat),
  list text NOT NULL CHECK (list IN ('panel','alternate')),
  ord  integer NOT NULL CHECK (ord >= 1),
  UNIQUE (list, ord)
);
CREATE TABLE public.odv1_judge_order_log (
  id bigserial PRIMARY KEY,
  saved_at timestamptz NOT NULL DEFAULT now(),
  saved_by text NOT NULL,
  before jsonb,
  after jsonb NOT NULL
);
ALTER TABLE public.odv1_judge_order ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.odv1_judge_order_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.odv1_judge_order, public.odv1_judge_order_log FROM PUBLIC, anon, authenticated;
REVOKE ALL ON SEQUENCE public.odv1_judge_order_log_id_seq FROM PUBLIC, anon, authenticated;

INSERT INTO public.odv1_judge_order (seat, list, ord) VALUES
  ('chatgpt','panel',1), ('sol','panel',2), ('sol62','panel',3),
  ('gemini','alternate',1), ('spark','alternate',2), ('qwen4max','alternate',3), ('argon','alternate',4), ('sonnet','alternate',5);

-- The two lists, in order, as one object.
CREATE OR REPLACE FUNCTION public.odv1_judge_order_lists()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $f$
  SELECT jsonb_build_object(
    'panel',     coalesce((SELECT jsonb_agg(seat ORDER BY ord) FROM odv1_judge_order WHERE list='panel'), '[]'::jsonb),
    'alternate', coalesce((SELECT jsonb_agg(seat ORDER BY ord) FROM odv1_judge_order WHERE list='alternate'), '[]'::jsonb));
$f$;
REVOKE ALL ON FUNCTION public.odv1_judge_order_lists() FROM PUBLIC, anon, authenticated;

-- The checks every order must pass: at the save (refuse) and at the engine's read (stop the run before any model call).
CREATE OR REPLACE FUNCTION public.odv1_judge_order_fault(p_panel text[], p_alt text[])
RETURNS text LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $f$
DECLARE v_all text[] := coalesce(p_panel,'{}') || coalesce(p_alt,'{}'); s text; v_src text; v_act int;
BEGIN
  IF cardinality(v_all) = 0 THEN RETURN 'the order is empty'; END IF;
  IF (SELECT count(DISTINCT x) FROM unnest(v_all) x) <> cardinality(v_all) THEN RETURN 'a seat stands twice'; END IF;
  FOREACH s IN ARRAY v_all LOOP
    IF NOT EXISTS (SELECT 1 FROM model_config WHERE seat = s AND active AND role = 'engine') THEN RETURN 'seat '||s||' has no active model_config row'; END IF;
  END LOOP;
  SELECT count(*) INTO v_act FROM unnest(coalesce(p_panel,'{}')) x;
  IF v_act < 3 THEN RETURN 'the panel list holds '||v_act||' seat(s); it needs at least three'; END IF;
  -- The reserve recorder admits only the seats it names (ASK 591 L3): every seat that could stand fourth must be on its list.
  SELECT prosrc INTO v_src FROM pg_proc WHERE oid = 'public.odv1_record_panel_substitution'::regproc;
  FOREACH s IN ARRAY v_all LOOP
    IF position(''''||s||'''' in v_src) = 0 THEN RETURN 'seat '||s||' is not on the reserve recorder''s list (odv1_record_panel_substitution)'; END IF;
  END LOOP;
  RETURN NULL;
END $f$;
REVOKE ALL ON FUNCTION public.odv1_judge_order_fault(text[],text[]) FROM PUBLIC, anon, authenticated;

-- The engine's read (node "Judge Order Read"). Raises, so the run stops before any model call.
CREATE OR REPLACE FUNCTION public.odv1_judge_order_read()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $f$
DECLARE l jsonb := odv1_judge_order_lists(); p text[]; a text[]; f text; v bigint;
BEGIN
  p := ARRAY(SELECT jsonb_array_elements_text(l->'panel')); a := ARRAY(SELECT jsonb_array_elements_text(l->'alternate'));
  f := odv1_judge_order_fault(p, a);
  IF f IS NOT NULL THEN RAISE EXCEPTION 'JUDGE ORDER: the order table could not be read (%); no call was made', f; END IF;
  SELECT max(id) INTO v FROM odv1_judge_order_log;
  RETURN jsonb_build_object('panel', l->'panel', 'alternate', l->'alternate', 'version', coalesce(v,0));
END $f$;
REVOKE ALL ON FUNCTION public.odv1_judge_order_read() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.odv1_judge_order_read() TO service_role, lab_seat;

-- The save (dashboard, through dash_api). Refuses and changes nothing unless every check passes; no seat added or dropped.
CREATE OR REPLACE FUNCTION public.odv1_judge_order_save(p_panel jsonb, p_alt jsonb, p_by text)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path TO 'public' AS $f$
DECLARE p text[]; a text[]; f text; v_before jsonb; v_id bigint; i int;
BEGIN
  IF jsonb_typeof(p_panel) <> 'array' OR jsonb_typeof(p_alt) <> 'array' THEN RETURN jsonb_build_object('error','the two lists must be arrays'); END IF;
  p := ARRAY(SELECT jsonb_array_elements_text(p_panel)); a := ARRAY(SELECT jsonb_array_elements_text(p_alt));
  IF (SELECT array_agg(x ORDER BY x) FROM unnest(p || a) x) IS DISTINCT FROM (SELECT array_agg(seat ORDER BY seat) FROM odv1_judge_order) THEN
    RETURN jsonb_build_object('error','the order must hold exactly the seats it holds now, each once; a seat is added or dropped only by its own ASK');
  END IF;
  f := odv1_judge_order_fault(p, a);
  IF f IS NOT NULL THEN RETURN jsonb_build_object('error', f); END IF;
  v_before := odv1_judge_order_lists();
  LOCK TABLE odv1_judge_order IN EXCLUSIVE MODE;
  DELETE FROM odv1_judge_order;
  FOR i IN 1 .. cardinality(p) LOOP INSERT INTO odv1_judge_order VALUES (p[i],'panel',i); END LOOP;
  FOR i IN 1 .. coalesce(cardinality(a),0) LOOP INSERT INTO odv1_judge_order VALUES (a[i],'alternate',i); END LOOP;
  INSERT INTO odv1_judge_order_log (saved_by, before, after) VALUES (coalesce(nullif(p_by,''),'dashboard'), v_before, odv1_judge_order_lists()) RETURNING id INTO v_id;
  RETURN jsonb_build_object('ok', true, 'version', v_id, 'order', odv1_judge_order_lists());
END $f$;
REVOKE ALL ON FUNCTION public.odv1_judge_order_save(jsonb,jsonb,text) FROM PUBLIC, anon, authenticated;

-- What the page shows for each seat.
CREATE OR REPLACE FUNCTION public.dash_judge_order()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $f$
  SELECT jsonb_build_object(
    'version', (SELECT max(id) FROM odv1_judge_order_log),
    'saved_at', (SELECT saved_at FROM odv1_judge_order_log ORDER BY id DESC LIMIT 1),
    'seats', coalesce((SELECT jsonb_agg(jsonb_build_object('seat',o.seat,'list',o.list,'ord',o.ord,'api_model',m.api_model,'family',m.family,
        'active',coalesce(m.active,false),'jfl_move',coalesce(m.jfl_move,false),'jfl_counts',m.jfl_counts) ORDER BY o.list DESC, o.ord)
      FROM odv1_judge_order o LEFT JOIN model_config_jfl m ON m.seat = o.seat), '[]'::jsonb));
$f$;
REVOKE ALL ON FUNCTION public.dash_judge_order() FROM PUBLIC, anon, authenticated;

-- The line-up a run would seat now (a copy of Init Seats' drawing and Resolve Seats' filters; test T2 compares the two).
-- p_order and p_moved are for the tests only; the page passes NULL and gets the table and the fault ledger.
CREATE OR REPLACE FUNCTION public.dash_judge_lineup(p_def text, p_ch text, p_order jsonb DEFAULT NULL, p_moved text[] DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $f$
DECLARE
  -- Init Seats' constants (engine 489b977b): NOT_PANEL, FAM_PANEL, JUDGE_TIME_REMOVED, the single judge's "not sonnet".
  NOT_PANEL constant text[] := ARRAY['deepseek','qwen'];
  TIME_REMOVED constant text[] := ARRAY['qwen'];
  FAM constant jsonb := '{"chatgpt":"openai","sol":"openai","sol62":"openai","luna":"openai","grok":"xai","gemini":"google","hydrogen":"google","argon":"google","spark":"meta","ember":"meta","ernie":"baidu","sonnet":"anthropic","claude":"anthropic","opus":"anthropic","glm":"zhipu","qwen":"qwen","qwen4max":"qwen","glm_legal":"zhipu","hy4":"tencent","hy4_flash":"tencent"}';
  JFAM_OR constant text[] := ARRAY['gemini','grok','chatgpt','mimo','glm','alt_minimax31','qwen','sol','sol62','luna','argon','hydrogen','spark','ernie','ember','glm_legal','qwen4max','hy4','hy4_flash','sonnet'];
  l jsonb := coalesce(p_order, odv1_judge_order_lists());
  pan text[]; alt text[]; ord0 text[]; moved text[]; dfam text[]; bothc boolean; deb text[];
  free text[] := '{}'; pfree0 text[] := '{}'; pfree text[]; panel text[]; reserve text; alts text[] := '{}'; sj text;
  dropped jsonb := '{}'::jsonb; s text; f text; dmc text[]; mfam text[];
BEGIN
  pan := ARRAY(SELECT jsonb_array_elements_text(l->'panel')); alt := ARRAY(SELECT jsonb_array_elements_text(l->'alternate'));
  ord0 := pan || alt;
  moved := coalesce(p_moved, ARRAY(SELECT seat FROM model_config_jfl WHERE active AND jfl_move));
  deb := ARRAY[lower(btrim(p_def)), lower(btrim(p_ch))];
  dfam := ARRAY(SELECT FAM->>x FROM unnest(deb) x WHERE FAM ? x);
  bothc := coalesce((FAM->>deb[1]) = 'anthropic' AND (FAM->>deb[2]) = 'anthropic', false);  -- a debater outside FAM (mimo) gives NULL; NULL must read as false
  FOREACH s IN ARRAY ord0 LOOP
    IF s = ANY (deb) THEN dropped := dropped || jsonb_build_object(s, 'is a debater'); ELSE free := free || s; END IF;
  END LOOP;
  FOREACH s IN ARRAY free LOOP
    f := FAM->>s;
    IF s = ANY (NOT_PANEL) THEN IF NOT dropped ? s THEN dropped := dropped || jsonb_build_object(s,'not a panel seat'); END IF;
    ELSIF f IS NOT NULL AND f = ANY (dfam) AND NOT (f = 'anthropic' AND bothc) THEN IF NOT dropped ? s THEN dropped := dropped || jsonb_build_object(s,'family '||f||' debates in this debate'); END IF;
    ELSE pfree0 := pfree0 || s; END IF;
  END LOOP;
  pfree := ARRAY(SELECT x FROM unnest(pfree0) WITH ORDINALITY u(x,n) WHERE NOT (x = ANY (moved)) AND NOT (x = ANY (alt)) ORDER BY n)
        || ARRAY(SELECT x FROM unnest(pfree0) WITH ORDINALITY u(x,n) WHERE (x = ANY (moved)) AND NOT (x = ANY (alt)) ORDER BY n)
        || ARRAY(SELECT x FROM unnest(pfree0) WITH ORDINALITY u(x,n) WHERE x = ANY (alt) ORDER BY n);
  panel := pfree[1:3];
  IF coalesce(cardinality(panel),0) <> 3 THEN
    RETURN jsonb_build_object('error','NOT GRADED: the derived panel is '||coalesce(cardinality(panel),0)||' seat(s); the roster is exactly three', 'dropped', dropped);
  END IF;
  FOREACH s IN ARRAY panel LOOP IF NOT dropped ? s THEN dropped := dropped || jsonb_build_object(s,'sits on the panel'); END IF; END LOOP;
  -- Resolve Seats: debaters' families from model_config (claude is seat claude_synthesis).
  dmc := ARRAY(SELECT CASE x WHEN 'claude' THEN 'claude_synthesis' WHEN 'deepseek' THEN 'deepseek_debate' ELSE x END FROM unnest(deb) x);
  mfam := ARRAY(SELECT coalesce(lower(btrim(m.family)),'') FROM unnest(dmc) WITH ORDINALITY u(x,n) LEFT JOIN model_config m ON m.seat = u.x ORDER BY n);  -- as Resolve Seats: no row or no family reads as ''
  IF cardinality(pfree) > 3 AND NOT (pfree[4] = ANY (TIME_REMOVED)) AND NOT (pfree[4] = ANY (moved)) THEN
    reserve := pfree[4];
    IF NOT EXISTS (SELECT 1 FROM model_config m WHERE m.seat = reserve AND m.active AND m.api_model IS NOT NULL AND coalesce(m.max_tokens,0) > 0
                   AND ((coalesce(lower(btrim(m.family)),'') = 'anthropic' AND mfam <@ ARRAY['anthropic']) OR NOT (coalesce(lower(btrim(m.family)),'') = ANY (mfam)))) THEN reserve := NULL; END IF;
  END IF;
  FOREACH s IN ARRAY coalesce(pfree[4:], '{}') LOOP
    IF NOT (s = ANY (JFAM_OR)) THEN IF NOT dropped ? s THEN dropped := dropped || jsonb_build_object(s,'not an OpenRouter seat'); END IF; CONTINUE; END IF;
    IF s = 'mimo' THEN IF NOT dropped ? s THEN dropped := dropped || jsonb_build_object(s,'mimo is never an alternate'); END IF; CONTINUE; END IF;
    IF s = ANY (TIME_REMOVED) THEN IF NOT dropped ? s THEN dropped := dropped || jsonb_build_object(s,'removed for judge time'); END IF; CONTINUE; END IF;
    IF EXISTS (SELECT 1 FROM model_config m WHERE m.seat = s AND m.active AND m.api_model IS NOT NULL AND coalesce(m.max_tokens,0) > 0
               AND ((coalesce(lower(btrim(m.family)),'') = 'anthropic' AND mfam <@ ARRAY['anthropic']) OR NOT (coalesce(lower(btrim(m.family)),'') = ANY (mfam)))) THEN alts := alts || s; END IF;
  END LOOP;
  SELECT x INTO sj FROM unnest(free) WITH ORDINALITY u(x,n)
   WHERE x <> 'sonnet' AND NOT (x = ANY (TIME_REMOVED)) AND NOT (coalesce(FAM->>x,'') <> '' AND (FAM->>x) = ANY (dfam)) ORDER BY n LIMIT 1;
  RETURN jsonb_build_object('panel', to_jsonb(panel), 'reserve', reserve, 'alternates', to_jsonb(alts), 'single_judge', sj,
    'moved', to_jsonb(moved), 'dropped', dropped, 'version', (SELECT max(id) FROM odv1_judge_order_log),
    'note', 'As the engine would seat it now. A seat that does not accept the posture at the run''s start is left out then; the page cannot know that before the run.');
END $f$;
REVOKE ALL ON FUNCTION public.dash_judge_lineup(text,text,jsonb,text[]) FROM PUBLIC, anon, authenticated;

INSERT INTO public.odv1_judge_order_log (saved_by, before, after) VALUES ('ASK 591 seed (live Init Seats order)', NULL, public.odv1_judge_order_lists());

-- dash_api gains three actions (password-gated like every other action).
DO $d$ DECLARE f text := pg_get_functiondef('public.dash_api(text,text,jsonb)'::regprocedure);
  a text := $a$    ELSE jsonb_build_object('error','unknown action')$a$;
BEGIN
  IF position(a in f) = 0 THEN RAISE EXCEPTION 'ASK 591: dash_api anchor not found'; END IF;
  EXECUTE replace(f, a, $n$    WHEN 'judge_order'      THEN dash_judge_order()  -- ASK 591
    WHEN 'judge_order_save' THEN odv1_judge_order_save(p_arg->'p_panel', p_arg->'p_alt', 'dashboard')  -- ASK 591
    WHEN 'judge_lineup'     THEN dash_judge_lineup(p_arg->>'p_def', p_arg->>'p_ch')  -- ASK 591
$n$ || a);
END $d$;
