const chain=require('../w2_grades/ead/chain_w2.cjs');
(async()=>{const r=await chain(process.argv[2],'Alternate Needed?');const s=JSON.stringify(r.over['Alternate Merge Seat']||r.over['Alternate Merge 1']);
 const re=/SEAT: haiku; ITEM: (DEFENDER CR2 no link heading #4|CHALLENGER DR3 LINK 3 #6); RULE: K-W; RESULT: (\w+)[^\]]{0,160}/g;let m;const seen=new Set();while(m=re.exec(s)){const k=m[1]+' '+m[2];if(!seen.has(k)){seen.add(k);console.log(process.argv[2],k,'|',m[0].slice(m[0].indexOf('WHY'),m[0].indexOf('WHY')+110));}}
 const t=(JSON.parse(JSON.stringify(r.over['Alternate Merge Seat'][0][0].json)).alternates_tried||[]).map(x=>x.removed_seat+'->'+x.alternate+' '+x.result);console.log(process.argv[2],'tried',JSON.stringify(t));})();
