// 34626 chain (stored replies): written rows of the candidate against live. Usage: node pkgGCP/rows_equal.cjs <live fetch-back> <candidate>
const chain=require('../pkgKSR/w3_grade/chain.cjs');const nt=chain.nt;
(async()=>{const a=await chain(process.argv[2]),b=await chain(process.argv[3]);
 console.log('live:',process.argv[2],'\ncandidate:',process.argv[3]);
 a.rows.forEach((x,i)=>{const y=b.rows[i];console.log((x.judge_seat||x.seat)+': drv '+x.drv_uncured+' / '+y.drv_uncured+'; tag '+x.verdict_tag+' / '+y.verdict_tag+'; row equal: '+(nt(x)===nt(y)));});
 const nodes=Object.keys(a.over).filter(n=>nt(a.over[n])!==nt(b.over[n]));console.log('nodes whose output differs:',nodes.length?nodes.join(', '):'none');
})().catch(e=>{console.error(e);process.exit(1)});
