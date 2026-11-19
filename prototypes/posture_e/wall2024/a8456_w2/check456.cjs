// Checks for the read-line fix. Usage: node a8456_w2/check456.cjs <live.json> <target.json> [...pairs]
// C1 every node other than the changed stubs is JSON-equal; connections and settings equal. C2 in each changed stub only the first
// line differs, and the old line's text is a prefix of the new (names only added). C3 rebuild(new)==rebuild(old). C4 after the change
// every form 3 stub names every node its rebuilt source reads, or holds $(String()). C5 every added name is a node of the workflow.
const fs=require('fs');const {rebuild}=require('../pkgLIB/unpack.cjs');const {needs}=require('../pkgLIB/runner_model.cjs');
const names=l=>new Set([...l.matchAll(/\$\(("(?:[^"\\]|\\.)*")\)/g)].map(m=>JSON.parse(m[1])));
const a=process.argv.slice(2);let fail=0;
for(let i=0;i<a.length;i+=2){const L=JSON.parse(fs.readFileSync(a[i],'utf8')),T=JSON.parse(fs.readFileSync(a[i+1],'utf8'));
 const LN=L.nodes||L.workflow.nodes,TN=T.nodes||T.workflow.nodes;const ln=new Map(LN.map(x=>[x.name,x]));const all=new Set(LN.map(x=>x.name));
 const lib=LN.find(x=>x.name==='Shared Library').parameters.jsCode;let same=0,ch=[],uncov=[];
 if(LN.length!==TN.length){console.log('node count differs');fail++;}
 for(const k of ['connections','settings'])if(JSON.stringify(L[k]??L.workflow?.[k])!==JSON.stringify(T[k]??T.workflow?.[k])){console.log(k,'differs');fail++;}
 for(const t of TN){const l=ln.get(t.name);if(!l){console.log('new node',t.name);fail++;continue;}
  if(JSON.stringify(l)===JSON.stringify(t)){same++;}else{
   const o=l.parameters.jsCode,n=t.parameters.jsCode;const lc={...l,parameters:{...l.parameters,jsCode:''}},tc={...t,parameters:{...t.parameters,jsCode:''}};
   const ok2=JSON.stringify(lc)===JSON.stringify(tc)&&o.slice(o.indexOf('\n'))===n.slice(n.indexOf('\n'))&&n.slice(0,n.indexOf('\n')).startsWith(o.slice(0,o.indexOf('\n')-1));
   const ok3=rebuild(o,lib)===rebuild(n,lib);
   const add=[...names(n.slice(0,n.indexOf('\n')))].filter(z=>!names(o.slice(0,o.indexOf('\n'))).has(z));const ok5=add.every(z=>all.has(z));
   ch.push(t.name+' C2 '+(ok2?'ok':'FAIL')+' C3 '+(ok3?'ok':'FAIL')+' C5 '+(ok5?'ok':'FAIL'));if(!(ok2&&ok3&&ok5))fail++;}
  const s=(t.parameters||{}).jsCode;if(typeof s==='string'&&t.name!=='Shared Library'&&s.includes('\nreturn await new Function(')){
   const line=s.startsWith('if(false){')?s.slice(0,s.indexOf('\n')):'';if(line.includes('$(String())'))continue;
   const h=names(line);const m=[...needs(rebuild(s,lib)).nodes].filter(z=>!h.has(z));if(m.length)uncov.push(t.name+': '+m.join(', '));}}
 console.log(a[i+1].split('/').pop(),'| nodes',TN.length,'| unchanged',same,'| changed',ch.length);ch.forEach(z=>console.log('  '+z));
 console.log('  C4 stubs with an unnamed read:',uncov.length,uncov.join(' | '));if(uncov.length)fail++;}
console.log(fail?'FAIL '+fail:'ALL PASS');process.exit(fail?1:0);
