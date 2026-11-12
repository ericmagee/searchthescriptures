const run=require('./rep.cjs');const mask=s=>JSON.stringify(s).replace(/20\d\d-\d\d-\d\dT[\d:.]+Z/g,'T');let eq=0,tot=0;
run(process.argv[2]||'parent_s148_ECG.json',['Panel Payloads','Alternate Payloads','R2 Alternate Payloads'],(fn,n,a,b,rd)=>{tot++;if(a.ERR||b.ERR){console.log('ERR',fn,n,a.ERR,b.ERR);return;}
 const cut=o=>JSON.stringify(o,(k,v)=>k==='ecg'?undefined:v);if(mask(JSON.parse(cut(a)))===mask(JSON.parse(cut(b)))){eq++;return;}
 const cec=(()=>{try{return (rd['Close Enforcer Record'].slice(-1)[0].data.main.flat()[0].json.cec||{}).confirmed||[];}catch(e){return [];}})();
 const jcc=(()=>{try{return (rd['Judge Contradiction Record'].slice(-1)[0].data.main.flat()[0].json.jcc||{}).confirmed||[];}catch(e){return [];}})();
 const S=o=>{const j=o[0].json;return j.alt?o.map(x=>({seat:x.json.alt.seat,drv:x.json.drv,ecg:x.json.ecg})):j.summary;};
 console.log('==',fn,n,'| cec',JSON.stringify(cec.map(y=>y.side[0]+y.link)),'jcc',JSON.stringify(jcc.map(y=>y.side[0]+y.link)));
 const sa=S(a),sb=S(b);for(const s of sb){const t=sa.find(x=>x.seat===s.seat)||{};const da=(t.drv||[]).length,db=(s.drv||[]).length;if(da!==db||(s.ecg||[]).length)console.log('  ',s.seat,'drv',da,'->',db,'moved',(s.ecg||[]).map(x=>x.rule+' '+String(x.line).replace(/\*+/g,'').slice(0,48)).join(' | '));}
 const du=o=>JSON.stringify((o[0].json.alt?o.map(x=>x.json.body):(o[0].json.bodies||[])).map(x=>{try{const p=JSON.parse(x).payload;return [p.judge_seat,p.drv_uncured];}catch(e){return null;}}));console.log('   drv_uncured',du(a),'->',du(b));
}).then(()=>console.log('equal apart from ecg',eq,'of',tot));
