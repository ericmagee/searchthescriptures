# BB-6904 (g), step 7 build: the alternate path as a draft change set. Writes ops7.json and one .js per
# new or changed Code node. Applies nothing. Built on: portion 3 + 5B Panel Payloads (p5b/out), portion 4 (p4: ops.json, cure lib),
# step 6 (Worker_A3, rev 4 d0d5aab: cure_lib.js, Format_Markdown.js).
# Usage: python3 mk7.py <live details json (db281705)> <p4 dir> <p5b out dir> <step 6 out dir (rev 4, d0d5aab)> <out dir>
import json,sys,hashlib,os,copy
from bodies7 import *
md5=lambda s:hashlib.md5((s if s.endswith('\n') else s+'\n').encode()).hexdigest()
def once(src,old,new,what):
  n=src.count(old);assert n==1,'%s: anchor found %d times'%(what,n);return src.replace(old,new)
LIVE,P4,P5B,P6,OUT=sys.argv[1:6];os.makedirs(OUT,exist_ok=True)
w=json.load(open(LIVE))['workflow'];N={n['name']:n for n in w['nodes']}
ops4=json.load(open(os.path.join(P4,'ops.json')))
blk=open(os.path.join(P4,'drv_block_0b3cbac.js')).read();lib=open(os.path.join(P6,'cure_lib.js')).read()
lib_code=lambda body:blk+'\n'+lib+'\n'+body.strip()+'\n'
pp=open(os.path.join(P5B,'Panel_Payloads.js')).read();k=pp.index('const bodies=[];const summary=[];');helpers=pp[:k]
res={};files={}
def save(name,src):files[name]=src;open(os.path.join(OUT,name.replace(' ','_').replace('?','')+'.js'),'w').write(src)
# 1. Init Seats and Resolve Seats (live code + the patches above).
s=N['Init Seats']['parameters']['jsCode'];s2=once(s,INIT_MM_ANCHOR,INIT_MM_ADD+INIT_MM_ANCHOR,'Init Seats MiniMax');s2=once(s2,INIT_ANCHOR,INIT_ANCHOR+INIT_ADD,'Init Seats');s2=once(s2,INIT_RET_OLD,INIT_RET_NEW,'Init Seats return');save('Init Seats',s2)
s=N['Resolve Seats']['parameters']['jsCode'];s2=once(s,RS_RES_OLD,RS_RES_NEW,'Resolve Seats reserve');s2=once(s2,RS_ANCHOR,RS_ADD+RS_ANCHOR,'Resolve Seats');s2=once(s2,RS_RET_OLD,RS_RET_NEW,'Resolve Seats return');save('Resolve Seats',s2)
# 2. New nodes.
x0,y0=N['Dry?']['position']
def ifnode(name,expr,pos):return {'name':name,'type':'n8n-nodes-base.if','typeVersion':N['Dry?']['typeVersion'],'position':pos,
 'parameters':{'conditions':{'combinator':'and','conditions':[{'id':name.lower().replace(' ','-').replace('?',''),'leftValue':expr,'operator':{'operation':'true','singleValue':True,'type':'boolean'},'rightValue':''}],
  'options':{'caseSensitive':True,'leftValue':'','typeValidation':'loose'}},'options':{}}}
def codenode(name,src,pos):save(name,src);return {'name':name,'type':'n8n-nodes-base.code','typeVersion':N['Panel Payloads']['typeVersion'],'position':pos,'parameters':{'jsCode':src}}
def callnode(name,body,pos):
  j=copy.deepcopy(N['Panel Reserve openrouter']);p=j['parameters'];p['jsonBody']=body
  return {'name':name,'type':j['type'],'typeVersion':j['typeVersion'],'position':pos,'parameters':p,'credentials':j.get('credentials'),'onError':'continueRegularOutput','retryOnFail':False}
# The Normalize code of a panel cure slot (BB-6987), pointed at Alternate Cure Build. The alternates all run on one OpenRouter call
# node, so its items reach Alternate Cure Normalize in one run; no fan-out join.
NORM=[n for n in ops4['nodes_add'] if n['name']=='Panel Cure Normalize 1'][0]['parameters']['jsCode']
NORM=NORM.replace("$('Panel Cure Build 1')","$('Alternate Cure Build')");assert NORM.count("$('Alternate Cure Build')")==2
nodes=[ifnode('Alternate Needed?',ALT_NEED,[x0-900,y0+700]),
 codenode('Alternate Build',lib_code(ALT_BUILD),[x0-700,y0+700]),
 ifnode('Alternate Calls?',ALT_CALLS,[x0-500,y0+700]),
 callnode('Alternate Call openrouter','={{ $json.alt.body }}',[x0-300,y0+600]),
 codenode('Alternate Payloads',helpers+ALT_PAY_DRIVER.strip()+'\n',[x0-100,y0+600]),
 ifnode('Alternate Cure Needed?',ALT_CURE_NEED,[x0+100,y0+600]),
 codenode('Alternate Cure Build',lib_code(ALT_CURE_BUILD),[x0+300,y0+500]),
 callnode('Alternate Cure Call openrouter','={{ $json.cure.body }}',[x0+500,y0+500]),
 codenode('Alternate Cure Normalize',NORM,[x0+700,y0+500]),
 codenode('Alternate Merge',lib_code(ALT_MERGE),[x0+900,y0+700])]
