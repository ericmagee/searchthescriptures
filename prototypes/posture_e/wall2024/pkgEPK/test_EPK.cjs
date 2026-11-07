// pkgEPK tests: the real Send Back Build node (live s25 = BASE, pkgEPK/out = EPK) on saved inputs (pkgGSL harness). Run from wall2024/.
const fs=require('fs');const {harness,live,D}=require('../pkgGSL/harness.cjs');const FB='/mnt/project-files/wall2024/fetchback_live_s25.json';
const P=n=>fs.readFileSync(__dirname+'/out/'+n.replace(/[^A-Za-z0-9]+/g,'_')+'.js','utf8');let ok=0,bad=0;const out=[];
const T=(n,c)=>{const l=(c?'OK  ':'FAIL')+' '+n;console.log(l);out.push(l);c?ok++:bad++;};
const JER=r=>{const d=JSON.parse(fs.readFileSync(D+r+'_Judge_Enforcer_Record.json','utf8'));const x=Array.isArray(d)?d[0]:d;return ((x.data&&x.data.main)||x.main)[0].map(i=>i.json);};
const run=(r,code,over)=>harness(r,over)(code,'Judge Enforcer Record');
const seat=(o,s)=>o.map(x=>x.json).find(j=>j.seat===s&&!j.sb_skip);const item=(o,s,sid)=>{const j=seat(o,s);return j&&j.items.find(i=>i.sid===sid);};
const msgOf=(o,s)=>{const j=seat(o,s);return j?j.msg:'';};
const NOTE='A count of UNEXHIBITED must name the layer the block lacks (K-UNX). A failure of fit is graded at the collision (a FORCED line, ruling 411), not counted.';
const B61=run('33261',live(FB,'Send Back Build')),E61=run('33261',P('Send Back Build'));
// 33261 gemini
{const s27=item(E61,'gemini','S27'),s31=item(E61,'gemini','S31'),m=msgOf(E61,'gemini');
 T('A1 33261 gemini S27 (E-PREM COUNTED, premise 1, block L1 L2 L3) is sent with its reason and the K-UNX note',s27&&s27.epk&&s27.epk.premise===1&&/ITEM S27[\s\S]*?THE ENFORCER: \(right: COUNTED\)[\s\S]*?THE COUNT RULE \(K-UNX, TRIAL, pkgEPK\): /.test(m)&&m.includes(NOTE));
 T('A2 33261 gemini S31 is sent with the note; chatgpt\'s words "does not meet the pressed causal meaning" are cut from the sent reason and kept in reason_full',s31&&s31.epk&&!/pressed causal meaning/.test(s31.reason)&&/pressed causal meaning/.test(s31.reason_full)&&s31.xcut.some(x=>/does not meet the pressed causal meaning/.test(x))&&!/ITEM S31[^]*?pressed causal meaning[^]*?ITEM S32/.test(m));
 const b31=item(B61,'gemini','S31');T('A3 BASE sent S31 with chatgpt\'s words and no note (the gap)',b31&&/pressed causal meaning/.test(b31.reason)&&!msgOf(B61,'gemini').includes(NOTE));
 T('A4 the item set is the same (no push is stopped, ruling 428): same sids and rules for every seat',['gemini','sol','chatgpt'].every(s=>{const a=seat(B61,s),b=seat(E61,s);return JSON.stringify((a&&a.items||[]).map(i=>i.sid+i.rule+i.item))===JSON.stringify((b&&b.items||[]).map(i=>i.sid+i.rule+i.item));}));}
// 33249 sol S28
{const B=run('33249',live(FB,'Send Back Build')),E=run('33249',P('Send Back Build'));const s=item(E,'sol','S28');
 T('B1 33249 sol S28 (premise 5) is sent with the K-UNX note'+(s&&s.xcut?'; cut: '+JSON.stringify(s.xcut):'; no other judge\'s words in it'),s&&s.epk&&s.epk.premise===5&&msgOf(E,'sol').includes(NOTE));
 T('B2 33249 item sets unchanged',['gemini','sol','chatgpt','grok'].every(q=>{const a=seat(B,q),b=seat(E,q);return JSON.stringify((a&&a.items||[]).map(i=>i.sid+i.rule))===JSON.stringify((b&&b.items||[]).map(i=>i.sid+i.rule));}));}
// negative control 1: a push whose reason names a missing layer gets no note
{const rows=JER('33261');const r=JSON.parse(JSON.stringify(rows)).map(j=>({json:j}));const row=r[0].json.enf428_rows.find(x=>x.seat==='gemini'&&x.rule==='E-PREM'&&/challenger 5$/.test(x.item));
 row.cure_reason='ENFORCER DISAGREE (right: COUNTED): The block does not exhibit [L4] for Luke 1:35, so premise 5 is COUNTED (UNEXHIBITED). (RECORD-ONLY TRIAL, ruling 428)';
 const E=run('33261',P('Send Back Build'),{'Judge Enforcer Record':r});const s=item(E,'gemini','S31');
 T('C1 NEGATIVE CONTROL 1: an E-PREM COUNTED whose reason names a missing layer ("does not exhibit [L4]"; the block has L1, L2, L3) gets no note',s&&!s.epk&&/does not exhibit \[L4\]/.test(s.reason));}
