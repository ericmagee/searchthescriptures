CREATE OR REPLACE FUNCTION pg_temp.tj(t text) RETURNS jsonb LANGUAGE plpgsql AS $f$ BEGIN RETURN t::jsonb; EXCEPTION WHEN others THEN RETURN NULL; END $f$;
WITH p AS (SELECT id, verdict_raw v FROM debate_judgments WHERE verdict_raw ~ 'COLLISION POINTS' AND id BETWEEN :LO AND :HI),
a AS (SELECT id, CASE WHEN position('[AUDIT' in v)>0 THEN left(v, position('[AUDIT' in v)-1) ELSE v END v1 FROM p),
b AS (SELECT id, substring(v1 from position('{' in v1) for length(v1)-position('{' in v1)+1 - (length(v1)-length(rtrim(regexp_replace(v1,'\}[^}]*$','}'))))) v2 FROM a),
j AS (SELECT id, pg_temp.tj(v2) j FROM b),
w AS (SELECT id, CASE WHEN j->>'reasoning' IS NULL AND j->>'reason' IS NOT NULL THEN j->>'reason' ELSE j->>'reasoning' END wt FROM j WHERE j IS NOT NULL),
l AS (SELECT id, n, ln FROM w, regexp_split_to_table(wt, E'\n') WITH ORDINALITY x(ln,n)),
c AS (SELECT id, n, ln FROM l WHERE upper(regexp_replace(ln,'[*_`]+','','g')) ~ '^\s*([-•]|\d+[.)])?\s*D\d+\y' AND upper(ln) ~ '(STANDS|UNDERDETERMINED)')
SELECT jsonb_build_object('i',id,'n',n,'t',ln)::text AS rec FROM c ORDER BY id, n;
