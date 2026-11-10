// W2 grade of pkgCDF: hint link vs true link on K cases; then Record on a CONFIRMED answer copying the hint link (what breaks), CDR rev 11 vs CDF.
process.chdir(__dirname+'/../..');const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const W={R11:g('pkgCDR/parent_s103_CDR.json'),CDF:g('pkgCDF/parent_s103_CDR11_CDF.json')};
const code=(w,n)=>w.nodes.find(z=>z.name===n).parameters.jsCode;const J=x=>({json:x});const cl=x=>JSON.parse(JSON.stringify(x));
const FO=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_Final_Output.json','utf8'))[0].data.main[0];
const reply=t=>[J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]})];const RE=/register stops at Joseph/;
(async()=>{for(const c of JSON.parse(fs.readFileSync(__dirname+'/link_cases.json','utf8')).cases){const fo=cl(FO);fo[0].json[c.round]+='\n\n'+c.add;fo[0].json[c.close]+='\nThe register stops at Joseph.';
 const out=[];for(const [k,w] of Object.entries(W)){const run=async(cd,over,inp)=>(await harness('34108',Object.assign({'Final Output':fo},over||{}))('return (async()=>{\n'+cd+'\n})();',inp||'Quote Report'))[0].json;
  const B=await run(code(w,'Close Enforcer Build'));const h=B.cands.find(x=>x.side===c.side&&RE.test(x.earlier_q));if(!h){out.push(k+': no hint');continue;}
  const line='CLOSE-CONTRADICTION: '+h.id+' -- '+h.side+' -- LINK '+h.n+' -- CONFIRMED -- EARLIER ['+h.earlier_round+'] "'+h.earlier_q+'" -- CLOSING ['+h.closing_round+'] "The register stops at Joseph." -- copies the hint link.';
  const R=await run(code(w,'Close Enforcer Record'),{'Close Enforcer Build':[J(B)],'Close Enforcer Call deepseek':reply(line)},'Close Enforcer Call deepseek');
  const r=R.cec.rows.find(x=>x.id===h.id)||{};out.push(k+': hint LINK '+h.n+(h.n===c.true_link?' (right)':h.n==='?'?' (?)':' (WRONG)')+'; answer copying it -> '+r.status+(R.cec.confirmed.length?' BREAKS LINK '+R.cec.confirmed.map(x=>x.link).join(','):' breaks nothing')+(r.note&&/RECORD-ONLY/.test(r.note)?' [RECORD-ONLY FOR REVIEW]':''));}
 console.log(c.id+' true link '+c.true_link+' ('+c.note+')\n   '+out.join('\n   '));}})();
