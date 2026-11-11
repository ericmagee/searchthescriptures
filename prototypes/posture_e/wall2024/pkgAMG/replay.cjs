// pkgAMG replay: runs the Send Back Record stubs (live s141 vs the parent) on every stored export; lists every cure row whose status
// or reason changes, and checks that everything else in the output is equal (timestamps masked).
const fs=require('fs');const SP=process.argv[2];
const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflowData||j.workflow||j;};
const parts=w=>{const T=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');return {Lb:JSON.parse(T.slice(a+8,b)),M:JSON.parse(T.slice(b+8,c))};};
const reb=(P,e)=>P.M[e].p.map(x=>typeof x==='number'?P.Lb[x]:typeof x[0]==='string'?x[0]:P.Lb.slice(x[0],x[1]+1).join('\n')).join('\n');
const A=load('/mnt/project-files/wall2024/fetchback_live_s141.json'),B=load(SP);const PA=parts(A),PB=parts(B);
const ch=Object.keys(PB.M).filter(e=>reb(PA,e)!==reb(PB,e));console.log('stubs changed:',ch.map(e=>e+' '+(reb(PB,e).length-reb(PA,e).length)));
const run=async(rd,src,node,ri)=>{const mk=name=>{const r=rd[name];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];const nd=(A.nodes.find(n=>n.name===name)||{});return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:nd.parameters||{}};};
 const r=rd[node][ri];const sn=r.source&&r.source[0]&&r.source[0].previousNode;const inp=mk(sn);const $input={all:()=>inp.all(),first:()=>inp.first(),item:inp.first()};
 return await new Function('$','$input','return (async()=>{\n'+src+'\n})();')(mk,$input);};
const rows=o=>{const out=[];const w=x=>{if(!x||typeof x!=='object')return;if(Array.isArray(x))return x.forEach(w);if(typeof x.cure_status==='string'&&x.flagged_line)out.push(x);for(const k in x)w(x[k]);};w(o);return out;};
const mask=s=>JSON.stringify(s).replace(/\d{4}-\d\d-\d\dT[\d:.]+Z/g,'T');
(async()=>{const W='/mnt/project-files/wall2024/';const tot={runs:0,changed:0,toCured:0,toUncured:0,errs:0};
 for(const f of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const rd=JSON.parse(fs.readFileSync(W+f,'utf8')).data.resultData.runData;
  for(const node of ch.filter(e=>rd[e]))for(let ri=0;ri<rd[node].length;ri++){let o,n;try{o=await run(rd,reb(PA,node),node,ri);n=await run(rd,reb(PB,node),node,ri);}catch(e){console.log(f,node,ri,'ERROR',e.message);tot.errs++;continue;}
   tot.runs++;const ro=rows(o.map(i=>i.json)),rn=rows(n.map(i=>i.json));const diffs=[];ro.forEach((x,k)=>{const y=rn[k]||{};if(x.cure_status!==y.cure_status||x.cure_reason!==y.cure_reason)diffs.push([x,y]);});
   const so=mask(o.map(i=>i.json)),sn=mask(n.map(i=>i.json));let rest=so===sn;if(!rest){let a=so,b=sn;for(const [x,y] of diffs){a=a.split(mask(x).slice(1,-1)).join('#');b=b.split(mask(y).slice(1,-1)).join('#');}rest=a===b;}
   console.log(f.slice(2,7),node.padEnd(22),'run',ri,'| cure rows',ro.length,rn.length,'| changed',diffs.length,'| all else equal',rest);
   for(const [x,y] of diffs){tot.changed++;if(y.cure_status==='CURED')tot.toCured++;if(y.cure_status==='UNCURED')tot.toUncured++;
    console.log('    ',x.seat,x.rule,x.cure_status,'->',y.cure_status,'|',String(x.flagged_line).slice(0,140),'\n       old why:',String(x.cure_reason).slice(-160),'\n       new why:',String(y.cure_reason).slice(-160));}}}
 console.log('TOTAL',JSON.stringify(tot));})();
