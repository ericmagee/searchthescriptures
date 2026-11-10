const chain=require('./chain703.cjs');const fs=require('fs');
(async()=>{const r=await chain(process.argv[2],{});const o={rows:r.rows,am:r.over['Alternate Merge']?r.over['Alternate Merge'][0][0].json:null};
 fs.writeFileSync(process.argv[3],chain.nt(o));console.log(process.argv[2].replace(/.*\//,''),r.rows.map(x=>x.judge_seat+':'+x.drv_uncured+':'+x.verdict_tag).join(' '),'tried',JSON.stringify((o.am.alternates_tried||[]).map(t=>[t.alternate,t.result,t.why])));})().catch(e=>{console.error('ERR',e.message.slice(0,400));process.exit(1)});
