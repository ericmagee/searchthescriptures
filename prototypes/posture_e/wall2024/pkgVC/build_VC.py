# pkgVC: a verified contradiction (VC) is not built from the engine's own CLOSE-ROUND REVERSAL CHECK pair (ruling 412, a TRIAL hint).
# 32980: the hint paired CR3 "I drop the claim that Matthew 1:25 by itself reaches back across the espousal." with CR4
# "Matthew 1:25 denies that knowing up to the birth." on a shared verse alone; the three panel judges copied it, and VC charged the single judge.
# Base: pkgKCON/patched (= merged_PWQA + pkgR2 + pkgKCON). One node: Panel Payloads.
import hashlib,json
B='pkgKCON/patched/Panel_Payloads.js';O='pkgVC/patched/Panel_Payloads.js'
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
o=open(B).read();s=o
def rep(a,b):
    global s
    assert s.count(a)==1,a[:80];s=s.replace(a,b)
rep("__VCW.push({seat:jd.seat,WT:String(WT||''),R:ciRounds(drvPromptText(jd.body))});",
    "__VCW.push({seat:jd.seat,WT:String(WT||''),R:ciRounds(drvPromptText(jd.body)),RV:vcRev2024(drvPromptText(jd.body))});")
rep("function vcBuild2024(W,kw){",
    "// pkgVC (W1): the pairs the engine itself put to this judge in a CLOSE-ROUND REVERSAL CHECK note (ruling 412, TRIAL; shared verse only).\n"
    "// A CONTRADICTION line that repeats such a pair is the judge's own finding, but it is not a verified contradiction, so it charges no other seat.\n"
    "function vcRev2024(P){const out=[];const t=String(P||'');let at=0;for(;;){const a=t.indexOf('[CLOSE-ROUND REVERSAL CHECK',at);if(a<0)break;const b=t.indexOf('DISREGARDED as footing',a);const seg=t.slice(a,b<0?a+4000:b);at=a+1;\n"
    " for(const m of seg.matchAll(/\\(\\d+\\)\\s*\\[[CD]R[1-4]\\]\\s*\"([^\"]*)\"\\s*--\\s*earlier:\\s*\"([^\"]*)\"/g)){const c=kvNorm(m[1]),g=kvNorm(m[2]);if(c&&g)out.push([c,g]);}}return out;}\n"
    "function vcBuild2024(W,kw){")
rep("   const e=PW_ORD.indexOf(c.ek),l=PW_ORD.indexOf(c.lk);if(e<0||l<0||e>=l)continue;\n",
    "   const e=PW_ORD.indexOf(c.ek),l=PW_ORD.indexOf(c.lk);if(e<0||l<0||e>=l)continue;\n"
    "   if((w.RV||[]).some(([cl,gr])=>(cl.includes(n2)||n2.includes(cl))&&(gr.includes(n1)||n1.includes(gr))))continue; /* pkgVC: the engine's own reversal hint, not verified */\n")
open(O,'w').write(s)
json.dump({'base':'pkgKCON/patched','nodes':[{'file':'Panel_Payloads.js','name':'Panel Payloads','base_sha':sha(o),'final_sha':sha(s),'edits':['vcRev2024','RV on __VCW','vcBuild2024 skips reversal-hint pair']}]},open('pkgVC/plan_VC.json','w'),indent=1)
print(sha(o),sha(s))
