// ASK 607 C1 (W4): replay of the stored form-refused gate changes through the real gateCure2024 of Gate Record, base (live 94b682a0) against target.
// Luna, debate 36499348, judgment 1122, enforcer log 29285 to 29295 (G3 to G13), and chatgpt, debate b610093d, judgment 988, rows 7218 to 7224 (G1 to G7; W1 N1).
// Inputs from the DB (data607.json, read 16:1x CST 11-24): the stored judge text, the stored gate reply (full_reply of the run's first gate row), and each item's stored flagged line.
// The judge text is the stored final text (after the gate); the refused lines are unchanged in it, so the form refusal is reached as at gate time. its = [] (the send-back items were applied before the gate).
// Every helper gateCure2024 calls (gateItems2024 and sbApply2024 among them) is cut from the Library as built; nothing is stubbed but $.
const fs=require('fs');process.env.ACORN_DIR=process.env.ACORN_DIR||'/opt/node-tools/node_modules'; /* W1 N1 */
const X=require('/mnt/project-files/ask549/w4/build2/gcx.js');const D=JSON.parse(fs.readFileSync(__dirname+'/data607.json','utf8'));
const mk=(file,key)=>{const r=X(file,key,'gateCure2024',[]);const $=()=>({isExecuted:false,first:()=>({json:{}}),all:()=>[],params:{}});return new Function('$',r.code+'\nreturn gateCure2024;')($);};
const CASES=[{seat:'luna',jid:1122,from:29285,to:29295,reply:29283,expect:'pkgFRM'},{seat:'chatgpt',jid:988,from:7218,to:7224,reply:7218,expect:'same'}];
// chatgpt (W1 N1): on today's engine these gate changes are read as line forms (G3, G4, G5, G7 apply; G1 and G2 are placement refusals, "the flagged line is not in the judge text"), so the form refusal stored on 11-06 is not reached and ASK 607 must leave them as they are.
const mkG=(rows)=>rows.map(e=>{const m=e.item.match(/^(G\d+) NOT APPLIED \(E-APPLY (S\d+)\)/);return {gid:m[1],kind:'NOT APPLIED',src:'E-APPLY '+m[2],sid:m[2],key:'NOT APPLIED|'+m[2],why:'x',lines:[e.flagged_line],to:null,live:true};});
const run=(file,c,G,reply)=>{const J=D.judgments.find(j=>j.id===c.jid);const F={verdict_tag:J.verdict_tag,defense_standing:J.defense_standing,challenge_standing:J.challenge_standing,conceded_links:J.conceded_links,challenger_conceded_links:J.challenger_conceded_links};
 return mk(file,'Gate Record')(c.seat,J.verdict_raw,F,[],JSON.parse(JSON.stringify(G)),reply,{R:{}});};
let fail=0;const ok=(b,m)=>{console.log((b?'PASS ':'FAIL ')+m);if(!b)fail++;};
const [BE,TE]=[__dirname+'/base_moMxiV4Irg1uRBZN.json',__dirname+'/target_engine_607.json'];
module.exports={mk,mkG,run,D,CASES,BE,TE};
if(require.main===module){
for(const c of CASES){const rows=D.log.filter(e=>e.id>=c.from&&e.id<=c.to);const G=mkG(rows);const reply=D.log.find(e=>e.id===c.reply).full_reply;
 const b=run(BE,c,G,reply),t=run(TE,c,G,reply);console.log('== '+c.seat+' judgment '+c.jid+' rows '+c.from+' to '+c.to+' ('+rows.length+' items)');
 const cnt=R=>R.res.filter(r=>G.some(g=>g.gid===r.gid)&&!r.cured&&r.live!==false).length;
 for(const g of G){const rb=b.res.find(r=>r.gid===g.gid),rt=t.res.find(r=>r.gid===g.gid);const row=rows.find(e=>e.item.startsWith(g.gid+' '));
  console.log('  '+row.id+' '+g.gid+' | before: '+(rb.cured?'CURED':'UNCURED')+', '+(rb.live===false?'record-only':'counted')+', '+String(rb.why).slice(0,70)+' | after: '+(rt.cured?'CURED':'UNCURED')+', '+(rt.live===false?'record-only':'counted')+', '+String(rt.why).slice(0,150));
  if(c.expect==='same'){ok(JSON.stringify(rb)===JSON.stringify(rt),row.id+' '+g.gid+': today\'s engine does not form-refuse it; old and new give the same row');continue;}
  ok(!rb.cured&&rb.live!==false&&!rt.cured&&rt.live===false&&/^pkgFRM refused the gate change; the judge's line before the change stands \(recorded, no seat removed\): the CHANGE TO line has no line form the engine reads/.test(rt.why),row.id+' '+g.gid+': counted before; UNCURED and record-only after, with the pkgFRM reason');}
 console.log('  counted before '+cnt(b)+', after '+cnt(t)+' | drv_uncured before '+b.uncured+', after '+t.uncured+' (stored drv_uncured '+D.judgments.find(j=>j.id===c.jid).drv_uncured+')');}
console.log(fail?'FAILURES: '+fail:'C1 ALL PASS');}
