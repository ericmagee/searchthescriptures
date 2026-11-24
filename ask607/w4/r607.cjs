// ASK 607 replay (W4): enforcer row 53202 (run 42071, gemini, E-GATE G1). Offline, stored data only, read only.
// Runs the built sbApply2024 (Gate Record) of pre-587 (196402d0) and live (94b682a0) on judgment 1272 with gemini's send-back answers S1-S17 (enforcer log 53156-53172),
// (a) as sent back (S13 = the judge's retraction), and (b) with S13 replaced by the gate's own change of row 53202 ("RETRACTED: D3 vs C4"), each with the flagged lines whole and cut at 1,500.
const fs=require('fs');const B='/mnt/project-files/ask586/w4/build/';process.chdir(B);const G=require(B+'gatefn.cjs');
const A=JSON.parse(fs.readFileSync(B+'data/gemini_sendback_42071.json'));const JD=JSON.parse(fs.readFileSync(B+'data/judgments_1272_1274.json'));const r=(Array.isArray(JD)?JD:Object.values(JD)).find(x=>x.id==1272);
const F={verdict_tag:r.verdict_tag,defense_standing:r.defense_standing,challenge_standing:r.challenge_standing,conceded_links:r.conceded_links,challenger_conceded_links:r.challenger_conceded_links};
const t=String(r.verdict_raw).replace(/\\n/g,'\n').replace(/\\+"/g,'"');const lines=t.split('\n');const n=s=>String(s||'').replace(/\\+"/g,'"').replace(/\s+/g,' ').trim();
const mk=(cut,gate)=>A.filter(a=>a.id>=53156&&a.id<=53172).map((a,i)=>{const sid='S'+(i+1);const rl=n(a.rl);const keep=/\|\|\s*KEEP\s*\|\|/.test(rl);let to=(rl.match(/CHANGE TO:\s*(.*?)(?:\s*\|\|\s|$)/)||[])[1]||null;
 const fl=n(a.fl);const whole=lines.find(l=>n(l).startsWith(fl.slice(0,Math.min(fl.length,1490))));const line=cut?String(a.fl):(whole||String(a.fl));
 if(gate&&sid==='S13')to='RETRACTED: D3 vs C4';return {ans:keep?'KEEP':'CHANGE',sid,line,to,rule:a.rule,item:a.item,seat:'gemini'};});
const s13=A.filter(a=>a.id>=53156&&a.id<=53172)[12];console.log('S13 stored answer (row '+s13.id+'):',n(s13.rl).slice(0,200));
for(const [lab,f] of [['pre-587 196402d0',B+'live_eng.json'],['live 94b682a0','/mnt/project-files/ask608/w4/write/fetchback_eng_608.json']]){
 const o=G(f,'Gate Record',{'Close Enforcer Record':{cec:{confirmed:[{side:'CHALLENGER',link:1,why:'42071 row 52867'}]}}});
 if(o.__fail.length)console.log(lab,'load faults:',o.__fail.slice(0,3));
 for(const cut of [false,true])for(const gate of [false,true]){const res=o.sbApply2024('gemini',r.verdict_raw,F,mk(cut,gate),{});
  const s=(res.items||[]).find(x=>x.sid==='S13');const fo=String(res.text).split('\n').filter(l=>/FORCED\s*:\s*D3\s+vs\.?\s+C4/i.test(l));
  console.log(lab,'|',cut?'lines cut at 1,500':'lines whole','|',gate?'S13 = gate change of 53202':'S13 as sent back','| S13',(res.applied||[]).includes('S13')?'APPLIED':(s?s.kind+': '+String(s.why).slice(0,110):'not listed'),'| FORCED D3 vs C4 lines left:',fo.length,'| result',res.result);}}
