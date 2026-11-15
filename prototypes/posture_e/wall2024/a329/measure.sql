-- ASK 329 measure (W4, Wall 6884 / corrected 6888). READ-ONLY. Run in the Supabase SQL editor or execute_sql.
-- Lists every Strong's number in an [L2] tag that names no verse of its own, which:
--   passes SECTION binding (any verse cited in its LINK/# section, an approximation of the live blockAt),
--   fails NEAR (nearest reference before the marker in its paragraph),
--   fails PARAGRAPH (every reference before the marker in its paragraph).
-- Ranges read with hyphen, en dash or em dash. CR = defender rounds, DR = challenger rounds (same as Citation Scan and Close Enforcer Build).
-- Scope: debates of the last 14 days with rounds (as of 2026-11-15 08:3x CST: 101 debates, 116 rows).
with cols as (
 select r.id, r.run_token, c.lab, c.side, c.txt from debate_results r
 cross join lateral (values ('CR1','DEFENDER',r.claude_r1),('DR1','CHALLENGER',r.engine_r1),('CR2','DEFENDER',r.claude_r2),('DR2','CHALLENGER',r.engine_r2),('CR3','DEFENDER',r.engine_r3),('DR3','CHALLENGER',r.challenger_r3),('CR4','DEFENDER',r.defender_r4),('DR4','CHALLENGER',r.challenger_r4)) c(lab,side,txt)
 where r.created_at > timestamptz '2026-11-15 14:30:00+00' - interval '14 days' and r.created_at <= timestamptz '2026-11-15 14:30:00+00' and r.engine_r3 is not null and c.txt is not null),
sec as (select id,run_token,lab,side,s.sec,s.si from cols, regexp_split_to_table(txt, '\n(?=[ \t>*#_-]*(?:LINK\s+\d|#{1,4}\s))') with ordinality s(sec,si)),
par as (select id,run_token,lab,side,si,sec,p.par,p.pi from sec, regexp_split_to_table(sec, '\n\n') with ordinality p(par,pi)),
mk as (select id,run_token,lab,side,si,sec,pi,par,a,k from par, lateral (select regexp_split_to_array(par,'\[L2\]') a) x, generate_subscripts(a,1) k where k>1),
seg as (select *, substring(a[k] from '^[^\n]*?(?=\[L[1-4]\]|$)') sg, array_to_string(a[1:k-1],'[L2]') pre from mk),
cand as (select s.*, (select m from regexp_matches(s.pre, '((?:[123] )?(?:Song of Solomon|[A-Z][a-z]+)) (\d+):(\d+)(?:\s*[-–—]\s*(\d+))?','g') with ordinality q(m,o) order by o desc limit 1) nr
 from seg s where s.sg !~ '((?:[123] )?(?:Song of Solomon|[A-Z][a-z]+)) (\d+):(\d+)' and s.sg ~ '\m[GH]\d{1,5}\M'),
nums as (select distinct c.id,c.run_token,c.lab,c.side,c.si,c.pi,c.k,c.nr,c.sec,c.pre,c.sg, n[1]||ltrim(n[2],'0') num from cand c, regexp_matches(c.sg,'\m([GH])0*(\d{1,5})\M','g') n),
ev as (select n.*,
 exists(select 1 from original_words w where n.nr is not null and w.book=n.nr[1] and w.chapter=n.nr[2]::int and w.verse between n.nr[3]::int and coalesce(n.nr[4],n.nr[3])::int and w.strongs_number=n.num) in_near,
 exists(select 1 from regexp_matches(n.sec,'((?:[123] )?(?:Song of Solomon|[A-Z][a-z]+)) (\d+):(\d+)(?:\s*[-–—]\s*(\d+))?','g') v, original_words w where w.book=v[1] and w.chapter=v[2]::int and w.verse between v[3]::int and coalesce(v[4],v[3])::int and w.strongs_number=n.num) in_sec,
 exists(select 1 from regexp_matches(n.pre,'((?:[123] )?(?:Song of Solomon|[A-Z][a-z]+)) (\d+):(\d+)(?:\s*[-–—]\s*(\d+))?','g') v, original_words w where w.book=v[1] and w.chapter=v[2]::int and w.verse between v[3]::int and coalesce(v[4],v[3])::int and w.strongs_number=n.num) in_par
 from nums n)
select row_number() over (order by run_token, lab, num, si, pi, k) as n, run_token, side, lab, num, nr[1]||' '||nr[2]||':'||nr[3]||coalesce('-'||nr[4],'') as nearest_ref,
       left(regexp_replace(sg,'\s+',' ','g'),200) as tag_text, right(regexp_replace(pre,'\s+',' ','g'),200) as text_before
from ev where nr is not null and not in_near and in_sec and not in_par
order by 1;
