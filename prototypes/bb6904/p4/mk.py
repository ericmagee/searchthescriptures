# BB-6904 portion 4: build the cure path as a draft change set against live db281705. Writes ops.json (nodes to add, connections to change,
# the 9 named-read edits) and one .js per new Code node. Usage: python3 mk.py <post-publish details json> (not -I: bodies.py must import from this folder). Nothing is written to the flow.
import json,sys,hashlib,copy
from bodies import *
md5=lambda s:hashlib.md5((s if s.endswith('\n') else s+'\n').encode()).hexdigest()
w=json.load(open(sys.argv[1]))['workflow'];N={n['name']:n for n in w['nodes']};C=w['connections']
blk=open('drv_block_0b3cbac.js').read();lib=open('cure_lib.js').read()
code=lambda body:blk+'\n'+lib+'\n'+body.strip()+'\n'
FAMS=['deepseek','openai','gemini','grok','mimo','openrouter']
JUDGE={'deepseek':'Independent Verdict Call','openai':'Verdict Call openai','gemini':'Verdict Call gemini','grok':'Verdict Call grok','mimo':'Verdict Call mimo','openrouter':'Verdict Call openrouter'}
def ifnode(name,expr,pos):return {'name':name,'type':'n8n-nodes-base.if','typeVersion':N['Dry?']['typeVersion'],'position':pos,
 'parameters':{'conditions':{'combinator':'and','conditions':[{'id':name.lower().replace(' ','-').replace('?',''),'leftValue':expr,'operator':{'operation':'true','singleValue':True,'type':'boolean'},'rightValue':''}],
  'options':{'caseSensitive':True,'leftValue':'','typeValidation':'loose'}},'options':{}}}
def codenode(name,src,pos):return {'name':name,'type':'n8n-nodes-base.code','typeVersion':N['Extract Independent Verdict']['typeVersion'],'position':pos,'parameters':{'jsCode':src}}
def routenode(name,pos):return {'name':name,'type':'n8n-nodes-base.switch','typeVersion':N['Verdict Judge Route']['typeVersion'],'position':pos,
 'parameters':{'mode':'expression','numberOutputs':7,'output':'={{ $json.cure.skip ? 6 : $json.cure.jidx }}'}}
def callnode(name,fam,pos):
 j=copy.deepcopy(N[JUDGE[fam]]);p=j['parameters']
 p['jsonBody']='={{ $json.cure.body }}'
 if fam=='gemini':p['url']="={{ 'https://generativelanguage.googleapis.com/v1beta/models/' + $json.cure.model + ':generateContent' }}"
 n={'name':name,'type':j['type'],'typeVersion':j['typeVersion'],'position':pos,'parameters':p,'credentials':j.get('credentials'),
    'onError':'continueRegularOutput','retryOnFail':False}
 return n
nodes=[];x0,y0=N['Extract Independent Verdict']['position'];px,py=N['Panel Payloads']['position']
# Single judge: one item, so one branch fires at the route's join.
x,y=x0,y0+400
nodes.append(ifnode('Cure Needed?',"={{ ($json.debate_rule_violations||[]).length>0 }}",[x,y]))
nodes.append(codenode('Cure Build',code(SINGLE_BUILD),[x+200,y]))
nodes.append(routenode('Cure Route',[x+400,y]))
for i,f in enumerate(FAMS):nodes.append(callnode('Cure Call '+f,f,[x+600,y-250+100*i]))
nodes.append(codenode('Cure Normalize',code(NORMALIZE.replace('__BUILD__','Cure Build')),[x+800,y]))
nodes.append(codenode('Cure Check',code(SINGLE_CHECK),[x+1000,y]))
# Panel: three serial slots (ruled BB-6987), one item each, chained as the judges are; Panel Cure Check once, after slot 3.
x,y=px,py+400
nodes.append(ifnode('Panel Cure Needed?',"={{ ($json.summary||[]).some(s=>(s.drv||[]).length>0) }}",[x,y]))
for k in (1,2,3):
 X=x+200+(k-1)*800
 nodes.append(codenode('Panel Cure Build %d'%k,code(PANEL_BUILD.replace('__I__',str(k-1))),[X,y]))
 nodes.append(routenode('Panel Cure Route %d'%k,[X+200,y]))
 for i,f in enumerate(FAMS):nodes.append(callnode('Panel Cure Call %d %s'%(k,f),f,[X+400,y-250+100*i]))
 nodes.append(codenode('Panel Cure Normalize %d'%k,code(NORMALIZE.replace('__BUILD__','Panel Cure Build %d'%k)),[X+600,y]))
