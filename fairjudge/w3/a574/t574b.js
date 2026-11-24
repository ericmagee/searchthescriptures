// ASK 574 prototype (W3). Method test only, on the live engine after ASK 563 (d8292f62). Writes nothing to n8n.
// usage: node t574b.js <engine.json> <child.json>   (needs acorn and eslint-scope; set NODE_PATH)
const fs=require('fs'),crypto=require('crypto');const acorn=require('acorn'),es=require('eslint-scope');
const W=JSON.parse(fs.readFileSync(process.argv[2]));const md=s=>crypto.createHash('md5').update(s).digest('hex').slice(0,8);
const NODES=['C2B Extract','D3B Extract','C3B Extract'];const KEY=n=>'O423 '+n;let ok=true;const say=(c,m)=>{if(!c)ok=false;console.log((c?'PASS ':'FAIL ')+m);};
const sl=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const LIB=JSON.parse(sl.slice(sl.indexOf('\n/*LIB*/')+8,sl.lastIndexOf('\n/*MAP*/')));const MAP=JSON.parse(sl.slice(sl.lastIndexOf('\n/*MAP*/')+8,sl.lastIndexOf('\n/*END*/')));
const L2=LIB.slice();const base=L2.length;const idx=new Map();LIB.forEach((l,i)=>{if(!idx.has(l))idx.set(l,i);});let reused=new Set();const B={},M2={...MAP};   // draft 1a: an existing library line is reused; only lines the library lacks are appended
for(const nm of NODES){const c=W.nodes.find(n=>n.name===nm).parameters.jsCode;const ast=acorn.parse(c,{ecmaVersion:2022,allowReturnOutsideFunction:true});
 const st=ast.body.filter(s=>s.type==='VariableDeclaration'&&s.declarations[0].id.name==='__O423');say(st.length===1,nm+': one top-level __O423 statement');
 const t=c.slice(st[0].start,st[0].end);B[nm]={c,t,a:st[0].start,b:st[0].end};
 const g=es.analyze(acorn.parse(t,{ecmaVersion:2022,ranges:true}),{ecmaVersion:2022,sourceType:'script'}).globalScope;
 const free=[...new Set(g.through.map(r=>r.identifier.name))].filter(x=>!(x in globalThis)&&x!=='undefined');say(free.sort().join(',')==='$,$input',nm+': free names are $ and $input only ('+free.join(',')+')');
 say(!/\bawait\b|\bthis\b|\barguments\b|\byield\b/.test(t.replace(/(["'`\/])(?:\\.|(?!\1).)*\1/g,'')),nm+': no await, this, arguments or yield outside strings (rough scan)');
 const p=t.split('\n').map(l=>{if(!idx.has(l)){idx.set(l,L2.length);L2.push(l);}const i=idx.get(l);if(i<base)reused.add(i);return i;});
 const comp=[];for(const i of p){const l=comp[comp.length-1];if(Array.isArray(l)&&l[1]===i-1)l[1]=i;else if(typeof l==='number'&&l===i-1)comp[comp.length-1]=[l,i];else comp.push(i);}
 M2[KEY(nm)]={n:t.length,p:comp};}
say(L2.slice(0,base).every((l,i)=>l===LIB[i]),'no existing library line moved or changed ('+base+' lines kept; '+(L2.length-base)+' appended)');
const T2='// packed\nreturn [];\n/*LIB*/'+JSON.stringify(L2)+'\n/*MAP*/'+JSON.stringify(M2)+'\n/*END*/\n';
const stub=nm=>"const __O423=(T=>{const L=JSON.parse(T.slice(T.indexOf('\\n/*LIB*/')+8,T.lastIndexOf('\\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\\n/*MAP*/')+8,T.lastIndexOf('\\n/*END*/')))["+JSON.stringify(KEY(nm))+"];if(!M)throw new Error('pkgO423: the Shared Library holds no "+KEY(nm)+" entry');const S=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\\n')).join('\\n');if(S.length!==M.n)throw new Error('pkgO423: rebuilt "+KEY(nm)+" is '+S.length+', expected '+M.n);return new Function('$','$input',S+'\\nreturn __O423;')($,$input);})($('Shared Library').params.jsCode);";
const rebuild=(T,nm)=>{const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))[KEY(nm)];const S=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');return {S,n:M.n};};
let before=0,after=0;
for(const nm of NODES){const {c,t,a,b}=B[nm];const r=rebuild(T2,nm);say(r.S===t&&r.S.length===r.n,nm+': served text equals the live block byte for byte ('+t.length+', md5 '+md(t)+')');
 const c2=c.slice(0,a)+stub(nm)+c.slice(b);let parses=true;try{acorn.parse(c2,{ecmaVersion:2022,allowReturnOutsideFunction:true});}catch(e){parses=false;}say(parses,nm+': node with the loader parses ('+c.length+' to '+c2.length+')');
 say(c2.slice(0,a)===c.slice(0,a)&&c2.slice(c2.length-(c.length-b))===c.slice(b),nm+': every character outside the __O423 statement is unchanged');before+=c.length;after+=c2.length;
 // negative control: one served line dropped, the loader must throw
 const Lbad=L2.slice();Lbad[idx.get(t.split('\n')[5])]='';const Tbad='x\n/*LIB*/'+JSON.stringify(Lbad)+'\n/*MAP*/'+JSON.stringify(M2)+'\n/*END*/\n';const rb=rebuild(Tbad,nm);say(rb.S.length!==rb.n,nm+': negative control, a changed line fails the length check');}
const add=JSON.stringify(L2).length-JSON.stringify(LIB).length+JSON.stringify(M2).length-JSON.stringify(MAP).length;
// draft 1b (W1 D1): the same lines and the same three MAP entries go into the child library, so the two LIB texts stay identical
const WC=JSON.parse(fs.readFileSync(process.argv[3]));const slc=WC.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const LIBC=JSON.parse(slc.slice(slc.indexOf('\n/*LIB*/')+8,slc.lastIndexOf('\n/*MAP*/')));const MAPC=JSON.parse(slc.slice(slc.lastIndexOf('\n/*MAP*/')+8,slc.lastIndexOf('\n/*END*/')));
say(JSON.stringify(LIBC)===JSON.stringify(LIB),'child LIB equals engine LIB before the change ('+LIBC.length+' lines)');
say(NODES.every(n=>!(KEY(n) in MAPC)&&!(KEY(n) in MAP)),'the three keys are new in both MAPs');
const MC2={...MAPC};for(const n of NODES)MC2[KEY(n)]=M2[KEY(n)];
const addC=JSON.stringify(L2).length-JSON.stringify(LIBC).length+JSON.stringify(MC2).length-JSON.stringify(MAPC).length;
say(WC.nodes.every(n=>!/O423/.test(JSON.stringify(n.parameters))),'the child holds no O423 text in any node');
console.log('MEASURED: three engine nodes '+before+' to '+after+' characters; engine Shared Library grows by '+add+'; child Shared Library grows by '+addC+'; net stored saving, engine and child together '+(before-after-add-addC)+' (engine alone '+(before-after-add)+').');
const ru=[...reused].sort((x,y)=>x-y);console.log('REUSED existing library lines: '+ru.length+' ('+ru.reduce((a,i)=>a+LIB[i].length,0)+' characters), from line '+ru[0]+' to '+ru[ru.length-1]+'; MAP p entries: '+NODES.map(n=>M2[KEY(n)].p.length).join(', '));
const users={};for(const k of Object.keys(MAP)){const s2=new Set();for(const e of MAP[k].p){if(typeof e==='number')s2.add(e);else if(typeof e[0]==='number')for(let i=e[0];i<=e[1];i++)s2.add(i);}for(const i of ru)if(s2.has(i))(users[k]=users[k]||0,users[k]++);}
console.log('existing MAP entries that serve any reused line: '+Object.keys(users).length+' ('+Object.entries(users).sort((a,b)=>b[1]-a[1]).slice(0,6).map(x=>x[0]+' '+x[1]).join('; ')+')');
console.log(ok?'ALL PASS':'SOME FAIL');
