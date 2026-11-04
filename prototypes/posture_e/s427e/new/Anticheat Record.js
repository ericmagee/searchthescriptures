// ruling 427: records the closing-round anti-cheat answers. Each answer line is read in the form
// ANTICHEAT: <id> -- CONSISTENT | REVERSED | NO EARLIER READING -- CLOSE: "<...>" -- EARLIER: "<...>". A REVERSED answer is shown to the judges
// only when both quotes stand in that side's own words (the CLOSE quote in its close round, the EARLIER quote in its rounds 1 to 3); otherwise it
// is recorded QUOTE NOT FOUND and shown to no judge. TRIAL: marks only; nothing here removes a seat or changes a count.
// s427c: RECORD-ONLY until the known case passes (ruling 427 test: 32643, Deuteronomy 22:24 REVERSED). While SHOW is false no mark reaches a judge;
// the answers are recorded in review_notes. acx_only (dry re-grade only) stops the run after this node, so the check can be tested without a panel.
const SHOW=false;let ACX_ONLY=false;try{const bb=$('Debate Start').first().json;const b=(bb&&bb.body&&typeof bb.body==='object')?bb.body:bb;ACX_ONLY=b.acx_only===true&&b.regrade_dry===true;}catch(e){ACX_ONLY=false;}
const B=$('Anticheat Build').all().map(x=>x.json);
const first=B[0]||{};
if(first.acx_skip)return [{json:{acx_only:ACX_ONLY,acx:{skipped:true,why:first.why||'',rows:[],reversed:{D:[],C:[]},not_checked:first.not_checked||[]}}}];
let RGL=null;try{if($('Regrade Load').isExecuted)RGL=$('Regrade Load').first().json;}catch(e){RGL=null;}
let F={};try{F=RGL?RGL.f:$('Final Output').first().json;}catch(e){F={};}
const N=s=>String(s||'').toLowerCase().replace(/[“”"’‘'*_`\[\]]/g,'').replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ').trim();
const CLOSE={D:N(F.cr4),C:N(F.dr4)},EARLY={D:N([F.cr1,F.cr2,F.cr3].join('\n')),C:N([F.gr1,F.gr2,F.dr3].join('\n'))};
const stands=(q,T)=>{const x=N(q);if(x.split(' ').length<3)return false;if(T.includes(x))return true;
 /* an ellipsis inside the quote: every part of five words or more must stand */const parts=String(q).split(/\.\.\.|…/).map(N).filter(p=>p.split(' ').length>=5);return parts.length>0&&parts.every(p=>T.includes(p));};
const R=$input.all().map(x=>x.json); // s427e (acx_only 32715: one call wrote "ANTICHEAT: ITEM X72"; 28 answers were dropped): the id may follow ITEM or bold marks
const meta={};for(const b of B)for(const it of (b.items||[]))meta[it.id]=it;
const rows=[],errors=[];
R.forEach((r,i)=>{let txt='';try{txt=String(r.choices[0].message.content||'');}catch(e){errors.push('call '+(i+1)+': no reply ('+String(r.error&&r.error.message||r.message||'unknown').slice(0,120)+')');return;}
 for(const line of txt.split('\n')){const m=line.match(/ANTICHEAT:\s*\**\s*(?:ITEM\s+)?(X\d+)\s*\**\s*--\s*(CONSISTENT|REVERSED|NO EARLIER READING)\s*(?:--\s*CLOSE:\s*["“](.*?)["”]\s*)?(?:--\s*EARLIER:\s*["“](.*)["”])?\s*$/);if(!m)continue;
  const it=meta[m[1]];if(!it)continue;const row={id:m[1],side:it.side,verse:it.verse,answer:m[2],close_q:m[3]||'',earlier_q:m[4]||''};
  if(row.answer==='REVERSED'){row.close_ok=stands(row.close_q,CLOSE[it.side]);row.earlier_ok=stands(row.earlier_q,EARLY[it.side]);row.quotes_ok=row.close_ok&&row.earlier_ok;row.shown=SHOW&&row.quotes_ok;if(!row.quotes_ok)row.note='QUOTE NOT FOUND';else if(!SHOW)row.note='RECORD-ONLY';}
  rows.push(row);}});
const answered=new Set(rows.map(r=>r.id));const no_answer=Object.keys(meta).filter(id=>!answered.has(id));
const reversed={D:rows.filter(r=>r.side==='D'&&r.shown),C:rows.filter(r=>r.side==='C'&&r.shown)};
const counts={items:Object.keys(meta).length,consistent:rows.filter(r=>r.answer==='CONSISTENT').length,reversed:rows.filter(r=>r.answer==='REVERSED').length,shown:reversed.D.length+reversed.C.length,quote_not_found:rows.filter(r=>r.note==='QUOTE NOT FOUND').length,quotes_ok:rows.filter(r=>r.answer==='REVERSED'&&r.quotes_ok).length,no_earlier:rows.filter(r=>r.answer==='NO EARLIER READING').length,no_answer:no_answer.length,not_checked:(first.not_checked||[]).length,calls:B.length};
return [{json:{acx_only:ACX_ONLY,acx:{skipped:false,record_only:!SHOW,model:first.model||'',counts,rows,reversed,no_answer,not_checked:first.not_checked||[],errors}}}];
