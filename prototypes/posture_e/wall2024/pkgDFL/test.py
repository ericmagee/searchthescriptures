import json,subprocess,sys,re
F='/root/.claude/projects/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/tool-results/mcp-supbase-fix-execute_sql-1794539764858.txt'
data=json.load(open('stored_closecon_rows.json'))
log,res=data['log'],data['res']
def psql(sql,ok=True):
    p=subprocess.run(['psql','-h','127.0.0.1','-p','5544','-U','postgres','-d','dfl','-v','ON_ERROR_STOP=1','-AtX','-F','|','-c',sql],capture_output=True,text=True)
    if ok and p.returncode: print('SQL ERROR',p.stderr[:600]); sys.exit(1)
    return (p.stdout.strip(), p.stderr.strip())
def psqlf(f):
    p=subprocess.run(['psql','-h','127.0.0.1','-p','5544','-U','postgres','-d','dfl','-v','ON_ERROR_STOP=1','-AtX','-f',f],capture_output=True,text=True)
    if p.returncode: print('FILE ERROR',f,p.stderr[:800]); sys.exit(1)
    return p.stdout.strip()
subprocess.run(['psql','-h','127.0.0.1','-p','5544','-U','postgres','-d','postgres','-c','drop database if exists dfl'],capture_output=True)
subprocess.run(['psql','-h','127.0.0.1','-p','5544','-U','postgres','-d','postgres','-c','create database dfl'],capture_output=True)
for r in ['anon','authenticated','berean_ro','lab_seat','service_role']:
    subprocess.run(['psql','-h','127.0.0.1','-p','5544','-U','postgres','-d','postgres','-c',f'create role {r}'],capture_output=True)
psql("""create table debate_results(id uuid primary key, run_token text, defender_engine text, defender_model text, challenger_engine text, challenger_model text);
create table debate_enforcer_log(id bigint primary key, debate_id uuid, run_token text, seat text, seat_role text, judge_model text, kind text, rule text, item text, flagged_line text, prompt_sent text, full_reply text, reply_error text, response_line text, cure_status text, cure_reason text, at timestamptz, created_at timestamptz default now());""")
def q(v): return 'NULL' if v is None else "'"+str(v).replace("'","''")+"'"
for r in res: psql(f"insert into debate_results values ({q(r['id'])},{q(r['run_token'])},{q(r['defender_engine'])},{q(r['defender_model'])},{q(r['challenger_engine'])},{q(r['challenger_model'])})")
print('apply:',psqlf('pkgDFL.sql')[:80].replace('\n',' '))
ok=n=0
def T(name,got,want):
    global ok,n; n+=1; g=str(got); w=str(want)
    if g==w: ok+=1
    print(('OK  ' if g==w else 'FAIL'),name,'=>',g,'' if g==w else '| want '+w)
def ins(r):
    cols=['id','debate_id','run_token','seat','seat_role','judge_model','kind','rule','item','flagged_line','response_line','cure_status','cure_reason']
    return psql('insert into debate_enforcer_log('+','.join(cols)+') values ('+','.join(q(r.get(c)) for c in cols)+')',ok=False)
# 1. replay of the stored rows, in id order, as the engine inserts them
for r in log: ins(r)
want=[r for r in log if re.match(r'^(?:[XJ]\d+|NEW) (DEFENDER|CHALLENGER) LINK \d+$',r['item'] or '') and re.match(r'^CONFIRMED( --|$)',r['cure_reason'] or '')]
T('S1 stored rows replayed: ledger rows',psql('select count(*) from debater_fault_ledger')[0],len(want))
T('S2 same log ids',psql('select coalesce(string_agg(log_id::text,\',\' order by log_id),\'\') from debater_fault_ledger')[0],','.join(str(r['id']) for r in sorted(want,key=lambda r:r['id'])))
T('S3 rows with no model',psql('select count(*) from debater_fault_ledger where debater_model is null or debater_engine is null')[0],0)
print('   by side/source:',psql("select side||' '||source||' '||count(*) from debater_fault_ledger group by side,source order by 1")[0].replace('\n','; '))
print('   report:',psql("select debater_model||' runs '||array_to_string(runs,',')||' n_runs '||n_runs||' lines '||n_lines||' links '||n_links from dfl_report order by 1")[0].replace('\n','; '))
T('S4 36156 row',psql("select side||'|'||link||'|'||debater_model||'|'||source||'|'||item from debater_fault_ledger where run=36156")[0],'DEFENDER|6|anthropic/claude-sonnet-5.5|close enforcer|X2 DEFENDER LINK 6')
T('S5 NEW items: CONFIRMED recorded, NOT A CANDIDATE not',psql("select string_agg(log_id::text,',' order by log_id) from debater_fault_ledger where item like 'NEW %'")[0],'30368,30369,32054')
# 2. plants
base=dict(debate_id=res[0]['id'],run_token=res[0]['run_token'],seat='close enforcer',seat_role='panel',kind='enforcer_check',rule='E-CLOSECON',flagged_line='CHALLENGER DR4: "x"',response_line='CLOSE-CONTRADICTION: X1 -- CHALLENGER -- LINK 2 -- CONFIRMED -- ...')
def plant(i,**kw):
    r=dict(base); r.update(kw); r['id']=i; e=ins(r); return psql(f'select count(*) from debater_fault_ledger where log_id={i}')[0], e[1]
