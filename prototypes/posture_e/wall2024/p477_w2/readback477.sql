with exp(proname, want_md5, want_len) as (values
  ('engine_manual_guard','0b132fded0eabad80e15e38adf6636f1',2268),
  ('operational_doc_guard','625ab111f3ed20e30f49bff58f6dcb7e',2641)),
f as (select p.proname, md5(pg_get_functiondef(p.oid)) m, length(pg_get_functiondef(p.oid)) n, p.prosecdef, p.proconfig
      from pg_proc p join pg_namespace s on s.oid=p.pronamespace where s.nspname='public' and p.proname in ('engine_manual_guard','operational_doc_guard')),
tg(tgname, want) as (values
  ('trg_engine_manual_audit','d284437d53ce59c2f5d93bb8832b6ad9'),('trg_engine_manual_immutable','2e03c5832e08adf4adfd4aef828bdb30'),
  ('trg_operational_doc_audit','cb6fe96292392562f723443264a0989c'),('trg_operational_doc_immutable','71b4f198f51344674cfc15b9a2112dc3'))
select 'F '||e.proname item, f.m||' len '||f.n got, e.want_md5||' len '||e.want_len want,
  case when f.m=e.want_md5 and f.n=e.want_len and f.prosecdef and f.proconfig=array['search_path=public, pg_temp'] then 'MATCH'
       when f.m='6d0aefc2c301201d0f3cd68140e41fb3' or f.m='8821ddbb1cc3ec12227b595bbc8c7f60' then 'NOT WRITTEN (base text)' else 'DIFFERS' end grade
from exp e left join f on f.proname=e.proname
union all
select 'T '||tg.tgname, md5(pg_get_triggerdef(t.oid)), tg.want, case when md5(pg_get_triggerdef(t.oid))=tg.want then 'MATCH' else 'DIFFERS' end
from tg left join pg_trigger t on t.tgname=tg.tgname
union all
select 'R first AUTO-GUARD row after the write', coalesce((select left(notes,400) from audit_log where notes like 'AUTO-GUARD %INSERT%' and notes like '%| card=%' order by id limit 1),'none yet'),
  'card=, session=, from=v<prior> hash=<12>',
  case when exists(select 1 from audit_log where notes like 'AUTO-GUARD %INSERT%' and notes ~ '\| card=.+ \| session=.+ \| from=v[0-9]+ hash=[0-9a-f]{12}') then 'MATCH' else 'NO CASE (no manual or op doc insert since)' end;
