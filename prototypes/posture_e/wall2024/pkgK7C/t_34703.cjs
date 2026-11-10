// pkgK7C test: replay execution 34703 (stored replies) on live s112 and on the candidate; seat outcome, counts, K-G7 lines.
process.env.EX='/mnt/project-files/wall2024/ex34703_full.json';process.env.EXID='34703';const chain=require('./chain_ex.cjs');
(async()=>{for(const f of ['/mnt/project-files/wall2024/fetchback_live_s112.json',process.argv[2]||'pkgK7C/parent_s112_K7C.json']){const r=await chain(f,{});
 console.log('== '+f);console.log(' rows:',r.rows.map(x=>(x.judge_seat||x.seat)+':'+x.drv_uncured+':'+x.verdict_tag).join(' '));
 const t=JSON.stringify(r.over['Alternate Merge']||'');console.log(' alt:',(t.match(/ALTERNATE TRIED -- SEAT: \w+; ALTERNATE: \w+; MODEL: [^;]+; RESULT: [^;]+; WHY: [^;\]]+/g)||[]).join(' | '));
 const k=[...new Set((t.replace(/\\\\"/g,"'").replace(/\\"/g,"'").match(/REPORT -- SEAT: \w+; ITEM: D\d+[^;]*; RULE: K-G7; RESULT: \w+[^;]*; WHY: [^;]{0,140}/g)||[]))];console.log(' K-G7 reports:\n  '+k.join('\n  '));}})().catch(e=>{console.error(e);process.exit(1)});
