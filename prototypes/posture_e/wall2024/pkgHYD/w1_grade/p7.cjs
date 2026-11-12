// W2 pkgHYD: Init Seats then Resolve Seats, live s166 against the candidate, with the live model_config rows (pkgHYD/rows.json, read 11-12)
// plus the planned hydrogen row. Usage (from wall2024/): node pkgHYD/sim.cjs <live json> <candidate json>
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const ROWS=require('/home/claude/searchthescriptures/prototypes/posture_e/wall2024/pkgHYD/rows.json');const HYD={seat:'hydrogen',provider:'openrouter',role:'engine',api_model:'google/gemini-4-hydrogen',max_tokens:64000,active:true,family:'google'};
const ex={id:1,customData:{set(){}}};
const go=async(file,d,c,withRow)=>{const src=n=>g(file).nodes.find(x=>x.name===n).parameters.jsCode;
 const OC=['chatgpt','sol','luna','grok','hydrogen','argon','haiku'];const acc={seats:OC.filter(s=>s!==d&&s!==c).map(s=>({seat:s,placed:true,status:'placed'}))};
 const body={topic:'t',defender:{engine:d,profile:'plain'},challenger:{engine:c,profile:'oracle'}};
 let I;try{I=(await new Function('$','$input','$execution','return (async()=>{'+src('Init Seats')+'})();')(n=>{if(n==='Accept Models')return {all:()=>[]};throw 0;},{first:()=>({json:{acc,src:{body}}})},ex))[0].json;}catch(e){return 'INIT REFUSED: '+String(e.message).slice(0,160);}
 const R0=ROWS.map(r=>r.seat==='argon'&&withRow==='argoff'?Object.assign({},r,{active:false}):r);const R=withRow==='argoff'?R0:withRow==='off'?ROWS.concat([Object.assign({},HYD,{active:false})]):withRow?ROWS.concat([HYD]):ROWS;const $=n=>({'Init Seats':{first:()=>({json:I})},'Fetch Models':{all:()=>R.map(j=>({json:j}))},'Fetch Drift Guards':{all:()=>[]},'Fetch Tensions':{all:()=>[]}})[n];
 try{const o=(await new Function('$','$input','$execution','return (async()=>{'+src('Resolve Seats')+'})();')($,{},ex))[0].json;return 'alt_order '+I.alt_order.join(',')+' | judges '+o.judges.map(j=>j.seat).join(',')+' | reserve '+(o.reserve&&o.reserve.seat)+' | alternates '+o.alternates.map(a=>a.seat+'('+a.api_model+')').join(', ');}catch(e){return 'RESOLVE REFUSED: '+String(e.message).replace(/ run_token=.*/,'').slice(0,200);}};
(async()=>{const [L,K]=process.argv.slice(2,4);
 const cases=[['claude','opus','argoff','W1-7 argon row inactive (live behaviour)']];
 for(const [d,c,w,nm] of cases){console.log(nm);console.log('  live: '+await go(L,d,c,w));console.log('  new:  '+await go(K,d,c,w));}})();
