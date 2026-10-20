# BB-6904 portion 4: build the cure path as a draft change set against live db281705. Writes ops.json (nodes to add, connections to change,
# the 9 named-read edits) and one .js per new Code node. Usage: python3 -I mk.py <post-publish details json>. Nothing is written to the flow.
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
for pre,base,(x,y),bld,nrm,chk,need in [('',  'S',(x0,y0+400),SINGLE_BUILD,'Cure Normalize',SINGLE_CHECK,"={{ ($json.debate_rule_violations||[]).some(x=>x.rule==='K-B') }}"),
                                        ('Panel ','P',(px,py+400),PANEL_BUILD,'Panel Cure Normalize',PANEL_CHECK,"={{ ($json.summary||[]).some(s=>(s.drv||[]).some(x=>x.rule==='K-B')) }}")]:
 nodes.append(ifnode(pre+'Cure Needed?',need,[x,y]))
 nodes.append(codenode(pre+'Cure Build',code(bld),[x+200,y]))
 nodes.append(routenode(pre+'Cure Route',[x+400,y]))
 for i,f in enumerate(FAMS):nodes.append(callnode(pre+'Cure Call '+f,f,[x+600,y-250+100*i]))
 nodes.append(codenode(nrm,code(NORMALIZE.replace('__BUILD__',pre+'Cure Build')),[x+800,y]))
 nodes.append(codenode(pre+'Cure Check',code(chk),[x+1000,y]))
def edge(a,b,out=0):return {'from':a,'out':out,'to':b}
conn_remove=[edge('Extract Independent Verdict','Build Diagnostic Prompt'),edge('Panel Payloads','Dry?')]
conn_add=[]
for pre,src,dst in [('','Extract Independent Verdict','Build Diagnostic Prompt'),('Panel ','Panel Payloads','Dry?')]:
 conn_add+= [edge(src,pre+'Cure Needed?'),edge(pre+'Cure Needed?',pre+'Cure Build',0),edge(pre+'Cure Needed?',pre+'Cure Check',1),edge(pre+'Cure Build',pre+'Cure Route')]
 conn_add+= [edge(pre+'Cure Route',pre+'Cure Call '+f,i) for i,f in enumerate(FAMS)]+[edge(pre+'Cure Route',pre+'Cure Normalize',6)]
 conn_add+= [edge(pre+'Cure Call '+f,pre+'Cure Normalize') for f in FAMS]+[edge(pre+'Cure Normalize',pre+'Cure Check'),edge(pre+'Cure Check',dst)]
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
