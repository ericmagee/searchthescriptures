// pkgKW probe: K-W items raised by kwLines421, base vs pkgKW, on each corpus run's own rounds (fixture prompt, ciRounds).
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');
const mk=p=>{const AM=rd(p+'/Alternate_Merge.js');return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {kwLines421,ciRounds,gatePromptText2024};')(()=>{throw 0},null);};
const O=mk(process.argv[2]||'pkgKC2/patched'),N=mk(process.argv[3]||'pkgKW/patched');const out={runs:[]};
for(const f of fs.readdirSync('corpus').filter(f=>/^fix_\d+\.json$/.test(f)).sort()){const X=JSON.parse(rd('corpus/'+f));const PT=O.gatePromptText2024(X.PB.judges[0].body);const R=O.ciRounds(PT);
 const a=O.kwLines421('',R).items.filter(x=>x.rule==='K-W'),b=N.kwLines421('',R).items.filter(x=>x.rule==='K-W');const kb=new Set(b.map(x=>x.link+'|'+x.line));
 const gone=a.filter(x=>!kb.has(x.link+'|'+x.line)),added=b.filter(x=>!new Set(a.map(y=>y.link+'|'+y.line)).has(x.link+'|'+x.line));
 out.runs.push({run:f.slice(4,9),before:a.length,after:b.length,gone:gone.map(x=>x.link+' :: '+x.line),added:added.map(x=>x.link+' :: '+x.line)});}
for(const r of out.runs){console.log(r.run+': K-W items '+r.before+' -> '+r.after);r.gone.forEach(g=>console.log('   - '+g.slice(0,200)));r.added.forEach(g=>console.log('   + '+g.slice(0,200)));}
module.exports=out;
