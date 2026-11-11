// W2 pkgALT: Init Seats then Resolve Seats (candidate), with the stored 34852 Fetch Models rows plus the planned argon row.
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const CAND='/mnt/project-files/wall2024/parent_s119_ALT.json';const src=n=>g(CAND).nodes.find(x=>x.name===n).parameters.jsCode;
const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34852_full.json','utf8')).data.resultData.runData;
const FM=rd['Fetch Models'][0].data.main[0].map(i=>i.json);const rows=FM.concat([{seat:'argon',provider:'openrouter',role:'engine',api_model:'google/gemini-4-argon',max_tokens:64000,active:true,family:'google'}]);
console.log('stored Fetch Models seats:',FM.map(x=>x.seat).join(','));
const ex={id:1,customData:{set(){}}};
const go=async(d,c,noArgonRow)=>{const OC=['chatgpt','sol','luna','grok','argon','haiku'];const acc={seats:OC.filter(s=>s!==d&&s!==c).map(s=>({seat:s,placed:true,status:'placed'}))};
 const body={topic:'t',defender:{engine:d,profile:'plain'},challenger:{engine:c,profile:'oracle'}};
 const I=(await new Function('$','$input','$execution','return (async()=>{'+src('Init Seats')+'})();')(n=>{if(n==='Accept Models')return {all:()=>[]};throw 0;},{first:()=>({json:{acc,src:{body}}})},ex))[0].json;
 const R=noArgonRow?rows.filter(r=>r.seat!=='argon'):rows;const $=n=>({'Init Seats':{first:()=>({json:I})},'Fetch Models':{all:()=>R.map(j=>({json:j}))},'Fetch Drift Guards':{all:()=>[]},'Fetch Tensions':{all:()=>[]}})[n];
 try{const o=(await new Function('$','$input','$execution','return (async()=>{'+src('Resolve Seats')+'})();')($,{},ex))[0].json;return 'judges '+o.judges.map(j=>j.seat).join(',')+' | reserve '+(o.reserve&&o.reserve.seat)+' | alternates '+o.alternates.map(a=>a.seat+'('+a.api_model+')').join(', ');}catch(e){return 'REFUSED: '+String(e.message).replace(/ run_token=.*/,'');}};
(async()=>{console.log('R1 claude v opus:',await go('claude','opus'));console.log('R2 gemini v claude:',await go('gemini','claude'));console.log('R3 grok v claude:',await go('grok','claude'));console.log('R4 claude v opus, argon row missing:',await go('claude','opus',true));})();
