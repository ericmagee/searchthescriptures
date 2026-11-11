// W2: rev 2 output equals rev 1 output wherever rev 1 leaves nothing newly unchecked.
const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};const eff=(W,n)=>rebuild(W.nodes.find(x=>x.name===n).parameters.jsCode,W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode);
const A=g('pkgA64/parent_s128_A64_O1NG.json'),B=g('pkgA64/parent_s128_A64_O1NH.json');
(async()=>{for(const N of ['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build']){const a=eff(A,N),b=eff(B,N);for(const r of fs.readdirSync('/mnt/project-files/wall2024/').filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+r));const rd=(X.data||X).resultData.runData;if(!rd[N])continue;
 const S=o=>JSON.stringify(o,(k,v)=>k==='olt'?undefined:v);const x=S(await run(a,N,rd)),y=S(await run(b,N,rd));console.log(N,r,x===y?'EQUAL':'DIFFERS');}}})();
