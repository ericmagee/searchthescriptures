-- ASK 517 S6 ROLLED-BACK TEST (W1). Runs the step file and the revert file as text (md5 checked), on the five plan runs; ends in an exception so nothing stays.
DO $t$
DECLARE s text := $f$-- ASK 517 S6 (W1 build; plan rev 4 c4221d8e): derive_debate_outcome, ASK 505 C0 STANDING GATE. A counted seat also counts toward the
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
$f$; r text := $g$-- ASK 517 S6 REVERT (W1): removes the S6 constant (three lines) and the S6 gate clause from derive_debate_outcome; asserts that the result
-- body md5 is the base 2a853df6 before it executes; reads back.
DO $r6$
DECLARE v_src text; v_def text; v_new text; v_n int; p1 int; p2 int;
  c_snip_head constant text := $q$ OR (v_created >= v_517_from AND EXISTS (SELECT 1 FROM (SELECT substring(t.x[2] from 'BROKEN LINES ([^;]*)') AS bl FROM regexp_matches(verdict_raw, '\[AUDIT v61: ENGINE RESULT -- SEAT: ([^;\]]*); ([^\]]*)\]', 'g') WITH ORDINALITY AS t(x, n) WHERE t.x[1] = judge_seat ORDER BY t.n DESC LIMIT 1) z WHERE position(CASE WHEN v_outcome = 'CHALLENGER PREVAILS' THEN 'CHALLENGER LINK BROKEN' ELSE 'DEFENDER LINK BROKEN' END IN coalesce(z.bl, '')) > 0))$q$;
BEGIN
  SELECT prosrc INTO v_src FROM pg_proc WHERE oid = 'public.derive_debate_outcome(uuid)'::regprocedure;
  -- constant: from "  -- ASK 517 S6 (plan rev 4)" through the v_517_from line
  p1 := position(E'  -- ASK 517 S6 (plan rev 4)' IN v_src);
  IF p1 = 0 THEN RAISE EXCEPTION 'ASK 517 S6 REVERT: constant comment not found'; END IF;
  p2 := position(E'+00'';\n' IN substr(v_src, p1));
  IF p2 = 0 THEN RAISE EXCEPTION 'ASK 517 S6 REVERT: constant line end not found'; END IF;
  v_new := substr(v_src, 1, p1 - 1) || substr(v_src, p1 + p2 - 1 + length(E'+00'';\n'));
  -- gate clause: "AND (" ... c_snip_head || ");" back to "AND " ... ";"
  v_n := (length(v_new) - length(replace(v_new, c_snip_head || ');', ''))) / length(c_snip_head || ');');
  IF v_n <> 1 THEN RAISE EXCEPTION 'ASK 517 S6 REVERT: clause occurs % times', v_n; END IF;
  v_new := replace(v_new, c_snip_head || ');', ';');
  v_new := replace(v_new, E'       AND (CASE WHEN v_outcome = ''CHALLENGER PREVAILS'' THEN challenge_standing', E'       AND CASE WHEN v_outcome = ''CHALLENGER PREVAILS'' THEN challenge_standing');
  IF md5(v_new) <> '2a853df604c2209d5038c48d060211c6' THEN RAISE EXCEPTION 'ASK 517 S6 REVERT: result md5 % is not the base 2a853df6', md5(v_new); END IF;
  v_def := pg_get_functiondef('public.derive_debate_outcome(uuid)'::regprocedure);
  EXECUTE replace(v_def, v_src, v_new);
  SELECT prosrc INTO v_src FROM pg_proc WHERE oid = 'public.derive_debate_outcome(uuid)'::regprocedure;
  IF md5(v_src) <> '2a853df604c2209d5038c48d060211c6' THEN RAISE EXCEPTION 'ASK 517 S6 REVERT: read back md5 %', md5(v_src); END IF;
  RAISE NOTICE 'ASK 517 S6 REVERTED: body md5 %', md5(v_src);
END $r6$;
$g$;
  ids uuid[] := ARRAY['c70883f8-45ba-4845-a66b-9be12cee74a9','45f53596-64dd-4632-bde4-2270ed6fd8dd','97ae3ffd-ba5f-4d6f-b74d-ed0eba9fb5b4','b23a3783-a618-4b2f-a1fb-42ed4d459d2b','2e62a85a-7313-445b-8504-edad38bf9893']::uuid[];
  rep text := ''; i int; a text; b text; c text; nflip int; nown int; d uuid;
BEGIN
  IF md5(s) <> 'cbbe66de7206a57b7e9ea1f349a5a1f4' OR md5(r) <> '82fcafabfc8a324c7a485d10b8ec0749' THEN RAISE EXCEPTION 'file md5 mismatch % %', md5(s), md5(r); END IF;
  -- A: live function, stored rows
  FOR i IN 1..5 LOOP d := ids[i]; PERFORM derive_debate_outcome(d); SELECT outcome INTO a FROM debate_results WHERE id = d; rep := rep || ' | ' || i || ' A=' || coalesce(a,'null'); END LOOP;
  -- step, with v_517_from before the five runs
  PERFORM set_config('ask517.from', '2026-11-20 00:00:00+00', true);
  EXECUTE s;
  -- 517 standings, over-applied: every counted-seat standing PROP-DEPENDENT or COLLAPSED with its own count 0 becomes SELF-SUPPORTED
  FOR i IN 1..5 LOOP d := ids[i];
    SELECT count(*) INTO nflip FROM debate_judgments WHERE debate_id = d AND ((defense_standing ~* '^\s*(PROP-DEPENDENT|COLLAPSED)' AND conceded_links = 0) OR (challenge_standing ~* '^\s*(PROP-DEPENDENT|COLLAPSED)' AND challenger_conceded_links = 0));
    UPDATE debate_judgments SET defense_standing = CASE WHEN defense_standing ~* '^\s*(PROP-DEPENDENT|COLLAPSED)' AND conceded_links = 0 THEN 'SELF-SUPPORTED' ELSE defense_standing END,
                                challenge_standing = CASE WHEN challenge_standing ~* '^\s*(PROP-DEPENDENT|COLLAPSED)' AND challenger_conceded_links = 0 THEN 'SELF-SUPPORTED' ELSE challenge_standing END
      WHERE debate_id = d;
    PERFORM derive_debate_outcome(d); SELECT outcome INTO b FROM debate_results WHERE id = d;
    rep := rep || ' | ' || i || ' B=' || coalesce(b,'null') || ' flipped=' || nflip;
  END LOOP;
  -- known-good for S6: debate 41024, challenger standing flipped on all seats; force the outcome input to CHALLENGER PREVAILS is not possible from here, so show the S6 seat count directly
  SELECT string_agg(judge_seat || ':' || coalesce((SELECT substring(t.x[2] from 'BROKEN LINES ([^;]*)') FROM regexp_matches(verdict_raw, '\[AUDIT v61: ENGINE RESULT -- SEAT: ([^;\]]*); ([^\]]*)\]', 'g') WITH ORDINALITY AS t(x, n) WHERE t.x[1] = judge_seat ORDER BY t.n DESC LIMIT 1), 'NO TAG'), ' / ' ORDER BY judge_seat) INTO c
    FROM debate_judgments WHERE debate_id = ids[1];
  rep := rep || ' | 41024 BROKEN LINES: ' || c;
  -- revert
  EXECUTE r;
  SELECT md5(prosrc) INTO c FROM pg_proc WHERE oid = 'public.derive_debate_outcome(uuid)'::regprocedure;
  rep := rep || ' | after revert md5 ' || c;
  RAISE EXCEPTION 'ROLLBACK_RESULT%', rep;
END $t$;
