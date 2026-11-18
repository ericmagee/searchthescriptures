\echo T1 stamp
select wall_stamp() = '⏱ ' || to_char(now() at time zone 'America/Chicago','HH24:MI') || ' CST | ' || to_char(now() at time zone 'America/Chicago','YYYY-MM-DD'), wall_stamp();
\echo T2 read-through
select wall_reply(1,'a','W1','s','talk');
select wall_reply(1,'b','W1','s','talk');
select wall_reply(1,'late','W1','s','talk',1);
select wall_reply(1,'past','W1','s','talk',99);
select wall_reply(1,'null','W1','s','talk',null);
select wall_reply(1,'ok','W1','s','talk',(select max(id) from the_wall));
\echo T3 five-arg and defaults still resolve
select wall_reply(1,'five','W1','s','talk');
select wall_reply(1,'three','W1');
select count(*) from the_wall where body in ('late','past','null');
select p.oid::regprocedure from pg_proc p where proname in ('wall_reply','wall_stamp','engine_manual_apply') order by 1;
\echo T4 manual apply
\set pr `cat pairs.json`
select engine_manual_apply(191,'2e0b969951a29c5e30c7e7118ba99934',:'pr'::jsonb,null,null,null,null,null,false);
select engine_manual_apply(191,'0000','[{"old":"x","new":"y"}]',null,null,null,null,null,false)->>'error';
select engine_manual_apply(190,'2e0b969951a29c5e30c7e7118ba99934',:'pr'::jsonb,null,null,null,null,null,false)->>'error';
select engine_manual_apply(191,'2e0b969951a29c5e30c7e7118ba99934','[{"old":"NO SUCH TEXT zq","new":"y"}]',null,null,null,null,null,false)->>'error';
select engine_manual_apply(191,'2e0b969951a29c5e30c7e7118ba99934','[{"old":"the","new":"y"}]',null,null,null,null,null,false)->>'error';
select engine_manual_apply(191,'2e0b969951a29c5e30c7e7118ba99934',:'pr'::jsonb,'bad',567729,'t','s','l',true)->>'error';
select engine_manual_apply(191,'2e0b969951a29c5e30c7e7118ba99934',:'pr'::jsonb,'be475a1e200c2b99f3f72a6e42f33991',567729,'t','','l',true)->>'error';
\echo T4w write (local only)
select engine_manual_apply(191,'2e0b969951a29c5e30c7e7118ba99934',:'pr'::jsonb,'be475a1e200c2b99f3f72a6e42f33991',567729,'ASK 374 and ASK 376 entries','sum','log',true);
select version, md5(content), length(content), summary from engine_manual order by version;
select version, entry_date, title, char_len from engine_manual_log;
\echo T5 central date at 23:30 CST
begin; select set_config('x','1',true); 
select (timestamptz '2026-11-19 05:30:00+00' at time zone 'America/Chicago')::date central, (timestamptz '2026-11-19 05:30:00+00')::date utc_date;
rollback;
\echo T6 no-op pair on max version reproduces it
select engine_manual_apply(192,'be475a1e200c2b99f3f72a6e42f33991',jsonb_build_array(jsonb_build_object('old',left((select content from engine_manual where version=192),40),'new',left((select content from engine_manual where version=192),40))),null,null,null,null,null,false);
