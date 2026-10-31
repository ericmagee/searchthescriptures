// BB-8634 S4-X harness: whole Extract IV node, mocked $input and $('Build Independent Verdict'), on run 30091's single judge and three J2 variants.
const fs=require('fs');
const iv0=JSON.parse(fs.readFileSync('p3/iv_30091.json'))[0].independent_verdict_raw;const iv=iv0.slice(0,iv0.indexOf('\n\n['));
const r=JSON.parse(fs.readFileSync('row_49774304-6140-4ac7-953d-e0577caf83a9.json'))[0];
const prev={cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3};
const d4=iv.split('\n').find(l=>/^D4 vs C6/.test(l));const tail=d4.slice(d4.indexOf(' -- '));
const V1=iv.replace(d4,'D4 vs C6 (Luke 2:41; Luke 2:48): WITHDRAWN AFTER AN UNANSWERED WITNESS -- DEFENDER LINK BROKEN'+tail).replace('CLAUSE: BROKEN-1 -- n=6 w=0 k=1','CLAUSE: BROKEN-1 -- n=6 w=1 k=1');
const V2=iv.replace(d4,'D4 vs C6 (Luke 2:41; Luke 2:48): WITHDRAWN AFTER AN UNANSWERED WITNESS -- UNDERDETERMINED'+tail).replace('CLAUSE: BROKEN-1 -- n=6 w=0 k=1','CLAUSE: PARTIAL-1 -- n=6 w=1 k=0').replace(/^BROKEN\. /,'PARTIAL. ').replace(/^RESULT:[^\n]*/m,'RESULT: UNDERDETERMINED'); // the verdict line follows the clause in the variant
const prevN={...prev,cr3:String(prev.cr3).replace('**LINK 4: CONCEDED.**','**LINK 4: NARROWED TO: the census lists the line.**')};
const run=(file,text,pv)=>{const code=fs.readFileSync(file,'utf8');const $input={first:()=>({json:{choices:[{message:{content:text},finish_reason:'stop'}]}})};const $=(n)=>({first:()=>({json:pv})});
 const out=(new Function('$input','$',code))($input,$)[0].json;const raw=out.independent_verdict_raw;
 const pick=raw.split('\n').filter(l=>/AUDIT v18|WITHDRAWN MISSED|ILLEGAL|SPLIT LINK/.test(l)).map(l=>l.slice(0,150));return {tag:out.verdict_tag,flags:out.audit_flags,lines:pick};};
for(const [nm,t,pv] of [['ORIGINAL',iv,prev],['V1 J2 BROKEN',V1,prev],['V2 J2 UNDERDETERMINED',V2,prev],['V3 V2 + CR3 LINK 4 NARROWED',V2,prevN]])for(const [lab,f] of [['before X','p3/x_before.js'],['after X','p3/new/Extract_Independent_Verdict.js']]){const o=run(f,t,pv);console.log('==',nm,'|',lab,'| tag',o.tag,'flags',o.flags);o.lines.forEach(l=>console.log('   ',l));}
