// pkgRCL test (K-RECHK log rows, W3 Wall 2496). Run from wall2024/: node pkgRCL/test_RCL.cjs [base, default pkgSQ] [out, default pkgRCL]  (pkgRCLN: pkgRCLN/stage_rck pkgRCLN)
const fs=require('fs'),zlib=require('zlib');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n);}};const BP=process.argv[2]||'pkgSQ';const OP=process.argv[3]||'pkgRCL';
const plan=JSON.parse(rd(OP+'/plan_RCL.json'));
T('22 nodes: base ('+BP+') and final shas match the plan; every node edited (the R.rp ids); Alternate Merge also writes the rows',plan.base===BP+'/patched'&&plan.nodes.length===22&&plan.nodes.every(n=>sha(rd(BP+'/patched/'+n.file))===n.base_sha&&sha(rd(OP+'/patched/'+n.file))===n.final_sha&&n.edits.length>=4)&&plan.nodes.find(n=>n.file==='Alternate_Merge.js').edits.includes('K-RECHK rows (both returns)'));
const lib=p=>{const AM=rd(p+'/patched/Alternate_Merge.js');return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {cureRewrite,rechk2024,'+(p===OP?'rechkRows2024,':'')+'kcmtGrade2024};')(()=>{throw 0},null);};
const O=lib(BP),N=lib(OP);
// 1. units
const o1='D2 vs C4 (Luke 1:35): CHALLENGER LINK BROKEN (Commitment 3) -- the answer misses.',n1='D2 vs C4 (Luke 1:35): CHALLENGER LINK BROKEN -- the answer misses.';
const R=()=>({rp:[[o1,n1,'S7']],audit:'[AUDIT v21: X]',fields:{}});const a=O.cureRewrite(o1,false,R(),'grok',null),b=N.cureRewrite(o1,false,R(),'grok',null);
console.log('   base mark: '+(a.match(/\[AUDIT v39: K-RECHK[^\n]*/)||['none'])[0].slice(0,160)+'\n   pkgRCL mark: '+(b.match(/\[AUDIT v39: K-RECHK[^\n]*/)||['none'])[0].slice(0,170));
T('unit: the mark names the change (CHANGE: S7) and is otherwise the base mark',/K-RECHK -- SEAT: grok; CHANGE: S7; RULE: K-CMT; NEW: /.test(b)&&b.replace('CHANGE: S7; ','')===a);
const rr=N.rechkRows2024({bodies:[JSON.stringify({payload:{judge_seat:'grok',judge_api_model:'x-ai/grok',verdict_raw:b+'\n'+b}})],alternates_tried:[]},{run_token:'ODV1-T',alt_seats:[]});
console.log('   rows: '+JSON.stringify(rr).slice(0,600));
T('unit: one row per distinct mark (the same mark twice gives one row), in the 2496 form',rr.length===1&&rr[0].kind==='send_back'&&rr[0].rule==='K-RECHK'&&rr[0].cure_status===null&&rr[0].item==='S7'&&rr[0].flagged_line===n1&&rr[0].response_line===o1&&rr[0].seat==='grok'&&rr[0].seat_role==='panel'&&rr[0].judge_model==='x-ai/grok'&&rr[0].run_token==='ODV1-T'&&/^NEW \(K-CMT\): /.test(rr[0].cure_reason));
T('unit: a text with no mark gives no row; a broken body gives no row and no throw',N.rechkRows2024({bodies:['{bad',JSON.stringify({payload:{judge_seat:'x',verdict_raw:a.replace(/\n\[AUDIT v39: K-RECHK[^\n]*/g,'')}})]},{alt_seats:[]}).length===0);
// 2. whole nodes on the saved runs: pkgRCL output = base output once 'CHANGE: <id>; ' is taken out of the K-RECHK marks, except Alternate Merge's rows
const W1='/mnt/project-files/wall2024/inputs/';const extra=JSON.parse(rd(W1+'33040_index_w1.json')).nodes;
function load(run){const N0=JSON.parse(zlib.gunzipSync(fs.readFileSync('corpus/raw/nodes_'+run+'.json.gz')));try{const G=JSON.parse(rd('corpus/raw/gate_'+run+'.json'));Object.assign(N0.nodes,G);}catch(e){}
 if(run==='33040')for(const [name,v] of Object.entries(extra)){const X=JSON.parse(rd(W1+v.file));N0.nodes[name]=X.map(r=>((r.main&&r.main[0])||[]).map(i=>i.json));}return N0;}
function mock(N0){return name=>{const runs=N0.nodes[name];if(!runs)return {isExecuted:false,first:()=>{throw new Error('node not saved: '+name);},all:()=>{throw new Error('node not saved: '+name);}};const items=runs[runs.length-1]||[];return {isExecuted:true,first:()=>({json:items[0]}),last:()=>({json:items[items.length-1]}),all:()=>items.map(j=>({json:j})),item:{json:items[0]}};};}
const runN=(p,N0,f)=>{try{const $=mock(N0);return JSON.stringify(new Function('$','$input','$json',rd(p+'/patched/'+f))($,{first:()=>({json:{}}),all:()=>[],item:{json:{}}},{})).replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d+Z/g,'<T>');}catch(e){return 'ERR '+String(e&&e.message||e).slice(0,120);}};
let same=true,real=0,marks=0;const amRows=[];
/* Alternate Merge reads Alternate Merge Seat, which is not saved: each package's own Alternate Merge Seat output is served to its Alternate Merge */
const seatOut={};const runP=(p,N0,f,run)=>{if(f!=='Alternate_Merge.js')return runN(p,N0,f);const so=seatOut[p+run];if(!so||so.startsWith('ERR'))return runN(p,N0,f);
 const N1={...N0,nodes:{...N0.nodes,'Alternate Merge Seat':[JSON.parse(so.replace(/<T>/g,'2026-11-06T00:00:00.000Z')).map(i=>i.json)]}};return runN(p,N1,f);};
for(const run of ['32998','33014','33020','33021','33025','33040']){const N0=load(run);for(const p of [BP,OP])seatOut[p+run]=runN(p,N0,'Alternate_Merge_Seat.js');
 for(const n of plan.nodes){const x=runP(BP,N0,n.file,run),y=runP(OP,N0,n.file,run);if(!x.startsWith('ERR'))real++;marks+=(y.match(/K-RECHK -- [^\]]*CHANGE: /g)||[]).length;
  let y2=y.replace(/(K-RECHK -- (?:SEAT: [^;]*; )?)CHANGE: [^;]*; /g,'$1');
  if(n.file==='Alternate_Merge.js')console.log('   Alternate Merge '+run+': '+(y.startsWith('ERR')?y:'runs'));
  if(n.file==='Alternate_Merge.js'&&!y.startsWith('ERR')){const P=JSON.parse(y)[0].json,Q=JSON.parse(x)[0].json;const rk=(P.enforcer_log||[]).filter(r=>r.rule==='K-RECHK');amRows.push([run,rk,P,Q]);
   const strip=o=>{const c={...o,enforcer_log:(o.enforcer_log||[]).filter(r=>r.rule!=='K-RECHK')};if(o.enforcer_log_body)c.enforcer_log_body={...o.enforcer_log_body,p_rows:(o.enforcer_log_body.p_rows||[]).filter(r=>r.rule!=='K-RECHK')};return c;};
   y2=JSON.stringify([{json:strip(P)}]).replace(/(K-RECHK -- (?:SEAT: [^;]*; )?)CHANGE: [^;]*; /g,'$1');const x2=JSON.stringify([{json:strip(Q)}]);if(x2!==y2){same=false;console.log('   DIFF '+run+' '+n.file);}continue;}
  if(x!==y2){same=false;console.log('   DIFF '+run+' '+n.file+' '+x.slice(0,80)+' | '+y2.slice(0,80));}}}
console.log('   6 runs x 22 nodes: '+real+' node runs with real output; '+marks+' K-RECHK marks with CHANGE in pkgRCL output');
T('whole nodes on the 6 saved runs: identical to the base apart from CHANGE in the K-RECHK marks and the K-RECHK rows',same);
for(const [run,rk,P,Q] of amRows){console.log('   Alternate Merge '+run+': '+rk.length+' K-RECHK rows; p_rows '+((Q.enforcer_log_body||{}).p_rows||[]).length+' -> '+((P.enforcer_log_body||{}).p_rows||[]).length);rk.forEach(r=>console.log('     '+r.seat+' '+r.seat_role+' '+r.item+' | '+r.cure_reason.slice(0,90)+'\n       LINE: '+String(r.flagged_line).slice(0,130)));}
const am40=amRows.find(x=>x[0]==='33040');
T('Alternate Merge runs whole on 33040 (saved Alt Seated; each package\'s own Alternate Merge Seat output); no marks in the saved texts, so no rows and the output equals the base',!!am40&&am40[1].length===0);
/* 33040 with one pkgRCL mark put into grok's text in Alternate Merge Seat's output (the saved texts predate pkgRCK, so they hold no marks) */
{const N0=load('33040');const so=JSON.parse(seatOut[OP+'33040'].replace(/<T>/g,'2026-11-06T00:00:00.000Z'));const J=so[0].json;let put=0;
 J.bodies=J.bodies.map(x=>{const o=JSON.parse(x);if(o.payload.judge_seat==='grok'){o.payload.verdict_raw+=b.slice(b.indexOf('\n[AUDIT v39: K-RECHK'))+b.slice(b.indexOf('\n[AUDIT v39: K-RECHK'));put++;}return JSON.stringify(o);});
 const AS=N0.nodes['Alt Seated'][0][0];console.log('   33040 Alt Seated alt_seats: '+JSON.stringify((AS.alt_seats||[]).map(s=>s.seat))+' (so Alternate Merge takes its '+((AS.alt_seats||[]).length?'full':'early')+' return)');
 const run=p=>{const N1={...N0,nodes:{...N0.nodes,'Alternate Merge Seat':[so.map(i=>i.json)]}};return JSON.parse(runN(p,N1,'Alternate_Merge.js').replace(/<T>/g,'2026-11-06T00:00:00.000Z'))[0].json;};
 const P=run(OP),Q=run(BP);const rk=P.enforcer_log.filter(r=>r.rule==='K-RECHK'),rk2=P.enforcer_log_body.p_rows.filter(r=>r.rule==='K-RECHK');
 console.log('   injected: '+put+' body, the mark twice; rows '+rk.length+': '+JSON.stringify(rk[0]||null).slice(0,420));
 {const N2={...N0,nodes:{...N0.nodes,'Alternate Merge Seat':[so.map(i=>i.json)],'Alt Seated':[[{...AS,alt_seats:[]}]]}};const E1=JSON.parse(runN(OP,N2,'Alternate_Merge.js'))[0].json;
  const N3={...N2,nodes:{...N2.nodes,'Alternate Merge Seat':[JSON.parse(seatOut[OP+'33040'].replace(/<T>/g,'2026-11-06T00:00:00.000Z')).map(i=>i.json)]}};const E0=JSON.parse(runN(OP,N3,'Alternate_Merge.js'))[0].json;
  const e1=E1.enforcer_log.filter(r=>r.rule==='K-RECHK');console.log('   early return (alt_seats emptied): rows '+e1.length+'; p_rows '+(E0.enforcer_log_body.p_rows||[]).length+' -> '+E1.enforcer_log_body.p_rows.length);
  T('early return (no alternate seated): the row is added to enforcer_log and p_rows; with no mark the output is Alternate Merge Seat\'s, unchanged',e1.length===1&&E1.enforcer_log_body.p_rows.length===E0.enforcer_log_body.p_rows.length+1&&JSON.stringify(E0)===JSON.stringify(N3.nodes['Alternate Merge Seat'][0][0]).replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d+Z/g,'<T>'));}
 T('33040 with an injected mark: one K-RECHK row (grok, item S7, the new and original lines), in enforcer_log and p_rows; every other row as the base',rk.length===1&&rk2.length===1&&rk[0].seat==='grok'&&rk[0].item==='S7'&&rk[0].flagged_line===n1&&rk[0].response_line===o1&&JSON.stringify(P.enforcer_log.filter(r=>r.rule!=='K-RECHK'))===JSON.stringify(Q.enforcer_log)&&JSON.stringify(P.enforcer_log_body.p_rows.filter(r=>r.rule!=='K-RECHK'))===JSON.stringify(Q.enforcer_log_body.p_rows));}
T('every row has an item (the change id), a flagged_line and a response_line, cure_status null',amRows.every(([,rk])=>rk.every(r=>r.item&&r.flagged_line&&r.response_line!=null&&r.cure_status===null&&r.kind==='send_back')));
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
