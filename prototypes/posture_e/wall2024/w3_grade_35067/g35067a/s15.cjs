const L=require('./lib.cjs');
for(const n of ['Early Alternate Build','Reserve Needed?','Alternate Merge Seat','Alt Seated','Second Alternate?','Second Alternate Needed?','Alternate Merge 1 1','Alternate Merge','Dry?','Record Substitution','Record Alternates','Panel Check','Panel Payloads','Alt Gate Needed?','Alt Send Back Needed?','Alt Reread Needed?','Alt Judge Enforcer Needed?','SJ Re-ask?','Verdict Normalizer','Extract Independent Verdict','Cure Needed?','Cure Normalize','Cure Check','Panel Judges Collect','Panel Judges Fetch']){
 const it=L.items(n); const r=L.rd()[n]; 
 const o=r[0].data.main; const lens=o.map(b=>b?b.length:0);
 console.log('==',n,'branches',JSON.stringify(lens),'exec',r[0].executionTime);
 for(const x of it.slice(0,1)){const s=JSON.stringify(x); console.log(s.length>700?s.slice(0,700)+'...['+s.length+']':s);}
}
