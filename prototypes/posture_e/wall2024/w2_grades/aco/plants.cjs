// W2 fresh plants for pkgACO on 33490 (stored Anticheat Record: 0 REVERSED): a planted Anticheat Record with REVERSED rows on BOTH sides,
// a skipped record, a record with no acx, and a record whose reversed lists are empty but rows say REVERSED (record-only).
const fs=require('fs');const W='/mnt/project-files/wall2024/';const {run}=require('./replay.cjs');
const X=JSON.parse(fs.readFileSync(W+'ex33490_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const AR0=rd['Anticheat Record'].slice(-1)[0].data.main[0];const base=AR0[0].json.acx;
const rowD=base.rows.find(r=>r.side==='D'),rowC=base.rows.find(r=>r.side==='C');console.log('planted D row',rowD.id,rowD.verse,'| C row',rowC.id,rowC.verse);
const mkAR=f=>{const a=JSON.parse(JSON.stringify(AR0));f(a[0].json);return a;};
const rnOf=o=>{const s=JSON.stringify(o);const m=s.match(/"review_notes":"((?:[^"\\]|\\.)*)"/);return m?JSON.parse('"'+m[1]+'"'):'';};
const P=[
 ['A both sides REVERSED and shown',j=>{const D=Object.assign({},rowD,{answer:'REVERSED',shown:true}),C=Object.assign({},rowC,{answer:'REVERSED',shown:true});j.acx.rows=j.acx.rows.map(r=>r.id===D.id?D:r.id===C.id?C:r);j.acx.reversed={D:[D],C:[C]};Object.assign(j.acx.counts,{consistent:j.acx.counts.consistent-2,reversed:2,shown:2});},{notes:2,flags:2}],
 ['B skipped record',j=>{j.acx={skipped:true,why:'planted skip'};},{notes:0,flags:0,notrun:1}],
 ['C record with no acx field',j=>{delete j.acx;},{notes:0,flags:0}],
 ['D REVERSED rows, record-only (not in reversed lists)',j=>{j.acx.rows=j.acx.rows.map(r=>r.id===rowD.id?Object.assign({},r,{answer:'REVERSED',note:'RECORD-ONLY'}):r);j.acx.reversed={D:[],C:[]};Object.assign(j.acx.counts,{reversed:1,shown:0});},{notes:0,flags:1}],
 ['E close quote with a double quote and a newline',j=>{const D=Object.assign({},rowD,{answer:'REVERSED',shown:true,close_q:'He said "no"\nthen yes'});j.acx.reversed={D:[D],C:[]};j.acx.rows=j.acx.rows.map(r=>r.id===D.id?D:r);},{notes:1,flags:1}],
];
(async()=>{let ok=0;for(const [nm,f,exp] of P){const over={'Anticheat Record':mkAR(f)};
 const b=await run('Build Independent Verdict',rd,over,null);const h=await run('Build Independent Verdict',rd,null,['Anticheat Record']);
 const m=b[0].json.verdictBody.messages,mh=h[0].json.verdictBody.messages;const T=c=>typeof c==='string'?c:JSON.stringify(c);const txt=T(m[3].content),th=T(mh[3].content);
 const notes=(txt.match(/\[ANTI-CHEAT CHECK/g)||[]).length;let pos=[];let i=-1;while((i=txt.indexOf('[ANTI-CHEAT CHECK',i+1))>=0){const before=txt.slice(0,i);const hd=[...before.matchAll(/\n([A-Z][A-Z ’'-]{6,60}(?:CLOSE|ROUND 4|CR4|DR4)[^\n]{0,40})\n/g)].map(x=>x[1]);pos.push(hd.length?hd[hd.length-1].slice(0,60):'(no header found)');}
 const stripped=txt.replace(/\n\n\[ANTI-CHEAT CHECK[^\]]*\]/g,'');const restEqual=stripped===th&&m.length===mh.length&&m.every((x,k)=>k===3||JSON.stringify(x)===JSON.stringify(mh[k]));
 const bs=rnOf((await run('Build Save Body',rd,over,null))[0].json);const items=bs.split(/(?<=\]) (?=\[)|\n/).filter(x=>/AUDIT ANTI-CHEAT/.test(x));const flags=(bs.match(/\[AUDIT ANTI-CHEAT \(TRIAL\): (?:DEFENDER|CHALLENGER) [^\]]*REVIEW THIS ROW\.\]/g)||[]).length,notrun=items.filter(x=>/not run/.test(x)).length;
 const pass=notes===exp.notes&&flags===exp.flags&&(exp.notrun==null||notrun===exp.notrun)&&restEqual;if(pass)ok++;
 console.log((pass?'OK  ':'FAIL')+' '+nm+' | notes '+notes+' | rest of request equal to hidden: '+restEqual+' | notes follow: '+JSON.stringify(pos)+' | save: anti-cheat items '+items.length+', REVIEW rows '+flags+', not-run '+notrun+' | expected '+JSON.stringify(exp));}
 console.log('  C save item text:',JSON.stringify((rnOf((await run('Build Save Body',rd,{'Anticheat Record':mkAR(j=>{delete j.acx;})},null))[0].json).match(/\[AUDIT ANTI-CHEAT[^\]]*\]/)||[''])[0]));console.log('plants as expected',ok,'of',P.length);})();
