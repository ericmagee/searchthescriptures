-- ASK 542 measurement (W1, 2026-11-23). Read only.
-- (A) ANSWER CHECK lines in every judgment: the round tag right after the reference (as unxAcFail reads it),
-- and the grade (first capitalised word after "-- ANSWER:" that follows a "--").
-- Per (judgment, side letter, reference): OLD = a MISSES/FAILS and no MEETS among round-3 tags (rk);
-- NEW = OLD, or a MISSES/FAILS and no MEETS among round 2, 3 and 4 tags of that side.
with ln as (select j.id jid, j.debate_id, l from debate_judgments j, regexp_split_to_table(j.verdict_raw, '\\n') l where l ~* '^[\s>*_-]*ANSWER\s+CHECK'),
p as (select jid, debate_id, lower(regexp_replace(trim(m[1]),'\s+',' ','g')) ref, upper(m[2]) sd, m[3]::int rd,
 substring(substring(l from '--\s*ANSWER\s*:(.*)$') from '--\s*\**\s*([A-Z]{3,})') g
 from ln, regexp_matches(l, '^[\s>*_-]*ANSWER\s+CHECK\s*:?[\s*_]*(.+?)\s*--\s*\[?\s*([CD]R)(\d)', 'i') m),
a as (select jid, debate_id, sd, ref,
 count(*) filter (where rd=3 and g in ('MISSES','FAILS')) f3, count(*) filter (where rd=3 and g='MEETS') m3,
 count(*) filter (where rd between 2 and 4 and g in ('MISSES','FAILS')) fn, count(*) filter (where rd between 2 and 4 and g='MEETS') mn
 from p group by 1,2,3,4)
select (select count(*) from p) lines, (select count(*) filter (where rd=1) from p) r1, (select count(*) filter (where rd=2) from p) r2,
 (select count(*) filter (where rd=3) from p) r3, (select count(*) filter (where rd=4) from p) r4,
 count(*) refs, count(*) filter (where f3>0 and m3=0) old_fail,
 count(*) filter (where (f3>0 and m3=0) or (fn>0 and mn=0)) new_fail,
 count(*) filter (where not (f3>0 and m3=0) and (fn>0 and mn=0)) gained,
 count(distinct jid) filter (where not (f3>0 and m3=0) and (fn>0 and mn=0)) gained_j,
 count(distinct debate_id) filter (where not (f3>0 and m3=0) and (fn>0 and mn=0)) gained_runs,
 count(*) filter (where (f3>0 and m3=0) and not (fn>0 and mn=0)) kept_by_or,
 count(distinct jid) judgments, count(distinct debate_id) runs from a;
-- (B) Stored rows of the general raise (Library 480 to 482):
-- select count(*), count(distinct run_token), count(*) filter (where cure_reason ilike '%CORRECTED COUNT%')
-- from debate_enforcer_log where rule='K-UNX' and flagged_line ~ 'block exhibits .* and the count names no layer the block lacks'
-- and flagged_line !~ 'saying the block lacks';
