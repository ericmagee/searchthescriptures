// pkgCPR replay: s138 against the CPR parent, D4 Build and C4 Build (and C4G Build fed the new C4 Build) on stored exports.
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');
const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const A=un(process.argv[2]),B=un(process.argv[3]);const code=(W,n)=>W.nodes.find(x=>x.name===n).parameters.jsCode;
const T=c=>typeof c==='string'?c:(c||[]).map(x=>x.text||'').join('');
const ADD=' Narrowing or conceding carries no conduct penalty';
(async()=>{for(const f of process.argv.slice(4)){const ex=JSON.parse(fs.readFileSync(f,'utf8'));const rd=ex.data.resultData.runData;const nm=f.split('/').pop().replace('_full.json','');
 for(const n of ['D4 Build','C4 Build']){if(!rd[n]){console.log(nm,n,'not run');continue}
  const a=await run(code(A,n),n,rd),b=await run(code(B,n),n,rd);if(a.err||b.err){console.log(nm,n,'ERR',a.err||'',b.err||'');continue}
  const ca=a[0].call,cb=b[0].call;if(!ca||!cb){console.log(nm,n,'no call (fam)',JSON.stringify(Object.keys(a[0])));continue}
  const ba=ca.body,bb=cb.body;const sysEq=JSON.stringify(ba.system)===JSON.stringify(bb.system);
  const ma=ba.messages||[],mb=bb.messages||[];let diffIdx=[];ma.forEach((m,i)=>{if(JSON.stringify(m)!==JSON.stringify(mb[i]))diffIdx.push(i)});
  const ta=T(ma[ma.length-1].content),tb=T(mb[mb.length-1].content);const i=tb.indexOf(ADD);const removed=i>=0?tb.slice(0,i)+tb.slice(i+418):tb;
  const otherKeys=Object.keys({...ca,...cb}).filter(k=>k!=='body'&&JSON.stringify(ca[k])!==JSON.stringify(cb[k]));
  const restA=JSON.stringify(a.map(x=>({...x,call:undefined}))),restB=JSON.stringify(b.map(x=>({...x,call:undefined})));
  console.log(nm,'|',n,'| fam',ca.fam,'| system equal',sysEq,'| messages differing',JSON.stringify(diffIdx),'of',ma.length,'| last message chars',ta.length,'->',tb.length,'(+'+(tb.length-ta.length)+')','| sentences found',tb.split(ADD).length-1,'| new minus the sentences equals old',removed===ta,'| other call keys differ',JSON.stringify(otherKeys),'| other output fields equal',restA===restB);
 }}})();
