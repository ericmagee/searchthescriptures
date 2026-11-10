// W3 rev 3, V5 and V6: sol's two D6 collision lines are judge-written DEFENDER LINK BROKEN before Panel Cure Check (cureRecompute leaves them unmarked, w3_r3_premise),
// they are sent back, and sol's STORED replies to those two items (CHANGE TO: ... STANDS) are given as the answers. Candidate against the candidate without K2, K3, K5.
const {run,rd,U,cl,remap,gremap}=require('./w3_KSR_ECB.cjs');const tag=process.argv[2]||'LIVE';
const ORDER=Object.keys(rd).map(n=>({n,t:rd[n][0].startTime})).sort((a,b)=>a.t-b.t).map(o=>o.n);const up=ORDER.slice(0,ORDER.indexOf('Panel Cure Check'));
const P=[['D6 vs C5 (John 3:6; 1 John 5:1; Romans 1:3): UNDERDETERMINED','D6 vs C5 (John 3:6; 1 John 5:1; Romans 1:3): DEFENDER LINK BROKEN'],['D6 vs C6 (Luke 2:4; Numbers 1:18): UNDERDETERMINED','D6 vs C6 (Luke 2:4; Numbers 1:18): DEFENDER LINK BROKEN']];
const before={'Panel Cure Check':async(over,out)=>{for(const n of up){const cur=out(n);if(!cur)continue;let s=JSON.stringify(cur),c=0;for(const [a,b] of P){if(s.includes(a)){c++;s=s.split(a).join(b);}}if(c)over[n]=JSON.parse(s);}}};
let note='';const after={'Gate Call openrouter':gremap,'Send Back Call openrouter':async(over,out)=>{await remap('Send Back Call openrouter','Send Back Build')(over,out);
  const st=rd['Send Back Build'][0].data.main[0],nw=out('Send Back Build')[0];const si=st.findIndex(s=>s.json.seat==='sol'),ni=nw.findIndex(s=>s.json.seat==='sol');
  const stored=JSON.parse(rd['Send Back Call openrouter'][0].data.main[0][si].json.choices[0].message.content).reasoning.split(/(?=SENDBACK: S\d+ \|\|)/);
  const calls=over['Send Back Call openrouter'][0];const o=JSON.parse(calls[ni].json.choices[0].message.content);let add=[];
  for(const [pair,sid0] of [['D6 vs C5','S2'],['D6 vs C6','S3']]){const it=(nw[ni].json.items||[]).find(i=>i.item==='COLLISION '+pair&&!/^FORCED/.test(i.line));const seg=stored.find(p=>p.startsWith('SENDBACK: '+sid0+' ||'));if(it&&seg){add.push(it.sid);o.reasoning=o.reasoning.replace(/\s*$/,'\n')+seg.replace('SENDBACK: '+sid0+' ||','SENDBACK: '+it.sid+' ||');}}
  calls[ni].json.choices[0].message.content=JSON.stringify(o);note='sol answers added for '+(add.join(', ')||'NONE (items not sent)');}};
(async()=>{const r=await run(tag,{before,after});console.log('== '+tag.split('/').pop()+' | '+note);
 const sb=r.over['Send Back Build'][0];console.log('   send-back items: '+sb.map(x=>x.json.seat+' '+(x.json.items||[]).length).join(', ')+' | sol: '+(sb.find(x=>x.json.seat==='sol').json.items||[]).map(i=>i.sid+' '+i.rule+' '+i.item.slice(0,22)).join('; '));
 console.log('   rows: '+r.rows.map(x=>x.judge_seat+' '+x.verdict_tag+' u'+x.drv_uncured+' '+((U(x.verdict_raw).match(/(?:^|\n)KEYSTONE: D6 -- \w+/)||['none'])[0].trim())).join(' | '));
 const w=r.rows.find(x=>x.judge_seat==='sol');const t=U(w.verdict_raw);(t.match(/(?:^|\n)D6 vs C[56] \([^\n]{0,150}/g)||[]).forEach(x=>console.log('   sol row line: '+x.trim().slice(0,150)));
 console.log('   sol RESULT/CLAUSE: '+(t.match(/\n(?:RESULT|CLAUSE|CONCEDED LINKS)[^\n]{0,60}/g)||[]).map(s=>s.trim()).join(' | '));
 const g=((r.over['Gate Record']||r.stored('Gate Record'))[0][0].json.gate.report||[]).flatMap(x=>x.items.filter(i=>/KEY|D6/.test(i.src+i.why)).map(i=>x.seat+' '+i.kind+' '+i.src+': '+String(i.why).slice(0,150)));console.log('   gate items naming KEYSTONE or D6: '+(g.join('\n      ')||'none'));
 const aud=t.split('\n').filter(l=>/KEYSTONE/.test(l)&&/SEND-BACK ITEM|E-GATE|E-KEY/.test(l)).map(l=>l.slice(0,200));if(aud.length)console.log('   sol audit lines on KEYSTONE:\n      '+aud.join('\n      '));
})().catch(e=>console.log('ERROR '+e.stack));
