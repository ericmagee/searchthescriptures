// Replay of runs 32157, 32194, 32205, 32212: for every stored judgment (debate_judgments joined to debate_results by debate_id) and each
// run's single judge (independent_verdict_raw), the marks and the cure verdicts of the base (live de2c7688) and new checker code.
// Marks: drvCheck on the judge's worked text (panel: the payload's reasoning; single: the raw reply before the audit lines).
// Cure: cureVerdicts on those items, with the cure reply rebuilt from the stored report (its STATEMENT and JUDGE STATEMENT fields, which the
// node cut at 600 characters) and the rounds from the row's columns. K-G6, K-G7 and K-G8 items come from other code and are carried with
// their stored status. "counted" here is the checker's part only: every item CURED. The base replay is checked item by item against the stored report.
const RL=require('./replay_lib.cjs');const {fullLib}=require('./lib.cjs');const D=__dirname+'/../';
const O=fullLib(D+'base/Cure Check.js'),N=fullLib(D+'new/Cure Check.js');
const rows=[];let mism=[];
for(const n of ['32157','32194','32205','32212']){const r=RL.run(n);const R=RL.rounds(r);
 const seats=r.judgments.map(j=>({seat:j.seat,raw:j.verdict_raw,panel:true,stored_uncured:j.drv_uncured})).concat([{seat:'single',raw:r.independent_verdict_raw,panel:false}]);
 for(const S of seats){const J=RL.judgment(S.raw,S.panel);const f=J.fields;const rep=RL.reply(J.reports);const br=O.cureBroken(J.text);
  const carried=J.reports.filter(x=>/^K-G[678]$/.test(x.rule)).map(x=>({rule:x.rule,link:x.item,status:x.status,why:'carried: '+x.why}));
  const side=(lib)=>{const d=lib.drvCheck(J.text,f.conceded_links,f.challenger_conceded_links,f.defense_standing,f.challenge_standing,false);
   const v=d.items.length?lib.cureVerdicts(d.items,J.reports.length?rep:{ok:false,why:'no cure reply stored'},br,R):[];return {marks:d.items.map(x=>x.rule+' '+(x.link||x.side)),v:v.concat(carried)};};
  const a=side(O),b=side(N);
  for(const x of a.v){if(/^carried/.test(x.why||''))continue;const st=J.reports.find(y=>y.rule===x.rule&&(y.item===x.link||(x.rule==='K-G3'&&y.item===x.side+' STANDING')));
   if(!st||st.status!==x.status)mism.push(n+' '+S.seat+' '+x.rule+' '+(x.link||x.side)+': stored '+(st?st.status:'no report')+', base replay '+x.status+' ('+String(x.why||'').slice(0,110)+')');}
  const storedUnc=J.reports.filter(x=>x.status!=='CURED').length;
  const unc=v=>v.filter(x=>x.status!=='CURED');
  rows.push({run:n,seat:S.seat,storedMarks:J.marks.length,storedUnc,oldMarks:a.marks,newMarks:b.marks,oldUnc:unc(a.v).map(x=>x.rule+' '+(x.link||x.side)),newUnc:unc(b.v).map(x=>x.rule+' '+(x.link||x.side)),
   changed:b.v.filter((x,i)=>{const y=a.v.find(z=>z.rule===x.rule&&z.link===x.link);return !y||y.status!==x.status;}).map(x=>x.rule+' '+x.link+' -> '+x.status+': '+String(x.why||'').slice(0,150)),
   removed:a.marks.filter(m=>!b.marks.includes(m)),added:b.marks.filter(m=>!a.marks.includes(m))});}}
for(const x of rows){console.log(`${x.run} ${x.seat.padEnd(8)} stored uncured ${x.storedUnc} | base: marks ${x.oldMarks.length}, uncured ${x.oldUnc.length} [${x.oldUnc.join(', ')}] counted ${x.oldUnc.length?'NO':'yes'} | new: marks ${x.newMarks.length}, uncured ${x.newUnc.length} [${x.newUnc.join(', ')}] counted ${x.newUnc.length?'NO':'yes'}`);
 if(x.removed.length)console.log('     marks removed: '+x.removed.join(', '));if(x.added.length)console.log('     marks added: '+x.added.join(', '));
 for(const c of x.changed)console.log('     status changed: '+c);}
console.log('\nbase replay vs stored report, items that differ: '+mism.length);for(const m of mism)console.log('  '+m);
