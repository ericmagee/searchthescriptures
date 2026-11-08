// pkgKWI library part (W1, 11-08; Eric approved 15:16 CST; class kw_nh_quote_stops_at_inner_quote, W3 grade_33828.md).
// 1. Engine: the K-W withdrawal sentence cut (kwLines421) stopped at the ellipsis inside a nested quote, so 33828 showed
//    [CR4] D5: "I grant the alarm and the form "fear not..." (unbalanced quotes, "for" lost). kwiCut2024 keeps the old cut when its
//    double quotes balance; otherwise it cuts at the first sentence end outside quotes on that line. kwiSq2024 shows any inner quote with
//    single marks, so the flagged line has one balanced pair of double quotes. The quote check strips all quote marks, so it accepts the same words.
// 2. Text: every K-W six-word rule says quote marks inside the sentence do not end the six words.
// Run from wall2024/: node pkgKWI/build_KWI_lib.cjs [base strip=pkgLIB/strip_RTB4_8 (s68)] [dest=pkgLIB/strip_KWI]
const fs=require('fs'),cr=require('crypto');const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const SRC=(process.argv[2]||'pkgLIB/strip_RTB4_8').replace(/\/$/,'')+'/patched/',DST=(process.argv[3]||'pkgLIB/strip_KWI').replace(/\/$/,'')+'/patched/';
const SUBS=require('./kwi_lib_subs.cjs');
const plan={library:{base:SRC,nodes:{}},tally:{}};
fs.rmSync(DST,{recursive:true,force:true});fs.mkdirSync(DST,{recursive:true});
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');let s=s0;const hit=[];
 for(const [tag,a,b,need] of SUBS){const n=s.split(a).length-1;if(need&&n!==need&&n!==0)throw new Error(f+' '+tag+' count '+n);if(!n)continue;plan.tally[tag]=(plan.tally[tag]||0)+n;hit.push(tag+' x'+n);s=s.split(a).join(b);}
 if(hit.length){new Function('$','$input','return (async()=>{\n'+s+'\n})();');plan.library.nodes[f]={base:h(s0),patched:h(s),hits:hit};}
 fs.writeFileSync(DST+f,s);}
fs.writeFileSync('pkgKWI/plan_KWI_lib.json',JSON.stringify(plan,null,1)+'\n');
console.log('library nodes',Object.keys(plan.library.nodes).length,'|',JSON.stringify(plan.tally));
