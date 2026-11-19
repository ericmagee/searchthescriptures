# ASK 499 A1: switch only the three ppj nodes from "Supabase Anon Key" (httpHeaderAuth) to "Supabase account" (supabaseApi), as 494 A1 did.
import json,sys,copy
SVC={'supabaseApi':{'id':'0Ap4HeISSH05ZS9s','name':'Supabase account'}}
ANON={'httpHeaderAuth':{'id':'uCS43YOAcWVctNfM','name':'Supabase Anon Key'}}
def switch(src,dst,names):
    base=json.load(open(src)); t=copy.deepcopy(base); done=0
    for n in t['nodes']:
        if n['name'] in names:
            p=n['parameters']
            assert p.get('authentication')=='genericCredentialType' and p.get('genericAuthType')=='httpHeaderAuth', n['name']
            assert n['credentials']==ANON, n['credentials']
            assert 'sendHeaders' not in p and 'headerParameters' not in p, n['name']
            p['authentication']='predefinedCredentialType'; del p['genericAuthType']; p['nodeCredentialType']='supabaseApi'
            n['credentials']=copy.deepcopy(SVC); done+=1
    assert done==len(names), (done,names)
    # touched nodes only: every other node byte-equal
    b={n['name']:n for n in base['nodes']}
    for n in t['nodes']:
        if n['name'] not in names: assert n==b[n['name']], n['name']
    assert t['connections']==base['connections']
    out={k:t[k] for k in ('name','nodes','connections','settings')}
    json.dump(out,open(dst,'w'),ensure_ascii=False,indent=1)
switch('live_engine_499.json','target_engine_499a1.json',['Panel Judges Poll','Panel Judges Fetch'])
switch('live_pjc_499.json','target_pjc_499a1.json',['Store Reply'])
print('ok')
