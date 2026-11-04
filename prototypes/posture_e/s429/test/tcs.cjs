const fs=require('fs');const [,,nodeFile,exf]=process.argv;const code=fs.readFileSync(nodeFile,'utf8');
const ex=JSON.parse(fs.readFileSync(exf,'utf8'));const rd=ex.data.resultData.runData;const out=n=>{const r=rd[n];if(!r)return null;return r.flatMap(x=>x.data.main[0]);};
const $=n=>{const items=out(n);return {isExecuted:!!items,first:()=>items[0],all:()=>items||[]};};
const j=new Function('$','$execution','$input',code)($,{id:1,customData:{set(){}}},{all:()=>out('Final Output')||[],first:()=>(out('Final Output')||[{json:{}}])[0]})[0].json;
const T=j.l2_tags||[];console.log('tags',T.length);
T.forEach(t=>{const w=(t.words||[]).map(x=>x.w).join(',');if(process.argv[4]&&!new RegExp(process.argv[4]).test(w))return;console.log(t.side,t.round,w,'|',(t.verses||[]).join('; '));});
