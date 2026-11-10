// W2 grade of pkgCDL rev 1: link forms in Close Enforcer Record. Labels (want) fixed before the run.
// want: BREAK<n> = CONFIRMED breaks link n; REVIEW = NOT CONFIRMED, marked RECORD-ONLY FOR REVIEW, nothing broken; REFUSE = NOT CONFIRMED, not marked, nothing broken;
//       READ = NOT A CONTRADICTION read by id (not NO ANSWER)
process.chdir(__dirname+'/..');const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const W=g('pkgCDL/parent_s103_CDR11_CDF_CDL.json');const code=n=>W.nodes.find(z=>z.name===n).parameters.jsCode;
const J=x=>({json:x});const FO=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_Final_Output.json','utf8'))[0].data.main[0];
const run=async(c,over,inp)=>(await harness('34108',Object.assign({'Final Output':FO},over||{}))('return (async()=>{\n'+c+'\n})();',inp||'Quote Report'))[0].json;
const reply=t=>[J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]})];
const CASES=[['L1','D6','BREAK6'],['L2','d6','BREAK6'],['L3','D-6','BREAK6'],['L4','D 6','BREAK6'],['L5','6 (D6)','REVIEW'],['L6','D6 (keystone)','REVIEW'],['L7','2, 6','REVIEW'],['L8','2 and 6','REVIEW'],
 ['L9','D9','REFUSE'],['L10','9','REFUSE'],['L11','C6','REVIEW'],['L12','**D6**','BREAK6'],['L13','6.','REVIEW'],['L14','#6','REVIEW'],['L15','Link 6','REVIEW'],['L16','D06','BREAK6'],
 ['L17','0','REFUSE'],['L18','D6 -- D5','REVIEW'],['L19','6','BREAK6'],['L20','N/A','REVIEW'],['L21','keystone','REVIEW'],['L25','the keystone link of the whole chain','REVIEW']];
(async()=>{const B=await run(code('Close Enforcer Build'));const D6=B.cands.find(c=>/no biological father/.test(c.earlier_q));let ok=0,bad=0;
 const rec=async t=>run(code('Close Enforcer Record'),{'Close Enforcer Build':[J(B)],'Close Enforcer Call deepseek':reply(t)},'Close Enforcer Call deepseek');
 const line=(side,link,ans)=>'CLOSE-CONTRADICTION: '+D6.id+' -- '+side+' -- LINK '+link+' -- '+ans+' -- EARLIER [CR3] "'+D6.earlier_q+'" -- CLOSING [CR4] "Christ had no biological father." -- why.';
 const out=(R)=>{const r=R.cec.rows.find(x=>x.id===D6.id);if(!r)return R.cec.no_answer.includes(D6.id)?'NO ANSWER':'?';if(R.cec.confirmed.length)return 'BREAK'+R.cec.confirmed.map(x=>x.link).join(',');if(r.status==='NOT A CONTRADICTION')return 'READ';return /RECORD-ONLY/.test(r.note||'')?'REVIEW':'REFUSE';};
 for(const [id,lk,want] of CASES){const R=await rec(line('DEFENDER',lk,'CONFIRMED'));const got=out(R);const r=R.cec.rows.find(x=>x.id===D6.id)||{};const g2=got===want;g2?ok++:bad++;console.log((g2?'OK   ':'FAIL ')+id+' DEFENDER LINK '+JSON.stringify(lk)+' CONFIRMED want '+want+' got '+got+' | note: '+String(r.note||'').slice(-160));}
 // challenger side: D6 on a challenger line must not break; read NOT A CONTRADICTION forms
 {const R=await rec(line('CHALLENGER','D6','CONFIRMED'));const got=out(R);const g2=!R.cec.confirmed.length;g2?ok++:bad++;console.log((g2?'OK   ':'FAIL ')+'L22 CHALLENGER LINK D6 on the defender hint CONFIRMED breaks nothing, got '+got);}
 for(const lk of ['D-6','6 (D6)','2, 6','N/A']){const R=await rec(line('DEFENDER',lk,'NOT A CONTRADICTION').replace('"Christ had no biological father."','""'));const got=out(R);const g2=got==='READ';g2?ok++:bad++;console.log((g2?'OK   ':'FAIL ')+'L23 NOT A CONTRADICTION with LINK '+JSON.stringify(lk)+' read by id, got '+got);}
 // two lines on the same hint: one LINK D6 CONFIRMED, one LINK D5 CONFIRMED
 {const R=await rec(line('DEFENDER','D6','CONFIRMED')+'\n'+line('DEFENDER','D5','CONFIRMED'));console.log('INFO L24 two CONFIRMED lines on one hint (D6, D5): confirmed links '+JSON.stringify(R.cec.confirmed.map(x=>x.link))+' rows '+JSON.stringify(R.cec.rows.map(x=>x.id+' '+x.status+' L'+x.link)));}
 console.log(ok+' OK, '+bad+' FAIL');})();
