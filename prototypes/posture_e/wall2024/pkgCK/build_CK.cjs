// pkgCK (reader phase 2, CURE_KEY): cureLines reads each keyed line with the shared reader (pkgCK/cureLines_new.js replaces the whole function).
// Base pkgRC/patched (7a9f615, on pkgSBR); 19 cure-library nodes. The old function is asserted byte for byte to be one and the same in every node.
const fs=require('fs'),cr=require('crypto');const D=__dirname,B=D+'/../pkgRC/patched/';const sha=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,16);
const N=fs.readFileSync(D+'/cureLines_new.js','utf8').trim();const plan={};let old0=null,n=0;
for(const f of fs.readdirSync(B).filter(f=>f.endsWith('.js')).sort()){let s=fs.readFileSync(B+f,'utf8');const base=sha(s);const i=s.indexOf('function cureLines(');
 if(i>=0){if(s.indexOf('function cureLines(',i+1)>=0)throw new Error(f+': two cureLines');let d=0,j=s.indexOf('{',i);for(;j<s.length;j++){if(s[j]=='{')d++;if(s[j]=='}'){d--;if(!d)break;}}
  const old=s.slice(i,j+1);if(old0===null)old0=old;else if(old!==old0)throw new Error(f+': cureLines differs from the first node');s=s.slice(0,i)+N+s.slice(j+1);n++;}
 fs.writeFileSync(D+'/patched/'+f,s);plan[f]={base_sha:base,final_sha:sha(s),changed:base!==sha(s)};}
if(n!==19)throw new Error('cureLines found in '+n+' nodes, want 19');fs.writeFileSync(D+'/plan_CK.json',JSON.stringify(plan,null,1));console.log('cureLines replaced in '+n+' nodes; old function sha '+sha(old0));
