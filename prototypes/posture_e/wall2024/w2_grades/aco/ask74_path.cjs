// W2: what the engine (s136 code) does with the ASK 74 replay reply: Verdict Normalizer -> Extract Independent Verdict -> SJ Re-ask? / Cure Needed?
const fs=require('fs');const W='/mnt/project-files/';
let D=JSON.parse(fs.readFileSync(W+'wall2024/fetchback_live_s136.json','utf8'));D=D.data||D;D=D.workflow||D;
const X=JSON.parse(fs.readFileSync(W+'wall2024/ex35067_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const code=n=>D.nodes.find(x=>x.name===n).parameters.jsCode;
const runSrc=(src,$,inp)=>{const $input={first:()=>inp[0],all:()=>inp,item:inp[0]};return new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);};
const mk=over=>{const lo=n=>{if(n in over)return over[n];const r=rd[n];return r?(r[r.length-1].data.main[0]||[]):null;};return [n=>{const o=lo(n)||[];const nd=D.nodes.find(z=>z.name===n);return {params:nd?nd.parameters:{},isExecuted:!!lo(n),first:()=>o[0],all:()=>o,last:()=>o[o.length-1],item:o[0]};},lo];};
const rep=JSON.parse(fs.readFileSync(W+'w4/ask74/reply.json','utf8'));const body=rep.body||rep;
(async()=>{for(const [label,callOut] of [['STORED reply',rd['Verdict Call openrouter'].slice(-1)[0].data.main[0]],['REPLAY reply (ASK 74)',[{json:body}]]]){
 const over={'Verdict Call openrouter':callOut,'SJ Re-ask Build':null};
 let [$,lo]=mk(over);const vn=await runSrc(code('Verdict Normalizer'),$,callOut);over['Verdict Normalizer']=vn;
 [$,lo]=mk(over);const ev=await runSrc(code('Extract Independent Verdict'),$,vn);const j=ev[0].json;
 const biv=rd['Build Independent Verdict'].slice(-1)[0].data.main[0][0].json;
 const reask=(()=>{if(biv.jidx!==5)return false;return (!j.verdict_tag||j.verdict_tag==='UNKNOWN')||(j.audit_prompt==='ODV1-A2'&&(!j.defender_chain_mark||!j.challenger_chain_mark));})();
 const v=j.debate_rule_violations||[];
 console.log('==',label,'| verdict_tag',j.verdict_tag,'| audit_prompt',j.audit_prompt,'| chain marks D/C',JSON.stringify(j.defender_chain_mark),JSON.stringify(j.challenger_chain_mark),'| SJ Re-ask? ->',reask?'RE-ASK':'no re-ask','| rule violations (cure items)',v.length,'| Cure Needed? ->',v.length>0?'CURE':'no cure');
 console.log('   keys:',Object.keys(j).slice(0,40).join(','));
 const raw=String(j.independent_verdict_raw||'');console.log('   AUDIT flags in independent_verdict_raw:',(raw.match(/\[AUDIT v\d+[^\]\n]{0,90}/g)||[]).length,'| sample:',(raw.match(/\[AUDIT v\d+[^\]\n]{0,110}/g)||[]).slice(0,6).join(' ## '));
 console.log('   rules:',JSON.stringify([...new Set(v.map(x=>x.rule||x.code||JSON.stringify(x).slice(0,30)))]).slice(0,300));}})();
