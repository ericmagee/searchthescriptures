// pkgCK (reader phase 2, CURE_KEY): cureLines reads each keyed line with the shared reader (pkgCK/cureLines_new.js replaces the whole function).
// Base pkgRC/patched (7a9f615, on pkgSBR); 19 cure-library nodes. The old function is asserted byte for byte to be one and the same in every node.
const fs=require('fs'),cr=require('crypto');const D=__dirname,B=D+'/../pkgRC/patched/';const sha=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,16);
const N=fs.readFileSync(D+'/cureLines_new.js','utf8').trim();const plan={};let old0=null,n=0,emb=0;
// spec 16 (W3 2469): the embedded shared reader moves from readLines.cjs at fd852d4~1 to fd852d4 (W1). The old embed is asserted equal to fd852d4~1.
const {execSync}=require('child_process');const git=c=>execSync('git show '+c+':prototypes/posture_e/wall2024/reader/readLines.cjs',{encoding:'utf8',cwd:D}).replace(/^'use strict';\n/m,'');
const RL0=git('fd852d4~1'),RL1=git('fd852d4');const EA='const __RL=(function(){const module={exports:{}};const exports=module.exports;\n',EZ='\nreturn module.exports;})();';
for(const f of fs.readdirSync(B).filter(f=>f.endsWith('.js')).sort()){let s=fs.readFileSync(B+f,'utf8');const base=sha(s);
 {const a=s.indexOf(EA);if(a<0)throw new Error(f+': no embedded reader');const z=s.indexOf(EZ,a);if(s.slice(a+EA.length,z)!==RL0)throw new Error(f+': embedded reader is not fd852d4~1');s=s.slice(0,a+EA.length)+RL1+s.slice(z);emb++;}
 const i=s.indexOf('function cureLines(');
 if(i>=0){if(s.indexOf('function cureLines(',i+1)>=0)throw new Error(f+': two cureLines');let d=0,j=s.indexOf('{',i);for(;j<s.length;j++){if(s[j]=='{')d++;if(s[j]=='}'){d--;if(!d)break;}}
  const old=s.slice(i,j+1);if(old0===null)old0=old;else if(old!==old0)throw new Error(f+': cureLines differs from the first node');s=s.slice(0,i)+N+s.slice(j+1);n++;}
 fs.writeFileSync(D+'/patched/'+f,s);plan[f]={base_sha:base,final_sha:sha(s),changed:base!==sha(s)};}
if(n!==19||emb!==22)throw new Error('cureLines '+n+' (want 19), reader '+emb+' (want 22)');fs.writeFileSync(D+'/plan_CK.json',JSON.stringify(plan,null,1));console.log('reader re-embedded in '+emb+' nodes (fd852d4); cureLines replaced in '+n+' nodes; old function sha '+sha(old0));
