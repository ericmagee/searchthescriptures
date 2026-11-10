// W2: replay Gate Build (and Alt Gate Build) of s116 on every stored run in inputs/; list form refusals that remain.
const fs=require('fs');process.chdir(__dirname+'/../..');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');const H=require(process.cwd()+'/pkgEAD/harness_clone.cjs');
const wf=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const A=wf(process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s116.json');
const by={};A.nodes.forEach(n=>by[n.name]=n);const src=n=>rebuild(by[n].parameters.jsCode,by['Shared Library'].parameters.jsCode);
const pred=n=>{for(const [k,v] of Object.entries(A.connections))for(const outs of (v.main||[]))for(const c of (outs||[]))if(c.node===n)return k;};
const runs=[...new Set(fs.readdirSync(H.IN).filter(f=>/_Gate_Build\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
(async()=>{for(const node of ['Gate Build','Alt Gate Build']){const p=pred(node);const S=src(node);
 for(const r of runs){const ip=H.out(r,p)?p:(node==='Gate Build'?'Send Back Record':'Alt Send Back Record');if(!H.out(r,ip))continue;let o;try{o=await H.run(S,r,ip,{});}catch(e){console.log(r,node,'ERROR',String(e.message).slice(0,100));continue;}
  const sb=(H.out(r,node==='Gate Build'?'Send Back Record':'Alt Send Back Record')||[]).flat().map(x=>x.json)[0]||{};const items=sb.sb_items||[];
  for(const x of o.map(z=>z.json)){for(const it of (x.items||[])){if(!/no line form|not in the judge text|not read|cannot read|single quot|has no/i.test(it.why||''))continue;const sid=String(it.src||it.sid||'').replace(/^E-APPLY /,'');const s=items.find(z=>z.seat===x.seat&&z.sid===sid)||{};
   console.log(r,node==='Gate Build'?'P':'A',x.seat,sid,s.rule,it.kind,'|',String(it.why).slice(0,60),'| TO:',JSON.stringify(s.to||it.to||'').slice(0,100));}}}}})();
