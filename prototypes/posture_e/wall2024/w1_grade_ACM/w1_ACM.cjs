// W1 grade runner for pkgACM (labels w1_grade_ACM/labels_ACM_w1.md). Offline.
const fs=require('fs');const IN='/mnt/project-files/wall2024/inputs/';
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const LIVE=g('/mnt/project-files/wall2024/fetchback_live_s109.json'),CAND=g('pkgACM/parent_s109_ACM.json');const cl=x=>JSON.parse(JSON.stringify(x));const store={};
const saved=(run,n)=>{const k=run+'|'+n;if(k in store)return store[k];const f=IN+run+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return store[k]=null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[d.length-1]:d;const m=(r&&r.data&&r.data.main)||(r&&r.main);return store[k]=(m&&m[0])||[];};
const run=async(W,RUN,node,inputNode,over)=>{const get=n=>over&&n in over?over[n]:(n==='Shared Library'?[]:saved(RUN,n));const code=n=>W.nodes.find(z=>z.name===n).parameters.jsCode;
 const mk=n=>{const it=get(n);const params={get jsCode(){return code(n);}};if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+n);};return {isExecuted:false,first:no,last:no,all:no,params};}return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params};};
 const inp=(inputNode&&get(inputNode))||[];const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp)};
 const RD=Date,FIX=new RD('2026-11-07T03:10:18.511Z').getTime();class FD extends RD{constructor(...a){a.length?super(...a):super(FIX);}static now(){return FIX;}}global.Date=FD;
 try{return await new Function('$','$input','$json','$execution','$workflow',"return (async()=>{\n"+code(node)+"\n})();")(mk,$input,inp[0]&&inp[0].json,{id:RUN,customData:{set:()=>{},get:()=>undefined}},{id:'w'});}finally{global.Date=RD;}};
const out=[];const T=(c,m)=>{const s=(c?'OK   ':'FAIL ')+m;out.push(s);console.log(s);};const call='Anticheat Call deepseek',rec='Anticheat Record';
const rows=o=>{const a=(o&&o[0]&&o[0].json&&o[0].json.acx)||{};return a.rows||[];};const row=(o,id)=>rows(o).find(x=>x.id===id)||null;
(async()=>{
 // A6 / A1 stored runs
 const runs=[...new Set(fs.readdirSync(IN).filter(f=>/_Anticheat_Call_deepseek\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();const diffs=[];let n=0;
 for(const r of runs){let a,b;try{a=await run(LIVE,r,rec,call);b=await run(CAND,r,rec,call);}catch(e){console.log('   '+r+' throws '+e.message);continue;}n++;
  const A=rows(a),B=rows(b);for(const x of B){const y=A.find(z=>z.id===x.id&&z.side===x.side);const s=JSON.stringify;if(!y||s(y)!==s(x))diffs.push(r+' '+x.id+': '+(y?y.answer:'absent')+' -> '+x.answer);}
  for(const y of A)if(!B.find(z=>z.id===y.id&&z.side===y.side))diffs.push(r+' '+y.id+' dropped');
  const ra=JSON.stringify(a[0].json.acx&&{...a[0].json.acx,rows:undefined}),rb=JSON.stringify(b[0].json.acx&&{...b[0].json.acx,rows:undefined});if(ra!==rb)console.log('   '+r+' non-row fields: live '+ra.slice(0,300)+'\n      cand '+rb.slice(0,300));}
 console.log('stored runs replayed '+n+'; row differences: '+diffs.length);diffs.forEach(d=>console.log('   '+d));
 const exp=['33389 X34','33389 X36','33617 X75'];T(diffs.length===3&&exp.every(e=>diffs.some(d=>d.startsWith(e))),'A1/A6 only 33389 X34, X36, 33617 X75 differ from live');
 // A2-A5 plants on 33218 X57 (call index 2)
 const r='33218',C=saved(r,call);const ci=C.findIndex(it=>/ANTICHEAT: X57 /.test((it.json.choices&&it.json.choices[0].message.content)||''));const L0=C[ci].json.choices[0].message.content.split('\n').find(l=>/ANTICHEAT: X57 /.test(l));
 const P=async l=>{const c=cl(C);c[ci].json.choices[0].message.content=c[ci].json.choices[0].message.content.replace(L0,l);const a=await run(LIVE,r,rec,call,{[call]:c}),b=await run(CAND,r,rec,call,{[call]:c});
  const pa=JSON.stringify(await run(LIVE,r,'Panel Build',null,{'Anticheat Record':a})),pb=JSON.stringify(await run(CAND,r,'Panel Build',null,{'Anticheat Record':b}));const q='That reply sets another Father against it';
  const show=s=>{let i=-1,hit=false;while((i=s.indexOf('ANTI-CHEAT CHECK',i+1))>=0){const e=s.indexOf('\\n\\n[',i+20);if(s.slice(i,e<0?i+4000:e).includes(q))hit=true;}return hit;};const f=o=>{const x=row(o,'X57');return x?(x.answer)+(x.note?' ('+String(x.note).slice(0,40)+')':''):'no row';};
  return {live:f(a)+' shown '+show(pa),cand:f(b)+' shown '+show(pb),showC:show(pb),showL:show(pa)};};
 const base=await P(L0);console.log('   base line: live '+base.live+' | cand '+base.cand);
 const E='"I do not claim Luke 2:49 withdraws the title from Joseph."';
 for(const [l,lab] of [[L0.replace(/"$/,'".'),'A2 EARLIER ends \'".\''],[L0.replace(/"$/,'”.'),'A2 EARLIER ends \'”.\'']]){const x=await P(l);T(x.showC&&!x.showL,lab+': live '+x.live+' | cand '+x.cand);}
 for(const [l,lab] of [[L0.replace(/ -- EARLIER: .*$/,'.'),'A3 CLOSE ends \'".\', no EARLIER'],[L0.replace(/"$/,'"..'),'A3 EARLIER ends \'"..\''],[L0.replace(/"$/,'"...'),'A3 EARLIER ends \'"...\''],[L0.replace(/"$/,'".   '),'A3 period then spaces']]){const x=await P(l);console.log('   '+lab+': live '+x.live+' | cand '+x.cand);}
 for(const [l,lab] of [[L0.replace(/"$/,'". The rest of the reason.'),'A4 text after the mark'],[L0.replace(/^ANTICHEAT: /,''),'A4 no ANTICHEAT head'],[L0.replace('X57','X999'),'A4 X id not sent']]){const x=await P(l);T(x.live===x.cand,lab+': live '+x.live+' | cand '+x.cand);}
 {const l=L0.replace(/\."$/,'".').replace(/Joseph"\.$/,'Joseph."');const x=await P(L0);T(x.live===x.cand&&x.showC,'A5 period inside the quotation (stored form): live '+x.live+' | cand '+x.cand);}
 console.log(out.filter(x=>x.startsWith('OK')).length+' OK, '+out.filter(x=>x.startsWith('FAIL')).length+' FAIL');})().catch(e=>console.log('ERROR '+e.stack));
