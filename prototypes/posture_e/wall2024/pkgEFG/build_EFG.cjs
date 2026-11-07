// pkgEFG (W3 Wall 2873 D6, from W1 2872 B8; Eric's outside review of 33371: the FORCED lane). DeepSeek enforcer fix, side-neutral, 4 nodes.
// Build (Judge Enforcer Build, Alt): (a) every FORCED E-COL item is REQUIRED: it is never dropped into not_checked by MAX_CALLS (an extra call is opened
// for it); this covers every K-G4 item cured as a forced link (ruling 411), whose FORCED line pkgECF A2 already feeds from the cure reply. (b) efgCheck
// (efg_lib.js): when the MEANS quote, its verse words removed, has no 6-word run in the named round's own prose, the item says so (CODE CHECK) and its
// ids carry efg; RULE E-COL gains the sentence. Record (Judge Enforcer Record, Alt): an E-COL row with efg that DeepSeek AGREEd (or left without verdict)
// is written "ENFORCER DISAGREE (right: UNDERDETERMINED): (pkgEFG code check) ..." so Send Back Build sends it; a DISAGREE row gets the note appended.
// TRIAL: the Record only appends "(TRIAL pkgEFG: ...)" (stripped by why()). The single seat is not reached: Judge Enforcer reads panel seats only (PCC.bodies).
// Run from wall2024/: node pkgEFG/build_EFG.cjs [--bbase dir] [--rbase dir] [--status TRIAL] [--out dir]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};
const BB=arg('--bbase','pkgEAH/patched'),RB=arg('--rbase','pkgECQ/patched_live_on_pkgEAH_patched'),ST=arg('--status','LIVE');const OUT=arg('--out','pkgEFG/'+(ST==='LIVE'?'patched_live':'patched'));
const LIB=fs.readFileSync(__dirname+'/efg_lib.js','utf8');
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor x'+n);return s.split(a).join(b);};
// Build anchors
const B1a="for(const g of CG){ci++;const ids=g.seats.map((s,k)=>({id:'K'+ci+'.'+(k+1),rule:'E-COL',";
const B1b="/* pkgEFG (W3 2873) */\n"+LIB+"for(const g of CG){ci++;const __efg=efgCheck(g.line,R);const ids=g.seats.map((s,k)=>({...(__efg?{efg:__efg}:{}),id:'K'+ci+'.'+(k+1),rule:'E-COL',";
const B2a="+ids.map(x=>x.id+' ('+x.seat+')').join(', ')+failsNote(g.line)});}";
const B2b="+ids.map(x=>x.id+' ('+x.seat+')').join(', ')+failsNote(g.line)+(__efg?'\\nCODE CHECK (pkgEFG): '+__efg+'.':''),req:/^FORCED/.test(g.line)});}";
const B3a="When the item says the FAILS words are found exactly in the round of the answer,";
const B3b="A FORCED line breaks a link by meaning only when its MEANS quotes the pressing side\\'s own sentence in the round it names; a verse re-quoted as the MEANS is not that, and when the item carries a CODE CHECK saying so, DISAGREE (pkgEFG, either side alike). When the item says the FAILS words are found exactly in the round of the answer,";
const B4a="if(calls.length>=MAX_CALLS){not_checked.push(...it.ids.map(x=>x.id));continue;}";
const B4b="if(calls.length>=MAX_CALLS&&!it.req){not_checked.push(...it.ids.map(x=>x.id));continue;} /* pkgEFG: a FORCED E-COL item is never left unchecked */";
// Record anchors
const R1a="/* pkgEAW (W3 2844) record half:";
const R1b="/* pkgEFG (W3 2873) record half */const EFG_STATUS='"+ST+"';const __efgN={};B.forEach(b=>(b.ids||[]).forEach(x=>{if(x&&x.rule==='E-COL'&&x.efg)__efgN[x.item+'|'+x.seat+'|'+x.flagged_line]=x.efg;}));let __efgPushed=0;\n"+
 "for(const r of rows){if(r.rule!=='E-COL')continue;const n=__efgN[r.item+'|'+r.seat+'|'+r.flagged_line];if(!n)continue;const note=n.replace(/[()]/g,' ');const cr=String(r.cure_reason||'');\n"+
 " if(EFG_STATUS!=='LIVE'){r.cure_reason=cr+' (TRIAL pkgEFG: '+note+')';continue;}\n"+
 " if(/^ENFORCER (?:DISAGREE|NO ANSWER)\\b/.test(cr)){r.cure_reason=cr.replace(/ \\(judge wrote /,' [pkgEFG code check: '+note+'] (judge wrote ');continue;}\n"+
 " if(/^ENFORCER (?:AGREE|NO VERDICT)\\b/.test(cr)){__efgPushed++;r.cure_reason='ENFORCER DISAGREE (right: UNDERDETERMINED): (pkgEFG code check) '+note+'. DeepSeek wrote: '+cr.replace(/^ENFORCER /,'').replace(/ \\(judge wrote [\\s\\S]*$/,'').slice(0,300)+' (judge wrote FORCED; RECORD-ONLY TRIAL, ruling 428)';}}\n"+R1a;
fs.mkdirSync(OUT,{recursive:true});const plan={bbase:BB,rbase:RB,status:ST,nodes:[]};
for(const f of ['Judge_Enforcer_Build.js','Alt_Judge_Enforcer_Build.js','Judge_Enforcer_Record.js','Alt_Judge_Enforcer_Record.js']){const isB=/Build/.test(f);const s0=fs.readFileSync((isB?BB:RB)+'/'+f,'utf8');let s;
 if(isB){s=rep(s0,B1a,B1b,f+' check');s=rep(s,B2a,B2b,f+' note');s=rep(s,B3a,B3b,f+' rule');s=rep(s,B4a,B4b,f+' req');}else s=rep(s0,R1a,R1b,f+' record');
 new Function('$','$input','$json','$execution','$workflow',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base:isB?BB:RB,base_sha:sha(s0),final_sha:sha(s)});console.log(f.padEnd(30),sha(s0),'->',sha(s));}
fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));console.log('->',OUT);
