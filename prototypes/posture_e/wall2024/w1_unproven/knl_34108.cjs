// W1 (coordinator ask 22:56Z 11-09): pkgKNL on run 34108's stored text, live library (s87 = strip_VP1_s84), planted FORCED lines in luna's judgment. Run from wall2024/.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const L='pkgLIB/strip_VP1_s84/patched/';const R=f=>fs.readFileSync(f,'utf8');
const J1=JSON.parse(R('/mnt/project-files/wall2024/inputs/34108_Panel_Judge_1_openrouter.json'))[0].data.main[0][0].json;const PPN=R(L+'Panel_Payloads.js');
let ok=0,bad=0;const T=(c,m,i)=>{console.log((c?'OK   ':'FAIL ')+m+(i?' :: '+i:''));c?ok++:bad++;};const I=m=>console.log('     '+m);
const edit=f=>{const j=JSON.parse(JSON.stringify(J1));const c=j.choices[0].message.content;const n=f(c);if(f.name!=='id'&&n===c)throw new Error('plant did not apply');j.choices[0].message.content=n;return [{json:j}];};
const items=f=>{const o=harness('34108',{'Panel Judge 1 openrouter':edit(f)})(PPN,'Panel Check');const s=(o[0].json.summary||[])[0]||{};return (s.drv||[]).map(x=>x.rule+' '+(x.item||x.link||x.line||'').slice(0,60));};
const id=v=>v;
const ins=line=>v=>v.replace('\\nCONTRADICTIONS: NONE FOUND.','\\n'+line.replace(/"/g,'\\"')+'\\nCONTRADICTIONS: NONE FOUND.');
const B0=items(id);const diff=a=>({added:a.filter(x=>!B0.includes(x)),dropped:B0.filter(x=>!a.includes(x))});
I('baseline luna items: '+B0.length);
for(const l of ['FORCED: none graded.','FORCED: none.','**FORCED:** none','FORCED (Commitment 6): none','FORCED: no links are forced','FORCED: N/A']){const d=diff(items(ins(l)));T(!d.added.length&&!d.dropped.length,'CATCH "'+l+'": no K-F or K-CMT item',JSON.stringify(d));}
for(const l of ['FORCED: none, except D6 vs C5, which the challenger forced','FORCED: D1 vs C1 is forced because the reading cannot fit']){const d=diff(items(ins(l)));T(d.added.some(x=>/^K-F|^K-CMT/.test(x)),'CATCH "'+l+'": still checked (K-F or K-CMT raised)',JSON.stringify(d.added));}
// a none line beside a BROKEN grade: the none line must not hide the missing FORCED line
const brk=v=>v.replace('D1 vs C1 (Matthew 1:18): UNDERDETERMINED --','D1 vs C1 (Matthew 1:18): DEFENDER LINK BROKEN (Commitment 3) --');
const dB=diff(items(brk)),dBN=diff(items(v=>ins('FORCED: none graded.')(brk(v))));I('D1 vs C1 set to DEFENDER LINK BROKEN, no FORCED line: added '+JSON.stringify(dB.added));
T(JSON.stringify(dB.added.sort())===JSON.stringify(dBN.added.sort())&&dBN.added.length>0,'CATCH a BROKEN line with "FORCED: none graded." raises the same items as with no FORCED line (the none line hides nothing)',JSON.stringify(dBN.added));
// probes: forms outside the allow-list
for(const l of ['Forced: none','FORCED LINES: none','FORCED: \u2014 none','FORCED: none (no link is graded broken)','FORCED: none of the collisions','FORCED: There are no forced links.']){const d=diff(items(ins(l)));I('PROBE "'+l+'": '+(d.added.length?'raises '+JSON.stringify(d.added):'no item'));}
console.log('\nknl_34108: '+ok+' OK, '+bad+' FAIL');
