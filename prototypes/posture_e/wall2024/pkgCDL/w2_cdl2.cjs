// W2 grade of pkgCDL rev 2: two CONFIRMED lines on one candidate. Expectations fixed before the run (what a rightful ruling is):
// M1 a contradiction whose earlier sentence holds two declared links' wording, answered on both links: both breaks are rightful (rev 11 and live give both).
// M2 order: D5 line first, D6 (keystone) second: the keystone must still break.
// M3 the same link twice: one break, no harm.  M4 first line forged (closing quote not in CR4), second line valid: the valid line must break.
// M5 first line NOT A CONTRADICTION, second CONFIRMED on the same hint: the CONFIRMED must break (the enforcer changed its mind within the reply).
process.chdir(__dirname+'/..');const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const W=g('pkgCDL/parent_s103_CDR11_CDF_CDL.json'),R11=g('pkgCDR/parent_s103_CDR.json');
const J=x=>({json:x});const FO=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_Final_Output.json','utf8'))[0].data.main[0];
const run=async(c,over,inp)=>(await harness('34108',Object.assign({'Final Output':FO},over||{}))('return (async()=>{\n'+c+'\n})();',inp||'Quote Report'))[0].json;
const reply=t=>[J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]})];let ok=0,bad=0;
(async()=>{const res={};for(const [k,w] of [['CDL',W],['R11',R11]]){const code=n=>w.nodes.find(z=>z.name===n).parameters.jsCode;const B=await run(code('Close Enforcer Build'));const D6=B.cands.find(c=>/no biological father/.test(c.earlier_q));
 const rec=async t=>run(code('Close Enforcer Record'),{'Close Enforcer Build':[J(B)],'Close Enforcer Call deepseek':reply(t)},'Close Enforcer Call deepseek');
 const L=(link,ans,close)=>'CLOSE-CONTRADICTION: '+D6.id+' -- DEFENDER -- LINK '+link+' -- '+ans+' -- EARLIER [CR3] "'+D6.earlier_q+'" -- CLOSING [CR4] "'+close+'" -- why.';const C='Christ had no biological father.';
 const br=async t=>{const R=await rec(t);return {links:R.cec.confirmed.map(x=>x.link),rows:R.cec.rows.map(x=>x.status+' L'+x.link+(/RECORD-ONLY|review/i.test(x.note||'')?' [REVIEW]':''))};};
 res[k]={M1:await br(L(6,'CONFIRMED',C)+'\n'+L(5,'CONFIRMED',C)),M2:await br(L(5,'CONFIRMED',C)+'\n'+L(6,'CONFIRMED',C)),M3:await br(L(6,'CONFIRMED',C)+'\n'+L(6,'CONFIRMED',C)),
  M4:await br(L(5,'CONFIRMED','Christ had no father at all.')+'\n'+L(6,'CONFIRMED',C)),M5:await br(L(6,'NOT A CONTRADICTION','')+'\n'+L(6,'CONFIRMED',C))};}
 const want={M1:l=>l.includes(6)&&l.includes(5),M2:l=>l.includes(6),M3:l=>l.length>=1&&l.every(x=>x===6),M4:l=>l.includes(6),M5:l=>l.includes(6)};
 for(const m of Object.keys(want)){const g2=want[m](res.CDL[m].links);g2?ok++:bad++;console.log((g2?'OK   ':'FAIL ')+m+' CDL breaks '+JSON.stringify(res.CDL[m].links)+' rows '+JSON.stringify(res.CDL[m].rows)+' | rev 11 breaks '+JSON.stringify(res.R11[m].links));}
 console.log(ok+' OK, '+bad+' FAIL');})();
