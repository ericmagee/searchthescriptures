-- ASK 517 S6 REVERT (W1): removes the S6 constant (three lines) and the S6 gate clause from derive_debate_outcome; asserts that the result
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
