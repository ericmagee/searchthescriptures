const fs=require('fs');const [,,csFile,l2File,exf]=process.argv;const ex=JSON.parse(fs.readFileSync(exf,'utf8'));const rd=ex.data.resultData.runData;
const out=n=>{const r=rd[n];if(!r)return null;return r.flatMap(x=>x.data.main[0]);};
const $0=n=>{const items=out(n);return {isExecuted:!!items,first:()=>items[0],all:()=>items||[]};};
const cs=new Function('$','$execution','$input',fs.readFileSync(csFile,'utf8'))($0,{id:1,customData:{set(){}}},{all:()=>out('Final Output')||[],first:()=>(out('Final Output')||[{json:{}}])[0]});
const $=n=>n==='Citation Scan'?{isExecuted:true,first:()=>cs[0],all:()=>cs}:$0(n);
const j=new Function('$','$execution','$input',fs.readFileSync(l2File,'utf8'))($,{id:1,customData:{set(){}}},{all:()=>[],first:()=>({json:{}})})[0].json;
(j.tags||[]).forEach(t=>console.log(t.side,t.round,(t.words||[]).map(w=>w.w).join(',').slice(0,40),'|',t.status,'|',String(t.seg||'').slice(0,50)));
