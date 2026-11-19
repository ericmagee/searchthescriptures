-- ASK 466 state check (W2, read only). Run before the write and after it; the readback compares the two.
-- One row per target: kind, name, value. Expected after step 1 (plan rev 0 plus C-1 and C-3):
--   audit_log anon INSERT false; policy anon_ins absent; class C anon/authenticated/PUBLIC EXECUTE false;
--   C5auth (step1 rev 2) ins=false upd=false; drRPC (C-4) anon=false auth=false;
--   class B (7 plus log_override_arming per C-1; pm_ledger_audit and project_plans_guard unchanged) prosecdef true with search_path set; C-3 tables anon INSERT/UPDATE false.
with
c as (select unnest(array['log_build','log_change','save_session','abandon_fold_session','blackboard_ack','blackboard_close','blackboard_archive_any_author','conclusion_flag','init_load_session']) f),
b as (select unnest(array['debate_judgments_write_guard','debate_prompts_guard','debate_results_write_guard','kb_row_audit','log_app_state_build','log_override_arming','pm_ledger_audit','project_plans_guard','sight_embedding_fence','truth_date_normalize']) f),
s2 as (select unnest(array['log_audit_event','complete_session_close','complete_security_check']) f),
t3 as (select unnest(array['the_wall','engine_manual','operational_doc','kb_book_chapters','journal_entries','blackboard','blackboard_manual','app_source','day_room','day_room_posts','debate_prompts']) t)
select 'audit_log' kind, 'anon INSERT' name, has_table_privilege('anon','public.audit_log','insert')::text val
union all select 'audit_log','policy anon_ins', (exists(select 1 from pg_policy where polrelid='public.audit_log'::regclass and polname='anon_ins'))::text
union all select 'classC', p.proname||'('||pg_get_function_identity_arguments(p.oid)||')', 'anon='||has_function_privilege('anon',p.oid,'execute')||' auth='||has_function_privilege('authenticated',p.oid,'execute')||' public='||coalesce((select bool_or(a.grantee=0) from aclexplode(coalesce(p.proacl,acldefault('f',p.proowner))) a where a.privilege_type='EXECUTE'),false) from pg_proc p join pg_namespace n on n.oid=p.pronamespace join c on c.f=p.proname where n.nspname='public'
union all select 'classB', p.proname, 'definer='||p.prosecdef||' cfg='||coalesce(array_to_string(p.proconfig,';'),'-') from pg_proc p join pg_namespace n on n.oid=p.pronamespace join b on b.f=p.proname where n.nspname='public'
union all select 'step2', p.proname, 'anon='||has_function_privilege('anon',p.oid,'execute')||' service='||has_function_privilege('service_role',p.oid,'execute') from pg_proc p join pg_namespace n on n.oid=p.pronamespace join s2 on s2.f=p.proname where n.nspname='public'
union all select 'C3table', t3.t, 'ins='||has_table_privilege('anon','public.'||t3.t,'insert')||' upd='||has_table_privilege('anon','public.'||t3.t,'update')||' pol='||coalesce((select string_agg(polname,',' order by polname) from pg_policy po where po.polrelid=('public.'||t3.t)::regclass and po.polcmd in ('a','w','*') and (0=any(po.polroles) or (select oid from pg_roles where rolname='anon')=any(po.polroles))),'-') from t3
union all select 'C5auth', t, 'ins='||has_table_privilege('authenticated','public.'||t,'insert')||' upd='||has_table_privilege('authenticated','public.'||t,'update') from unnest(array['the_wall','day_room','day_room_posts','journal_entries']) t
union all select 'drRPC', p.proname, 'anon='||has_function_privilege('anon',p.oid,'execute')||' auth='||has_function_privilege('authenticated',p.oid,'execute') from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname in ('dr_rest','dr_retract')
order by 1,2;