// negative control 2: a reason quoting only the Oracle's round (the debate record) is sent as written
{const rows=JER('33261');const r=JSON.parse(JSON.stringify(rows)).map(j=>({json:j}));const row=r[0].json.enf428_rows.find(x=>x.seat==='gemini'&&x.rule==='E-PREM'&&/challenger 5$/.test(x.item));
 const PB=JSON.parse(fs.readFileSync(D+'33261_Panel_Build.json','utf8'));const pb=Array.isArray(PB)?PB[0]:PB;const J=((pb.data&&pb.data.main)||pb.main)[0][0].json;
 const g=J.judges.find(q=>q.seat==='gemini');const PT=g.body.messages.map(m=>typeof m.content==='string'?m.content:'').join('\n');
 const q=(PT.match(/=== \[DR3\][^\n]*===\n([\s\S]*?)\n=== \[/)||[])[1]||'';const line=q.split('\n').find(l=>l.split(' ').length>14)||'';const words=line.replace(/[*_#>"]/g,'').split(/\s+/).slice(2,14).join(' ');
 row.cure_reason='ENFORCER DISAGREE (right: COUNTED): The round says "'+words+'", so premise 5 is COUNTED (UNEXHIBITED). (RECORD-ONLY TRIAL, ruling 428)';
 const E=run('33261',P('Send Back Build'),{'Judge Enforcer Record':r});const s=item(E,'gemini','S31');
 T('C2 NEGATIVE CONTROL 2: a reason quoting 12 words of the challenger\'s [DR3] round only ("'+words.slice(0,60)+'...") is sent as written (no cut)',words.split(' ').length>=10&&s&&!s.xcut&&s.reason.includes(words));}
// parity on 33218: only additions (no note, no cut) or identical
{const B=run('33218',live(FB,'Send Back Build')),E=run('33218',P('Send Back Build'));const strip=o=>JSON.stringify(o.map(x=>x.json).map(j=>({...j,items:(j.items||[]).map(i=>({sid:i.sid,rule:i.rule,item:i.item,line:i.line}))})));
 const notes=E.map(x=>x.json).flatMap(j=>(j.items||[]).filter(i=>i.epk||i.xcut).map(i=>j.seat+' '+i.sid+(i.epk?' note':'')+(i.xcut?' cut':'')));
 const sb=o=>JSON.stringify(o.map(x=>x.json).map(j=>(j.items||[]).map(i=>i.sid+'|'+i.rule+'|'+i.item+'|'+i.line)));
 T('D1 33218 parity: the same items and lines for every seat (nothing stopped); notes/cuts on 33218: '+(notes.join(', ')||'none'),sb(B)===sb(E));
 const cuts=E.map(x=>x.json).flatMap(j=>(j.items||[]).filter(i=>i.xcut).map(i=>({seat:j.seat,sid:i.sid,cut:i.xcut,full:i.reason_full})));fs.writeFileSync(__dirname+'/cuts_33218.json',JSON.stringify(cuts,null,1));
 T('D2 33218: every body other than the cut items is byte-equal',(()=>{const b=B.map(x=>x.json),e=E.map(x=>x.json);return b.length===e.length&&b.every((j,k)=>{const f=e[k];if((f.items||[]).some(i=>i.xcut||i.epk))return true;return JSON.stringify(j.body)===JSON.stringify(f.body);});})());}
// Alt Send Back Build: runs on the saved alternate inputs; the same items are sent
for(const r of ['33222','33249','33261']){const f=D+r+'_Alt_Judge_Enforcer_Record.json';if(!fs.existsSync(f))continue;let ok2=false,info='';try{const h=harness(r);const B=h(live(FB,'Alt Send Back Build'),'Alt Judge Enforcer Record'),E=harness(r)(P('Alt Send Back Build'),'Alt Judge Enforcer Record');
 const sb=o=>JSON.stringify(o.map(x=>x.json).map(j=>(j.items||[]).map(i=>i.sid+'|'+i.rule+'|'+i.item)));ok2=sb(B)===sb(E);info=E.map(x=>x.json).flatMap(j=>(j.items||[]).filter(i=>i.epk||i.xcut).map(i=>j.seat+' '+i.sid+(i.epk?' note':'')+(i.xcut?' cut':''))).join(', ')||'none';}catch(e){info='ERR '+e.message.slice(0,100);}
 T('F '+r+' Alt Send Back Build: same items sent; notes/cuts: '+info,ok2);}
// the built prompt text for one item (W3 2759 item 4)
{const m=msgOf(E61,'gemini');const i=m.indexOf('ITEM S31');const blk=m.slice(i,m.indexOf('\n\nITEM',i+5)>0?m.indexOf('\n\nITEM',i+5):i+1500);fs.writeFileSync(__dirname+'/prompt_33261_gemini_S31.txt',blk+'\n');T('E1 built prompt text for 33261 gemini S31 written to pkgEPK/prompt_33261_gemini_S31.txt',blk.includes('THE COUNT RULE (K-UNX, TRIAL, pkgEPK)'));}
fs.writeFileSync(__dirname+'/test_EPK.txt',out.join('\n')+'\n'+ok+' OK, '+bad+' FAIL\n');console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
