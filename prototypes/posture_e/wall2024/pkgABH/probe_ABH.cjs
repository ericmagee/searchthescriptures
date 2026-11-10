// pkgABH probe: the Alternate Build stub run whole on the stored node outputs of execution 34299 (the dry regrade that stopped at Alternate Build).
const fs=require('fs');const [,,EX,PARENT,LIVE]=process.argv;
const x=JSON.parse(fs.readFileSync(EX,'utf8'));const rd=x.data.resultData.runData;
const load=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
let ok=0,bad=0;const chk=(c,m)=>{if(c){ok++;console.log('OK   '+m);}else{bad++;console.log('FAIL '+m);}};
const mk=(wf,over)=>{const P={};wf.nodes.forEach(n=>P[n.name]=n.parameters);const items=nm=>{if(over&&nm in over)return over[nm];const r=rd[nm];if(!r)return null;const o=r[r.length-1].data&&r[r.length-1].data.main;return (o&&o[0])||[];};
 const $=nm=>{const it=items(nm);return {params:P[nm],first:()=>{if(!it||!it.length)throw new Error('no items '+nm);return it[0];},last:()=>it[it.length-1],all:()=>it||[],get item(){return it&&it[0];},isExecuted:!!it};};
 return {$,$input:{all:()=>items('Get Early Alternate'),first:()=>items('Get Early Alternate')[0],get item(){return items('Get Early Alternate')[0];}}};};
const run=async(wf,over)=>{const {$,$input}=mk(wf,over);const code=wf.nodes.find(n=>n.name==='Alternate Build').parameters.jsCode;const $execution={id:'34299',customData:{set(){},get(){}}};
 try{return {r:await new Function('$','$input','$execution','return (async()=>{\n'+code+'\n})();')($,$input,$execution)};}catch(e){return {e:String(e.message)};}};
const src=wf=>{const sl=wf.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const L=JSON.parse(sl.slice(sl.indexOf('\n/*LIB*/')+8,sl.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(sl.slice(sl.lastIndexOf('\n/*MAP*/')+8,sl.lastIndexOf('\n/*END*/')))['Alternate Build'];return M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');};
(async()=>{const LV=load(LIVE),PK=load(PARENT);
 const a=await run(LV);chk(a.e&&/reading 'map'/.test(a.e),'live s97 stub on 34299 inputs: fails as the execution did ('+(a.e||'no error')+')');
 const b=await run(PK);chk(!b.e&&Array.isArray(b.r),'ABH stub on 34299 inputs: no error, '+(b.r?b.r.length:0)+' items');
 // reference: the rebuilt source run directly with Alternate Needed? as $input
 const {$}=mk(PK);const $execution={id:'34299',customData:{set(){},get(){}}};const AN={first:()=>$('Alternate Needed?').first(),all:()=>$('Alternate Needed?').all(),last:()=>$('Alternate Needed?').last(),get item(){return $('Alternate Needed?').first();}};
 const ref=await new Function('$','$input','$execution','return (async()=>{\n'+src(PK)+'\n})();')($,AN,$execution);
 const early=$('Get Early Alternate').all().map(i=>i.json);
 chk(JSON.stringify(b.r)===JSON.stringify(ref),'ABH output equals the source run with Alternate Needed? as input (stored early row does not match: all or nothing gives today\'s output)');
 console.log('     items: '+(b.r||[]).map(i=>JSON.stringify(i.json.alt&&{seat:i.json.alt.seat,removed:i.json.alt.removed_seat,skip:i.json.alt.skip})).join(' ; '));
 console.log('     stored early rows: '+early.map(e=>JSON.stringify({seat_for:e.seat_for,sha:e.payload_sha,err:e.error})).join(' ; '));
 const C=(ref||[]).filter(x=>x&&x.json&&x.json.alt&&!x.json.alt.skip&&x.json.alt.body);
 const h=s=>{s=String(s);let a=0x811c9dc5,b=0x01000193^0x9e3779b9;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);a^=c;a=Math.imul(a,0x01000193)>>>0;b^=c;b=Math.imul(b,0x01000193)>>>0;b^=b>>>13;}return a.toString(16).padStart(8,'0')+b.toString(16).padStart(8,'0');};
 if(C.length){const rows=C.map(c=>({json:{seat_for:c.json.alt.removed_seat,payload_sha:h(JSON.stringify(c.json.alt.body)),error:null,reply:{choices:[{message:{content:'PLANT'}}]}}}));
  const m=await run(PK,{'Get Early Alternate':rows});chk(!m.e&&m.r.filter(i=>i.json.early_all&&i.json.__early_reply).length===C.length,'planted matching early rows for all '+C.length+' calls: every call carries early_all and the early reply');
  if(C.length>=1){const m2=await run(PK,{'Get Early Alternate':rows.map((r,i)=>i===0?{json:{...r.json,payload_sha:'0000'}}:r)});chk(!m2.e&&JSON.stringify(m2.r)===JSON.stringify(ref),'one planted row with a wrong hash: all or nothing, output equals today\'s');}
  const m3=await run(PK,{'Get Early Alternate':[{json:{}}]});chk(!m3.e&&JSON.stringify(m3.r)===JSON.stringify(ref),'empty RPC reply (no early row): output equals today\'s');
  const m4=await run(PK,{'Get Early Alternate':null});chk(!m4.e&&JSON.stringify(m4.r)===JSON.stringify(ref),'Get Early Alternate not executed: output equals today\'s');}
 else console.log('     no alternate call built on 34299 inputs');
 console.log(ok+' OK, '+bad+' FAIL');})();
