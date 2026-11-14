// ASK 279 (pkgSPC rev 2, with W2 6350 tightening T1-T4): record-only check of a Strong's number named in an [L2] row against original_words for each verse that row names, and of a stated Greek voice against the stored morph code. L2 Count Plan computes; Build Save Body writes the audit line.
const fs=require('fs');const [, , fin, fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const SPC=fs.readFileSync(__dirname+'/spc.js','utf8').trim();
const P=W.nodes.find(x=>x.name==='L2 Count Plan');let p=P.parameters.jsCode;const A1="const tags=l2EnglishPass2024(L2C.check(S.l2_tags||[],ow,lex,[...read]),read);";
if(p.split(A1).length!==2)throw new Error('anchor 1');const p0=p.length;
p=p.replace(A1,()=>SPC+' /* pkgSPC, ASK 279 */\n'+A1+'__SPC(tags,ow,lex);');P.parameters.jsCode=p;
const B=W.nodes.find(x=>x.name==='Build Save Body');let b=B.parameters.jsCode;const A2=" const D=(q.l2.counts||[]).filter(c=>/DIFFERS/.test(c.status));";
if(b.split(A2).length!==2)throw new Error('anchor 2');const b0=b.length;
const LINE=" const __PL=T.filter(t=>Array.isArray(t.place)&&t.place.length);if(__PL.length)out.push('[AUDIT v52: [L2] PLACE AND FORM CHECK (pkgSPC, ASK 279; TRIAL, record-only) -- '+__PL.slice(0,12).map(t=>t.round+' '+(t.words||[]).map(w=>w.w).join('/')+': '+t.place.join('; ')).join(' | ').replace(/[\\[\\]]/g,'')+'. REVIEW THIS ROW.]');";
b=b.replace(A2,()=>LINE+A2);B.parameters.jsCode=b;
console.log('L2 Count Plan',p0,'->',p.length,'| Build Save Body',b0,'->',b.length);fs.writeFileSync(fout,JSON.stringify(W));
