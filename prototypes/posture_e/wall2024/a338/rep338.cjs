// ASK 338 scan replay: live s227 Citation Scan vs target, every stored debate at hand. Lists every item that differs.
const fs=require('fs');const W=f=>JSON.parse(fs.readFileSync(f));
const code=f=>W(f).nodes.find(n=>n.name==='Citation Scan').parameters.jsCode;
const PRE=code(process.argv[2]||'../rdf/fetchback_s227_342.json'),POST=code(process.argv[3]||'target_338.json');
let D=W(__dirname+'/replay72.json');
const seenTok=new Set();D=D.filter(r=>r&&!seenTok.has(r.run_token)&&seenTok.add(r.run_token));
const run=(c,r)=>{const F={cr1:r.claude_r1||'',gr1:r.engine_r1||'',cr2:r.claude_r2||'',gr2:r.engine_r2||'',cr3:r.engine_r3||'',dr3:r.challenger_r3||'',cr4:r.defender_r4||'',dr4:r.challenger_r4||'',synthesis:r.synthesis||''};
 const M={'Final Output':[F],'Init Seats':[{run_token:'X'}]};const $=n=>{const m=M[n];return m?{isExecuted:true,all:()=>m.map(j=>({json:j})),first:()=>({json:m[0]})}:{isExecuted:false,all:()=>[],first:()=>({json:{}})};};
 return new Function('$','$input',c)($,{all:()=>[{json:{}}],first:()=>({json:{}})})[0].json;};
const K=i=>JSON.stringify(i);let same=0,gone=0,added=0,deb=0;const out=[];
for(const r of D){const a=run(PRE,r),b=run(POST,r);const A=a.items.map(K),B=b.items.map(K);const As=new Set(A),Bs=new Set(B);
 const g=A.filter(x=>!Bs.has(x)),n=B.filter(x=>!As.has(x));same+=A.length-g.length;if(g.length||n.length){deb++;out.push('== '+r.run_token);}
 g.forEach(x=>{gone++;const i=JSON.parse(x);out.push('  PRE  '+i.side+' '+i.round+' '+i.ref+' | '+String(i.quote).slice(0,80));});
 n.forEach(x=>{added++;const i=JSON.parse(x);out.push('  POST '+i.side+' '+i.round+' '+i.ref+' ['+i.list338+'] | '+String(i.quote).slice(0,80));});
 const ordA=A.filter(x=>Bs.has(x)),ordB=B.filter(x=>As.has(x));if(JSON.stringify(ordA)!==JSON.stringify(ordB))out.push('  ORDER OF UNCHANGED ITEMS DIFFERS');}
console.log('debates',D.length,'| items unchanged',same,'| PRE-only',gone,'| POST-only',added,'| debates changed',deb);out.forEach(l=>console.log(l));
