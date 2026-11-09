# pkgRPN write target: fetchback s78 + pkgLIB_RPN stubs (E4 from pkgLIB_RPN/e4_rebase) + pkgRPN/nonlib + remove the 112 nodes + one stop node.
# Run from wall2024/: python3 pkgRPN/target_RPN.py <out.json>
import json,os,sys,hashlib,uuid as U
P=json.load(open('pkgRPN/plan_RPN.json'));W=json.load(open(P['fetchback']));assert W['versionId']==P['fetchback_version']
h=lambda s:hashlib.sha256(s.encode()).hexdigest()[:12]
R=set(P['removed']);E4={'Alternate Build','Early Alternate Build'};rows=[]
for n in W['nodes']:
    f=n['name'].replace(' ','_')+'.js'
    p=('pkgLIB_RPN/e4_rebase/' if n['name'] in E4 else 'pkgLIB_RPN/patched/')+f
    if not os.path.exists(p): p='pkgRPN/nonlib/'+f
    if not os.path.exists(p) or n['name'] in R: continue
    s=open(p).read();b=n['parameters']['jsCode']
    if s!=b: rows.append((n['name'],h(b),h(s)))
    n['parameters']['jsCode']=s
STOP='Provider Removed Stop'
ref=[n for n in W['nodes'] if n['name']=='Panel Check'][0]
stop={'id':str(U.UUID(hashlib.sha256(b'pkgRPN stop').hexdigest()[:32])),'name':STOP,'type':'n8n-nodes-base.code','typeVersion':2,'position':[ref['position'][0],ref['position'][1]+600],
 'parameters':{'jsCode':"// pkgRPN: the direct openai, gemini, grok and mimo call nodes were removed (every seat runs through openrouter or deepseek). An item routed here means a seat resolved to a removed family: fail the run closed.\nconst f=$input.all().map(it=>{const j=it.json||{};const c=j.call||j.cure||j;return String(c.fam||c.family||'?')+' '+String(c.model||c.api_model||'');}).join('; ');\nthrow new Error('FAIL-CLOSED (pkgRPN): an item was routed to a removed direct provider call (openai, gemini, grok or mimo): '+f+'. Seats must resolve to openrouter or deepseek (Init Seats, Resolve Seats, model_config).');"}}
W['nodes']=[n for n in W['nodes'] if n['name'] not in R]+[stop]
C=W['connections'];rew=0
for k in list(C):
    if k in R: del C[k];continue
    for oi,outs in enumerate(C[k].get('main',[])):
        if not outs: continue
        keep=[o for o in outs if o['node'] not in R]
        if len(keep)!=len(outs):
            assert not keep,(k,oi)
            keep=[{'node':STOP,'type':'main','index':0}];rew+=1
        C[k]['main'][oi]=keep
names={n['name'] for n in W['nodes']}
for k,v in C.items():
    assert k in names,k
    for o in v.get('main',[]):
        for x in o or []: assert x['node'] in names,(k,x)
json.dump({'nodes':W['nodes'],'connections':C},open(sys.argv[1],'w'))
for r in rows: print(r[0],r[1],'->',r[2])
print('nodes',len(W['nodes']),'removed',len(R),'switch outputs rewired to stop',rew,'code changed',len(rows))
