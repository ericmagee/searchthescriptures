// pkgKSL (W2; coordinator 01:52Z 11-10, from W3's label ruling 1 in the pkgFUN rev 3 grade, Wall 3933). ENFORCED rule (K-S3), Shared Library.
// Gap: the K-S3 COUNTED reader is given only the RESPONSE line. A judge that writes "RESPONSE: K-S3 ... | COUNTED." and puts its refusal on the
//   next line ("That is not right.", "I withdraw the count.") reads CURED: the refusal is never read.
// Fix (26 library files, two places, no other rule touched):
//   1. cureLines: a RESPONSE entry keeps the unlabeled prose lines that follow it, up to the next labeled line, at most 3 (field cont).
//      Blank lines are skipped as before; any labeled line ends the run; a leading bullet or number is taken off each line.
//      Joined after a space, or after ". " when the RESPONSE text ends without a stop.
//   2. the K-S3 COUNTED reading: the text it reads is the RESPONSE text followed by those lines (joined by a space), so the refusal reader
//      (pkgFUN's, whatever revision is in the base) reads them as later sentences of the same answer. COUNTED must still open the RESPONSE line.
//   node pkgKSL/build_KSL.cjs <base strip dir> <out strip dir>     (built to stack on pkgFUN rev 4; anchors are outside pkgFUN's change)
const fs=require('fs'),path=require('path'),cr=require('crypto');const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};
const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const rep=(s,a,b,what)=>{const n=s.split(a).length-1;if(n!==1)die(what+': '+n+' hits for '+JSON.stringify(a.slice(0,90)));const i=s.indexOf(a);return s.slice(0,i)+b+s.slice(i+a.length);};
const [,,A,B]=process.argv;if(!A||!B)die('usage: build_KSL.cjs <base strip> <out strip>');if(fs.existsSync(B))die(B+' exists');fs.mkdirSync(B+'/patched',{recursive:true});
const C0="function cureLines(text){text=cureUnwrap(text);";
const C1=String.raw`function __ks3Cont(o,rp){const s=((o&&o.response)||[]).find(z=>z&&z.text===rp);return s&&s.cont&&s.cont.length?(/[.!?:;]["”’)\]*_]*\s*$/.test(String(rp))?' ':'. ')+s.cont.join(' '):'';} /* pkgKSL: the prose lines a judge writes right under its K-S3 RESPONSE line are read with it */`+"\n"+String.raw`function cureLines(text){text=cureUnwrap(text);let __kcLast=null;`;
const P0="const k=l.match(CURE_KEY);if(!k){o.prose.push(l);continue;}";
const P1=String.raw`const k=l.match(CURE_KEY);if(!k){o.prose.push(l);if(__kcLast&&__kcLast.cont.length<3)__kcLast.cont.push(l.replace(/^(?:[-•>]|\d{1,2}[.)])\s+/,''));continue;}__kcLast=null;`;
const R0="(k[1]==='STATEMENT'?o.statement:o.response).push({label:String(f.item).trim(),text:r.slice(at+1).trim(),line:l});continue;}";
const R1="if(k[1]==='STATEMENT')o.statement.push({label:String(f.item).trim(),text:r.slice(at+1).trim(),line:l});else{__kcLast={label:String(f.item).trim(),text:r.slice(at+1).trim(),line:l,cont:[]};o.response.push(__kcLast);}continue;}";
const K0="if(x.rule==='K-S3'){const rp=respOf(x)||'';{const c0=String(rp)";
const K1="if(x.rule==='K-S3'){const rp=respOf(x)||'';{const c0=String(rp+__ks3Cont(o,rp))";
const plan={base:A,library:{}};
for(const f of fs.readdirSync(A+'/patched').filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(A+'/patched/'+f,'utf8');let s=s0;const did=[];
 const hasC=s.includes(C0),hasK=s.includes(K0);if(hasC!==hasK)die(f+': cureLines '+hasC+' but K-S3 line '+hasK);
 if(hasK){if(s.includes('pkgKSL'))die(f+' already has pkgKSL');s=rep(s,C0,C1,f+' C');s=rep(s,P0,P1,f+' P');s=rep(s,R0,R1,f+' R');s=rep(s,K0,K1,f+' K');did.push('KSL');}
 new Function('$','$input','return (async()=>{\n'+s+'\n})();');fs.writeFileSync(B+'/patched/'+f,s);plan.library[f]={base:h(s0),patched:h(s),changes:did};}
const ch=Object.entries(plan.library).filter(e=>e[1].changes.length);fs.writeFileSync(B+'/plan_KSL.json',JSON.stringify(plan,null,1)+'\n');console.log(B+': '+Object.keys(plan.library).length+' files, '+ch.length+' changed');
