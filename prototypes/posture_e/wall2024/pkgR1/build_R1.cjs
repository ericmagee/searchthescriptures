// pkgR1 build: write file = live s105 with the Shared Library and the 12 R1 nodes replaced by pkgLIB_R1/patched. Checks L1, L2, L5, L6.
// Usage (from wall2024/): node pkgR1/build_R1.cjs <fetch-back> <out parent json>
const fs=require('fs');const {rebuild}=require('../pkgLIB/unpack.cjs');
const [FB,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(FB,'utf8'));const root=d;d=d.data||d;d=d.workflow||d;
const P='pkgLIB_R1/patched/';const S='pkgLIB/strip_R1/patched/';const lib=fs.readFileSync(P+'Shared_Library.js','utf8');
const by={};d.nodes.forEach(n=>by[n.name]=n);const nm=f=>f.replace(/\.js$/,'').replace(/_/g,' ');
const R1=new Set('Send Back Record|Alt Send Back Record|R2 Alt Send Back Record|Send Back Build|Alt Send Back Build|R2 Alt Send Back Build|Judge Enforcer Build|Alt Judge Enforcer Build|R2 Alt Judge Enforcer Build|Judge Enforcer Record|Alt Judge Enforcer Record|R2 Alt Judge Enforcer Record'.split('|'));
const LV=require('path').basename(FB).replace(/^fetchback_live_|\.json$/g,'');const out=JSON.parse(JSON.stringify(d));const ob={};out.nodes.forEach(n=>ob[n.name]=n);let ok=true;const say=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);if(!c)ok=false;};
const files=fs.readdirSync(P).filter(f=>f.endsWith('.js'));const old30=[],new12=[];
// Alternate Build and Early Alternate Build carry the E4 head (pkgLIB/e4_rebase.cjs): their write text is pkgLIB_R1/e4_rebase/<file>, which must equal live
const E4='pkgLIB_R1/e4_rebase/';const e4=fs.readdirSync(E4);for(const f of e4){const n=nm(f);const t=fs.readFileSync(E4+f,'utf8');ob[n].parameters.jsCode=t;}
let L1bad=[];for(const f of files){if(f==='Shared_Library.js')continue;const n=nm(f);const live=by[n].parameters.jsCode;const stub=e4.includes(f)?fs.readFileSync(E4+f,'utf8'):fs.readFileSync(P+f,'utf8');
 const src=fs.readFileSync(S+f,'utf8');if(rebuild(fs.readFileSync(P+f,'utf8'),lib)!==src)L1bad.push(f);
 if(R1.has(n)){new12.push(n);if(src!==live)L1bad.push(f+' (strip source differs from live)');}else{old30.push([n,stub===live]);if(!e4.includes(f)&&rebuild(live,lib)!==src)L1bad.push(f+' (live stub on new library)');}
 ob[n].parameters.jsCode=stub;}
ob['Shared Library'].parameters.jsCode=lib;
say(!L1bad.length,'L1 every stub rebuilds its source byte for byte from the new Shared Library ('+(files.length-1)+' stubs); the 12 sources equal live '+LV+(L1bad.length?': '+L1bad.join(', '):''));
const ne=old30.filter(x=>!x[1]).map(x=>x[0]);say(old30.length===30&&!ne.length,'L2 the 30 existing stubs are byte-equal to live '+LV+' ('+(30-ne.length)+' of '+old30.length+')'+(ne.length?' differ: '+ne.join(', '):''));
say(new12.length===12,'12 R1 nodes packed: '+new12.length);
say(e4.every(f=>ob[nm(f)].parameters.jsCode===by[nm(f)].parameters.jsCode),'E4 heads (Alternate Build, Early Alternate Build) equal live '+LV);
const ch=out.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(by[n.name])).map(n=>n.name).sort();
const want=['Shared Library',...new12].sort();
say(out.nodes.length===d.nodes.length&&JSON.stringify(ch)===JSON.stringify(want)&&JSON.stringify(out.connections)===JSON.stringify(d.connections),'L5 write file: '+out.nodes.length+' nodes; changed nodes = Shared Library + the 12 ('+ch.length+'); connections unchanged');
const code=w=>w.nodes.reduce((a,n)=>a+((n.parameters&&n.parameters.jsCode)||'').length,0);
const tot=w=>JSON.stringify(w.nodes).length;
console.log('L6 size: Code node text '+code(d)+' -> '+code(out)+' = '+(code(out)-code(d))+' characters; Shared Library '+by['Shared Library'].parameters.jsCode.length+' -> '+lib.length+'; whole node JSON '+tot(d)+' -> '+tot(out)+' ('+(tot(out)-tot(d))+')');
for(const n of new12)console.log('   '+n.padEnd(30)+String(by[n].parameters.jsCode.length).padStart(8)+' -> '+String(ob[n].parameters.jsCode.length).padStart(6));
fs.writeFileSync(OUT,JSON.stringify(out));console.log((ok?'BUILD OK':'BUILD FAILED')+': '+OUT);process.exit(ok?0:1);
