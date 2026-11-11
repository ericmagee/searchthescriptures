// W2: which replies would a "no COLLISION POINTS section => full re-ask" rule catch? s136 Verdict Normalizer + Extract Independent Verdict on 35067,
// with the stored reply, the ASK 74 reply, the stored reply wrapped in JSON (fenced and plain), and the 34726-style LIMITATION reply.
const fs=require('fs');const W='/mnt/project-files/';
let D=JSON.parse(fs.readFileSync(W+'wall2024/fetchback_live_s136.json','utf8'));D=D.data||D;D=D.workflow||D;
const X=JSON.parse(fs.readFileSync(W+'wall2024/ex35067_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const code=n=>D.nodes.find(x=>x.name===n).parameters.jsCode;
const runSrc=(src,$,inp)=>{const $input={first:()=>inp[0],all:()=>inp,item:inp[0]};return new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);};
const mk=over=>{const lo=n=>{if(n in over)return over[n];const r=rd[n];return r?(r[r.length-1].data.main[0]||[]):null;};return n=>{const o=lo(n)||[];const nd=D.nodes.find(z=>z.name===n);return {params:nd?nd.parameters:{},isExecuted:!!lo(n),first:()=>o[0],all:()=>o,last:()=>o[o.length-1],item:o[0]};};};
const base=rd['Verdict Call openrouter'].slice(-1)[0].data.main[0][0].json;const txt=base.choices[0].message.content;
const a74=JSON.parse(fs.readFileSync(W+'w4/ask74/reply.json','utf8'));const t74=(a74.body||a74).choices[0].message.content;
const X2=JSON.parse(fs.readFileSync(W+'wall2024/ex34726_full.json','utf8'));const t726=(X2.data||X2).resultData.runData['Verdict Call openrouter'].slice(-1)[0].data.main[0][0].json.choices[0].message.content;
(async()=>{for(const [label,t] of [['stored 35067 reply',txt],['ASK 74 reply',t74],['stored reply wrapped {"reasoning": ...}',JSON.stringify({reasoning:txt})],['stored reply wrapped ```json {"verdict","reasoning"}```','```json\n'+JSON.stringify({verdict:'BROKEN',reasoning:txt})+'\n```'],['34726 reply (LIMITATION paragraph) on 35067 inputs',t726]]){
 const call=[{json:Object.assign({},base,{choices:[{index:0,finish_reason:'stop',message:{role:'assistant',content:t}}]})}];const over={'Verdict Call openrouter':call,'SJ Re-ask Build':null};
 const vn=await runSrc(code('Verdict Normalizer'),mk(over),call);over['Verdict Normalizer']=vn;const ev=(await runSrc(code('Extract Independent Verdict'),mk(over),vn))[0].json;
 const raw=String(ev.independent_verdict_raw||'');const noCP=/COLLISION MAP: NO COLLISION POINTS SECTION/.test(raw);const reask=(!ev.verdict_tag||ev.verdict_tag==='UNKNOWN')||(!ev.defender_chain_mark||!ev.challenger_chain_mark);
 console.log(label.padEnd(58),'| tag',String(ev.verdict_tag).padEnd(8),'| marks',ev.defender_chain_mark,ev.challenger_chain_mark,'| re-ask today',reask?((!ev.verdict_tag||ev.verdict_tag==='UNKNOWN')?'FULL':'MARKS'):'none','| no-collision-points flag',noCP);}})();
