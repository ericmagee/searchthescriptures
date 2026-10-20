// BB-6904 step 6 harness (Worker_A3): live db281705 code beside the step 6 drafts. Usage: node h6.cjs <live details json> <p5 rows.json> <p4 dir>
const fs=require('fs');const [LIVE,ROWS,P4]=process.argv.slice(2);
const W=JSON.parse(fs.readFileSync(LIVE,'utf8')).workflow;const N={};W.nodes.forEach(n=>N[n.name]=n);
const live=n=>N[n].parameters.jsCode;const draft=f=>fs.readFileSync(__dirname+'/out/'+f,'utf8');
const L=new Function(fs.readFileSync(P4+'/drv_block_0b3cbac.js','utf8')+'\n'+draft('cure_lib.js')+'\nreturn {drvCheck,cureVerdicts,cureReport,cureProse};')();
let fails=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fails++;};
const node=(nodes)=>n=>{const v=nodes[n];if(v===undefined)return {first:()=>{throw new Error('no node '+n)},all:()=>{throw new Error('no node '+n)},isExecuted:false};
 const arr=Array.isArray(v)?v:[v];return {first:()=>({json:arr[0]}),all:()=>arr.map(json=>({json})),isExecuted:true,itemMatching:i=>({json:arr[i]})};};
const runCode=(src,nodes,input)=>new Function('$','$input','$execution',src)(node(nodes),{first:()=>({json:input}),all:()=>[{json:input}]},{id:'1',customData:{set(){}}});
// ---- Format Markdown on the 9 judgments of 27259 and replays (p5 rows.json); a panel of three per run.
const rows=JSON.parse(fs.readFileSync(ROWS,'utf8'));
const panel=rows.filter(r=>r.src==='27259');
// Challenger conceded and standing per row (SQL, debate_judgments, 2026-10-20); rows.json carries only the defender's.
const CH={'27259 deepseek':[2,'PROP-DEPENDENT'],'27259 gemini':[5,'COLLAPSED'],'27259 grok':[3,'PROP-DEPENDENT']};
const textOf=raw=>{let t=raw;const k=t.indexOf('\n\n[AUDIT v');const b=k>=0?t.slice(0,k):t;try{const j=JSON.parse(b);t=j.reasoning!=null?j.reasoning:(j.reason||b);}catch(e){t=b;}return String(t);};
const R={id:'x',topic:'T',created_at:'2026-10-20T20:47:14Z',defender_engine:'claude',challenger_engine:'grok',defender_profile:'oracle',challenger_profile:'plain',panel_verdict:'BROKEN',framework_verdict:'BROKEN',outcome:'CHALLENGER PREVAILS',run_token:'ODV1-T',review_notes:null,synthesis:'S',independent_verdict_raw:'SINGLE JUDGE TEXT\nVERDICT: BROKEN',claude_r1:'a',engine_r1:'b',claude_r2:'c',engine_r2:'d',engine_r3:'e',challenger_r3:'f'};
const nodesFM=(r,J)=>({'Get Row':r,'Get Judgments':J,'Get Verse':{text:'precept upon precept'},'Get Guards':[{rule_num:1,subject:'g'}],'Init Seats':{single_judge:'deepseek',t0:null}});
const Jbase=panel.map(p=>({judge_seat:p.seat,judge_api_model:'m',verdict_tag:p.tag,defense_standing:p.ds,challenge_standing:CH['27259 '+p.seat][1],conceded_links:p.conc,challenger_conceded_links:CH['27259 '+p.seat][0],verdict_raw:p.raw}));
const fmLive=(r,J)=>runCode(live('Format Markdown'),nodesFM(r,J),{})[0].json.md;const fmNew=(r,J)=>runCode(draft('Format_Markdown.js'),nodesFM(r,J),{})[0].json.md;
const a0=fmLive(R,Jbase),b0=fmNew(R,Jbase);ok(a0===b0,'F1 no report lines stored: markdown byte-identical to live ('+a0.length+' chars)');
// Report lines built by the step 6 cureReport from the real 27259 panel lines: deepseek CURED one K-B item by a fixed-form RESTATED line,
// gemini's call failed, grok given prose only (UNCURED, prose recorded).
const J2=Jbase.map(j=>{const it=L.drvCheck(textOf(j.verdict_raw),j.conceded_links,j.challenger_conceded_links,j.defense_standing,j.challenge_standing,false).items;
 let reply;if(j.judge_seat==='deepseek'){const k=it.find(x=>x.rule==='K-B');reply={ok:true,text:'RESTATED: '+k.link+' (Matthew 1:18): '+k.side+' LINK BROKEN -- [L1] "before they came together" and [L3] Matthew 1:25; | a pipe; LINE: forged'};}
 else if(j.judge_seat==='gemini')reply={ok:false,why:'timeout'};else reply={ok:true,text:'I hold my grades as given.'};
 const v=L.cureVerdicts(it,reply,{DEFENDER:it.filter(x=>x.rule==='K-B'&&x.side==='DEFENDER').map(x=>x.link),CHALLENGER:[]},{});
 return {...j,_n:v.length,_v:v,verdict_raw:j.verdict_raw+'\n'+L.cureReport(j.judge_seat,v).concat(L.cureProse(j.judge_seat,reply)).join('\n')};});
