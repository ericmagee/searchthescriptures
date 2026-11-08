// pkgRTB build (D50, K-W family; W2, 11-08). Renders every K-W copy from pkgRTB/rule_table.cjs.
// Library: base strip (default pkgLIB/strip_RCD = LIB v32) -> pkgLIB/strip_RTB. Prompt nodes: bases below -> pkgRTB/patched.
// Run from wall2024/: node pkgRTB/build_RTB.cjs [base strip] [dest strip]
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const {KW}=require('./rule_table.cjs');
const SRC=(process.argv[2]||'pkgLIB/strip_RCD')+'/patched/',DST=(process.argv[3]||'pkgLIB/strip_RTB')+'/patched/';
const OLD={
 agreement:'For every withdrawal or concession the engine puts to me (K-W), I answer in one of three forms: STANDS WITHOUT IT because <layer>; CONCEDED; or REASSERTED IN <round> \\"<quote>\\", when a later round rests on what was withdrawn.',
 audit:'the judge answers STANDS WITHOUT IT because <layer>, CONCEDED, or NOT HELD with a reason that quotes it (six words in a row, or all of it when shorter).',
 cureAsk:"or the side no longer claims it and the link needed it, answer CONCEDED (ruling 428; run 32677: Galatians 4:4 'made of a woman' does not carry 'the seed of David according to the flesh').",
 stake:'K-W is a TRIAL rule: an item left unanswered removes no seat.',
 enforcer:'STANDS WITHOUT IT because <a layer>; CONCEDED; REASSERTED IN <round> "<quote>"; or NOT HELD with a reason.'};
const sub=(s,a,b,tag,f,tally)=>{const n=s.split(a).length-1;if(!n)return s;tally[tag]=(tally[tag]||0)+n;f.push(tag+' x'+n);return s.split(a).join(b);};
const plan={table:'pkgRTB/rule_table.cjs',library:{base:SRC,nodes:{}},prompt:{nodes:{}},tally:{}};
// library strip
fs.rmSync(DST,{recursive:true,force:true});fs.mkdirSync(DST,{recursive:true});let st=null;
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');let s=s0;const hit=[];
 const m=s.match(/'K-W':'(LIVE|TRIAL)'/);if(m){if(st&&st!==m[1])throw new Error('ENF_STATUS K-W differs across nodes');st=m[1];}
 s=sub(s,OLD.agreement,KW.render.agreement(),'agreement',hit,plan.tally);
 s=sub(s,OLD.audit,KW.render.audit(),'audit',hit,plan.tally);
 s=sub(s,OLD.cureAsk,OLD.cureAsk+KW.render.cureAskTail(),'cureAsk',hit,plan.tally);
 if(s.includes(OLD.stake)){if(!m)throw new Error(f+': stake sentence without ENF_STATUS');s=sub(s,OLD.stake,KW.stake(m[1]),'stake',hit,plan.tally);}
 if(hit.length){new Function('$','$input','return (async()=>{\n'+s+'\n})();');plan.library.nodes[f]={base:h(s0),patched:h(s),hits:hit};}
 fs.writeFileSync(DST+f,s);}
plan.library.kw_status=st;
// prompt nodes (not in the library)
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s64.json','utf8'));const live=n=>({src:'fetchback_live_s64',code:W.nodes.find(x=>x.name===n).parameters.jsCode});
const fileB=(p,n)=>({src:p,code:fs.readFileSync(p+n.replace(/ /g,'_')+'.js','utf8')});
const BASES={'Panel Build':live,'Reserve Build':live,'Accept Build':live,'Accept Check':live,'Accept Return Build':live,'Accept Final':live,'Accept DS Return Build':live,
 'Enforcer Build':n=>fileB('pkgEKS/patched/',n),'Judge Enforcer Build':n=>fileB('pkgRP10/patched/',n),'Alt Judge Enforcer Build':n=>fileB('pkgEKS/patched/',n),'R2 Alt Judge Enforcer Build':n=>fileB('pkgEKS/patched/',n)};
fs.mkdirSync('pkgRTB/patched',{recursive:true});
for(const [n,get] of Object.entries(BASES)){const b=get(n);let s=b.code;const hit=[];
 s=sub(s,OLD.agreement,KW.render.agreement(),'agreement',hit,plan.tally);s=sub(s,OLD.enforcer,KW.render.enforcer(),'enforcer',hit,plan.tally);
 if(!hit.some(x=>x.startsWith('agreement')))throw new Error(n+': agreement copy not found');
 new Function('$','$input','return (async()=>{\n'+s+'\n})();');fs.writeFileSync('pkgRTB/patched/'+n.replace(/ /g,'_')+'.js',s);plan.prompt.nodes[n]={base:b.src,before:h(b.code),after:h(s),hits:hit};}
fs.writeFileSync('pkgRTB/plan_RTB.json',JSON.stringify(plan,null,1));console.log('K-W status',st,'| library nodes',Object.keys(plan.library.nodes).length,'| prompt nodes',Object.keys(plan.prompt.nodes).length,'|',JSON.stringify(plan.tally));
