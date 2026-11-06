// E-GATE, Gate Record (W2; WALL-2024 2242, 2243, 2251). Reads each judge's GATE lines, applies its gate changes with its send-back answers,
// and decides each item (gateCure2024). Each uncured LIVE item adds 1 to the seat's drv_uncured and sets alt_needed, so Alternate Build removes
// the seat as for any uncured item. One debate_enforcer_log row (kind gate) per item. The gate changes join sb_items, so Alternate Merge's
// E-APPLY applies them too. A failed gate call is the transport's failure, not the judge's silence: its items are recorded and not counted.
const PASS=$('Send Back Record').first().json;
const GB=$('Gate Build').all().map(x=>x.json);const first=GB[0]||{};const T=new Date().toISOString();
if(first.gate_skip)return [{json:{...PASS,gate:{skipped:true,why:first.gate_why||'',report:first.gate_report||[]},gate_rows:[]}}];
const PB0=(()=>{try{return $('Panel Build').first().json;}catch(e){return null;}})();
const bodies=(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies).slice();
const R=$input.all().map(x=>x.json);const rows=[];const add=[];const seats=[];let any=false;
const safe=s=>cureSafe(String(s==null?'':s)).replace(/\s+/g,' ').trim();
GB.forEach((g,ci)=>{let txt='',err=null;try{txt=String(R[ci].choices[0].message.content||'');}catch(e){err=String((R[ci]&&R[ci].error&&(R[ci].error.message||R[ci].error))||'no reply').slice(0,200);}
 const b=JSON.parse(bodies[g.idx]);const p=b.payload;const its=(PASS.sb_items||[]).filter(x=>x.seat===g.seat);
 const j=PB0&&(PB0.judges||[]).find(q=>q.seat===g.seat);const PT=j?gatePromptText2024(j.body):'';const ctx={R:PT?ciRounds(PT):null,DL:PT?drvLinks(PT):[],ask:PT.includes('CITATION CHECK')};
 let C=null,cerr=null;if(!err){try{C=gateCure2024(g.seat,p.verdict_raw,g.F,its,g.items,txt,ctx);}catch(e){cerr=String(e&&e.message||e).slice(0,300);}}
 const res=C?C.res:g.items.map(x=>({gid:x.gid,kind:x.kind,src:x.src,live:x.live,ans:err?'NO REPLY':'NOT READ',to:'',reason:'',line:null,cured:false,why:err?'the gate call failed: '+err:'the gate answers could not be read: '+cerr}));
 const u=C?C.uncured:0;if(u>0){p.drv_uncured=(p.drv_uncured||0)+u;any=true;}
 p.verdict_raw=p.verdict_raw+'\n'+res.map(r=>'[AUDIT v38: E-GATE -- SEAT: '+g.seat+'; '+r.gid+' '+r.kind+' ('+r.src+'); ANSWER: '+r.ans+'; '+(r.cured?'CURED':'UNCURED')+': '+safe(r.why)+(r.cured?'':(C&&r.live?'; counted in drv_uncured':'; RECORD-ONLY, not counted'))+(r.cured?']':'. REVIEW THIS ROW.]')).join('\n')
  +(C&&C.fresh.length?'\n'+C.fresh.map(f=>'[AUDIT v38: E-GATE NEW ITEM -- SEAT: '+g.seat+'; '+f.kind+' ('+f.src+'): '+safe(f.why).slice(0,400)+'; raised after the gate answers; RECORD-ONLY, not counted. REVIEW THIS ROW.]').join('\n'):'');
 bodies[g.idx]=JSON.stringify(b);if(C)C.add.forEach(x=>add.push(x));
 seats.push({seat:g.seat,items:res.length,cured:res.filter(r=>r.cured).length,uncured_counted:u,fresh:C?C.fresh.length:0,error:err||cerr||null});
 res.forEach((r,k)=>{const it=g.items.find(x=>x.gid===r.gid)||{};rows.push({run_token:g.run_token,seat:g.seat,seat_role:'panel',judge_model:g.api_model,kind:'gate',rule:'E-GATE',item:r.gid+' '+r.kind+' ('+r.src+')',
  flagged_line:String((it.lines&&it.lines.length?it.lines.join('\n'):it.to)||'').slice(0,1500)||null,prompt_sent:k===0?g.msg:null,full_reply:k===0?(txt||null):null,reply_error:err||cerr,response_line:r.line?String(r.line).slice(0,1500):null,
  cure_status:r.cured?'CURED':'UNCURED',cure_reason:'GATE '+r.ans+(r.to?' TO: '+String(r.to).slice(0,600):'')+(r.reason?' -- '+String(r.reason).slice(0,400):'')+' | ENGINE: '+String(it.why||'').slice(0,600)+' | '+r.why+(r.cured?'':(C&&r.live?' (counted in drv_uncured)':' (RECORD-ONLY)')),at:T});});
 if(C)C.fresh.forEach(f=>rows.push({run_token:g.run_token,seat:g.seat,seat_role:'panel',judge_model:g.api_model,kind:'gate',rule:'E-GATE',item:'NEW '+f.kind+' ('+f.src+')',flagged_line:null,prompt_sent:null,full_reply:null,reply_error:null,response_line:null,cure_status:'UNCURED',cure_reason:'raised after the gate answers: '+String(f.why).slice(0,600)+' (RECORD-ONLY)',at:T}));});
return [{json:{...PASS,bodies,alt_needed:!!PASS.alt_needed||any,gate:{skipped:false,calls:GB.length,seats,report:first.gate_report||[]},gate_rows:rows,sb_items:(PASS.sb_items||[]).concat(add)}}];
