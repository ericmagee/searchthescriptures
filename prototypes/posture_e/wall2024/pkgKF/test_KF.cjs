// pkgKF test (W3 2347). Run from wall2024/: node pkgKF/test_KF.cjs
// Each library raises its own gate items from the stored judgment and send-back answers; the stored gate replies are then read against them.
// A gate reply answers the items the live gate sent; where pkgKF raises an item the live gate never sent, the stored reply did not answer it.
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n);}};
const plan=JSON.parse(rd('pkgKF/plan_KF.json'));
T('6 nodes: base (pkgFQ) and final shas match the plan',plan.nodes.length===6&&plan.nodes.every(n=>sha(rd('pkgFQ/patched/'+n.file))===n.base_sha&&sha(rd('pkgKF/patched/'+n.file))===n.final_sha));
T('every node parses',plan.nodes.every(n=>{try{new Function('$','$input',rd('pkgKF/patched/'+n.file));return true;}catch(e){console.log(e.message);return false;}}));
const mk=f=>{const AM=rd(f);return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {gateCure2024,gateItems2024,ciRounds,gatePromptText2024,drvLinks,kfLines};')(()=>{throw new Error('offline');},null);};
const LIB={pkgGD:mk('pkgGD/patched/Alternate_Merge.js'),pkgGDUP:mk('pkgGDUP/patched/Alternate_Merge.js'),pkgFQ:mk('pkgFQ/patched/Alternate_Merge.js'),pkgKF:mk('pkgKF/patched/Alternate_Merge.js')};
const run=(L,X,b)=>{const its=X.sb_items.filter(x=>x.seat===b.seat);if(!its.length)return {G:[],c:{res:[],uncured:0},skip:true};const rep=X.gate_replies[b.seat];const j=X.PB.judges.find(q=>q.seat===b.seat);const PT=L.gatePromptText2024(j.body);const ctx={R:L.ciRounds(PT),DL:L.drvLinks(PT),ask:PT.includes('CITATION CHECK')};
 const R=L.gateItems2024(b.seat,b.verdict_raw,b.fields,its,ctx);const G=R.items;const c=rep&&G.length?L.gateCure2024(b.seat,b.verdict_raw,b.fields,its,G,rep,ctx):{res:[],uncured:0};return {G,c};};
const desc=(g,r)=>g.gid+' '+g.kind+' ['+(g.live?'LIVE':'record-only')+']'+(r?' '+(r.cured?'CURED':'UNCURED'):' (no stored reply)');
const all={};
const cmp=(name,X,live)=>{const rows=[];for(const b of X.bodies){const a=run(LIB.pkgFQ,X,b),n=run(LIB.pkgKF,X,b);
 const sa=a.G.map((g,i)=>desc(g,a.c.res[i])),sn=n.G.map((g,i)=>desc(g,n.c.res[i]));const same=JSON.stringify(sa)===JSON.stringify(sn)&&a.c.uncured===n.c.uncured;
 const added=n.G.filter(g=>!a.G.some(h=>h.key===g.key));rows.push({seat:b.seat,same,added,a,n});
 console.log('   '+name+' '+b.seat+(a.skip?' (no send-back items; no gate)':'')+': pkgFQ ['+sa.join('; ')+'] counted '+a.c.uncured+(same?'  | pkgKF same':'  | pkgKF ['+sn.join('; ')+'] counted '+n.c.uncured));
 added.forEach(g=>console.log('      NEW on pkgKF: '+g.kind+' '+(g.live?'LIVE':'record-only')+' -- '+g.why.slice(0,400)+'\n        line: '+(g.lines[0]||'').slice(0,500)));}
 all[name]=rows;return rows;};
const X20=JSON.parse(rd('pkgGD/probe_33020/fixture_33020.json')),X98=JSON.parse(rd('pkgGD/fixture_32998.json')),X14=JSON.parse(rd('pkgKF/fixture_33014.json'));
// fixture check: 33014 on the library live then (pkgGD, e46017fd) raises no gate item for any seat, as the live Gate Record reports
{const L=LIB.pkgGD;const n=[...X14.bodies.map(b=>run(L,X14,b)),...X14.alt.bodies.map(b=>run(L,X14.alt,b))].reduce((s,r)=>s+r.G.length,0);T('33014 fixture: the live-then library (pkgGD) raises 0 gate items, as live did (gate skipped, all 4 seats empty)',n===0&&X14.gate_report.every(r=>!r.items.length)&&X14.alt.gate_report.every(r=>!r.items.length));}
const r20=cmp('33020',X20),r98=cmp('32998',X98),r98a=cmp('32998 alt',X98.alt),r14=cmp('33014',X14),r14a=cmp('33014 alt',X14.alt);
const ch=[].concat(r20,r98,r98a,r14,r14a).filter(r=>!r.same);
console.log('   items that change: '+ch.length+' seat(s): '+ch.map(r=>r.seat+' +'+r.added.map(g=>g.kind).join(',')).join('; '));
T('every change is an added K-F item, record-only, and no seat count changes',ch.every(r=>r.added.length&&r.added.every(g=>g.kind==='RULE K-F'&&!g.live)&&r.a.c.uncured===r.n.c.uncured));
const c20=r20.find(r=>r.seat==='chatgpt');
// 33020 chatgpt S14: both FAILS quotations (the stored one and S14's) are the challenger's own words in [DR3], so K-F passes the applied line
{const L=LIB.pkgKF;const PT=L.gatePromptText2024(X20.PB.judges.find(j=>j.seat==='chatgpt').body);const R=L.ciRounds(PT);const s14=X20.sb_items.find(x=>x.seat==='chatgpt'&&x.sid==='S14');
 T('33020 chatgpt: S14\'s FAILS ("Matthew sets what ...") and the stored FAILS ("In 1 Corinthians 7:5 ...") are both in [DR3] only; K-F passes S14\'s line; no item added',R.DR3.includes('Matthew sets what "came together" means by what follows')&&!R.CR3.includes('Matthew sets what')&&!R.CR4.includes('Matthew sets what')&&R.DR3.includes('In 1 Corinthians 7:5 the word "again" names')&&L.kfLines(s14.to,R).items.length===0&&c20.added.length===0&&c20.n.c.uncured===0);}
// gate path: S14 rewritten so its FAILS quotes a [CR3] sentence (not the ANSWER round); pkgKF raises a new record-only K-F gate item, pkgFQ none
{const X=JSON.parse(JSON.stringify(X20));const s=X.sb_items.find(x=>x.seat==='chatgpt'&&x.sid==='S14');s.to=s.to.replace(/FAILS: ".*"\s*$/,'FAILS: "the pregnancy was found before the marital union"');
 const b=X.bodies.find(b=>b.seat==='chatgpt');const a=run(LIB.pkgFQ,X,b),n=run(LIB.pkgKF,X,b);const k=n.G.filter(g=>g.kind==='RULE K-F');
 console.log('   gate path: pkgFQ ['+a.G.map(g=>g.kind).join(', ')+'], pkgKF ['+n.G.map(g=>g.kind+' '+(g.live?'LIVE':'record-only')+' -- '+g.why.slice(0,160)).join('; ')+']');
 T('gate path: a changed FORCED line whose FAILS is not in its ANSWER round raises a new K-F gate item, record-only (TRIAL); pkgFQ raised none',a.G.every(g=>g.kind!=='RULE K-F')&&k.length===1&&!k[0].live&&/FAILS quotation is not in \[DR3\]/.test(k[0].why));}
// unit: a FORCED line whose FAILS is in the ANSWER round raises no K-F; one whose FAILS is elsewhere does
{const L=LIB.pkgKF;const R={CR3:'the pregnancy was found before the marital union',DR3:'It fits the link. The word again names a couple resuming.'};
 const good='FORCED (Commitment 7): D1 vs C2 -- MEANS [CR3]: "the pregnancy was found before the marital union" -- ANSWER [DR3]: "It fits the link." -- FAILS: "The word again names a couple resuming."';
 const badl=good.replace('The word again names a couple resuming.','Matthew sets what came together means.');
 T('unit: FAILS found in the ANSWER round passes; FAILS from elsewhere raises K-F',L.kfLines(good,R).items.length===0&&L.kfLines(badl,R).items.length===1&&/FAILS quotation is not in \[DR3\]/.test(L.kfLines(badl,R).items[0].why));}
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
