# pkgEANS (W3 2274, approved 2273 ask 2): the E-ANS reader in Judge Enforcer Build reads an ANSWER CHECK that names a list of rounds,
# "[CR3; CR4]" or "[CR3, CR4]", and looks for the answer in EVERY listed round. Before, the pattern took one round only and skipped the
# line silently (32980 sol, Romans 1:3). Same edit in Judge Enforcer Build (base: the 68fe69cd prewrite; no package since changed it) and in
# its clone Alt Judge Enforcer Build (base: pkgALT/patched). Run from wall2024/.
import hashlib,json,os
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
O='pkgEANS/patched';os.makedirs(O,exist_ok=True)
E=[("const AC=/^ANSWER CHECK:\\s*(.+?)\\s*--\\s*\\[((?:CR|DR)[1-4])\\]\\s*--",
    "const AC=/^ANSWER CHECK:\\s*(.+?)\\s*--\\s*\\[((?:CR|DR)[1-4](?:\\s*[;,]\\s*(?:CR|DR)[1-4])*)\\]\\s*--"),
   ("if(!g){g={key,verse:m[1].trim(),rk:m[2],means:m[3],answer:m[4],grades:[]};AG.push(g);}",
    "if(!g){g={key,verse:m[1].trim(),rk:m[2].replace(/\\s*[;,]\\s*/g,'; '),means:m[3],answer:m[4],grades:[]};AG.push(g);}"),
   ("const key=N(m[1])+'|'+m[2]+'|'+N(m[4]).slice(0,140);",
    "const key=N(m[1])+'|'+m[2].replace(/\\s*[;,]\\s*/g,'; ')+'|'+N(m[4]).slice(0,140);"),
   ("items.push({ids,text:'ITEM B'+gi+' (E-ANS; the answering side wrote this in ['+g.rk+']):\\n",
    "const __rk=g.rk.split('; ');const __aw=N(g.answer).split(' ').slice(0,8).join(' ');const __in=__rk.filter(k=>R&&typeof R[k]==='string'&&__aw&&N(R[k]).includes(__aw)); /* pkgEANS: the answer is looked for in every listed round (W3 2274) */\n items.push({ids,text:'ITEM B'+gi+' (E-ANS; the answering side wrote this in ['+g.rk+']'+(__rk.length>1?'; its opening words are found in '+(__in.length?'['+__in.join('; ')+']':'none of the listed rounds'):'')+'):\\n")]
plan={'nodes':[]}
for name,src in [('Judge Enforcer Build',json.load(open('pkgALT/base_nodes_68fe.json'))['Judge Enforcer Build']['parameters']['jsCode']),('Alt Judge Enforcer Build',open('pkgALT/patched/Alt_Judge_Enforcer_Build.js').read())]:
    s=src
    for a,b in E:
        assert s.count(a)==1,(name,a[:50]);s=s.replace(a,b)
    f=name.replace(' ','_')+'.js';open(O+'/'+f,'w').write(s)
    plan['nodes'].append({'file':f,'name':name,'base':'68fe69cd prewrite' if not name.startswith('Alt') else 'pkgALT/patched','base_sha':sha(src),'final_sha':sha(s),'edits':len(E)})
json.dump(plan,open('pkgEANS/plan_EANS.json','w'),indent=1);print(plan)
