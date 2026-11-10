// W3 grade of pkgCDF: can a link the code read from a mark place a break that pkgCDR rev 11 would not place? (Record is given the same planted rounds as Build.)
process.chdir(__dirname+'/../..');const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const CDF=g('pkgCDF/parent_s103_CDR11_CDF.json'),R11=g('pkgCDR/parent_s103_CDR.json');const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;
const J=x=>({json:x});const cl=x=>JSON.parse(JSON.stringify(x));const FO=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_Final_Output.json','utf8'))[0].data.main[0];
const run=async(c,over,inp)=>(await harness('34108',over||{})('return (async()=>{\n'+c+'\n})();',inp||'Quote Report'))[0].json;
const reply=t=>[J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]})];
const drop='I drop the wording "the register stops at Joseph".',CL='The register stops at Joseph.';
(async()=>{for(const [name,lead] of [['PLANT 1: drop in [CR2] after "The challenger sets this against D5." / "On the genealogy, which is my D2 ground, I answer in a line."','The challenger sets this against D5.\nOn the genealogy, which is my D2 ground, I answer in a line.'],['PLANT 2: drop in [CR2] after "The challenger presses D5 hardest; my answer on D5 is above." (the drop is about the genealogy, not D5)','The challenger presses D5 hardest; my answer on D5 is above.']]){
  const fo=cl(FO);fo[0].json.cr2+='\n'+lead+'\n'+drop;fo[0].json.cr4+='\n'+CL;console.log(name);
  for(const [nm,W] of [['pkgCDR rev 11',R11],['pkgCDF',CDF]]){const B=await run(code(W,'Close Enforcer Build'),{'Final Output':fo});const h=B.cands.find(c=>c.earlier_q===drop);
   const line='CLOSE-CONTRADICTION: '+h.id+' -- DEFENDER -- LINK '+h.n+' -- CONFIRMED -- EARLIER [CR2] "'+drop+'" -- CLOSING [CR4] "'+CL+'" -- test.';
   const R=await run(code(W,'Close Enforcer Record'),{'Final Output':fo,'Close Enforcer Build':[J(B)],'Close Enforcer Call deepseek':reply(line)},'Close Enforcer Call deepseek');const r=R.cec.rows.find(x=>x.id===h.id)||{};
   console.log('   '+nm+': hint shows LINK '+h.n+'; the enforcer copies it and answers CONFIRMED -> '+r.status+'; links broken: '+JSON.stringify(R.cec.confirmed.map(c=>c.side+' LINK '+c.link))+(r.note?' | note: '+String(r.note).slice(0,150):''));}}})();
