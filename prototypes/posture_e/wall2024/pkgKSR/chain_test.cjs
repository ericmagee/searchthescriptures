// KEYSTONE at the written rows: chain replay from Panel Cure Check to Replay Rows (labels_KSR.md, K4/K5). Usage: node pkgKSR/chain_test.cjs <SET>
const chain=require('./chain.cjs');const fs=require('fs');
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34626_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const rows=m=>{const b=m[0][0].json.body;const o=typeof b==='string'?JSON.parse(b):b;return o.p_rows.map(r=>({seat:r.judge_seat,key:(String(r.verdict_raw).replace(/\\n/g,'\n').match(/(?:^|\n)\s*KEYSTONE: D6 -- [A-Z]+[^\n"]{0,70}/)||['none'])[0].trim(),res:r.result_line,tag:r.verdict_tag,raw:r.verdict_raw}));};
const nt=s=>String(s).replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z/g,'T');
(async()=>{const SET=process.argv[2]||'R1';const r=await chain(SET,'Panel Cure Check');if(r.err){console.log('ERROR '+r.err);return;}
 console.log('stored output kept for code nodes the runner cannot run: '+(r.fb.join('; ')||'none'));const got=rows(r.over['Replay Rows']),sto=rows(rd['Replay Rows'][0].data.main);
 got.forEach((g,i)=>console.log(SET+' '+g.seat+': '+g.key+' | RESULT '+g.res+' | tag '+g.tag+(SET==='R1'?' | equal to stored row: '+(nt(g.raw)===nt(sto[i].raw)):'')));})();
