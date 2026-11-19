// ASK 473: one request-body helper. The 4 forms of __orc (14 nodes and library line used by Alternate Build, R2 Alternate Build) become one library entry ORC (__ORC),
// read the way REFP is read; each caller keeps its own behaviour as options {fam, mimo, cache}. No request body changes (test473.cjs). Offline.
// usage: node a473_w4/build473.cjs ENGINE.json CHILD.json OUT_ENGINE.json OUT_CHILD.json
const fs=require('fs'),cr=require('crypto'),path=require('path');const acorn=require(path.join(__dirname,'../tools/node_modules/acorn'));const T=require('../tools/lib.cjs');
const [EI,CI,EO,CO]=process.argv.slice(2);const E=JSON.parse(fs.readFileSync(EI)),C=JSON.parse(fs.readFileSync(CI));
const U=T.unpack(E),UC=T.unpack(C);const L=U.L,M=U.M,MC=UC.M;
if(UC.hdr!==U.hdr||JSON.stringify(UC.L)!==JSON.stringify(L)||UC.tail!==U.tail)throw new Error('engine and child library lines differ');
const F1="const __orc=(b,fam,model,key)=>{if(fam!=='openrouter'||!b||!Array.isArray(b.messages))return b;const o={...b,session_id:String(key).slice(0,128)};if(/^(?:google|qwen)\\//.test(String(model)))o.messages=b.messages.map(m=>m.role==='system'&&typeof m.content==='string'?{role:'system',content:[{type:'text',text:m.content,cache_control:{type:'ephemeral'}}]}:m);return o;};";
const F2="const __orc=(b,fam,model,key)=>{if(fam!=='openrouter'||!b||!Array.isArray(b.messages))return b;const o={...b,session_id:String(key).slice(0,128)};if(/^xiaomi\\/mimo-v2\\.6-pro$/.test(String(model))){o.max_tokens=131072;}  if(/^(?:google|qwen)\\//.test(String(model)))o.messages=b.messages.map(m=>m.role==='system'&&typeof m.content==='string'?{role:'system',content:[{type:'text',text:m.content,cache_control:{type:'ephemeral'}}]}:m);return o;};";
const F3="const __orc=(b,model,key)=>{if(!b||!Array.isArray(b.messages))return b;const o={...b,session_id:String(key).slice(0,128)};if(/^xiaomi\\/mimo-v2\\.6-pro$/.test(String(model))){o.max_tokens=131072;}  return o;};";
const ORC="const __ORC=(b,fam,model,key,x)=>{x=x||{};if((x.fam!==false&&fam!=='openrouter')||!b||!Array.isArray(b.messages))return b;const o={...b,session_id:String(key).slice(0,128)};if(x.mimo&&/^xiaomi\\/mimo-v2\\.6-pro$/.test(String(model))){o.max_tokens=131072;}if(x.cache&&/^(?:google|qwen)\\//.test(String(model)))o.messages=b.messages.map(m=>m.role==='system'&&typeof m.content==='string'?{role:'system',content:[{type:'text',text:m.content,cache_control:{type:'ephemeral'}}]}:m);return o;};";
const READ="const __ORC=(T=>{const L=JSON.parse(T.slice(T.indexOf('\\n/*LIB*/')+8,T.lastIndexOf('\\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\\n/*MAP*/')+8,T.lastIndexOf('\\n/*END*/'))).ORC;if(!M)throw new Error('pkgORC: the Shared Library holds no ORC entry');const S=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\\n')).join('\\n');if(S.length!==M.n)throw new Error('pkgORC: rebuilt ORC is '+S.length+', expected '+M.n);return new Function(S+'\\nreturn __ORC;')();})($('Shared Library').params.jsCode);";
const W1="const __orc=(b,fam,model,key)=>__ORC(b,fam,model,key,{mimo:false,cache:true});";
const W2="const __orc=(b,fam,model,key)=>__ORC(b,fam,model,key,{mimo:true,cache:true});";
const W3="const __orc=(b,model,key)=>__ORC(b,'',model,key,{fam:false,mimo:true,cache:false});";
const FORMS=[[F1,W1],[F2,W2],[F3,W3]];
const P=s=>acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});
const before={};for(const k of Object.keys(M))before[k]=T.rb(L,M[k]);
const usedB=new Set();for(const k of Object.keys(M))for(const e of M[k].p){if(typeof e==='number')usedB.add(e);else if(typeof e[0]==='number')for(let i=e[0];i<=e[1];i++)usedB.add(i);}
// 1. node callers
const changed=[];
for(const n of E.nodes){if(n.name==='Shared Library'||typeof (n.parameters||{}).jsCode!=='string')continue;const j=n.parameters.jsCode;if(!/const __orc=/.test(j))continue;
 const hit=FORMS.filter(([f])=>j.split(f).length===2);if(hit.length!==1)throw new Error(n.name+': __orc is not exactly one known form');
 if((j.match(/const __orc=/g)||[]).length!==1)throw new Error(n.name+': more than one __orc');if(/const __ORC=/.test(j))throw new Error(n.name+': already has __ORC');
 n.parameters.jsCode=j.replace(hit[0][0],()=>READ+hit[0][1]);P('(async function(){'+n.parameters.jsCode+'\n})');changed.push(n.name+' form '+(FORMS.indexOf(hit[0])+1));}