T('P1 challenger confirmed is recorded',plant(900001,item='X1 CHALLENGER LINK 2',cure_reason='CONFIRMED -- both cannot be true')[0],1)
T('P1b its model is the challenger model',psql('select debater_model from debater_fault_ledger where log_id=900001')[0],res[0]['challenger_model'])
T('P2 NOT A CONTRADICTION not recorded',plant(900002,item='X2 CHALLENGER LINK 2',cure_reason='NOT A CONTRADICTION -- fine')[0],0)
T('P3 NONE FOUND not recorded',plant(900003,item='NONE CHALLENGER',cure_reason='NONE FOUND')[0],0)
T('P4 NOT CHECKED (timeout) not recorded',plant(900004,item='NOT CHECKED CHALLENGER',cure_reason='NOT CHECKED -- CHALLENGER: no reply')[0],0)
T('P5 "NOT CONFIRMED" not recorded',plant(900005,item='X3 CHALLENGER LINK 2',cure_reason='NOT CONFIRMED -- x')[0],0)
T('P6 "CONFIRMEDLY" not recorded',plant(900006,item='X3 CHALLENGER LINK 2',cure_reason='CONFIRMEDLY odd')[0],0)
T('P7 confirmed, already-broken wording recorded',plant(900007,item='X4 DEFENDER LINK 5',cure_reason='CONFIRMED -- the same link is already broken by an earlier confirmed line -- y')[0],1)
T('P8 judge-found J item recorded',plant(900008,seat='judge contradiction enforcer',item='J1 DEFENDER LINK 3',cure_reason='CONFIRMED -- z')[0],1)
T('P9 another rule with CONFIRMED words not recorded',plant(900009,rule='E-COL',item='X1 DEFENDER LINK 5',cure_reason='CONFIRMED -- z')[0],0)
T('P10 kind cure not recorded',plant(900010,kind='cure',item='X1 DEFENDER LINK 5',cure_reason='CONFIRMED -- z')[0],0)
T('P11 a token that is not a run (test token) not recorded',plant(900011,run_token='TEST-1',debate_id=None,item='X1 DEFENDER LINK 5',cure_reason='CONFIRMED -- z')[0],0)
g,e=plant(900012,debate_id=None,run_token='ODV1-99999-zzzz',item='X1 DEFENDER LINK 5',cure_reason='CONFIRMED -- z')
T('P12 run with no result row: recorded, model null',g+'|'+psql('select coalesce(debater_model,\'null\') from debater_fault_ledger where log_id=900012')[0],'1|null')
T('P13 lower-case side not recorded (item form is the engine\'s)',plant(900013,item='X1 defender LINK 5',cure_reason='CONFIRMED -- z')[0],0)
T('P14 cure_reason null not recorded, insert kept',plant(900014,item='X1 DEFENDER LINK 5',cure_reason=None)[0]+'|'+psql('select count(*) from debate_enforcer_log where id=900014')[0],'0|1')
# update paths
psql("update debate_enforcer_log set cure_reason='CONFIRMED -- later' where id=900014")
T('U1 later update to CONFIRMED records it',psql('select count(*) from debater_fault_ledger where log_id=900014')[0],1)
psql("update debate_enforcer_log set cure_reason='NOT A CONTRADICTION -- reversed' where id=900014")
T('U2 later update away removes it',psql('select count(*) from debater_fault_ledger where log_id=900014')[0],0)
# strike
T('K1 strike without a grade file refused',('refused' if psql("select dfl_strike(36156,'DEFENDER','X2%','wrong','')",ok=False)[1] else 'accepted'),'refused')
T('K2 strike with reason and file',psql("select dfl_strike(36156,'DEFENDER','X2%','test strike','w3/x.md')")[0],1)
T('K3 struck row leaves the report',psql("select count(*) from dfl_report where 36156 = any(runs)")[0],0)
psql("update debate_enforcer_log set cure_reason='NOT A CONTRADICTION -- x' where id=(select log_id from debater_fault_ledger where run=36156)")
T('K4 a struck row is kept when the log row changes',psql("select count(*) from debater_fault_ledger where run=36156 and struck")[0],1)
# safety: a failure inside the ledger write must not lose the engine's log row
psql("alter table debater_fault_ledger add constraint tmp_fail check (log_id <> 900020)")
g,e=plant(900020,item='X1 DEFENDER LINK 5',cure_reason='CONFIRMED -- z')
T('F1 ledger write fails: engine log row still inserted, warning raised',psql('select count(*) from debate_enforcer_log where id=900020')[0]+'|'+g+'|'+('warning' if 'dfl_from_log' in e else 'no warning'),'1|0|warning')
psql("alter table debater_fault_ledger drop constraint tmp_fail")
# other rules never call the function (WHEN clause)
psql("grant insert, select on debate_enforcer_log to service_role; grant usage on schema public to anon, lab_seat, service_role")
T('X1 anon cannot call dfl_strike',('refused' if 'permission denied' in psql("set role anon; select dfl_strike(34726,'DEFENDER','%','x','w3/x.md')",ok=False)[1] else 'accepted'),'refused')
T('X2 anon cannot call dfl_put',('refused' if 'permission denied' in psql("set role anon; select dfl_put(l) from debate_enforcer_log l limit 1",ok=False)[1] else 'accepted'),'refused')
psql("set role service_role; insert into debate_enforcer_log(id,run_token,seat,kind,rule,item,cure_reason) values (900030,'ODV1-99990-x','close enforcer','enforcer_check','E-CLOSECON','X1 DEFENDER LINK 2','CONFIRMED -- x')")
T('X3 an insert by a non-owner role still records',psql("select count(*) from debater_fault_ledger where log_id=900030")[0],1)
T('X4 lab_seat can strike',psql("set role lab_seat; select dfl_strike(99990,'DEFENDER','X1%','test','w3/x.md')")[0.split()[-1],1)
T('W1 trigger WHEN clause',psql("select pg_get_triggerdef(oid) ~ 'WHEN \\(\\(new.rule = ''E-CLOSECON''' from pg_trigger where tgname='dfl_from_log'")[0],'t')
# backfill on a fresh ledger equals the replay
ids_before=psql("select string_agg(log_id::text,',' order by log_id) from debater_fault_ledger where log_id<900000 and not struck")[0]
psql("delete from debater_fault_ledger")
psqlf('pkgDFL_backfill_optional.sql')
T('B1 optional backfill gives the same stored rows',psql("select count(*) from debater_fault_ledger where log_id<900000")[0],len(want)-1)  # 36156 X2 was changed to NOT A CONTRADICTION in K4
psqlf('pkgDFL_backfill_optional.sql')
T('B2 backfill twice adds nothing',psql("select count(*) from debater_fault_ledger where log_id<900000")[0],len(want)-1)
# revert
psqlf('pkgDFL_revert.sql')
T('R1 revert leaves no object',psql("select (select count(*) from pg_class where relname in ('debater_fault_ledger','dfl_report')) + (select count(*) from pg_proc where proname like 'dfl_%') + (select count(*) from pg_trigger where tgname='dfl_from_log')")[0],0)
g=ins(dict(base,id=900030,item='X1 DEFENDER LINK 5',cure_reason='CONFIRMED -- z'))
T('R2 after revert the engine insert works',psql('select count(*) from debate_enforcer_log where id=900030')[0],1)
print(f'{ok} of {n}')
