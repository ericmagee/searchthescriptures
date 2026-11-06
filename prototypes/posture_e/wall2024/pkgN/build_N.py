# WALL-2024 cure-label match fix (W2; W3 2208 asked for a JSON-decode fix; the cause found is a label mismatch, see below). Writes nothing live.
# Base: 6b077f9e + pkgT 7d0a84b + pkgL d389481 + pkgR 101aa61 (merged_TLR, commit 42bdbc6).
# Cause, on the stored 32949 replies: cureLines already decodes a JSON-bodied reply (cureUnwrap reads "reasoning"); sol's reply gives 28
# RESPONSE lines. But the item label carries a colon ("K-S3 S3 DEFENDER CR4: #1", from a link "S3 DEFENDER CR4: #1") and sol wrote
# "RESPONSE: K-S3 S3 DEFENDER CR4 #1 | ...". respOf matched by exact substring, so every such answer read as no written response, and
# under the silence rule an answering judge was counted silent.
# Fix, in cureVerdicts of the 14 cure nodes: respOf and stmtOf compare labels after folding case, colons and bars to spaces and runs of
# space to one, and a match must end at a word edge ("#1" does not match "#10", which the old substring test allowed).
# Second cause, same effect: K-CMT is one item per seat, labelled "K-CMT contested grades without a commitment"; chatgpt and grok wrote
# "RESPONSE: K-CMT | ..." and sol "RESPONSE: K-CMT CONCEDED LINKS | ...". When an item is the only one of its rule in the cure, a RESPONSE
# headed by that rule answers it.
# usage: python3 build_N.py <live fetch json of 6b077f9e>
import json,sys,os,hashlib
H=os.path.dirname(os.path.abspath(__file__));R=os.path.join(H,'..');sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
W=json.load(open(sys.argv[1]))['workflow'];assert W['versionId'].startswith('6b077f9e'),W['versionId']
M=json.load(open(os.path.join(R,'merged_TLR','manifest.json')));MN={x['name']:x for x in M['nodes']}
for n in W['nodes']:
    if n['name'] in MN:
        assert sha(n['parameters']['jsCode'])==MN[n['name']]['live_sha'],n['name']
        n['parameters']['jsCode']=open(os.path.join(R,'merged_TLR',n['name'].replace(' ','_')+'.js')).read()
A=("const respOf=(x)=>{const lb=U(cureLabel(x));const rk=U(x.rule||'');const ruleOk=L=>{const rs=L.match(/\\bK-[A-Z]+[0-9]*\\b/g)||[];return !rs.length||rs.includes(rk);};\n"
   "  const r=o.response.find(s=>{const L=U(s.label);return L.includes(lb)&&ruleOk(L);})||o.response.find(s=>{const L=U(s.label);return ruleOk(L)&&(x.link?L.includes(U(x.link)):(L.includes(x.side)&&L.includes('STANDING')));});return r?r.text:null;};\n"
   " const stmtOf=(x)=>{const st=o.statement.find(s=>x.link?U(s.label).includes(U(x.link)):(U(s.label).includes(x.side)&&U(s.label).includes(U(x.rule))));return st?st.text:null;};")
A2=(" // WALL-2024 cure-label match (W2, 2208 follow-up; 32949 sol): labels compared with case, colons and bars folded to spaces; a match ends at a word edge.\n"
    " const NZ=s=>U(s).replace(/[:|]+/g,' ').replace(/\\s+/g,' ').trim();const HAS=(L,k)=>{const a=NZ(L),b=NZ(k);if(!b)return false;let i=a.indexOf(b);while(i>=0){if(!/[0-9A-Z]/.test(a.charAt(i+b.length)))return true;i=a.indexOf(b,i+1);}return false;};\n"
    "const respOf=(x)=>{const lb=U(cureLabel(x));const rk=U(x.rule||'');const ruleOk=L=>{const rs=L.match(/\\bK-[A-Z]+[0-9]*\\b/g)||[];return !rs.length||rs.includes(rk);};\n"
    "  const r=o.response.find(s=>{const L=U(s.label);return HAS(L,lb)&&ruleOk(L);})||o.response.find(s=>{const L=U(s.label);return ruleOk(L)&&(x.link?HAS(L,x.link):(L.includes(x.side)&&L.includes('STANDING')));})\n"
    "   ||(items.filter(y=>y&&y.rule===x.rule).length===1?o.response.find(s=>{const L=NZ(s.label);return (L===rk||L.startsWith(rk+' '))&&ruleOk(U(s.label));}):null); /* the one item of its rule in this cure: a RESPONSE headed by that rule answers it (32949: \"RESPONSE: K-CMT | ...\") */return r?r.text:null;};\n"
    " const stmtOf=(x)=>{const st=o.statement.find(s=>x.link?HAS(s.label,x.link):(U(s.label).includes(x.side)&&U(s.label).includes(U(x.rule))));return st?st.text:null;};")
out=os.path.join(H,'patched');os.makedirs(out,exist_ok=True);plan={'live_version':W['versionId'],'base':'6b077f9e + merged_TLR 42bdbc6','nodes':[]}
for n in W['nodes']:
    c=(n.get('parameters') or {}).get('jsCode') or ''
    if A not in c:continue
    assert c.count(A)==1,n['name'];t=c.replace(A,A2)
    open(os.path.join(out,n['name'].replace(' ','_')+'.js'),'w').write(t)
    plan['nodes'].append({'name':n['name'],'id':n['id'],'base_sha':sha(c),'final_sha':sha(t)})
json.dump(plan,open(os.path.join(H,'plan_N.json'),'w'),indent=1);print(len(plan['nodes']),'nodes')
