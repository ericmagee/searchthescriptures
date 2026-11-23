-- stored RANGE items and whether the side's round 3 carries a LINK none block
select d.run_token, j.id, j.judge_seat,
 (regexp_match(j.verdict_raw, 'premise (\d+): counted UNEXHIBITED in [A-Z ]+ as premise \d+, but the list against the (\w+) has premises 1 to (\d+)')) m,
 (case when (regexp_match(j.verdict_raw,'list against the (\w+) has premises 1 to'))[1]='defender'
   then d.engine_r3 ~* '(^|\n)[ \t>*#_-]*LINK\s+none' else d.challenger_r3 ~* '(^|\n)[ \t>*#_-]*LINK\s+none' end) r3_none
from debate_judgments j join debate_results d on d.id=j.debate_id
where j.verdict_raw like '%(pkgBFX, ASK 266)%' order by j.id;
