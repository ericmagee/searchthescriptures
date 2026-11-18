const fs=require('fs');const {unpack}=require('../tools/lib.cjs');const w=JSON.parse(fs.readFileSync(__dirname+'/../rdf/fetchback_s262.json'));const {L,M}=unpack(w);
const c=require('./census.json');const g=c.filter(x=>/LINK BROKEN|UNDERDETERMINED|STANDS|WITHDRAWN/.test(x.re));
const users=li=>Object.entries(M).filter(([n,m])=>m.p.some(e=>typeof e==='number'?e===li:(typeof e[0]!=='string'&&li>=e[0]&&li<=e[1]))).map(([n])=>n);
const out=[];const tab=[];
g.forEach((x,i)=>{const needle=x.re.startsWith('new RegExp')?x.re.slice(11,60):'/'+x.re+'/';out.push('#### SITE '+i+' '+x.name);
 const hits=[];L.forEach((l,li)=>{let k=-1;while((k=l.indexOf(needle,k+1))>=0)hits.push({li,k});});
 for(const n of w.nodes){const s=n.parameters&&n.parameters.jsCode||'';if(n.name==='Shared Library')continue;let k=-1;while((k=s.indexOf(needle,k+1))>=0)hits.push({node:n.name,k,s});}
 for(const h of hits){const l=h.s||L[h.li];out.push((h.node?'  INLINE '+h.node:'  LIB '+h.li+' ['+users(h.li).length+' stubs: '+users(h.li).join(', ')+']')+'\n'+l.slice(Math.max(0,h.k-700),h.k+needle.length+700));}
 tab.push([i,x.name,hits.map(h=>h.node?'node:'+h.node:'L'+h.li).join(' ')]);});
fs.writeFileSync(__dirname+'/sites.txt',out.join('\n\n'));console.log(tab.map(t=>t.join(' | ')).join('\n'));
