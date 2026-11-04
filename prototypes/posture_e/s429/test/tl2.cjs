const fs=require('fs');const [,,nodeFile,exf]=process.argv;const code=fs.readFileSync(nodeFile,'utf8');
const ex=JSON.parse(fs.readFileSync(exf,'utf8'));const rd=ex.data.resultData.runData;const out=n=>{const r=rd[n];if(!r)return null;return r.flatMap(x=>x.data.main[0]);};
const $=n=>{const items=out(n);return {isExecuted:!!items,first:()=>items[0],all:()=>items||[]};};
const res=new Function('$','$execution','$input',code)($,{id:1,customData:{set(){}}},{all:()=>[],first:()=>({json:{}})});
const j=res[0].json;const tags=(j.l2&&j.l2.tags)||j.tags||[];
tags.forEach(t=>console.log(t.side,t.round,(t.words||[]).map(w=>w.w).join(','),'|',t.status,'|',String(t.seg||'').slice(0,60)));
