// Runs the published Init Seats code with the live-run body; proves it executes and shows the seats it derives.
const fs=require('fs');const code=fs.readFileSync('new/Init Seats.js','utf8');
const body=JSON.parse(fs.readFileSync('../bb8634/a3/p4/body.json','utf8'));
const cd={set(){}};const out=new Function('$input','$execution',code)({first:()=>({json:{body}})},{id:'0',customData:cd});
const o=out[0].json;console.log(JSON.stringify({defender:o.defender,challenger:o.challenger,panel_order:o.panel_order,panel_reserve:o.panel_reserve,single_judge:o.single_judge,alt_order:o.alt_order}));
