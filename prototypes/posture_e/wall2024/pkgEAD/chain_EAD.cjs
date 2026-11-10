// pkgEAD chain replay (W1): execution 34703 from Panel Cure Check to Replay Rows with stored model replies; a withheld item's reply lines removed.
// Usage: CHAIN_EX=.../ex34703_full.json CHAIN_WF=.../fetchback_live_s112.json node pkgEAD/chain_EAD.cjs <SET>
const chain=require('./chain.cjs');
(async()=>{const SET=process.argv[2];const r=await chain(SET,'Panel Cure Check');if(r.err){console.log('ERROR '+r.err);return;}
 console.log(SET+': stored output kept for code nodes the runner cannot run: '+(r.fb.join('; ')||'none'));
 const sbb=(r.over['Send Back Build'][0]||[]).flatMap(x=>(x.json.sb_not_sent||[]).filter(y=>/pkgEAD/.test(y.why)).map(y=>y.seat+' '+y.item));console.log('  withheld by pkgEAD: '+(sbb.join('; ')||'none'));
 const gb=(r.over['Gate Build']||[]).flat().filter(Boolean).flatMap(x=>(x.json.items||[]).map(g=>x.json.seat+' '+g.gid+' '+g.kind+' '+g.key));console.log('  gate items: '+gb.length+'\n    '+gb.join('\n    '));
 const am=r.over['Alternate Merge'][0][0].json;for(const s of am.bodies){const p=JSON.parse(s).payload;const v=String(p.verdict_raw);console.log('  '+p.judge_seat+': drv_uncured '+p.drv_uncured+' | tag '+p.verdict_tag+' | D1 vs C1: '+((v.match(/(?:^|\n)D1 vs C1 \([^)]*\): [A-Z ]+/)||[''])[0].trim())+' | Luke 1:34 check: '+((v.match(/(?:^|\n)ANSWER CHECK: Luke 1:34 [^\n]*?-- (MEETS|MISSES|FAILS)/)||['',''])[1]));}
 console.log('  alternates tried: '+JSON.stringify((am.alternates_tried||[]).map(t=>t.removed_seat+'->'+t.alternate+' '+t.result)));
 const rr=r.over['Replay Rows'];if(rr){const b=rr[0][0].json.body;const o=typeof b==='string'?JSON.parse(b):b;(o.p_rows||[]).forEach(x=>console.log('  ROW '+x.judge_seat+': '+x.verdict_tag+' | '+x.result_line));}})();
