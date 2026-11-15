// ASK 338 full replay: Citation Scan -> Cited Verses (live kjv_verses over REST, the node's own URL) -> Quote Compare -> Find Words (node's URL) -> Quote Report, PRE live s227 vs POST target.
const fs=require('fs');const W=f=>JSON.parse(fs.readFileSync(f));const K='sb_publishable_rgfWFjynRqBdzyEeBRHcig_c6pHysAi';
const codes=f=>{const w=W(f);const g=n=>w.nodes.find(x=>x.name===n).parameters.jsCode;return {cs:g('Citation Scan'),qc:g('Quote Compare'),qr:g('Quote Report')};};
const PRE=codes(process.argv[2]||'../rdf/fetchback_s227_342.json'),POST=codes(process.argv[3]||'target_338.json');
let D=W('../a329/debates.json').concat(W('../a336/r37510.json'));for(const f of fs.readdirSync('../f2').filter(f=>/^ODV1-.*\.json$/.test(f))){const r=W('../f2/'+f);D.push(Array.isArray(r)?r[0]:r);}
const st=new Set();D=D.filter(r=>r&&!st.has(r.run_token)&&st.add(r.run_token));
const cache=new Map();const get=async u=>{if(cache.has(u))return cache.get(u);let j;for(let k=0;k<4;k++){try{const r=await fetch(u,{headers:{apikey:K,Authorization:'Bearer '+K}});j=await r.json();if(Array.isArray(j))break;}catch(e){}await new Promise(r=>setTimeout(r,500*(k+1)));}if(!Array.isArray(j))throw new Error('fetch '+u.slice(0,200));cache.set(u,j);return j;};
const mk=M=>n=>{const m=M[n];return m?{isExecuted:true,all:()=>m.map(j=>({json:j})),first:()=>({json:m[0]})}:{isExecuted:false,all:()=>[],first:()=>{throw new Error('no '+n);}};};
const EX=(c,M)=>new Function('$','$input',c)(mk(M),{all:()=>[{json:{}}],first:()=>({json:{}})})[0].json;
async function pipe(C,r){const F={cr1:r.claude_r1||'',gr1:r.engine_r1||'',cr2:r.claude_r2||'',gr2:r.engine_r2||'',cr3:r.engine_r3||'',dr3:r.challenger_r3||'',cr4:r.defender_r4||'',dr4:r.challenger_r4||'',synthesis:r.synthesis||''};
 const M={'Final Output':[F],'Init Seats':[{run_token:'X'}]};const cs=EX(C.cs,M);M['Citation Scan']=[cs];M['Cited Verses']=await get(cs.url_cited);
 const qc=EX(C.qc,M);M['Quote Compare']=[qc];M['Find Words']=await get(qc.url_find);const qr=EX(C.qr,M);return qr;}
(async()=>{const tally={pre:{},post:{}};const lines=[];let unchanged=0,deb=0;
for(const r of D){const a=await pipe(PRE,r),b=await pipe(POST,r);const k=i=>JSON.stringify(i);
 for(const [x,t] of [[a,tally.pre],[b,tally.post]])for(const i of x.items){const s=i.status.replace(/ (?:Luke|Matthew|[A-Z0-9][\w ]*?) \d+:\d+.*$|FROM .*$|IN .*$/,'');t[s]=(t[s]||0)+1;}
 const A=a.items.map(k),B=b.items.map(k),As=new Set(A),Bs=new Set(B);const g=A.filter(x=>!Bs.has(x)),n=B.filter(x=>!As.has(x));unchanged+=A.length-g.length;
 if(g.length||n.length){deb++;lines.push('== '+r.run_token);g.forEach(x=>{const i=JSON.parse(x);lines.push('  PRE  '+i.side+' '+i.round+' '+i.ref+' | '+i.status+' | '+String(i.quote).slice(0,70));});n.forEach(x=>{const i=JSON.parse(x);lines.push('  POST '+i.side+' '+i.round+' '+i.ref+(i.list338?' ['+i.list338+']':'')+' | '+i.status+' | '+String(i.quote).slice(0,70));});}
 if(a.matches+a.mismatches+a.not_checked!==a.checked)lines.push('  count mismatch');}
console.log('debates',D.length,'| report items unchanged',unchanged,'| debates changed',deb);console.log('PRE status tally',JSON.stringify(tally.pre));console.log('POST status tally',JSON.stringify(tally.post));lines.forEach(l=>console.log(l));})().catch(e=>{console.error(e);process.exit(1);});
