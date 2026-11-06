// pkgCP test (W3 2351). Run from wall2024/: node pkgCP/test_CP.cjs
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n);}};
const plan=JSON.parse(rd('pkgCP/plan_CP.json'));
T('6 nodes: base (pkgKF) and final shas match the plan',plan.nodes.length===6&&plan.nodes.every(n=>sha(rd('pkgKF/patched/'+n.file))===n.base_sha&&sha(rd('pkgCP/patched/'+n.file))===n.final_sha));
T('every node parses',plan.nodes.every(n=>{try{new Function('$','$input',rd('pkgCP/patched/'+n.file));return true;}catch(e){console.log(e.message);return false;}}));
T('the 6 nodes carry one identical sbApply2024',(()=>{const f=s=>{const i=s.indexOf('function sbApply2024(');return s.slice(i,s.indexOf('\nfunction ',i+10));};const a=plan.nodes.map(n=>f(rd('pkgCP/patched/'+n.file)));return a.every(x=>x===a[0]&&x.includes('pkgCP (W3 2351)'));})());
const mk=f=>{const AM=rd(f);return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {gateCure2024,gateItems2024,ciRounds,gatePromptText2024,drvLinks,sbApply2024};')(()=>{throw new Error('offline');},null);};
const KF=mk('pkgKF/patched/Alternate_Merge.js'),CP=mk('pkgCP/patched/Alternate_Merge.js');
const ctxOf=(L,X,seat)=>{const j=X.PB.judges.find(q=>q.seat===seat);const PT=L.gatePromptText2024(j.body);return {R:L.ciRounds(PT),DL:L.drvLinks(PT),ask:PT.includes('CITATION CHECK')};};
const X21=JSON.parse(rd('probe_33021/fixture_33021.json'));const gb=X21.bodies.find(b=>b.seat==='gemini');
const gIts=X21.sb_items.filter(x=>x.seat==='gemini'&&x.rule!=='E-GATE');const g0=X21.sb_items.find(x=>x.seat==='gemini'&&x.sid==='G1');
// 1. send-back: S9 (FORCED D1 vs C1 -> "D1: STANDS") is NOT APPLIED on pkgCP, applied on pkgKF
{const c=ctxOf(CP,X21,'gemini');const a=KF.sbApply2024('gemini',gb.verdict_raw,gb.fields,gIts,c.R),n=CP.sbApply2024('gemini',gb.verdict_raw,gb.fields,gIts,c.R);
 const s9=n.items.find(z=>z.sid==='S9');console.log('   33021 gemini send-back: pkgKF applied '+a.applied.join(',')+'; pkgCP applied '+n.applied.join(',')+'; pkgCP S9: '+(s9?s9.kind+' -- '+s9.why:'none'));
 T('33021 gemini S9 NOT APPLIED, "the change drops the collision D1 vs C1"; S1 to S8 and S10 still applied',a.applied.includes('S9')&&!n.applied.includes('S9')&&s9&&s9.kind==='NOT APPLIED'&&/drops the collision D1 vs C1/.test(s9.why)&&a.applied.filter(z=>z!=='S9').join()===n.applied.join());
 T('33021 gemini after send-back on pkgCP: the FORCED D1 vs C1 line and the D1 vs C1 collision line both remain',/FORCED:\s*D1 vs C1/.test(n.text)&&/^\s*(?:[-•]\s*)?D1 vs C1 \(Matthew 1:18\): CHALLENGER LINK BROKEN/m.test(n.text.replace(/[*_`]+/g,'')));}
// 2. the live gate item (pkgKF raised G1 RULE K-G4 D1 vs C1) with the stored reply "CHANGE TO: D1: STANDS"
const REP='GATE: G1 || CHANGE TO: D1: STANDS -- GROUND: Answered in [CR4]; Matthew 1:18 dates the finding before they came together, which can agree with the finding preceding the taking of Matthew 1:24. || In [DR3], the challenger explains that "before they came together" means before the taking of 1:24, which can agree with the finding preceding the taking.';
const cK=ctxOf(KF,X21,'gemini');const Glive=KF.gateItems2024('gemini',gb.verdict_raw,gb.fields,gIts,cK).items;
{const a=KF.gateCure2024('gemini',gb.verdict_raw,gb.fields,gIts,Glive,REP,cK),n=CP.gateCure2024('gemini',gb.verdict_raw,gb.fields,gIts,Glive,REP,ctxOf(CP,X21,'gemini'));
 console.log('   33021 gemini live gate item: '+Glive.map(g=>g.gid+' '+g.kind+' '+g.key).join('; ')+'\n     pkgKF: '+a.res.map(r=>r.gid+' '+(r.cured?'CURED':'UNCURED')+' -- '+r.why).join('; ')+'\n     pkgCP: '+n.res.map(r=>r.gid+' '+(r.cured?'CURED':'UNCURED')+' -- '+r.why).join('; ')+'; counted '+n.uncured);
 T('33021 gemini G1 (the live K-G4 item, stored reply): pkgKF CURED, pkgCP UNCURED, counted 1',Glive.length===1&&Glive[0].kind==='RULE K-G4'&&a.res[0].cured&&!n.res[0].cured&&n.uncured===1);}
// 3. W2's 7 variants (Wall 2352) at the live G1 item: only a same-pair line with a grade word cures
{const V={A:'D1: STANDS -- GROUND: Answered in [CR4]; Matthew 1:18 dates the finding before they came together.',B:'D1 vs C2 (Matthew 1:18): UNDERDETERMINED -- the parties exhibit different readings. GROUND: [DR3] reads "came together" as the taking.',C:'D1 vs C1 (Matthew 1:18): NOTED -- the challenger reads "came together" as the taking.',D:'RULING -- D1 vs C1 -- UNDERDETERMINED',E:'KEYSTONE: D5 -- STANDS',F:'D1 vs C1 (Matthew 1:18): STANDS -- GROUND: answered in [CR4].',G:'D1 vs C1 (Matthew 1:18): UNDERDETERMINED -- [DR3] reads "came together" as the taking. GROUND: the parties exhibit different readings of Matthew 1:18.'};
 const r={};for(const [k,to] of Object.entries(V)){const n=CP.gateCure2024('gemini',gb.verdict_raw,gb.fields,gIts,Glive,'GATE: G1 || CHANGE TO: '+to+' || reason',ctxOf(CP,X21,'gemini'));r[k]=n.res[0];console.log('   variant '+k+': '+(n.res[0].cured?'CURED':'UNCURED')+' -- '+n.res[0].why.slice(0,140));}
 T('W2 variants A to E UNCURED; F (same pair, STANDS) and G (same pair, UNDERDETERMINED) CURED',['A','B','C','D','E'].every(k=>!r[k].cured)&&r.F.cured&&r.G.cured);}
// 4. units: FORCED -> same-pair collision line applies; FORCED -> same-pair FORCED applies; collision -> FORCED is refused; label-only refused
{const txt='COLLISION POINTS:\nD2 vs C1 (Matthew 1:25): CHALLENGER LINK BROKEN -- x. GROUND: y\nFORCED: D2 vs C1 -- MEANS [CR3]: "a" -- ANSWER [DR3]: "b" -- FAILS: "b"\nRESULT: DEFENDER WINS -- z';
 const F0={verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',conceded_links:0,challenge_standing:'PROP-DEPENDENT',challenger_conceded_links:0};const raw=JSON.stringify({reasoning:txt});
 const ap=(line,to)=>CP.sbApply2024('j',raw,F0,[{sid:'S1',ans:'CHANGE',line,to}],{});
 const fl='FORCED: D2 vs C1 -- MEANS [CR3]: "a" -- ANSWER [DR3]: "b" -- FAILS: "b"',cl='D2 vs C1 (Matthew 1:25): CHALLENGER LINK BROKEN -- x. GROUND: y';
 const u1=ap(fl,'D2 vs C1 (Matthew 1:25): STANDS -- GROUND: both place the till from the taking.'),u2=ap(fl,'FORCED: D2 vs C1 -- MEANS [CR3]: "a" -- ANSWER [DR3]: "b" -- FAILS: "b" (Commitment 3)'),u3=ap(cl,fl+' (Commitment 3)'),u4=ap(cl,'D2 vs C1 (Matthew 1:25) -- regraded below'),u5=ap(cl,'D2 vs C1 (Matthew 1:25): DEFENDER LINK BROKEN (Commitment 5) -- GROUND: z');
 const ap1=u=>u&&u.applied.includes('S1'),na=u=>u&&u.items.some(z=>z.sid==='S1'&&/drops the collision D2 vs C1/.test(z.why));
 T('units: FORCED->pair STANDS applies (grok 33021 S9 form); FORCED->FORCED same pair applies; collision->FORCED, collision->label without grade refused; collision->DEFENDER LINK BROKEN applies',ap1(u1)&&ap1(u2)&&na(u3)&&na(u4)&&ap1(u5));}
// 5. every changed item in 32998, 33014, 33020, 33021 (send-back apply and gate replay with the stored replies)
const X98=JSON.parse(rd('pkgGD/fixture_32998.json')),X20=JSON.parse(rd('pkgGD/probe_33020/fixture_33020.json')),X14=JSON.parse(rd('pkgKF/fixture_33014.json'));
const sets=[['32998',X98],['32998 alt',X98.alt],['33014',X14],['33014 alt',X14.alt],['33020',X20],['33021',X21]];const diffs=[];
const gate=(L,X,b,its)=>{if(!its.length)return {G:[],res:[],u:0};const c=ctxOf(L,X,b.seat);const G=L.gateItems2024(b.seat,b.verdict_raw,b.fields,its,c).items;const rep=X.gate_replies&&X.gate_replies[b.seat];const r=rep&&G.length?L.gateCure2024(b.seat,b.verdict_raw,b.fields,its,G,rep,c):{res:[],uncured:0};return {G,res:r.res,u:r.uncured};};
for(const [nm,X] of sets){for(const b of X.bodies){const its=X.sb_items.filter(x=>x.seat===b.seat&&x.rule!=='E-GATE');if(!its.length){console.log('   '+nm+' '+b.seat+': no send-back items');continue;}const c=ctxOf(CP,X,b.seat);
 const a=KF.sbApply2024(b.seat,b.verdict_raw,b.fields,its,c.R),n=CP.sbApply2024(b.seat,b.verdict_raw,b.fields,its,c.R);const na=n?n.items.filter(z=>/drops the collision/.test(z.why)):[];
 const ga=gate(KF,X,b,its),gn=gate(CP,X,b,its);const ds=g=>g.G.map((x,i)=>x.gid+' '+x.kind+(g.res[i]?' '+(g.res[i].cured?'CURED':'UNCURED'):'')).join('; ');const same=ds(ga)===ds(gn)&&ga.u===gn.u;
 console.log('   '+nm+' '+b.seat+': send-back applied pkgKF ['+(a?a.applied.join(','):'')+'] pkgCP ['+(n?n.applied.join(','):'')+']'+(na.length?' NEW NOT APPLIED: '+na.map(z=>z.sid+' ('+z.why.split(' (W3')[0]+'; to: '+String(z.to).slice(0,90)+')').join('; '):'')+' | gate '+(same?'same ['+ds(gn)+'] counted '+gn.u:'pkgKF ['+ds(ga)+'] counted '+ga.u+' -> pkgCP ['+ds(gn)+'] counted '+gn.u));
 if(na.length||!same)diffs.push(nm+' '+b.seat+(na.length?' '+na.map(z=>z.sid).join(','):'')+(same?'':' gate'));}}
console.log('   changed: '+(diffs.join('; ')||'none'));
T('the only changes across 32998, 33014, 33020 and 33021 are 33021 gemini (S9 NOT APPLIED; its gate set changes)',diffs.length===1&&/^33021 gemini S9 gate$/.test(diffs[0]));
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
