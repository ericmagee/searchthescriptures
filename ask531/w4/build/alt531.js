// ASK 531 (W4): the alternate path. qwen4max (seated by child 41440 for sol) read by acx531Items with the acx of crit2 (41418 under 524, W1's reply).
// Its verdict text is the CONCEDED LINKS line its R2 Alt Gate Build prompt quotes; acx is the target Assume Check Record output. No model call.
const fs=require('fs');const T=JSON.parse(fs.readFileSync('ask531/w4/build/target_engine_531.json','utf8'));const t=T.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const L=JSON.parse(t.slice(t.indexOf('\n/*LIB*/')+8,t.lastIndexOf('\n/*MAP*/')));
const items=new Function(L.slice(240,329).join('\n')+'\n'+L[888]+'\n'+L.slice(1376,1384).join('\n')+'\n'+L[3563]+'\nreturn acx531Items;')();
const C=JSON.parse(fs.readFileSync('ask531/w4/build/crit2_41418.json','utf8'));const acr=C.target['Assume Check Record'];const acx=(acr[0].json||acr[0]).acx;
console.log('acx.m524',acx.m524,'facts both_not_stated',acx.facts.filter(f=>f.both_not_stated).map(f=>f.side+' '+f.n+(f.r2?' r2':'')+' "'+f.fact+'"'));
const J=JSON.parse(fs.readFileSync('ask523/w4/41418/child41440_rr_gr.json','utf8'));const R=(J.data&&J.data.resultData||J).runData;const r=R['R2 Alt Gate Build'];
const q=r[r.length-1].data.main[0].find(x=>x.json.seat==='qwen4max').json;const s=JSON.stringify(q);
const lines=[...s.matchAll(/(?:DEFENDER |CHALLENGER )?CONCEDED LINKS: \d[^\\]*/g)].map(m=>m[0]);console.log('qwen4max lines:\n '+lines.join('\n '));
console.log('qwen4max items:',JSON.stringify(items(acx,lines.join('\n'))));
// sol62 and chatgpt for comparison, from the same function
for(const [seat,line] of [['sol62 (premise 3 carries the fact)','CHALLENGER CONCEDED LINKS: 1 -- Premise 3: UNEXHIBITED. STEP: the woman through whom it is said to pass is of David\'s bodily line.']])console.log(seat,JSON.stringify(items(acx,line)));
