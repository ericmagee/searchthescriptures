// A3 negative cases for S4-X (BB-8684), run from E's p3 dir at d6f4bea: node negX.cjs
const fs=require('fs');
const iv0=JSON.parse(fs.readFileSync('p3/iv_30091.json'))[0].independent_verdict_raw;const iv=iv0.slice(0,iv0.indexOf('\n\n['));
const r=JSON.parse(fs.readFileSync('row_49774304-6140-4ac7-953d-e0577caf83a9.json'))[0];
const prev={cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3};
const L=iv.split('\n');const d4=L.find(l=>/^D4 vs C6/.test(l));const tail=d4.slice(d4.indexOf(' -- '));const d2=L.find(l=>/^D2[: ]/.test(l));const d2t=d2.slice(d2.indexOf(' -- '));
const run=(file,text)=>{const code=fs.readFileSync(file,'utf8');const $input={first:()=>({json:{choices:[{message:{content:text},finish_reason:'stop'}]}})};const $=()=>({first:()=>({json:prev})});
 const out=(new Function('$input','$',code))($input,$)[0].json;return {tag:out.verdict_tag,flags:out.audit_flags,lines:out.independent_verdict_raw.split('\n').filter(l=>/AUDIT v18|WITHDRAWN MISSED|ILLEGAL|SPLIT LINK|NOT CONCEDED|CONCEDE/.test(l)).map(l=>l.slice(0,170))};};
const C=s=>s.replace('CLAUSE: BROKEN-1 -- n=6 w=0 k=1','CLAUSE: PARTIAL-1 -- n=6 w=1 k=0').replace(/^BROKEN\. /,'PARTIAL. ').replace(/^RESULT:[^\n]*/m,'RESULT: UNDERDETERMINED');
const cases={
 'A: WB line graded DEFENDER LINK STANDS (PARTIAL-1 w=1 k=0)': C(iv.replace(d4,'D4 vs C6 (Luke 2:41; Luke 2:48): WITHDRAWN AFTER AN UNANSWERED WITNESS -- DEFENDER LINK STANDS'+tail)),
 'A2: WB line graded STANDS (the stored grade word)': C(iv.replace(d4,'D4 vs C6 (Luke 2:41; Luke 2:48): WITHDRAWN AFTER AN UNANSWERED WITNESS -- STANDS'+tail)),
 'B: phrase in lower case, UNDERDETERMINED': C(iv.replace(d4,'D4 vs C6 (Luke 2:41; Luke 2:48): withdrawn after an unanswered witness -- UNDERDETERMINED'+tail)),
 'C: WB form on D2, a link CR3 never conceded, plus D4 BROKEN as stored': iv.replace(d2,'D2 vs C1 (John 1:13): WITHDRAWN AFTER AN UNANSWERED WITNESS -- UNDERDETERMINED'+d2t).replace('CLAUSE: BROKEN-1 -- n=6 w=0 k=1','CLAUSE: BROKEN-1 -- n=6 w=1 k=1'),
 'C0: same D2 as plain "D2: WITHDRAWN" (pre-existing form, for comparison)': iv.replace(d2,'D2: WITHDRAWN'+d2t).replace('CLAUSE: BROKEN-1 -- n=6 w=0 k=1','CLAUSE: BROKEN-1 -- n=6 w=1 k=1')};
console.log('D2 stored line:',d2.slice(0,120));
for(const [nm,t] of Object.entries(cases)){const o=run('p3/new/Extract_Independent_Verdict.js',t);console.log('==',nm,'| tag',o.tag,'flags',o.flags);o.lines.forEach(l=>console.log('   ',l));}
