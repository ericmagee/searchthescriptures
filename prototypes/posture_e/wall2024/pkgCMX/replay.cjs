const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};const eff=(W,n)=>rebuild(W.nodes.find(x=>x.name===n).parameters.jsCode,W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode);
const A=g(process.env.BASE),B=g(process.env.CAND);const N=process.env.NODES.split(',');const strip=o=>JSON.stringify(o).replace(/"at":"[^"]*"/g,'');
const T={};(async()=>{for(const f of fs.readdirSync('/mnt/project-files/wall2024/').filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){let rd;try{rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f)).data.resultData.runData;}catch(e){continue;}
 for(const n of N){if(!rd[n])continue;const a=await run(eff(A,n),n,rd),b=await run(eff(B,n),n,rd);const k=(a.err||b.err)?'err':(strip(a)===strip(b)?'equal':'DIFF');T[n+' '+k]=(T[n+' '+k]||0)+1;
  if(k==='err'&&!(a.err&&b.err&&a.err===b.err))console.log(f,n,'ERR differs',a.err,'|',b.err);
  if(k==='DIFF'){const x=strip(a),y=strip(b);let p=0;while(x[p]===y[p])p++;console.log(f,n,'DIFF\n A:',x.slice(p-200,p+250),'\n B:',y.slice(p-200,p+250));}}}
console.log(JSON.stringify(T,null,1));})();
