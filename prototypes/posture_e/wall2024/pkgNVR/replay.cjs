// pkgNVR: replay the 15 nodes whose code holds psGrades, live s130 vs NVR, on every stored export; list every changed cure or gate line.
const fs=require('fs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../pkgKSR/run_node.cjs');const P='/mnt/project-files/wall2024/';
const A=L('/tmp/claude-0/live_now.json'),B=L(process.argv[2]||'/tmp/claude-0/parent_s130_NVR.json');
const NODES=['Alt Gate Build','Alt Gate Record','Alt Send Back Record','Alternate Merge 1','Alternate Merge Seat','Cure Check','Gate Build','Gate Record','Panel Cure Check','R2 Alt Gate Build','R2 Alt Gate Record','R2 Alt Send Back Record','R2 Alternate Merge','R2 Alternate Merge Seat','Send Back Record'];
const S=v=>JSON.stringify(v).replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z/g,'<ts>');
(async()=>{let t=0,eq=0,er=0;for(const e of fs.readdirSync(P).filter(x=>/^ex\d+_full\.json$/.test(x))){const rd=JSON.parse(fs.readFileSync(P+e,'utf8')).data.resultData.runData;
 for(const n of NODES){if(!rd[n])continue;const a=await run(A.code(n),n,rd),b=await run(B.code(n),n,rd);t++;if(a.err||b.err){er++;console.log(e.slice(2,7),n,'ERR live:',a.err,'| NVR:',b.err);continue;}
  const sa=S(a),sb=S(b);if(sa===sb){eq++;continue;}
  // find differing cure rows
  const rows=o=>{const m=[];JSON.stringify(o,(k,v)=>{if(v&&typeof v==='object'&&v.rule&&v.item&&'cure_status' in v)m.push(v);return v;});return m;};const ra=rows(a),rb=rows(b);
  const key=r=>r.seat+'|'+r.rule+'|'+r.item+'|'+(r.at||'');const ma=new Map(ra.map(r=>[key(r)+(r.kind||''),r]));let shown=0;
  for(const r of rb){const o=ma.get(key(r)+(r.kind||''));if(o&&(o.cure_status!==r.cure_status||o.cure_reason!==r.cure_reason)&&shown<6){shown++;console.log(e.slice(2,7),n,'|',r.seat,r.rule,r.item,'|',o.cure_status,'->',r.cure_status,'|',String(r.cure_reason).split('CURE (record-only until promoted):').pop().slice(0,140));}}
  if(!shown){let i=0;while(sa[i]===sb[i])i++;console.log(e.slice(2,7),n,'DIFFER (not a cure row) at',i,'| live:',sa.slice(i-80,i+120),'| NVR:',sb.slice(i-80,i+120));}}}
 console.log('replays',t,'equal',eq,'errors (both)',er);})();
