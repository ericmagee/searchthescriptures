CREATE OR REPLACE FUNCTION public.judgment_result_word(p_raw text, p_seat text, p_challenge_standing text)
 RETURNS text
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO 'public'
AS $function$
-- BB-7397 rev 10 (e): a seat's RESULT word for the tie and the F10 flag. A seat whose cure overturned its verdict carries
-- "[AUDIT v21: CORRECTED RESULT -- SEAT: <seat>; ORIGINAL: <a>; COUNTED: <b> (...)...]" with a <> b; its RESULT line was written
-- under the overturned verdict and is not read. Its word is the judge prompt's own Line 2 rule applied to the counted verdict:
-- BROKEN gives CHALLENGER WINS; HELD gives DEFENDER WINS only if CHALLENGE STANDING is not SELF-SUPPORTED or a collision line
-- not retracted is graded CHALLENGER LINK BROKEN; every other case gives UNDERDETERMINED. Any other seat: its RESULT line, as before.
DECLARE m text[]; v_ret text[]; v_clb boolean;
BEGIN
  m := regexp_match(p_raw, '\[AUDIT v21: CORRECTED RESULT -- SEAT: ([^;\]]*); ORIGINAL: (\w+); COUNTED: (\w+) \([A-Z]+-[0-9]\)(?:; RETRACTED: ([^\]]*))?\]');
  IF m IS NULL OR m[1] IS DISTINCT FROM p_seat OR m[2] = m[3] THEN
    RETURN (regexp_match(p_raw, 'RESULT[ \t*_]*:[ \t*_]*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)'))[1];
  END IF;
  IF m[3] = 'BROKEN' THEN RETURN 'CHALLENGER WINS'; END IF;
  IF m[3] <> 'HELD' THEN RETURN 'UNDERDETERMINED'; END IF;
  v_ret := coalesce(regexp_split_to_array(btrim(coalesce(m[4], '')), '\s*,\s*'), '{}');
  SELECT EXISTS (SELECT 1 FROM regexp_matches(p_raw, '(?:^|\n|\\n)[ \t*_>-]*(D[0-9]+ vs C[0-9]+)[^\n\\]*?:[ \t*_]*CHALLENGER LINK BROKEN', 'g') x
                  WHERE x[1] <> ALL (v_ret)) INTO v_clb;
  IF coalesce(p_challenge_standing, 'SELF-SUPPORTED') <> 'SELF-SUPPORTED' OR v_clb THEN RETURN 'DEFENDER WINS'; END IF;
  RETURN 'UNDERDETERMINED';
END;
$function$;
