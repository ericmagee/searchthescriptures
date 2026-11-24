// ASK 579 prototype (W3). Method test only, on the live engine and child after ASK 571+570. Writes nothing to n8n.
// usage: node t579.js <engine.json> <child.json> [outdir]   (needs acorn, acorn-walk, eslint-scope; set NODE_PATH)
const fs=require('fs'),crypto=require('crypto'),acorn=require('acorn'),walk=require('acorn-walk'),es=require('eslint-scope');
const E=JSON.parse(fs.readFileSync(process.argv[2])),C=JSON.parse(fs.readFileSync(process.argv[3]));
const md=s=>crypto.createHash('md5').update(s).digest('hex').slice(0,8);let ok=true,cnt=0;const say=(c,m)=>{cnt++;if(!c)ok=false;console.log((c?'PASS ':'FAIL ')+m);};
const node=(W,n)=>W.nodes.find(x=>x.name===n);const P=o=>({ecmaVersion:2022,allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true,...o});
const split=T=>({head:T.slice(0,T.indexOf('\n/*LIB*/')),L:JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))});
const join=p=>p.head+'\n/*LIB*/'+JSON.stringify(p.L)+'\n/*MAP*/'+JSON.stringify(p.M)+'\n/*END*/\n';
const TE=node(E,'Shared Library').parameters.jsCode,TC=node(C,'Shared Library').parameters.jsCode;const pe=split(TE),pc=split(TC);
say(join(pe)===TE&&join(pc)===TC,'the library text of engine and child splits and joins back byte for byte');
say(JSON.stringify(pe.L)===JSON.stringify(pc.L),'engine LIB equals child LIB before the change ('+pe.L.length+' lines)');
const O=['C2B Extract','D3B Extract','C3B Extract'],X=['C4G Extract','C3G Extract','C1B Extract','D2B Extract','D4B Extract','C4B Extract'];
// SEARCH: which nodes hold the two shapes
const holdO=E.nodes.filter(n=>n.parameters.jsCode&&n.name!=='Shared Library'&&/const __O423=/.test(n.parameters.jsCode)).map(n=>n.name);
const holdX=E.nodes.filter(n=>{if(!n.parameters.jsCode||n.name==='Shared Library'||!/try\{__X2=\(\(\)=>\{/.test(n.parameters.jsCode))return false;try{return acorn.parse(n.parameters.jsCode,P()).body.some(s=>s.type==='TryStatement'&&n.parameters.jsCode.slice(s.start,s.start+16)==='try{__X2=(()=>{\n');}catch(e){return true;}}).map(n=>n.name);   // top level only; the three __O423 texts hold the same shape nested, and it is served inside them
say(holdO.sort().join()===O.slice().sort().join(),'engine nodes with a __O423 statement: '+holdO.join(', '));
say(holdX.sort().join()===X.slice().sort().join(),'engine nodes with a top-level try{__X2=(()=>{ block: '+holdX.join(', '));
say(!C.nodes.some(n=>n.name!=='Shared Library'&&/__O423|__X2\b/.test(JSON.stringify(n.parameters))),'the child holds neither shape outside its library');
// units
const U=[];
for(const nm of O){const c=node(E,nm).parameters.jsCode;const st=acorn.parse(c,P()).body.filter(s=>s.type==='VariableDeclaration'&&s.declarations[0].id.name==='__O423');say(st.length===1&&st[0].declarations.length===1,nm+': one top-level __O423 statement');
 U.push({nm,kind:'O',key:'O423 '+nm,c,a:st[0].start,b:st[0].end,t:c.slice(st[0].start,st[0].end)});}
for(const nm of X){const c=node(E,nm).parameters.jsCode;const st=acorn.parse(c,P()).body.filter(s=>s.type==='TryStatement'&&s.end-s.start>1000);
 const x=st.length===1&&st[0].block.body.length===1&&st[0].block.body[0].type==='ExpressionStatement'?st[0].block.body[0].expression:null;
 const good=x&&x.type==='AssignmentExpression'&&x.left.name==='__X2'&&x.right.type==='MemberExpression'&&x.right.property.name==='json'&&x.right.object.type==='MemberExpression'&&x.right.object.property.value===0&&x.right.object.object.type==='CallExpression'&&x.right.object.object.arguments.length===0;
 say(!!good,nm+': one large try block of the shape try{__X2=(()=>{...})()[0].json;}catch(x){...}');const call=x.right.object.object;
 say(c.slice(st[0].start,call.start)==='try{__X2='&&/^\[0\]\.json;\}catch\(x\)\{return __keep\(/.test(c.slice(call.end,st[0].end)),nm+': the text around the served call is try{__X2= ... [0].json;}catch(x){return __keep(');
 U.push({nm,kind:'X',key:'X2 '+nm,c,a:call.start,b:call.end,ts:st[0].start,t:c.slice(call.start,call.end)});}
// free names, forbidden words, node references
for(const u of U){const src=u.kind==='O'?u.t:'('+u.t+');';const ast=acorn.parse(src,{ecmaVersion:2022,ranges:true});const g=es.analyze(ast,{ecmaVersion:2022,sourceType:'script'}).globalScope;
 const free=[...new Set(g.through.map(r=>r.identifier.name))].filter(x=>!(x in globalThis)&&x!=='undefined').sort();say(free.join(',')==='$,$input',u.key+': free names are $ and $input only ('+free.join(',')+')');
 let bad=0,dyn=0;const refs=new Set();walk.simple(ast,{ThisExpression(){bad++;},AwaitExpression(){bad++;},YieldExpression(){bad++;},Identifier(n){if(n.name==='arguments')bad++;},CallExpression(n){if(n.callee.type==='Identifier'&&n.callee.name==='$'){const a=n.arguments[0];if(n.arguments.length===1&&a.type==='Literal'&&typeof a.value==='string')refs.add(a.value);else dyn++;}}});
 say(bad===0,u.key+': no this, await, yield or arguments (parser)');u.refs=[...refs].sort();u.dyn=dyn;}
say(U.every(u=>u.dyn===0),'no served text calls $() with anything but a literal node name');
// pack, reuse first: an existing library line is served where it stands; only lines the library lacks are appended (to both libraries)
const L2=pe.L.slice(),base=L2.length,idx=new Map();pe.L.forEach((l,i)=>{if(!idx.has(l))idx.set(l,i);});const reused=new Set(),NEW={};
for(const u of U){const p=u.t.split('\n').map(l=>{if(!idx.has(l)){idx.set(l,L2.length);L2.push(l);}const i=idx.get(l);if(i<base)reused.add(i);return i;});
 const comp=[];for(const i of p){const l=comp[comp.length-1];if(Array.isArray(l)&&l[1]===i-1)l[1]=i;else if(typeof l==='number'&&l===i-1)comp[comp.length-1]=[l,i];else comp.push(i);}NEW[u.key]={n:u.t.length,p:comp};}
say(U.every(u=>!(u.key in pe.M)&&!(u.key in pc.M)),'the nine keys are new in both MAPs');
say(L2.slice(0,base).every((l,i)=>l===pe.L[i]),'no existing library line moved or changed ('+base+' kept, '+(L2.length-base)+' appended)');
const ne={head:pe.head,L:L2,M:{...pe.M,...NEW}},nc={head:pc.head,L:L2,M:{...pc.M,...NEW}};
// the library pair check, with the engine's and the child's own functions
const ls=E.nodes.find(n=>n.name.startsWith('Library Sha')).parameters.jsCode,lcx=C.nodes.find(n=>n.name.startsWith('Library Check')).parameters.jsCode;
const fe=new Function(ls.slice(0,ls.indexOf('const __lc='))+"\nreturn {l:__LIBSHA422(arguments[0]),m:__MAPSHA422(arguments[0],'engine')};"),fc=new Function(lcx.slice(0,lcx.indexOf('const __it='))+"\nreturn {l:__LIBSHA422(arguments[0]),m:__MAPSHA422(arguments[0],'child')};");
const s0e=fe(TE),s0c=fc(TC);say(s0e.l===s0c.l&&s0e.m===s0c.m,'known-good: the pair check passes on the live pair (lib '+s0e.l+', map '+s0e.m+')');
const TE2=join(ne),TC2=join(nc);const s1e=fe(TE2),s1c=fc(TC2);say(s1e.l&&s1e.l===s1c.l&&s1e.m&&s1e.m===s1c.m,'the pair check passes on the packed pair (lib '+s1e.l+', map '+s1e.m+'); the header sha line is reset at the build');
say(fe(TE2).l!==fc(TC).l,'control (W1 574 D1): lines appended to the engine only fail the pair check');
// loaders
const pre=u=>u.refs.length?'if(false){'+u.refs.map(r=>'$('+JSON.stringify(r).replace(/^"|"$/g,"'")+');').join('')+'}\n':'';
const core=(u,body)=>"(T=>{const L=JSON.parse(T.slice(T.indexOf('\\n/*LIB*/')+8,T.lastIndexOf('\\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\\n/*MAP*/')+8,T.lastIndexOf('\\n/*END*/')))["+JSON.stringify(u.key)+"];if(!M)throw new Error('pkgX579: the Shared Library holds no "+u.key+" entry');const S=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\\n')).join('\\n');if(S.length!==M.n)throw new Error('pkgX579: rebuilt "+u.key+" is '+S.length+', expected '+M.n);return "+body+";})($('Shared Library').params.jsCode)";
const stub=u=>u.kind==='O'?pre(u)+"const __O423="+core(u,"new Function('$','$input',S+'\\nreturn __O423;')($,$input)")+";":null;
// for a try block: the loader stands BEFORE the try, so a library fault throws and stops the node; only the served call runs inside the try, as today
const stubX=u=>pre(u)+"const __F579="+core(u,"new Function('$','$input','return '+S+';')")+";\n";
say(U.filter(u=>u.kind==='X').every(u=>!/__F579/.test(u.c))&&U.every(u=>!/pkgX579/.test(u.c)),'the names __F579 and pkgX579 are free in the nine nodes');
const rebuild=(T,k)=>{const p=split(T);const M=p.M[k];const S=M.p.map(e=>typeof e==='number'?p.L[e]:typeof e[0]==='string'?e[0]:p.L.slice(e[0],e[1]+1).join('\n')).join('\n');return {S,n:M.n};};
let before=0,after=0;const E2=JSON.parse(JSON.stringify(E)),C2=JSON.parse(JSON.stringify(C));
for(const u of U){const r=rebuild(TE2,u.key),rc=rebuild(TC2,u.key);say(r.S===u.t&&r.n===u.t.length&&rc.S===u.t,u.key+': served text equals the live text byte for byte ('+u.t.length+', md5 '+md(u.t)+')');
 let c2;if(u.kind==='O')c2=u.c.slice(0,u.a)+stub(u)+u.c.slice(u.b);else c2=u.c.slice(0,u.ts)+stubX(u)+'try{__X2=__F579($,$input)'+u.c.slice(u.b);
 let p=true;try{acorn.parse(c2,P());}catch(e){p=false;}say(p,u.nm+': node with the loader parses ('+u.c.length+' to '+c2.length+')');
 const A=u.kind==='O'?u.a:u.ts;say(c2.slice(0,A)===u.c.slice(0,A)&&c2.endsWith(u.c.slice(u.b)),u.nm+': every character before the statement and after the served text is unchanged');
 // run the loader offline: it must hand back a function / value built from exactly the served text
 const lt=u.kind==='O'?null:new Function('$','return '+core(u,'S')+';')(n=>({params:{jsCode:TE2}}));if(u.kind==='X')say(lt===u.t,u.nm+': the loader, run offline on the packed library, rebuilds the served text');
 const bad=split(TE2);bad.L[idx.get(u.t.split('\n')[3])]+=' ';let threw=false;try{new Function('$','return '+core(u,'S')+';')(n=>({params:{jsCode:join(bad)}}));}catch(e){threw=/pkgX579: rebuilt/.test(e.message);}say(threw,u.nm+': control, one changed line makes the loader throw');
 const nk=split(TE2);delete nk.M[u.key];threw=false;try{new Function('$','return '+core(u,'S')+';')(n=>({params:{jsCode:join(nk)}}));}catch(e){threw=/holds no/.test(e.message);}say(threw,u.nm+': control, a missing MAP entry makes the loader throw');
 before+=u.c.length;after+=c2.length;node(E2,u.nm).parameters.jsCode=c2;}
node(E2,'Shared Library').parameters.jsCode=TE2;node(C2,'Shared Library').parameters.jsCode=TC2;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
say(E.nodes.filter(n=>!same(n,node(E2,n.name))).length===10&&same(E.connections,E2.connections),'engine: the nine nodes and the Shared Library change; nothing else');
say(C.nodes.filter(n=>!same(n,node(C2,n.name))).map(n=>n.name).join()==='Shared Library'&&same(C.connections,C2.connections),'child: the Shared Library only');
// every existing MAP entry still rebuilds the same text
const allk=k=>{const a=rebuild(TE,k),b=rebuild(TE2,k);return a.S===b.S&&b.S.length===b.n;};say(Object.keys(pe.M).every(allk),'all '+Object.keys(pe.M).length+' existing engine MAP entries rebuild the same text from the packed library');
const addE=TE2.length-TE.length,addC=TC2.length-TC.length;
console.log('MEASURED: nine nodes '+before+' to '+after+' characters (saved '+(before-after)+'); engine Shared Library +'+addE+'; child Shared Library +'+addC+'.');
console.log('NET stored saving: with the child copy '+(before-after-addE-addC)+'; engine alone (the state once ASK 578 removes the child copy) '+(before-after-addE)+'.');
const ru=[...reused].sort((a,b)=>a-b);console.log('served texts: '+U.length+' ('+U.reduce((a,u)=>a+u.t.length,0)+' characters, '+new Set(U.flatMap(u=>u.t.split('\n'))).size+' different lines); reused existing library lines: '+ru.length+' ('+ru.reduce((a,i)=>a+pe.L[i].length,0)+' characters); appended: '+(L2.length-base)+' lines ('+L2.slice(base).reduce((a,l)=>a+l.length,0)+' characters)');
const users={};for(const k of Object.keys(pe.M)){const s2=new Set();for(const e of pe.M[k].p){if(typeof e==='number')s2.add(e);else if(typeof e[0]==='number')for(let i=e[0];i<=e[1];i++)s2.add(i);}let c=0;for(const i of ru)if(s2.has(i))c++;if(c)users[k]=c;}
console.log('existing MAP entries that serve a reused line: '+Object.keys(users).length+': '+Object.entries(users).sort((a,b)=>b[1]-a[1]).map(x=>x[0]+' '+x[1]).join('; '));
console.log('reused library line numbers: '+ru.join(','));
for(const u of U)console.log('  '+u.key+': n '+u.t.length+', p entries '+NEW[u.key].p.length+', node names kept in the if(false) line: '+(u.refs.join(', ')||'none'));
// helpers not taken
{const c=node(E,'C2B Extract').parameters.jsCode;const h=acorn.parse(c,P()).body.filter(s=>s.type==='VariableDeclaration'&&/^__(LB|CC|LC|A)423$/.test(s.declarations[0].id.name));console.log('NOT TAKEN: the four statements __LB423, __CC423, __LC423, __A423 ('+(h[h.length-1].end-h[0].start)+' characters, one text in three nodes).');}
if(process.argv[4]){fs.writeFileSync(process.argv[4]+'/target_engine_579.json',JSON.stringify(E2));fs.writeFileSync(process.argv[4]+'/target_child_579.json',JSON.stringify(C2));}
console.log((ok?'ALL PASS':'SOME FAIL')+' ('+cnt+' checks)');
