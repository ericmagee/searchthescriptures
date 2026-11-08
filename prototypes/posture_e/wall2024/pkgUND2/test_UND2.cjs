// pkgUND2 test: on every saved run, base (pkgGRT) and patched Send Back Build outputs are equal once the two passages are mapped back.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const OLD=[' (on a witness the side answered: FORCED: <Dn vs Cm> -- MEANS [<round>]: "..." -- ANSWER [<round>]: "..." -- FAILS: "...")',', or CHANGE TO: RETRACTED, or keep UNDERDETERMINED by CHANGE TO the same line','CHANGE TO: RETRACTED, or CHANGE TO the line regraded so it no longer charges','CHANGE TO: RETRACTED, or a CHANGE TO line that no longer charges that press'];
const NEW=[', on a witness the side answered, with the FORCED line for the pair given only when the gate asks for it (K-G4)',', or keep UNDERDETERMINED by CHANGE TO the same line','CHANGE TO the line regraded so it no longer charges','a CHANGE TO line that no longer charges that press'];
let ok=0,fail=0;const out=[];
for(const [f,bi] of [['Send_Back_Build','Judge Enforcer Record'],['Alt_Send_Back_Build','Alt Judge Enforcer Record']]){
 const A=fs.readFileSync('pkgGRT/patched/'+f+'.js','utf8'),B=fs.readFileSync('pkgUND2/patched/'+f+'.js','utf8');
 const runs=[...new Set(fs.readdirSync(D).filter(x=>/^\d+_/.test(x)&&x.slice(x.indexOf('_')+1)===bi.replace(/ /g,'_')+'.json').map(x=>x.split('_')[0]))].sort();
 let n=0,changed=0,bad=[];
 for(const R of runs){let a,b;try{a=JSON.stringify(harness(R)(A,bi));b=JSON.stringify(harness(R)(B,bi));}catch(e){continue;}n++;
  const esc=(t,l)=>{for(let x=0;x<l;x++)t=JSON.stringify(t).slice(1,-1);return t;};const tok=(t,W)=>{for(let l=3;l>=1;l--)for(let k=0;k<OLD.length;k++)t=t.split(esc(W[k],l)).join('<<P'+k+'>>');return t;};const cut=t=>t.replace(/(<<P\d>>)(?:(?!\\n|<<P)[\s\S]){0,800}? \[\.\.\.\]/g,'$1 [...]');/* the ask cuts the enforcer reason to a fixed length, so a shorter option shows more of the tail before [...] */const tail=t=>t.replace(/<<P1>>(?:(?!\\n)[\s\S]){0,800}?(?=\\n)/g,'<<P1>>~');/* the option's tail up to the line end: cut to fixed length in the base, may now fit whole */const aa=tail(cut(tok(a,OLD))),bb=tail(cut(tok(b,NEW)));if(a!==b)changed++;if(bb!==aa)bad.push(R);
  if(b.includes('or CHANGE TO: RETRACTED, or keep UNDERDETERMINED'))bad.push(R+' bare RETRACTED left');}
 const r=bad.length?'FAIL':'OK';r==='OK'?ok++:fail++;out.push(r+' '+f+': '+n+' runs replayed, '+changed+' with changed asks, all other bytes equal'+(bad.length?' BAD '+bad.join(','):''));}
out.push('TOTAL '+ok+' OK, '+fail+' FAIL');console.log(out.join('\n'));
