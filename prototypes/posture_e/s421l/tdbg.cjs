const fs=require('fs');let c=fs.readFileSync(process.argv[2],'utf8');c=c.slice(0,c.indexOf("const PP=$('Panel Payloads')"));
const X=new Function('$','$execution',c+';return {cureRecompute,cureJText,rcLines};')(()=>{throw 0},{id:1});
const ex=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));const pc=ex.data.resultData.runData['Panel Payloads'][0].data.main[0][0].json;
pc.bodies.forEach(b=>{const p=JSON.parse(b).payload;if(p.judge_seat!=='gemini')return;const t=X.cureJText(p.verdict_raw,true);const P=X.rcLines(t);
 console.log('text head',JSON.stringify(t.slice(0,120)),'\ncol',P.col.length,'result',P.result&&P.result.u.slice(0,40),'st',Object.keys(P.st));
 const F0={verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links};console.log(F0);
 const rc=X.cureRecompute('gemini',t,F0,[],[],null);console.log(rc&&{trig:rc.trig,result:rc.result});});
