// ASK 394: run the fixture lines through the live library reader (__RL via ri5Rd2024) and through each grade-reading site regex.
const fs=require('fs');const {unpack,rb,load}=require('../tools/lib.cjs');const w=JSON.parse(fs.readFileSync(__dirname+'/../rdf/fetchback_s262.json'));const {L,M}=unpack(w);
const node=Object.keys(M).find(k=>{const m=M[k];return rb(L,m).includes('function ri6Col2024');});const src=rb(L,M[node]);
const X=load(src,()=>({isExecuted:false,all:()=>[],first:()=>({json:{}})}));const rd=X.ri5Rd2024;
const H=require('./census.json').filter(h=>/LINK BROKEN|STANDS|UNDERDETERMINED|WITHDRAWN|HELD/.test(h.re));
const FX=['D1 vs C2 (2 Samuel 7:12): STANDS -- answered in [CR3]','**D1 vs C2 (Acts 2:30): CHALLENGER LINK BROKEN -- GROUND: x','D1 vs C2 (Acts 2:30): DEFENDER LINK BROKEN -- GROUND: x','- D1 vs C2: UNDERDETERMINED -- x','1. D1 vs C2 (Luke 1:35): DEFENDER LINK BROKEN -- x','FORCED: D2 vs C1 (Matthew 1:18): DEFENDER LINK BROKEN -- x','FORCED (Commitment 5): D2 vs C1: DEFENDER LINK BROKEN -- x','D1: STANDS','> D3 vs C1 (Isaiah 7:14): UNDERDETERMINED -- x','D2 vs C3: WITHDRAWN AFTER [DR3] -- x','**D4 vs C2**: CHALLENGER LINK BROKEN -- x'];
console.log('reader node used:',node);
const R=FX.map(l=>{const r=rd(l);let raw=null;try{raw=X.__RL.readLine(l);}catch(e){}return {l,form:r?r.form:null,grade:r&&r.f?r.f.grade:null,code:raw&&raw.code||null};});
R.forEach(r=>console.log('READER |',r.l.slice(0,60).padEnd(60),'|',r.form,r.grade,r.code?'code '+r.code:''));
for(const h of H){let re;try{re=h.re.startsWith('new RegExp')?new RegExp('\\bD1\\s+vs\\.?\\s+C\\d+\\b[^\\n]{0,200}?:\\s*\\**\\s*(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|WITHDRAWN AFTER)'):new RegExp(h.re);}catch(e){console.log('skip',h.name);continue;}
 const acc=FX.map((l,i)=>re.test(l)?1:0);const only=FX.filter((l,i)=>acc[i]&&!(R[i].form==='COLLISION'));
 console.log('SITE',h.name.padEnd(9),'('+h.where.length+' places)','accepts:',acc.join(''),only.length?'| shapes only this regex reads (reader gives no COLLISION): '+only.map(x=>JSON.stringify(x.slice(0,45))).join(', '):'');}
