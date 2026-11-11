// pkgP72 rev 2 check: runs rev 1 p372 (instrumented copy of rev 1 build) and lists each rev 1 line whose ANSWER CHECK MEANS does not match the press MEANS of that verse in the premise. Usage: node drop_r2.cjs <instrumented rev 1 parent>
const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflowData||j.workflow||j;};
const B=load(process.argv[2]);const T=B.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const P={Lb:JSON.parse(T.slice(a+8,b)),M:JSON.parse(T.slice(b+8,c))};
const reb=e=>P.M[e].p.map(x=>typeof x==='number'?P.Lb[x]:typeof x[0]==='string'?x[0]:P.Lb.slice(x[0],x[1]+1).join('\n')).join('\n');
const run=async(rd,src,node)=>{const mk=name=>{const r=rd[name];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];const nd=(B.nodes.find(n=>n.name===name)||{});return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:nd.parameters||{}};};
 const r=rd[node];const sn=r[0].source&&r[0].source[0]&&r[0].source[0].previousNode;const inp=mk(sn);const $input={all:()=>inp.all(),first:()=>inp.first(),item:inp.first()};
 return await new Function('$','$input','return (async()=>{\n'+src+'\n})();')(mk,$input);};
const NM=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
(async()=>{const W='/mnt/project-files/wall2024/';let kept=0,drop=0;for(const f of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const rd=JSON.parse(fs.readFileSync(W+f,'utf8')).data.resultData.runData;
 for(const node of ['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build'].filter(e=>rd[e])){globalThis.__D=[];try{await run(rd,reb(node),node);}catch(e){continue;}
 const seen=new Set();for(const d of globalThis.__D){const k=d.sd+d.n+d.seat+d.line;if(seen.has(k))continue;seen.add(k);
  const v=(d.line.match(/^ANSWER CHECK:\s*(.+?)\s*--/)||[])[1];const am=(d.line.match(/--\s*MEANS:\s*([^]+?)\s*--\s*ANSWER:/i)||[])[1];
  const pm=d.pw.split('\n').filter(l=>v&&l.includes(v.replace(/\s*\(.*$/,''))).map(l=>(l.match(/--\s*MEANS:\s*(.+?)\s*(?:--|$)/i)||[])[1]).filter(Boolean);
  const ok=!!NM(am)&&pm.some(p=>{const a=NM(am),b=NM(p);return a.includes(b)||b.includes(a);});ok?kept++:drop++;
  if(!ok)console.log('DROP',f.slice(2,7),node,d.seat,d.sd,d.n,v,'\n   AC MEANS:',am,'\n   PRESS MEANS:',JSON.stringify(pm));}}}
 console.log('rev1 lines kept',kept,'dropped',drop);})();