ra=copy.deepcopy(N['Record Substitution']);rp=ra['parameters']
rp['url']='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/rpc/odv1_record_panel_alternates'
rp['jsonBody']="={{ JSON.stringify({ p_debate_id: $('Alternate Merge').first().json.debate_id, p_alternates: $('Alternate Merge').first().json.alternates_seated, p_drv_removed: $('Alternate Merge').first().json.drv_removed }) }}"
nodes.append({'name':'Record Alternates','type':ra['type'],'typeVersion':ra['typeVersion'],'position':[ra['position'][0]+20,ra['position'][1]+120],'parameters':rp,'credentials':ra.get('credentials'),'onError':ra.get('onError')})
# 3. Connections (on top of portion 4's: Panel Cure Check -> Dry? becomes Panel Cure Check -> Alternate Needed? ... Alternate Merge -> Dry?).
def edge(a,b,out=0):return {'from':a,'out':out,'to':b}
conn_remove=[edge('Panel Cure Check','Dry?'),edge('Record Substitution','Write Judgment 1',0)]
conn_add=[edge('Panel Cure Check','Alternate Needed?'),edge('Alternate Needed?','Alternate Build',0),edge('Alternate Needed?','Alternate Merge',1),
 edge('Alternate Build','Alternate Calls?'),edge('Alternate Calls?','Alternate Call openrouter',0),edge('Alternate Calls?','Alternate Merge',1),
 edge('Alternate Call openrouter','Alternate Payloads'),edge('Alternate Payloads','Alternate Cure Needed?'),
 edge('Alternate Cure Needed?','Alternate Cure Build',0),edge('Alternate Cure Needed?','Alternate Merge',1),
 edge('Alternate Cure Build','Alternate Cure Call openrouter'),edge('Alternate Cure Call openrouter','Alternate Cure Normalize'),
 edge('Alternate Cure Normalize','Alternate Merge'),edge('Alternate Merge','Dry?'),
 edge('Record Substitution','Record Alternates',0),edge('Record Alternates','Write Judgment 1',0),edge('Record Alternates','Panel Failure Note',1)]
# 4. The named reads: portion 4 moved them to Panel Cure Check; they move on to Alternate Merge (8 references in 7 nodes).
edits=[]
for e in ops4['edits']:
  if e['new']!="$('Panel Cure Check')":continue
  s=json.dumps(e['parameters']);n=s.count("$('Panel Cure Check')");t=json.loads(s.replace("$('Panel Cure Check')","$('Alternate Merge')"))
  if e['node']=='Panel Done':t['jsCode']=once(t['jsCode'],PD_ANCHOR,PD_ADD+PD_ANCHOR,'Panel Done');save('Panel Done',t['jsCode'])
  edits.append({'node':e['node'],'old':"$('Panel Cure Check')",'new':"$('Alternate Merge')",'count':n,'parameters':t})
edits.append({'node':'Init Seats','parameters':{**N['Init Seats']['parameters'],'jsCode':files['Init Seats']}})
edits.append({'node':'Resolve Seats','parameters':{**N['Resolve Seats']['parameters'],'jsCode':files['Resolve Seats']}})
# 5. Format Markdown (step 6's version): one line per removed seat and per alternate not seated, read from the stored row.
fm=open(os.path.join(P6,'Format_Markdown.js')).read()
FM_ANCHOR="t += '---\\n\\n';\nt += '## How to read this debate"
FM_ADD=("// ALTERNATES (BB-6904 g, step 7): a seat not counted for an uncured violation, and the alternate that sat (stored drv_removed).\n"
 "const ALTN={alt_minimax31:'MiniMax M3.1 Flash',alt_minimax3:'MiniMax M3'}; // names for the alternates' seat ids (7014 note 4)\n"
 "const DRM=Array.isArray(r.drv_removed)?r.drv_removed:[];\n"
 "if(DRM.length){t += '## Alternate judges\\n\\n';DRM.forEach(x=>{t += '- ' + nm(x.seat) + ' was not counted (' + (x.drv_uncured||0) + ' debate rule violation(s) not cured); ' + (ALTN[x.replaced_by]||nm(x.replaced_by)) + ' (' + String(x.replaced_by_model||'') + ') sat in its place.\\n';});t += '\\n';}\n")
fm2=once(fm,FM_ANCHOR,FM_ADD+FM_ANCHOR,'Format Markdown');save('Format Markdown',fm2)
edits.append({'node':'Format Markdown','parameters':{**N['Format Markdown']['parameters'],'jsCode':fm2}})
json.dump({'base':w['versionId'],'on_top_of':['p3 0b3cbac','p4 serial slots (BB-6987)','p6 rev 4 d0d5aab','p5b'],'nodes_add':nodes,'connections_remove':conn_remove,'connections_add':conn_add,'edits':edits},open(os.path.join(OUT,'ops7.json'),'w'),indent=1,ensure_ascii=False)
# 6. Migration and undo.
mig=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'migration7.sql')).read()
print('nodes added',len(nodes),'| connections -',len(conn_remove),'+',len(conn_add),'| named-read edits',[(e['node'],e.get('count')) for e in edits if e.get('count')])
for k2,v in files.items():print('  %-26s %s %d'%(k2,md5(v)[:8],len(v)))
