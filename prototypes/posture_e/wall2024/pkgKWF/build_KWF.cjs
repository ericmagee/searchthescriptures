// pkgKWF (W3, 11-08): the judges' agreement names all four K-W answer forms the engine accepts (adds NOT HELD).
// Bases: live s60 fetchback; Enforcer Build + Alt Judge Enforcer Build from pkgEKL/patched (on EKN); Shared Library from pkgLIB_v19_GDA.
// Run from wall2024/: node pkgKWF/build_KWF.cjs
const fs=require('fs');const crypto=require('crypto');
const fb=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s60.json','utf8'));const ns=fb.nodes||fb;
const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const OLD_HEAD='I answer in one of three forms: STANDS WITHOUT IT because <layer>; CONCEDED; or REASSERTED IN <round> ';
const NEW_HEAD='I answer in one of four forms: STANDS WITHOUT IT because <layer>; CONCEDED; REASSERTED IN <round> ';
const TAIL='when a later round rests on what was withdrawn.';
const NEW_TAIL="when a later round rests on what was withdrawn; or NOT HELD -- <why the sentence gives up no footing this link needs>, quoting the flagged sentence, at least six words in a row.";
const nodes=['D3 Build','C3 Build'].length?[]:[];
const base={};for(const n of ns){const c=(n.parameters||{}).jsCode;if(typeof c==='string'&&c.includes(OLD_HEAD))base[n.name]=c;}
base['Enforcer Build']=fs.readFileSync('pkgEKL/patched/Enforcer_Build.js','utf8');
base['Alt Judge Enforcer Build']=fs.readFileSync('pkgEKL/patched/Alt_Judge_Enforcer_Build.js','utf8');
base['Shared Library']=fs.readFileSync('pkgLIB_v19_GDA/patched/Shared_Library.js','utf8');
const plan={};
for(const [name,src] of Object.entries(base)){
 const parts=src.split(OLD_HEAD);if(parts.length!==2)throw new Error(name+': OLD_HEAD found '+(parts.length-1)+' times');
 const t=parts[1].indexOf(TAIL);if(t<0||t>200)throw new Error(name+': tail not near');
 const out=parts[0]+NEW_HEAD+parts[1].slice(0,t)+NEW_TAIL+parts[1].slice(t+TAIL.length);
 const f=name.replace(/ /g,'_')+'.js';fs.writeFileSync('pkgKWF/patched/'+f,out);plan[f]={node:name,before:h(src),after:h(out)};
 console.log(name.padEnd(26),h(src),'->',h(out));}
fs.writeFileSync('pkgKWF/plan_KWF.json',JSON.stringify({nodes:plan},null,1));
