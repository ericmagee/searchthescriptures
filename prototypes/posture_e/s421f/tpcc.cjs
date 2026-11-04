// Runs the whole Panel Cure Check node on a saved execution's Panel Payloads and Panel Cure Normalize outputs.
const fs=require('fs');const [,,nodeFile,exf]=process.argv;const code=fs.readFileSync(nodeFile,'utf8');
const ex=JSON.parse(fs.readFileSync(exf,'utf8'));const rd=ex.data.resultData.runData;
const out=n=>{const r=rd[n];if(!r)return null;return r.flatMap(x=>x.data.main[0]);};
const $=n=>{const items=out(n);return {isExecuted:!!items,first:()=>items[0],all:()=>items||[]};};
const res=new Function('$','$execution','$input',code)($,{id:1,customData:{set(){}}},{all:()=>[],first:()=>({json:{}})});
const j=res[0].json;j.bodies.forEach(b=>{const p=JSON.parse(b).payload;const raw=p.verdict_raw;
 const cp=(raw.match(/counted_premises_(?:defender|challenger)"\s*:\s*\[[^\]]*\]/g)||[]).join(' ');
 const rl=(raw.match(/RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1];
 console.log(p.judge_seat,'| verdict',p.verdict_tag,'| uncured',p.drv_uncured,'| RESULT',rl,'|',cp,'|',(raw.match(/COUNTED PREMISES ADDED[^\]]*/)||[''])[0]);});
