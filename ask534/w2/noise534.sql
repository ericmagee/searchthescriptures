-- ASK 534 plan rev 0 (W2): approximate noise of the proposed K-SU limit on runs 41418, 41155, 41117, 41102, 41090.
-- One item per judgment and verse pair. A deciding line (KEYSTONE, RESULT, WHICH HOLDS, ANSWER CHECK, STANDING, collision, FORCED)
-- quotes verse v; a neighbour verse of the same KJV sentence (previous verse ends in : ; or ,; or v does not end in . ? !)
-- is not named on the line, and some round of the run names it ("Book c:v"). One step each way only (the code goes up to three).
with runs as (select id did, run_token, concat_ws(E'\n',claude_r1,claude_r2,engine_r3,defender_r4,engine_r1,engine_r2,challenger_r3,challenger_r4) rounds from debate_results where run_token ~ '^ODV1-(41418|41155|41117|41102|41090)-'),
j as (select r.run_token, r.rounds, dj.id jid, dj.judge_seat, dj.verdict_raw from runs r join debate_judgments dj on dj.debate_id=r.did),
l as (select j.*, x.n, btrim(x.line) line from j, lateral unnest(string_to_array(replace(j.verdict_raw,'\n',E'\n'),E'\n')) with ordinality x(line,n)),
dl as (select * from l where line ~ '^(KEYSTONE|RESULT|WHICH HOLDS|ANSWER CHECK|STANDING|D\d+ vs\.? C\d+|FORCED)'),
refs as (select dl.*, m[1] b, m[2]::int c, m[3]::int v1, coalesce(m[4]::int, m[3]::int) v2 from dl, lateral regexp_matches(dl.line, '((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?', 'g') m),
kv as (select book,chapter,verse, right(btrim(regexp_replace(text,'\[[^\]]*:[^\]]*\]','','g')),1) e from kjv_verses),
nb as (select r.*, p.verse pv, nx.verse nv from refs r
  left join kv cur on cur.book=r.b and cur.chapter=r.c and cur.verse=r.v2
  left join kv p on p.book=r.b and p.chapter=r.c and p.verse=r.v1-1 and p.e in (':',';',',')
  left join kv nx on nx.book=r.b and nx.chapter=r.c and nx.verse=r.v2+1 and cur.e not in ('.','?','!')),
cand as (select *, unnest(array_remove(array[pv,nv],null)) ov from nb),
fire as (select * from cand
  where position((b||' '||c||':'||ov) in line)=0 and not (line ~ (c||':'||ov||'\M') )
    and rounds ~ (b||' '||c||':'||ov||'\M')),
u as (select distinct run_token, jid, b, c, v1, ov from fire)
select run_token, count(*) per_judgment_verse, count(distinct (b,c,v1,ov)) distinct_pairs, string_agg(distinct b||' '||c||':'||v1||'/'||ov, ', ') pairs from u group by 1 order by 1;
-- Result 10:5x CST 11-23: 41090 20 (9 pairs), 41102 8 (5), 41117 6 (2), 41155 25 (9), 41418 26 (9); total 85.
