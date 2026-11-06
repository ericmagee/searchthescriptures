const L=require('./lib.cjs')(process.argv[2]||'../merged_PWQA/Panel_Payloads.js');
const fs=require('fs');const PB=JSON.parse(fs.readFileSync('fixture_32980_panelbuild_item0.json','utf8'));const jd=PB.judges.find(j=>j.seat==='chatgpt');
const vr=JSON.parse(fs.readFileSync('fixture_32980_chatgpt.json','utf8')).verdict_raw;const v=JSON.parse(vr.slice(0,vr.lastIndexOf('}')+1));
const PT=L.drvPromptText(jd.body);const R=L.ciRounds(PT);console.log('rounds',Object.keys(R||{}));
const r=L.krulLines2024(v.reasoning,R,{DEFENDER:v.counted_premises_defender,CHALLENGER:v.counted_premises_challenger},L.krulAcc(jd.body),PT);
r.items.forEach(x=>console.log(x.link,'|',x.line));
