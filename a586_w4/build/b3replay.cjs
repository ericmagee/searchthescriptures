// B3 replay (W3 criterion: a replay of 1272 with the retraction applied gives one result in all three places). Offline; stored data only.
// Runs the built sbApply2024 (Gate Record) of pre-587 (196402d0) and 587 live (7536d7bf) on judgment 1272 with gemini's send-back answers S1 to S17 (enforcer log 53156-53172),
// then ert386 (the v61 tag) on the applied text with the derived fields.
const fs=require('fs');process.chdir(__dirname);const G=require('./gatefn.cjs');
const A=JSON.parse(fs.readFileSync('data/gemini_sendback_42071.json'));const JD=JSON.parse(fs.readFileSync('data/judgments_1272_1274.json'));const r=(Array.isArray(JD)?JD:Object.values(JD)).find(x=>x.id==1272);
const F={verdict_tag:r.verdict_tag,defense_standing:r.defense_standing,challenge_standing:r.challenge_standing,conceded_links:r.conceded_links,challenger_conceded_links:r.challenger_conceded_links};
const t=String(r.verdict_raw).replace(/\\n/g,'\n').replace(/\\+"/g,'"');const lines=t.split('\n');const n=s=>String(s||'').replace(/\\+"/g,'"').replace(/\s+/g,' ').trim();
const cut=process.argv[2]==='cut';
const its=A.filter(a=>a.id>=53156&&a.id<=53172).map((a,i)=>{const sid='S'+(i+1);const rl=n(a.rl);const keep=/\|\|\s*KEEP\s*\|\|/.test(rl);const to=(rl.match(/CHANGE TO:\s*(.*?)(?:\s*\|\|\s|$)/)||[])[1]||null;
 const fl=n(a.fl);const whole=lines.find(l=>n(l).startsWith(fl.slice(0,Math.min(fl.length,1490))));const line=cut?String(a.fl):(whole||String(a.fl));return {ans:keep?'KEEP':'CHANGE',sid,line,to,rule:a.rule,item:a.item,seat:'gemini'};});
const out={};
for(const [lab,f] of [['pre-587 (196402d0)','live_eng.json'],['587 live (7536d7bf)','live587_eng.json']]){
 const o=G(f,'Gate Record',{'Close Enforcer Record':{cec:{confirmed:[{side:'CHALLENGER',link:1,why:'42071 row 52867'}]}}});
 const res=o.sbApply2024('gemini',r.verdict_raw,F,its,{});
 const v61=(()=>{const s=String(o.ert386(res.text,'gemini',res.fields||F));const i=s.lastIndexOf('[AUDIT v61: ENGINE RESULT');return s.slice(i,s.indexOf('END]',i)+4);})();
 const judge=(String(res.text).split('\n').filter(l=>/^\s*\**RESULT\s*:/.test(l)).pop()||'').slice(0,60);
 out[lab]={applied:res.applied,not_applied:(res.items||[]).filter(x=>/NOT APPLIED/.test(x.kind)).map(x=>x.sid+' '+x.kind+': '+String(x.why||'').slice(0,90)),items:(res.items||[]).map(x=>x.sid+' '+x.kind),fields:res.fields,result:res.result,judge_line:judge,v61_word:(v61.match(/WORD: ([A-Z ]+);/)||[])[1],v61};
}
console.log(JSON.stringify({mode:cut?'lines as stored in the log (cut at 1,500)':'whole lines from the judgment',...out},null,1));
