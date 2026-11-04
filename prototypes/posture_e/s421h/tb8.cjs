const fs=require('fs');const [,,nodeFile,exf]=process.argv;const code=fs.readFileSync(nodeFile,'utf8');
const ex=JSON.parse(fs.readFileSync(exf,'utf8'));const rd=ex.data.resultData.runData;
const out=n=>{const r=rd[n];if(!r)return null;return r.flatMap(x=>x.data.main[0]);};
const $=n=>{const items=out(n);return {isExecuted:!!items,first:()=>items[0],all:()=>items||[]};};
const res=new Function('$','$execution','$input',code)($,{id:1,customData:{set(){}}},{all:()=>[],first:()=>({json:{}})});
const g=res[0].json.gloss;const c={};g.forEach(x=>c[x.status]=(c[x.status]||0)+1);console.log('counts',JSON.stringify(c));
g.filter(x=>x.status==='GLOSS ADDED').forEach(x=>console.log(x.side,x.round,x.num,x.word,'| given:',x.quote,'| added:',x.added,'| entry:',x.entry.slice(0,90)));
