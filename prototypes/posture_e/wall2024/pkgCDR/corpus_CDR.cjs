// pkgCDR rev 1 (W1): the pre-panel check on every stored debate with a Final Output (inputs/*_Final_Output.json). Prints every listing for reading.
process.chdir(__dirname+'/..');const fs=require('fs');const H=require('../pkgVP3/harness.cjs');const {harness}=require('../pkgGSL/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const CAND=g(process.env.CAND||'pkgCDR/parent_s103_CDR.json');
const code=CAND.nodes.find(z=>z.name==='Close Enforcer Build').parameters.jsCode;
const runs=fs.readdirSync(H.IN).filter(f=>f.endsWith('_Final_Output.json')).map(f=>f.split('_')[0]).sort();let tot=0;
(async()=>{for(const r of runs){let F;try{const o=H.out(r,'Final Output');F=o.flat().filter(Boolean)[0].json;}catch(e){try{const x=JSON.parse(fs.readFileSync(H.IN+'/'+r+'_Final_Output.json','utf8'));F=x[x.length-1].main[0][0].json;}catch(e2){console.log(r+' no Final Output');continue;}}
 let B;try{B=(await harness(r,{'Final Output':[[{json:F}]].flat(),'Resolve Seats':[{json:{deepseek:{api_model:'deepseek-flash'}}}],'Init Seats':[{json:{run_token:r}}]})('return (async()=>{\n'+code+'\n})();','Quote Report'))[0].json;}catch(e){console.log(r+' error '+e.message.slice(0,100));continue;}
 if(B.cec_skip){console.log(r+' skip: '+B.why);continue;}const P=B.cands.filter(c=>/^P\d/.test(c.id));tot+=P.length;console.log(r+': '+P.length+' listed');
 for(const c of P)console.log('  '+c.id+' '+c.side+' LINK '+c.n+'\n    EARLIER ['+c.earlier_round+'] '+c.earlier_q.slice(0,240)+'\n    CLOSING ['+c.closing_round+'] '+c.closing_q.slice(0,300)+'\n    '+c.why);}
 console.log(runs.length+' debates, '+tot+' listings');})();
