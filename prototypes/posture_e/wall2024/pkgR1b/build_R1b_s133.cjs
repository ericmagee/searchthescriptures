// pkgR1b write file: live s133 with the Shared Library and the 87 R1b nodes replaced by pkgLIB_R1bM_s133.
// Usage (from wall2024/): node pkgR1b/build_R1b_s133.cjs fetchback_live_s119.json <out>
const fs=require('fs');const crypto=require('crypto');const {rebuild}=require('../pkgLIB/unpack.cjs');
const [FB,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;
const P='pkgLIB_R1bM_s133/patched/',E4='pkgLIB_R1bM_s133/e4_rebase/',S='pkgLIB/strip_R1bM_s133/patched/';
const lib=fs.readFileSync(P+'Shared_Library.js','utf8');const by={};d.nodes.forEach(n=>by[n.name]=n);
const liveLib=by['Shared Library'].parameters.jsCode;const srcOf=(LT,name)=>{const L=JSON.parse(LT.slice(LT.indexOf('\n/*LIB*/')+8,LT.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(LT.slice(LT.lastIndexOf('\n/*MAP*/')+8,LT.lastIndexOf('\n/*END*/')))[name];if(!M)return null;const S=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');return S.length===M.n?S:null;};const nm=f=>f.replace(/\.js$/,'').replace(/_/g,' ');
const out=JSON.parse(JSON.stringify(d));const ob={};out.nodes.forEach(n=>ob[n.name]=n);let ok=true;const say=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);if(!c)ok=false;};
const e4=fs.readdirSync(E4).filter(f=>f.endsWith('.js'));const files=fs.readdirSync(P).filter(f=>f.endsWith('.js')&&f!=='Shared_Library.js');
const bad=[],missing=[];const full=t=>/\/\*LIB\*\//.test(t)?null:t;
for(const f of files){const n=nm(f);if(!by[n]){missing.push(n);continue;}const live=by[n].parameters.jsCode;const src=fs.readFileSync(S+f,'utf8');
 const stub=fs.readFileSync(P+f,'utf8');if(rebuild(stub,lib)!==src)bad.push(f+' (stub does not rebuild its source)');
 const liveFull=live.includes('pkgLIB stub')?srcOf(liveLib,n):live; /* a live stub (incl. the E4 heads) runs the source its Shared Library entry rebuilds */
 if(liveFull!==src)bad.push(f+' (source differs from live s133 as run)');
 if(!e4.includes(f)&&srcOf(lib,n)!==src)bad.push(f+' (stub head check)');ob[n].parameters.jsCode=e4.includes(f)?fs.readFileSync(E4+f,'utf8'):stub;}
for(const f of e4){const n=nm(f);if(srcOf(lib,n)!==srcOf(liveLib,n))bad.push(f+' (E4 node source changes)');}
for(const f of e4){const n=nm(f);ob[n].parameters.jsCode=fs.readFileSync(E4+f,'utf8');}
ob['Shared Library'].parameters.jsCode=lib;
say(!missing.length,'every packed file names a live node'+(missing.length?': missing '+missing.join(', '):''));
say(!bad.length,'L1 each of '+files.length+' stubs rebuilds its source byte for byte from the new Shared Library, and each source equals what live s133 runs'+(bad.length?': '+bad.join('; '):''));
say(e4.every(f=>ob[nm(f)].parameters.jsCode===by[nm(f)].parameters.jsCode),'E4 heads ('+e4.map(nm).join(', ')+') equal live s133');
const ch=out.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(by[n.name])).map(n=>n.name);
const nonCode=out.nodes.filter(n=>{const a=JSON.parse(JSON.stringify(n)),b=JSON.parse(JSON.stringify(by[n.name]));if(a.parameters)delete a.parameters.jsCode;if(b.parameters)delete b.parameters.jsCode;return JSON.stringify(a)!==JSON.stringify(b);}).map(n=>n.name);
say(out.nodes.length===d.nodes.length&&JSON.stringify(out.connections)===JSON.stringify(d.connections)&&!nonCode.length,'L5 '+out.nodes.length+' nodes, connections unchanged, no field but jsCode changed; changed nodes '+ch.length);
const code=w=>w.nodes.reduce((a,n)=>a+((n.parameters&&n.parameters.jsCode)||'').length,0);
const prm=w=>w.nodes.reduce((a,n)=>{const p=Object.assign({},n.parameters||{});delete p.jsCode;return a+JSON.stringify(p).length;},0);
console.log('L6 Code node text '+code(d)+' -> '+code(out)+' = '+(code(out)-code(d))+'; non-code parameters (prompts) '+prm(d)+' -> '+prm(out)+' = '+(prm(out)-prm(d)));
const s=JSON.stringify(out);fs.writeFileSync(OUT,s);console.log('sha256 '+crypto.createHash('sha256').update(s).digest('hex')+' bytes '+s.length);
console.log((ok?'BUILD OK':'BUILD FAILED')+': '+OUT);process.exit(ok?0:1);
