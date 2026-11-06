# pkgW: K-W cure reading (W2; WALL-2024 reply 2213 item 2). Base: merged_TLRN + pkgP/patched (= live 68fe69cd + pkgP). Offline only.
# W1: the K-W check reads the item's RESPONSE line, then its STATEMENT line; accepts REASSERTED IN <round> "<quote>" (the third form the
#     cure prompt offers); "NOT CONCEDED" / "never conceded" / "CONCEDED LINKS" no longer count as CONCEDED.
# W2: a RESPONSE line whose whole text is "CONCEDED" or "CONCEDED." is read (the 10-character floor refused it: run 32973 single, 4 items).
import glob,os,json,hashlib
OUT='patched'; os.makedirs(OUT,exist_ok=True)
OLD_KW="if(x.rule==='K-W'){const rp=respOf(x)||'';if(/\\bSTANDS\\s+WITHOUT\\s+IT\\s+because\\b/i.test(rp)&&/\\[L[1-3]\\]/.test(rp))return res('CURED','answered: the link stands without the withdrawn footing, on the layer named',[rp]);if(/\\bCONCEDED\\b/i.test(rp))return res('CURED','answered: the link is conceded',[rp]);return res('UNCURED','the RESPONSE says neither STANDS WITHOUT IT because <layer> with an [L1], [L2] or [L3], nor CONCEDED',rp?[rp]:null);}"
NEW_KW=("if(x.rule==='K-W'){const rp=respOf(x)||'',sp=stmtOf(x)||''; /* pkgW (WALL-2024 2213): run 32973, chatgpt and sol wrote the form on the STATEMENT line and NOT HELD on the RESPONSE line */"
 "const kwSt=t=>/\\bSTANDS\\s+WITHOUT\\s+IT\\s+because\\b/i.test(t)&&/\\[L[1-3]\\]/.test(t);"
 "const kwCo=t=>/\\bCONCEDED\\b/i.test(String(t).replace(/\\b(?:NOT|NEVER|NO\\s+LONGER)\\s+(?:(?:BEEN|BE)\\s+)?CONCEDED\\b/gi,' ').replace(/\\bCONCEDED\\s+LINKS?\\b/gi,' '));"
 "const kwRe=t=>/\\bREASSERTED\\s+IN\\s+\\[?[CD]R\\d+\\]?\\s*(?:[:,]|--|\\u2014)?\\s*[\"\\u201c][^\"\\u201d]{6,}[\"\\u201d]/i.test(t);"
 "for(const [t,w] of [[rp,''],[sp,' (on its STATEMENT line)']]){if(!t)continue;"
 "if(kwSt(t))return res('CURED','answered: the link stands without the withdrawn footing, on the layer named'+w,[t]);"
 "if(kwCo(t))return res('CURED','answered: the link is conceded'+w,[t]);"
 "if(kwRe(t))return res('CURED','answered: the withdrawn footing is reasserted in a later round, with its quote'+w,[t]);}"
 "return res('UNCURED','neither the RESPONSE nor the STATEMENT line says STANDS WITHOUT IT because <layer> with an [L1], [L2] or [L3], CONCEDED, or REASSERTED IN <round> \"<quote>\"',rp?[rp]:(sp?[sp]:null));}")
OLD_RL="else if(k[1]==='RESPONSE'&&(m=r.match(/^(.+?)\\s*\\|\\s*(\\S.{9,})$/)))"
NEW_RL="else if(k[1]==='RESPONSE'&&(m=r.match(/^(.+?)\\s*\\|\\s*(\\S.{9,}|CONCEDED\\.?)$/i)))"
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
plan={'base':'merged_TLRN + pkgP/patched','nodes':[]}
for f in sorted(glob.glob('../merged_TLRN/*.js')):
    n=os.path.basename(f); s=open('../pkgP/patched/'+n).read() if os.path.exists('../pkgP/patched/'+n) else open(f).read(); o=s
    a,b=s.count(OLD_KW),s.count(OLD_RL)
    if not (a or b): continue
    assert a==1 and b==1, n
    s=s.replace(OLD_KW,NEW_KW).replace(OLD_RL,NEW_RL)
    open(OUT+'/'+n,'w').write(s)
    plan['nodes'].append({'file':n,'name':n[:-3].replace('_',' '),'base_sha':sha(o),'final_sha':sha(s),'edits':['W1 K-W check','W2 RESPONSE CONCEDED']})
json.dump(plan,open('plan_W.json','w'),indent=1); print(len(plan['nodes']))
