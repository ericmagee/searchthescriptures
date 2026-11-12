const fs=require('fs');
function load(f){const w=JSON.parse(fs.readFileSync(f));const c=w.nodes.find(n=>n.name==='C4 Build').parameters.jsCode;
 const i=c.indexOf('const OGR=(()=>{');const j=c.indexOf('\n return {harvest',i);const k=c.indexOf('})();',j);
 return new Function(c.slice(i,k+5)+';return OGR;')();}
const A=load('/mnt/project-files/wall2024/fetchback_live_s155.json'),B=load('parent_s155_SGJ.json');
const runs=JSON.parse(fs.readFileSync('runs.json'));let S={same:0,lead:0,unjoin:0,other:0,gone:0,added:0,oldBlk:0,newBlk:0};
const show=process.argv[2]||'';
for(const r of runs){const a=A.harvest(r),b=B.harvest(r);const bt=b.map(x=>x.text);const used=new Set();
 S.oldBlk+=A.block(a).length;S.newBlk+=B.block(b).length;
 for(const p of a){let k=bt.indexOf(p.text);if(k>=0){S.same++;used.add(k);continue;}
  // find new whose text contains the old head (grant word part)
  const head=p.text.split(/(?<=[.!?])["')\]]?\s/)[0];
  k=bt.findIndex((t,i)=>!used.has(i)&&t.includes(head.slice(0,40)));
  if(k<0){S.gone++;if(show)console.log(r.t,'GONE',JSON.stringify(p.text));continue;}used.add(k);
  const q=bt[k];const kind=q.endsWith(p.text.trim())?'lead':(p.text.startsWith(q)||p.text.includes(q))?'unjoin':'other';S[kind]++;
  if(show&&(show==='all'||show===kind))console.log(r.t,kind.toUpperCase(),'\n  OLD:',JSON.stringify(p.text),'\n  NEW:',JSON.stringify(q));}
 b.forEach((q,i)=>{if(!used.has(i)){S.added++;if(show)console.log(r.t,'ADDED',JSON.stringify(q.text));}});}
console.log(S);
