// The 32980 fixtures shaped as the alternate chain reads them. Run from wall2024/.
const fs=require('fs');
const PB=JSON.parse(fs.readFileSync('pkgR2/fixture_32980_panelbuild_item0.json','utf8'));
const B=JSON.parse(fs.readFileSync('pkgSBP/fixture_bodies_32980.json','utf8'));
const sol=B.find(b=>b.seat==='sol');const chat=PB.judges.find(j=>j.seat==='chatgpt');
// sol's request: Alternate Build sends the removed seat's own system and user text (6904 g) under the alternate's model; sol's model id is
// not in the fixtures, so a placeholder is used (the chain reads no model behaviour offline).
const solReq={...chat.body,model:'SOL-MODEL-PLACEHOLDER'};
const body=(seat,raw,F,du)=>JSON.stringify({payload:{judge_seat:seat,verdict_raw:raw,...F,drv_uncured:du||0}});
const panelBodies=PB.judges.map(j=>{const b=B.find(x=>x.seat===j.seat);return body(j.seat,b?b.verdict_raw:'{}',b?b.fields:{},j.seat==='chatgpt'?3:0);});
const solBody=body('sol',sol.verdict_raw,sol.fields,0);
function ptext(b){return (b.messages||[]).map(m=>typeof m.content==='string'?m.content:(m.content||[]).map(p=>p.text||'').join('')).join('\n');}
module.exports={PB,B,sol,solReq,panelBodies,solBody,ptext};
