// pkgKBL build (W1, 11-09; W3 ruling Wall 3441: 33846 grok removed on a false K-B item, then its RESTATED cure logged "no written response").
// Applies kbl_subs.cjs to the 30 library full sources (base pkgLIB/strip_KWI = live s70 Shared Library 40d6f920ab83) and to the
// 12 non-library nodes that carry their own lbFoot (base fetchback_live_s70). Run from wall2024/: node pkgKBL/build_KBL.cjs
const fs=require('fs'),cr=require('crypto');const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const SRC='pkgLIB/strip_KWI/patched/',DST='pkgLIB/strip_KBL/patched/',ND='pkgKBL/patched/';const SUBS=require('./kbl_subs.cjs');
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s70.json','utf8'));
const plan={base:{library:SRC+' (s69 Shared Library 40d6f920ab83)',nodes:'fetchback_live_s70.json'},library:{},nodes:{},tally:{}};
const apply=(s0,f)=>{let s=s0;const hit=[];for(const [tag,a,b] of SUBS){const n=s.split(a).length-1;if(!n)continue;if(n>2)throw new Error(f+' '+tag+' x'+n);plan.tally[tag]=(plan.tally[tag]||0)+n;hit.push(tag+' x'+n);s=s.split(a).join(b);}
 if(hit.length)new Function('$','$input','return (async()=>{\n'+s+'\n})();');return [s,hit];};
fs.rmSync(DST,{recursive:true,force:true});fs.mkdirSync(DST,{recursive:true});fs.rmSync(ND,{recursive:true,force:true});fs.mkdirSync(ND,{recursive:true});
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');const [s,hit]=apply(s0,f);if(hit.length)plan.library[f]={base:h(s0),patched:h(s),hits:hit};fs.writeFileSync(DST+f,s);}
for(const n of W.nodes){const c=n.parameters&&n.parameters.jsCode;if(!c||n.name==='Shared Library'||!/function lbFoot/.test(c))continue;const [s,hit]=apply(c,n.name);
 const f=n.name.replace(/ /g,'_')+'.js';fs.writeFileSync(ND+f,s);plan.nodes[n.name]={file:ND+f,base:h(c),patched:h(s),hits:hit};}
fs.writeFileSync('pkgKBL/plan_KBL.json',JSON.stringify(plan,null,1)+'\n');
console.log('library',Object.keys(plan.library).length,'nodes',Object.keys(plan.nodes).length,JSON.stringify(plan.tally));
