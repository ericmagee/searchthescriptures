import json,sys,copy
base=json.load(open(sys.argv[1]))
t=copy.deepcopy(base)
nodes=t.get('nodes') or t['data']['nodes']
names=['Save to DB','Salvage Save','Write Judgment 1','Write Judgment 2','Write Judgment 3','Derive Outcome','Write Tokens','Record Substitution','Record Alternates','Write Enforcer Log','Write Replay']
n_done=0
for n in nodes:
    if n['name'] in names:
        p=n['parameters']
        assert p.get('authentication')=='genericCredentialType' and p.get('genericAuthType')=='httpHeaderAuth'
        assert n['credentials']=={'httpHeaderAuth':{'id':'uCS43YOAcWVctNfM','name':'Supabase Anon Key'}}, n['credentials']
        p['authentication']='predefinedCredentialType'
        del p['genericAuthType']
        p['nodeCredentialType']='supabaseApi'
        n['credentials']={'supabaseApi':{'id':'0Ap4HeISSH05ZS9s','name':'Supabase account'}}
        n_done+=1
assert n_done==11, n_done
json.dump(t,open(sys.argv[2],'w'),ensure_ascii=False,indent=1)
