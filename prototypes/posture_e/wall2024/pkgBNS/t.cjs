// ASK 295 test on the REBUILT Panel Cure Check / Alternate Merge Seat library parts (stub line order, stubbed $).
// Step 1: cureVerdicts on a K-UNX-A item for DEFENDER premise 5 with the reply "CORRECTED COUNT DEFENDER 0" (the 37113 luna shape), with and without the 37113 E-ASSUME fact (premise 5, LINK 6, "Mary is of the house of David", BOTH NOT STATED).
// Step 2: bnsRefuse2024 on the 37113 E-HOLD send-back change (row 39031) and controls.
const st=require(__dirname+'/stub.cjs');
const FACT={side:'DEFENDER',n:5,link:6,k:1,fact:'Mary is of the house of David',both_not_stated:true};
const mk=(f,node,facts)=>{const d=st(f,node);const main=d.own.filter(o=>o[0]>0).map(o=>o[0])[0];const $=nm=>nm==='Assume Check Record'?{isExecuted:true,first:()=>({json:{acx:{facts}}})}:{isExecuted:false,first:()=>({json:{}}),all:()=>[]};
 return new Function('$','$input','items',d.S.slice(0,main).join('\n')+'\nreturn {cureVerdicts:typeof cureVerdicts==="function"?cureVerdicts:null,bns:typeof bnsRefuse2024==="function"?bnsRefuse2024:null};')($,null,[]);};
const item={rule:'K-UNX',a:'A',side:'DEFENDER',premise:5,conc:1,link:'DEFENDER premise 5',item:'DEFENDER premise 5',line:'CONCEDED LINKS: 1 -- Premise 5: UNEXHIBITED (ASSUMES an unshown fact about Mary\'s house)',l1:'that holy thing which shall be born of thee',l1ref:'Luke 1:35',kinds:[1,3]};
const reply={ok:true,text:'RESPONSE: K-UNX DEFENDER premise 5 | The [CR3] link narrows its conclusion to David’s seed being in Mary; it does not assume Mary is of David’s house. The premise is not unexhibited on the stated ASSUMES ground.\nCORRECTED COUNT: DEFENDER 0'};
for(const [lab,f] of [['OLD (a294)',__dirname+'/../a294/target.json'],['NEW',__dirname+'/target.json']])for(const node of ['Panel Cure Check','Alternate Merge Seat'])for(const facts of [[FACT],[]]){
 let v;try{v=mk(f,node,facts).cureVerdicts([{...item}],reply,null,{});}catch(e){v=[{status:'ERR',why:e.message}];}
 console.log(lab,node.slice(0,14),'| E-ASSUME fact',facts.length?'BOTH NOT STATED':'none','|',v.map(x=>x.status+' -- '+String(x.why).slice(0,150)).join(' | '));}
const T={'39031 (luna E-HOLD)':'D6 vs C4 (Romans 1:3): STANDS -- GROUND: [CR3] “Luke 1:35 puts the born flesh in Mary.”','UNDERDETERMINED control':'D6 vs C4 (Romans 1:3): UNDERDETERMINED -- GROUND: x','other link control':'D2 vs C1 (Luke 1:27): STANDS -- GROUND: x','FORCED form':'FORCED (Commitment 4): D6 vs C4 (Romans 1:3): STANDS -- GROUND: x'};
for(const node of ['Gate Build','Alternate Merge Seat']){const b=mk(__dirname+'/target.json',node,[FACT]).bns;for(const [k,t] of Object.entries(T))console.log('step 2',node,'|',k,'|',b(t)?'NOT APPLIED: '+b(t).slice(0,90):'applies');}
