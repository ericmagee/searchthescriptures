const chain=require('./chain.cjs');const nt=chain.nt;
(async()=>{const r=await chain('/mnt/project-files/wall2024/fetchback_live_s110.json');let bad=[];
 for(const n of Object.keys(r.over)){if(nt(r.over[n])!==nt(r.stored(n).map(o=>(o||[]).map(x=>({json:x.json})))))bad.push(n);}
 console.log('H0 base chain: nodes rerun '+Object.keys(r.over).length+'; differing from the stored outputs: '+(bad.length?bad.join(', '):'none'));
})().catch(e=>console.log('ERROR '+e.message));
