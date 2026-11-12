const fs=require('fs');let t=fs.readFileSync(process.argv[2]||'runs.txt','utf8');try{t=JSON.parse(t).result}catch(e){}
let rows=JSON.parse(t.slice(t.indexOf('[{'),t.lastIndexOf('}]')+2));if(rows[0].json_agg)rows=rows[0].json_agg;
const node=f=>JSON.parse(fs.readFileSync(f)).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
const run=(code,F)=>new Function('$',code)(nm=>({first:()=>({json:nm==='Init Seats'?{run_token:F.t}:nm==='Resolve Seats'?{deepseek:{api_model:'ds'}}:F}),isExecuted:false}));
const F=rows.find(r=>/33083/.test(r.t));const b8=run(node('/mnt/project-files/wall2024/parent_s160_WVR8.json'),F).find(o=>o.json.side==='DEFENDER').json;const b2=run(node('/mnt/project-files/wall2024/parent_s158_WVR2.json'),F).find(o=>o.json.side==='DEFENDER').json;
const u8=b8.body.messages[1].content;const s0=u8.indexOf("By the operator's ruling");const s1=u8.indexOf('does not answer the withdrawal',s0)+30;console.log('found',s0,s1);const SENT=u8.slice(s0,s1);
const i8=u8.indexOf(SENT);console.log(JSON.stringify(SENT));
let u2=b2.body.messages[1].content;const x2=u2.indexOf('X2 -- ');const line=u2.slice(x2,u2.indexOf('\n',x2));console.log('rev2 X2 line end:',JSON.stringify(line.slice(-260)));
fs.writeFileSync('ctl_sent.txt',SENT);fs.writeFileSync('ctl_u2.txt',u2);
const nl=u2.indexOf('\n',x2);const u2c=u2.slice(0,nl)+'. '+SENT+u2.slice(nl);
const body=JSON.parse(JSON.stringify(b2.body));body.messages[1].content=u2c;
fs.writeFileSync('ctl_body.json',JSON.stringify(body));
const h=require('crypto').createHash('sha256').update(JSON.stringify(body)).digest('hex').slice(0,16);
console.log('ctl chars user',u2c.length,'+',u2c.length-u2.length,'total prompt',body.messages.map(m=>m.content.length).reduce((a,b)=>a+b),'sha',h);
console.log(JSON.stringify(u2c.slice(u2c.indexOf('X2 -- '),u2c.indexOf('\n',u2c.indexOf('X2 -- ')))).slice(-500));
let k=-1,c=0;while((k=u8.indexOf("By the operator's ruling",k+1))>=0){c++;const ls=u8.lastIndexOf('\n',k);console.log('rev8 occurrence line start:',JSON.stringify(u8.slice(ls+1,ls+120)));}
console.log('rev8 33083 occurrences',c);
