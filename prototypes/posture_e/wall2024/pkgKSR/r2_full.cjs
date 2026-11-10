// Round 2 for luna's seat with Haiku (pkgF3A rev 2s), replayed with STORED TEXT that fits the planted reply: the Haiku reply is sol's stored panel verdict,
// and each round 2 call gets sol's own stored reply to the same call (panel cure, judge enforcer, send-back). Goal: reach R2 Alt Send Back Build (pkgECB withhold) and beyond.
// Usage (from wall2024/): node pkgKSR/r2_full.cjs <workflow json>
const make=require('../pkgF3A/w3_grade/r2.cjs');const fs=require('fs');const cl=x=>JSON.parse(JSON.stringify(x));
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34626_full.json','utf8'));const rd=(X.data||X).resultData.runData;const st=k=>cl(rd[k][0].data.main);
const WF=process.argv[2];const m=make(WF);const log=(...a)=>console.log(...a);const K=s=>(String(s).replace(/\\n/g,'\n').match(/(?:^|\n)[^\n]{0,3}KEYSTONE: D6 -- [^\n]{0,70}/g)||['none']).map(x=>x.trim()).join(' || ');
const step=async(n,f)=>{try{const r=await m.run(n,f);log('ran '+n+' ('+r.length+' items)');return r;}catch(e){log('STOP at '+n+': '+e.message.slice(0,300));throw e;}};
(async()=>{for(const k of ['Alternate Merge 1','Resolve Seats','Gate Record'])m.over[k]=cl(m.rd[k][0].data.main);
 await step('Second Alternate?','Alternate Merge 1');m.pass('Second Alternate Needed?','Second Alternate?');await step('R2 Alternate Build','Second Alternate Needed?');m.pass('R2 Alternate Calls?','R2 Alternate Build');
 const rep=st('Panel Judge 3 openrouter')[0][0].json;rep.model='anthropic/claude-haiku-5.5';m.over['R2 Alternate Call openrouter']=[[{json:rep}]];
 const pay=await step('R2 Alternate Payloads','R2 Alternate Call openrouter');log('  payload cure: '+JSON.stringify(pay.map(p=>p.cure&&{skip:p.cure.skip,jidx:p.cure.jidx,body:!!p.cure.body})));
 m.pass('R2 Alternate Cure Needed?','R2 Alternate Payloads');await step('R2 Alternate Cure Build','R2 Alternate Cure Needed?');
 m.over['R2 Alternate Cure Call openrouter']=st('Panel Cure Call 3 openrouter');await step('R2 Alternate Cure Normalize','R2 Alternate Cure Call openrouter');
 m.pass('FUM Needed? R2 Alternate','R2 Alternate Cure Normalize');const ms=await step('R2 Alternate Merge Seat','FUM Needed? R2 Alternate');
 const t=ms[0].alternates_tried.slice(-1)[0];log('  Merge Seat: haiku '+t.result+' ('+t.why+'); seated '+JSON.stringify(ms[0].alternates_seated));log('  haiku KEYSTONE: '+K(t.verdict_raw).slice(0,300));log('  tried keys: '+Object.keys(t).join(','));log('  uncured detail: '+JSON.stringify(Object.fromEntries(Object.entries(t).filter(([k])=>/uncur|drv|item|cure/i.test(k)))).slice(0,1200));const v=String(t.verdict_raw);log('  UNCURED lines: '+(v.match(/[^\n]*UNCURED[^\n]*/g)||[]).map(x=>x.slice(0,250)).join(' || '));
 const seated=await step('R2 Alt Seated','R2 Alternate Merge Seat');const jeb=await step('R2 Alt Judge Enforcer Build','R2 Alt Seated');log('  enforcer: je_skip '+JSON.stringify(jeb.map(j=>[j.je_skip,j.je_why||j.why||null,(j.calls||[]).length])));
 // stored judge enforcer replies for sol: the panel Judge Enforcer Build items whose seat is sol, in order
 const pjb=st('Judge Enforcer Build')[0].map(x=>x.json);const pjc=st('Judge Enforcer Call deepseek')[0];const solIdx=pjb.map((j,i)=>[j,i]).filter(([j])=>JSON.stringify(j).includes('"sol"')).map(x=>x[1]);log('  stored judge enforcer items for sol: '+solIdx.join(','));
 m.pass('R2 Alt Judge Enforcer Needed?','R2 Alt Judge Enforcer Build');m.over['R2 Alt Judge Enforcer Call deepseek']=[solIdx.map(i=>pjc[i]).slice(0,jeb.length)];
 await step('R2 Alt Judge Enforcer Retry Build','R2 Alt Judge Enforcer Call deepseek');m.pass('R2 Alt Judge Enforcer Retry Needed?','R2 Alt Judge Enforcer Retry Build');
 await step('R2 Alt Judge Enforcer Record','R2 Alt Judge Enforcer Retry Needed?');const sb=await step('R2 Alt Send Back Build','R2 Alt Judge Enforcer Record');
 const it=sb.flatMap(x=>(x.items||[]).map(i=>i.sid+' '+i.rule+' '+String(i.line).slice(0,90)));const ns=sb.flatMap(x=>x.sb_not_sent||[]);
 log('  R2 Alt Send Back Build items ('+it.length+'):\n    '+it.join('\n    '));log('  not_sent by pkgECB: '+ns.filter(x=>/pkgECB/.test(x.why)).length+' '+JSON.stringify(ns.filter(x=>/pkgECB/.test(x.why)).map(x=>x.rule+' '+x.item)));
 log('  items on D6 or KEYSTONE lines sent: '+it.filter(x=>/D6 vs|KEYSTONE/.test(x)).length);})().catch(e=>{});
