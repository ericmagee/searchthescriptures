const {run,rd,U}=require('./w3_KSR_ECB.cjs');(async()=>{
 const show=(t,gb)=>{console.log('--- '+t);gb.forEach(x=>{const j=x.json;console.log(Object.keys(j).join(','));(j.items||j.gate_items||[]).forEach(i=>console.log('   '+JSON.stringify(i).slice(0,330)));});};
 show('stored Gate Build',rd['Gate Build'][0].data.main[0]);
 console.log('GATE REPLY',JSON.stringify(rd['Gate Call openrouter'][0].data.main[0].map(x=>x.json.choices[0].message.content)).slice(0,3000));
 const r=await run('ECB');show('ECB Gate Build',r.over['Gate Build'][0]);
 console.log('ECB not_sent',JSON.stringify(r.over['Send Back Build'][0].map(x=>x.json.sb_not_sent)).slice(0,2500));
 const je=rd['Judge Enforcer Build'][0].data.main[0];console.log('JE build',je.length,Object.keys(je[0].json));je.forEach(x=>console.log('  ',JSON.stringify(Object.fromEntries(Object.entries(x.json).filter(([k])=>!/body|msg|prompt/.test(k)))).slice(0,500)));
 rd['Judge Enforcer Call deepseek'][0].data.main[0].forEach(x=>console.log('JE REPLY',String(x.json.choices&&x.json.choices[0].message.content).slice(0,1200)));
 const k=await run('KSR');const jk=k.over['Judge Enforcer Build'][0];console.log('KSR JE build',jk.length);jk.forEach(x=>console.log('  ',JSON.stringify(Object.fromEntries(Object.entries(x.json).filter(([k])=>!/body|msg|prompt/.test(k)))).slice(0,500)));
 k.over['Send Back Build'][0].forEach(x=>(x.json.items||[]).filter(i=>/KEY/.test(i.rule)).forEach(i=>console.log('KSR SB KEY item',x.json.seat,JSON.stringify(i).slice(0,600))));
})();
