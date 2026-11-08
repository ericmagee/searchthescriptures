// pkgRTB family 4 (K-G11 / K-P; design DESIGN_UNPROVEN.md). Run from wall2024/:
//   node pkgRTB/build_RTB4.cjs [base strip=pkgLIB/strip_GDS_SGA3_W1 (the s67 library)] [dest strip=pkgLIB/strip_RTB4]
// Library only (no prompt node carries these texts). Plan: pkgRTB/plan_RTB4.json.
const fs=require('fs'),cr=require('crypto');const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const SRC=(process.argv[2]||'pkgLIB/strip_GDS_SGA3_W1').replace(/\/$/,'')+'/patched/',DST=(process.argv[3]||'pkgLIB/strip_RTB4').replace(/\/$/,'')+'/patched/';
const SUBS=require('./build_RTB4_subs.cjs')();
const sub=(s,a,b,tag,f,tally)=>{const n=s.split(a).length-1;if(!n)return s;tally[tag]=(tally[tag]||0)+n;f.push(tag+' x'+n);return s.split(a).join(b);};
const plan={table:'pkgRTB/rule_table.cjs',library:{base:SRC,nodes:{}},tally:{}};
fs.rmSync(DST,{recursive:true,force:true});fs.mkdirSync(DST,{recursive:true});
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');let s=s0;const hit=[];
 for(const [tag,a,b] of SUBS.library)s=sub(s,a,b,tag,hit,plan.tally);
 if(hit.length){new Function('$','$input','return (async()=>{\n'+s+'\n})();');plan.library.nodes[f]={base:h(s0),patched:h(s),hits:hit};}
 fs.writeFileSync(DST+f,s);}
fs.writeFileSync('pkgRTB/plan_RTB4.json',JSON.stringify(plan,null,1)+'\n');
console.log('library nodes',Object.keys(plan.library.nodes).length,'|',JSON.stringify(plan.tally));
