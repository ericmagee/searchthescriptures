// pkgEHL (W3): the judge enforcer's record step reads an answer line that lacks its "ENFORCER:" head, or has a list mark before it. Code only, Shared Library only.
// Real case: debate 33815, judge enforcer call, three lines "Y6.1 -- DISAGREE -- RIGHT: OVERSTATED -- ...", "Y7.1 -- ...", "Y8.1 -- ..." (found by W3's scan, Wall 4168).
// Change: one normalising replace on each reply line, before the existing patterns, in the three record sources (Judge Enforcer Record, Alt, R2 Alt).
//   Step 1 (this file): node pkgEHL/build_EHL.cjs strip            -> pkgLIB/strip_R1_EHL (the live library sources with the one edit)
//   Step 2:             FB=<fetch-back> node gate/pack.cjs pkgLIB/strip_R1_EHL pkgLIB_R1_EHL
//   Step 3:             node pkgEHL/build_EHL.cjs write <fetch-back> <out parent>
const fs=require('fs'),path=require('path');const W=path.resolve(__dirname,'..');process.chdir(W);const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};
const NODES=['Judge_Enforcer_Record.js','Alt_Judge_Enforcer_Record.js','R2_Alt_Judge_Enforcer_Record.js'];
const A="let __t=l.replace(/[*_`]+/g,'').trim();{const __sf=";
const B="let __t=l.replace(/[*_`]+/g,'').trim().replace(/^(?:[-•>]\\s*)?(?:ENFORCER\\s*:\\s*)?(?=[A-Z]\\d+(\\.\\d+)?\\s*(--|[(,—–]))/i,'ENFORCER: ');{const __sf="; /* pkgEHL */
const mode=process.argv[2];
if(mode==='strip'){const S='pkgLIB/strip_R1',O='pkgLIB/strip_R1_EHL';if(fs.existsSync(O))die(O+' exists');fs.cpSync(S,O,{recursive:true});
 for(const f of fs.readdirSync(O+'/patched')){const p=O+'/patched/'+f;const s=fs.readFileSync(p,'utf8');const k=s.split(A).length-1;if(NODES.includes(f)){if(k!==1)die(f+': anchor '+k+' hits');const t=s.split(A).join(B);new Function('$','$input','return (async()=>{\n'+t+'\n})();');fs.writeFileSync(p,t);console.log(f+' '+s.length+' -> '+t.length+' (+'+(t.length-s.length)+')');}else if(k)die(f+' holds the anchor but is not one of the three');}}
else if(mode==='write'){const [,,,FB,OUT]=process.argv;const {rebuild}=require('../pkgLIB/unpack.cjs');let d=JSON.parse(fs.readFileSync(FB,'utf8'));const root=d;d=d.data||d;d=d.workflow||d;const by={};d.nodes.forEach(n=>by[n.name]=n);
 const lib0=by['Shared Library'].parameters.jsCode,lib=fs.readFileSync('pkgLIB_R1_EHL/patched/Shared_Library.js','utf8');let bad=[];
 for(const f of fs.readdirSync('pkgLIB_R1_EHL/patched').filter(f=>f!=='Shared_Library.js')){const n=f.slice(0,-3).replace(/_/g,' ');const live=by[n].parameters.jsCode;const isE4=fs.existsSync('pkgLIB_R1_EHL/e4_rebase/'+f);const stub=isE4?fs.readFileSync('pkgLIB_R1_EHL/e4_rebase/'+f,'utf8'):fs.readFileSync('pkgLIB_R1_EHL/patched/'+f,'utf8');
  if(stub!==live)bad.push(n+': stub differs from live');const src=fs.readFileSync('pkgLIB/strip_R1_EHL/patched/'+f,'utf8');if(rebuild(fs.readFileSync('pkgLIB_R1_EHL/patched/'+f,'utf8'),lib)!==src)bad.push(n+': does not rebuild its source');
  const was=rebuild(fs.readFileSync('pkgLIB_R1_EHL/patched/'+f,'utf8').replace(/x^/,''),lib0===lib?lib:lib0);if(!NODES.includes(f)&&(()=>{try{return rebuild(live,lib0)!==rebuild(live,lib);}catch(e){return false;}})())bad.push(n+': source changes though not one of the three');}
 if(bad.length)die(bad.join('; '));by['Shared Library'].parameters.jsCode=lib;fs.writeFileSync(OUT,JSON.stringify(root));console.log('Shared Library '+lib0.length+' -> '+lib.length+' ('+(lib.length-lib0.length>=0?'+':'')+(lib.length-lib0.length)+'); every stub byte-equal to live; only the Shared Library changes; nodes '+d.nodes.length);}
else die('mode strip or write');
