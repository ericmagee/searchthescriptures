// pkgKV probe: K-V items raised by drvVoid on each corpus seat's stored verdict (fixture prompt), base vs new library.
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');
const mk=p=>{const AM=rd(p+'/Alternate_Merge.js');return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {drvVoid,ciRounds,gatePromptText2024};')(()=>{throw 0},null);};
const O=mk(process.argv[2]||'pkgKW/patched'),N=mk(process.argv[3]||'pkgKV/patched');let tb=0,ta=0;
for(const f of fs.readdirSync('corpus').filter(f=>/^fix_\d+\.json$/.test(f)).sort()){const X=JSON.parse(rd('corpus/'+f));
 for(const [lab,G] of [['panel',X],['alt',X.alt]]){if(!G||!G.bodies)continue;const PT=O.gatePromptText2024(G.PB.judges[0].body);
  for(const b of G.bodies){const a=O.drvVoid(b.verdict_raw,PT).items,c=N.drvVoid(b.verdict_raw,PT).items;tb+=a.length;ta+=c.length;
   const kc=new Set(c.map(x=>x.link)),ka=new Set(a.map(x=>x.link));
   if(a.length||c.length)console.log(f.slice(4,9)+' '+lab+' '+b.seat+': K-V '+a.length+' -> '+c.length);
   a.filter(x=>!kc.has(x.link)).forEach(x=>console.log('   - '+x.line.slice(0,260)));
   c.filter(x=>!ka.has(x.link)).forEach(x=>console.log('   + '+x.line.slice(0,260)));
   c.filter(x=>ka.has(x.link)).forEach(x=>console.log('   = '+x.line.slice(0,260)));}}}
console.log('TOTAL K-V items '+tb+' -> '+ta);
