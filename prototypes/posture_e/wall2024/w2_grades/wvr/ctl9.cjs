const fs=require('fs');let t=fs.readFileSync(process.argv[2]||'runs.txt','utf8');try{t=JSON.parse(t).result}catch(e){}
let rows=JSON.parse(t.slice(t.indexOf('[{'),t.lastIndexOf('}]')+2));if(rows[0].json_agg)rows=rows[0].json_agg;
const node=f=>JSON.parse(fs.readFileSync(f)).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
const run=(code,F)=>new Function('$',code)(nm=>({first:()=>({json:nm==='Init Seats'?{run_token:F.t}:nm==='Resolve Seats'?{deepseek:{api_model:'ds'}}:F}),isExecuted:false}));
const D=(f,F)=>run(node(f),F).find(o=>o.json.side==='DEFENDER').json;
const F=rows.find(r=>/33083/.test(r.t));const b9=D('/mnt/project-files/wall2024/parent_s160_WVR9.json',F),b2=D('/mnt/project-files/wall2024/parent_s158_WVR2.json',F);
const u9=b9.body.messages[1].content;
// rev 9 note on 33083 X1: the text from "This note is for" to the end of that line
const s0=u9.indexOf('This note is for X');const e0=u9.indexOf('\n',s0);let NOTE=u9.slice(s0,e0<0?undefined:e0);
console.log('rev9 33083 note:',NOTE);
const u2=b2.body.messages[1].content;const x2=u2.indexOf('X2 -- ');const line=u2.slice(x2,u2.indexOf('\n',x2));
// rebuild the note for the control pair: X2, Luke 1:27, LINK 3, keeping rev 9 wording; source verse/link in rev9 note for 33083
console.log('rev2 X2 line:',line.slice(0,200));
fs.writeFileSync('note9_33083.txt',NOTE);
console.log('join:',JSON.stringify(u9.slice(s0-90,s0)));
const N2=NOTE.replace('for X1 only','for X2 only').split('Galatians 4:4').join('Luke 1:27').replace('LINK 5','LINK 3');
const nl=u2.indexOf('\n',x2);const join=u9.slice(s0-2,s0);const u2c=u2.slice(0,nl)+join+N2+u2.slice(nl);
const body=JSON.parse(JSON.stringify(b2.body));body.messages[1].content=u2c;fs.writeFileSync('ctl9_body.json',JSON.stringify(body));
console.log('N2:',N2);console.log('join used',JSON.stringify(join),'+',u2c.length-u2.length,'total',body.messages.map(m=>m.content.length).reduce((a,b)=>a+b),'sha',require('crypto').createHash('sha256').update(JSON.stringify(body)).digest('hex').slice(0,16));
