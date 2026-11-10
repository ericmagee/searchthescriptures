// pkgCMS (R2) build: strip every comment (line and block) from the Code nodes outside the library (pkgLIB/strip.cjs, acorn comment ranges), and from
// the 12 R1 sources, which are repacked into the Shared Library. Checks M1-M5; prints M6.
// Usage (from wall2024/): node pkgCMS/build_CMS.cjs <base write file or fetch-back carrying pkgR1> <library strip folder (pkgLIB/strip_R1)> <out json>
const fs=require('fs'),path=require('path'),cp=require('child_process');const {strip}=require('../pkgLIB/strip.cjs');const {rebuild}=require('../pkgLIB/unpack.cjs');
const acorn=require('../pkgLIB/vendor/acorn.cjs');const W='async function VmCodeWrapper() { ';
const toks=c=>{const t=[];for(const k of acorn.tokenizer(W+c+' }',{ecmaVersion:2025,sourceType:'module'}))t.push(k.type.label+'\u0001'+(k.value===undefined?'':String(k.value)));return t.join('\u0002');};
const [BASE,STRIPDIR,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(BASE,'utf8'));d=d.data||d;d=d.workflow||d;const base=JSON.parse(JSON.stringify(d));
let ok=true;const say=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);if(!c)ok=false;};
const R1='Send Back Record|Alt Send Back Record|R2 Alt Send Back Record|Send Back Build|Alt Send Back Build|R2 Alt Send Back Build|Judge Enforcer Build|Alt Judge Enforcer Build|R2 Alt Judge Enforcer Build|Judge Enforcer Record|Alt Judge Enforcer Record|R2 Alt Judge Enforcer Record'.split('|');
const isStub=c=>/^\/\/ pkgLIB stub/.test(c);const fn=n=>n.replace(/ /g,'_')+'.js';
const plain=d.nodes.filter(n=>n.parameters&&typeof n.parameters.jsCode==='string'&&n.name!=='Shared Library'&&!isStub(n.parameters.jsCode));
// M4: no node reads another node's code text except through the Shared Library
const intro=d.nodes.filter(n=>n.parameters&&n.parameters.jsCode&&n.name!=='Shared Library'&&!isStub(n.parameters.jsCode)&&/\.params\b|jsCode|\.toString\(\)/.test(n.parameters.jsCode)).map(n=>n.name);
say(!intro.length,'M4 no plain Code node reads node code text (.params, jsCode, toString): '+(intro.join(', ')||'none'));
// strip the plain nodes and the 12 library sources
const tbad=[],pbad=[];const sx=(name,c)=>{const t=strip(c);if(toks(t)!==toks(c))tbad.push(name);try{new Function('$','$input','return (async()=>{\n'+t+'\n})();');}catch(e){pbad.push(name+': '+e.message);}return t;};
const SD='pkgLIB/strip_R1R2'+(process.env.CMSX||'')+'/patched/';if(fs.existsSync('pkgLIB/strip_R1R2'+(process.env.CMSX||'')))throw new Error('pkgLIB/strip_R1R2 exists; remove it first');fs.mkdirSync(SD,{recursive:true});
for(const f of fs.readdirSync(STRIPDIR+'/patched').filter(f=>f.endsWith('.js'))){const s=fs.readFileSync(STRIPDIR+'/patched/'+f,'utf8');const n=f.slice(0,-3).replace(/_/g,' ');fs.writeFileSync(SD+f,R1.includes(n)?sx(n,s):s);}
const before={},after={};for(const n of plain){before[n.name]=n.parameters.jsCode.length;n.parameters.jsCode=sx(n.name,n.parameters.jsCode);after[n.name]=n.parameters.jsCode.length;}
say(!tbad.length,'M1 token-equal after the strip: '+(plain.length+R1.length-tbad.length)+' of '+(plain.length+R1.length)+(tbad.length?' differ: '+tbad.join(', '):''));
say(!pbad.length,'M2 every stripped source parses: '+(pbad.length?pbad.join('; '):'all'));
// repack the 42 library sources with the base as fetch-back (E4 heads)
const TMPFB=path.join(require('os').tmpdir(),'r2_base_'+process.pid+'.json');fs.writeFileSync(TMPFB,JSON.stringify(base));
if(fs.existsSync('pkgLIB_R1R2'+(process.env.CMSX||'')))throw new Error('pkgLIB_R1R2 exists; remove it first');
const r=cp.spawnSync(process.execPath,['gate/pack.cjs','pkgLIB/strip_R1R2'+(process.env.CMSX||''),'pkgLIB_R1R2'+(process.env.CMSX||'')],{env:{...process.env,FB:TMPFB},encoding:'utf8',maxBuffer:64<<20});fs.unlinkSync(TMPFB);
console.log(r.stdout.trim().split('\n').slice(-2).join('\n'));if(r.status)throw new Error('pack failed: '+r.stderr);
const P='pkgLIB_R1R2'+(process.env.CMSX||'')+'/patched/',E4='pkgLIB_R1R2'+(process.env.CMSX||'')+'/e4_rebase/';const lib=fs.readFileSync(P+'Shared_Library.js','utf8');const by={};d.nodes.forEach(n=>by[n.name]=n);
by['Shared Library'].parameters.jsCode=lib;const e4=fs.readdirSync(E4);let rb=[];
for(const f of fs.readdirSync(P).filter(f=>f!=='Shared_Library.js')){const n=f.slice(0,-3).replace(/_/g,' ');const stub=fs.readFileSync(P+f,'utf8');if(rebuild(stub,lib)!==fs.readFileSync(SD+f,'utf8'))rb.push(f);by[n].parameters.jsCode=e4.includes(f)?fs.readFileSync(E4+f,'utf8'):stub;}
for(const f of e4)by[f.slice(0,-3).replace(/_/g,' ')].parameters.jsCode=fs.readFileSync(E4+f,'utf8');
const same30=fs.readdirSync(SD).filter(f=>!R1.includes(f.slice(0,-3).replace(/_/g,' '))).every(f=>fs.readFileSync(SD+f,'utf8')===fs.readFileSync(STRIPDIR+'/patched/'+f,'utf8'));
say(!rb.length&&same30,'M3 42 stubs rebuild their sources from the new Shared Library'+(rb.length?' (differ: '+rb.join(', ')+')':'')+'; the 30 library sources unchanged: '+same30);
const B={};base.nodes.forEach(n=>B[n.name]=n);const strip0=o=>{const x=JSON.parse(JSON.stringify(o));if(x.parameters)delete x.parameters.jsCode;return JSON.stringify(x);};
say(d.nodes.length===base.nodes.length&&d.nodes.every(n=>B[n.name]&&strip0(n)===strip0(B[n.name]))&&JSON.stringify(d.connections)===JSON.stringify(base.connections),'M5 nodes, names, ids, settings and connections equal the base; only Code text changes');
const code=w=>w.nodes.reduce((a,n)=>a+((n.parameters&&n.parameters.jsCode)||'').length,0);
const pb=Object.keys(before).reduce((a,k)=>a+before[k],0),pa=Object.keys(after).reduce((a,k)=>a+after[k],0);
const libB=B['Shared Library'].parameters.jsCode.length;const stubsB=base.nodes.filter(n=>n.parameters&&isStub(n.parameters.jsCode||'')).reduce((a,n)=>a+n.parameters.jsCode.length,0),stubsA=d.nodes.filter(n=>n.parameters&&isStub(n.parameters.jsCode||'')).reduce((a,n)=>a+n.parameters.jsCode.length,0);
console.log('M6 size: all Code text '+code(base)+' -> '+code(d)+' = '+(code(d)-code(base))+'; '+plain.length+' plain nodes '+pb+' -> '+pa+' ('+(pa-pb)+'); Shared Library '+libB+' -> '+lib.length+' ('+(lib.length-libB)+'); stubs '+stubsB+' -> '+stubsA+' ('+(stubsA-stubsB)+')');
fs.writeFileSync(OUT,JSON.stringify(d));console.log((ok?'BUILD OK':'BUILD FAILED')+': '+OUT);process.exit(ok?0:1);
