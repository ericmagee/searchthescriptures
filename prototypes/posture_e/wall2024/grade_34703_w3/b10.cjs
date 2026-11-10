const {RD,out}=require('./x.cjs');
const el=out('Alternate Merge')[0].json.enforcer_log||[];
for(const r of el.filter(r=>r.rule==='E-KEY'))console.log('E-KEY',r.seat,'|',String(r.flagged_line).slice(0,160),'|',String(r.response_line).slice(0,300),'|',String(r.cure_reason).slice(0,200));
for(const r of el.filter(r=>r.rule==='E-REREAD'&&r.cure_status==='UNCURED'))console.log('REREAD UNC',r.seat,'|',String(r.item).slice(0,120),'|',String(r.response_line).slice(0,300),'|',String(r.cure_reason).slice(0,300));
const c={};for(const r of el.filter(r=>r.kind==='cure'&&r.rule==='K-S3')){const k=String(r.cure_reason).replace(/[:(].*/,'').slice(0,70);c[k]=(c[k]||0)+1}console.log('K-S3',JSON.stringify(c));
const c2={};for(const r of el.filter(r=>r.kind==='enforcer_check')){const m=String(r.response_line||'').match(/\b(AGREE|DISAGREE|NO ANSWER|CONSISTENT|REVERSED|NO EARLIER READING)\b/);const k=r.rule+'|'+(m?m[1]:'?');c2[k]=(c2[k]||0)+1}console.log(JSON.stringify(c2));
const acx=out('Anticheat Record')[0].json.acx;console.log('acx',JSON.stringify(acx,(k,v)=>Array.isArray(v)&&v.length>5?('['+v.length+']'):(typeof v==='string'&&v.length>160?v.slice(0,160):v)).slice(0,1200));
if(acx&&acx.rows){const c3={};for(const r of acx.rows){c3[r.answer||r.status]=(c3[r.answer||r.status]||0)+1}console.log(JSON.stringify(c3));for(const r of acx.rows.filter(r=>/REVERSED/.test(r.answer||r.status)))console.log('REV',JSON.stringify(r).slice(0,500))}
const whole=JSON.stringify(out('Close Enforcer Call deepseek'));console.log('CE call items',out('Close Enforcer Call deepseek').length);
const ar=el.find(r=>r.kind==='alternate_reply');console.log('alt reply row',JSON.stringify({...ar,prompt_sent:undefined,full_reply:undefined}).slice(0,600));
