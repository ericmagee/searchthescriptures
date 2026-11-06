// pkgRCL (W3 Wall 2496): K-RECHK log rows. Run from wall2024/: node pkgRCL/build_RCL.cjs [base, default pkgSQ]
// pkgRCK writes each K-RECHK hit as an AUDIT v39 mark in the verdict text only; trial counts come from SQL, so W3 asked for log rows too:
// kind send_back, rule K-RECHK, cure_status null, item = the change id, flagged_line = the new line, response_line = the original. Marks stay.
//  (a) every R.rp pair carries its change id as a third element: the send-back / gate item id (z.sid) for sbApply2024, and
//      'RETRACTED <link>' / 'RESTATED <link>' for the cure recompute. Every reader of R.rp destructures [o,n] and ignores the third element.
//  (b) rechk2024 keeps the id; the mark gains 'CHANGE: <id>;' after SEAT.
//  (c) Alternate Merge (the node whose enforcer_log_body Write Enforcer Log sends) reads every K-RECHK mark in the verdict texts it can see
//      (Panel Cure Check, Gate Record and Alt Gate Record bodies, its own final bodies, the alternates tried), one row per distinct
//      seat + change + rule + status + line, and adds the rows to enforcer_log and enforcer_log_body.p_rows on both of its returns. With no
//      marks the output is unchanged. A failure in the row reader adds no rows and never stops the node.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const E=[
 ['rp.push([o,z.to]);','rp.push([o,z.to,z.sid]);','sbApply2024 change id'],
 ['c.grade=g;rp.push([c.raw,nl]);',"c.grade=g;rp.push([c.raw,nl,'RETRACTED '+w.link]);",'RETRACTED change id'],
 ['c.grade=rs[0].grade;rp.push([c.raw,rs[0].text]);',"c.grade=rs[0].grade;rp.push([c.raw,rs[0].text,'RESTATED '+x.link]);",'RESTATED change id'],
 ['for(const [o0,n0] of (rp||[])){','for(const [o0,n0,id0] of (rp||[])){','rechk2024 reads the id'],
 [".push({rule:'K-CMT',line:l,orig:O.join(' / '),",".push({id:id0||null,rule:'K-CMT',line:l,orig:O.join(' / '),",'K-CMT hit id'],
 ["out.push({rule:'K-F',line:l,orig:O.join(' / '),old:null,","out.push({id:id0||null,rule:'K-F',line:l,orig:O.join(' / '),old:null,",'K-F unchecked id'],
 ["out.push({rule:'K-F',line:l,orig:O.join(' / '),old:oi.some(","out.push({id:id0||null,rule:'K-F',line:l,orig:O.join(' / '),old:oi.some(",'K-F hit id'],
 ["rk=H.map(h=>'\\n[AUDIT v39: K-RECHK -- '+(seat?'SEAT: '+seat+'; ':'')+'RULE: '","rk=H.map(h=>'\\n[AUDIT v39: K-RECHK -- '+(seat?'SEAT: '+seat+'; ':'')+'CHANGE: '+String(h.id||'change').replace(/;/g,',')+'; RULE: '",'mark names the change'],
];
const ROWS="function rechkRows2024(AM,AS){try{ /* pkgRCL (W3 2496): one send_back row per K-RECHK mark; trial counts come from SQL */\n"
+" const ex=n=>{try{return $(n).isExecuted?$(n).first().json:null;}catch(e){return null;}};const texts=[];const model={};const alt=new Set(((AS&&AS.alt_seats)||[]).map(s=>s&&s.seat));\n"
+" const addB=bs=>(Array.isArray(bs)?bs:[]).forEach(x=>{try{const p=JSON.parse(x).payload;texts.push([p.judge_seat||null,p.verdict_raw]);if(p.judge_seat&&!model[p.judge_seat])model[p.judge_seat]=p.judge_api_model||null;}catch(e){}});\n"
+" for(const n of ['Panel Cure Check','Gate Record','Alt Gate Record']){const j=ex(n);if(j)addB(j.bodies);}addB(AM.bodies);\n"
+" (AM.alternates_tried||[]).forEach(x=>{if(x&&x.verdict_raw)texts.push([x.alternate||null,x.verdict_raw]);});\n"
+" const RX=/\\[AUDIT v39: K-RECHK -- (?:SEAT: ([^;\\]]*); )?CHANGE: ([^;\\]]*); RULE: (K-[A-Z0-9]+); (NEW|ALREADY IN THE ORIGINAL|NOT CHECKED): ([\\s\\S]*?); LINE: ([\\s\\S]*?); ORIGINAL: ([\\s\\S]*?); TRIAL rule, record-only ; END\\]/g;\n"
+" const seen=new Set();const rows=[];const T=new Date().toISOString();\n"
+" for(const [s0,t] of texts){const s=String(t==null?'':t);RX.lastIndex=0;let m;while((m=RX.exec(s))){const seat=m[1]||s0||null;const k=[seat,m[2],m[3],m[4],m[6]].join('|');if(seen.has(k))continue;seen.add(k);\n"
+"  rows.push({run_token:(AS&&AS.run_token)||AM.run_token||null,seat,seat_role:seat&&alt.has(seat)?'alternate':'panel',judge_model:model[seat]||null,kind:'send_back',rule:'K-RECHK',item:m[2],flagged_line:m[6],prompt_sent:null,full_reply:null,reply_error:null,response_line:m[7],cure_status:null,cure_reason:m[4]+' ('+m[3]+'): '+m[5]+' (TRIAL rule, record-only; W3 2496)',at:T});}}\n"
+" return rows;}catch(e){return [];}}\n";
const A_EARLY="if(!Array.isArray(AS.alt_seats)||!AS.alt_seats.length)return [{json:AM}];";
const A_EARLY2="if(!Array.isArray(AS.alt_seats)||!AS.alt_seats.length){const __rk=rechkRows2024(AM,AS);if(!__rk.length)return [{json:AM}];const __b=AM.enforcer_log_body||{};\n return [{json:{...AM,enforcer_log:(AM.enforcer_log||[]).concat(__rk),enforcer_log_body:{...__b,p_rows:(Array.isArray(__b.p_rows)?__b.p_rows:(AM.enforcer_log||[])).concat(__rk)}}}];} /* pkgRCL: K-RECHK rows */";
const A_END="const panel_effective=summary.map(x=>x.seat).sort();\nreturn [{json:{...AM,bodies,summary,panel_effective,";
const A_END2="const panel_effective=summary.map(x=>x.seat).sort();\nrechkRows2024({...AM,bodies,alternates_tried:tried},AS).forEach(r=>log.push(r)); /* pkgRCL: K-RECHK rows */\nreturn [{json:{...AM,bodies,summary,panel_effective,";
const BASE=(process.argv[2]||'pkgSQ')+'/patched';const OUT=process.argv[3]||'pkgRCL'; /* [base] [out] (pkgRCLN, W3 2511) */const plan={base:BASE,nodes:[]};fs.rmSync(OUT+'/patched',{recursive:true,force:true});fs.mkdirSync(OUT+'/patched',{recursive:true});
for(const f of fs.readdirSync(BASE).filter(f=>f.endsWith('.js')).sort()){const b=fs.readFileSync(BASE+'/'+f,'utf8');let t=b;const ed=[];
 for(const [o,n,why] of E){const k=t.split(o).length-1;if(k>1)throw new Error(f+' '+why+' x'+k);if(k){t=t.split(o).join(n);ed.push(why);}}
 if(f==='Alternate_Merge.js'){const i=t.indexOf("const AM=$('Alternate Merge Seat')");if(i<0)throw new Error('AM anchor');t=t.slice(0,i)+ROWS+t.slice(i);
  for(const [o,n] of [[A_EARLY,A_EARLY2],[A_END,A_END2]]){if(t.split(o).length!==2)throw new Error('AM '+o.slice(0,40));t=t.replace(o,()=>n);}ed.push('K-RECHK rows (both returns)');}
 new Function('$','$input','$json',t);fs.writeFileSync(OUT+'/patched/'+f,t);plan.nodes.push({file:f,base_sha:sha(b),final_sha:sha(t),edits:ed});}
fs.writeFileSync(OUT+'/plan_RCL.json',JSON.stringify(plan,null,1));plan.nodes.forEach(x=>console.log(x.file.padEnd(32),x.base_sha,'->',x.final_sha,x.edits.length,x.edits.join('; ')));
