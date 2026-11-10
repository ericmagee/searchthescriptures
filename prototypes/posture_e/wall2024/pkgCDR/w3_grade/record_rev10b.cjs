// W3 grade of pkgCDR rev 10: link handling in Close Enforcer Record for hint answers.
process.chdir(__dirname+'/../..');const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const CAND=g('pkgCDR/parent_s103_CDR.json');const code=n=>CAND.nodes.find(z=>z.name===n).parameters.jsCode;
const J=x=>({json:x});const run=async(c,over,inp)=>(await harness('34108',over||{})('return (async()=>{\n'+c+'\n})();',inp||'Quote Report'))[0].json;
const reply=t=>[J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]})];
(async()=>{const B=await run(code('Close Enforcer Build'));const rec=async t=>run(code('Close Enforcer Record'),{'Close Enforcer Build':[J(B)],'Close Enforcer Call deepseek':reply(t)},'Close Enforcer Call deepseek');
 const D6=B.cands.find(c=>/no biological father/.test(c.earlier_q)),Q=B.cands.find(c=>c.n==='?');const CQ='Christ had no biological father.';
 const show=R=>JSON.stringify(R.cec.rows.map(r=>r.id+' '+r.status))+' confirmed '+JSON.stringify(R.cec.confirmed.map(c=>c.side+' LINK '+c.link))+' no answer '+JSON.stringify(R.cec.no_answer);
 for(const [name,line] of [
  ['X1 D6 hint (LINK 6) answered CONFIRMED under LINK 5','CLOSE-CONTRADICTION: '+D6.id+' -- DEFENDER -- LINK 5 -- CONFIRMED -- EARLIER [CR3] "'+D6.earlier_q+'" -- CLOSING [CR4] "'+CQ+'" -- x.'],
  ['X2 hint with LINK ? ('+(Q?Q.id:'none')+') answered CONFIRMED under LINK 3',Q?'CLOSE-CONTRADICTION: '+Q.id+' -- '+Q.side+' -- LINK 3 -- CONFIRMED -- EARLIER ['+Q.earlier_round+'] "'+Q.earlier_q+'" -- CLOSING [CR4] "'+CQ+'" -- x.':''],
  ['X3 hint with LINK ? answered NOT A CONTRADICTION with LINK ?',Q?'CLOSE-CONTRADICTION: '+Q.id+' -- '+Q.side+' -- LINK ? -- NOT A CONTRADICTION -- EARLIER ['+Q.earlier_round+'] "'+Q.earlier_q+'" -- CLOSING [CR4] "" -- x.':''],
  ['X4 D6 hint CONFIRMED with the earlier sentence shortened to the dropped words only','CLOSE-CONTRADICTION: '+D6.id+' -- DEFENDER -- LINK 6 -- CONFIRMED -- EARLIER [CR3] "I drop the wording "no biological father"" -- CLOSING [CR4] "'+CQ+'" -- x.'],
  ['X5 D6 hint NOT A CONTRADICTION with CLOSING [CR4] omitted','CLOSE-CONTRADICTION: '+D6.id+' -- DEFENDER -- LINK 6 -- NOT A CONTRADICTION -- EARLIER [CR3] "'+D6.earlier_q+'" -- The closing round does not assert it again.'],
 ]){if(!line)continue;const R=await rec(line);console.log(name+'\n   '+show(R).slice(0,60)+' ... '+JSON.stringify(R.cec.rows.filter(r=>!/NO ANSWER/.test(r.status)).map(r=>r.id+' '+r.status))+' confirmed '+JSON.stringify(R.cec.confirmed.map(c=>c.side+' LINK '+c.link)));}})();
