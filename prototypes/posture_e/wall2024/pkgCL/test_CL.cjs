// pkgCL test. Run from wall2024/: node pkgCL/test_CL.cjs
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n);}};
const plan=JSON.parse(rd('pkgCL/plan_CL.json'));
T('6 nodes: base (pkgCP2) and final shas match the plan',plan.nodes.length===6&&plan.nodes.every(n=>sha(rd('pkgCP2/patched/'+n.file))===n.base_sha&&sha(rd('pkgCL/patched/'+n.file))===n.final_sha));
T('every node parses',plan.nodes.every(n=>{try{new Function('$','$input',rd('pkgCL/patched/'+n.file));return true;}catch(e){console.log(e.message);return false;}}));
const mk=f=>{const AM=rd(f);return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {gateCure2024,gateItems2024,ciRounds,gatePromptText2024,drvLinks,sbApply2024};')(()=>{throw new Error('offline');},null);};
const P2=mk('pkgCP2/patched/Alternate_Merge.js'),CL=mk('pkgCL/patched/Alternate_Merge.js');
const ctxOf=(L,X,seat)=>{const j=X.PB.judges.find(q=>q.seat===seat);const PT=L.gatePromptText2024(j.body);return {R:L.ciRounds(PT),DL:L.drvLinks(PT),ask:PT.includes('CITATION CHECK')};};
// 1. the 33025 chatgpt shape on the 33021 gemini fixture: its S1 ANSWER CHECK change written as a bare grade word, then a whole line at the gate
const X=JSON.parse(rd('probe_33021/fixture_33021.json'));const b=X.bodies.find(z=>z.seat==='gemini');
const its=X.sb_items.filter(x=>x.seat==='gemini'&&x.rule!=='E-GATE').map(x=>({...x}));const s1=its.find(x=>x.sid==='S1');const whole=String(s1.to);
console.log('   S1 line: '+String(s1.line).slice(0,140)+'\n   S1 whole change: '+whole.slice(0,140));
s1.to='MEETS -- the answer gives its own fit.';
for(const [nm,L] of [['pkgCP2',P2],['pkgCL',CL]]){const c=ctxOf(L,X,'gemini');const G=L.gateItems2024('gemini',b.verdict_raw,b.fields,its,c).items;const g=G.find(z=>z.sid==='S1');
 const rep=G.map(z=>'GATE: '+z.gid+' || '+(z===g?'CHANGE TO: '+whole:'KEEP')+' || reason').join('\n');const r=L.gateCure2024('gemini',b.verdict_raw,b.fields,its,G,rep,c);const rr=g?r.res.find(z=>z.gid===g.gid):null;
 console.log('   '+nm+': gate item '+(g?g.gid+' '+g.kind+' lines '+(g.lines||[]).length:'none')+' -> '+(rr?(rr.cured?'CURED':'UNCURED')+' -- '+rr.why:'')+'; fresh: '+JSON.stringify((r.fresh||[]).map(z=>z.why)).slice(0,200));
 if(nm==='pkgCP2')T('pkgCP2 (staged): the bare-grade refusal reaches the gate with no line, and the whole corrected line is refused',g&&!(g.lines||[]).length&&!rr.cured);
 else T('pkgCL: the gate item carries the refused line, and the whole corrected line applies and cures',g&&(g.lines||[]).length===1&&rr.cured&&/the gate change was applied/.test(rr.why));}
// 2. the refusal reasons are unchanged; only lines is added
{const c=ctxOf(CL,X,'gemini');const a=P2.sbApply2024('gemini',b.verdict_raw,b.fields,its,c.R),n=CL.sbApply2024('gemini',b.verdict_raw,b.fields,its,c.R);
 T('send-back apply: same applied list and same refusal reasons on pkgCP2 and pkgCL',a.applied.join()===n.applied.join()&&JSON.stringify(a.items.map(z=>[z.sid,z.kind,z.why]))===JSON.stringify(n.items.map(z=>[z.sid,z.kind,z.why])));}
// 3. stored runs: gate decisions with the stored replies, pkgCP2 vs pkgCL
const X98=JSON.parse(rd('pkgGD/fixture_32998.json')),X20=JSON.parse(rd('pkgGD/probe_33020/fixture_33020.json')),X14=JSON.parse(rd('pkgKF/fixture_33014.json'));const diffs=[];
for(const [nm,Y] of [['32998',X98],['32998 alt',X98.alt],['33014',X14],['33014 alt',X14.alt],['33020',X20],['33021',X]]){for(const bb of Y.bodies){const it=Y.sb_items.filter(x=>x.seat===bb.seat&&x.rule!=='E-GATE');if(!it.length)continue;
 const run=L=>{const c=ctxOf(L,Y,bb.seat);const G=L.gateItems2024(bb.seat,bb.verdict_raw,bb.fields,it,c).items;const rep=Y.gate_replies&&Y.gate_replies[bb.seat];const r=rep&&G.length?L.gateCure2024(bb.seat,bb.verdict_raw,bb.fields,it,G,rep,c):{res:[],uncured:0};return G.map((g,i)=>g.gid+' '+g.kind+(r.res[i]?' '+(r.res[i].cured?'CURED':'UNCURED'):'')).join('; ')+' counted '+r.uncured;};
 const a=run(P2),n=run(CL);if(a!==n){diffs.push(nm+' '+bb.seat);console.log('   '+nm+' '+bb.seat+': pkgCP2 ['+a+'] -> pkgCL ['+n+']');}}}
console.log('   changed: '+(diffs.join('; ')||'none'));
T('no stored gate decision in 32998, 33014, 33020 or 33021 changes',!diffs.length);
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
