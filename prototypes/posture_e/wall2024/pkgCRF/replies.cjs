// pkgCRF: what the engine reads from cure replies that a schema no longer forces. Panel Cure Normalize 1 on 35067 (candidate), stored luna reply reshaped.
const fs=require('fs');const W='/mnt/project-files/wall2024/';
const L=f=>{let d=JSON.parse(fs.readFileSync(W+f,'utf8'));d=d.data||d;return d.workflow||d;};const B=L(process.env.CAND||'parent_s135_CRF.json');
const predOf=n=>{for(const [s,o] of Object.entries(B.connections))for(const br of o.main||[])for(const t of br||[])if(t.node===n)return s;};
const runSrc=(src,$,inp)=>{const $input={first:()=>inp[0],all:()=>inp,item:inp[0]};return new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);};
const mk=(rd,over)=>{const lo=n=>{if(over&&n in over)return over[n];const r=rd[n];return r?(r[r.length-1].data.main[0]||[]):null;};return [n=>{const o=lo(n)||[];const nd=B.nodes.find(z=>z.name===n);return {params:nd?nd.parameters:{},isExecuted:!!lo(n),first:()=>o[0],all:()=>o,last:()=>o[o.length-1],item:o[0]};},lo];};
const run=async(n,rd,over)=>{const [$,lo]=mk(rd,over);return await runSrc(B.nodes.find(z=>z.name===n).parameters.jsCode,$,(over&&over.__input)||lo(predOf(n))||[]);};
const X=JSON.parse(fs.readFileSync(W+'ex35067_full.json','utf8'));const rd=(X.data||X).resultData.runData;
(async()=>{const pcb=await run('Panel Cure Build 1',rd,null);const pred=predOf('Panel Cure Normalize 1');const IN=rd[pred].slice(-1)[0].data.main[0];
 const orig=IN[0].json.choices[0].message.content;const O=JSON.parse(orig);
 const go=async f=>{const inp=JSON.parse(JSON.stringify(IN));inp[0].json.choices[0].message.content=f(orig);const o=(await run('Panel Cure Normalize 1',rd,{'Panel Cure Build 1':pcb,__input:inp}))[0].json;return {text:String((o.reply||{}).text||''),fum:!!o.fum,asked:o.fum?o.fum.asked.length:0};};
 const ctl=await go(s=>s);const lines=ctl.text;console.log('control: reply lines',lines.split('\n').length,'| follow-up asked',ctl.asked,'| reply text starts',JSON.stringify(lines.slice(0,90)));
 const P=[
  ['fenced ```json',s=>'```json\n'+s+'\n```','same'],
  ['prose line before the JSON',s=>'Here are the cure lines.\n'+s,'?'],
  ['prose after the JSON',s=>s+'\nThat is all.','?'],
  ['pretty-printed JSON',s=>JSON.stringify(JSON.parse(s),null,2),'same'],
  ['the same answer as plain RESPONSE lines (no JSON)',s=>lines,'same'],
  ['JSON with an extra top-level key',s=>JSON.stringify(Object.assign({note:'x'},JSON.parse(s))),'same'],
  ['entries missing the item key',s=>JSON.stringify({cure_lines:JSON.parse(s).cure_lines.map(e=>({kind:e.kind,text:e.text}))}),'?'],
  ['single-quoted (invalid) JSON',s=>s.replace(/"/g,"'"),'?'],
  ['cut off mid-entry (as a schema reply can be today)',s=>s.slice(0,Math.floor(s.length*0.6)),'?'],
 ];
 for(const [nm,f,exp] of P){const r=await go(f);const same=r.text===lines&&r.asked===ctl.asked;console.log((same?'SAME ':'DIFF ')+nm+' | lines '+r.text.split('\n').length+' | follow-up asked '+r.asked+(same?'':' | starts '+JSON.stringify(r.text.slice(0,80))));}
})();
