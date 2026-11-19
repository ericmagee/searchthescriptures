CREATE OR REPLACE FUNCTION pg_temp.wall_2024_check(p_body text, p_rt_ok boolean, p_now timestamptz)
 RETURNS text LANGUAGE plpgsql STABLE AS $f$
DECLARE s text; ts timestamp; g boolean; pl boolean;
BEGIN
  IF NOT coalesce(p_rt_ok,false) THEN
    RETURN 'ASK 451: root 2024 takes posts only through wall_reply(root, body, by, session, kind, read_through).';
  END IF;
  s := substring(p_body from '⏱ ([0-2][0-9]:[0-5][0-9] CST \| 20[0-9]{2}-[01][0-9]-[0-3][0-9])\s*$');
  IF s IS NULL THEN
    RETURN 'ASK 451: the post must end with the database stamp; append wall_stamp().';
  END IF;
  ts := to_timestamp(split_part(s,' | ',2)||' '||split_part(s,' ',1),'YYYY-MM-DD HH24:MI')::timestamp;
  IF abs(extract(epoch FROM (ts - (p_now AT TIME ZONE 'America/Chicago')))) > 120 THEN
    RETURN 'ASK 451: the stamp '||s||' is more than 2 minutes from the database clock ('||to_char(p_now AT TIME ZONE 'America/Chicago','HH24:MI YYYY-MM-DD')||'); append wall_stamp().';
  END IF;
  g := p_body ~ '\m(PASS|FAIL)\M';
  IF g AND p_body !~ '\m(?=[0-9a-f]*[0-9])(?=[0-9a-f]*[a-f])[0-9a-f]{8,40}\M' THEN
    RETURN 'ASK 449: a post that gives PASS or FAIL names the commit of what it judged (8 or more hex characters).';
  END IF;
  IF g AND p_body !~ 'RULES READ:' THEN
    RETURN 'ASK 448: a post that gives PASS or FAIL carries a line RULES READ: naming each manual section whose rules the change touches, read in full.';
  END IF;
  pl := p_body ~ '\mPLANS? rev' AND left(p_body,400) !~* '\m(re)?grades?\M';
  IF pl AND p_body !~ '\mSEARCH' THEN
    RETURN 'ASK 450: a plan carries SEARCH: what was searched before the scope was set.';
  END IF;
  RETURN NULL;
END $f$;


DO $t$
DECLARE r text := ''; x record; n timestamptz := now(); st text := ' ' || wall_stamp(); old text := ' ⏱ 01:00 CST | 2026-11-18';
  c int := 0;
BEGIN
  -- C1 known-good / known-bad, one pair per rule
  r := r || 'C1 451a bad (no read-through): ' || coalesce(pg_temp.wall_2024_check('W3: note'||st, false, n),'ACCEPT') || E'\n';
  r := r || 'C1 451a good: ' || coalesce(pg_temp.wall_2024_check('W3: note'||st, true, n),'ACCEPT') || E'\n';
  r := r || 'C1 451b bad (no stamp): ' || coalesce(pg_temp.wall_2024_check('W3: note', true, n),'ACCEPT') || E'\n';
  r := r || 'C1 451b bad (old stamp): ' || coalesce(pg_temp.wall_2024_check('W3: note'||old, true, n),'ACCEPT') || E'\n';
  r := r || 'C1 451b good (stamp inline end): ' || coalesce(pg_temp.wall_2024_check('W3: note. No run.'||st, true, n),'ACCEPT') || E'\n';
  r := r || 'C1 449 bad (PASS, no commit): ' || coalesce(pg_temp.wall_2024_check(E'W3: GRADE of ASK 1: PASS.\nRULES READ: op doc s29.'||st, true, n),'ACCEPT') || E'\n';
  r := r || 'C1 449 bad (all-letter hex word only, "deadbeef"): ' || coalesce(pg_temp.wall_2024_check(E'W3: GRADE: PASS deadbeef.\nRULES READ: s29.'||st, true, n),'ACCEPT') || E'\n';
  r := r || 'C1 448 bad (commit, no RULES READ): ' || coalesce(pg_temp.wall_2024_check('W3: GRADE of ASK 1 (commit 2eabc98c): PASS.'||st, true, n),'ACCEPT') || E'\n';
  r := r || 'C1 448/449 good: ' || coalesce(pg_temp.wall_2024_check(E'W3: GRADE of ASK 1 (commit 2eabc98c): PASS.\nRULES READ: op doc s29.'||st, true, n),'ACCEPT') || E'\n';
  r := r || 'C1 450 bad (plan, no SEARCH): ' || coalesce(pg_temp.wall_2024_check('W3: ASK 1 PLAN rev 0. 1 OBJECTIVE: x.'||st, true, n),'ACCEPT') || E'\n';
  r := r || 'C1 450 good: ' || coalesce(pg_temp.wall_2024_check(E'W3: ASK 1 PLAN rev 0.\n3 SCOPE and SEARCH: pg_proc.'||st, true, n),'ACCEPT') || E'\n';
  r := r || 'C1 450 not a plan (grade of a plan, no SEARCH): ' || coalesce(pg_temp.wall_2024_check(E'W3: GRADE of ASK 1 PLAN rev 0 (commit 2eabc98c): PASS.\nRULES READ: s29.'||st, true, n),'ACCEPT') || E'\n';
  -- C2 replay over root 2024, 9060 to 9210: read-through assumed, stamp clock = the post's own created_at
  FOR x IN SELECT id, author, body, created_at FROM the_wall WHERE root_id=2024 AND id BETWEEN 9060 AND 9210 ORDER BY id LOOP
    c := c + 1;
    IF pg_temp.wall_2024_check(x.body, true, x.created_at) IS NOT NULL THEN
      r := r || 'C2 ' || x.id || ' ' || x.author || ' : ' || left(pg_temp.wall_2024_check(x.body, true, x.created_at), 9) || E'\n';
    END IF;
  END LOOP;
  r := r || 'C2 posts read: ' || c;
  RAISE EXCEPTION E'RESULTS\n%', r;
END $t$;
