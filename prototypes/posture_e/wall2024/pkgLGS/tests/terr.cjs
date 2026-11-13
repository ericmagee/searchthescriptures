const fs=require('fs');const {harness}=require('/home/claude/searchthescriptures/prototypes/posture_e/wall2024/pkgGSL/harness.cjs');
const S=process.env.LGS_DIR||(__dirname+'/out/');const U=process.env.LIVE_UN||(__dirname+'/live_un/');const wrap=f=>'return (async()=>{\n'+fs.readFileSync(f,'utf8')+'\n})();';
(async()=>{const L=JSON.parse(fs.readFileSync(S+'lgb_33627_panel.json'));const o=await harness('33627',{'Late Gate Build':L,'Late Gate Call openrouter':[{json:{error:{message:'429 rate limited'}}}]})(wrap(S+'new/Gate_Record.js'),'Late Gate Call openrouter');
const j=o[0].json;console.log(JSON.stringify(j.gate.seats));j.gate_rows.filter(r=>/^LATE/.test(r.item)).forEach(r=>console.log(r.item,r.cure_status,r.reply_error));
console.log(JSON.parse(j.bodies[0]).payload.verdict_raw.split('\n').filter(l=>/E-GATE LATE/.test(l)).join('\n'));})();
