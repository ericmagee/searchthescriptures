#!/usr/bin/env python3
"""s430 (ruling 428, the send-back half; journal 2078): adds Send Back Build -> Send Back Needed? -> Send Back Call openrouter -> Send Back Record
between Judge Enforcer Record and Alternate Needed?; Alternate Merge logs the send-back rows; Format Markdown prints them. Base: live f2c984c9."""
import json,os,copy,uuid
R=os.path.dirname(os.path.abspath(__file__))
W=json.load(open(f'{R}/../s429/fetchback_s429.json'));NEW=copy.deepcopy(W);N={n['name']:n for n in NEW['nodes']};C=NEW['connections']
def rep(nm,a,b):
    c=N[nm]['parameters']['jsCode'];k=c.count(a)
    if k!=1: raise SystemExit(f'{nm}: anchor count {k}: {a[:70]}')
    N[nm]['parameters']['jsCode']=c.replace(a,b)
os.makedirs(f'{R}/base',exist_ok=True)
for nm in ['Alternate Merge','Format Markdown']: open(f'{R}/base/{nm}.js','w').write(N[nm]['parameters']['jsCode'])
rep('Alternate Merge',"// ruling 428: E-ANS and E-VOID rows (RECORD-ONLY TRIAL)",
 "// ruling 428: E-ANS and E-VOID rows (RECORD-ONLY TRIAL)\n try{if($('Send Back Record').isExecuted)($('Send Back Record').first().json.sb_rows||[]).forEach(x=>enforcer_log.push(x));}catch(e){} // s430: the send-back rows (ruling 428)")
rep('Format Markdown',"t += '---\\n\\n';\nt += '## How to read this debate",
 "// s430 (ruling 428): every enforcer disagreement sent back to its judge, the enforcer's reason, and the judge's answer (the judge keeps the decision).\n"
 "{let SB=null;try{SB=$('Send Back Record').first().json;}catch(e){SB=null;}\n"
 " if(SB&&SB.sendback){const cl=s=>String(s==null?'':s).replace(/\\|/g,'/').replace(/\\n/g,' ');t += '## Enforcer send-back\\n\\n';\n"
 "  if(SB.sendback.skipped)t += 'Nothing was sent back: ' + cl(SB.sendback.why) + '.\\n\\n';\n"
 "  else{const ty=SB.sendback.tally||{};t += 'Each line an enforcer disagreed with went back once to the judge that wrote it, with the enforcer\\'s reason. The judge keeps the decision. Answers: KEEP ' + (ty.KEEP||0) + ', CHANGE ' + (ty.CHANGE||0) + ', no answer ' + (ty['NO ANSWER']||0) + '. A CHANGE is recorded here; the counts and result above are not recomputed from it.\\n\\n';\n"
 "   t += '| Judge | Rule | Item | The judge\\'s line | The enforcer | The judge\\'s answer |\\n|---|---|---|---|---|---|\\n';\n"
 "   (SB.sb_items||[]).forEach(x=>{t += '| ' + cl(nm(x.seat)) + ' | ' + cl(x.rule) + ' | ' + cl(String(x.item||'').slice(0,160)) + ' | ' + cl(String(x.line||'').slice(0,400)) + ' | ' + cl(String(x.reason||'').slice(0,400)) + ' | **' + cl(x.ans) + '**' + (x.to?' to: ' + cl(x.to.slice(0,300)):'') + ' -- ' + cl(String(x.why||'').slice(0,400)) + ' |\\n';});t += '\\n';}\n"
 "  if(SB.sendback.not_sent)t += SB.sendback.not_sent + ' item(s) were not sent; the enforcer log names each and why.\\n\\n';}}\n"
 "t += '---\\n\\n';\nt += '## How to read this debate")
x0,y0=N['Judge Enforcer Record']['position']
def code(name,file,pos): return {'parameters':{'jsCode':open(f'{R}/new/{file}').read()},'id':str(uuid.uuid4()),'name':name,'type':'n8n-nodes-base.code','typeVersion':2,'position':pos}
NEW['nodes'].append(code('Send Back Build','Send Back Build.js',[x0+220,y0]))
IFN=copy.deepcopy(N['Judge Enforcer Needed?']);IFN['id']=str(uuid.uuid4());IFN['name']='Send Back Needed?';IFN['position']=[x0+440,y0]
IFN['parameters']['conditions']['conditions'][0]['id']='send-back-needed-428';IFN['parameters']['conditions']['conditions'][0]['leftValue']='={{ $json.sb_skip !== true }}'
NEW['nodes'].append(IFN)
CALL=copy.deepcopy(N['Alternate Cure Call openrouter']);CALL['id']=str(uuid.uuid4());CALL['name']='Send Back Call openrouter';CALL['position']=[x0+660,y0-40]
CALL['parameters']['jsonBody']="={{ (__b=>(__b&&typeof __b==='object'&&/^z-ai\\//.test(String(__b.model||'')))?Object.assign({},__b,{provider:{order:['z-ai'],allow_fallbacks:false} }):__b)($json.body) }}"
NEW['nodes'].append(CALL)
NEW['nodes'].append(code('Send Back Record','Send Back Record.js',[x0+880,y0]))
assert C['Judge Enforcer Record']['main']==[[{'node':'Alternate Needed?','type':'main','index':0}]]
C['Judge Enforcer Record']['main']=[[{'node':'Send Back Build','type':'main','index':0}]]
C['Send Back Build']={'main':[[{'node':'Send Back Needed?','type':'main','index':0}]]}
C['Send Back Needed?']={'main':[[{'node':'Send Back Call openrouter','type':'main','index':0}],[{'node':'Send Back Record','type':'main','index':0}]]}
C['Send Back Call openrouter']={'main':[[{'node':'Send Back Record','type':'main','index':0}]]}
C['Send Back Record']={'main':[[{'node':'Alternate Needed?','type':'main','index':0}]]}
for nm in ['Alternate Merge','Format Markdown']: open(f'{R}/new/{nm}.js','w').write(N[nm]['parameters']['jsCode'])
json.dump(NEW,open(f'{R}/workflow_s430.json','w'))
print('built: nodes',len(W['nodes']),'->',len(NEW['nodes']))
