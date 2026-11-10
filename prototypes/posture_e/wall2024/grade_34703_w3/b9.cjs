const {RD,out,fs}=require('./x.cjs');
const gr=out('Gate Record')[0].json;const sr=out('Send Back Record')[0].json;
const cnt=(a,f)=>{const c={};for(const x of a){const k=f(x);c[k]=(c[k]||0)+1}return c};
console.log('SB rows',sr.sb_rows.length,JSON.stringify(cnt(sr.sb_rows,r=>r.seat+'|'+r.rule+'|'+(r.reply_error?'NOTSENT':(/\|\| *KEEP/.test(r.response_line||'')?'KEEP':'CHANGE'))+'|'+r.cure_status)));
console.log('notes: VP3',sr.sb_rows.filter(r=>/pkgVP3/.test(r.cure_reason||'')).length,'VPD',sr.sb_rows.filter(r=>/pkgVPD/.test(r.cure_reason||'')).length,'VP4',sr.sb_rows.filter(r=>/pkgVP4/.test(r.cure_reason||'')).length);
const whole=JSON.stringify(RD);for(const k of ['pkgVPD','pkgVP4','AUDIT v52','CURE COUNT OFF','pkgGUB','pkgGCC','COUNTED (pkg','E-REREAD','pkgQRD','retry":'])console.log(k,(whole.split(k).length-1));
// gate rows sol
for(const r of gr.gate_rows.filter(r=>r.seat==='sol'))console.log('SOL',r.item,'|',String(r.response_line).slice(0,260),'|',r.cure_status,'|',String(r.cure_reason).slice(-160));
for(const r of gr.gate_rows.filter(r=>r.seat==='luna'&&/G3|G4/.test(r.item)))console.log('LUNA',r.item,r.cure_status,String(r.cure_reason).slice(-120));
// enforcer logs
const el=out('Alternate Merge')[0].json.enforcer_log||[];console.log('enforcer_log',el.length,JSON.stringify(cnt(el,r=>(r.kind||'')+'|'+(r.rule||'')+'|'+(r.cure_status||r.status||r.answer||''))).slice(0,3000));
const ac=out('Anticheat Record')[0].json;console.log('AC keys',Object.keys(ac));const a=ac.anticheat||ac.ac||{};console.log(JSON.stringify(a,(k,v)=>Array.isArray(v)&&v.length>6?('['+v.length+' items]'):(typeof v==='string'&&v.length>200?v.slice(0,200):v)).slice(0,1500));
const am=out('Alternate Merge')[0].json;console.log('vc_single',JSON.stringify(am.vc_single).slice(0,200),'vc_error',JSON.stringify(am.vc_error).slice(0,200),'panel_effective',am.panel_effective,'removed',JSON.stringify(am.drv_removed).slice(0,300),'subst',JSON.stringify(am.substitution));
console.log('a2r',JSON.stringify(out('Second Alternate?')[0].json.a2r).slice(0,600));
const cel=out('Close Enforcer Record')[0].json.cec_log;console.log('cec_log',JSON.stringify(cel,(k,v)=>typeof v==='string'&&v.length>300?v.slice(0,300):v).slice(0,1800));
