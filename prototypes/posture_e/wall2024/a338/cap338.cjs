// ASK 338 cap check: per debate, Find Words conditions (cap 60) and rows returned (limit 500), PRE live s227 vs POST target_338.
const fs=require('fs');const W=f=>JSON.parse(fs.readFileSync(f));const K='sb_publishable_rgfWFjynRqBdzyEeBRHcig_c6pHysAi';
const codes=f=>{const w=W(f);const g=n=>w.nodes.find(x=>x.name===n).parameters.jsCode;return {cs:g('Citation Scan'),qc:g('Quote Compare')};};
const PRE=codes('../rdf/fetchback_s227_342.json'),POST=codes('target_338.json');const D=W(__dirname+'/replay72.json');
const get=async u=>{for(let k=0;k<4;k++){try{const r=await fetch(u,{headers:{apikey:K,Authorization:'Bearer '+K}});const j=await r.json();if(Array.isArray(j))return j;}catch(e){}await new Promise(r=>setTimeout(r,500*(k+1)));}throw new Error('fetch');};
const mk=M=>n=>{const m=M[n];return m?{isExecuted:true,all:()=>m.map(j=>({json:j})),first:()=>({json:m[0]})}:{isExecuted:false,all:()=>[],first:()=>{throw new Error('no '+n);}};};
const EX=(c,M)=>new Function('$','$input',c)(mk(M),{all:()=>[{json:{}}],first:()=>({json:{}})})[0].json;
const nc=u=>{const m=u.match(/&or=([^&]*)/);if(!m)return 0;return (decodeURIComponent(m[1]).match(/and\(book\.eq\./g)||[]).length;};
(async()=>{let mx={pc:0,qc:0,pr:0,qr:0};const L=[];for(const r of D){const F={cr1:r.claude_r1||'',gr1:r.engine_r1||'',cr2:r.claude_r2||'',gr2:r.engine_r2||'',cr3:r.engine_r3||'',dr3:r.challenger_r3||'',cr4:r.defender_r4||'',dr4:r.challenger_r4||'',synthesis:r.synthesis||''};
 const o={};for(const [k,C] of [['p',PRE],['q',POST]]){const M={'Final Output':[F],'Init Seats':[{run_token:'X'}]};const cs=EX(C.cs,M);M['Citation Scan']=[cs];M['Cited Verses']=await get(cs.url_cited);const qc=EX(C.qc,M);o[k+'c']=nc(qc.url_find);o[k+'r']=(await get(qc.url_find)).length;}
 for(const k in mx)mx[k]=Math.max(mx[k],o[k]);if(o.pc||o.qc)L.push(r.run_token+' conditions PRE '+o.pc+' POST '+o.qc+' | rows PRE '+o.pr+' POST '+o.qr);}
console.log('debates',D.length,'| max conditions PRE',mx.pc,'POST',mx.qc,'(cap 60) | max rows PRE',mx.pr,'POST',mx.qr,'(limit 500)');L.forEach(l=>console.log(l));})();
