// ASK 338 plants: full pipeline PRE live s227 vs POST target_338, live kjv_verses over REST.
const fs=require('fs');const W=f=>JSON.parse(fs.readFileSync(f));const K='sb_publishable_rgfWFjynRqBdzyEeBRHcig_c6pHysAi';
const codes=f=>{const w=W(f);const g=n=>w.nodes.find(x=>x.name===n).parameters.jsCode;return {cs:g('Citation Scan'),qc:g('Quote Compare'),qr:g('Quote Report')};};
const PRE=codes('../rdf/fetchback_s227_342.json'),POST=codes('target_338.json');
const get=async u=>{for(let k=0;k<4;k++){try{const r=await fetch(u,{headers:{apikey:K,Authorization:'Bearer '+K}});const j=await r.json();if(Array.isArray(j))return j;}catch(e){}await new Promise(r=>setTimeout(r,500*(k+1)));}throw new Error('fetch');};
const mk=M=>n=>{const m=M[n];return m?{isExecuted:true,all:()=>m.map(j=>({json:j})),first:()=>({json:m[0]})}:{isExecuted:false,all:()=>[],first:()=>{throw new Error('no '+n);}};};
const EX=(c,M)=>new Function('$','$input',c)(mk(M),{all:()=>[{json:{}}],first:()=>({json:{}})})[0].json;
async function pipe(C,F){const M={'Final Output':[F],'Init Seats':[{run_token:'X'}]};const cs=EX(C.cs,M);M['Citation Scan']=[cs];M['Cited Verses']=await get(cs.url_cited);
 const qc=EX(C.qc,M);M['Quote Compare']=[qc];M['Find Words']=await get(qc.url_find);return EX(C.qr,M);}
const P=[
 ['P1 O row, ", 20" form','[L1] "before they came together" and "that which is conceived in her is of the Holy Ghost" (Matthew 1:18, 20).'],
 ['P2 O row, "; Matthew" form','[L1] "before they came together" and "that which is conceived in her is of the Holy Ghost" (Matthew 1:18; Matthew 1:20).'],
 ['P3 L row, same book','[L1] "of the daughters of Aaron" (Luke 1:36; Luke 1:5).'],
 ['P4 single reference','[L1] "of the daughters of Aaron" (Luke 1:5).'],
 ['P5 list, quote in no member','[L1] "of the daughters of Aaron" (Luke 1:36; Luke 1:35).'],
 ['P6 L row, two books','[L1] "baptized with the Holy Ghost" (Luke 1:36; Acts 1:5).'],
 ['P7 reversed pair','[L1] "in all things" and "made like unto his brethren" (Hebrews 2:17; Hebrews 2:14).'],
 ['P8 bad member 1:95','[L1] "of the daughters of Aaron" (Luke 1:5; Luke 1:95).'],
 ['P9 range in a list','[L1] "of the daughters of Aaron" (Luke 1:5-6; Luke 1:36).'],
 ['P10 list closed by [L1]','"of the daughters of Aaron" (Luke 1:36; Luke 1:5) [L1].'],
 ['P11 3 quotes, 2 refs','[L1] "before they came together" and "of the Holy Ghost" and "Joseph her husband" (Matthew 1:18, 19).'],
 ['P12 same quote twice','[L1] "of the daughters of Aaron" (Luke 1:36; Luke 1:5). Again: "of the daughters of Aaron" (Luke 1:36; Luke 1:5).'],
];
const show=i=>i.ref+(i.list338?' ['+i.list338+']':'')+' | '+i.status+' | '+String(i.quote).slice(0,60);
(async()=>{for(const [nm,t] of P){const F={cr2:t};const a=await pipe(PRE,F),b=await pipe(POST,F);console.log('== '+nm+'\n   text: '+t);a.items.forEach(i=>console.log('   PRE  '+show(i)));b.items.forEach(i=>console.log('   POST '+show(i)));}
 const r=W('../f2/ODV1-27795-gg05qfpc.json');const R=Array.isArray(r)?r[0]:r;const F={cr1:R.claude_r1||'',gr1:R.engine_r1||'',cr2:R.claude_r2||'',gr2:R.engine_r2||'',cr3:R.engine_r3||'',dr3:R.challenger_r3||'',cr4:R.defender_r4||'',dr4:R.challenger_r4||'',synthesis:R.synthesis||''};
 const a=await pipe(PRE,F),b=await pipe(POST,F);console.log('== 27795 WORDS ARE AT items');a.items.filter(i=>/WORDS ARE AT/.test(i.status)).forEach(i=>console.log('   PRE  '+show(i)));b.items.filter(i=>/WORDS ARE AT/.test(i.status)).forEach(i=>console.log('   POST '+show(i)));
})().catch(e=>{console.error(e);process.exit(1);});
