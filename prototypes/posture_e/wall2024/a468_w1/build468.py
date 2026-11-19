#!/usr/bin/env python3
"""ASK 468 (W1): a pass of each B round (D2B..C4B) keeps its layers check in the round's bar record, as a resend already does.
Build node: declare __lc before pass() and put lay_check:__lc in the pass item. Extract node: __keep records layers.first from the Build item.
usage: python3 build468.py base_engine.json target_engine.json"""
import json,sys,hashlib
w=json.load(open(sys.argv[1]));N={n['name']:n for n in w['nodes']};ch=[]
for r in ['D2B','C2B','D3B','C3B','D4B','C4B']:
  b=N[r+' Build']['parameters'];c=b['jsCode']
  o1="const pass=(why,c)=>[{json:{run_token:X.run_token,round:'%s',resend:false,why,bar_check:c||null}}];"%r
  n1="let __lc=null;const pass=(why,c)=>[{json:{run_token:X.run_token,round:'%s',resend:false,why,bar_check:c||null,lay_check:__lc}}];"%r
  o2="let __lc=null;try{__lc=LAY.check(";n2="try{__lc=LAY.check("
  assert c.count(o1)==1 and c.count(o2)==1,(r,'build')
  b['jsCode']=c.replace(o1,n1).replace(o2,n2);ch.append(r+' Build')
  x=N[r+' Extract']['parameters'];c=x['jsCode']
  o3="const __keep=(why,o)=>[{json:{...__X1,bar:__rec({resent:!!(__G&&__G.resend),kept:'first',why,void:[],...(o||{})})}}];"
  n3="const __keep=(why,o)=>[{json:{...__X1,bar:__rec({resent:!!(__G&&__G.resend),kept:'first',why,void:[],layers:{first:(__G&&__G.lay_check)||null},...(o||{})})}}];"
  assert c.count(o3)==1,(r,'extract')
  x['jsCode']=c.replace(o3,n3);ch.append(r+' Extract')
s=json.dumps(w,ensure_ascii=False);open(sys.argv[2],'w').write(s)
print('changed',len(ch),ch);print('target md5',hashlib.md5(s.encode()).hexdigest())
