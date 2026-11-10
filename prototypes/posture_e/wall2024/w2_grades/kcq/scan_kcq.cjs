// W2 grade of pkgKCQ: K-C raises (netLines), K-S2 raises (ks2Lines) and netKeeps on stored judge texts, live s113 against candidate. usage: node scan_kcq.cjs <cand>
const fs=require('fs');const lib=require('./kc_lib.cjs');const A=lib('/mnt/project-files/wall2024/fetchback_live_s113.json'),B=lib(process.argv[2]);
const raw=fs.readFileSync(process.argv[3],'utf8');const j=JSON.parse(raw);const inner=j.result.slice(j.result.indexOf('['),j.result.lastIndexOf(']')+1);const rows=JSON.parse(inner)[0].json_agg;
const ex=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34726_full.json','utf8'));
let T=rows.map(r=>({k:r.k,t:r.t}));
const strip=t=>String(t).split('\n').filter(l=>!/^\s*\[AUDIT/.test(l)).join('\n');
let nA=0,nB=0,s2A=0,s2B=0,diff=0,keepD=0,keepN=0;
for(const r of T){const t=strip(r.t);const a=A.netLines(t,null,null),b=B.netLines(t,null,null);nA+=a.length;nB+=b.length;
 const ka=new Set(a.map(x=>x.item)),kb=new Set(b.map(x=>x.item));const sa=A.ks2Lines(t,ka),sb=B.ks2Lines(t,kb);s2A+=sa.items.length;s2B+=sb.items.length;
 if(JSON.stringify(a)!==JSON.stringify(b)||JSON.stringify(sa.items)!==JSON.stringify(sb.items)){diff++;console.log('DIFF',r.k,'K-C',a.length,'->',b.length,'K-S2',sa.items.length,'->',sb.items.length);a.filter(x=>!b.some(y=>y.line===x.line)).forEach(x=>console.log('   lost K-C',x.item,x.side,'|',x.line.slice(0,300)));}
 for(const l of t.split('\n')){if(!l.trim())continue;keepN++;if(A.netKeeps(l)!==B.netKeeps(l)){keepD++;console.log('KEEP DIFF',r.k,l.slice(0,200));}}}
console.log('texts',T.length,'K-C raises live',nA,'cand',nB,'| K-S2 live',s2A,'cand',s2B,'| texts differing',diff,'| netKeeps lines',keepN,'differ',keepD);
