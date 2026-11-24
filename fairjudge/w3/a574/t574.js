// ASK 574 prototype (W3). Method test only, on the live engine after ASK 563 (d8292f62). Writes nothing to n8n.
// usage: node t574.js <fetchback_engine.json>   (needs acorn and eslint-scope; set NODE_PATH)
const fs=require('fs'),crypto=require('crypto');const acorn=require('acorn'),es=require('eslint-scope');
const W=JSON.parse(fs.readFileSync(process.argv[2]));const md=s=>crypto.createHash('md5').update(s).digest('hex').slice(0,8);
const NODES=['C2B Extract','D3B Extract','C3B Extract'];const KEY=n=>'O423 '+n;let ok=true;const say=(c,m)=>{if(!c)ok=false;console.log((c?'PASS ':'FAIL ')+m);};
const sl=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const LIB=JSON.parse(sl.slice(sl.indexOf('\n/*LIB*/')+8,sl.lastIndexOf('\n/*MAP*/')));const MAP=JSON.parse(sl.slice(sl.lastIndexOf('\n/*MAP*/')+8,sl.lastIndexOf('\n/*END*/')));
const L2=LIB.slice();const base=L2.length;const idx=new Map();const B={},M2={...MAP};
for(const nm of NODES){const c=W.nodes.find(n=>n.name===nm).parameters.jsCode;const ast=acorn.parse(c,{ecmaVersion:2022,allowReturnOutsideFunction:true});
 const st=ast.body.filter(s=>s.type==='VariableDeclaration'&&s.declarations[0].id.name==='__O423');say(st.length===1,nm+': one top-level __O423 statement');
 const t=c.slice(st[0].start,st[0].end);B[nm]={c,t,a:st[0].start,b:st[0].end};
 const g=es.analyze(acorn.parse(t,{ecmaVersion:2022,ranges:true}),{ecmaVersion:2022,sourceType:'script'}).globalScope;
 const free=[...new Set(g.through.map(r=>r.identifier.name))].filter(x=>!(x in globalThis)&&x!=='undefined');say(free.sort().join(',')==='$,$input',nm+': free names are $ and $input only ('+free.join(',')+')');
 say(!/\bawait\b|\bthis\b|\barguments\b|\byield\b/.test(t.replace(/(["'`\/])(?:\\.|(?!\1).)*\1/g,'')),nm+': no await, this, arguments or yield outside strings (rough scan)');
 const p=t.split('\n').map(l=>{if(!idx.has(l)){idx.set(l,L2.length);L2.push(l);}return idx.get(l);});   // own lines only, appended at the end
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
console.log('MEASURED: three nodes '+before+' to '+after+' characters; Shared Library grows by '+add+'; net stored saving '+(before-after-add)+' (engine only; the child has no __O423).');
console.log(ok?'ALL PASS':'SOME FAIL');
