// node tacb.cjs <exec.json> : runs Anticheat Build on the stored rounds (Build Save Body json as F)
const fs=require('fs');const e=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const rd=e.data.resultData.runData;
const F=rd['Build Save Body'][0].data.main[0][0].json;
const src=fs.readFileSync(__dirname+'/../new/Anticheat Build.js','utf8');
const $=(n)=>({isExecuted:n!=='Regrade Load',first:()=>({json:n==='Init Seats'?{run_token:'T'}:n==='Resolve Seats'?{deepseek:{api_model:'deepseek-x',max_tokens:8000}}:n==='Final Output'?F:{}})});
const all=new Function('$',src)($).map(x=>x.json);const out={acx_skip:all[0].acx_skip,why:all[0].why,items:all.flatMap(x=>x.items),not_checked:all[0].not_checked,chars:all.map(x=>x.body?JSON.stringify(x.body).length:0).join('+'),body:all[0].body};fs.writeFileSync(__dirname+'/acx_bodies.json',JSON.stringify(all.map(x=>x.body)));
console.log('skip',out.acx_skip,out.why||'','| items',out.items.length,'| not checked',(out.not_checked||[]).length,'| chars',out.chars);
const by={};for(const i of out.items){by[i.side]=(by[i.side]||0)+1;}console.log(by);
const u=out.body?out.body.messages[1].content:'';fs.writeFileSync(__dirname+'/acx_user.txt',u);
const i=u.indexOf('Deuteronomy 22:24');console.log(i>=0?u.slice(u.lastIndexOf('ITEM',i),u.lastIndexOf('ITEM',i)+3200):'NO 22:24 ITEM');
console.log('SENT:',out.items.map(x=>x.id+':'+x.side+':'+x.verse+(x.inR3?'*':'')).join(' | '));
console.log('NOT CHECKED:',(out.not_checked||[]).map(x=>x.side+':'+x.verse).join(' | '));
