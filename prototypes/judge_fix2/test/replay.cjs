// Replay of runs 32157, 32194, 32205, 32212: every stored panel judgment and each run's single judge. Marks (drvCheck on the judge's worked
// text) and cure verdicts (cureVerdicts, the cure reply rebuilt from the stored report as checker_fix rebuilt it) of the base (live 52b05334)
// and the new code. Three readings per seat: BASE; NEW as built (W1: an item with no RESPONSE line is UNCURED, and no stored reply has one);
// NEW+R, the same reply with one RESPONSE line added per flagged item, to show the rest of the new checker. "counted" is the checker's part
// only (every item CURED); items the stored reply never saw (the new marks) are UNCURED in NEW and NEW+R, since no cure call was made for them.
const RL=require('./replay_lib.cjs');const {fullLib}=require('./lib.cjs');const D=__dirname+'/../';
const O=fullLib(D+'base/Cure Check.js'),N=fullLib(D+'new/Cure Check.js');const rows=[];
for(const n of ['32157','32194','32205','32212']){const r=RL.run(n);const R=RL.rounds(r);
 const seats=r.judgments.map(j=>({seat:j.seat,raw:j.verdict_raw,panel:true,stored:j.drv_uncured})).concat([{seat:'single',raw:r.independent_verdict_raw,panel:false}]);
 for(const S of seats){const J=RL.judgment(S.raw,S.panel);const f=J.fields;const rep=RL.reply(J.reports);const br=O.cureBroken(J.text);
  const carried=J.reports.filter(x=>/^K-G[678]$/.test(x.rule)).map(x=>({rule:x.rule,link:x.item,status:x.status,why:'carried'}));
  const side=(lib,addResp)=>{const d=lib.drvCheck(J.text,f.conceded_links,f.challenger_conceded_links,f.defense_standing,f.challenge_standing,false);
   let reply=J.reports.length?rep:{ok:false,why:'no cure reply stored'};
   if(addResp&&reply.ok)reply={ok:true,text:reply.text+'\n'+d.items.map(x=>'RESPONSE: '+lib.cureLabel(x)+' | I accept the mark; replay line added to test the rest of the check.').join('\n')};
   const v=d.items.length?lib.cureVerdicts(d.items,reply,br,R):[];return {marks:d.items.map(x=>x.rule+' '+(x.link||x.side)),v:v.concat(carried)};};
  const a=side(O,false),b=side(N,false),c=side(N,true);const unc=v=>v.filter(x=>x.status!=='CURED').map(x=>x.rule+' '+(x.link||x.side));
  rows.push({run:n,seat:S.seat,stored:S.panel?S.stored:'-',a,b,c,ua:unc(a.v),ub:unc(b.v),uc:unc(c.v),
   ch:c.v.filter(x=>{const y=a.v.find(z=>z.rule===x.rule&&(z.link||z.side)===(x.link||x.side));return y&&y.status!==x.status;}).map(x=>x.rule+' '+(x.link||x.side)+' -> '+x.status+': '+String(x.why||'').slice(0,140))});}}
console.log('run   seat      stored | BASE uncured counted | NEW uncured counted | NEW+R uncured counted');
for(const x of rows){console.log(`${x.run} ${x.seat.padEnd(8)} ${String(x.stored).padStart(6)} | ${String(x.ua.length).padStart(4)} ${x.ua.length?'NO ':'yes'}         | ${String(x.ub.length).padStart(3)} ${x.ub.length?'NO ':'yes'}         | ${String(x.uc.length).padStart(3)} ${x.uc.length?'NO ':'yes'}`);
 console.log('      base uncured: '+(x.ua.join(', ')||'-'));console.log('      NEW+R uncured: '+(x.uc.join(', ')||'-'));for(const c of x.ch)console.log('      status changed (base -> NEW+R): '+c);}
