// ASK 542 (W4): raise-time replay where n8n run data is on disk (41418, 41043, 41090, 41102, 41117, 41155): each judge's FIRST reply (judge call output, through kkjvText) and the rounds from its own prompt body, through the whole kunxLines, OLD (live) against NEW (W3 target).
const fs=require('fs');const crypto=require('crypto');const {load}=require('/tmp/claude-0/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/scratchpad/rp542/sandbox.cjs');const P='/mnt/project-files/';const B='/tmp/claude-0/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/scratchpad/rp542/';
const md5=s=>crypto.createHash('md5').update(s).digest('hex').slice(0,8);
const rd=f2=>{const RD={};for(const f of f2){const J=JSON.parse(fs.readFileSync(f,'utf8'));const r=J.runData||(J.data&&J.data.resultData||J).runData||J;for(const k of Object.keys(r))RD[k]=r[k];}return RD;};
const outs=(RD,n)=>{const r=RD[n];if(!r)return [];return r.map(x=>(((x.data||{}).main||[[]])[0]||[]).map(y=>y.json));};
const content=j=>{try{const c=j.choices[0].message.content;return typeof c==='string'?c:(Array.isArray(c)?c.map(p=>p.text||'').join(''):'');}catch(e){return null;}};
const O=load(B+'live542_engine.json','Panel Payloads').ctx,N=load(B+'target_engine_542.json','Panel Payloads').ctx;
const RUNS={'41418':['ask531/w4/41418/part_panel.json','ask531/w4/41418/part_misc.json']};
for(const r of ['41043','41090','41102','41117'])RUNS[r]=[1,2,3,6,7].map(k=>'ask517/w4/'+r+'_part'+k+'.json');
if(fs.existsSync(P+'ask534/w4/replay/41155'))RUNS['41155']=fs.readdirSync(P+'ask534/w4/replay/41155').map(f=>'ask534/w4/replay/41155/'+f);
const f=x=>x.link+' ['+(/saying the block lacks/.test(x.why)?'474-478':x.a==='RANGE'?'RANGE':x.a?'460 '+x.a:/the count names no layer/.test(x.why)?'479-481 general':'other')+']';
const res=[];let n=0,diff=0;
for(const [run,files] of Object.entries(RUNS)){const RD=rd(files.filter(x=>fs.existsSync(P+x)).map(x=>P+x));const PB=(outs(RD,'Panel Build')[0]||[])[0]||{};const J=[];
 (PB.judges||[]).forEach((j,i)=>{const o=outs(RD,'Panel Judge '+(i+1)+' openrouter')[0];J.push({seat:j.seat,node:'Panel Judge '+(i+1),body:j.body,reply:o&&o[0]?content(o[0]):null});});
 const ab=(outs(RD,'Alternate Build')[0]||[]),ac=(outs(RD,'Alternate Call openrouter')[0]||[]);ab.forEach((b,i)=>J.push({seat:b.seat||b.alt_seat||('alt'+i),node:'Alternate Call '+i,body:b.body,reply:ac[i]?content(ac[i]):null}));
 for(const j of J){if(!j.reply||!j.body){res.push(run+' '+j.seat+' ('+j.node+'): no reply or body stored');continue;}n++;
  const T=O.kkjvText(j.reply);const R=O.ciRounds(O.drvPromptText(j.body));let a,b;try{a=O.kunxLines(T,R);b=N.kunxLines(T,R);}catch(e){res.push(run+' '+j.seat+' ERROR '+e.message);continue;}
  const d=JSON.stringify(a)!==JSON.stringify(b);if(d)diff++;const gen=x=>/the count names no layer/.test(x.why)&&!/saying the block lacks/.test(x.why)&&!x.a;const ga=a.items.filter(x=>!gen(x)||b.items.some(y=>y.link===x.link)),gm=a.marks.filter(m=>!a.items.filter(x=>gen(x)&&!b.items.some(y=>y.link===x.link)).some(x=>m.includes(x.link+": "+x.why)));const ok=JSON.stringify(ga)===JSON.stringify(b.items)&&JSON.stringify(gm)===JSON.stringify(b.marks);if(!ok)res.push("CHECK FAILED "+run+" "+j.seat);if(d)res.push("  check: NEW = OLD minus "+(a.items.length-ga.length)+" general-raise item(s) and their marks: "+ok);
  res.push(run+' '+j.seat+' ('+j.node+', reply md5 '+md5(j.reply)+') | OLD: '+(a.items.map(f).join('; ')||'none')+' | NEW: '+(d?(b.items.map(f).join('; ')||'none'):'same')+(d?' | DIFFERS':''));}}
res.push('judge replies run: '+n+' | differing OLD/NEW: '+diff);console.log(res.join('\n'));fs.writeFileSync('/tmp/claude-0/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/scratchpad/rp542/out_first542.txt',res.join('\n')+'\n');
// 4(c)/(d) check: in every differing reply, NEW's items and marks are OLD's minus the general-raise items (and their AUDIT v49 marks); nothing is added and no other item changes.
