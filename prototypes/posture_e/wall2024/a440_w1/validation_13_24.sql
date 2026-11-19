-- ASK 440 run validation, items 13 to 24 of W3 9465 (W1). Read only. Replace the token on the first line.
with t as (select 'RUN_TOKEN_HERE'::text tok),
r as (select * from debate_results where run_token=(select tok from t)),
j as (select * from debate_judgments where debate_id in (select id from r)),
e as (select * from debate_enforcer_log where run_token=(select tok from t)),
x as (select * from debate_errors where created_at between (select created_at from r) - interval '3 hours' and (select created_at from r) + interval '10 minutes'),
p as (select * from ppj_replies where created_at between (select created_at from r) - interval '3 hours' and (select created_at from r) + interval '10 minutes'),
xe as (select coalesce(error_message,'')||' '||coalesce(error_detail::text,'')||' '||coalesce(node_name,'') s from x)
select * from (values
 ('458', 'run exists', (select count(*)>0 from r), (select count(*) from xe where s ~* '(deepseek|doesn''t exist|Provider Removed)'), 'mark = 0 errors naming deepseek, a missing node or Provider Removed Stop'),
 ('459', 'a cure row', (select count(*)>0 from e where kind='cure'), (select count(*) from xe where s ~* '(deepseek|FAIL-CLOSED|removed direct provider|Provider Removed)'), 'mark = 0; plus n8n check N1 (ODV1 Cure Call executions)'),
 ('460', 'judgments', (select count(*)>0 from j), (select count(*) from xe where s ~* '(FAIL-CLOSED|Provider Removed)') + (select count(*) from p where provider ~* 'deepseek'), 'mark = 0 FAIL-CLOSED errors and 0 ppj_replies naming deepseek'),
 ('461', 'judgments', (select count(*)>0 from j), (select count(*) from p where provider is distinct from 'openrouter'), 'mark = 0 ppj_replies with a provider other than openrouter; also needs ppj rows > 0: see next column'),
 ('461b','ppj rows in window', (select count(*)>0 from p), (select count(*) from p), 'informational: replies seen'),
 ('464', 'run exists', (select count(*)>0 from r), (select count(*) from xe where s ~* '(Skip Return|Wrap|Early Alternate Shape)'), 'mark = 0; plus n8n check N2 (three sub-workflows)'),
 ('470', 'a judge-written BROKEN keystone', (select count(*)>0 from j where verdict_raw ~ 'KEYSTONE:?\s*D[0-9]+[^\n]{0,200}BROKEN' and verdict_raw !~ 'derived by the engine'), (select count(*) from j where verdict_raw like '%[AUDIT v54: GRADE CONSISTENCY%' and verdict_raw like '%is graded BROKEN on the pair%'), 'TRIAL: a case with mark 0 is READ BY HAND (does the keystone pair carry a non-BROKEN grade from the same judge?)'),
 ('472', 'a send-back item not applied', (select count(*)>0 from j where verdict_raw like '%[AUDIT v37: SEND-BACK ITEM%'), (select count(*) from j where verdict_raw like '%[AUDIT v37: SEND-BACK ITEM%' and verdict_raw not like '%not counted on this row: the item goes to the E-GATE%'), 'mark = 0 item lines without the 472 words; and E-APPLY rows: see 472b'),
 ('472b','E-APPLY rows', (select count(*)>0 from e where rule='E-APPLY'), (select count(*) from e where rule='E-APPLY' and coalesce(cure_reason,'')||coalesce(response_line,'') ~ 'not counted on this row'), 'informational: E-APPLY rows carrying the new words'),
 ('474', 'Send Back Record read a CONCEDED LINKS line', (select count(*)>0 from e where kind='send_back' and rule='E-PREM' and flagged_line ~ 'CONCEDED LINKS'), (select count(*) from xe where s ~* 'psGrades|ri3Head2024'), 'mark = 0 loader errors; the equality of readings is READ BY HAND with query Q474'),
 ('475', 'run exists', (select count(*)>0 from r), (select count(*) from xe where s ~ 'pkgLAYB'), 'mark = 0 errors naming pkgLAYB; plus n8n check N3 (lay_check in all 6 B Builds)')
) v(ask, case_is, case_met, mark, reads);
