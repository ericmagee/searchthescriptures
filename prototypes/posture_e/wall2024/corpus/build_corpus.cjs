// Build the phase 1 corpus (W3 line_form_spec.md section 4). Run from wall2024/: node corpus/build_corpus.cjs
// Inputs: corpus/raw/judgments.json (debate_judgments), corpus/raw/log_<run>.json (debate_enforcer_log), the saved gate fixtures,
// corpus/raw/33025_alt.json (n8n Alt Gate Record). Outputs: corpus/texts.jsonl (every judge text, stored as found),
// corpus/fix_<run>.json (replay fixtures with full gate replies from the log), corpus/manifest.json.
const fs=require('fs'),crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s).digest('hex');
// jtext: for a verdict, the judge text exactly as the engine reads it (cureJText(raw,true) from the live library, pkgKY = live 83ef4d98):
// the JSON reasoning, unescaped once by JSON.parse, without the engine's AUDIT trailer (also for alternate_reply, a whole verdict). cure_reply: cureUnwrap,
// as cureLines reads it. sendback/gate replies: as stored (their live readers unescape \\n and \\" once; parity.cjs does that). Readers must not unescape again.
const AMS=fs.readFileSync('pkgKY/patched/Alternate_Merge.js','utf8');const {cureJText,cureUnwrap}=new Function('$','$input',AMS.slice(0,AMS.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {cureJText,cureUnwrap};')(()=>{throw 0},null);
const RUNS=['32998','33006','33014','33020','33021','33025','33040'];
const FIX={'32998':'pkgGD/fixture_32998.json','33014':'pkgKF/fixture_33014.json','33020':'pkgGD/probe_33020/fixture_33020.json','33021':'probe_33021/fixture_33021.json','33025':'probe_33025/fixture_33025.json'};
const J=JSON.parse(fs.readFileSync('corpus/raw/judgments.json','utf8'));
const texts=[],seen=new Map();let tid=0;
const add=(run,seat,src,ref,text)=>{if(!text||typeof text!=='string')return;const k=run+'|'+seat+'|'+src+'|'+md5(text);if(seen.has(k)){seen.get(k).refs.push(ref);return;}const r={tid:'T'+(++tid),run,seat,src,ref,refs:[ref],text,jtext:/verdict|alternate_reply/.test(src)?cureJText(text,true):src==='cure_reply'?cureUnwrap(text):text};seen.set(k,r);texts.push(r);};
const man={runs:{},gaps:[]};
for(const run of RUNS){
 const L=JSON.parse(fs.readFileSync('corpus/raw/log_'+run+'.json','utf8'));
 let F=FIX[run]?JSON.parse(fs.readFileSync(FIX[run],'utf8')):null;
 // from 33040 on: the fixture is built from corpus/raw/gate_<run>.json (import_inputs.cjs), the make_fixture.cjs way
 if(!F&&fs.existsSync('corpus/raw/gate_'+run+'.json')){const G0=JSON.parse(fs.readFileSync('corpus/raw/gate_'+run+'.json','utf8'));const last=n=>{const r=G0[n];return r&&r.length?r[r.length-1][0]:null;};
  const bo=B=>(B||[]).map(s=>{const p=(JSON.parse(s).payload)||{};return {seat:p.judge_seat,verdict_raw:p.verdict_raw,fields:{verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links}};});
  const G=last('Gate Record'),PB=last('Panel Build'),A=last('Alt Gate Record');
  F={source:'n8n execution '+run+' (inputs saved by the live-test thread)',run_token:G.run_token,PB:{judges:PB.judges},bodies:bo(G.bodies),sb_items:G.sb_items||[],gate_report:(G.gate&&G.gate.report)||[],gate_replies:{},gate_live:G.gate_rows||[]};
  if(A)F.alt={PB:{judges:A.judges},bodies:bo(A.bodies),sb_items:A.sb_items||[],gate_report:(A.gate&&A.gate.report)||[],gate_replies:{},gate_live:A.gate_rows||[]};}
 // verdicts: stored judgments, then fixture bodies (removed judges are only in the fixture)
 for(const j of J.filter(j=>j.run===run))add(run,j.seat,'verdict_final','debate_judgments',j.verdict_raw);
 if(F){for(const b of F.bodies||[])add(run,b.seat,'verdict_gate','n8n Gate Record',b.verdict_raw);if(F.alt)for(const b of F.alt.bodies||[])add(run,b.seat,'alt_verdict_gate','n8n Alt Gate Record',b.verdict_raw);}
 if(run==='33025'){const X=JSON.parse(fs.readFileSync('corpus/raw/33025_alt.json','utf8'));const A=X.data.resultData.runData['Alt Gate Record'][0].data.main[0][0].json;
  F.alt={PB:{judges:A.judges},bodies:A.bodies.map(s=>{const p=(JSON.parse(s).payload)||{};return {seat:p.judge_seat,verdict_raw:p.verdict_raw,fields:{verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links}};}),sb_items:A.sb_items||[],gate_report:(A.gate&&A.gate.report)||[],gate_replies:{},gate_live:A.gate_rows||[]};
  for(const b of F.alt.bodies)add(run,b.seat,'alt_verdict_gate','n8n Alt Gate Record',b.verdict_raw);}
 for(const x of L){
  if(x.rule==='E-GATE'){if(x.full_reply)add(run,x.seat,'gate_reply','log '+x.id,x.full_reply);}
  else if(x.kind==='send_back'){if(x.full_reply)add(run,x.seat,'sendback_reply','log '+x.id,x.full_reply);}
  else if(x.kind==='cure'){if(x.full_reply)add(run,x.seat,'cure_reply','log '+x.id,x.full_reply);}
  else if(x.kind==='alternate_reply'){if(x.full_reply)add(run,x.seat,'alternate_reply','log '+x.id,x.full_reply);}
  if(x.flagged_line)add(run,x.seat,'flagged_line','log '+x.id,x.flagged_line);
  // change_to: each CHANGE TO payload of a send-back or gate reply, as sbApply2024 receives it (the reply unescaped once as the live reply
  // readers do, the line after "CHANGE TO:" up to "||", whole-line wrapping quotes removed as in pkgFQ). SB_FORM, PR/FR and GR run on these live.
  if(x.full_reply&&(x.rule==='E-GATE'||x.kind==='send_back')){const R=String(x.full_reply).replace(/\\n/g,'\n').replace(/\\"/g,'"');
   for(const l of R.split('\n')){const m=l.match(/CHANGE TO:\s*(.*?)\s*(?:\|\||$)/);if(m&&m[1])add(run,x.seat,'change_to','log '+x.id,m[1].replace(/^["\u201c]+([\s\S]*?)["\u201d]+$/,(a,c)=>c));}}}
 // replay fixture: gate replies from the log (full text), main and alt seats
 if(F){const G={};for(const x of L)if(x.rule==='E-GATE'&&x.full_reply)G[x.seat]=x.full_reply;
  const main=new Set((F.bodies||[]).map(b=>b.seat));F.gate_replies={};for(const s in G)if(main.has(s))F.gate_replies[s]=G[s];
  if(F.alt){F.alt.gate_replies={};for(const s in G)if(!main.has(s))F.alt.gate_replies[s]=G[s];}
  F.corpus_note='gate_replies taken from debate_enforcer_log E-GATE full_reply';fs.writeFileSync('corpus/fix_'+run+'.json',JSON.stringify(F));}
 else man.gaps.push(run+': no n8n node data (run crashed); no replay fixture. Texts come from debate_judgments and the log only.');
 const T=texts.filter(t=>t.run===run);man.runs[run]={texts:T.length,by_src:T.reduce((m,t)=>(m[t.src]=(m[t.src]||0)+1,m),{}),seats:[...new Set(T.filter(t=>/verdict/.test(t.src)).map(t=>t.seat+':'+t.src))],fixture:!!F,gate_replies:F?Object.keys(F.gate_replies).concat(F.alt?Object.keys(F.alt.gate_replies).map(s=>s+'(alt)'):[]):[]};}
// verdicts missing from both sources
for(const run of RUNS){const L=JSON.parse(fs.readFileSync('corpus/raw/log_'+run+'.json','utf8'));const seats=[...new Set(L.filter(x=>['chatgpt','gemini','grok','sol'].includes(x.seat)).map(x=>x.seat))];
 for(const s of seats)if(!texts.some(t=>t.run===run&&t.seat===s&&/verdict/.test(t.src)))man.gaps.push(run+' '+s+': no stored verdict text (judge removed and no node data); its lines appear only as flagged lines and replies.');}
fs.writeFileSync('corpus/texts.jsonl',texts.map(t=>JSON.stringify(t)).join('\n')+'\n');fs.writeFileSync('corpus/manifest.json',JSON.stringify(man,null,1));
console.log(texts.length,'texts');console.log(JSON.stringify(man,null,1));
