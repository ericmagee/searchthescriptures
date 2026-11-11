const {hook}=require('./h1.cjs');const fs=require('fs');const K=JSON.parse(fs.readFileSync('keep.json','utf8'));
const G=K['Gate Record'][0];const seat=process.argv[2]||'luna';
hook('Gate Record',ev=>{const kfLines=ev('kfLines'),ciRounds=ev('ciRounds'),gp=ev('gatePromptText2024');
 const PJ=K['Panel Judges Prep'];let body=null;const walk=(v,d)=>{if(body||d>6||!v||typeof v!=='object')return;if(Array.isArray(v)){v.forEach(x=>walk(x,d+1));return;}if(v.seat===seat&&v.body&&v.body.messages){body=v.body;return;}for(const k in v)walk(v[k],d+1);};walk(PJ,0);
 console.log('body found',!!body);const R=ciRounds(gp(body));console.log('R keys',Object.keys(R).map(k=>k+':'+(typeof R[k]==='string'?R[k].length:typeof R[k])).join(' '));
 const rows=G.gate_rows.filter(r=>r.seat===seat&&/^G\d/.test(r.item||''));
 for(const r of rows){const segs=String(r.response_line||'').split('||').map(s=>s.trim());for(const s of segs){const i=s.search(/FORCED\s*:/);if(i<0)continue;const f=s.slice(i);const o=kfLines(f,R);console.log('\n##',r.item,r.cure_status,'\nFORCED:',f.slice(0,300),'\n K items:',JSON.stringify(o.items.map(z=>({rule:z.rule,why:z.why}))).slice(0,1500));}}
});
