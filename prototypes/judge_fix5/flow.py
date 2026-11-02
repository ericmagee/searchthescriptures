# flow.py (judge_fix5): the nodes added and the connections changed, written to flow/nodes.json for write_package.py. Offline.
#  G9: "Panel Judge 1 Empty?" (IF) and "Panel Judge 1 deepseek retry" (a copy of "Panel Judge 1 deepseek": same request body expression,
#      credential, timeout and error setting): the DeepSeek panel call is repeated once when its reply has no error and no content.
#  G11: "<round> Verse Sheet" (HTTP GET of kjv_verses, as "Cited Verses"), one before each Build node D1 to C4.
import json,os,uuid,copy
H=os.path.dirname(os.path.abspath(__file__));wf=json.load(open(H+'/data/workflow_live.json'));N={n['name']:n for n in wf['nodes']}
uid=lambda name:str(uuid.uuid5(uuid.NAMESPACE_URL,'judge_fix5/'+name))
add=[];rm=[];new=[]
d1=N['Panel Judge 1 deepseek'];x,y=d1['position']
EMPTY="={{ (() => { const j = $json || {}; if (j.error) return false; const c = Array.isArray(j.choices) && j.choices[0] && j.choices[0].message ? j.choices[0].message.content : null; return !(typeof c === 'string' && c.trim() !== ''); })() }}"
add.append({"id":uid('Panel Judge 1 Empty?'),"name":"Panel Judge 1 Empty?","type":"n8n-nodes-base.if","typeVersion":2.2,"position":[x+112,y-160],
 "parameters":{"conditions":{"combinator":"and","conditions":[{"id":"g9-empty-reply","leftValue":EMPTY,"operator":{"operation":"true","singleValue":True,"type":"boolean"},"rightValue":""}],
  "options":{"caseSensitive":True,"leftValue":"","typeValidation":"loose"}},"options":{}}})
rt=copy.deepcopy(d1);rt['id']=uid('Panel Judge 1 deepseek retry');rt['name']='Panel Judge 1 deepseek retry';rt['position']=[x+112,y-320];add.append(rt)
rm.append(['Panel Judge 1 deepseek',0,'Panel Judge 2 Route',0])
new+= [['Panel Judge 1 deepseek',0,'Panel Judge 1 Empty?',0],['Panel Judge 1 Empty?',0,'Panel Judge 1 deepseek retry',0],['Panel Judge 1 Empty?',1,'Panel Judge 2 Route',0],['Panel Judge 1 deepseek retry',0,'Panel Judge 2 Route',0]]
cv=N['Cited Verses']
SRC={'D1':('Init with Guards','sheet_url'),'C1':('D1 Extract','sheet_url_c1'),'D2':('C1 Extract','sheet_url'),'C2':('D2 Extract','sheet_url'),'D3':('C2 Extract','sheet_url'),'C3':('D3 Extract','sheet_url'),'D4':('C3 Extract','sheet_url'),'C4':('D4 Extract','sheet_url')}
for r,(src,f) in SRC.items():
    b=N[r+' Build'];bx,by=b['position'];urlsrc='Init with Guards' if r in ('D1','C1') else src
    n={"id":uid(r+' Verse Sheet'),"name":r+" Verse Sheet","type":"n8n-nodes-base.httpRequest","typeVersion":4.3,"alwaysOutputData":True,"retryOnFail":True,"maxTries":3,"waitBetweenTries":3000,"onError":"continueRegularOutput",
       "position":[bx-112,by+176],"parameters":{"url":"={{ $('"+urlsrc+"').first().json."+f+" }}","authentication":"genericCredentialType","genericAuthType":"httpHeaderAuth","options":{}},"credentials":copy.deepcopy(cv['credentials'])}
    add.append(n);rm.append([src,0,r+' Build',0]);new+=[[src,0,r+' Verse Sheet',0],[r+' Verse Sheet',0,r+' Build',0]]
json.dump({'add_nodes':add,'remove_links':rm,'add_links':new},open(H+'/flow/nodes.json','w'),indent=1)
print('nodes added',len(add),'| links removed',len(rm),'| links added',len(new))
