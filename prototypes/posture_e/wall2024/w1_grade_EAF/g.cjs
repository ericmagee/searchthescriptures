// W1 grade of pkgEAF. G3: every block served on SU/AU is checked to contain the judge's quote (a wrong block is the risk of dropping the gate).
const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');
const g_=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};const src=f=>{const W=g_(f);const lt=W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode;return rebuild(W.nodes.find(x=>x.name==='Judge Enforcer Build').parameters.jsCode,lt);};
const P='/mnt/project-files/wall2024/';const V={live:src(P+'fetchback_live_s125.json'),SU:src(P+'parent_s125_EAF_SU.json'),AU:src(P+'parent_s125_EAF_AU.json')};
const N=s=>String(s||'').toLowerCase().replace(/\\+"/g,'"').replace(/[“”"’‘'*_`\\]/g,'').replace(/\s+/g,' ').trim();
const items=o=>{const M={};for(const it of o){const u=((it.body||it).messages||[]).map(m=>m.content);const t=u[u.length-1]||'';for(const m of ('\n\n'+t).matchAll(/\n\nITEM (B\d+) \(E-ANS([\s\S]*?)(?=\n\nITEM |$)/g))M[m[1]]=m[2];}return M;};
module.exports={run,V,items,N,P};
if(require.main===module)(async()=>{for(const r of (process.argv[2]||'34852,34726,34703,34780').split(',')){const rd=JSON.parse(fs.readFileSync(P+'ex'+r+'_full.json')).data.resultData.runData;
 for(const v of ['live','SU','AU']){const M=items(await run(V[v],'Judge Enforcer Build',rd));let served=0,ok=0,bad=[];
  for(const k in M){const t=M[k];const fm=t.match(/\nTHE ANSWER IN FULL, FROM \[[^\]]*\][^:]*:\s*"([\s\S]*?)"\nTHE JUDGES' GRADES:/);if(!fm)continue;served++;const q=(t.match(/\nTHE ANSWER: "([\s\S]*?)"\n/)||[])[1]||'';
   const qw=N(q).split(' ').slice(0,8).join(' ');const verse=(t.match(/PRESSED VERSE: ([^\n]*)/)||[])[1];if(N(fm[1]).includes(qw))ok++;else bad.push(k+' ['+verse+'] quote: '+q.slice(0,90)+' | block: '+fm[1].slice(0,140).replace(/\n/g,' '));}
  console.log(r,v,'served',served,'| block holds the quote\'s opening words',ok,'| does not',bad.length);bad.forEach(b=>console.log('   ',b));}}})();
