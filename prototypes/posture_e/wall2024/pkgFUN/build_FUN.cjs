// pkgFUN (W1; my own fault found grading pkgKCB, Wall 3867). Base: live s97 library = pkgLIB/strip_KCB_base (pkgFUK rev 3 + pkgFCD + pkgKNL rev 5).
// Gap (pkgFUK rev 3, ENFORCED, live since s96): the K-S3 COUNTED reading refuses any negation in the answer's first sentence, so a correct COUNTED whose reason
// describes the concession with a negation ("COUNTED: by this grant D6 does not stand.", "COUNTED: the defender no longer holds D6 as declared.") reads UNCURED,
// is asked once, and a judge that repeats it can be removed.
// Fix (cureVerdicts, the one K-S3 COUNTED line; 26 library files): a negation refuses the reading only when it is aimed at the count itself: not/never/no/nor/
// cannot/neither/none/n't, then up to two filler words (a, an, the, be, been, being, is, was, this, that, it, to, as, so), then concession, conceded, conceding,
// counted, countable, right, correct, true, accurate, apply/applies/applied, agree*. Read over the whole answer. Everything else in pkgFUK rev 3 is unchanged
// (COUNTED first word, then end or punctuation).
//   node pkgFUN/build_FUN.cjs        -> pkgLIB/strip_FUN, pkgFUN/plan_FUN.json
//   FB=/mnt/project-files/wall2024/fetchback_live_s97.json node gate/pack.cjs pkgLIB/strip_FUN pkgLIB_FUN
//   node pkgFUK/parent_on.cjs /mnt/project-files/wall2024/fetchback_live_s97.json pkgLIB_FUN pkgLIB/strip_FUN pkgFUN/parent_s97_FUN.json
const fs=require('fs'),path=require('path'),cr=require('crypto');const W=path.resolve(__dirname,'..');
const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const sub=(s,a,b,what)=>{const n=s.split(a).length-1;if(n!==1)die(what+': '+n+' hits for '+JSON.stringify(a.slice(0,90)));return s.split(a).join(b);};
const A0=String.raw`&&!/\b(?:not|never|no|nor|cannot|neither|none)\b|n['’]t\b/i.test(c0.split(/[.;!?](?:\s|$)/)[0]))return res('CURED','answered: the close concession is counted',[rp]);}`;
const A1=String.raw`&&!/(?:\b(?:not|never|no|nor|cannot|neither|none)\b|n['’]t\b)\s+(?:(?:a|an|the|be|been|being|is|was|this|that|it|to|as|so)\s+){0,2}(?:concession|conceded|conceding|counted|countable|right|correct|true|accurate|appl(?:y|ies|ied)|agree\w*)\b/i.test(c0))return res('CURED','answered: the close concession is counted',[rp]);} /* pkgFUN (W1 3867): a negation refuses COUNTED only when aimed at the count itself, not when the reason describes the concession */`;
const A=W+'/pkgLIB/strip_KCB_base',B=W+'/pkgLIB/strip_FUN';if(fs.existsSync(B))die(B+' exists');fs.mkdirSync(B+'/patched',{recursive:true});const plan={base:'pkgLIB/strip_KCB_base (live s97 library)',library:{}};
for(const f of fs.readdirSync(A+'/patched').filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(A+'/patched/'+f,'utf8');let s=s0;const did=[];
 if(s.includes("if(x.rule==='K-S3'){const rp=respOf(x)")){s=sub(s,A0,A1,f+' A');did.push('FUN');}
 new Function('$','$input','return (async()=>{\n'+s+'\n})();');fs.writeFileSync(B+'/patched/'+f,s);plan.library[f]={base:h(s0),patched:h(s),changes:did};}
const ch=Object.entries(plan.library).filter(e=>e[1].changes.length);fs.writeFileSync(__dirname+'/plan_FUN.json',JSON.stringify(plan,null,1)+'\n');console.log('strip_FUN: '+Object.keys(plan.library).length+' files, '+ch.length+' changed');
