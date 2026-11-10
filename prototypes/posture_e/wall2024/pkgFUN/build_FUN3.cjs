// pkgFUN rev 3 (W1; W3 FAIL 3894 and W4 FAIL 3890 on rev 2): the closed list is applied to WHOLE sentences only (W3's idea, pkgFUN/fun3_ref.cjs); builds pkgLIB/strip_FUN3 from strip_KCB_base (live s98 library).
// pkgFUN rev 2 (W1; W3 FAIL after 3877: rev 1's negation list refused 12 of W3's 17 correct answers. Rev 2 takes W3's closed list of present-tense refusals of the count, pkgFUN/w3_grade/w3_closed_list_idea.cjs, and carries pkgKCB's case). Rev 1: pkgFUN (W1; my own fault found grading pkgKCB, Wall 3867). Base: live s97 library = pkgLIB/strip_KCB_base (pkgFUK rev 3 + pkgFCD + pkgKNL rev 5).
// Gap (pkgFUK rev 3, ENFORCED, live since s96): the K-S3 COUNTED reading refuses any negation in the answer's first sentence, so a correct COUNTED whose reason
// describes the concession with a negation ("COUNTED: by this grant D6 does not stand.", "COUNTED: the defender no longer holds D6 as declared.") reads UNCURED,
// is asked once, and a judge that repeats it can be removed.
// Fix (cureVerdicts, the one K-S3 COUNTED line; 26 library files): a negation refuses the reading only when it is aimed at the count itself: not/never/no/nor/
// cannot/neither/none/n't, then up to two filler words (a, an, the, be, been, being, is, was, this, that, it, to, as, so), then concession, conceded, conceding,
// counted, countable, right, correct, true, accurate, apply/applies/applied, agree*. Read over the whole answer. Everything else in pkgFUK rev 3 is unchanged
// (COUNTED first word, then end or punctuation).
//   node pkgFUN/build_FUN.cjs        -> pkgLIB/strip_FUN3, pkgFUN/plan_FUN3.json
//   FB=/mnt/project-files/wall2024/fetchback_live_s97.json node gate/pack.cjs pkgLIB/strip_FUN pkgLIB_FUN
//   node pkgFUK/parent_on.cjs /mnt/project-files/wall2024/fetchback_live_s97.json pkgLIB_FUN2 pkgLIB/strip_FUN pkgFUN/parent_sXX_FUN2.json
const fs=require('fs'),path=require('path'),cr=require('crypto');const W=path.resolve(__dirname,'..');
const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const sub=(s,a,b,what)=>{const n=s.split(a).length-1;if(n!==1)die(what+': '+n+' hits for '+JSON.stringify(a.slice(0,90)));return s.split(a).join(b);};
const A0=String.raw`&&!/\b(?:not|never|no|nor|cannot|neither|none)\b|n['’]t\b/i.test(c0.split(/[.;!?](?:\s|$)/)[0]))return res('CURED','answered: the close concession is counted',[rp]);}`;
const __RF=fs.readFileSync(__dirname+'/fun3_ref.cjs','utf8').split('\n').filter(l=>!l.startsWith('//')).join(' ').replace(/^module\.exports=/,'').replace(/;\s*$/,'');if(/`|\$\{/.test(__RF))die('fun3_ref.cjs holds a backtick or ${');
const A1=String.raw`&&!(`+__RF+String.raw`)(c0))return res('CURED','answered: the close concession is counted',[rp]);} /* pkgFUN rev 3 (W3 3894, W4 3890): a refusal is a whole sentence from the closed list (or the whole remainder after COUNTED, but/though/yet/however); a connector alone or listed words inside a longer sentence are not a refusal (fun3_ref.cjs). Was: pkgFUN rev 2 (W3 grade after 3877): COUNTED is refused only by a closed list of present-tense refusals of the count itself (W3's list; "could" and "may" dropped and quoted text skipped, W1) */`;
const A=W+'/pkgLIB/strip_KCB_base',B=W+'/pkgLIB/strip_FUN3';if(fs.existsSync(B))die(B+' exists');fs.mkdirSync(B+'/patched',{recursive:true});const plan={base:'pkgLIB/strip_KCB_base (live s97 library)',library:{}};
for(const f of fs.readdirSync(A+'/patched').filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(A+'/patched/'+f,'utf8');let s=s0;const did=[];
 if(s.includes("if(x.rule==='K-S3'){const rp=respOf(x)")){s=sub(s,A0,A1,f+' A');did.push('FUN');}
 new Function('$','$input','return (async()=>{\n'+s+'\n})();');fs.writeFileSync(B+'/patched/'+f,s);plan.library[f]={base:h(s0),patched:h(s),changes:did};}
const ch=Object.entries(plan.library).filter(e=>e[1].changes.length);fs.writeFileSync(__dirname+'/plan_FUN3.json',JSON.stringify(plan,null,1)+'\n');console.log('strip_FUN3: '+Object.keys(plan.library).length+' files, '+ch.length+' changed');
