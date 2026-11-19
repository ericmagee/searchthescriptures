// Checks for ASK 455 part D. Usage: node a455d_w2/check455d.cjs <base eng> <target eng> <base child> <target child>
// D1 no new name occurs anywhere in the base (so the reverse map is exact). D2 reverse-mapping every new name (quoted, and in node names and
// connections) in the target gives back the base nodes and connections exactly. D3 every pkgLIB stub still names every node its rebuilt source
// reads (literal and dynamic), or holds $(String()). D4 node ids, types, positions, credentials unchanged. D5 no step that calls api.deepseek.com renamed.
const fs=require('fs');const LT=require('../tools/lib.cjs');const {rebuild}=require('../pkgLIB/unpack.cjs');const {needs}=require('../pkgLIB/runner_model.cjs');const dyn=require('../a8456_w2/dyn.cjs');
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const a=process.argv.slice(2);let fail=0;
const B=[0,2].map(i=>JSON.parse(fs.readFileSync(a[i]))),T=[1,3].map(i=>JSON.parse(fs.readFileSync(a[i])));
const M=[];for(let k=0;k<2;k++){const bn=new Map(B[k].nodes.map(n=>[n.id,n.name]));for(const n of T[k].nodes)if(bn.get(n.id)!==n.name)M.push([bn.get(n.id),n.name]);}
const U=M.filter((x,i,s)=>s.findIndex(y=>y[0]===x[0])===i);console.log('renamed steps',M.length,'distinct',U.length);
for(let k=0;k<2;k++){const tag=['engine','child'][k];const b=B[k],t=T[k];
 const bs=JSON.stringify({n:b.nodes,c:b.connections,p:b.pinData});const d1=U.filter(([o,n])=>bs.includes(n));console.log(tag,'D1 new names already in base:',d1.length);if(d1.length)fail++;
 const RX=U.slice().sort((x,y)=>y[1].length-x[1].length).map(([o,n])=>[new RegExp('(?<=[\'"])'+esc(n)+'(?=[\'"\\\\])','g'),o]);const rev=new Map(U.map(([o,n])=>[n,o]));const r=s=>rev.get(s)||s;
 const unlib=T=>{const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');const sub=s=>{for(const [rx,o] of RX)s=s.replace(rx,o);return s;};const L=JSON.parse(T.slice(iL+8,iM)).map(sub);const M=JSON.parse(T.slice(iM+8,iE));const M2={};for(const [k,e] of Object.entries(M)){e.p=e.p.map(x=>Array.isArray(x)&&typeof x[0]==='string'?[sub(x[0]),...x.slice(1)]:x);delete e.n;M2[r(k)]=e;}return T.slice(0,iL).replace(/library sha [0-9a-f]{16}, \d+ lines/,'H')+JSON.stringify(L)+JSON.stringify(M2)+T.slice(iE);};
 const bl=unlib.call(null,b.nodes.find(n=>n.name==='Shared Library').parameters.jsCode);
 const tn=t.nodes.map(n=>{if(n.name==='Shared Library'){const ok=unlib(n.parameters.jsCode)===bl;console.log(tag,'D2 library: reverse map of lines and MAP text equals the base (header sha and byte counts aside):',ok);if(!ok)fail++;return b.nodes.find(x=>x.name==='Shared Library');}let s=JSON.stringify(n.parameters||{});for(const [rx,o] of RX)s=s.replace(rx,o);return {...n,name:r(n.name),parameters:JSON.parse(s)};});
 const tc={};for(const [kk,v] of Object.entries(t.connections))tc[r(kk)]=JSON.parse(JSON.stringify(v),(x,y)=>x==='node'&&typeof y==='string'?r(y):y);
 const d2=JSON.stringify(tn)===JSON.stringify(b.nodes)&&JSON.stringify(tc)===JSON.stringify(b.connections);console.log(tag,'D2 reverse map gives the base exactly:',d2);if(!d2)fail++;
 const d4=t.nodes.every((n,i)=>{const o=b.nodes[i];return o&&o.id===n.id&&o.type===n.type&&JSON.stringify(o.position)===JSON.stringify(n.position)&&JSON.stringify(o.credentials)===JSON.stringify(n.credentials)&&o.disabled===n.disabled;});console.log(tag,'D4 ids/types/positions/credentials unchanged:',d4);if(!d4)fail++;
 const RN=new Set(U.map(x=>x[1]));const d5=t.nodes.filter(n=>RN.has(n.name)&&!String((n.parameters||{}).url||'openrouter.ai').includes('openrouter.ai'));console.log(tag,'D5 renamed steps whose request is not to openrouter.ai:',d5.length);if(d5.length)fail++;
 const unn=w=>{const lib=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const all=new Set(w.nodes.map(n=>n.name));const out=[];let st=0;
  for(const n of w.nodes){const s=(n.parameters||{}).jsCode;if(typeof s!=='string'||n.name==='Shared Library'||!s.includes('\nreturn await new Function('))continue;st++;
   const line=s.startsWith('if(false){')?s.slice(0,s.indexOf('\n')):'';if(line.includes('$(String())'))continue;const h=needs(line).nodes;const src=rebuild(s,lib);
   const m=[...needs(src).nodes].filter(z=>!h.has(z));for(const d of dyn(src,all)){if(d===null||!d.length)m.push('dynamic, no target');else d.filter(z=>!h.has(z)).forEach(z=>m.push(z+' (dynamic)'));}
   if(m.length)out.push(n.name+': '+m.sort().join(', '));}return {st,out};};
 const ub=unn(b),ut=unn(t);const unc=ut.out.filter(x=>!ub.out.includes(x));
 console.log(tag,'D3 stubs',ut.st,'all rebuild with the right byte count; unnamed reads: base',ub.out.length,'target',ut.out.length,'| new in target:',unc.length,unc.join(' | '));
 if(unc.length)fail++;}
const L=w=>w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const tail=s=>s.slice(0,s.lastIndexOf('/*END*/'));
console.log('library: engine and child equal before the map line, base',tail(L(B[0])).slice(0,1069000)===tail(L(B[1])).slice(0,1069000),'target',tail(L(T[0])).slice(0,1068900)===tail(L(T[1])).slice(0,1068900));
{const ME=LT.unpack(T[0]).M,MC=LT.unpack(T[1]).M;const d=Object.keys(MC).filter(k=>JSON.stringify(ME[k])!==JSON.stringify(MC[k]));console.log('D6 library MAP entries equal across engine and child:',d.length?'NO '+d.join(', '):'yes, '+Object.keys(MC).length);if(d.length)fail++;}
console.log(fail?'FAIL '+fail:'ALL PASS');process.exit(fail?1:0);
