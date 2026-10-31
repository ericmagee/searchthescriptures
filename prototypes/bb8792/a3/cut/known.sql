-- BB-8792 step 1 cut (Worker_A3). Read-only. Units of the 13 judgments of runs 30196, 30268, 30304.
-- T = stored text with the two-character escapes \n and \" turned into newline and quote (panel rows are JSON text).
-- A line STARTS a unit if it begins (after spaces and asterisks) with "Dn vs Cm", "RESULT:", a link head "Dn:" or "Cn:", or an upper-case head "WORDS:".
-- Panel rows are JSON text: the judge's text is taken from the "reasoning" string on (the JSON fields before it are not units).
-- reasoning unit = every line before the first starter; RESULT unit = the RESULT line and its continuation lines;
-- graded unit = a "Dn vs Cm" line and its continuation lines (lines that start no unit and are not blank), FIRST occurrence per pair only
-- (later occurrences are cure restatements and are counted, not drawn).
WITH src AS (
  SELECT d.run_token rt, 'panel:'||j.judge_seat||':'||j.id seat, j.verdict_raw raw FROM debate_judgments j JOIN debate_results d ON d.id::text=j.debate_id::text
   WHERE d.run_token IN ('ODV1-30196-rymz70zp','ODV1-30268-3q7ubjd7','ODV1-30304-tz1mntnx')
  UNION ALL SELECT run_token, 'single', independent_verdict_raw FROM debate_results WHERE run_token IN ('ODV1-30196-rymz70zp','ODV1-30268-3q7ubjd7','ODV1-30304-tz1mntnx')
  UNION ALL SELECT run_token, 'removed', drv_removed::text FROM debate_results WHERE run_token IN ('ODV1-30196-rymz70zp','ODV1-30268-3q7ubjd7','ODV1-30304-tz1mntnx') AND drv_removed IS NOT NULL),
t AS (SELECT rt, seat, replace(replace(CASE WHEN raw ~ '^\s*\{' AND strpos(raw, '"reasoning": "') > 0 THEN substr(raw, strpos(raw, '"reasoning": "') + 14) ELSE raw END, E'\\n', E'\n'), E'\\"', '"') txt FROM src),
l AS (SELECT rt, seat, n, line FROM t, regexp_split_to_table(txt, E'\n') WITH ORDINALITY AS x(line, n)),
k AS (SELECT *, CASE WHEN line ~ '^\s*\**\s*D\d+\s+vs\.?\s+C\d+' THEN 'graded'
                     WHEN line ~ '^\s*\**\s*RESULT:' THEN 'result'
                     WHEN line ~ '^\s*\**\s*[DC]\d+\s*:' THEN 'head'
                     WHEN line ~ '^\s*\**\s*[A-Z][A-Z /-]{2,40}:' THEN 'head'
                     WHEN line ~ '^\s*\**\s*[A-Z][A-Z /-]{3,40}\s*$' THEN 'head'
                     WHEN btrim(line) = '' THEN 'blank' ELSE NULL END st FROM l),
f AS (SELECT rt, seat, min(n) FILTER (WHERE st IS NOT NULL AND st <> 'blank') first_start FROM k GROUP BY 1,2),
g AS (SELECT k.*, f.first_start, sum(CASE WHEN st IS NOT NULL THEN 1 ELSE 0 END) OVER (PARTITION BY k.rt, k.seat ORDER BY n) grp FROM k JOIN f USING (rt, seat)),
u AS (SELECT rt, seat, CASE WHEN n < first_start THEN 'reasoning' ELSE grp::text END ug, min(n) n0,
             (array_agg(st ORDER BY n))[1] st0, string_agg(line, E'\n' ORDER BY n) body
        FROM g GROUP BY 1,2,3),
units AS (SELECT rt, seat, CASE WHEN ug='reasoning' THEN 'reasoning' ELSE st0 END kind, n0, btrim(body, E' \n') body,
                 substring(body from '(D\d+\s+vs\.?\s+C\d+)') pr FROM u WHERE ug='reasoning' OR st0 IN ('graded','result')),
