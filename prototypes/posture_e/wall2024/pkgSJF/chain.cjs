// pkgSJF chain: (A) FULL re-ask on the ASK 74 reply, answered by a full judgment (the stored 35067 reply) or by a second decline,
// through the real SJ Re-ask Pick, Verdict Normalizer and Extract Independent Verdict (SJF). (B) every stored first Verdict in the exports, s136 vs SJF gate.
const fs=require('fs');const W='/mnt/project-files/';
const ld=f=>{let D=JSON.parse(fs.readFileSync(f,'utf8'));D=D.data||D;return D.workflow||D;};
const S=ld(W+'wall2024/fetchback_live_s136.json'),F=ld(W+'wall2024/parent_s136_SJF.json');
const X=JSON.parse(fs.readFileSync(W+'wall2024/ex35067_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const code=(D,n)=>D.nodes.find(x=>x.name===n).parameters.jsCode;
const runSrc=(src,$,inp)=>{const $input={first:()=>inp[0],all:()=>inp,item:inp[0]};return new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);};
const mk=(D,over)=>{const lo=n=>{if(n in over)return over[n];const r=rd[n];return r?(r[r.length-1].data.main[0]||[]):null;};return n=>{const o=lo(n)||[];const nd=D.nodes.find(z=>z.name===n);return {params:nd?nd.parameters:{},isExecuted:!!lo(n),first:()=>o[0],all:()=>o,last:()=>o[o.length-1],item:o[0]};};};
const ifEval=(D,$,j)=>{const e=D.nodes.find(n=>n.name==='SJ Re-ask?').parameters.conditions.conditions[0].leftValue.replace(/^=\{\{/,'').replace(/\}\}$/,'');return new Function('$','$json','return ('+e+');')($,j);};
const base=rd['Verdict Call openrouter'].slice(-1)[0].data.main[0][0].json;const t35=base.choices[0].message.content;
const a74=JSON.parse(fs.readFileSync(W+'w4/ask74/reply.json','utf8'));const t74=(a74.body||a74).choices[0].message.content;
const wrap=t=>[{json:Object.assign({},base,{choices:[{index:0,finish_reason:'stop',message:{role:'assistant',content:t}}]})}];
const cpCount=j=>(String(j.independent_verdict_raw||'').match(/COLLISION MAP: ([^\]]*)\]/)||[,''])[1];
(async()=>{
for(const [label,second] of [['re-ask answered with a full judgment (stored 35067 reply)',t35],['re-ask answered with the same decline again (ASK 74 reply)',t74]]){
 const D=F;const over={'Verdict Call openrouter':wrap(t74),'SJ Re-ask Build':null};
 let vn=await runSrc(code(D,'Verdict Normalizer'),mk(D,over),over['Verdict Call openrouter']);over['Verdict Normalizer']=vn;
 let ev=await runSrc(code(D,'Extract Independent Verdict'),mk(D,over),vn);
 if(!ifEval(D,mk(D,over),ev[0].json))throw new Error('no fire');
 const b=await runSrc(code(D,'SJ Re-ask Build'),mk(D,over),ev);over['SJ Re-ask Build']=b;
 const msgs=b[0].json.verdictBody.messages;
 const call2=wrap(second);over['SJ Re-ask Call openrouter']=call2;
 const pk=await runSrc(code(D,'SJ Re-ask Pick'),mk(D,over),call2);
 // second pass of the loop: Pick -> Verdict Normalizer -> Extract -> SJ Re-ask?
 const over2={...over,'Verdict Call openrouter':over['Verdict Call openrouter']};
 vn=await runSrc(code(D,'Verdict Normalizer'),mk(D,over2),pk);over2['Verdict Normalizer']=vn;ev=await runSrc(code(D,'Extract Independent Verdict'),mk(D,over2),vn);const j=ev[0].json;
 console.log('A: '+label+'\n   re-ask request: '+msgs.length+' messages, last role '+msgs[msgs.length-1].role+', mode '+b[0].json.sjr.mode+' | Pick used '+pk[0].json.sjr_pick.used+
  ' | after: tag '+j.verdict_tag+', marks '+j.defender_chain_mark+'/'+j.challenger_chain_mark+', collision map "'+cpCount(j).slice(0,60)+'" | gate again: '+ifEval(D,mk(D,over2),j));
}
// B: every stored first Verdict reply in the exports, read on 35067 inputs, gate under s136 and SJF
for(const r of ['33149','33371','33490','33497','34726','34852','35067']){
 const E=JSON.parse(fs.readFileSync(W+'wall2024/ex'+r+'_full.json','utf8'));const v=(E.data||E).resultData.runData['Verdict Call openrouter'];
 const t=v[0].data.main[0][0].json.choices[0].message.content;const out=[];
 for(const D of [S,F]){const over={'Verdict Call openrouter':wrap(t),'SJ Re-ask Build':null};const vn=await runSrc(code(D,'Verdict Normalizer'),mk(D,over),over['Verdict Call openrouter']);over['Verdict Normalizer']=vn;
  const ev=await runSrc(code(D,'Extract Independent Verdict'),mk(D,over),vn);const j=ev[0].json;let m='none';if(ifEval(D,mk(D,over),j))m=(await runSrc(code(D,'SJ Re-ask Build'),mk(D,over),ev))[0].json.sjr.mode;out.push(m);}
 console.log('B: '+r+' first Verdict ('+v[0].data.main[0][0].json.model+'): s136 '+out[0]+' | SJF '+out[1]+(out[0]===out[1]?'  SAME':'  DIFFERENT'));
}})().catch(e=>{console.error(e);process.exit(1);});
