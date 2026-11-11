// W2: ASK 76 control reply and ASK 74 reply read by s137 Verdict Normalizer + Extract, then the s137 SJ Re-ask? gate (35067 inputs).
const fs=require('fs');const W='/mnt/project-files/';
const ld=f=>{let D=JSON.parse(fs.readFileSync(f,'utf8'));D=D.data||D;return D.workflow||D;};const L=ld(W+'wall2024/fetchback_live_s137.json');
const X=JSON.parse(fs.readFileSync(W+'wall2024/ex35067_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const code=n=>L.nodes.find(x=>x.name===n).parameters.jsCode;
const runSrc=(src,$,inp)=>{const $input={first:()=>inp[0],all:()=>inp,item:inp[0]};return new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);};
const mk=over=>{const lo=n=>{if(n in over)return over[n];const r=rd[n];return r?(r[r.length-1].data.main[0]||[]):null;};return n=>{const o=lo(n)||[];const nd=L.nodes.find(z=>z.name===n);return {params:nd?nd.parameters:{},isExecuted:!!lo(n),first:()=>o[0],all:()=>o,last:()=>o[o.length-1],item:o[0]};};};
const ifEval=($,j)=>{const e=L.nodes.find(n=>n.name==='SJ Re-ask?').parameters.conditions.conditions[0].leftValue.replace(/^=\{\{/,'').replace(/\}\}$/,'');return new Function('$','$json','return ('+e+');')($,j);};
const base=rd['Verdict Call openrouter'].slice(-1)[0].data.main[0][0].json;
(async()=>{for(const [lab,f] of [['stored 35067',null],['ASK 76 control (no notes)','w4/ask74/reply_control.json'],['ASK 74 (notes)','w4/ask74/reply.json']]){
 const t=f?(()=>{const r=JSON.parse(fs.readFileSync(W+f,'utf8'));return (r.body||r).choices[0].message.content;})():base.choices[0].message.content;
 const call=[{json:Object.assign({},base,{choices:[{index:0,finish_reason:'stop',message:{role:'assistant',content:t}}]})}];const over={'Verdict Call openrouter':call,'SJ Re-ask Build':null};
 const vn=await runSrc(code('Verdict Normalizer'),mk(over),call);over['Verdict Normalizer']=vn;const ev=await runSrc(code('Extract Independent Verdict'),mk(over),vn);const j=ev[0].json;
 const raw=String(j.independent_verdict_raw||'');const cm=(raw.match(/COLLISION MAP: ([^\]]*)\]/)||[,''])[1];
 const has=k=>new RegExp('^[ \\t*#>-]*'+k,'mi').test(t);
 console.log(lab.padEnd(26),'| chars',t.length,'| tag',j.verdict_tag,'| marks',j.defender_chain_mark+'/'+j.challenger_chain_mark,'| map',cm.slice(0,70),'| RULING cards',(t.match(/^\W*RULING\b/gm)||[]).length,'| ANSWER CHECK',(t.match(/ANSWER CHECK/g)||[]).length,'| CITATION CHECK',has('CITATION CHECK'),'| s137 gate',ifEval(mk(over),j));}})();
