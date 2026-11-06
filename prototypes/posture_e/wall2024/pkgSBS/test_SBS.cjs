// pkgSBS test. Run from wall2024/: node pkgSBS/test_SBS.cjs
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>require('crypto').createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n+(d?' -- '+d:''));}};
const P=JSON.parse(rd('pkgSBS/plan_SBS.json'));for(const n of P.nodes)T(n.name+': base and final shas match the plan',sha(rd(n.base))===n.base_sha&&sha(rd('pkgSBS/patched/'+n.file))===n.final_sha);
const base=rd('pkgSBP/patched/Send_Back_Record.js'),pat=rd('pkgSBS/patched/Send_Back_Record.js'),altB=rd('pkgALT/patched/Alt_Send_Back_Record.js'),altP=rd('pkgSBS/patched/Alt_Send_Back_Record.js');
const unclone=s=>s.replace(/Alt Send Back Build/g,'Send Back Build').replace(/Alt Judge Enforcer Record/g,'Judge Enforcer Record').replace(/seat_role:'alternate'/g,"seat_role:'panel'").replace(/Alt Seated/g,'Panel Cure Check');
T('Alt Send Back Record is still the clone of Send Back Record (same edit on both)',unclone(altP)===pat&&unclone(altB)===base);
const body=(seat,du)=>JSON.stringify({payload:{judge_seat:seat,verdict_raw:'V '+seat,drv_uncured:du||0}});
const run=(code,seats,opt={})=>{const B=seats.map(s=>({json:{seat:s.seat,run_token:'t',api_model:'m',msg:'p',items:s.items}}));const R=seats.map(s=>s.err?{json:{error:{message:'timeout'}}}:{json:{choices:[{message:{content:s.reply}}]}});
 const bodies=opt.bodies||seats.map(s=>body(s.seat));const $=n=>({'Judge Enforcer Record':{first:()=>({json:opt.pass||{}})},'Send Back Build':{all:()=>B},'Panel Cure Check':{first:()=>({json:{bodies}})}})[n];
 return new Function('$','$input',code)($,{all:()=>R})[0].json;};
const seatsOf=rows=>{const by={};rows.forEach(r=>{const k=r.run_token+' '+r.seat;(by[k]=by[k]||[]).push(r);});return Object.values(by).map(rs=>({seat:rs[0].seat,reply:(rs.find(r=>r.full_reply)||{}).full_reply||'',items:rs.map((r,k)=>({sid:((r.response_line||'').match(/SENDBACK\s*:?\s*(?:ITEM\s*)?(S\d+)/i)||[])[1]||('S'+(k+1)),rule:r.rule,item:r.item,line:r.flagged_line,reason:''})),rows:rs}));};
const it=(...s)=>s.map(x=>({sid:x,rule:'E-ANS',item:'i '+x,line:'l',reason:'r'}));
// 1. stored runs: items read exactly as before; what silence would count
for(const [lab,f] of [['32980','pkgSBP/fixture_sendback_32980.json'],['32949 and 32973','pkgAPPLY/fixture_sendback_32949_32973.json']]){const S=seatsOf(JSON.parse(rd(f)));const o=run(pat,S),o0=run(base,S);
 T(lab+': every send-back item is read exactly as before',JSON.stringify(o.sb_items)===JSON.stringify(o0.sb_items));
 const na=o.sb_items.filter(x=>x.ans==='NO ANSWER');console.log('   '+lab+': NO ANSWER '+na.length+'; counted as silence: '+JSON.stringify(o.sendback.silent_counted)+'; written, not read: '+o.sb_rows.filter(r=>/WRITTEN, NOT READ/.test(r.cure_reason)).map(r=>r.seat+' '+r.item).join(' | '));}
