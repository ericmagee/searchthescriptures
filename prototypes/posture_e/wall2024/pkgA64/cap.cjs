// W2: pkgA1N cap check: per stored run and check node, calls, unchecked ids and check text: live s128 vs rev 1 (O1NF) vs rev 2 (O1NG).
const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};const eff=(W,n)=>rebuild(W.nodes.find(x=>x.name===n).parameters.jsCode,W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode);
const V={live:g('/mnt/project-files/wall2024/fetchback_live_s128.json'),r1:g('pkgA64/parent_s128_A64_O1NF.json'),r2:g('pkgA64/parent_s128_A64_O1NG.json')};
(async()=>{const T={};for(const N of ['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build']){const E={};for(const k in V)E[k]=eff(V[k],N);
for(const r of fs.readdirSync('/mnt/project-files/wall2024/').filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+r));const rd=(X.data||X).resultData.runData;if(!rd[N])continue;
 const res={};for(const k in E){const o=await run(E[k],N,rd);if(o.err){res[k]={err:o.err};continue;}const nc=new Set();let ch=0,ol=0;for(const it of o){const j=it;(j.not_checked||[]).forEach(x=>nc.add(x));for(const m of ((j.body||j).messages||[]))ch+=String(m.content).length;ol+=((((j.body||j).messages||[]).map(m=>m.content).join('\n')).match(/THE SIDE'S OTHER LINES ON THIS VERSE/g)||[]).length;}res[k]={calls:o.filter(x=>x.call).length||o.length,nc:[...nc].sort(),ch,ol};}
 if(Object.values(res).some(x=>x.err)){console.log(N,r,'ERR',JSON.stringify(res));continue;}
 const lost=k=>res[k].nc.filter(x=>!res.live.nc.includes(x));
 console.log(N,'|',r,'| calls',res.live.calls,res.r1.calls,res.r2.calls,'| unchecked',res.live.nc.length,res.r1.nc.length,res.r2.nc.length,'| newly unchecked r1',lost('r1').join(' ')||'-','r2',lost('r2').join(' ')||'-','| items with other lines r1',res.r1.ol,'r2',res.r2.ol,'| chars r2-live +'+(res.r2.ch-res.live.ch));}}})();
