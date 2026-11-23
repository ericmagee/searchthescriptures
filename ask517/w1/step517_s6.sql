-- ASK 517 S6 (W1 build; plan rev 4 c4221d8e): derive_debate_outcome, ASK 505 C0 STANDING GATE. A counted seat also counts toward the
-- two-or-more when its LAST "[AUDIT v61: ENGINE RESULT -- SEAT: <seat>; ...]" tag in debate_judgments.verdict_raw lists, under
-- BROKEN LINES, a line graded "<side that would prevail> LINK BROKEN". Debates created at or after v_517_from (the write time) only.
-- Asserts the live body md5 2a853df6 and that each edited text occurs once; executes pg_get_functiondef with the new body; reads back.
-- Optional: SET LOCAL ask517.from = '<timestamptz>' fixes v_517_from (used by the rolled-back test only). Without it, v_517_from = now().
DO $s6$
DECLARE
  v_src text; v_def text; v_new text; v_line text; v_new_line text; p int; v_n int;
  v_from text := to_char(coalesce(nullif(current_setting('ask517.from', true), '')::timestamptz, now()) AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS.US') || '+00';
  c_old1 constant text := E'  v_pd int;\n';
  v_new1 text;
  c_snip constant text := $q$ OR (v_created >= v_517_from AND EXISTS (SELECT 1 FROM (SELECT substring(t.x[2] from 'BROKEN LINES ([^;]*)') AS bl FROM regexp_matches(verdict_raw, '\[AUDIT v61: ENGINE RESULT -- SEAT: ([^;\]]*); ([^\]]*)\]', 'g') WITH ORDINALITY AS t(x, n) WHERE t.x[1] = judge_seat ORDER BY t.n DESC LIMIT 1) z WHERE position(CASE WHEN v_outcome = 'CHALLENGER PREVAILS' THEN 'CHALLENGER LINK BROKEN' ELSE 'DEFENDER LINK BROKEN' END IN coalesce(z.bl, '')) > 0))$q$;
BEGIN
  SELECT prosrc INTO v_src FROM pg_proc WHERE oid = 'public.derive_debate_outcome(uuid)'::regprocedure;
  IF md5(v_src) <> '2a853df604c2209d5038c48d060211c6' THEN RAISE EXCEPTION 'ASK 517 S6: live body md5 % is not the base 2a853df6', md5(v_src); END IF;
  -- 1. the write-time constant, after "v_pd int;"
  v_n := (length(v_src) - length(replace(v_src, c_old1, ''))) / length(c_old1);
  IF v_n <> 1 THEN RAISE EXCEPTION 'ASK 517 S6: "v_pd int;" occurs % times', v_n; END IF;
  v_new1 := c_old1 || E'  -- ASK 517 S6 (plan rev 4): debates created at or after this time (the write time) also count, in the C0 gate, a counted seat whose last v61\n'
                   || E'  -- ENGINE RESULT tag lists under BROKEN LINES a line graded LINK BROKEN against the side that would prevail (operator 22:26 CST 11-19).\n'
                   || '  v_517_from constant timestamptz := ''' || v_from || E''';\n';
  v_new := replace(v_src, c_old1, v_new1);
  -- 2. the gate line
  SELECT l INTO v_line FROM regexp_split_to_table(v_src, E'\n') l WHERE position('THEN challenge_standing ELSE defense_standing END ~*' IN l) > 0;
  GET DIAGNOSTICS v_n = ROW_COUNT;
  IF v_n <> 1 OR v_line IS NULL OR right(v_line, 1) <> ';' THEN RAISE EXCEPTION 'ASK 517 S6: gate line found % times', v_n; END IF;
  v_n := (length(v_new) - length(replace(v_new, v_line, ''))) / length(v_line);
  IF v_n <> 1 THEN RAISE EXCEPTION 'ASK 517 S6: gate line text occurs % times', v_n; END IF;
  p := position('AND ' IN v_line);
  v_new_line := substr(v_line, 1, p + 3) || '(' || left(substr(v_line, p + 4), -1) || c_snip || ');';
  v_new := replace(v_new, v_line, v_new_line);
  -- 3. the definition with the new body
  v_def := pg_get_functiondef('public.derive_debate_outcome(uuid)'::regprocedure);
  v_n := (length(v_def) - length(replace(v_def, v_src, ''))) / length(v_src);
  IF v_n <> 1 THEN RAISE EXCEPTION 'ASK 517 S6: body occurs % times in the definition', v_n; END IF;
  EXECUTE replace(v_def, v_src, v_new);
  SELECT prosrc INTO v_src FROM pg_proc WHERE oid = 'public.derive_debate_outcome(uuid)'::regprocedure;
  IF v_src IS DISTINCT FROM v_new THEN RAISE EXCEPTION 'ASK 517 S6: read back differs'; END IF;
  RAISE NOTICE 'ASK 517 S6 WRITTEN: body md5 % (% characters), v_517_from %', md5(v_src), length(v_src), v_from;
END $s6$;