// 2. synthetic
{const o=run(pat,[{seat:'a',reply:'SENDBACK: S1 || KEEP || r',items:it('S1','S2','S3')},{seat:'b',reply:'SENDBACK: S1 || KEEP || r\nSENDBACK: S2 || KEEP || r',items:it('S1','S2')}]);
 const ba=JSON.parse(o.bodies[0]).payload,bb=JSON.parse(o.bodies[1]).payload;
 T('two silent items on seat a add 2 to its drv_uncured and set alt_needed; seat b answered all and is unchanged',ba.drv_uncured===2&&bb.drv_uncured===0&&o.alt_needed===true&&JSON.stringify(o.sendback.silent_counted)==='[{"seat":"a","items":["S2","S3"]}]',JSON.stringify([ba.drv_uncured,bb.drv_uncured,o.sendback.silent_counted]));
 T('the silent seat carries one SEND-BACK SILENCE audit line naming S2 and S3',/\[AUDIT v40: SEND-BACK SILENCE -- SEAT: a; ITEMS: S2, S3;/.test(ba.verdict_raw)&&!/SEND-BACK SILENCE/.test(bb.verdict_raw));
 T('the silent rows say SILENT and counted; the answered row does not',o.sb_rows.filter(r=>/SILENT: no written answer; counted/.test(r.cure_reason)).map(r=>r.item).join()==='i S2,i S3');}
{const o=run(pat,[{seat:'a',reply:'S2: I keep it, the line stands. SENDBACK: S1 || KEEP || r',items:it('S1','S2')}]);
 T('a written but unparsed answer naming S2 is not silence: not counted, row says WRITTEN, NOT READ',JSON.parse(o.bodies===undefined?'{"payload":{"drv_uncured":0}}':o.bodies[0]).payload.drv_uncured===0&&o.sb_rows.some(r=>/WRITTEN, NOT READ/.test(r.cure_reason))&&!o.alt_needed);}
{const o=run(pat,[{seat:'a',reply:'SENDBACK: S12 || KEEP || r',items:it('S1','S12')}]);T('S12 named does not stop S1 from being silent',JSON.stringify(o.sendback.silent_counted)==='[{"seat":"a","items":["S1"]}]',JSON.stringify(o.sendback.silent_counted));}
{const o=run(pat,[{seat:'a',err:true,items:it('S1','S2')}]);T('a failed call is not silence: nothing counted, no bodies output',!o.bodies&&!o.alt_needed&&o.sendback.silent_counted.length===0);}
{const o=run(pat,[{seat:'a',reply:'SENDBACK: S1 || KEEP || r',items:it('S1')}]);const o0=run(base,[{seat:'a',reply:'SENDBACK: S1 || KEEP || r',items:it('S1')}]);
 const srt=v=>Array.isArray(v)?v.map(srt):v&&typeof v==='object'?Object.keys(v).sort().reduce((a,k)=>(a[k]=srt(v[k]),a),{}):v;T('all answered: output equals the base output plus silent_counted [] and alt_needed false',JSON.stringify(srt({...o0,alt_needed:false,sendback:{...o0.sendback,silent_counted:[]}}))===JSON.stringify(srt(o)));}
{const pb=[body('a',1)];const o=run(pat,[{seat:'a',reply:'',items:it('S1')}],{pass:{bodies:pb,alt_needed:true}});T('PASS.bodies are used when present and the count adds to an existing drv_uncured (1 + 1)',JSON.parse(o.bodies[0]).payload.drv_uncured===2&&o.alt_needed===true);}
// 3. the alternate path: the clone counts on Alt Seated bodies, and Alt Apply names the silent items in the unseat line
{const B=[{json:{seat:'sol',run_token:'t',api_model:'m',msg:'p',items:it('S1','S2')}}];const R=[{json:{choices:[{message:{content:'SENDBACK: S1 || KEEP || r'}}]}}];
 const $=n=>({'Alt Judge Enforcer Record':{first:()=>({json:{}})},'Alt Send Back Build':{all:()=>B},'Alt Seated':{first:()=>({json:{bodies:[body('sol')]}})}})[n];
 const o=new Function('$','$input',altP)($,{all:()=>R})[0].json;T('Alt Send Back Record counts sol S2 on the Alt Seated body',JSON.parse(o.bodies[0]).payload.drv_uncured===1&&o.sb_rows[0].seat_role==='alternate');
 const am=rd('pkgSBS/patched/Alternate_Merge.js');T('Alt Apply adds the silent send-back items to the unseat line',/SEND-BACK '\+i\+' \(no written answer\)/.test(am)&&am.replace(/\n   \.concat\(\(\(SBR&&SBR\.sendback[^\n]*/,';')!==am);}
console.log(ok+' OK '+bad+' FAIL');process.exitCode=bad?1:0;
