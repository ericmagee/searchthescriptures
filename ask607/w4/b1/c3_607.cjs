// ASK 607 C3 (W4): the send-back stage is unchanged. sbApply2024 (Gate Record, as built) on judgment 1272 with gemini's send-back answers S1 to S17 of run 42071 (r607 harness),
// lines whole and cut at 1,500 (cut gives the S13 form refusal), base 94b682a0 against target. Equal except the rfs field on a form-refused item.
const fs=require('fs');const B='/mnt/project-files/ask586/w4/build/';const G=require(B+'gatefn.cjs');const H=__dirname;process.chdir(B);
const A=JSON.parse(fs.readFileSync(B+'data/gemini_sendback_42071.json'));const JD=JSON.parse(fs.readFileSync(B+'data/judgments_1272_1274.json'));const r=(Array.isArray(JD)?JD:Object.values(JD)).find(x=>x.id==1272);
const F={verdict_tag:r.verdict_tag,defense_standing:r.defense_standing,challenge_standing:r.challenge_standing,conceded_links:r.conceded_links,challenger_conceded_links:r.challenger_conceded_links};
const t=String(r.verdict_raw).replace(/\\n/g,'\n').replace(/\\+"/g,'"');const lines=t.split('\n');const n=s=>String(s||'').replace(/\\+"/g,'"').replace(/\s+/g,' ').trim();
const mk=cut=>A.filter(a=>a.id>=53156&&a.id<=53172).map((a,i)=>{const sid='S'+(i+1);const rl=n(a.rl);const keep=/\|\|\s*KEEP\s*\|\|/.test(rl);const to=(rl.match(/CHANGE TO:\s*(.*?)(?:\s*\|\|\s|$)/)||[])[1]||null;
 const fl=n(a.fl);const whole=lines.find(l=>n(l).startsWith(fl.slice(0,Math.min(fl.length,1490))));return {ans:keep?'KEEP':'CHANGE',sid,line:cut?String(a.fl):(whole||String(a.fl)),to,rule:a.rule,item:a.item,seat:'gemini'};});
let fail=0;const ok=(b,m)=>{console.log((b?'PASS ':'FAIL ')+m);if(!b)fail++;};
const ex={'Close Enforcer Record':{cec:{confirmed:[{side:'CHALLENGER',link:1,why:'42071 row 52867'}]}}};
const ob=G(H+'/base_moMxiV4Irg1uRBZN.json','Gate Record',ex),ot=G(H+'/target_engine_607.json','Gate Record',ex);
for(const cut of [false,true]){const b=ob.sbApply2024('gemini',r.verdict_raw,F,mk(cut),{}),tt=ot.sbApply2024('gemini',r.verdict_raw,F,mk(cut),{});
 const strip=x=>JSON.stringify({...x,items:(x.items||[]).map(i=>{const {rfs,...k}=i;return rfs==='pkgFRM'?k:i;})});const frm=(tt.items||[]).filter(i=>i.rfs==='pkgFRM').map(i=>i.sid);
 console.log((cut?'lines cut at 1,500':'lines whole')+': applied '+(b.applied||[]).length+' / '+(tt.applied||[]).length+'; items '+(b.items||[]).map(i=>i.sid+' '+i.kind).join(', ')+'; result '+b.result+' / '+tt.result+'; pkgFRM marked: '+(frm.join(', ')||'none'));
 ok(strip(tt)===JSON.stringify(b),(cut?'cut':'whole')+': applied list, items, text and result equal old and new, except rfs pkgFRM on '+(frm.join(', ')||'no item'));
 ok(cut?frm.length===1&&frm[0]==='S13':frm.length===0,(cut?'cut':'whole')+': the form-refused item carries the mark and no other item does');}
console.log(fail?'FAILURES: '+fail:'C3 ALL PASS');
