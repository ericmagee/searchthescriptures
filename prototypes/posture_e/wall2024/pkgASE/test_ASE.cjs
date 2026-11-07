// pkgASE tests. Run from wall2024/ after the builds (see build_ASE.cjs): node pkgASE/test_ASE.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);let ok=0,bad=0;const out=[];const T=(n,c,x)=>{out.push((c?'OK   ':'FAIL ')+n+(x?' :: '+x:''));c?ok++:bad++;};
const {harness}=require('../pkgGSL/harness.cjs');const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s31.json','utf8'));const L=(W.data||W).nodes;const live=n=>L.find(z=>z.name===n).parameters.jsCode;
const P1=JSON.parse(fs.readFileSync('pkgASE/plan_ASE.json','utf8')),P2=JSON.parse(fs.readFileSync('pkgASE/plan_ASE_on_live.json','utf8'));const PS=JSON.parse(fs.readFileSync('pkgPSN/plan_PSN.json','utf8')).nodes;
T('A1 2 nodes on pkgPSN/patched; bases are the PSN finals; patched shas hold',P1.nodes.length===2&&P1.nodes.every(n=>PS.find(z=>z.file===n.file).final_sha===n.base_sha&&sha(fs.readFileSync('pkgASE/patched/'+n.file,'utf8'))===n.final_sha));
T('A2 --on-live: 2 nodes on live a353b9e8',P2.nodes.length===2&&P2.nodes.every(n=>n.base_sha===n.live_sha&&sha(live(n.name))===n.live_sha));
// the inserted block, run alone on a fixture scope
const S=fs.readFileSync('pkgASE/patched/Send_Back_Record.js','utf8');const a=S.indexOf('/* pkgASE (W3 2784'),b=S.indexOf('let bodies=null,anySil=false;',a);const blk=S.slice(a,b);
T('A3 the block is inserted once, just before "let bodies", in both nodes; Alt marks its rows alternate',S.split('/* pkgASE (W3 2784').length===2&&fs.readFileSync('pkgASE/patched/Alt_Send_Back_Record.js','utf8').includes("seat_role:'alternate',judge_model:b.api_model||null,kind:'send_back',rule:'E-ASE'"));
const run=(shown,B,RD)=>{const rows=[];new Function('shown','B','__RD','rows','T',blk)(shown,B,RD,rows,'T0');return rows;};
const F=JSON.parse(fs.readFileSync('pkgASE/fixture_33289_grok.json','utf8'));const R=JSON.parse(fs.readFileSync('pkgASE/rounds_33289.json','utf8'));delete R.run_token;
const sh=(o)=>[{seat:'grok',sid:F.sid,rule:'E-PREM',item:F.item,reason:F.reason,ans:'CHANGE',to:F.to,...o}];const BB=(o)=>[{seat:'grok',run_token:'ODV1-33289-sd6xpstf',api_model:'x-ai/grok',items:[{sid:F.sid,rule:'E-PREM',reason:F.reason,...o}]}];
{const r=run(sh(),BB(),R);T('G1 FINDING: 33289 grok S1 gives no E-ASE row, because its ASSUMES words stand in round CR2 (the press), not only in the enforcer reason',r.length===0);}
T('G2 the run "road apart from davids loins" stands in round CR2 of 33289 (debate_results engine_r2): "ASSUMES: the throne\'s gift comes by a road apart from David\'s loins"',/ASSUMES: the throne's gift comes by a road apart from David's loins/.test(R.CR2));
{const R0={...R,CR2:R.CR2.replace(/apart from David's loins/g,'xx')};const r=run(sh(),BB(),R0);T('G1b with that press sentence taken out of CR2, the same CHANGE gives one record-only E-ASE row quoting the reason',r.length===1&&r[0].rule==='E-ASE'&&/^RECORD-ONLY/.test(r[0].cure_reason)&&/road apart from davids loins/.test(r[0].cure_reason),r[0]&&r[0].cure_reason);}
{const R0={...R,CR2:R.CR2.replace(/apart from David's loins/g,'xx')};T('G3 with EPK cut text, the full reason (reason_full) is the one read',run(sh(),BB({reason:'[words cut]',reason_full:F.reason}),R0).length===1);}
T('N1 an ASSUMES whose words stand in a round is not flagged (the run is put into a round)',run(sh(),BB(),{...R,CR3:R.CR3+' a road apart from Davids loins '}).length===0);
T('N2 an ASSUMES sharing no 5-word run with the reason is not flagged',run(sh({to:F.to.replace('comes by a road apart from David\'s loins','rests on a gift')}),BB(),R).length===0);
T('N3 a KEEP, or a rule other than E-PREM, is not read',run(sh({ans:'KEEP'}),BB(),R).length===0&&run(sh({rule:'E-ANS'}),BB(),R).length===0);
T('N4 no rounds read (__RD null): nothing is flagged',run(sh(),BB(),null).length===0);
T('N5 a CHANGE TO with no ASSUMES clause is not read',run(sh({to:'CONCEDED LINKS: 1 -- premise 6 UNEXHIBITED. Premises 1-5 spared.'}),BB(),R).length===0);
// replay parity on saved runs: base (PSN) vs ASE; any E-ASE row is listed
for(const RUN of ['33218','33222','33249','33261'])for(const [n,inp] of [['Send Back Record','Send Back Call openrouter'],['Alt Send Back Record','Alt Send Back Call openrouter']]){const f=n.replace(/ /g,'_')+'.js';let x,y;
 try{x=harness(RUN)(fs.readFileSync('pkgPSN/patched/'+f,'utf8'),inp);y=harness(RUN)(fs.readFileSync('pkgASE/patched/'+f,'utf8'),inp);}catch(e){out.push('INFO '+RUN+' '+n+' not replayable: '+String(e.message).slice(0,60));continue;}
 const ase=(y[0].json.sb_rows||[]).filter(r=>r.rule==='E-ASE');out.push('INFO '+RUN+' '+n+': E-ASE rows '+ase.length+ase.map(r=>' | '+r.seat+' '+r.item+': '+r.cure_reason.slice(0,140)).join(''));
 const strip=o=>JSON.stringify({...o[0].json,sb_rows:(o[0].json.sb_rows||[]).filter(r=>r.rule!=='E-ASE')});T('P '+RUN+' '+n+': output identical apart from E-ASE rows',strip(x)===strip(y));}
const txt=out.join('\n')+'\n'+ok+' OK, '+bad+' FAIL\n';fs.writeFileSync('pkgASE/test_ASE.txt',txt);console.log(txt);process.exit(bad?1:0);
