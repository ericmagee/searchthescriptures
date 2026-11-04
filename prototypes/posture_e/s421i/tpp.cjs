const fs=require('fs');const [,,nodeFile,exf]=process.argv;const code=fs.readFileSync(nodeFile,'utf8');
const ex=JSON.parse(fs.readFileSync(exf,'utf8'));const rd=ex.data.resultData.runData;
const out=n=>{const r=rd[n];if(!r)return null;return r.flatMap(x=>x.data.main[0]);};
const $=n=>{const items=out(n);return {isExecuted:!!items,first:()=>items[0],all:()=>items||[]};};
let res;try{res=new Function('$','$execution','$input',code)($,{id:1,customData:{set(){}}},{all:()=>out('Panel Check')||[],first:()=>(out('Panel Check')||[{}])[0]});}catch(e){console.log('ERR',e.message);process.exit(1);}
const j=res[0].json;(j.summary||[]).forEach(s=>{const c={};(s.drv||[]).forEach(x=>c[x.rule]=(c[x.rule]||0)+1);console.log(s.seat,JSON.stringify(c));(s.drv||[]).filter(x=>x.rule==='K-W'||x.rule==='K-S3').forEach(x=>console.log('   ',x.rule,x.link,'|',String(x.line).slice(0,120)));});
