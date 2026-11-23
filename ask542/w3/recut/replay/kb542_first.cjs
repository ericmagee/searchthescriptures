// ASK 542 known bad (W4; W2 10763 note a): 41418 sol's FIRST reply as the payload node received it (Panel Judge 3 openrouter output, through kkjvText), with the rounds from its own prompt body (ciRounds(drvPromptText)), through the whole kunxLines, OLD (live) against NEW (W3 target). Also sol62 and chatgpt.
const fs=require('fs');const crypto=require('crypto');const {load}=require('/tmp/claude-0/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/scratchpad/rp542/sandbox.cjs');const P='/mnt/project-files/';const B='/tmp/claude-0/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/scratchpad/rp542/';
const md5=s=>crypto.createHash('md5').update(s).digest('hex').slice(0,8);
const rd=f2=>{const RD={};for(const f of f2){const J=JSON.parse(fs.readFileSync(f,'utf8'));Object.assign(RD,J.runData||(J.data&&J.data.resultData||J).runData||J);}return RD;};
const out1=(RD,n)=>{const r=RD[n];if(!r)return null;const x=r[r.length-1];return (((x.data||{}).main||[[]])[0]||[]).map(y=>y.json);};
const content=j=>{try{const c=j.choices[0].message.content;return typeof c==='string'?c:c.map(p=>p.text||'').join('');}catch(e){return null;}};
const O=load(B+'live542_engine.json','Panel Payloads').ctx,N=load(B+'target_engine_542.json','Panel Payloads').ctx;
const RD=rd(['ask531/w4/41418/part_panel.json','ask531/w4/41418/part_misc.json'].map(f=>P+f));const PB=out1(RD,'Panel Build')[0];const res=[];
const RT=fs.readFileSync(P+'ask516/w4/b/run41418/rounds516_41418.txt','utf8');
PB.judges.forEach((j,i)=>{const raw=content(out1(RD,'Panel Judge '+(i+1)+' openrouter')[0]);const T=O.kkjvText(raw);const R=O.ciRounds(O.drvPromptText(j.body));
 const a=O.kunxLines(T,R),b=N.kunxLines(T,R);const f=x=>x.link+' ['+(/saying the block lacks/.test(x.why)?'474-478':x.a?'460 '+x.a:/the count names no layer/.test(x.why)?'479-481 general':'other')+']';
 res.push('judge '+(i+1)+' '+j.seat+' | first reply md5 '+md5(raw)+' chars '+raw.length+' | rounds from prompt: '+Object.keys(R).filter(k=>/^[CD]R[1-4]$/.test(k)).map(k=>k+' '+String(R[k]).length).join(', ')+
  '\n  OLD K-UNX: '+(a.items.map(f).join('; ')||'none')+'\n  NEW K-UNX: '+(b.items.map(f).join('; ')||'none')+'\n  marks equal: '+(JSON.stringify(a.marks)===JSON.stringify(b.marks))+' | OLD marks '+a.marks.length+', NEW marks '+b.marks.length);});
console.log(res.join('\n'));fs.writeFileSync('/tmp/claude-0/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/scratchpad/rp542/out_kb542_first.txt',res.join('\n')+'\n');
