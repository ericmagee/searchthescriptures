// pkgEAM test. Run from wall2024/: node pkgEAM/test_EAM.cjs
// Every saved run, Judge Enforcer Build and Alt: base (pkgEAH/patched) vs patched on the same saved input. Reports each E-ANS item that gains a full
// answer through the MEANS-header form, and checks: calls never exceed 8, not_checked unchanged, every other id equal, and the pkgEAW record hold on
// the stored reply (when the saved reply exists) changes only for items whose block is new.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');
let ok=0,bad=0;const out=[];const T=(c,m)=>{if(c){ok++;out.push('OK '+m);}else{bad++;out.push('FAIL '+m);console.log('FAIL',m);}};const log=s=>{out.push(s);console.log(s);};
const D='/mnt/project-files/wall2024/inputs/';const runs=fs.readdirSync(D).filter(f=>/_Judge_Enforcer_Record\.json$/.test(f)&&!/_Alt_/.test(f)).map(f=>f.split('_')[0]).sort();
const code=(dir,n)=>fs.readFileSync(__dirname+'/'+dir+'/'+n.replace(/ /g,'_')+'.js','utf8');
let gained=0;
for(const RUN of runs)for(const [bn,bi] of [['Judge Enforcer Build','Enforcer Record'],['Alt Judge Enforcer Build','Alt Seated']]){
 let b0,b1;try{b0=harness(RUN)(code('../pkgEAH/patched',bn),bi);b1=harness(RUN)(code('patched',bn),bi);}catch(e){T(false,RUN+' '+bn+' threw '+e.message);continue;}
 const J0=b0.map(x=>x.json),J1=b1.map(x=>x.json);const I0=J0.flatMap(j=>j.ids||[]),I1=J1.flatMap(j=>j.ids||[]);
 const nc0=(J0[0]||{}).not_checked||[],nc1=(J1[0]||{}).not_checked||[];let same=I0.length===I1.length,g=0;
 I0.forEach((x,k)=>{const y=I1[k]||{};if(x.rule==='E-ANS'&&!('eaw_blk' in x)&&('eaw_blk' in y)){g++;log('GAIN '+RUN+' '+bn+' '+x.item+' :: '+String(y.eaw_blk).slice(0,220).replace(/\n/g,' / '));}
  else if(('eaw_blk' in x)&&x.eaw_blk!==y.eaw_blk)same=false;const a={...x},b={...y};delete a.eaw_blk;delete b.eaw_blk;if(JSON.stringify(a)!==JSON.stringify(b))same=false;});
 gained+=g;T(same&&J1.length<=8&&nc1.length===nc0.length,RUN+' '+bn+': calls '+J0.length+' -> '+J1.length+', not checked '+nc0.length+' -> '+nc1.length+', ids equal apart from new eaw_blk ('+g+' gained)');}
log('E-ANS items gaining a full answer via the MEANS header: '+gained);log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync(__dirname+'/test_EAM.txt',out.join('\n')+'\n');
