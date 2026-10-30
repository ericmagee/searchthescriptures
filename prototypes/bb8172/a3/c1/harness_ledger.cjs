// BB-8172 step 4 ledger harness: the PWL builder (pressed-witness ledger) from each node, base and new code unchanged, on one debate's
// six stored rounds. Prints every line that differs between base and new, per node and block.
// usage: node harness_ledger.cjs <rounds.json>
const fs=require('fs'),path=require('path');const R=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
function pwl(dir,name){const t=fs.readFileSync(path.join(__dirname,dir,name+'.js'),'utf8');const a=t.indexOf('const PWL=(()=>{');const e=t.indexOf('})();',a);
 if(a<0||e<0)throw new Error('no PWL in '+name);return new Function(t.slice(a,e+5)+'\nreturn PWL;')();}
const F={cr1:R.cr1,gr1:R.gr1,cr2:R.cr2,gr2:R.gr2,cr3:R.cr3,dr3:R.dr3};
const blocks={
 Panel_Build:P=>({judge:P.judgeBlock(F)}),
 Build_Independent_Verdict:P=>({judge:P.judgeBlock(F)}),
 D3_Build:P=>({cited_challenger:P.citedBlock([['round 1',R.gr1],['round 2',R.gr2]],'THE CHALLENGER')}),
 C3_Build:P=>({cited_defender:P.citedBlock([['round 1',R.cr1],['round 2',R.cr2],['round 3, the link round above',R.cr3]],'THE DEFENDER')})};
const out={};
for(const [name,fn] of Object.entries(blocks)){const b=fn(pwl('base',name)),n=fn(pwl('new',name));
 for(const k of Object.keys(b)){const bl=String(b[k]).split('\n'),nl=String(n[k]).split('\n');const diff=[];
  for(let i=0;i<Math.max(bl.length,nl.length);i++)if(bl[i]!==nl[i])diff.push({line:i,base:bl[i]===undefined?null:bl[i],new:nl[i]===undefined?null:nl[i]});
  out[name+'.'+k]={lines:nl.length,differ:diff.length,diff};}}
console.log(JSON.stringify(out,null,1));
