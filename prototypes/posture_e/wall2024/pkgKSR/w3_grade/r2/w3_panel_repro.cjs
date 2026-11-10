// W3: W1's finding reproduced in the PANEL chain (terra's own seat) on a chosen file. PLANTED: terra's send-back answer to its D2 vs C1 item (E-HOLD on an UNDERDETERMINED collision)
// is an ANSWER CHECK line (the apply refuses it); PLANTED gate answer: terra's own stored change for that item (a collision line for the same pair, with [L1]).
// CONTROL: terra's stored answer as it was (the same final line, given at the send-back).
const {run,rd,U,cl,remap,gremap}=require('../w3_KSR_ECB.cjs');const tag=process.argv[2];
const st=rd['Send Back Build'][0].data.main[0];const si=st.findIndex(s=>s.json.seat==='chatgpt');const O0=JSON.parse(rd['Send Back Call openrouter'][0].data.main[0][si].json.choices[0].message.content);
const L0=O0.reasoning.split('\n').find(l=>/\|\| CHANGE TO: D2 vs C1/.test(l));const TD2=L0.replace(/^SENDBACK: S\d+ \|\| CHANGE TO: /,'').split(' || ')[0];
const mk=plant=>({'Send Back Call openrouter':async(over,out)=>{await remap('Send Back Call openrouter','Send Back Build')(over,out);if(!plant)return;const nw=out('Send Back Build')[0];const ni=nw.findIndex(s=>s.json.seat==='chatgpt');const it=(nw[ni].json.items||[]).find(z=>/^D2 vs C1\b/.test(z.line));
   const calls=over['Send Back Call openrouter']?over['Send Back Call openrouter'][0]:cl(rd['Send Back Call openrouter'][0].data.main[0]);const o=JSON.parse(calls[ni].json.choices[0].message.content);
   o.reasoning=o.reasoning.split('\n').map(l=>new RegExp('^SENDBACK: '+it.sid+' \\|\\|').test(l)?'SENDBACK: '+it.sid+' || CHANGE TO: ANSWER CHECK: Matthew 1:19 -- [CR3] -- MEANS: "the stated grounds are equity and sparing her" -- ANSWER: "The matter he must deal with is a pregnancy found before any coming together of the pair." -- MEETS -- the answer addresses the stated grounds. || PLANTED by W3':l).join('\n');calls[ni].json.choices[0].message.content=JSON.stringify(o);over['Send Back Call openrouter']=[calls];},
  'Gate Call openrouter':async(over,out)=>{await gremap(over,out);if(!plant)return;const nw=out('Gate Build')[0].filter(x=>!x.json.gate_skip);const have=over['Gate Call openrouter']?over['Gate Call openrouter'][0]:cl(rd['Gate Call openrouter'][0].data.main[0]);let hi=0;const res=[];
   for(const g of nw){if(g.json.seat==='chatgpt')res.push({json:{choices:[{message:{content:(g.json.items||[]).map((i,k)=>'GATE: G'+(k+1)+' || CHANGE TO: '+TD2+' || PLANTED by W3: a collision line for the same pair.').join('\n')},finish_reason:'stop'}]}});else res.push(have[hi++]);}
   over['Gate Call openrouter']=[res];}});
(async()=>{for(const plant of [0,1]){const r=await run(tag,{after:mk(plant)});const g=(r.over['Gate Record']||r.stored('Gate Record'))[0][0].json;const w=r.rows.find(x=>x.judge_seat==='chatgpt');const t=U(w.verdict_raw);
  console.log('== '+tag.split('/').pop()+' | '+(plant?'PLANT (refused at the send-back, cured at the gate)':'CONTROL (terra\'s stored answer at the send-back)'));
  console.log('   gate seats: '+JSON.stringify(g.gate.seats)+' | und_counted: '+JSON.stringify(g.sendback.und_counted));
  console.log('   gate rows terra: '+JSON.stringify((g.gate_rows||[]).filter(x=>/chatgpt/.test(JSON.stringify(x))).map(x=>x.item+' | '+x.cure_status)));
  console.log('   written rows: '+r.rows.map(x=>x.judge_seat+' u'+x.drv_uncured).join(', '));
  console.log('   terra final D2 vs C1 line: '+((t.match(/(?:^|\n)D2 vs C1[^\n]{0,150}/)||['none'])[0].trim()));
  t.split('\n').filter(l=>/counted in drv_uncured|COLLISION GRADE UNCURED/.test(l)).forEach(l=>console.log('   '+l.slice(0,260)));}
 // the real case: luna's counted items in 34626
 if(process.argv[3]){const r=await run(tag);const w=r.rows.find(x=>x.judge_seat==='luna');console.log('== luna, stored replies, '+tag.split('/').pop()+': drv_uncured '+w.drv_uncured);U(w.verdict_raw).split('\n').filter(l=>/counted in drv_uncured|E-GATE -- SEAT: luna/.test(l)).forEach(l=>console.log('   '+l.slice(0,330)));}
})().catch(e=>console.log('ERROR '+e.stack.slice(0,600)));
