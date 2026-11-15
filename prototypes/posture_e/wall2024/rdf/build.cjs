// pkgRDF: all judges and debaters at default reasoning (operator 06:57 CST 11-15: "remove any reasoning adjustments from judges and debators.. they all should run ay default.")
// Removes: gemini-3.8-flash effort low (judge-side); mimo-v2.6-pro effort medium (max_tokens 131072 kept); xiaomi reasoning off (Reserve/alternate paths). Token limits and temperature untouched.
const fs=require('fs'),cr=require('crypto');const d=JSON.parse(fs.readFileSync(process.argv[2]));const sha=s=>cr.createHash('sha256').update(s).digest('hex');
const R=[["if(/^google\\/gemini-3\\.8-flash$/.test(String(model))&&!/:(?:defender|challenger)$/.test(String(key))&&!o.reasoning)o.reasoning={effort:'low'};","",'flash-low'],
["if(!o.reasoning)o.reasoning={effort:'medium'};","",'mimo-medium'],
[",reasoning:{enabled:false}","",'xiaomi-off']];
const cnt=(s,a)=>s.split(a).length-1;const rep=[];const tot={};
const fix=(s,tag)=>{let x=s;const hit=[];for(const [a,b,t] of R){const k=cnt(x,a);if(k){x=x.split(a).join(b);hit.push(t+'x'+k);tot[t]=(tot[t]||0)+k;}}return [x,hit];};
for(const n of d.nodes){const p=n.parameters||{};
 if(n.name==='Shared Library'){const c=p.jsCode;const iL=c.indexOf('\n/*LIB*/'),iM=c.lastIndexOf('\n/*MAP*/'),iE=c.lastIndexOf('\n/*END*/');const L=JSON.parse(c.slice(iL+8,iM)),M=JSON.parse(c.slice(iM+8,iE));
  const hits=[];L.forEach((l,i)=>{const [x,h]=fix(l,'LIB');if(h.length){L[i]=x;hits.push(i+':'+h.join(','));}});if(!hits.length)continue;
  const rb=m=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');let ch=0;for(const k of Object.keys(M)){const x=rb(M[k]).length;if(x!==M[k].n){M[k].n=x;ch++;}}
  const LJ=JSON.stringify(L);const hdr=c.slice(0,iL).replace(/library sha [0-9a-f]{16}, (\d+) lines/,(m,q)=>{if(+q!==L.length)throw new Error('lines');return 'library sha '+sha(LJ).slice(0,16)+', '+q+' lines';});
  const nc=hdr+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+c.slice(iE);p.jsCode=nc;rep.push([n.name,c.length,nc.length,sha(nc).slice(0,12),hits.join(' '),'MAP n changed '+ch]);continue;}
 const walk=(o,path)=>{for(const k of Object.keys(o)){const v=o[k];if(typeof v==='string'){const [x,h]=fix(v);if(h.length){o[k]=x;rep.push([n.name+'.'+path+k,v.length,x.length,sha(x).slice(0,12),h.join(',')]);}}else if(v&&typeof v==='object')walk(v,path+k+'.');}};walk(p,'');}
fs.writeFileSync(process.argv[3],JSON.stringify(d));for(const r of rep)console.log(r.join('\t'));console.log('entries',rep.length,JSON.stringify(tot));
// residual check
const all=JSON.stringify(d);for(const re of [/o\.reasoning=\{/g,/reasoning:\{enabled/g,/effort:'/g])console.log('residual',re.source,(all.match(re)||[]).length);
