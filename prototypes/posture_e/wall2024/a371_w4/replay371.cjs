// ASK 371 replay of the 31 E-COL rows that passed pkgECW. Usage: node replay371.cjs [ref]  (ref = also apply W2 7806 item 2, not ruled)
const {carry}=require('./match.js');const R=require('./rows31.json');const by={};R.forEach(r=>by[r.id]=r);const REF=process.argv[2]==='ref';
const CBREF={42223:'Matthew 1:20',42224:'Matthew 1:20',42228:'Acts 2:30',42229:'Acts 2:30',42486:'2 Samuel 7:12',42659:'Matthew 1:20',42660:'Matthew 1:20',42662:'Luke 1:35',42840:'Matthew 1:24',42842:'Acts 1:8',42843:'Acts 1:8',42844:'Luke 1:32',43171:'Numbers 1:2',43173:'Numbers 1:2',43407:'Matthew 1:18',43408:'Matthew 1:18',43414:'Matthew 1:18',43415:'Matthew 1:18',43417:'Matthew 1:20',43418:'Matthew 1:20',43425:'Luke 1:32',43608:'Matthew 1:24',43612:'Matthew 1:24',43815:'Galatians 4:4',43816:'Galatians 4:4',43817:'Galatians 4:4'};
const pr=s=>{const m=String(s||'').match(/^(.+?)\s+(\d+):(\d+)$/);return m?{book:m[1],c:m[2],v:m[3]}:null;};
const out=[];let n={pass:0,refuse:0,fallback:0,byRef:0};
for(const r0 of R){const r=r0.dup?{...by[r0.dup],id:r0.id}:r0;const ans=[r.answer,r.fails].filter(Boolean).join(' | ');
 if(!ans){n.fallback++;out.push(r.id+' '+r.run+' FALLBACK (the line quotes no answer words; today\'s test, passes) CB "'+r.cb+'"');continue;}
 const c=carry(r.cb,ans,r.means,REF?{ref:pr(CBREF[r.id])}:{});c.pass?n.pass++:n.refuse++;if(c.byRef)n.byRef++;
 out.push(r.id+' '+r.run+' '+(c.pass?'PASS':'REFUSED')+(c.byRef?' [BY REFERENCE '+CBREF[r.id]+']':'')+' shared: '+(c.shared.join(', ')||'none')+(c.topic.length?' | topic words seen: '+c.topic.join(', '):'')+' | CB '+(CBREF[r.id]||'')+' "'+r.cb+'"');}
console.log(out.join('\n'));console.log(JSON.stringify(n));
