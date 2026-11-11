// W2: pkgEAF SU and AU on s127: the edited Judge Enforcer Build effective source and stored replays (Judge Enforcer Build) equal to the graded s126 builds.
const fs=require('fs'),cr=require('crypto');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};const eff=(W,n)=>rebuild(W.nodes.find(x=>x.name===n).parameters.jsCode,W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode);
const L7=g('/mnt/project-files/wall2024/fetchback_live_s127.json'),L6=g('/mnt/project-files/wall2024/fetchback_live_s126.json');
(async()=>{for(const v of ['SU','AU']){const f7='pkgEAF/parent_s127_EAF_'+v+'.json';const P7=g(f7),P6=g('pkgEAF/parent_s126_EAF_'+v+'.json');
 const sha=cr.createHash('sha256').update(fs.readFileSync(f7)).digest('hex').slice(0,16);
 // the edit itself: diff of live->package effective source must be the same on s126 and s127
 const nodes=['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build'];let same=true;
 for(const n of nodes){const a6=eff(L6,n),b6=eff(P6,n),a7=eff(L7,n),b7=eff(P7,n);const d=(a,b)=>{let i=0;while(a[i]===b[i])i++;let j=0;while(j<a.length-i&&a[a.length-1-j]===b[b.length-1-j])j++;return [a.slice(i,a.length-j),b.slice(i,b.length-j)];};
  const x=d(a6,b6),y=d(a7,b7);if(x[0]!==y[0]||x[1]!==y[1])same=false;}
 let n=0,eq=0;const S=o=>o&&o.err?JSON.stringify({err:o.err}):JSON.stringify(o);
 for(const r of ['34852','34726','34703','34780']){const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex'+r+'_full.json'));const rd=(X.data||X).resultData.runData;n++;
  if(S(await run(eff(P6,'Judge Enforcer Build'),'Judge Enforcer Build',rd))===S(await run(eff(P7,'Judge Enforcer Build'),'Judge Enforcer Build',rd)))eq++;else console.log('DIFF',v,r);}
 console.log(v,'s127 file sha',sha,'| the edit to all 3 nodes is the same text as on s126:',same,'| Judge Enforcer Build replay s126 pkg == s127 pkg:',eq+'/'+n);}})();
