const fs=require('fs');const [,,nodeFile,exf]=process.argv;const code=fs.readFileSync(nodeFile,'utf8');
const ex=JSON.parse(fs.readFileSync(exf,'utf8'));const rd=ex.data.resultData.runData;const out=n=>{const r=rd[n];if(!r)return null;return r.flatMap(x=>x.data.main[0]);};
const $=n=>{const items=out(n);return {isExecuted:!!items,first:()=>items[0],all:()=>items||[]};};
const j=new Function('$','$execution','$input',code)($,{id:1,customData:{set(){}}},{all:()=>[],first:()=>({json:{}})})[0].json;
(j.tags||[]).filter(t=>/thûwlâh/.test(JSON.stringify(t.words))).forEach(t=>console.log(JSON.stringify({round:t.round,verses:t.verses,status:t.status,why:t.why,seg:t.seg.slice(0,50)})));
