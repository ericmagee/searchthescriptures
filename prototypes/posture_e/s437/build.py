#!/usr/bin/env python3
"""s437, WALL-1963 piece 4b (rulings 428, 439, 443, 444, 445): the enforcer and the send-back for a seated alternate judge. The panel's enforcer
runs before Alternate Build, so an alternate's judgment was never read. Eight nodes are added after Alternate Merge, cloned from the panel's
chain with their sources swapped: Alt Enforcer Build/Needed?/Call deepseek/Record, Alt Send Back Build/Needed?/Call openrouter/Record. When no
alternate is seated, the build skips and the run passes through with no model call (ruling 443). The synthesis is not read again. Rows carry
seat_role 'alternate'. Alt Send Back Record adds both passes' rows to enforcer_log_body; Write Enforcer Log reads it from there.
Input: a fetch of live (argv[1]). Output: workflow_s437.json (the whole workflow) and new/*.js."""
import json,os,sys,copy,uuid
R=os.path.dirname(os.path.abspath(__file__));os.makedirs(os.path.join(R,'new'),exist_ok=True);os.makedirs(os.path.join(R,'base'),exist_ok=True)
live=json.load(open(sys.argv[1]));W=copy.deepcopy(live);N={n['name']:n for n in W['nodes']}
def code(nm):return N[nm]['parameters']['jsCode']
def rep(s,a,b,k=1):
    c=s.count(a)
    if c!=k: raise SystemExit(f'anchor count {c} (want {k}): {a[:80]}')
    return s.replace(a,b)
# 1. Alt Enforcer Build
c=code('Judge Enforcer Build')
c=rep(c,"const PCC=$('Panel Cure Check').first().json;",
 "const AM=$('Alternate Merge').first().json;const ASEAT=new Set((AM.alternates_seated||[]).map(x=>x.alternate_seat));"
 "const PCC={bodies:(AM.bodies||[]).filter(b=>{try{return ASEAT.has((typeof b==='string'?JSON.parse(b):b).payload.judge_seat);}catch(e){return false;}})}; /* s437 piece 4b: the seated alternates' judgments only */")
c=rep(c,"if(!judges.length)return skip('no panel judgment text');","if(!judges.length)return skip('no alternate judge was seated');")
c=rep(c,"let SY='';try{const RG=$('Regrade Load').isExecuted?$('Regrade Load').first().json.f:$('Final Output').first().json;SY=String(RG.synthesis||'');}catch(e){SY='';}",
 "let SY=''; /* s437: the synthesis was read in the panel pass */")
c=c.replace("seat_role:'panel'","seat_role:'alternate'")
AEB="// s437 (WALL-1963 piece 4b): a clone of Judge Enforcer Build that reads only the seated alternates' judgments (Alternate Merge).\n"+c
# 4. Alt Enforcer Record
c=code('Judge Enforcer Record')
c=rep(c,"const PASS=$('Enforcer Record').first().json;","const PASS=$('Alternate Merge').first().json;")
c=rep(c,"$('Judge Enforcer Build')","$('Alt Enforcer Build')")
c=rep(c,"seat_role:x.rule==='E-SYN'?'synthesis':'panel'","seat_role:'alternate'")
c=rep(c,"enf428:","alt_enf:",2);c=rep(c,"enf428_rows:","alt_enf_rows:",2)
AER="// s437 (WALL-1963 piece 4b): a clone of Judge Enforcer Record for the seated alternates; passes Alternate Merge's output on.\n"+c
# 5. Alt Send Back Build
c=code('Send Back Build')
c=rep(c,"let PB=null;try{PB=$('Panel Build').first().json;}catch(e){PB=null;}",
 "let PB=null;try{const AB=$('Alternate Build').isExecuted?$('Alternate Build').all().map(x=>x.json.alt).filter(a=>a&&!a.skip&&a.body):[];"
 "PB={run_token:$('Init Seats').first().json.run_token,judges:AB.map(a=>({seat:a.seat,fam:'openrouter',api_model:a.api_model,body:a.body}))};}catch(e){PB=null;} /* s437: the alternates' own requests */")
