-- ASK 533 measurement (W1, 2026-11-23). Read only. Every judgment in debate_judgments.
-- Lines: the collision lines kl2Lines already reads (Library 485): "D<n> vs C<n>" lines that hold [L2].
-- Gloss: "[L2] ... (G/Hnnnn, gloss)". Parts: the gloss split at "," and ";" (as ASK 340 PART B splits g.parts).
-- A part passes when any content word (ASK 340 FW stop list) is a kjv_word_map rendering of that number
-- (exact, or prefix match either way for words over 3 letters; an approximation of ASK 340 forms()).
-- A gloss fails when any part fails.
with ln as (
 select j.id jid, j.debate_id, l from debate_judgments j, regexp_split_to_table(j.verdict_raw, '\\n') l
 where l ~ '\[L2\]' and l ~* '^\s*(?:[-•]|\d+[.)])?\s*[*_]*\s*D\d+\s+vs\.?\s+C\d+'),
g as (select jid, debate_id, m[1]||m[2] num, lower(m[3]) gloss from ln, regexp_matches(l, '\[L2\][^|\[]{0,60}?\(([GH])0*(\d{1,5}),\s*([^)]{1,140})\)', 'g') m),
p as (select g.*, trim(pt) part, ord from g, regexp_split_to_table(gloss,'[,;]') with ordinality x(pt,ord)),
w as (select p.*, x.w from p, regexp_split_to_table(regexp_replace(part,'[^a-z ]',' ','g'),' +') x(w)
 where x.w<>'' and x.w not in (select unnest(string_to_array('a an the of to in on at by for from with into upon unto out up down over under was were is are be been being he she it they him her his its their one oneself self also therefore and or as that which who whom whose this these those own not no',' ')))),
r as (select distinct strongs_number num, lower(regexp_replace(kjv_word,'[^A-Za-z]','','g')) rw from kjv_word_map where strongs_number in (select distinct num from g)),
pt as (select jid, debate_id, num, gloss, ord, part, bool_or(exists(select 1 from r where r.num=w.num and (r.rw=w.w or (length(w.w)>3 and r.rw like w.w||'%') or (length(r.rw)>3 and w.w like r.rw||'%')))) hit from w group by 1,2,3,4,5,6),
gl as (select jid, debate_id, num, gloss, bool_and(hit) ok, string_agg(case when not hit then part end, '; ') bad from pt group by 1,2,3,4)
-- (A) totals
select count(*) glosses, count(*) filter (where not ok) fail, count(distinct jid) filter (where not ok) j_fail, count(distinct debate_id) filter (where not ok) runs_fail,
 count(*) filter (where not ok and jid>=1200) fail_recent, count(distinct debate_id) filter (where not ok and jid>=1200) runs_fail_recent, count(distinct debate_id) filter (where jid>=1200) runs_recent,
 string_agg(case when jid in (1263,1265) then jid||' '||num||' ['||gloss||'] ok='||ok||coalesce(' bad='||bad,'') end, ' | ') known from gl;
-- (B) by number: replace the final select with
-- select num, count(*) n, count(*) filter (where jid>=1200) n_recent, (array_agg(distinct bad))[1:3] examples from gl where not ok group by num order by n desc limit 15;
-- (C) coverage proxy: a failing gloss whose number the debaters cite in the same run, "(Gnnnn," or "(Gnnnn)", in claude_r1..challenger_r4 of debate_results.
