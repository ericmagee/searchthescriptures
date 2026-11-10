// W2 grade of pkgCMS (Wall 4147). Run from wall2024/: node pkgCMS/w2_grade/w2_cms.cjs <base fetch-back> <write file>
const fs=require('fs');const acorn=require('../../pkgLIB/vendor/acorn.cjs');const {rebuild}=require('../../pkgLIB/unpack.cjs');
const Ld=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const [BF,WF]=process.argv.slice(2);const b=Ld(BF),w=Ld(WF);const B={},N={};b.nodes.forEach(n=>B[n.name]=n);w.nodes.forEach(n=>N[n.name]=n);
let bad=0;const T=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);if(!c)bad++;};
const WR='async function VmCodeWrapper() { ';
const ast=c=>JSON.stringify(acorn.parse(WR+c+'\n }',{ecmaVersion:2025,sourceType:'module'}),(k,v)=>(k==='start'||k==='end'||k==='raw'&&false)?undefined:v);
const isStub=c=>/^\/\/ pkgLIB stub/.test(c||'');const code=n=>(n.parameters&&n.parameters.jsCode)||'';
// G1 scope
const jsOnly=o=>{const x=JSON.parse(JSON.stringify(o));if(x.parameters)delete x.parameters.jsCode;return JSON.stringify(x);};
T(b.nodes.length===w.nodes.length&&b.nodes.every(n=>N[n.name]&&jsOnly(n)===jsOnly(N[n.name]))&&JSON.stringify(b.connections)===JSON.stringify(w.connections)&&JSON.stringify(b.settings||{})===JSON.stringify(w.settings||{}),'G1 same nodes, ids, parameters other than jsCode, connections and settings');
const ch=w.nodes.filter(n=>code(n)!==code(B[n.name])).map(n=>n.name);console.log('     changed jsCode: '+ch.length+' nodes');
const libB=code(B['Shared Library']),libW=code(N['Shared Library']);
// G2 AST equality of every effective source
const e4=(stub,lib)=>{const i=stub.indexOf('\nconst __e4h');if(i<0)throw new Error('not a stub');return new Function('$',stub.slice(0,i)+'\nreturn __S;')(n=>{if(n!=='Shared Library')throw new Error('read '+n);return {params:{jsCode:lib}};});};
const rb=(c,lib)=>c.includes('\nreturn await new Function(')?rebuild(c,lib):e4(c,lib);
const src=(n,lib)=>isStub(code(n))?rb(code(n),lib):code(n);
const diffs=[],perr=[];let cmp=0,changedSrc=[];
for(const n of w.nodes){if(!n.parameters||typeof n.parameters.jsCode!=='string'||n.name==='Shared Library')continue;
 let a,c;try{a=src(B[n.name],libB);c=src(n,libW);}catch(e){perr.push(n.name+': rebuild '+e.message);continue;}
 if(a===c)continue;cmp++;changedSrc.push(n.name);try{if(ast(a)!==ast(c))diffs.push(n.name);}catch(e){perr.push(n.name+': '+e.message);}}
T(!diffs.length&&!perr.length,'G2 parse trees equal (positions removed) for '+cmp+' effective sources whose text changed'+(diffs.length?'; differ: '+diffs.join(', '):'')+(perr.length?'; errors: '+perr.join('; '):''));
// G2b no comment left in the changed sources
const left=changedSrc.filter(nm=>{let k=0;const c=src(N[nm],libW);acorn.parse(WR+c+'\n }',{ecmaVersion:2025,sourceType:'module',onComment:()=>k++});return k>0;});
T(!left.length,'G2b no comment left in the '+changedSrc.length+' changed sources'+(left.length?': '+left.join(', '):''));
// G3 saved runs and runtime text readers
const D='/mnt/project-files/wall2024/inputs/';const files=new Set(fs.readdirSync(D));const runs=[...files].filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]);
const hasRun=nm=>runs.some(r=>files.has(r+'_'+nm.replace(/ /g,'_')+'.json'));
const norun=changedSrc.filter(nm=>!hasRun(nm));console.log('     changed sources with no saved run: '+norun.length);
const RX=/\.stack\b|toString\s*\(|new\s+Function|\beval\s*\(|arguments\.callee|lineNumber|columnNumber|captureStackTrace|prepareStackTrace|jsCode|\.params\b/;
const hits=[];for(const nm of changedSrc){const c=src(N[nm],libW);const lines=c.split('\n').filter(l=>RX.test(l));if(lines.length)hits.push([nm,norun.includes(nm),lines.map(l=>l.trim().slice(0,160))]);}
for(const [nm,nr,ls] of hits){console.log('     reader '+(nr?'[NO RUN] ':'[run]    ')+nm+':');ls.forEach(l=>console.log('        '+l));}
console.log('NO_RUN '+JSON.stringify(norun));
// G4 stubs rebuild and library header
const stubs=w.nodes.filter(n=>isStub(code(n)));T(stubs.every(n=>{try{rb(code(n),libW);return true;}catch(e){return false;}}),'G4 all '+stubs.length+' stubs rebuild from the new Shared Library');
// G5 size
const tot=x=>x.nodes.reduce((a,n)=>a+code(n).length,0);console.log('G5 size: Code text '+tot(b)+' -> '+tot(w)+' = '+(tot(w)-tot(b))+'; Shared Library '+libB.length+' -> '+libW.length+' ('+(libW.length-libB.length)+')');
// prompt text: string literal values unchanged is implied by G2; count string tokens
console.log(bad?bad+' FAIL':'ALL OK');process.exit(bad?1:0);
