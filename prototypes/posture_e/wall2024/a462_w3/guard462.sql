CREATE OR REPLACE FUNCTION public.wall_2024_check(p_body text, p_rt_ok boolean, p_now timestamp with time zone)
 RETURNS text
 LANGUAGE plpgsql
 STABLE
AS $function$
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
  IF g AND p_body !~* '(^|\n)OBJECTIVE MET: *(yes|in part|no)\M' THEN
    RETURN 'ASK 462: a grade carries a line OBJECTIVE MET: saying yes, in part or no, with the reason (operational_doc §29, AT THE GRADE).';
  END IF;
  pl := left(p_body,400) ~ '\mPLANS? rev' AND NOT g;
  IF pl AND p_body !~ '\mSEARCH' THEN
    RETURN 'ASK 450: a plan carries SEARCH: what was searched before the scope was set.';
  END IF;
  RETURN NULL;
END $function$
