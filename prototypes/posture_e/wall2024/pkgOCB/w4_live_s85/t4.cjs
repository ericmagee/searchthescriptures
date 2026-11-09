const {harness,live}=require('/tmp/claude-0/-home-user/86d59483-62fd-5fa0-b8c4-6322500f4823/scratchpad/sjr/prototypes/posture_e/wall2024/pkgGSL/harness.cjs');const fs=require('fs');
const NEW='/mnt/project-files/wall2024/fetchback_live_s85.json',OLD='/mnt/project-files/wall2024/fetchback_live_s84.json';
const d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_C4_Call_anthropic.json','utf8'));const it=(Array.isArray(d)?d[0]:d).data.main[0];
const plant=(sec)=>{const c=JSON.parse(JSON.stringify(it));const t=c[0].json.content.find(x=>x.type==='text');t.text+='\n\n'+sec;return c;};
const run=(sec,code)=>harness('34108',{'C4 Call anthropic':plant(sec)})(live(code,'C4 Extract'),'C4 Call anthropic')[0].json;
let ok=0,bad=0;const T=(n,c,i)=>{c?ok++:bad++;console.log((c?'OK   ':'FAIL ')+n+(i?': '+i:''));};
// 0 real 34108: no section
const r0=harness('34108')(live(NEW,'C4 Extract'),'C4 Call anthropic')[0].json;T('0 real 34108 C4: no section recorded',r0.contradictions&&r0.contradictions.section===false,JSON.stringify(r0.contradictions));
const o0=harness('34108')(live(OLD,'C4 Extract'),'C4 Call anthropic')[0].json;const r0b={...r0};delete r0b.contradictions;T('0b real 34108 C4: every other field byte-equal to live',JSON.stringify(r0b)===JSON.stringify(o0));
// 1 the recorded case
const S1="OPPONENT'S CONTRADICTIONS:\nX1 LINK 4 | EARLIER [CR3] \"I grant that this is the ordinary means\" | CLOSING [CR4] \"Genesis 4:1 therefore cannot supply the sequence for Matthew\" | granted Genesis 4:1 as the ordinary means, then denied it supplies the sequence";
const r1=run(S1,NEW).contradictions;T('1 recorded 34108 contradiction found',r1.section&&r1.lines.length===1&&r1.lines[0].found===true&&r1.lines[0].on==='LINK 4',JSON.stringify(r1.lines[0]).slice(0,260));
// 2 invented earlier quote
const S2=S1.replace('I grant that this is the ordinary means','I deny that Joseph begat Jesus in any way');const r2=run(S2,NEW).contradictions;T('2 invented earlier quote not found',r2.lines[0].earlier_found===false&&r2.lines[0].closing_found===true&&r2.found===0);
// 3 earlier quote tagged CR4
const r3=run(S1.replace('EARLIER [CR3]','EARLIER [CR4]'),NEW).contradictions;T('3 earlier tagged CR4 refused',r3.lines[0].earlier_found===false);
// 4 wrong round
const r4=run(S1.replace('EARLIER [CR3]','EARLIER [CR1]'),NEW).contradictions;T('4 earlier quote in wrong round refused',r4.lines[0].earlier_found===false);
// 5 short quote
const r5=run(S1.replace('\"I grant that this is the ordinary means\"','\"ordinary means\"'),NEW).contradictions;T('5 two-word quote refused',r5.lines[0].earlier_found===false);
// 6 NONE
const r6=run("OPPONENT'S CONTRADICTIONS: NONE",NEW).contradictions;T('6 NONE read',r6.section&&r6.none&&r6.lines.length===0);
// 7 two lines, markdown and curly quotes
const S7=S1.replace(/"/g,'“').replace('“ |','” |')+"\n- X2 PREMISE 2 | EARLIER [CR3] \"**I grant** that this is the ordinary means\" | CLOSING [CR4] \"cannot supply the sequence for Matthew\" | same";
const r7=run(S7,NEW).contradictions;T('7 two lines read',r7.lines.length===2,JSON.stringify(r7.lines.map(l=>[l.x,l.on,l.found])));
// 8 old code unaffected by planted section (byte-equal apart from field)
const ro=run(S1,OLD),rn=run(S1,NEW);delete rn.contradictions;T('8 other fields byte-equal with section present',JSON.stringify(ro)===JSON.stringify(rn));
console.log(ok+' OK, '+bad+' FAIL');
