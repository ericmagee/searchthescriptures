// ASK 577 (W3): measure of the child workflow's code. Read-only. usage: node child577.js <engine.json> <child.json>  (NODE_PATH with acorn)
const fs=require('fs'),crypto=require('crypto');const acorn=require('acorn');const md=s=>crypto.createHash('md5').update(s).digest('hex').slice(0,8);
const E=JSON.parse(fs.readFileSync(process.argv[2])),C=JSON.parse(fs.readFileSync(process.argv[3]));
const code=w=>w.nodes.filter(n=>n.parameters&&typeof n.parameters.jsCode==='string').map(n=>({name:n.name,c:n.parameters.jsCode}));
const ec=code(E),cc=code(C);const fileLen=fs.statSync(process.argv[3]).size;
const sum=a=>a.reduce((x,n)=>x+n.c.length,0);const lib=a=>a.find(n=>n.name==='Shared Library');
console.log('CHILD file bytes',fileLen,'| nodes',C.nodes.length,'| code nodes',cc.length,'| code chars',sum(cc),'| Shared Library',lib(cc).c.length,'| other code',sum(cc)-lib(cc).c.length);
console.log('node types:',Object.entries(C.nodes.reduce((o,n)=>(o[n.type]=(o[n.type]||0)+1,o),{})).map(x=>x[0].split('.').pop()+' '+x[1]).join(', '));
const nonCode=C.nodes.reduce((a,n)=>a+JSON.stringify(n.parameters||{}).length,0)-cc.reduce((a,n)=>a+JSON.stringify(n.c).length,0);console.log('parameters outside jsCode (JSON chars):',nonCode,'| connections JSON',JSON.stringify(C.connections).length,'| library as a JSON string',JSON.stringify(lib(cc).c).length);
const parts=t=>({lib:t.slice(t.indexOf('\n/*LIB*/')+8,t.lastIndexOf('\n/*MAP*/')),map:t.slice(t.lastIndexOf('\n/*MAP*/')+8,t.lastIndexOf('\n/*END*/')),head:t.slice(0,t.indexOf('\n/*LIB*/'))});
const pe=parts(lib(ec).c),pc=parts(lib(cc).c);console.log('LIB engine',pe.lib.length,md(pe.lib),'child',pc.lib.length,md(pc.lib),'identical',pe.lib===pc.lib,'| MAP engine',pe.map.length,'child',pc.map.length,'| head equal',pe.head===pc.head);
const me=JSON.parse(pe.map),mc=JSON.parse(pc.map);const ke=Object.keys(me),kc=Object.keys(mc);console.log('MAP keys engine',ke.length,'child',kc.length,'| child-only',kc.filter(k=>!(k in me)).join('; ')||'none','| engine-only',ke.filter(k=>!(k in mc)).length,'| shared keys with equal entries',kc.filter(k=>k in me&&JSON.stringify(me[k])===JSON.stringify(mc[k])).length);
const used=new Set();for(const k of kc)for(const e of mc[k].p){if(typeof e==='number')used.add(e);else if(typeof e[0]==='number')for(let i=e[0];i<=e[1];i++)used.add(i);}
const L=JSON.parse(pc.lib);const usedChars=[...used].reduce((a,i)=>a+JSON.stringify(L[i]).length+1,0);console.log('LIB lines',L.length,'| lines any child MAP entry serves',used.size,'('+usedChars+' chars as stored) | lines no child entry serves',L.length-used.size,'('+(pc.lib.length-usedChars)+' chars)');
// which child nodes read the library, and which MAP keys they ask for
console.log('\nCHILD CODE NODES (other than the library):');
for(const n of cc){if(n.name==='Shared Library')continue;const reads=/\$\(\s*['"]Shared Library['"]\s*\)/.test(n.c);const keys=[...new Set([...n.c.matchAll(/\)\)\)?(?:\.([A-Za-z_$][\w$]*)|\[("[^"]+"|'[^']+')\])\s*;\s*if\(!M\)/g)].map(m=>m[1]||m[2]))];console.log(' ',n.name,'|',n.c.length,'|',md(n.c),'| reads library:',reads,keys.length?'keys '+keys.join(','):'');}
// statement-level repeats: within the child, and child against engine
const stmts=(n)=>{const pre='(async function(){\n';let ast;try{ast=acorn.parse(pre+n.c+'\n})',{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});}catch(e){return null;}const out=[];const walk=a=>{for(const st of a){if(st.type==='TryStatement'){walk(st.block.body);continue;}if(st.type==='BlockStatement'){walk(st.body);continue;}const s=(pre+n.c).slice(st.start,st.end);if(s.length>=300)out.push(s);}};walk(ast.body[0].expression.body.body);return out;};
const cs=[],esx=new Map();let fail=[];for(const n of cc){if(n.name==='Shared Library')continue;const s=stmts(n);if(!s){fail.push(n.name);continue;}s.forEach(x=>cs.push({node:n.name,x}));}
for(const n of ec){if(n.name==='Shared Library')continue;const s=stmts(n);if(!s)continue;s.forEach(x=>{if(!esx.has(x))esx.set(x,[]);esx.get(x).push(n.name);});}
const byText=new Map();cs.forEach(o=>{if(!byText.has(o.x))byText.set(o.x,[]);byText.get(o.x).push(o.node);});
let within=0,cross=0;const rows=[];for(const [x,ns] of byText){const w=(ns.length-1)*x.length;const inE=esx.get(x)||[];within+=w;if(inE.length)cross+=x.length*ns.length;rows.push({len:x.length,copies:ns.length,child:[...new Set(ns)].join(', '),engine:inE.length,engNodes:inE.slice(0,3).join(', '),head:x.slice(0,60).replace(/\s+/g,' ')});}
console.log('\nSTATEMENTS of 300+ chars in child code nodes:',cs.length,'total',cs.reduce((a,o)=>a+o.x.length,0),'| parse failures',fail.join(',')||'none');
console.log('identical repeats WITHIN the child: saving',within,'| child statements that also stand byte-identical in an engine node:',cross,'chars');
rows.sort((a,b)=>b.len*b.copies-a.len*a.copies).slice(0,14).forEach(r=>console.log('  '+r.len+' x'+r.copies+' child['+r.child+'] engine copies '+r.engine+(r.engine?' ('+r.engNodes+')':'')+' | '+r.head));
// the library in the child: parse time
const t0=process.hrtime.bigint();for(let i=0;i<20;i++){const T=lib(cc).c;JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')));}
console.log('\nloader cost here: parse of LIB and MAP, mean of 20:',Number((process.hrtime.bigint()-t0)/20n/1000n)/1000,'ms (this container; not n8n)');