ranked AS (SELECT *, row_number() OVER (PARTITION BY rt, seat, kind, coalesce(pr,'') ORDER BY n0) occ FROM units),
marked AS (SELECT DISTINCT d.run_token rt, 'single' seat, m[2] pr FROM debate_results d, regexp_matches(d.review_notes, '\((K-(?:C|S2|G4))\) -- (D\d+ vs C\d+)', 'g') m WHERE d.run_token IN ('ODV1-30196-rymz70zp','ODV1-30268-3q7ubjd7','ODV1-30304-tz1mntnx')
  UNION SELECT DISTINCT d.run_token, 'panel:'||j.judge_seat||':'||j.id, m[1] FROM debate_judgments j JOIN debate_results d ON d.id::text=j.debate_id::text, regexp_matches(j.verdict_raw, 'K-(?:C|S2|G4)\M[^\n]{0,80}?(D\d+ vs C\d+)', 'g') m WHERE d.run_token IN ('ODV1-30196-rymz70zp','ODV1-30268-3q7ubjd7','ODV1-30304-tz1mntnx')
  UNION SELECT DISTINCT d.run_token, 'removed', m[1] FROM debate_results d, regexp_matches(d.drv_removed::text, 'ITEM: (D\d+ vs C\d+); RULE: K-(?:C|S2|G4)', 'g') m WHERE d.run_token='ODV1-30268-3q7ubjd7'),
cure AS (SELECT rt, seat, m[1] body FROM t, regexp_matches(txt, '(\[AUDIT v\d+: DEBATE RULE VIOLATION REPORT[^\]]*\])', 'g') m),
pick AS (
  SELECT 'K1' cid, 'K-S2' rule, 'BREACH' expect, rt, seat, kind, coalesce(pr,'') pr, body FROM ranked WHERE rt='ODV1-30268-3q7ubjd7' AND seat='panel:gemini:862' AND kind='reasoning'
  UNION ALL SELECT 'K2','K-G4','CLEAN', rt, seat, 'cure', 'D2 vs C3', body FROM cure WHERE rt='ODV1-30304-tz1mntnx' AND seat='panel:glm:866' AND body LIKE '%ITEM: D2 vs C3; RULE: K-G4%'
  UNION ALL SELECT 'K3a','K-C','BREACH', rt, seat, kind, pr, body FROM ranked WHERE rt='ODV1-30304-tz1mntnx' AND seat='single' AND kind='graded' AND pr='D3 vs C6' AND occ=1
  UNION ALL SELECT 'K3b','K-C','BREACH', rt, seat, kind, pr, body FROM ranked WHERE rt='ODV1-30304-tz1mntnx' AND seat='single' AND kind='graded' AND pr='D6 vs C1' AND occ=1
  UNION ALL SELECT 'K4','K-G4','BREACH', rt, seat, kind, pr, body FROM ranked WHERE rt='ODV1-30304-tz1mntnx' AND seat='panel:gemini:865' AND kind='graded' AND pr='D2 vs C3' AND occ=1
  UNION ALL SELECT 'K6','RESULT','BREACH', r.rt, r.seat, 'result+cure', 'D2 vs C3', r.body || E'\n\n' || c.body FROM ranked r JOIN cure c ON c.rt=r.rt AND c.seat=r.seat AND c.body LIKE '%ITEM: D2 vs C3; RULE: K-G4%' WHERE r.rt='ODV1-30304-tz1mntnx' AND r.seat='panel:gemini:865' AND r.kind='result')
SELECT cid, rule, expect, rt, seat, kind, pr, length(body) len, md5(body) md5, body, (SELECT json_agg(json_build_object('kind',kind,'n',n)) FROM (SELECT kind, count(*) n FROM ranked WHERE occ=1 GROUP BY 1) z) counts FROM pick ORDER BY cid;