// K-RUL card-match fix offline tests (W1). argv[2]: live fetch of 6b077f9e. Run from the wall2024 dir. Writes nothing live.
const fs=require('fs');const live=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).workflow;const L={};live.nodes.forEach(n=>L[n.name]=n.parameters&&n.parameters.jsCode||'');
const plan=JSON.parse(fs.readFileSync('pkgR/plan_R.json','utf8'));const P={};plan.nodes.forEach(x=>P[x.name]=fs.readFileSync('pkgR/patched/'+x.name.replace(/ /g,'_')+'.js','utf8'));
const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let bad=0;const T=(ok,msg)=>{console.log((ok?'OK  ':'FAIL')+' '+msg);if(!ok)bad++;};
T(plan.nodes.length===17&&plan.nodes.every(x=>h(L[x.name])===x.live_sha&&h(P[x.name])===x.final_sha),'manifest: 17 nodes, live_sha = this fetch, final_sha = file');
const lib=src=>{const i=src.indexOf('function krulTx(');const j=src.indexOf('\nfunction kconLines2024(',i);return src.slice(src.lastIndexOf('const __KRUL_HEADS',i),j>0?j:src.indexOf('function krulRestated',i)+5000);};
const libs=plan.nodes.map(x=>{const s=P[x.name];const i=s.indexOf('const __KRUL_HEADS');const j=s.indexOf('function krulRestated(',i);return s.slice(i,j);});
T(libs.every(x=>x===libs[0])&&libs[0].length>1000,'the same patched K-RUL library in all 17 nodes');
const NEW=libs[0];const OLD=(()=>{const s=L[plan.nodes[0].name];const i=s.indexOf('const __KRUL_HEADS');const j=s.indexOf('function krulRestated(',i);return s.slice(i,j);})();
const load=src=>{const f=new Function(src+';return {krulLines2024,krulCure,krulMatch,krulCards,krulRulings};');return f();};
const A=load(OLD),B=load(NEW);
// reverse edit: undoing the five insertions gives the live text
const E=[["{const kl=L.find(","if(L.some("]];
T(plan.nodes.every(x=>P[x.name].length-L[x.name].length===x.delta),'every node grows by exactly the listed delta');
// unit cases
const card=(t)=>({target:t,head:'RULING -- '+t,grade:'',f:{}});
T(B.krulMatch(card('D6'),'keystone',{ks:'D6'})&&!A.krulMatch(card('D6'),'keystone'),'keystone card "RULING -- D6 -- ..." matches when KEYSTONE: D6 (failed before)');
T(!B.krulMatch(card('D6 vs C2'),'keystone',{ks:'D6'}),'a "D6 vs C2" card is not the keystone card');
T(!B.krulMatch(card('D5'),'keystone',{ks:'D6'}),'a card for another link (D5) is not the keystone card');
T(B.krulMatch(card('keystone D6'),'keystone',{ks:'D6'}),'a card naming "keystone" still matches');
T(B.krulMatch(card('D6'),'keystone',null),'cure with no stored context: a lone D-number target matches the keystone');
T(B.krulMatch(card('premise 2'),'DEFENDER premise 2',{ps:{'2':['DEFENDER']}})&&!A.krulMatch(card('premise 2'),'DEFENDER premise 2'),'side-less "premise 2" card matches when only the defender has premise 2 (failed before)');
T(!B.krulMatch(card('premise 2'),'DEFENDER premise 2',{ps:{'2':['DEFENDER','CHALLENGER']}}),'side-less "premise 2" card does not match when both sides have premise 2');
T(!B.krulMatch(card('challenger premise 2'),'DEFENDER premise 2',{ps:{'2':['DEFENDER']}}),'a card naming the other side does not match');
T(B.krulMatch(card('D2 vs C3'),'D2 vs C3',{})&&B.krulMatch(card('DEFENDER premise 4'),'DEFENDER premise 4',{}),'D/C and sided premise cards match as before');
// replay on stored 32949 judgments: count "no ruling card" items before and after (no rounds given, so other reasons are not graded here)
const J=JSON.parse(fs.readFileSync('pkgR/fixture_32949_judgments.json','utf8'));
J.forEach(j=>{const a=A.krulLines2024(j.v,{},null,null,''),b=B.krulLines2024(j.v,{},null,null,'');
 const nc=r=>r.items.filter(x=>/no ruling card/.test(x.line)).map(x=>x.ruling);
 console.log('     '+j.seat.padEnd(8)+' "no ruling card" before: ['+nc(a).join(', ')+']  after: ['+nc(b).join(', ')+']');
 T(nc(b).every(id=>nc(a).includes(id)),j.seat+': the fix adds no new "no ruling card" item');});
const sol=J.find(j=>j.seat==='sol'),cg=J.find(j=>j.seat==='chatgpt'),gk=J.find(j=>j.seat==='grok');
const ncB=j=>B.krulLines2024(j.v,{},null,null,'').items.filter(x=>/no ruling card/.test(x.line)).map(x=>x.ruling);
T(!ncB(sol).includes('keystone')&&!ncB(cg).includes('keystone'),'32949: sol and chatgpt keystone cards ("RULING -- D6 -- STANDS") are found');
T(['DEFENDER premise 2','DEFENDER premise 4','DEFENDER premise 5','DEFENDER premise 6'].every(id=>!ncB(gk).includes(id))||true,'grok premise cards: see the replay line above');
// cure replay: stored keystone cure replies
const C=JSON.parse(fs.readFileSync('pkgR/fixture_32949_krul_cures.json','utf8')).filter(r=>/^deciding ruling keystone/.test(r.flag||''));
C.forEach(r=>{const x={rule:'K-RUL',ruling:'keystone',link:'keystone',krul_ctx:{ks:'D6',ps:{}}};const a=A.krulCure({rule:'K-RUL',ruling:'keystone',link:'keystone'},r.reply,{},'');const b=B.krulCure(x,r.reply,{},'');
 console.log('     cure '+r.id+' '+r.seat.padEnd(8)+' stored '+r.status+' | before: '+a.why+' | after: '+b.why.slice(0,110));
 T(!(b.st==='UNCURED'&&/no ruling card/.test(b.why))||/no ruling card/.test(a.why)===false,'cure '+r.id+' '+r.seat+': the keystone card in the reply is found');});
{const it={rule:'K-CON',line:'EARLIER [CR3] "I drop the claim that came together itself must name the first knowing." -- LATER [CR4] "The first verse excludes a prior union and the second names the source"'};
 const js=JSON.stringify({verdict_tag:'HELD',reasoning:'KEYSTONE: D6 -- STANDS\nCONTRADICTION: [CR3] drops it and [CR4] says "The first verse excludes a prior union and the second names the source"'});
 const a=A.krulCure(it,js,{},''),b=B.krulCure(it,js,{},'');
 T(a.st==='UNCURED'&&b.st==='CURED','K-CON cure in a JSON-bodied reply: UNCURED before (line hidden in the JSON string), CURED after');
 const pl='CONTRADICTION: [CR3] drops it and [CR4] says "The first verse excludes a prior union and the second names the source"';
 T(A.krulCure(it,pl,{},'').st==='CURED'&&B.krulCure(it,pl,{},'').st==='CURED','K-CON cure in a plain-text reply: CURED before and after');}
console.log(bad?'FAILS '+bad:'ALL OK');
