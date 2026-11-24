// ASK 576 test (W1). node test576.cjs <base_engine> <target_engine> <base_child> <target_child>
const fs=require('fs');const acorn=require('/home/claude/searchthescriptures/node_modules/acorn');const [,,BE,TE,BC,TC]=process.argv;const J=f=>JSON.parse(fs.readFileSync(f));
const be=J(BE),te=J(TE),bc=J(BC),tc=J(TC);let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++;};
const GROUPS={'IMP B Build':['C1B Build','D2B Build','C2B Build','D3B Build','C3B Build','D4B Build','C4B Build'],'IMP B Extract':['C1B Extract','D2B Extract','D4B Extract'],'IMP C4B Extract':['C4B Extract']};
const NODES=Object.values(GROUPS).flat();
function cut(s,name){const pre='(async function(){\n';const ast=acorn.parse(pre+s+'\n})',{ecmaVersion:'latest'});const hits=[];const walk=a=>{for(const st of a){if(st.type==='TryStatement'){walk(st.block.body);continue}if(st.type==='VariableDeclaration'&&st.declarations.some(d=>d.id.name===name))hits.push(st)}};walk(ast.body[0].expression.body.body);if(hits.length!==1)return null;const h=hits[0];return {i:h.start-pre.length,e:h.end-pre.length,t:s.slice(h.start-pre.length,h.end-pre.length)};}
const code=(w,n)=>w.nodes.find(x=>x.name===n).parameters.jsCode;const SLt=code(te,'Shared Library');
const lib=c=>({L:JSON.parse(c.slice(c.indexOf('\n/*LIB*/')+8,c.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(c.slice(c.lastIndexOf('\n/*MAP*/')+8,c.lastIndexOf('\n/*END*/')))});
const LB=lib(code(be,'Shared Library')),LT=lib(SLt),CB=lib(code(bc,'Shared Library')),CT=lib(code(tc,'Shared Library'));
const src=(X,k)=>X.M[k].p.map(e=>typeof e==='number'?X.L[e]:typeof e[0]==='string'?e[0]:X.L.slice(e[0],e[1]+1).join('\n')).join('\n');
console.log('== A. Structure');
const ch=(b,t)=>b.nodes.filter(n=>JSON.stringify(n.parameters)!==JSON.stringify((t.nodes.find(x=>x.name===n.name)||{}).parameters)).map(n=>n.name);
const cE=ch(be,te),cC=ch(bc,tc);ok(cE.length===12&&cE.includes('Shared Library')&&NODES.every(n=>cE.includes(n)),'engine: only the 11 IMP nodes and the Shared Library change ('+cE.length+')');
ok(cC.length===1&&cC[0]==='Shared Library','child: only the Shared Library changes');
ok(JSON.stringify(be.connections)===JSON.stringify(te.connections)&&JSON.stringify(bc.connections)===JSON.stringify(tc.connections),'connections unchanged');
ok(JSON.stringify(LB.L)===JSON.stringify(LT.L)&&JSON.stringify(CB.L)===JSON.stringify(CT.L),'LIB unchanged in engine and child (LIB sha unchanged)');
ok(Object.keys(LB.M).every(k=>JSON.stringify(LB.M[k])===JSON.stringify(LT.M[k]))&&Object.keys(CB.M).every(k=>JSON.stringify(CB.M[k])===JSON.stringify(CT.M[k])),'every existing MAP entry unchanged, engine and child');
const nk=Object.keys(LT.M).filter(k=>!LB.M[k]);ok(nk.length===3&&nk.every(k=>GROUPS[k]&&JSON.stringify(LT.M[k])===JSON.stringify(CT.M[k])),'3 new MAP entries, the same in engine and child: '+nk.join(', '));
for(const n of ['C2B Extract','D3B Extract','C3B Extract'])ok(code(be,n)===code(te,n),n+': nested IMP (inside __O423) untouched');
console.log('== B. Byte for byte, per node');
for(const [k,ns] of Object.entries(GROUPS))for(const n of ns){const b=code(be,n),t=code(te,n);const c=cut(b,'IMP');const pre=b.slice(0,c.i),post=b.slice(c.e);
 ok(t.startsWith(pre)&&t.endsWith(post)&&t.slice(pre.length,t.length-post.length).startsWith("const IMP=(T=>{")&&t.includes("['"+k+"']"),n+': only the IMP statement is replaced, by the '+k+' loader');
 ok(src(LT,k)===c.t&&LT.M[k].n===c.t.length,n+': served text equals the base IMP statement byte for byte ('+c.t.length+')');}
console.log('== C. Behaviour on run 41822 rounds (old statement vs loader)');
const R=J('/mnt/project-files/ask557/w4/build/rounds41822.json');const ALL=Object.values(R).join('\n\n');
const $=SL=>n=>{if(n==='Shared Library')return {params:{jsCode:SL}};throw new Error('unexpected $ '+n)};
const runLoader=(n,SL)=>{const t=code(te,n);const c=cut(t,'IMP');return new Function('$',c.t+'\nreturn IMP;')($(SL));};
const runOld=n=>{const c=cut(code(be,n),'IMP');return new Function(c.t+'\nreturn IMP;')();};
const tryJ=f=>{try{return JSON.stringify(f(),(k,v)=>v instanceof RegExp?String(v):v)}catch(e){return 'THROW '+e.message}};
const calls=I=>{const o=[];o.push(String(I.AB),String(I.GIVE),Object.keys(I).join(','));for(const [r,x] of Object.entries(R)){o.push(tryJ(()=>I.blocks(x)));for(const l of x.split('\n'))if(l.trim())o.push(tryJ(()=>I.rebutOk(l,r,R)));}
 o.push(tryJ(()=>I.blocks(ALL)),tryJ(()=>I.harvest(R)),tryJ(()=>I.harvest(ALL)));return o;};
for(const n of NODES){const a=calls(runOld(n)),b=calls(runLoader(n,SLt));const nonEmpty=a.filter(x=>x&&x!=='[]'&&x!=='{}'&&!String(x).startsWith('THROW')).length;
 ok(JSON.stringify(a)===JSON.stringify(b)&&nonEmpty>20,n+': '+a.length+' outputs identical ('+nonEmpty+' non-empty, '+a.filter(x=>String(x).startsWith('THROW')).length+' throws on both)');}
console.log('== D. Negative controls');
{const k='IMP B Build';const X=lib(SLt);delete X.M[k];const SL2=SLt.slice(0,SLt.indexOf('\n/*LIB*/'))+'\n/*LIB*/'+JSON.stringify(X.L)+'\n/*MAP*/'+JSON.stringify(X.M)+SLt.slice(SLt.lastIndexOf('\n/*END*/'));
 let m='';try{runLoader('C1B Build',SL2)}catch(e){m=e.message}ok(/holds no IMP B Build/.test(m),'missing entry: loader throws ('+m+')');}
{const X=lib(SLt);const e=X.M['IMP B Build'].p.find(e=>typeof e==='number'||typeof e[0]==='number');const i=typeof e==='number'?e:e[0];X.L[i]=X.L[i]+' ';const SL2=SLt.slice(0,SLt.indexOf('\n/*LIB*/'))+'\n/*LIB*/'+JSON.stringify(X.L)+'\n/*MAP*/'+JSON.stringify(X.M)+SLt.slice(SLt.lastIndexOf('\n/*END*/'));
 let m='';try{runLoader('C1B Build',SL2)}catch(e){m=e.message}ok(/rebuilt IMP B Build is/.test(m),'changed library line: loader throws ('+m+')');}
{const a=calls(runOld('C1B Build'));const I=runOld('C1B Build');const bad={...I,AB:/x^/};const b=calls(bad);ok(JSON.stringify(a)!==JSON.stringify(b),'a broken AB regex changes the outputs (the test can see AB)');}
console.log('== E. Parse');
ok(NODES.every(n=>{try{new Function('$','$input','(async()=>{'+code(te,n)+'\n})');return true}catch(e){console.log(n,e.message);return false}}),'all 11 changed nodes parse as Code node bodies');
console.log(fail?'FAILURES: '+fail:'ALL PASS');
