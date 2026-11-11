// W2 ASK 64 option 2 measure: Send Back Build / Alt Send Back Build on stored runs, live s127 vs O2: E-ANS items in the send-back; other items equal.
// Plus the stored E-ANS send-back rows (Send Back Record) and their recorded cure: CURED = the judge changed its grade to MISSES.
const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};const eff=(W,n)=>rebuild(W.nodes.find(x=>x.name===n).parameters.jsCode,W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode);
const LW=g('/mnt/project-files/wall2024/fetchback_live_s127.json'),OW=g('pkgA64/parent_s127_A64_O2.json');
const out=(rd,n)=>{const r=rd[n];if(!r)return null;const m=(r[r.length-1].data||{}).main;return m&&m[0]?m[0].map(x=>x.json):null;};
(async()=>{const T={live:0,o2:0,cured:0,unc:0};for(const r of fs.readdirSync('/mnt/project-files/wall2024/').filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+r));const rd=(X.data||X).resultData.runData;
 let la=0,lb=0,same=true,ran=0,err=0;for(const n of ['Send Back Build','Alt Send Back Build']){if(!rd[n])continue;ran++;const oa=await run(eff(LW,n),n,rd),ob=await run(eff(OW,n),n,rd);if(oa.err||ob.err){err++;continue;}
  const items=o=>o.flatMap(j=>(j.sb_items||j.items||[]));const s=JSON.stringify(oa),t=JSON.stringify(ob);la+=(s.match(/"rule":"E-ANS"/g)||[]).length;lb+=(t.match(/"rule":"E-ANS"/g)||[]).length;
  const strip=x=>x.replace(/\{[^{}]*"rule":"E-ANS"[^{}]*\}/g,'');}
 const sb=[];for(const n of ['Send Back Record','Alt Send Back Record']){const o=out(rd,n);if(o)o.forEach(j=>(j.sb_rows||[]).forEach(x=>sb.push(x)));}const e=sb.filter(x=>x.rule==='E-ANS');
 const cu=e.filter(x=>x.cure_status==='CURED').length,un=e.filter(x=>x.cure_status==='UNCURED').length;
 console.log(r,'| send-back build nodes replayed',ran,'errors',err,'| "rule":"E-ANS" entries in output, live',la,'-> O2',lb,'| stored E-ANS send-back rows',e.length,'| recorded CURED (judge changed to MISSES)',cu,'| UNCURED',un);T.live+=la;T.o2+=lb;T.cured+=cu;T.unc+=un;}
 console.log('TOTAL',JSON.stringify(T));})();
