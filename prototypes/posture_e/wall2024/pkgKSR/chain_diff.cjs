// K5: written rows under a set against the base chain: every field equal but verdict_raw; verdict_raw line diff printed. Usage: node pkgKSR/chain_diff.cjs <SET>
const chain=require('./chain.cjs');
(async()=>{const SET=process.argv[2];const a=await chain(process.env.BASESET||'R1','Panel Cure Check'),b=await chain(SET,'Panel Cure Check');
 const rows=r=>{const x=r.over['Replay Rows'][0][0].json.body;return (typeof x==='string'?JSON.parse(x):x).p_rows;};const A=rows(a),B=rows(b);
 const nt=s=>String(s).replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z/g,'T');
 A.forEach((ra,i)=>{const rb=B[i];const fd=Object.keys(ra).filter(k=>k!=='verdict_raw'&&nt(JSON.stringify(ra[k]))!==nt(JSON.stringify(rb[k])));
  const la=nt(ra.verdict_raw).replace(/\\n/g,'\n').split('\n'),lb=nt(rb.verdict_raw).replace(/\\n/g,'\n').split('\n');const sa=new Map(),sb=new Map();la.forEach(l=>sa.set(l,(sa.get(l)||0)+1));lb.forEach(l=>sb.set(l,(sb.get(l)||0)+1));
  const oa=[...sa].filter(([k,v])=>(sb.get(k)||0)<v).map(x=>x[0]),ob=[...sb].filter(([k,v])=>(sa.get(k)||0)<v).map(x=>x[0]);
  console.log('== '+ra.judge_seat+': other fields differing: '+(fd.join(', ')||'none')+'; verdict_raw lines base-only '+oa.length+', candidate-only '+ob.length);
  oa.forEach(l=>console.log('  - '+l.slice(0,230)));ob.forEach(l=>console.log('  + '+l.slice(0,230)));});})();
