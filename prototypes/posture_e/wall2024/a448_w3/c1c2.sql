CREATE OR REPLACE FUNCTION pg_temp.wall_2024_check(p_body text, p_rt_ok boolean, p_now timestamptz)
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


DO $t$
DECLARE r text := ''; x record; n timestamptz := now(); st text := ' ' || wall_stamp(); old text := ' ⏱ 01:00 CST | 2026-11-18'; c int := 0; k text;
BEGIN
  r := r || 'C1 451a bad (no read-through): ' || coalesce(pg_temp.wall_2024_check('W3: note'||st, false, n),'ACCEPT') || E'\n';
  r := r || 'C1 451a good: ' || coalesce(pg_temp.wall_2024_check('W3: note'||st, true, n),'ACCEPT') || E'\n';
  r := r || 'C1 451b bad (no stamp): ' || coalesce(pg_temp.wall_2024_check('W3: note', true, n),'ACCEPT') || E'\n';
  r := r || 'C1 451b bad (old stamp): ' || coalesce(pg_temp.wall_2024_check('W3: note'||old, true, n),'ACCEPT') || E'\n';
  r := r || 'C1 451b good (stamp inline end): ' || coalesce(pg_temp.wall_2024_check('W3: note. No run.'||st, true, n),'ACCEPT') || E'\n';
  r := r || 'C1 451b good (CDT label): ' || coalesce(pg_temp.wall_2024_check('W3: note'||replace(st,' CST ',' CDT '), true, n),'ACCEPT') || E'\n';
  r := r || 'C1 449 bad (grade, PASS, no commit): ' || coalesce(pg_temp.wall_2024_check(E'W3: GRADE of ASK 1: PASS.\nRULES READ: op doc s29.'||st, true, n),'ACCEPT') || E'\n';
  r := r || 'C1 449 bad (grade, all-letter hex word only): ' || coalesce(pg_temp.wall_2024_check(E'W3: GRADE: PASS deadbeef.\nRULES READ: s29.'||st, true, n),'ACCEPT') || E'\n';
  r := r || 'C1 448 bad (grade, commit, no RULES READ): ' || coalesce(pg_temp.wall_2024_check('W3: GRADE of ASK 1 (commit 2eabc98c): PASS.'||st, true, n),'ACCEPT') || E'\n';
  r := r || 'C1 448/449 good: ' || coalesce(pg_temp.wall_2024_check(E'W3: GRADE of ASK 1 (commit 2eabc98c): PASS.\nRULES READ: op doc s29.'||st, true, n),'ACCEPT') || E'\n';
  r := r || 'C1 448 bad (lower-case "Two grades"): ' || coalesce(pg_temp.wall_2024_check('W3: Two grades. A. ASK 1 (commit 2eabc98c): PASS.'||st, true, n),'ACCEPT') || E'\n';
  r := r || 'C1 not a grade (build "for grade by W2", criteria PASS): ' || coalesce(pg_temp.wall_2024_check('W1: ASK 1 BUILD, for grade by W2. C1 PASS.'||st, true, n),'ACCEPT') || E'\n';
  r := r || 'C1 not a grade (withdrawal quoting FAIL): ' || coalesce(pg_temp.wall_2024_check('W1: WITHDRAWAL of 9203 item 2. 9203 item 1 (FAIL on form) stands.'||st, true, n),'ACCEPT') || E'\n';
  r := r || 'C1 450 bad (plan, no SEARCH): ' || coalesce(pg_temp.wall_2024_check('W3: ASK 1 PLAN rev 0. 1 OBJECTIVE: x.'||st, true, n),'ACCEPT') || E'\n';
  r := r || 'C1 450 good: ' || coalesce(pg_temp.wall_2024_check(E'W3: ASK 1 PLAN rev 0.\n3 SCOPE and SEARCH: pg_proc.'||st, true, n),'ACCEPT') || E'\n';
  r := r || 'C1 450 not a plan (grade of a plan): ' || coalesce(pg_temp.wall_2024_check(E'W3: GRADE of ASK 1 PLAN rev 0 (commit 2eabc98c): PASS.\nRULES READ: s29.'||st, true, n),'ACCEPT') || E'\n';
  FOR x IN SELECT id, author, body, created_at FROM the_wall WHERE root_id=2024 AND id BETWEEN 9060 AND 9213 ORDER BY id LOOP
    c := c + 1; k := pg_temp.wall_2024_check(x.body, true, x.created_at);
    IF k IS NOT NULL THEN r := r || 'C2 ' || x.id || ' ' || x.author || ' : ' || left(k, 7) || ' | ' || coalesce(substring(regexp_replace(left(x.body,400), '\m(for|to|please|your|their|my|a|the|his)\s+(re)?grades?\M', '', 'gi') from '(?i)(.{0,40}\m(?:re)?grades?\M.{0,20})'), substring(left(x.body,400) from '(.{0,30}PLANS? rev.{0,30})'), left(regexp_replace(x.body,'^session_[^\n]*\n',''),80)) || E'\n'; END IF;
  END LOOP;
  r := r || 'C2 posts read: ' || c;
  RAISE EXCEPTION E'RESULTS\n%', r;
END $t$;
