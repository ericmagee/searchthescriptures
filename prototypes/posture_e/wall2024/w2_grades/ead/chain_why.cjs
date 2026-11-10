// W2: chain replay of 34703 (W1's pkgEAD/chain.cjs) for a source set; prints each seat's lines that mention UNCURED, NOT APPLIED or counted, at Gate Record and Alternate Merge.
const chain=require(process.env.CH||'../../pkgEAD/chain.cjs');
(async()=>{const r=await chain(process.argv[2],'Panel Cure Check');const show=n=>{const o=r.over[n];if(!o)return;for(const it of (o[0]||[])){for(const s of (it.json.bodies||[])){const p=JSON.parse(s).payload;const v=String(p.verdict_raw).split('\n').filter(l=>/UNCURED|NOT APPLIED|v21|COUNT/i.test(l));console.log('## '+n+' '+p.judge_seat+' drv '+p.drv_uncured);v.forEach(l=>console.log('   '+l.slice(0,330)));}}};
 show('Gate Record');if(r.MAPLOG)r.MAPLOG.forEach(x=>console.log('MAP',x));if(r.err)console.log('ERR',r.err);
 const sbr=r.over['Send Back Record'];if(sbr)for(const it of sbr[0]||[])(it.json.sb_rows||[]).forEach(x=>console.log('SBR',x.seat,x.item,'|',String(x.response_line).slice(0,140),'|',x.cure_status));})();
