// W3 study: every cure-step item, gate item and send-back item on the link the confirmed closing contradiction broke
const {run,srcs,out,BASE}=require('./h.cjs');
const ce=out('Close Enforcer Record');const conf=(ce&&ce[0].json.cec&&ce[0].json.cec.confirmed)||[];console.log('EX',process.env.EX.replace(/.*\//,''),'confirmed',JSON.stringify(conf.map(c=>c.side+' '+c.link)));
if(!conf.length)process.exit(0);
const links=conf.filter(c=>c.side==='DEFENDER').map(c=>'D'+c.link);const onLink=s=>links.some(l=>new RegExp('\\b'+l+'\\b').test(String(s||'')));
for(const s of Object.keys(srcs)){const r=run(BASE,srcs[s]);r.v.forEach(x=>{if(onLink(x.link)||(x.rule!=='K-W'&&x.rule!=='K-S3'&&onLink(String(x.line||'').slice(0,40))))console.log(' CURE',s,'|',x.rule,'|',x.link,'|',x.status,'|',String(x.why).slice(0,110),'| LINE:',String(x.line||'').slice(0,170))});
 const t=srcs[s].reply&&srcs[s].reply.text||'';t.split('\n').filter(l=>/^RETRACTED/i.test(l)&&onLink(l.slice(0,30))).forEach(l=>console.log(' RETRACTED',s,'|',l.slice(0,260)))}
for(const n of ['Send Back Record','Gate Record','Alt Send Back Record','Alt Gate Record']){const o=out(n);if(!o||!o[0])continue;const j=o[0].json;for(const r of (j.sb_rows||[]).concat(j.gate_rows||[])){if(onLink(r.item)||onLink(String(r.flagged_line||'').slice(0,40)))console.log(' '+n,'|',r.seat,'|',r.rule,'|',r.item,'|',r.reply_error?'NOT SENT':(/\|\| *KEEP/.test(r.response_line||'')?'KEEP':'CHANGE'),'|',r.cure_status,'|',String(r.response_line||'').slice(0,200))}}
const rows=JSON.parse(out('Replay Rows')[0].json.body).p_rows;for(const r of rows){const raw=r.verdict_raw.replace(/\\n/g,'\n');for(const l of raw.split('\n'))if(/AUDIT v25|AUDIT v24/.test(l)&&/D6/.test(l))console.log(' ROW',r.judge_seat,'|',l.slice(0,420))}
