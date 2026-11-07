// the replay environment: live s16 Alternate Merge's libraries (inside the pkgCSP wrapper) up to the node body, with the K-UNX-A edit
const fs=require('fs');const {patch}=require('./patch.cjs');
function load(withPatch=true){const AM=fs.readFileSync(__dirname+'/base/Alternate_Merge.js','utf8');const s0=AM.indexOf('const __CSPOUT=(()=>{\n')+22;let env=AM.slice(s0,AM.indexOf("const AM=$('Alternate Merge Seat')"));if(withPatch)env=patch(env);
 return new Function('$','$input',env+';return {kunxLines,ciCountSection,lbBlockText,lbFoot,ciRounds,unxSegs,unxPresses,UNX_MRUN,'+(withPatch?'unxaL1,unxaHead,unxaCheck,UNXA_HARD,UNXA_ASM,UNXA_UNA':'')+'};')(()=>{throw 0;},null);}
const rows=()=>JSON.parse(fs.readFileSync(__dirname+'/data/rows.json','utf8'));
const unw=v=>{const s=String(v||'').trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{const J=JSON.parse(s.slice(0,i+1));if(J&&typeof J.reasoning==='string')return J.reasoning;}catch(e){}}return String(v||'');};
const clean=v=>unw(v).replace(/\n\n\[AUDIT v[\s\S]*$/,'');const PT=r=>'=== [CR3] ===\n'+r.e3+'\n\n=== [DR3] ===\n'+r.c3+'\n';
module.exports={load,rows,clean,PT};
