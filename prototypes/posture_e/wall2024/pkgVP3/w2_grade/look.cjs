const fs=require('fs');const H=require('../harness.cjs');
const P=JSON.parse(fs.readFileSync(__dirname+'/../parent_s90_VP3.json','utf8'));const by={};P.nodes.forEach(n=>by[n.name]=n);
(async()=>{const b=await H.run(by['Send Back Record'].parameters.jsCode,'34108','Send Back Call openrouter');
for(const r of b[0].json.sb_rows)if(/^(E-ANS|E-HOLD)$/.test(r.rule))console.log(r.seat,r.rule,r.cure_status,'|',String(r.item).slice(0,50),'|',String(r.cure_reason).slice(0,260).replace(/\n/g,' '),'\n');
const B=H.out('34108','Send Back Build');console.log(Object.keys(B[0][0].json));
const C=H.out('34108','Send Back Call openrouter');console.log(C[0].length, C[0].map(x=>Object.keys(x.json)));
for(const n of ['Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3']){const o=H.out('34108',n);console.log(n,!!o, o&&o[0]&&o[0][0]&&o[0][0].json.cure&&Object.keys(o[0][0].json.cure.rounds||{}));}
})();