nodes.append(codenode('Panel Cure Check',code(PANEL_CHECK),[x+2600,y]))
def edge(a,b,out=0):return {'from':a,'out':out,'to':b}
conn_remove=[edge('Extract Independent Verdict','Build Diagnostic Prompt'),edge('Panel Payloads','Dry?')]
conn_add=[]
conn_add+= [edge('Extract Independent Verdict','Cure Needed?'),edge('Cure Needed?','Cure Build',0),edge('Cure Needed?','Cure Check',1),edge('Cure Build','Cure Route')]
conn_add+= [edge('Cure Route','Cure Call '+f,i) for i,f in enumerate(FAMS)]+[edge('Cure Route','Cure Normalize',6)]
conn_add+= [edge('Cure Call '+f,'Cure Normalize') for f in FAMS]+[edge('Cure Normalize','Cure Check'),edge('Cure Check','Build Diagnostic Prompt')]
conn_add+= [edge('Panel Payloads','Panel Cure Needed?'),edge('Panel Cure Needed?','Panel Cure Build 1',0),edge('Panel Cure Needed?','Panel Cure Check',1)]
for k in (1,2,3):
 conn_add+= [edge('Panel Cure Build %d'%k,'Panel Cure Route %d'%k)]+[edge('Panel Cure Route %d'%k,'Panel Cure Call %d %s'%(k,f),i) for i,f in enumerate(FAMS)]+[edge('Panel Cure Route %d'%k,'Panel Cure Normalize %d'%k,6)]
 conn_add+= [edge('Panel Cure Call %d %s'%(k,f),'Panel Cure Normalize %d'%k) for f in FAMS]
 conn_add+= [edge('Panel Cure Normalize %d'%k,'Panel Cure Build %d'%(k+1) if k<3 else 'Panel Cure Check')]
conn_add+= [edge('Panel Cure Check','Dry?')]
# The named reads move to the Cure Check nodes (shape A, 6944): 1 + 8 references in 8 nodes (6945 measured 9).
edits=[];
for name,old,new in [('Build Diagnostic Prompt',"$('Extract Independent Verdict')","$('Cure Check')")]+[(k,"$('Panel Payloads')","$('Panel Cure Check')") for k in ['Write Judgment 1','Write Judgment 2','Write Judgment 3','Derive Outcome','Panel Done','Replay Rows','Record Substitution']]:
 p=N[name]['parameters'];s=json.dumps(p);n=s.count(old.replace("'","\\'") if False else old)
 t=json.loads(s.replace(old,new));edits.append({'node':name,'old':old,'new':new,'count':n,'parameters':t})
for x in nodes:
 if x['type'].endswith('.code'):open(x['name'].replace(' ','_').replace('?','')+'.js','w').write(x['parameters']['jsCode'])
json.dump({'base':w['versionId'],'nodes_add':nodes,'connections_remove':conn_remove,'connections_add':conn_add,'edits':edits},open('ops.json','w'),indent=1,ensure_ascii=False)
print('nodes added',len(nodes),'| connections -',len(conn_remove),'+',len(conn_add),'| edits',[(e['node'],e['count']) for e in edits],'| refs',sum(e['count'] for e in edits))
for x in nodes:
 if x['type'].endswith('.code'):print(' ',x['name'],md5(x['parameters']['jsCode'])[:8],len(x['parameters']['jsCode']))