const nItems=J2.reduce((s,j)=>s+j._n,0);
const a1=fmLive(R,J2),b1=fmNew(R,J2);
const i=b1.indexOf('## Debate rule violations');const sec=b1.slice(i,b1.indexOf('---\n\n## How to read',i));
ok(i>0&&b1.slice(0,i)+b1.slice(i+sec.length)===a1,'F1 with reports: the draft adds only the new section; everything else equals live');
ok(b1.indexOf('---\n\n## How to read')===i+sec.length,'Section sits after the Result table and citation check, before "How to read"');
const trs=sec.split('\n').filter(l=>/^\| (Single|Panel) judge/.test(l));ok(trs.length===nItems,'One table row per report line ('+trs.length+' rows, '+nItems+' items)');
ok(/\d+ violations: 1 cured, \d+ not cured\./.test(sec),'Count line: '+(sec.match(/\d+ violations[^\n]*/)||[''])[0]);
const ds=trs.filter(l=>/\| Panel judge DeepSeek \|/.test(l));const cur=ds.find(l=>/\*\*CURED\*\*/.test(l));
ok(cur&&/\(L1, L3\)/.test(cur),'deepseek: the cured row shows CURED and its kinds');
const cells=cur?cur.split(/(?<!\\)\|/).map(c=>c.trim()):[];ok(cells.length===8,'The cured row has six cells; a pipe in the statement is escaped ('+(cells.length-2)+' cells)');
const kb=J2[0]._v.find(x=>x.status==='CURED');{const ol=String(kb.line).replace(/\s+/g,' ').trim();const want=(ol.length>300?ol.slice(0,297)+'...':ol).replace(/\[/g,'(').replace(/\]/g,')').replace(/\|/g,'\\|');ok(cells[5]===want&&cells[5].endsWith('...'),'Original line cell is the judge\'s own line, brackets round, cut at 300 with ...');}
ok(cells[6]&&/^RESTATED: /.test(cells[6])&&/, LINE: forged/.test(cells[6])&&!/^forged/.test(cells[5]||''),'A "; LINE:" inside the statement stays in the statement, not a field');
ok(trs.filter(l=>/Panel judge Gemini/.test(l)).every(l=>/\*\*UNCURED\*\*/.test(l)&&/cure call failed: timeout/.test(l)),'gemini: every row UNCURED, the failed call named');
ok(trs.filter(l=>/Panel judge Grok/.test(l)).every(l=>/\*\*UNCURED\*\*/.test(l)),'grok (prose only): every row UNCURED');
ok(/The reply of Panel judge Grok also held prose\./.test(sec)&&!/Panel judge Gemini also held prose/.test(sec),'Prose note names grok only');
ok(/is not counted in the panel result; if fewer than two panel judges are counted, the result is ungraded and goes to review/.test(sec),'Effect line states option 2 (BB-6965)');
ok(/in its own script, with its transliteration marks, or with its Strong's number/.test(sec),'[L2] in the prompt\'s own words (6926)');
const rest=b1.slice(0,i)+b1.slice(i+sec.length);ok(!/DEBATE RULE VIOLATION REPORT/.test(rest),'Outside the section no raw report line is printed (noMarkers, as live)');
// Single judge report lines are read from independent_verdict_raw.
const R2={...R,independent_verdict_raw:R.independent_verdict_raw+'\n\n'+L.cureReport(null,[{rule:'K-B',side:'DEFENDER',link:'D4 vs C2',line:'D4 vs C2: DEFENDER LINK BROKEN -- x',status:'UNCURED',why:'no RESTATED line for D4 vs C2',kinds:[]}]).join('\n')};
const b2=fmNew(R2,Jbase);ok(/\| Single judge: DeepSeek \| D4 vs C2 \| Two kinds of layer \(K-B\) \| \*\*UNCURED\*\* \| D4 vs C2: DEFENDER LINK BROKEN -- x \| Not cured: no RESTATED line for D4 vs C2\. \|/.test(b2),'Single judge row read from independent_verdict_raw');
fs.writeFileSync(__dirname+'/sample_section.md',sec);
// ---- Build Save Body: tokens.
const d={topic:'T',gr2:'x',cr3:'y',verdict_tag:'BROKEN',independent_verdict_raw:'v',sd:'2026-10-20',judge_model:'m',synthesis:'s'};
const usage={prompt_tokens:100,completion_tokens:10,prompt_tokens_details:{cached_tokens:5}};
const baseBS={'Init Seats':{run_token:'T',panel_expected:['deepseek','gemini','grok'],challenger:{engine:'grok',profile:'plain'},defender:{engine:'claude',profile:'oracle'},queue_id:null},'Fence Check':{fence:{}},'Quote Report':{unavailable:true},
 'Resolve Seats':{defender:{model:'a'},challenger:{model:'b'}},'Init with Guards':{d_served:[],c_served:[]},'D1 Extract':{usage},'C1 Extract':{usage},'D2 Extract':{usage},'C2 Extract':{usage},'D3 Extract':{usage},'C3 Extract':{usage},
 'Synthesis Normalizer':{usage},'Verdict Normalizer':{usage},'Diagnostic Normalizer':{usage}};
