const {RD,out}=require('./x.cjs');
const ce=out('Close Enforcer Record')[0].json;console.log('CE keys',Object.keys(ce).join(','));
const cs=JSON.stringify(ce,(k,v)=>typeof v==='string'&&v.length>900?v.slice(0,900)+'…':v);
for(const k of ['close_enf','closing','ce','cc','close']){if(ce[k])console.log(k,JSON.stringify(ce[k]).slice(0,2500))}
const rr=out('Replay Rows');console.log('REPLAY ROWS',rr.length);
rr.forEach(it=>{const j=it.json;console.log(Object.keys(j).join(','));const b=j.reasoning||j.body||j.judgment_text||'';
 for(const k of Object.keys(j)){const v=j[k];if(typeof v!=='string'||v.length<200)console.log('  ',k,'=',JSON.stringify(v).slice(0,200))}
 const body=Object.values(j).filter(v=>typeof v==='string'&&v.length>3000).sort((a,b)=>b.length-a.length)[0]||'';
 for(const l of body.split('\n'))if(/^(RESULT|CLAUSE|KEYSTONE|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK|CONCEDED LINKS|CHALLENGER CONCEDED|DEFENSE STANDING|CHALLENGE STANDING)/.test(l.trim())||/D\d vs C\d.*(BROKEN|STANDS|UNDERDETERMINED)/.test(l)&&!/AUDIT/.test(l))console.log('    |',l.trim().slice(0,260));
 const marks=body.split('\n').filter(l=>/AUDIT v(27|25|52|38|4\d|5\d)/.test(l));console.log('    marks',marks.length);marks.forEach(l=>{if(/v52|v25|KEYSTONE|v38|v51|v4[0-8]/.test(l))console.log('    M|',l.slice(0,420))});
});
