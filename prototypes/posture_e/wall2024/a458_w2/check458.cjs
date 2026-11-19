// Checks for ASK 458 (W2). Usage: node a458_w2/check458.cjs <base eng> <target eng> <base child> <target child>
// C1 no api.deepseek.com request, (steps still named deepseek are counted; ASK 455 D renames them), no removed name left in nodes or connections.
// C2 every kept node keeps id, type, position, credentials; lists every kept node whose parameters changed; lists every edge removed or added.
// C3 every pkgLIB stub rebuilds at its byte count; Library Check (sha256 of the lines equals the header sha); every edited Code node parses.
const fs=require('fs'),crypto=require('crypto');const {rebuild}=require('../pkgLIB/unpack.cjs');
const a=process.argv.slice(2);let fail=0;const B=[0,2].map(i=>JSON.parse(fs.readFileSync(a[i]))),T=[1,3].map(i=>JSON.parse(fs.readFileSync(a[i])));
const edges=w=>{const s=new Set();for(const [src,o] of Object.entries(w.connections))(o.main||[]).forEach((outs,k)=>(outs||[]).forEach(c=>s.add(src+' #'+k+' -> '+c.node)));return s;};
for(let k=0;k<2;k++){const tag=['engine','child'][k],b=B[k],t=T[k];const tn=new Set(t.nodes.map(n=>n.name));
 const removed=b.nodes.filter(n=>!tn.has(n.name)).map(n=>n.name);console.log(tag,'C1 nodes',b.nodes.length,'->',t.nodes.length,'removed',removed.length+':',removed.join('; '));
 const ds=t.nodes.filter(n=>JSON.stringify(n.parameters||{}).includes('api.deepseek.com'));const dn=[];const dr=t.nodes.filter(n=>/deepseek/i.test(n.name)).length;
 const all=JSON.stringify({n:t.nodes,c:t.connections});const left=removed.filter(x=>all.includes(JSON.stringify(x).slice(1,-1)+"'")||all.includes('\\"'+x+'\\"')||all.includes('"'+x+'"'));
 console.log(tag,'C1 steps posting to api.deepseek.com:',ds.length,'| steps still named deepseek (none posts to api.deepseek.com; ASK 455 D renames them):',dr,'| removed names still quoted anywhere:',left.length,left.join('; '));
 if(ds.length||dn.length||left.length)fail++;
 const bm=new Map(b.nodes.map(n=>[n.name,n]));let meta=0;const ch=[];
 for(const n of t.nodes){const o=bm.get(n.name);if(!o){console.log(tag,'C2 new node',n.name);fail++;continue;}
  if(o.id!==n.id||o.type!==n.type||JSON.stringify(o.position)!==JSON.stringify(n.position)||JSON.stringify(o.credentials)!==JSON.stringify(n.credentials)||o.disabled!==n.disabled||o.typeVersion!==n.typeVersion)meta++;
  if(JSON.stringify(o.parameters)!==JSON.stringify(n.parameters))ch.push(n.name);}
 console.log(tag,'C2 kept nodes with id/type/version/position/credentials changed:',meta,'| kept nodes whose parameters changed',ch.length+':',ch.join('; '));if(meta)fail++;
 const eb=edges(b),et=edges(t);const gone=[...eb].filter(e=>!et.has(e)),add=[...et].filter(e=>!eb.has(e));
 const gk=gone.filter(e=>!removed.some(r=>e.startsWith(r+' #')||e.endsWith('-> '+r)));
 console.log(tag,'C2 edges removed',gone.length,'(between kept nodes:',gk.length+(gk.length?': '+gk.join(' | '):'')+') | edges added',add.length+':');add.forEach(e=>console.log('   +',e));if(gk.length)fail++;
 const libn=t.nodes.find(n=>n.name==='Shared Library');const lib=libn.parameters.jsCode;
 const iL=lib.indexOf('\n/*LIB*/'),iM=lib.lastIndexOf('\n/*MAP*/');const L=JSON.parse(lib.slice(iL+8,iM));const hs=(lib.match(/library sha ([0-9a-f]{16}), (\d+) lines/)||[]);
 const sh=crypto.createHash('sha256').update(JSON.stringify(L)).digest('hex').slice(0,16);console.log(tag,'C3 Library Check: lines sha',sh,'header',hs[1],'lines',L.length,'header',hs[2],sh===hs[1]&&+hs[2]===L.length?'PASS':'FAIL');if(!(sh===hs[1]&&+hs[2]===L.length))fail++;
 let st=0,bad=[],parsed=0,perr=[];
 for(const n of t.nodes){const s=(n.parameters||{}).jsCode;if(typeof s!=='string'||n.name==='Shared Library')continue;let src=s;
  if(s.includes('\nreturn await new Function(')){st++;try{src=rebuild(s,lib);}catch(e){bad.push(n.name+': '+e.message);continue;}}
  if(!ch.includes(n.name)&&!s.includes('\nreturn await new Function('))continue;
  try{new Function('$','$input','$execution','$json','$items','$now','$workflow','require','return (async()=>{\n'+src+'\n})();');parsed++;}catch(e){perr.push(n.name+': '+e.message);}}
 console.log(tag,'C3 stubs',st,'rebuild failures',bad.length,bad.join(' | '),'| code parsed (changed nodes and all stub sources)',parsed,'errors',perr.length,perr.join(' | '));if(bad.length||perr.length)fail++;
 for(const n of t.nodes){if(!ch.includes(n.name)||typeof (n.parameters||{}).jsCode==='string')continue;const P=JSON.stringify(n.parameters);const ex=[...P.matchAll(/=\{\{([\s\S]*?)\}\}/g)];
  for(const m of ex){try{new Function('$','return ('+JSON.parse('"'+m[1]+'"')+');');}catch(e){console.log(tag,'C3 expression of',n.name,'does not parse:',e.message);fail++;}}
  console.log(tag,'C3 expressions of',n.name,'parsed:',ex.length);}}
console.log(fail?'FAIL '+fail:'ALL PASS');process.exit(fail?1:0);
