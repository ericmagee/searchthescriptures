const fs=require('fs');
const d=JSON.parse(fs.readFileSync('nodes/Close_Enforcer_Build.json'))[0].data.main[0][0].json;
const o=Object.assign({},d);const msgs=d.body.messages;o.body=Object.assign({},d.body,{messages:msgs.map(m=>({role:m.role,len:m.content.length}))});
console.log(JSON.stringify(o,null,1).slice(0,12000));
fs.writeFileSync('ceb_sys.txt',msgs[0].content);fs.writeFileSync('ceb_user.txt',msgs[1].content);
