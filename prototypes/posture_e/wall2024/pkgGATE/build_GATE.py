# pkgGATE: E-GATE (WALL-2024 2242 design; rulings 2243 and 2251). Run from wall2024/.
# Base: pkgKCR/patched/Alternate_Merge.js (= merged_PWQA + pkgR2 + pkgKCON + pkgKCR; the stack sent live in Wall 2258).
# One changed node (Alternate Merge) and four new nodes after Send Back Record: Gate Build, Gate Needed?, Gate Call openrouter, Gate Record.
# The new code nodes carry Alternate Merge's library (as every library node does), so the cure, E-APPLY and drvCheck functions are the same.
import hashlib,json,os,uuid
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
B='pkgKCR/patched/Alternate_Merge.js';O='pkgGATE/patched';os.makedirs(O,exist_ok=True)
rd=lambda p:open(p).read()
o=rd(B);s=o
v1=rd('pkgAPPLY/sb_apply.js');v2=rd('pkgGATE/sb_apply_v2.js');gl=rd('pkgGATE/gate_lib.js')
assert s.count(v1)==1;s=s.replace(v1,v2+'\n'+gl)
MARK="const PP=$('Panel Cure Check').first().json;"
assert s.count(MARK)==1;lib=s[:s.index(MARK)]
edits=[]
def rep(a,b,tag):
    global s
    assert s.count(a)==1,(tag,s.count(a));s=s.replace(a,b);edits.append(tag)
rep(MARK,"let PP=$('Panel Cure Check').first().json;try{if($('Gate Record').isExecuted){const GR=$('Gate Record').first().json;if(Array.isArray(GR.bodies)&&GR.bodies.length===(PP.bodies||[]).length)PP={...PP,bodies:GR.bodies};}}catch(e){} /* E-GATE: the bodies with the gate's uncured count */",'PP from Gate Record bodies')
rep("const SBI=$('Send Back Record').first().json.sb_items||[];","let SBI=$('Send Back Record').first().json.sb_items||[];try{if($('Gate Record').isExecuted)SBI=$('Gate Record').first().json.sb_items||SBI;}catch(e){} /* E-GATE: the gate changes join the send-back answers */",'SBI from Gate Record')
rep("const R=sbApply2024(sm.seat,b.payload.verdict_raw,F0,its);","const R=sbApply2024(sm.seat,b.payload.verdict_raw,F0,its,sbRoundsOf2024(sm.seat));",'sbApply2024 with rounds')
a=" try{if($('Send Back Record').isExecuted)($('Send Back Record').first().json.sb_rows||[]).forEach(x=>enforcer_log.push(x));}catch(e){} // s430: the send-back rows (ruling 428)"
rep(a,a+"\n try{if($('Gate Record').isExecuted)($('Gate Record').first().json.gate_rows||[]).forEach(x=>enforcer_log.push(x));}catch(e){} // E-GATE: the gate rows",'gate rows to enforcer log')
open(O+'/Alternate_Merge.js','w').write(s)
gb=lib+'\n'+rd('pkgGATE/agr_tail.js')+'\n'+rd('pkgGATE/gate_build_tail.js');open(O+'/Gate_Build.js','w').write(gb)
gr=lib+'\n'+rd('pkgGATE/gate_record_tail.js');open(O+'/Gate_Record.js','w').write(gr)
# the n8n nodes: clones of the send-back's If and HTTP nodes (base_nodes_68fe.json, read from the prewrite copy of the live workflow)
N=json.load(open('pkgGATE/base_nodes_68fe.json'))
ids=lambda k:str(uuid.uuid5(uuid.NAMESPACE_URL,'odv1-egate-'+k))
x,y=16272,960
ifn=json.loads(json.dumps(N['Send Back Needed?']));ifn.update({'id':ids('needed'),'name':'Gate Needed?','position':[x+440,y]})
c=ifn['parameters']['conditions']['conditions'][0];c['id']='gate-needed';c['leftValue']='={{ $json.gate_skip !== true }}'
call=json.loads(json.dumps(N['Send Back Call openrouter']));call.update({'id':ids('call'),'name':'Gate Call openrouter','position':[x+660,y-40]})
jb=call['parameters']['jsonBody'];XA='"Alternate Cure Call openrouter",';assert jb.count(XA)==1
call['parameters']['jsonBody']=jb.replace(XA,XA+' "Send Back Call openrouter", "Gate Call openrouter",') # grok's send-back reply keeps its reasoning
code=lambda k,nm,px:{'id':ids(k),'name':nm,'type':'n8n-nodes-base.code','typeVersion':2,'position':[px,y],'parameters':{'jsCode':'FILE:pkgGATE/patched/'+nm.replace(' ','_')+'.js'}}
nodes=[code('build','Gate Build',x+220),ifn,call,code('record','Gate Record',x+880)]
conn={'remove':[['Send Back Record',0,'Alternate Needed?']],
 'add':[['Send Back Record',0,'Gate Build'],['Gate Build',0,'Gate Needed?'],['Gate Needed?',0,'Gate Call openrouter'],['Gate Needed?',1,'Gate Record'],['Gate Call openrouter',0,'Gate Record'],['Gate Record',0,'Alternate Needed?']],
 'note':'the nodes right of Send Back Record (Alternate Needed? onward) are not moved; move them 1100 to the right if they overlap'}
json.dump({'nodes':nodes,'connections':conn},open('pkgGATE/nodes_GATE.json','w'),indent=1)
plan={'base':'pkgKCR/patched (Alternate Merge only); new nodes from pkgGATE','nodes':[
 {'file':'Alternate_Merge.js','name':'Alternate Merge','base_sha':sha(o),'final_sha':sha(s),'edits':['sbApply2024 v2 (keystone rules 0-2, rounds) + gate_lib']+edits},
 {'file':'Gate_Build.js','name':'Gate Build','new':True,'final_sha':sha(gb)},{'file':'Gate_Record.js','name':'Gate Record','new':True,'final_sha':sha(gr)}],
 'new_nodes':'nodes_GATE.json (Gate Needed? and Gate Call openrouter are cloned from Send Back Needed? and Send Back Call openrouter)'}
json.dump(plan,open('pkgGATE/plan_GATE.json','w'),indent=1)
print('Alternate Merge',sha(o),'->',sha(s),len(edits)+1,'edits; Gate Build',sha(gb),len(gb),'; Gate Record',sha(gr),len(gr))
