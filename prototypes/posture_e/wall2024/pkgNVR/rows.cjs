// pkgNVR: the grade step of the E-PREM cure on every stored send-back whose CHANGE TO holds "not void" or a range in words, live vs NVR.
// Input: rows.json (from debate_enforcer_log). The later steps (pkgPS out-of-items check, quotes found) are not simulated.
const fs=require('fs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');
const ps=w=>{const x=L(w);const def=name=>{const i=x.Lb.findIndex(l=>new RegExp('function '+name+'\\b').test(l));let j=i,src='';while(j<x.Lb.length){src+=x.Lb[j]+'\n';try{new Function(src);return src;}catch(e){j++;}}};let src=def('psGrades');for(let k=0;k<20;k++){try{const f=new Function(src+';return psGrades;')();f('CONCEDED LINKS: 0 -- x');return f;}catch(e){const m=String(e.message).match(/(\w+) is not defined/);src=def(m[1])+src;}}};
const FB=neg=>(to,n)=>{const z=to.match(new RegExp('\\bpremises?\\s+(?:\\d+\\s*(?:,|and|&)\\s*)*'+n+'\\b[^.;]{0,80}?\\b'+(neg?'(not\\s+|never\\s+)?':'()')+'(VOID|UNEXHIBITED|CONCEDED|COUNTED|SPARED|SUPPORTED|NARROWED|STANDS)\\b','i'));if(!z)return null;const k=z[1]?'SPARED':z[2].toUpperCase();return k==='VOID'?'VOID':/UNEXHIBITED|CONCEDED|COUNTED/.test(k)?'COUNTED':'SPARED';};
// FB mirrors enf428Cure line 2675 (live: no negation group; NVR: not/never before the word reads SPARED)
const V={live:{fb:FB(0),ps:ps('/tmp/claude-0/live_now.json'),want:r=>r&&/VOID/.test(r)?'VOID':r&&/COUNTED|UNEXHIBITED|CONCEDED/.test(r)?'COUNTED':r?'SPARED':null},
 NVR:{fb:FB(1),ps:ps(process.argv[2]||'/tmp/claude-0/parent_s130_NVR.json'),want:r=>r&&/^VOID/.test(r)?'VOID':r&&/^(?:COUNTED|UNEXHIBITED|CONCEDED)/.test(r)?'COUNTED':r?'SPARED':null}};
const rows=JSON.parse(fs.readFileSync(__dirname+'/rows.json','utf8'));let ch=0;
for(const r of rows){const n=+r.item.match(/(\d+)$/)[1];const out={};for(const v in V){const P=V[v].ps(r.to);let g=P&&(n in P.g)?P.g[n]:null;if(!g)g=V[v].fb(r.to,n);const want=V[v].want(r.right);out[v]=!g?'UNCURED (no grade)':want&&g!==want?'UNCURED ('+g+' vs '+want+')':'grade step passes ('+g+')';}
 const d=out.live!==out.NVR;if(d)ch++;console.log((d?'CHANGED ':'same    ')+r.run.slice(5,10),r.seat,'premise',n,'right',r.right,'| live:',out.live,'| NVR:',out.NVR);}
console.log('rows',rows.length,'changed',ch);
