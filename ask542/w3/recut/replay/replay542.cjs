// ASK 542 criterion 4 (W4): every stored judgment that holds UNEXHIBITED, through the real kunxLines (Library 461-481 with its helpers), OLD (live daf5da98) against NEW (W3 target 59655f97).
// Text: debate_judgments.verdict_raw (stored final text; the raise-time text is not stored, plan section 3 NOT SEARCHED). Rounds: debate_results columns, mapped CR1 claude_r1, DR1 engine_r1, CR2 claude_r2, DR2 engine_r2, CR3 engine_r3, DR3 challenger_r3, CR4 defender_r4, DR4 challenger_r4 (checked on 41418 against rounds516_41418.txt).
// $ is the sandbox stub (no node data), the same for OLD and NEW.
const fs=require('fs');const crypto=require('crypto');const {load}=require('/tmp/claude-0/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/scratchpad/rp542/sandbox.cjs');
const B='/tmp/claude-0/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/scratchpad/rp542/',D='/mnt/project-files/ask542/w4/data/';const md5=s=>crypto.createHash('md5').update(s).digest('hex').slice(0,8);
const O=load(B+'live542_engine.json','Panel Payloads').ctx,N=load(B+'target_engine_542.json','Panel Payloads').ctx;
const J=JSON.parse(fs.readFileSync(D+'judgments.json')),RS=JSON.parse(fs.readFileSync(D+'results.json'));const RI=Object.fromEntries(RS.map(r=>[r.id,r]));
const map={CR1:'claude_r1',DR1:'engine_r1',CR2:'claude_r2',DR2:'engine_r2',CR3:'engine_r3',DR3:'challenger_r3',CR4:'defender_r4',DR4:'challenger_r4'};
const path=x=>/saying the block lacks/.test(x.why)?'474-478':x.a==='RANGE'?'RANGE':x.a?'460 ('+x.a+')':/the count names no layer the block lacks/.test(x.why)?'479-481 general':'other';
const key=x=>x.rule+'|'+x.link+'|'+path(x)+'|'+x.why;
const out={inputs:{judgments:J.length,judgments_md5:md5(fs.readFileSync(D+'judgments.json')),results_md5:md5(fs.readFileSync(D+'results.json'))},per:[],errors:[]};
let tot={old:0,neu:0,gen_old:0,gen_new:0,noRounds:0,ran:0};
for(const j of J){const r=RI[j.debate_id];if(!r||!r.engine_r3||!r.challenger_r3){tot.noRounds++;continue;}
 const R={};for(const k in map)R[k]=r[map[k]]||'';let a,b;
 try{a=O.kunxLines(j.verdict_raw,R);}catch(e){out.errors.push({jid:j.id,side:'OLD',e:String(e.message).slice(0,200)});continue;}
 try{b=N.kunxLines(j.verdict_raw,R);}catch(e){out.errors.push({jid:j.id,side:'NEW',e:String(e.message).slice(0,200)});continue;}
 tot.ran++;const ka=a.items.map(key),kb=b.items.map(key);tot.old+=ka.length;tot.neu+=kb.length;tot.gen_old+=a.items.filter(x=>path(x)==='479-481 general').length;tot.gen_new+=b.items.filter(x=>path(x)==='479-481 general').length;
 const dropped=a.items.filter(x=>!kb.includes(key(x))),added=b.items.filter(x=>!ka.includes(key(x)));
 const marksEq=JSON.stringify(a.marks)===JSON.stringify(b.marks);
 if(dropped.length||added.length||!marksEq)out.per.push({jid:j.id,run:r.run_token,seat:j.judge_seat,debate_id:j.debate_id,dropped:dropped.map(x=>({link:x.link,path:path(x)})),added:added.map(x=>({link:x.link,path:path(x)})),marks_equal:marksEq,
  marks_diff:marksEq?null:{old_only:a.marks.filter(m=>!b.marks.includes(m)).map(m=>m.slice(0,160)),new_only:b.marks.filter(m=>!a.marks.includes(m)).map(m=>m.slice(0,160))}});}
out.totals=tot;fs.writeFileSync('/tmp/claude-0/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/scratchpad/rp542/out_replay542.json',JSON.stringify(out,null,1));
console.log(JSON.stringify(tot));console.log('errors',out.errors.length,JSON.stringify(out.errors.slice(0,3)));
console.log('judgments with a difference',out.per.length,'| items dropped',out.per.reduce((s,p)=>s+p.dropped.length,0),'| added',out.per.reduce((s,p)=>s+p.added.length,0));
const pc={};for(const p of out.per)for(const d of p.dropped)pc[d.path]=(pc[d.path]||0)+1;console.log('dropped by path',JSON.stringify(pc));
for(const p of out.per)console.log(p.jid,p.run,p.seat,'| dropped',p.dropped.map(d=>d.link+' ['+d.path+']').join('; '),'| added',p.added.map(d=>d.link).join('; ')||'-','| marks equal',p.marks_equal);