if(changed.length!==14)throw new Error('expected 14 caller nodes, got '+changed.length);
for(const n of C.nodes)if(n.name!=='Shared Library'&&/const __orc=/.test((n.parameters||{}).jsCode||''))throw new Error('child holds __orc: '+n.name);
// 2. library: the ORC line, the ORC MAP entry in engine and child, and the 2 library stubs
const LO=L.findIndex(x=>x.startsWith(F2.slice(0,-1).replace(/  if\(\/\^\(\?:google/,'')))
const lib=L.map((x,i)=>i).filter(i=>L[i].includes('const __orc='));if(lib.length!==1)throw new Error('library __orc lines: '+lib);const LI=lib[0];
const OI=L.length;L.push(ORC);const ORCE={n:ORC.length,p:[OI]};M.ORC=ORCE;MC.ORC=JSON.parse(JSON.stringify(ORCE));
const libStubs=Object.keys(M).filter(k=>M[k].p.some(e=>e===LI||(Array.isArray(e)&&typeof e[0]==='number'&&e[0]<=LI&&LI<=e[1])));
if(JSON.stringify(libStubs.slice().sort())!==JSON.stringify(['Alternate Build','R2 Alternate Build']))throw new Error('library __orc users: '+libStubs);
const libForm=L[LI];if(!/o\.max_tokens=131072/.test(libForm)||!/cache_control/.test(libForm)||!/fam!=='openrouter'/.test(libForm))throw new Error('library __orc is not form 2 behaviour');
for(const MM of [M,MC])for(const k of libStubs){if(!MM[k])continue;const np=[];for(const e of MM[k].p){if(e===LI){np.push(OI,[W2]);continue;}if(Array.isArray(e)&&typeof e[0]==='number'&&e[0]<=LI&&LI<=e[1]){if(e[0]<LI)np.push(e[0]===LI-1?e[0]:[e[0],LI-1]);np.push(OI,[W2]);if(LI<e[1])np.push(LI+1===e[1]?e[1]:[LI+1,e[1]]);continue;}np.push(e);}MM[k].p=np;MM[k].n=T.rb(L,MM[k]).length;}
const news={};for(const k of libStubs){news[k]=T.rb(L,M[k]);const want=before[k].replace(libForm,()=>ORC+'\n'+W2);if(news[k]!==want)throw new Error(k+': stub rebuild is not the planned text');P(news[k]);}
// 3. drop library lines this change leaves unread; renumber
const used=new Set();for(const k of Object.keys(M))for(const e of M[k].p){if(typeof e==='number')used.add(e);else if(typeof e[0]==='number')for(let i=e[0];i<=e[1];i++)used.add(i);}
const keep=L.map((x,i)=>used.has(i)||(i<OI&&!usedB.has(i)));const nmap=[];let j=0;L.forEach((x,i)=>{if(keep[i])nmap[i]=j++;});const dropped=L.map((x,i)=>i).filter(i=>!keep[i]);
const L2=L.filter((x,i)=>keep[i]);
for(const MM of [M,MC])for(const k of Object.keys(MM))MM[k].p=MM[k].p.map(e=>typeof e==='number'?nmap[e]:typeof e[0]==='number'?[nmap[e[0]],nmap[e[1]]]:e);
for(const k of Object.keys(M)){const s=T.rb(L2,M[k]);const want=k==='ORC'?ORC:(news[k]||before[k]);if(s!==want)throw new Error(k+': rebuild differs');if(s.length!==M[k].n)throw new Error(k+': n');}
for(const k of Object.keys(MC))if(T.rb(L2,MC[k])!==T.rb(L2,M[k]))throw new Error('child '+k+' differs');
const LJ=JSON.stringify(L2);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L2.length+' lines');if(h2===U.hdr)throw new Error('hdr');
E.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
C.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MC)+U.tail;
fs.writeFileSync(EO,JSON.stringify(E));fs.writeFileSync(CO,JSON.stringify(C));
console.log('callers',changed.length,changed.join('; '));console.log('library stubs',libStubs.join(', '),'| ORC line',OI,'->',nmap[OI],'| lines',L.length-1,'->',L2.length,'| dropped',JSON.stringify(dropped),'| lib sha',U.hdr.match(/library sha (\w+)/)[1],'->',lsha);
for(const i of dropped)console.log(' dropped L'+i+': '+JSON.stringify(L[i]).slice(0,160));
