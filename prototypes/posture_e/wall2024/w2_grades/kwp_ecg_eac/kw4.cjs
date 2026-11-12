const run=require('./rep.cjs');
run('parent_s148_KWP.json',['Panel Cure Check'],(fn,n,a,b)=>{if(fn!=='35296')return;const w=(v)=>{if(v&&typeof v==='object'){if(v.rule==='K-W'&&/#4/.test(v.link||''))console.log(JSON.stringify(v).slice(0,2500));for(const k in v)w(v[k]);}};w(b[0].json.summary||b);});
