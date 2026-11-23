-- ASK 531 WRONG-IF measurement (W4): every counted challenger premise (judge's CHALLENGER CONCEDED LINKS line, graded UNEXHIBITED/CONCEDED/counted)
-- that shares one content word or more with a round 2 charge (ASSUMES facts of the defender's round 2 UNSUPPORTED-L4 list, debate_results.claude_r2,
-- the column that holds "Mary is of David's line" on 41418). SQL re-implementation of acx531Content/acx531Names/acx531Seg/acx531Same; facts include
-- those carried into round 3 (a superset of the r2-only charges).
with stop as (select unnest(array['the','a','an','and','but','or','of','in','on','to','for','by','at','as','with','from','that','this','these','those','he','his','him','she','her','it','its','they','their','i','we','our','you','your','then','so','no','not','is','was','be','when','where','which','who','whom','matthew','mark','luke','john','acts','romans','genesis','exodus','isaiah','numbers','ruth','samuel','kings','chronicles','ezra','corinthians','galatians','hebrews','psalms','psalm','deuteronomy','leviticus','jeremiah']) w),
sec as (select id, split_part(split_part(substring(replace(claude_r2,'\n',E'\n') from position('UNSUPPORTED-L4 PREMISES' in upper(replace(claude_r2,'\n',E'\n')))), E'\n---', 1), E'\n#', 1) s from debate_results where claude_r2 ~* 'UNSUPPORTED-L4 PREMISES'),
f0 as (select distinct id, (regexp_matches(s, '(?in)ASSUMES\s*:\s*([^\n]*)', 'g'))[1] raw from sec),
facts as (select distinct id, trim(regexp_replace(regexp_replace(raw, '(?i)\s*(--|—|\.)?\s*ROWS GIVE.*$', ''), '[*]+|\s*--\s*$', '', 'g')) fact from f0),
fw as (select id, fact, w from facts, regexp_split_to_table(regexp_replace(lower(replace(fact,'’','''')), '''s\M', '', 'g'), '[^a-z0-9]+') w where length(w)>3 and w not in (select w from stop)),
fn as (select distinct id, fact, lower(m[1]) w from facts, regexp_matches(fact, '\m([A-Z][a-z]+)', 'g') m where lower(m[1]) not in (select w from stop)),
jl as (select j.id jid, j.debate_id id, (regexp_match(replace(replace(j.verdict_raw,'\n',E'\n'),'\"','"'), '(?n)^[ \t*_-]*(CHALLENGER CONCEDED LINKS\s*:\s*[1-9][0-9]*[^\n]*)'))[1] line from debate_judgments j where j.debate_id in (select id from facts)),
seg as (select jid, id, sg from jl, regexp_split_to_table(line, '(?=\mPremises?\s+\d)', 'i') sg where line is not null and sg ~* '^Premises?\s+\d' and substring(sg from '(?i)\m(VOID|UNEXHIBITED|CONCEDED|counted|spared|SUPPORTED|NARROWED|STANDS)\M') ~* '^(UNEXHIBITED|CONCEDED|counted)$'),
pair as (select s.jid, s.id, f.fact, s.sg,
  (select string_agg(distinct fw.w, ' ') from fw where fw.id=f.id and fw.fact=f.fact and s.sg ~* ('\m'||fw.w||'\M')) sw,
  (select count(distinct fw.w) from fw where fw.id=f.id and fw.fact=f.fact and s.sg ~* ('\m'||fw.w||'\M')) shared,
  (select count(*) from fw join fn on fn.id=fw.id and fn.fact=fw.fact and fn.w=fw.w where fw.id=f.id and fw.fact=f.fact and s.sg ~* ('\m'||fw.w||'\M')) shared_names
  from seg s join facts f on f.id=s.id)
select jid, case when shared>=2 and shared_names>0 then 'P' else 'F' end t, sw, left(fact,100) fact, left(coalesce(substring(sg from '(?i)(ASSUMES.*)'),substring(sg from '(?i)(STEP.*)'),sg),140) segtxt from pair where shared>=1 order by t desc, jid;