c=rep(c,"let PCC=null;try{PCC=$('Panel Cure Check').first().json;}catch(e){PCC=null;}","let PCC=null;try{PCC={bodies:$('Alternate Merge').first().json.bodies||[]};}catch(e){PCC=null;}")
c=rep(c,"let E421=[];try{if($('Enforcer Record').isExecuted)E421=$('Enforcer Record').first().json.enf421_rows||[];}catch(e){E421=[];}","let E421=[]; /* s437: the withdrawal enforcer reads panel seats only */")
c=rep(c,"const E428=PASS.enf428_rows||[];","const E428=PASS.alt_enf_rows||[];")
c=rep(c,"x.seat_role==='panel'","x.seat_role==='alternate'")
c=rep(c,"skip('no enforcer reported a violation in a panel judge line')","skip('no enforcer reported a violation in an alternate judge line')")
c=rep(c,"skip('the panel judges\\' requests could not be read'","skip('the alternate judges\\' requests could not be read'")
ASB="// s437 (WALL-1963 piece 4b): a clone of Send Back Build for the seated alternates, in each alternate's own conversation.\n"+c
# 8. Alt Send Back Record
c=code('Send Back Record')
c=rep(c,"const PASS=$('Judge Enforcer Record').first().json;","const PASS=$('Alt Enforcer Record').first().json;\n"
 "const F=o=>{const L=[].concat((o.enforcer_log_body&&o.enforcer_log_body.p_rows)||o.enforcer_log||[],o.alt_enf_rows||[],o.alt_sb_rows||[]);return {...o,enforcer_log:L,enforcer_log_body:{...(o.enforcer_log_body||{}),p_rows:L}};}; /* s437: both alternate passes' rows join the run's log */")
c=rep(c,"$('Send Back Build')","$('Alt Send Back Build')")
c=rep(c,"seat_role:'panel'","seat_role:'alternate'",2)
c=rep(c,"return [{json:{...PASS,","return [{json:F({...PASS,",2)
c=rep(c,"sb_rows:ns,sb_items:[]}}];","alt_sb_rows:ns,alt_sb_items:[]})}];")
c=rep(c,"sb_rows:rows,sb_items:shown}}];","alt_sb_rows:rows,alt_sb_items:shown})}];")
c=rep(c,"sendback:","alt_sendback:",2)
ASR="// s437 (WALL-1963 piece 4b): a clone of Send Back Record for the seated alternates; its output is Alternate Merge's, with both passes' rows logged.\n"+c
# nodes
def clone(src,name,dx,dy,params=None):
    n=copy.deepcopy(N[src]);n['name']=name;n['id']=str(uuid.uuid5(uuid.NAMESPACE_URL,'s437/'+name));p=N['Alternate Merge']['position'];n['position']=[p[0]+dx,p[1]+dy]
    if params is not None:n['parameters']['jsCode']=params
    if n['type'].endswith('.if'):
        for cnd in n['parameters']['conditions']['conditions']:cnd['id']=str(uuid.uuid5(uuid.NAMESPACE_URL,'s437/'+name+'/c'))
    return n
NEWN=[clone('Judge Enforcer Build','Alt Enforcer Build',220,300,AEB),clone('Judge Enforcer Needed?','Alt Enforcer Needed?',440,300),
 clone('Judge Enforcer Call deepseek','Alt Enforcer Call deepseek',660,240),clone('Judge Enforcer Record','Alt Enforcer Record',880,300,AER),
 clone('Send Back Build','Alt Send Back Build',1100,300,ASB),clone('Send Back Needed?','Alt Send Back Needed?',1320,300),
 clone('Send Back Call openrouter','Alt Send Back Call openrouter',1540,240),clone('Send Back Record','Alt Send Back Record',1760,300,ASR)]
for n in NEWN:
    assert n['name'] not in N
    W['nodes'].append(n)
C=W['connections'];M=lambda t:[{'node':t,'type':'main','index':0}]
assert C['Alternate Merge']['main']==[M('Dry?')]
C['Alternate Merge']['main']=[M('Alt Enforcer Build')]
C['Alt Enforcer Build']={'main':[M('Alt Enforcer Needed?')]}
C['Alt Enforcer Needed?']={'main':[M('Alt Enforcer Call deepseek'),M('Alt Enforcer Record')]}
C['Alt Enforcer Call deepseek']={'main':[M('Alt Enforcer Record')]}
C['Alt Enforcer Record']={'main':[M('Alt Send Back Build')]}
C['Alt Send Back Build']={'main':[M('Alt Send Back Needed?')]}
C['Alt Send Back Needed?']={'main':[M('Alt Send Back Call openrouter'),M('Alt Send Back Record')]}
C['Alt Send Back Call openrouter']={'main':[M('Alt Send Back Record')]}
C['Alt Send Back Record']={'main':[M('Dry?')]}
wl=N['Write Enforcer Log']['parameters'];wl['jsonBody']=rep(wl['jsonBody'],"$('Alternate Merge').first().json.enforcer_log_body","$('Alt Send Back Record').first().json.enforcer_log_body")
for nm,s in [('Alt Enforcer Build',AEB),('Alt Enforcer Record',AER),('Alt Send Back Build',ASB),('Alt Send Back Record',ASR)]:open(os.path.join(R,'new',nm+'.js'),'w').write(s)
json.dump(W,open(os.path.join(R,'workflow_s437.json'),'w'))
json.dump({'base_versionId':live['versionId'],'nodes_before':len(live['nodes']),'nodes_after':len(W['nodes'])},open(os.path.join(R,'manifest.json'),'w'),indent=1)
print('built s437 on',live['versionId'],'| nodes',len(live['nodes']),'->',len(W['nodes']))
