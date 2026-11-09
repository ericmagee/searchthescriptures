// pkgVP1 probe (W3). node pkgVP1/probe_VP1.cjs [strip folder]   Replays the gate on the stored outputs of run 34108 and hand-written gate replies.
const fs=require('fs'),path=require('path');const W=path.resolve(__dirname,'..');const H=require('./harness.cjs');const S=process.argv[2]||'pkgLIB/strip_VP1_s84';const RUN='34108';
let ok=0,bad=0;const T=(c,m)=>{if(c)ok++;else bad++;console.log((c?'OK   ':'FAIL ')+m);};
const src=n=>fs.readFileSync(path.join(W,S,'patched',n),'utf8');
(async()=>{
 // 1. the whole Gate Build node, as the engine runs it
 const out=await H.run(src('Gate_Build.js'),RUN,'Send Back Record');
 const seats=out.filter(o=>!o.json.gate_skip).map(o=>o.json.seat);const rep=out[0].json.gate_report||[];
 T(seats.length===1&&seats[0]==='luna','1a Gate Build on 34108 sends one gate call, to luna (got '+JSON.stringify(seats)+')');
 const lu=out.find(o=>o.json.seat==='luna');const it=lu?lu.json.items:[];
 T(it.length===1&&it[0].src==='E-GATE M'&&it[0].kind==='CONTRADICTION'&&it[0].live===true&&it[0].key==='ANSWER OPEN|LUKE 1:34|CR3|D1','1b luna: one item, E-GATE M, LIVE, key '+(it[0]&&it[0].key));
 T(it[0]&&it[0].lines.length===2&&/^ANSWER CHECK: Luke 1:34/.test(it[0].lines[0])&&/^D1 vs C1 /.test(it[0].lines[1]),'1c its lines are the Luke 1:34 answer check and D1 vs C1');
 if(it[0])console.log('     WHY: '+it[0].why+'\n     MSG has the item: '+/ITEM G1 \(CONTRADICTION; E-GATE M\)/.test(lu.json.msg));
 for(const s of ['chatgpt','sol']){const r=rep.find(x=>x.seat===s);T(r&&r.items.length===0&&!r.error,'1d '+s+': no gate item (kept or wrote MEETS)');}
 // 2. cure readings, by the node's own gateCure2024, on hand-written replies
 await H.run(src('Gate_Record.js'),RUN,'Send Back Record',{},ev=>{const g=n=>ev(n);const PASS=H.out(RUN,'Send Back Record')[0][0].json;const PB=H.out(RUN,'Panel Build')[0][0].json;
  const mk=seat=>{const p=JSON.parse((PASS.bodies).find(b=>JSON.parse(b).payload.judge_seat===seat)).payload;const its=PASS.sb_items.filter(x=>x.seat===seat);const j=PB.judges.find(q=>q.seat===seat);const PT=g('gatePromptText2024')(j.body);
   const ctx={R:g('ciRounds')(PT),DL:g('drvLinks')(PT),ask:PT.includes('CITATION CHECK')};const F={verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links};return {p,its,ctx,F};};
  const L=mk('luna');const G=g('gateItems2024')('luna',L.p.verdict_raw,L.F,L.its,L.ctx);const cure=reply=>g('gateCure2024')('luna',L.p.verdict_raw,L.F,L.its,G.items,reply,L.ctx);
  const d1=G.items[0].lines[1];const ac=G.items[0].lines[0];
  let C=cure('GATE: G1 || KEEP || "I answer it fully under LINK 4."');T(C.res[0].cured===false&&C.uncured===1,'2a KEEP: UNCURED, counted ('+C.res[0].why+')');
  C=cure('');T(C.res[0].cured===false&&C.uncured===1,'2b silence: UNCURED, counted ('+C.res[0].why+')');
  C=cure('GATE: G1 || CHANGE TO: '+d1.replace(/UNDERDETERMINED -- /,'UNDERDETERMINED -- on reflection, ')+' || "before they came together"');T(C.res[0].cured===false,'2c the collision line rewritten but still UNDERDETERMINED: UNCURED ('+C.res[0].why+')');
  C=cure('GATE: G1 || CHANGE TO: '+ac.replace(/-- MISSES -- [\s\S]*$/,'-- MEETS -- “I answer it fully under LINK 4.”')+' || "I answer it fully under LINK 4."');console.log('     2d answer check changed back to MEETS: '+(C.res[0].cured?'CURED':'UNCURED')+' ('+C.res[0].why+') uncured counted '+C.uncured+' fresh '+JSON.stringify(C.fresh.map(f=>f.kind+' '+f.src)));
  T(C.res[0].cured===true,'2d the answer check changed back to MEETS clears the contradiction (the judge keeps the decision, ruling 428; part 3 gives the enforcer its say)');
  const brk='D1 vs C1 (Luke 1:34): DEFENDER LINK BROKEN (Commitment 3) -- the defender\u2019s answer to Luke 1:34 grants the present tense and defers; it shows no fit for the meaning pressed -- GROUND: [L1] Luke 1:34 \u201cHow shall this be, seeing I know not a man?\u201d; [L2] gin\u014dsk\u014d (G1097, to know), present indicative';
  const FO='FORCED: D1 vs C1 -- MEANS [DR2]: "the present tense states her state when the angel spoke, before the future conception." -- ANSWER [CR3]: "I grant the present tense states her state when the angel spoke." -- FAILS: "I answer it fully under LINK 4."';
  const show=(t,C)=>console.log('     '+t+': '+(C.res[0].cured?'CURED':'UNCURED')+' ('+String(C.res[0].why).slice(0,420)+') uncured counted '+C.uncured+'; fresh '+JSON.stringify(C.fresh.map(f=>f.kind+' '+f.src+(f.by?' by '+f.by:''))));
  C=cure('GATE: G1 || CHANGE TO: '+brk+' || '+FO);show('2e D1 vs C1 changed to DEFENDER LINK BROKEN with a true FORCED line',C);
  T(C.res[0].cured===true&&C.uncured===0,'2e the BROKEN way out: collision line changed to DEFENDER LINK BROKEN with a FORCED line whose three quotations stand in the rounds: CURED, nothing counted');
  {const R2=g('gateItems2024')('luna',L.p.verdict_raw,L.F,L.its.concat(C.add),L.ctx);const t=R2.T1.split('\n');const i=t.findIndex(l=>/^D1 vs C1 .*DEFENDER LINK BROKEN/.test(l));
   T(i>=0&&/^FORCED: D1 vs C1 -- MEANS \[DR2\]/.test(t[i+1]||''),'2f the corrected text holds the BROKEN line with the FORCED line under it');
   T(R2.R1.fields.verdict_tag==='BROKEN'&&R2.R1.result==='CHALLENGER WINS'&&R2.R1.fields.defense_standing==='PROP-DEPENDENT','2g the engine derives the verdict from the corrected lines: '+R2.R1.fields.verdict_tag+', RESULT '+R2.R1.result+' (was '+L.F.verdict_tag+')');
   console.log('     derived fields: '+JSON.stringify(R2.R1.fields)+' trig '+JSON.stringify(R2.R1.trig).slice(0,300));}
  C=cure('GATE: G1 || CHANGE TO: '+brk+' || "I answer it fully under LINK 4."');show('2h BROKEN with no FORCED line',C);T(C.res[0].cured===false&&C.uncured===1,'2h BROKEN with no FORCED line: UNCURED, counted once (the K rules read the new BROKEN line)');
  C=cure('GATE: G1 || CHANGE TO: '+brk+' || '+FO.replace('I answer it fully under LINK 4.','The answer is nowhere given in the record.'));show('2i BROKEN with a FORCED line whose FAILS quotation is not in [CR3]',C);T(C.res[0].cured===false&&!C.add.some(z=>z.forced_add),'2i a FORCED line that fails the K-F test is not added: UNCURED');
  C=cure('GATE: G1 || CHANGE TO: '+brk+' || '+FO.replace('D1 vs C1','D2 vs C1'));T(C.res[0].cured===false&&!C.add.some(z=>z.forced_add),'2j a FORCED line for another pair is not added: UNCURED');
  C=cure('GATE: G1 || CHANGE TO: '+brk.replace('DEFENDER LINK BROKEN','CHALLENGER LINK BROKEN')+' || '+FO);show('2k collision line changed to CHALLENGER LINK BROKEN',C);T(!C.add.some(z=>z.forced_add),'2k the FORCED line is not added to a line graded for the other side');
  C=cure('GATE: G1 || CHANGE TO: '+ac.replace(/-- MISSES -- [\s\S]*$/,'-- MEETS -- \u201cI answer it fully under LINK 4.\u201d')+' || '+FO);T(C.res[0].cured===true&&!C.add.some(z=>z.forced_add),'2l MEETS change with a FORCED line in the reason: the FORCED line is not added');
  // 3. near-miss texts on gateAnsOpen2024 itself
  const AO=g('gateAnsOpen2024');const R=L.ctx.R;const T1=G.T1;
  T(AO(T1,R).length===1,'3a luna corrected text: 1 raised');T(AO(T1,null).length===0,'3b no rounds read: nothing raised');
  T(AO(T1.replace(d1,brk),R).length===0,'3c D1 vs C1 graded DEFENDER LINK BROKEN: not raised');
  T(AO(T1.replace(d1,d1.replace('UNDERDETERMINED','CHALLENGER LINK BROKEN')),R).length===0,'3d D1 vs C1 graded CHALLENGER LINK BROKEN: not raised (no open line)');
  T(AO(T1.replace(ac,ac.replace('-- MISSES --','-- MEETS --')),R).length===0,'3e the answer check graded MEETS: not raised');
  T(AO(T1.replace(ac,ac.replace('-- MISSES --','-- FAILS --')),R).length===1,'3f the answer check graded FAILS: raised');
  T(AO(T1.replace(ac,ac.replace('Luke 1:34 -- [CR3]','Luke 1:38 -- [CR3]')),R).length===0,'3g a verse no premise list carries (Luke 1:38): not raised');
  const R2={...R,DR2:R.DR2.replace(/\n1\. LINK 1: /,'\n1. ')};T(AO(T1,R2).length===0,'3h the [DR2] entry without its LINK label ties to no link: not raised');
  const R3={...R,DR2:R.DR2.replace(/\n1\. LINK 1: /,'\n1. LINK 3: ')};const a3=AO(T1,R3);T(a3.length===1&&/\|D3$/.test(a3[0].key)&&/^D3 vs /.test(a3[0].lines[1]),'3i the entry labelled LINK 3 ties the verse to D3 ('+(a3[0]&&a3[0].key)+')');
  // challenger mirror: Luke 1:35 is carried by the [CR3] list (entries 1, 2, 3, 5); a [DR3] answer check on it graded MISSES
  const acC=T1.split('\n').find(l=>/^ANSWER CHECK: Luke 1:35 -- \[DR3\]/.test(l));T(!!acC,'3j luna has a [DR3] answer check on Luke 1:35');
  if(acC){const m=AO(T1.replace(acC,acC.replace(/-- (MEETS|MISSES|FAILS) --/,'-- MISSES --')),R).filter(x=>/\|DR3\|C/.test(x.key));console.log('     mirror keys: '+m.map(x=>x.key+' ['+x.lines.slice(1).map(l=>l.slice(0,9)).join('; ')+']').join(' | '));
   T(m.length>=1&&m.every(x=>/challenger's premise/.test(x.why)&&x.lines.slice(1).every(l=>new RegExp('vs C'+x.key.split('|C')[1]+' ').test(l))),'3k challenger mirror: raised against the C links whose entries carry Luke 1:35, each with its own open lines');}
  const dup=T1+'\n'+ac;T(AO(dup,R).length===1,'3l the same answer check written twice: raised once');
  T(AO(T1.replace(ac,ac.replace(/MEANS: “[^”]*”/,'MEANS: NONE')),R).length===0,'3m MEANS: NONE (no meaning pressed): not raised');
  return [];});
 console.log('\nprobe_VP1: '+ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
})().catch(e=>{console.error('ERR',e);process.exit(2);});
