// pkgRP9 (reader phase 2, item 9, W3, 11-08): the MNQ-class quoted-field reads in the three Judge Enforcer Build nodes ask the shared reader
// (__RL, embedded by pkgRP10) first. failsNote: the ANSWER round, the ANSWER quote and the FAILS quote of a FORCED line. efgCheck: the MEANS round
// and the MEANS quote. The old lazy regex ends a quote at an inner quote mark; the reader ends it before the next field label (spec 8.1).
// A line the reader does not read as FORCED (refused, RESTATED or another form) keeps the old read. The CARRIED BY / GROUND tail read stays.
// Base: pkgRP11/patched (s65 = s64 + RP10 + EKS on these nodes, then RP11). Run from wall2024/: node pkgRP9/build_RP9.cjs [base dir]
const fs=require('fs'),cr=require('crypto');const sha=s=>cr.createHash('sha256').update(String(s)).digest('hex').slice(0,12);
const BASE=(process.argv[2]||'pkgRP11/patched').replace(/\/$/,'')+'/';
const H="/* pkgRP9 (reader item 9): the FORCED line as the shared reader reads it, or null (refused, RESTATED, another form): the old read decides on null */\n"
 +"const __ri9=l=>{try{const r=__RL.readLine(String(l==null?'':l).trim());return r&&r.form==='FORCED'&&r.f&&!r.f.restated&&r.f.meansRound&&r.f.answerRound&&typeof r.f.means==='string'&&typeof r.f.answer==='string'&&typeof r.f.fails==='string'?r:null;}catch(e){return null;}};\n";
const REPL=[
 // failsNote: the ANSWER round and the FAILS quote
 [String.raw`const failsNote=l0=>{const l=String(l0).replace(/\\+"/g,'"');if(!/^FORCED/.test(l)||!R)return '';const a0=`,
  H+String.raw`const failsNote=l0=>{const l=String(l0).replace(/\\+"/g,'"');if(!/^FORCED/.test(l)||!R)return '';const __r9=__ri9(l);const a0=__r9?null:`],
 [String.raw`const a=a0?[null,(a0[1]||(a0[3]==='Defender'?'C':'D'))+'R'+(a0[2]||a0[4])]:null;const f=l.match(`,
  String.raw`const a=__r9?[null,__r9.f.answerRound]:a0?[null,(a0[1]||(a0[3]==='Defender'?'C':'D'))+'R'+(a0[2]||a0[4])]:null; /* pkgRP9 */const f=__r9?[null,__r9.f.fails]:l.match(`],
 // failsNote: the ANSWER quote (W3 2484 repeat test)
 [String.raw`const an=l.match(/ANSWER\s*\[[^\]]*\]\s*:\s*"([\s\S]*?)"\s*--\s*FAILS\s*:/);`,
  String.raw`const an=__r9?[null,__r9.f.answer]:l.match(/ANSWER\s*\[[^\]]*\]\s*:\s*"([\s\S]*?)"\s*--\s*FAILS\s*:/); /* pkgRP9 */`],
 // efgCheck: the MEANS round and quote
 [String.raw` const m=l.match(/MEANS\s*\[\s*(?:([CD])R\s*(\d)|(Defender|Challenger)\s*R(?:ound)?\s*(\d))\s*\]\s*:\s*"([\s\S]*?)"\s*--\s*ANSWER/);if(!m)return null;
 const rk=(m[1]||(m[3]==='Defender'?'C':'D'))+'R'+(m[2]||m[4]);`,
  String.raw` const __r9=__ri9(l); /* pkgRP9 */const m=__r9?[null,null,null,null,null,__r9.f.means]:l.match(/MEANS\s*\[\s*(?:([CD])R\s*(\d)|(Defender|Challenger)\s*R(?:ound)?\s*(\d))\s*\]\s*:\s*"([\s\S]*?)"\s*--\s*ANSWER/);if(!m)return null;
 const rk=__r9?__r9.f.meansRound:(m[1]||(m[3]==='Defender'?'C':'D'))+'R'+(m[2]||m[4]);`]];
const plan={base:BASE,nodes:{}};fs.mkdirSync('pkgRP9/patched',{recursive:true});
for(const n of ['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build']){const f=n.replace(/ /g,'_')+'.js';let c=fs.readFileSync(BASE+f,'utf8');const b=sha(c);
 if(!c.includes('const __RL='))throw new Error(n+': no embedded reader');
 for(const [a,z] of REPL){const k=c.split(a).length-1;if(k!==1)throw new Error(n+': anchor x'+k+': '+a.slice(0,70));c=c.replace(a,()=>z);}
 const AF=Object.getPrototypeOf(async function(){}).constructor;new AF(c);
 fs.writeFileSync('pkgRP9/patched/'+f,c);plan.nodes[n]={base:b,patched:sha(c)};}
fs.writeFileSync('pkgRP9/plan_RP9.json',JSON.stringify(plan,null,1)+'\n');console.log(JSON.stringify(plan,null,1));
