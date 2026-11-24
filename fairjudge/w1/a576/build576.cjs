// ASK 576 offline build (W1 planning evidence; W4 rebuilds on a fresh live readback AFTER the ASK 559 write).
// node build576.cjs <base_engine> <base_child> <out_engine> <out_child>
// The IMP statement of 11 engine nodes is cut with acorn (top level, or the top level of a try block) and grouped into 3 texts by node:
//   "IMP B Build" (7 B Builds), "IMP B Extract" (C1B, D2B, D4B Extract), "IMP C4B Extract". Each group's nodes must hold one identical text.
// Each text gets one MAP entry over the LIB lines that already hold its lines; a line LIB lacks is carried as a literal ["text"]. No LIB line is added (LIB sha unchanged).
// The same 3 entries go into the child MAP (ASK 422a drift check). The nested IMP copies of C2B, D3B, C3B Extract (inside __O423) are not touched.
const acorn=require('/home/claude/searchthescriptures/node_modules/acorn');const fs=require('fs'),cr=require('crypto');const md=s=>cr.createHash('md5').update(s).digest('hex').slice(0,8);
const [,,BE,BC,OE,OC]=process.argv;const E=JSON.parse(fs.readFileSync(BE)),C=JSON.parse(fs.readFileSync(BC));
const GROUPS={'IMP B Build':['C1B Build','D2B Build','C2B Build','D3B Build','C3B Build','D4B Build','C4B Build'],'IMP B Extract':['C1B Extract','D2B Extract','D4B Extract'],'IMP C4B Extract':['C4B Extract']};
function cutIMP(s){const pre='(async function(){\n';const ast=acorn.parse(pre+s+'\n})',{ecmaVersion:'latest'});const body=ast.body[0].expression.body.body;const hits=[];
 const walk=a=>{for(const st of a){if(st.type==='TryStatement'){walk(st.block.body);continue}if(st.type==='VariableDeclaration'&&st.declarations.some(d=>d.id.name==='IMP'))hits.push(st)}};walk(body);
 if(hits.length!==1)throw new Error('IMP statements: '+hits.length);const h=hits[0];return {i:h.start-pre.length,e:h.end-pre.length,t:s.slice(h.start-pre.length,h.end-pre.length)};}
const loader=k=>"const IMP=(T=>{const L=JSON.parse(T.slice(T.indexOf('\\n/*LIB*/')+8,T.lastIndexOf('\\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\\n/*MAP*/')+8,T.lastIndexOf('\\n/*END*/')))['"+k+"'];if(!M)throw new Error('ASK 576: the Shared Library holds no "+k+" entry');const S=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\\n')).join('\\n');if(S.length!==M.n)throw new Error('ASK 576: rebuilt "+k+" is '+S.length+', expected '+M.n);return new Function(S+'\\nreturn IMP;')();})($('Shared Library').params.jsCode);";
const lib=w=>{const n=w.nodes.find(x=>x.name==='Shared Library');const c=n.parameters.jsCode;const a=c.indexOf('\n/*LIB*/'),b=c.lastIndexOf('\n/*MAP*/'),e=c.lastIndexOf('\n/*END*/');return {n,c,a,b,e,L:JSON.parse(c.slice(a+8,b)),M:JSON.parse(c.slice(b+8,e))}};
const X=lib(E),Y=lib(C);if(JSON.stringify(X.L)!==JSON.stringify(Y.L))throw new Error('engine and child LIB differ');
const idx=new Map();X.L.forEach((x,i)=>{if(!idx.has(x))idx.set(x,i)});const texts={},stat=[];
for(const [k,ns] of Object.entries(GROUPS)){if(X.M[k]||Y.M[k])throw new Error('MAP already has '+k);
 for(const nm of ns){const s=E.nodes.find(q=>q.name===nm).parameters.jsCode;const c=cutIMP(s);if(texts[k]!==undefined&&texts[k]!==c.t)throw new Error(nm+' differs from its group '+k);texts[k]=c.t;}
 const t=texts[k];const p=[];let lit=0,litn=0;
 for(const ln of t.split('\n')){if(idx.has(ln)){const i=idx.get(ln);const last=p[p.length-1];if(Array.isArray(last)&&typeof last[0]==='number'&&last[1]===i-1)last[1]=i;else if(typeof last==='number'&&last===i-1)p[p.length-1]=[last,i];else p.push(i)}else{p.push([ln]);lit+=ln.length;litn++}}
 X.M[k]=Y.M[k]={n:t.length,p};stat.push(k+': n '+t.length+' md5 '+md(t)+', lines '+t.split('\n').length+', p entries '+p.length+', literal lines '+litn+' ('+lit+' chars)');}
X.n.parameters.jsCode=X.c.slice(0,X.a)+'\n/*LIB*/'+JSON.stringify(X.L)+'\n/*MAP*/'+JSON.stringify(X.M)+X.c.slice(X.e);
Y.n.parameters.jsCode=Y.c.slice(0,Y.a)+'\n/*LIB*/'+JSON.stringify(Y.L)+'\n/*MAP*/'+JSON.stringify(Y.M)+Y.c.slice(Y.e);
for(const [k,ns] of Object.entries(GROUPS))for(const nm of ns){const x=E.nodes.find(q=>q.name===nm);const s=x.parameters.jsCode;const c=cutIMP(s);x.parameters.jsCode=s.slice(0,c.i)+loader(k)+s.slice(c.e);}
fs.writeFileSync(OE,JSON.stringify(E));fs.writeFileSync(OC,JSON.stringify(C));fs.writeFileSync('imp_served.json',JSON.stringify(texts));
const sz=f=>JSON.parse(fs.readFileSync(f)).nodes.reduce((a,n)=>a+JSON.stringify(n.parameters).length,0);
const de=sz(OE)-sz(BE),dc=sz(OC)-sz(BC);console.log(stat.join('\n'));console.log('stored (node parameter JSON): engine',de,'child',dc,'NET',de+dc);
