// W2: per-seat KEYSTONE D6 lines through the send-back chain, s110 vs pkgKSR, stored replies (execution 34626).
process.chdir('/home/claude/searchthescriptures/prototypes/posture_e/wall2024');
const fs=require('fs');const run=require('/home/claude/searchthescriptures/prototypes/posture_e/wall2024/pkgKSR/run_node.cjs');const {rebuild}=require('/home/claude/searchthescriptures/prototypes/posture_e/wall2024/pkgLIB/unpack.cjs');
const L=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const W={s110:L('/mnt/project-files/wall2024/fetchback_live_s110.json'),KSR:L('pkgKSR/parent_s110_KSR.json')};
const src=(set,n)=>{const w=W[set];const c=w.nodes.find(x=>x.name===n).parameters.jsCode;return /^\/\/ pkgLIB stub/.test(c)?rebuild(c,w.nodes.find(x=>x.name==='Shared Library').parameters.jsCode):c;};
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34626_full.json','utf8'));const RD=(X.data||X).resultData.runData;const W2=a=>[a.map(j=>({json:j}))];
(async()=>{for(const set of ['s110','KSR']){const over={};
 for(const n of ['Panel Cure Check','Send Back Build','Send Back Record','Reread Build','Reread Record','Gate Build','Gate Record','Alternate Merge Seat']){const r=await run(src(set,n),n,RD,over);if(r.err){console.log(n,r.err);break;}over[n]=W2(r);
  const j=r[0];if(!j.bodies)continue;const per=j.bodies.map((b,i)=>{const t=String(b).replace(/\\n/g,'\n');const m=[...t.matchAll(/KEYSTONE: D6 -- (STANDS|BROKEN)[^\n]{0,30}/g)].map(x=>x[0].slice(16,40));return (j.summary&&j.summary[i]?j.summary[i].seat:i)+'='+m.length+':'+m.slice(0,3).join(' / ');});
  console.log(set,n,JSON.stringify(per));}}})();
