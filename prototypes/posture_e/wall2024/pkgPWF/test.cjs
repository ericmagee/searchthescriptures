// pkgPWF test: run the parent and target ABS.cure (Send Back Record source) on planted and stored CHANGE TO lines.
// ctx.rows holds the KJV verses the plants quote, so fit() can count them. usage: node test.cjs <parent json> <target json> <kjv rows json>
const fs=require('fs');const {load}=require(__dirname+'/../pkgABR/mods.cjs');const [,,P,T,K]=process.argv;
const wf=f=>{const r=JSON.parse(fs.readFileSync(f,'utf8'));const W=(r.data||r).workflow||(r.data||r);return W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;};
const O=load(wf(P),'Send Back Record'),N=load(wf(T),'Send Back Record');const ctx={rows:JSON.parse(fs.readFileSync(K,'utf8')),ow:[],lex:[]};
const pl=JSON.parse(fs.readFileSync(__dirname+'/plants.json','utf8'));let bad=0;
for(const p of pl){const it={rule:'E-ANS',item:'x'},a={ans:'CHANGE',to:p.to,why:p.why};const o=O.ABS.cure(it,a,ctx),n=N.ABS.cure(it,a,ctx);const ok=n.status===p.want;if(!ok)bad++;
 console.log((ok?'PASS ':'FAIL ')+p.id+' | old '+o.status+' | new '+n.status+' (want '+p.want+') | '+n.why.slice(0,110));}
// non-E-ANS rule untouched
{const it={rule:'E-HOLD'},a={ans:'CHANGE',to:pl[0].to,why:''};const o=O.ABS.cure(it,a,ctx),n=N.ABS.cure(it,a,ctx);const ok=o.status===n.status&&o.why===n.why;if(!ok)bad++;console.log((ok?'PASS':'FAIL')+' E-HOLD path unchanged ('+n.status+')');}
// check() why: the clause is added for E-ANS only
{const id={rule:'E-ANS',grade:'MEETS',flagged_line:'ANSWER CHECK: Luke 1:31 -- [CR3] -- MEANS: "x" -- ANSWER: "I grant it." -- MEETS -- it does not deny the verse.'};const o=O.ABS.check(id,ctx),n=N.ABS.check(id,ctx);
 const ok=o.raise===n.raise&&n.why===o.why+' (the [L1] must be a verse the ANSWER itself names or quotes)';if(!ok)bad++;console.log((ok?'PASS':'FAIL')+' check why E-ANS: raise '+n.raise+' | +'+(n.why.length-o.why.length)+' chars');}
console.log(bad?bad+' FAIL':'ALL PASS');process.exit(bad?1:0);
