// pkgFQ test. Run from wall2024/: node pkgFQ/test_FQ.cjs. Each library raises its own gate items and cures them with the stored replies.
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n);}};
const plan=JSON.parse(rd('pkgFQ/plan_FQ.json'));
T('6 nodes: base (pkgGL) and final shas match the plan',plan.nodes.length===6&&plan.nodes.every(n=>sha(rd('pkgGL/patched/'+n.file))===n.base_sha&&sha(rd('pkgFQ/patched/'+n.file))===n.final_sha));
T('every node parses',plan.nodes.every(n=>{try{new Function('$','$input',rd('pkgFQ/patched/'+n.file));return true;}catch(e){console.log(e.message);return false;}}));
const mk=f=>{const AM=rd(f);return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {gateCure2024,gateItems2024,ciRounds,gatePromptText2024,drvLinks,sbApply2024,__kfHas};')(()=>{throw new Error('offline');},null);};
const O=mk('pkgGL/patched/Alternate_Merge.js'),N=mk('pkgFQ/patched/Alternate_Merge.js');
const run=(L,X,b)=>{const its=X.sb_items.filter(x=>x.seat===b.seat);const rep=X.gate_replies[b.seat];const j=X.PB.judges.find(q=>q.seat===b.seat);const PT=L.gatePromptText2024(j.body);const ctx={R:L.ciRounds(PT),DL:L.drvLinks(PT),ask:PT.includes('CITATION CHECK')};
 const R=L.gateItems2024(b.seat,b.verdict_raw,b.fields,its,ctx);const G=R.items;const c=rep&&G.length?L.gateCure2024(b.seat,b.verdict_raw,b.fields,its,G,rep,ctx):{res:[],uncured:0};return {G,c,text:R.R1&&R.R1.text};};
const sig=r=>r.G.map(g=>g.gid+' '+g.kind+' '+(g.key||''))+' || '+r.c.res.map(x=>x.gid+(x.cured?' CURED':' UNCURED')+' '+x.why)+' || '+r.c.uncured;
const cmp=(name,X)=>{const out={};for(const b of X.bodies){const a=run(O,X,b),n=run(N,X,b);out[b.seat]={a,n,same:sig(a)===sig(n)};console.log('   '+name+' '+b.seat+': pkgGL items ['+a.G.map(g=>g.gid+' '+g.kind).join(', ')+'] counted '+a.c.uncured+'; pkgFQ items ['+n.G.map(g=>g.gid+' '+g.kind).join(', ')+'] counted '+n.c.uncured);}return out;};
const X3=JSON.parse(rd('pkgGD/probe_33020/fixture_33020.json'));const r3=cmp('33020',X3);
const s14=X3.sb_items.find(x=>x.seat==='chatgpt'&&x.sid==='S14');
T('33020 chatgpt: S14 FORCED (Commitment 7) line is written with its closing FAILS quote and KF_LINE reads it on the challenger side',N.__kfHas(r3.chatgpt.n.text,'D1 vs C2','CHALLENGER')&&!O.__kfHas(r3.chatgpt.a.text,'D1 vs C2','CHALLENGER')&&r3.chatgpt.n.text.includes(s14.to.trim()));
T('33020 chatgpt: the false K-G4 on D1 vs C2 is gone; counted 1 -> 0 (live counted 0)',r3.chatgpt.a.c.uncured===1&&r3.chatgpt.n.c.uncured===0&&r3.chatgpt.n.G.length===0);
T('33020 gemini and grok: items and decisions unchanged (grok G2 stays UNCURED by pkgGL)',r3.gemini.same&&r3.grok.same&&r3.grok.n.c.uncured===1);
const FX=JSON.parse(rd('pkgGD/fixture_32998.json'));const r8=Object.assign(cmp('32998',FX),cmp('32998alt',FX.alt));
T('32998: every seat unchanged',Object.values(r8).every(x=>x.same));
const L=N;const t=s=>{const X=JSON.parse(JSON.stringify(s));return X;};
// unit: unwrap rule
const U=s=>s.replace(/^["“]+([\s\S]*?)["”]+$/,(m,c)=>c).trim();
T('unwrap: a fully quoted line loses its wrapping quotes; a FORCED line ending in a quote keeps it',U('"D1 vs C2: LINK STANDS"')==='D1 vs C2: LINK STANDS'&&U('FORCED: D1 vs C2 -- FAILS: "x."')==='FORCED: D1 vs C2 -- FAILS: "x."');
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
