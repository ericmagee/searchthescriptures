// W3 sweep, path P2: a cure item left UNCURED at Panel Cure Check on a line that a later send-back or gate change replaces.
// Plant: one LIVE cure item (K-G4) added to luna's item list as Panel Cure Check reads it; luna's stored cure reply has no answer for it.
const chain=require('../pkgKSR/w3_grade/chain.cjs');const rd=chain.rd;const cl=x=>JSON.parse(JSON.stringify(x));
const LIVE='/mnt/project-files/wall2024/fetchback_live_s110.json';
const cnt=o=>(o.bodies||[]).map(j=>{const p=JSON.parse(j).payload;return p.judge_seat+':'+(p.drv_uncured||0)}).join(' ');
(async()=>{
 const base=await chain(LIVE,{});
 const stages=r=>['Panel Cure Check','Send Back Record','Gate Record'].map(n=>n+' ['+cnt(r.over[n][0][0].json)+']').join(' | ');
 console.log('CONTROL (no plant):',stages(base));
 const rowU=r=>r.rows.map(x=>(x.judge_seat||x.seat)+':'+x.drv_uncured).join(' ');
 console.log('  written rows:',rowU(base));
 for(const pair of ['D2 vs C1','D6 vs C6','D1 vs C1']){
  const pp=cl(rd['Panel Payloads'][0].data.main);const J=pp[0][0].json;const i=J.summary.findIndex(s=>s.seat==='luna');
  const raw=JSON.parse(J.bodies[i]).payload.verdict_raw;const line=(raw.split('\n').find(l=>l.replace(/^[\s*-]+/,'').startsWith(pair))||'').trim();
  J.summary[i].drv.push({rule:'K-G4',side:'DEFENDER',link:pair,line});
  const r=await chain(LIVE,{over:{'Panel Payloads':pp}});
  const lu=r.rows.find(x=>(x.judge_seat||x.seat)==='luna');const vr=lu.verdict_raw;
  const rep=(vr.match(new RegExp('\\[AUDIT v21: DEBATE RULE VIOLATION REPORT[^\\]]*ITEM: '+pair+'; RULE: K-G4[^\\]]{0,160}'))||['(no report line)'])[0];
  const fin=(vr.split('\n').filter(l=>l.replace(/^[\s*-]+/,'').startsWith(pair+' ')).pop()||'').slice(0,150);
  const sbi=(r.over['Send Back Record'][0][0].json.sb_items||[]).filter(x=>x.seat==='luna'&&String(x.item||'').includes(pair)).map(x=>x.sid+' '+x.ans+' '+(x.status||x.cure||'')).join(', ');
  const gate=(vr.match(/\[AUDIT v38: E-GATE -- SEAT: luna; [^\]]{0,120}/g)||[]).filter(g=>1).map(g=>g.slice(31,110)).join(' || ');
  console.log('\nPLANT K-G4 on',pair,'| planted line found:',!!line,'\n ',stages(r),'\n  written rows:',rowU(r),'\n  cure report:',rep.slice(0,230),'\n  send-back items on the pair:',sbi||'none','\n  last line of the pair in the written row:',fin,'\n  gate lines:',gate.slice(0,400));
  if(pair==='D2 vs C1')console.log('  sb_item keys:',Object.keys((r.over['Send Back Record'][0][0].json.sb_items||[{}])[0]).join(','));
 }
})().catch(e=>{console.error(e);process.exit(1)});
