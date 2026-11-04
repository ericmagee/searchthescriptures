// node tjeb.cjs <exec.json>: runs Judge Enforcer Build on a saved execution's Panel Cure Check and cure rounds
const fs=require('fs');const e=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const rd=e.data.resultData.runData;
const one=n=>{const r=rd[n];return r?r[0].data.main[0]:null;};
const $=n=>{if(n==='Resolve Seats')return {first:()=>({json:{deepseek:{api_model:'deepseek-x',max_tokens:8000}}})};const it=one(n);return {isExecuted:!!it,first:()=>it?it[0]:{json:{}},all:()=>it||[]};};
const src=fs.readFileSync(__dirname+'/../new/Judge Enforcer Build.js','utf8');
const out=new Function('$','$input',src)($,{first:()=>({json:{}})}).map(x=>x.json);
if(out[0].je_skip){console.log('SKIP',out[0].why);process.exit();}
console.log('calls',out.length,'counts',JSON.stringify(out[0].counts),'ids',out.reduce((a,x)=>a+x.ids.length,0),'sizes',out.map(x=>JSON.stringify(x.body).length).join('+'));
const u=out.map(x=>x.body.messages[1].content).join('\n');fs.writeFileSync(__dirname+'/je_user.txt',u);
for(const k of ['ITEM V1','ITEM V2','ITEM V3']){const i=u.indexOf(k);if(i>=0)console.log(u.slice(i,i+900),'\n');}
