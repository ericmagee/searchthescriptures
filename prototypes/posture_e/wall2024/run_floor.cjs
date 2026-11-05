const fs=require('fs');const {ledger}=require('./ledger.cjs');const {floor}=require('./floor.cjs');const {PRS}=require('./prs_lifted.cjs');
const all=[];for(const r of ['32643','32677','32717','32791'])all.push(...ledger(r));
const rows=all.map(x=>{const f=floor(x.e);return {run:x.run,round:x.round,ref:x.ref,means:x.means,base:x.cls,floor:(x.cls!=='UNPROVEN'&&f.cls)?'UNPROVEN':x.cls,claims:f.claims,fails:f.fails};});
fs.writeFileSync(__dirname+'/out/floor.json',JSON.stringify(rows,null,1));
console.log('TURNED by the floor:');rows.filter(r=>r.base!==r.floor).forEach(r=>console.log(' ',r.run,r.round,r.ref,'|',r.means,'| fails',JSON.stringify(r.fails)));
// expectation cases, located by MEANS substring
const find=(run,round,sub)=>rows.filter(r=>r.run===run&&(!round||r.round===round)&&r.means.includes(sub));
const T3e=PRS.entries('Matthew 1:19 "Then Joseph her husband, being a just [man], and not willing to make her a publick example, was minded to put her away privily." -- MEANS: Joseph thought her wronged by another. -- [L3] Matthew 1:20 "while he thought on these things" | [L3] Deuteronomy 22:24 "he hath humbled his neighbour\'s wife"')[0];
const T3=floor(T3e);
const T4e=PRS.entries('Matthew 1:19 "Then Joseph her husband, being a just [man], and not willing to make her a publick example, was minded to put her away privily." -- MEANS: Joseph intends a quiet dismissal, which shows he took the child not to be his. -- [L2] paradeigmatizō (G3856, to expose to infamy) | [L3] Deuteronomy 22:24 "because he hath humbled his neighbour\'s wife" | [L3] Matthew 2:14 "he took the young child and his mother"')[0];
const T4=floor(T4e);
const cases=[
 ['T1','turn',find('32791','CR3','presupposes he thought her wronged')],
 ['T2','turn',find('32717','CR3','took the child not to be his')],
 ['T3','turn',[{run:'synthetic',base:'(n/a)',floor:T3.cls||'PROVEN',fails:T3.fails,claims:T3.claims,means:T3e.means}]],
 ['T4','turn',[{run:'synthetic',base:'(n/a)',floor:T4.cls||'PROVEN',fails:T4.fails,claims:T4.claims,means:T4e.means}]],
 ['L1','limit',find('32677','CR3','was a shame')],
 ['L2','limit',find('32643','CR3','no husband who had known her')],
 ['H1','hold',find('32717','DR2','contains no verb of knowing')],
 ['H2','hold',find('32717','DR2','tribe and line are reckoned')],
 ['H3','hold',find('32717','DR2','Haggai 2:23 reverses')],
 ['H4','hold',find('32791','DR2','calls Joseph her husband')],
 ['H5','hold',find('32791','CR3','did not know her until the birth')],
 ['H6','hold',find('32717','CR3','Joseph did not know her until the birth')],
 ['H7','hold',find('32677','DR2','begets by knowing his wife')],
 ['H8','hold',rows.filter(r=>r.round==='DR2'&&r.ref==='Matthew 1:25')],
 ['H9','hold',rows.filter(r=>r.run==='32717'&&r.round==='DR2'&&['Romans 1:3','Hebrews 7:5','Hebrews 7:14','Luke 1:13','Luke 1:36','Haggai 2:23','Deuteronomy 22:24'].includes(r.ref))],
];
console.log('\nEXPECTATIONS:');
for(const [id,want,rs] of cases){if(!rs.length){console.log(id,want,'NOT FOUND');continue;}
 for(const r of rs){const ok=want==='turn'?r.floor==='UNPROVEN':want==='hold'?r.floor===r.base:'(limit)';
  console.log(id,want,r.run,r.ref||'',r.base,'->',r.floor,want==='limit'?'':ok?'OK':'FAIL','|',(r.means||'').slice(0,80),'| claims',JSON.stringify(r.claims.map(c=>c.verb+'/'+c.actor+'/'+c.object.join(','))));}}