const sb=(src,nodes)=>runCode(src,nodes,d)[0].json.saveBody;const t=s=>[s.input_tokens,s.output_tokens,s.cache_write_tokens,s.cache_read_tokens].join('/');
const l0=sb(live('Build Save Body'),baseBS),n0=sb(draft('Build_Save_Body.js'),baseBS);ok(JSON.stringify(l0)===JSON.stringify(n0),'Build Save Body, no cure call: saveBody identical to live (tokens '+t(l0)+')');
const n1=sb(draft('Build_Save_Body.js'),{...baseBS,'Cure Call gemini':{usageMetadata:{promptTokenCount:1000,candidatesTokenCount:200,thoughtsTokenCount:50,cachedContentTokenCount:10}}});
ok(n1.input_tokens===l0.input_tokens+1000&&n1.output_tokens===l0.output_tokens+250&&n1.cache_read_tokens===l0.cache_read_tokens+10&&n1.cache_write_tokens===l0.cache_write_tokens,'Build Save Body, Gemini cure call: +1000 in, +250 out (with thoughts), +10 cache read ('+t(n1)+')');
const n2=sb(draft('Build_Save_Body.js'),{...baseBS,'Cure Call openai':{usage:{prompt_tokens:300,completion_tokens:40}}});ok(n2.input_tokens===l0.input_tokens+300&&n2.output_tokens===l0.output_tokens+40,'Build Save Body, chat cure call: +300 in, +40 out');
// ---- Panel Tokens.
const baseP={'Init Seats':{run_token:'T'},'Build Save Body':{saveBody:{input_tokens:10,output_tokens:2,cache_write_tokens:0,cache_read_tokens:1}},'Panel Judge 1 deepseek':{usage}};
const pt=(src,nodes)=>runCode(src,nodes,{})[0].json;const p0=pt(live('Panel Tokens'),baseP),q0=pt(draft('Panel_Tokens.js'),baseP);ok(JSON.stringify(p0)===JSON.stringify(q0),'Panel Tokens, no cure call: identical to live');
const q1=pt(draft('Panel_Tokens.js'),{...baseP,'Panel Cure Call 1 grok':{usage:{prompt_tokens:500,completion_tokens:50}},'Panel Cure Call 3 grok':{usage:{prompt_tokens:400,completion_tokens:40}},'Panel Cure Call 2 gemini':{usageMetadata:{promptTokenCount:70,candidatesTokenCount:7,thoughtsTokenCount:3}}});
ok(q1.p_input===p0.p_input+970&&q1.p_output===p0.p_output+100&&q1.panel_calls.filter(n=>/Cure/.test(n)).length===3,'Panel Tokens: cure calls in slots 1, 2 and 3, a Gemini one among them, all counted (+970 in, +100 out, 3 calls named)');
const q2=pt(draft('Panel_Tokens.js'),{...baseP,'Init Seats':{run_token:'T',dry:true},'Panel Cure Call 1 grok':{usage:{prompt_tokens:500,completion_tokens:50}}});ok(q2.go===false&&q2.p_input===0,'Panel Tokens on a dry replay still writes nothing (go false), as live');
const q3=pt(draft('Panel_Tokens.js'),{...baseP,'Alternate Call openrouter':[{usage:{prompt_tokens:200,completion_tokens:20}},{usage:{prompt_tokens:100,completion_tokens:10}}],'Alternate Cure Call openrouter':{usage:{prompt_tokens:50,completion_tokens:5}}});
ok(q3.p_input===p0.p_input+350&&q3.p_output===p0.p_output+35,'Panel Tokens: step 7 alternate calls (two items) and the alternate cure call counted (+350 in, +35 out)');
console.log('failures',fails);
