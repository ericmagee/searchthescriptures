# WALL-2024 K-RUL card-match fix (W1; my defect, reported in WALL-2024 2200). Base: live 6b077f9e. Writes nothing live.
# The defect: krulMatch accepted a keystone card only when its target held the word "keystone", and a premise card only when it named
# the side. Judges wrote "RULING -- D6 -- STANDS" (beside "KEYSTONE: D6 -- STANDS") and "RULING -- premise 2 -- UNEXHIBITED", and got
# "no ruling card" (32949: chatgpt 1, sol 2, grok 4). Commitment 11 never told them to write either word.
# The fix, in the K-RUL library of all 17 nodes that carry it:
#  1. krulRulings stores the keystone's link id (ks, from the KEYSTONE line) on the keystone ruling.
#  2. krulMatch(c,id,ctx): a keystone card also matches when its target is that link id alone ("D6", not "D6 vs C2"); in a cure with no
#     stored ks, a lone D-number target matches. A premise card with no side word matches "SIDE premise N" only when premise N is a
#     deciding ruling of that side alone (ctx.ps).
#  4. krulCure reads a JSON-bodied cure reply by its reasoning text (krulText), as krulLines2024 already does. Before, sol's cure cards
#     sat inside one JSON string line and were never found; the same read serves the K-CON and K-CMT cures.
#  3. krulLines2024 builds ctx from the rulings and stores ks and ps on each item, so the cure check reads the same context.
# usage: python3 build_R.py <live fetch json of 6b077f9e>
import json,sys,hashlib,os,subprocess
H=os.path.dirname(os.path.abspath(__file__));sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
w=json.load(open(sys.argv[1]))['workflow'];assert w['versionId'].startswith('6b077f9e'),w['versionId']
E=[
("if(L.some(l=>/^\\s*[-*•]?\\s*\\**KEYSTONE\\s*:/.test(l)))add('keystone','JUDGE');",
 "{const kl=L.find(l=>/^\\s*[-*•]?\\s*\\**KEYSTONE\\s*:/.test(l));if(kl){add('keystone','JUDGE');const km=kl.match(/KEYSTONE\\s*:\\s*\\**\\s*(D\\d+)\\b/i);const ke=out.find(u=>u.id==='keystone');if(km&&ke)ke.ks=km[1].toUpperCase();}} /* K-RUL fix: the keystone's link id */"),
("function krulMatch(c,id){const t=c.target;if(id==='keystone')return /\\bkeystone\\b/i.test(t);",
 "function krulMatch(c,id,ctx){const t=c.target;const X=ctx||{};if(id==='keystone'){if(/\\bkeystone\\b/i.test(t))return true;const lone=String(t).trim().match(/^(D\\d+)\\s*$/i);return !!lone&&(!X.ks||lone[1].toUpperCase()===X.ks);} /* K-RUL fix: a keystone card may name the link by its id */\n {const pm=id.match(/^(DEFENDER|CHALLENGER) premise (\\d+)$/);if(pm&&!/\\b(DEFENDER|CHALLENGER)\\b/i.test(t)&&new RegExp('\\\\bpremise\\\\s*'+pm[2]+'\\\\b','i').test(t)&&X.ps&&Array.isArray(X.ps[pm[2]])&&X.ps[pm[2]].length===1&&X.ps[pm[2]][0]===pm[1])return true;} /* K-RUL fix: a premise card with no side word, when only one side has that premise */"),
("for(const u of RUL){const c=cards.find(c=>krulMatch(c,u.id));",
 "const KX={ks:(RUL.find(u=>u.id==='keystone')||{}).ks||null,ps:{}};RUL.forEach(u=>{const m=u.id.match(/^(DEFENDER|CHALLENGER) premise (\\d+)$/);if(m)(KX.ps[m[2]]=KX.ps[m[2]]||[]).push(m[1]);}); /* K-RUL fix: match context */\n for(const u of RUL){const c=cards.find(c=>krulMatch(c,u.id,KX));"),
("items.push({rule:'K-RUL',side:u.side,link:u.id,ruling:u.id,line:",
 "items.push({rule:'K-RUL',side:u.side,link:u.id,ruling:u.id,krul_ctx:KX,line:"),
("function krulCure(x,replyText,rounds,respText){const T=String(replyText||'');",
 "function krulCure(x,replyText,rounds,respText){const T=krulText(replyText).T; /* K-RUL fix: a JSON-bodied cure reply (sol, 32949) is read by its reasoning lines, for K-RUL, K-CMT and K-CON alike */"),
("const c=krulCards(T).find(c=>krulMatch(c,x.ruling||x.link));",
 "const c=krulCards(T).find(c=>krulMatch(c,x.ruling||x.link,x.krul_ctx||null));"),
]
out=os.path.join(H,'patched');os.makedirs(out,exist_ok=True);plan=[]
for n in w['nodes']:
    src=n['parameters'].get('jsCode') or ''
    if 'function krulMatch' not in src:continue
    new=src
    for a,b in E:
        assert new.count(a)==1,(n['name'],a[:50]);new=new.replace(a,b)
    p=os.path.join(out,n['name'].replace(' ','_')+'.js');open(p,'w').write(new)
    q=p+'.chk.js';open(q,'w').write('(async function(){\n'+new+'\n});');r=subprocess.run(['node','--check',q],capture_output=True,text=True);os.remove(q);assert r.returncode==0,(n['name'],r.stderr[:300])
    plan.append({'name':n['name'],'id':n['id'],'live_sha':sha(src),'final_sha':sha(new),'delta':len(new)-len(src)})
json.dump({'live_version':w['versionId'],'nodes':plan},open(os.path.join(H,'plan_R.json'),'w'),indent=1)
for x in plan:print(f"  {x['name']:28} {x['live_sha']} -> {x['final_sha']}")
print(len(plan),'nodes; anchors unique, all parse')
