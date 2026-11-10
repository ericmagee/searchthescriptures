const chain=require('../w2_grades/ead/chain_w2.cjs');const fs=require('fs');
(async()=>{const r=await chain(process.argv[2],process.env.START||'Panel Payloads');
 const ran=Object.keys(r.over);console.log('nodes in over:',ran.length);console.log(ran.filter(n=>/Alternate|Merge|Gate|Panel Done|Cure Check|Send Back|Apply/i.test(n)).join(' | '));
 const X=JSON.parse(fs.readFileSync(process.env.CHAIN_EX,'utf8'));const rd=(X.data||X).resultData.runData;
 const st=n=>rd[n]&&rd[n][0].data.main[0][0].json;const pick=n=>{const o=r.over[n];return o&&o[0]&&o[0][0]&&o[0][0].json;};
 for(const n of ['Gate Record','Alternate Merge 1','Alternate Merge']){const a=pick(n),b=st(n);const lu=j=>j&&j.bodies?JSON.parse(j.bodies.find(s=>JSON.parse(s).payload.judge_seat==='luna')).payload:null;const pa=lu(a),pb=lu(b);
  console.log(n,'| chain luna',pa&&pa.verdict_raw.length,'drv',pa&&pa.drv_uncured,'| stored luna',pb&&pb.verdict_raw.length,'drv',pb&&pb.drv_uncured,'| same text',pa&&pb&&pa.verdict_raw===pb.verdict_raw);}
})();
