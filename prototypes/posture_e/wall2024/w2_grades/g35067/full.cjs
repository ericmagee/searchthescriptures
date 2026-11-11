const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};const eff=(W,n)=>rebuild(W.nodes.find(x=>x.name===n).parameters.jsCode,W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode);
const LW=g(process.env.BASE||'/mnt/project-files/wall2024/fetchback_live_s128.json'),OW=g(process.env.CAND);
const OLRE=/\nTHE SIDE'S OTHER LINES ON THIS VERSE[^\n]*(?:\n(?!THE JUDGES' GRADES:)[^\n]*)*/;
const msgs=o=>o.map(it=>((it.body||it).messages||[]).map(m=>typeof m.content==='string'?m.content:JSON.stringify(m.content)).join('\n'));
const split=t=>{const parts=('\n\n'+t).split(/(?=\n\nITEM [A-Z]+[0-9]+ \()/);const head=parts.shift();const it={};for(const p of parts){const k=p.match(/ITEM ([A-Z]+[0-9]+) \(/)[1];it[k]=(it[k]?it[k]+'#DUP#':'')+p.replace(/\n\nREPLY FORM[\s\S]*$/,'');}return {head,it};};
const T={nodeRuns:0,ncEq:0,ncDiff:0,items:0,missing:0,extra:0,eqRaw:0,eqStripped:0,bad:0,olDropped:0,maxCalls:0,rules:{}};
(async()=>{for(const f of fs.readdirSync('/mnt/project-files/wall2024/').filter(f=>new RegExp(process.env.ONLY||"^ex\\d+_full\\.json$").test(f)).sort()){const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f)).data.resultData.runData;
for(const n of ['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build']){if(!rd[n])continue;const a=await run(eff(LW,n),n,rd),b=await run(eff(OW,n),n,rd);if(a.err||b.err){console.log('ERR',f,n,a.err||b.err);continue;}T.nodeRuns++;
 const nca=JSON.stringify((a[0]&&a[0].not_checked)||[]),ncb=JSON.stringify((b[0]&&b[0].not_checked)||[]);nca===ncb?T.ncEq++:(T.ncDiff++,console.log('NC DIFF',f,n,nca,ncb));
 T.maxCalls=Math.max(T.maxCalls,b.length);
 const A={},B={};msgs(a).forEach(t=>Object.assign(A,split(t).it));msgs(b).forEach(t=>Object.assign(B,split(t).it));let ol=0,dropped=0;
 for(const k in A){T.items++;const r=(A[k].match(/ITEM [A-Z]+[0-9]+ \(([A-Z0-9-]+)/)||[])[1];T.rules[r]=(T.rules[r]||0)+1;if(!(k in B)){T.missing++;console.log('MISSING',f,n,k);continue;}
  if(A[k]===B[k]){T.eqRaw++;}else if(A[k]===B[k].replace(OLRE,'')){T.eqStripped++;ol++;}else{T.bad++;if(T.bad<4)console.log('BAD',f,n,k,'\nA:',A[k].slice(0,300),'\nB:',B[k].slice(0,300));}}
 for(const k in B)if(!(k in A)){T.extra++;console.log('EXTRA',f,n,k);}
 const hA=msgs(a).map(t=>split(t).head),hB=msgs(b).map(t=>split(t).head);const ha=new Set(hA.map(h=>h.length)),hb=new Set(hB.map(h=>h.length));
 console.log(f.slice(2,7),n.split(' ')[0],'calls',a.length,'->',b.length,'items',Object.keys(A).length,'withOL',ol,'nc',JSON.parse(nca).length,JSON.parse(ncb).length,'headLens',[...ha].join('/'),'->',[...hb].join('/'));}}
console.log('TOTAL',JSON.stringify(T));})();
