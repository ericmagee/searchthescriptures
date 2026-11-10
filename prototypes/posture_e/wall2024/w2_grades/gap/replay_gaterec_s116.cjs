// W2: replay s116 Gate Record (and Alt Gate Record) on stored runs (stored Gate Build output and stored gate replies); list UNCURED rows.
const fs=require('fs');process.chdir(__dirname+'/../..');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');const H=require(process.cwd()+'/pkgEAD/harness_clone.cjs');
const wf=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const A=wf(process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s116.json');
const by={};A.nodes.forEach(n=>by[n.name]=n);const src=n=>rebuild(by[n].parameters.jsCode,by['Shared Library'].parameters.jsCode);
const pred=n=>{for(const [k,v] of Object.entries(A.connections))for(const outs of (v.main||[]))for(const c of (outs||[]))if(c.node===n)return k;};
const ONLY=process.env.RUNS?process.env.RUNS.split(','):null;
const runs=[...new Set(fs.readdirSync(H.IN).filter(f=>/_Gate_Record\.json$/.test(f)).map(f=>f.split('_')[0]))].filter(r=>!ONLY||ONLY.includes(r)).sort();
(async()=>{for(const node of ['Gate Record','Alt Gate Record']){const S=src(node);const pc=node.replace('Record','Call openrouter');console.log('#',node);
 for(const r of runs){const p=H.out(r,pc)?pc:pred(node);if(!H.out(r,p))continue;let o;try{o=await H.run(S,r,p,{});}catch(e){console.log(r,node,'ERROR',String(e.message).slice(0,140));continue;}
  const x=o[0].json;const rows=x.gate_rows||[];const st=(H.out(r,node.replace(' Gate Record',' Gate Record'))||[]).flat()[0];const old=st&&st.json&&st.json.gate_rows||[];
  const u=rows.filter(z=>z.cure_status!=='CURED'),uo=old.filter(z=>z.cure_status!=='CURED');console.log(r,node==='Gate Record'?'P':'A','rows',rows.length,'uncured s116',u.length,'stored',uo.length,'| alt_needed',x.alt_needed);
  for(const z of u)console.log('   ',z.seat,'|',z.item.slice(0,40),'|',String(z.cure_reason).replace(/^[\s\S]*?\| ENGINE: /,'ENGINE: ').slice(0,170));}}})();
