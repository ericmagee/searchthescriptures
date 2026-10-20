const fs=require('fs');const J=JSON.parse(fs.readFileSync('judg.json'));const pairs=JSON.parse(fs.readFileSync('pairs.json'));const runs=JSON.parse(fs.readFileSync('../f1v/runs.json'));
function run(src,tok,mode){const js=J.filter(x=>x.tok===tok);const order=['deepseek','gemini','grok'];const F=runs.find(r=>r.tok===tok);const sj=pairs.find(p=>p.tok===tok).sj;
 const slot={deepseek:'Panel Judge 1 deepseek',gemini:'Panel Judge 2 gemini',grok:'Panel Judge 3 grok'};
 const data={'Init Seats':{run_token:tok,dry:mode==='regrade'},'Panel Build':{debate_id:js[0].debate_id,judges:order.map(s=>({seat:s,api_model:js.find(x=>x.seat===s).model}))},'Panel Check':{sub:null},'Final Output':F,
  'Build Save Body':{saveBody:sj},'Regrade Load':{f:F},'Regrade Row':Object.assign({},sj)};
 const exec=new Set(Object.values(slot));if(mode==='live')exec.add('Build Save Body');if(mode==='regrade'){exec.add('Regrade Load');exec.add('Regrade Row');}
 const $=n=>{const it=Object.entries(slot).find(([s,nn])=>nn===n);const j=it?(()=>{const x=js.find(y=>y.seat===it[0]);return {choices:[{message:{content:x.vr},finish_reason:x.finish}]};})():data[n];
  return {all:()=>[{json:j||{}}],first:()=>({json:j||{}}),get isExecuted(){return exec.has(n);}};};
 return new Function('$',src)($)[0].json;}
const base=fs.readFileSync('PP.base.js','utf8'),neu=fs.readFileSync('PP.new.js','utf8');
for(const tok of ['ODV1-27088-cg67a8be','ODV1-27035-vxp28wcr'])for(const mode of ['live','regrade','none']){
 const a=run(base,tok,mode),b=run(neu,tok,mode);const pa=a.bodies.map(x=>JSON.parse(x).payload),pb=b.bodies.map(x=>JSON.parse(x).payload);
 const other=JSON.stringify({...a,bodies:null,summary:a.summary.map(s=>({...s,flags:null}))})===JSON.stringify({...b,bodies:null,summary:b.summary.map(s=>({...s,flags:null}))});
 const res=pa.map((x,i)=>{const y=pb[i];const keys=Object.keys(x).filter(k=>k!=='verdict_raw'&&JSON.stringify(x[k])!==JSON.stringify(y[k]));
  const add=y.verdict_raw.startsWith(x.verdict_raw)?y.verdict_raw.slice(x.verdict_raw.length):'NOT-A-SUFFIX';return x.judge_seat+(keys.length?' FIELDS-CHANGED '+keys:'')+(add?' +'+JSON.stringify(add):' same');});
 console.log(tok,mode,'rest-equal',other,'flags',a.summary.map(s=>s.flags).join('/'),'->',b.summary.map(s=>s.flags).join('/'));res.forEach(r=>console.log('   ',r));}
