// W2 pkgEAF: per-call prompt size of Judge Enforcer Build (largest call) and number of calls, live s125 vs variants, on stored runs.
const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');
const g_=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};const src=f=>{const W=g_(f);const lt=W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode;return rebuild(W.nodes.find(x=>x.name==='Judge Enforcer Build').parameters.jsCode,lt);};
const V=[['live','/mnt/project-files/wall2024/fetchback_live_s125.json'],['SU','pkgEAF/parent_s125_EAF_SU.json'],['AU','pkgEAF/parent_s125_EAF_AU.json']];
(async()=>{for(const r of ['34852','34726','34703','34780']){const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex'+r+'_full.json'));const rd=(X.data||X).resultData.runData;
 for(const [vn,f] of V){const o=await run(src(f),'Judge Enforcer Build',rd);const sz=o.map(it=>((it.body||it).messages||[]).map(m=>m.content).join('\n').length);console.log(r,vn.padEnd(4),'calls',sz.length,'| sizes',sz.join(', '),'| largest',Math.max(...sz));}}})();
