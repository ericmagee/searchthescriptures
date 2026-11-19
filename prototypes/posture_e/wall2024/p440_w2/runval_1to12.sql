with p as (select 'ODV1-XXXXX-xxxxxxxx'::text tok),
r as (select * from debate_results where run_token=(select tok from p)),
w as (select id, author, body, created_at from the_wall where root_id=2024),
pre as (select * from w where created_at between (select created_at from r) - interval '3 hours' and (select created_at from r)),
post2 as (select * from w where created_at > (select created_at from r) - interval '3 hours' and created_at < (select created_at from r) + interval '12 hours')
select '446 run-start post quotes runstart GO and a body sha' item,
  (select string_agg(id::text, ',') from pre where author ~ '^W4' and body ~* 'runstart' and body ~ '\mGO\M' and body ~ '\m[0-9a-f]{12,64}\M') evidence,
  case when not exists(select 1 from r) then 'NO RUN'
       when exists(select 1 from pre where author ~ '^W4' and body ~* 'runstart' and body ~ '\mGO\M' and body ~ '\m[0-9a-f]{12,64}\M') then 'EXERCISED' else 'MISSED' end grade
union all
select '447 run start names tools/runstart.py',
  (select string_agg(id::text, ',') from pre where author ~ '^W4' and body ~ 'tools/runstart\.py'),
  case when not exists(select 1 from r) then 'NO RUN'
       when exists(select 1 from pre where author ~ '^W4' and body ~ 'tools/runstart\.py') then 'EXERCISED' else 'MISSED' end
union all
select a.ask||' no landed root 2024 post in the run window fails wall_2024_check (read_through taken as given)',
  (select count(*)::text||' posts; failing '||a.ask||': '||count(*) filter (where wall_2024_check(body,true,created_at) like 'ASK '||a.ask||'%') from post2),
  case when not exists(select 1 from r) then 'NO RUN'
       when not exists(select 1 from post2) then 'NO CASE'
       when exists(select 1 from post2 where wall_2024_check(body,true,created_at) like 'ASK '||a.ask||'%') then 'MISSED' else 'HELD' end
from (values ('448'),('449'),('450'),('451')) a(ask)
union all
select '478 no call_costs entry names deepseek (ASK 455 ENFORCER on luna; W1 9522)',
  (select count(*)::text||' calls; deepseek: '||count(*) filter (where e->>'m' ~* 'deepseek')||'; luna: '||count(*) filter (where e->>'m' ~* 'luna') from r, jsonb_array_elements(case when jsonb_typeof(r.call_costs)='array' then r.call_costs else '[]'::jsonb end) e),
  case when not exists(select 1 from r) then 'NO RUN'
       when not exists(select 1 from r where jsonb_typeof(call_costs)='array' and jsonb_array_length(call_costs)>0) then 'NO CASE'
       when exists(select 1 from r, jsonb_array_elements(r.call_costs) e where e->>'m' ~* 'deepseek') then 'MISSED' else 'EXERCISED' end;
