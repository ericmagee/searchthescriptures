// ASK 397 plants on run 38661: mutate the stored Panel Cure Check bodies (verdict_raw), then replay from Send Back Build (x 261) in both chains.
// chatgpt (a sent seat): BOTH forms + over the 60-item cap (65 COLLISION STANDS lines with no fit, then 2 more LINK STATE STANDS lines with no fit, beside its real D1, D2)
// haiku (no panel request, so every item is a NULL non-TRIAL not-sent row): LINK STATE only (1 planted line beside its real D1)
// sol (a sent seat): none (no change)
const fs=require('fs');const E=JSON.parse(fs.readFileSync('run/exec_38661.json'));const RD=E.data.resultData.runData;
const o=RD['Panel Cure Check'][0].data.main[0][0].json;
const Q='GROUND: [L1] Genesis 1:1 "In the beginning God created the heaven and the earth."';
const add={haiku:['D8: STANDS -- '+Q],chatgpt:[]};
for(let i=10;i<75;i++)add.chatgpt.push('D'+i+' vs C'+i+': STANDS -- '+Q);
add.chatgpt.push('D7: STANDS -- '+Q,'D9: STANDS -- '+Q);
o.bodies=o.bodies.map(b=>{const x=JSON.parse(b);const s=x.payload.judge_seat;if(add[s])x.payload.verdict_raw=String(x.payload.verdict_raw)+'\n'+add[s].join('\n');return JSON.stringify(x);});
fs.writeFileSync('a397/exec_38661_plant.json',JSON.stringify(E));console.log('planted',Object.entries(add).map(([k,v])=>k+' '+v.length).join(', '));
// variant SILENT=1: chatgpt's stored send-back reply (Send Back Call openrouter, item 1, model terra) is blanked, so the silence rule fires for its sent items
if(process.env.SILENT){const c=RD['Send Back Call openrouter'][0].data.main[0][1].json;c.choices[0].message.content='';fs.writeFileSync('a397/exec_38661_plant_silent.json',JSON.stringify(E));console.log('silent variant: chatgpt reply blanked');}
