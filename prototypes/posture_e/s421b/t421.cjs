const fs=require('fs');const [,,nodeFile,pl]=process.argv;let c=fs.readFileSync(nodeFile,'utf8');
const cut=c.indexOf("const PP=$('Panel Payloads')");c=c.slice(0,cut);
const f=new Function('$','$execution',c+';return {cureRecompute,cureJText,cureRewrite};');
const X=f(()=>{throw new Error('no $')},{id:1});
const P=JSON.parse(fs.readFileSync(pl,'utf8'));
for(const p of P.final){const F0={verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links};
 const rc=X.cureRecompute(p.judge_seat,X.cureJText(p.verdict_raw,true),F0,[],[],null);
 console.log(p.judge_seat,'->',rc?JSON.stringify({trig:rc.trig,result:rc.result,result0:rc.result0,fields:rc.fields}):'null');
 if(rc&&rc.trig.includes('TIE (KB-0030)')){const nr=X.cureRewrite(p.verdict_raw,true,rc,p.judge_seat,F0);console.log('   RESULT line now:',(nr.match(/RESULT\s*:[^"\\]{0,200}/)||[''])[0]);console.log('   audit:',(nr.match(/\[AUDIT v25: RECOMPUTED AFTER CURE[^\]]{0,300}/g)||[]).slice(-1)[0]);}}
