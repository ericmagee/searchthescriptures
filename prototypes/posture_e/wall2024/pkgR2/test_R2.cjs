// pkgR2 offline tests (W1). Run from pkgR2: node test_R2.cjs. Base merged_PWQA (= live 426d60c0). Writes nothing live.
const fs=require('fs');const sha=s=>require('crypto').createHash('sha256').update(s).digest('hex').slice(0,16);
const load=require('./lib.cjs');let bad=0;const T=(ok,m)=>{console.log((ok?'OK  ':'FAIL')+' '+m);if(!ok)bad++;};
const plan=JSON.parse(fs.readFileSync('plan_R2.json','utf8'));
T(plan.nodes.length===17&&plan.nodes.every(x=>sha(fs.readFileSync('../merged_PWQA/'+x.file,'utf8'))===x.base_sha&&sha(fs.readFileSync('patched/'+x.file,'utf8'))===x.final_sha),'17 nodes; base_sha = merged_PWQA, final_sha = patched');
const O=load('../merged_PWQA/Panel_Payloads.js'),N=load('patched/Panel_Payloads.js');
// ---- run 32980 chatgpt, with its own rounds (Panel Build body, execution 32980)
const PB=JSON.parse(fs.readFileSync('fixture_32980_panelbuild_item0.json','utf8'));const jd=PB.judges.find(j=>j.seat==='chatgpt');
const vr=JSON.parse(fs.readFileSync('fixture_32980_chatgpt.json','utf8')).verdict_raw;const v=JSON.parse(vr.slice(0,vr.lastIndexOf('}')+1));
const run=(L)=>{const PT=L.drvPromptText(jd.body);return L.krulLines2024(v.reasoning,L.ciRounds(PT),{DEFENDER:v.counted_premises_defender,CHALLENGER:v.counted_premises_challenger},L.krulAcc(jd.body),PT).items;};
const io=run(O),inew=run(N);
T(io.length===7,'32980 chatgpt, base: the 7 live items reproduce ('+io.map(x=>x.link).join(', ')+')');
T(inew.length===0,'32980 chatgpt, pkgR2: 0 items'+(inew.length?' LEFT: '+inew.map(x=>x.link+' '+x.line).join(' | '):''));
// every ruling still has its card, read
{const X=N.krulText(v.reasoning);const cards=N.krulCards(X.T);['D1 vs C2','D2 vs C2','D3 vs C2','D6 vs C2'].forEach(id=>T(cards.some(c=>N.krulMatch(c,id,null)&&/D1, D2, D3 and D6 vs C2/.test(c.head)),'32980: '+id+' matches the combined card "RULING -- D1, D2, D3 and D6 vs C2"'));
 T(!cards.some(c=>N.krulMatch(c,'D4 vs C2',null)),'32980: D4 vs C2 matches no card (not listed)');T(!cards.some(c=>/D1, D2/.test(c.head)&&N.krulMatch(c,'D1 vs C3',null)),'32980: D1 vs C3 does not match the C2 card');}
// ---- stored runs 32949, 32973, 32980 (single): items before and after, rounds not available here, so the quote record check fails alike
const F=JSON.parse(fs.readFileSync('../pkgANS/fixture_judgments_3runs.json','utf8'));
for(const r of F){const vv=(()=>{const s=r.verdict_raw;try{return JSON.parse(s.slice(0,s.lastIndexOf('}')+1));}catch(e){return null;}})();const WT=vv&&vv.reasoning?vv.reasoning:r.verdict_raw;const cp=vv?{DEFENDER:vv.counted_premises_defender,CHALLENGER:vv.counted_premises_challenger}:null;
 const a=O.krulLines2024(WT,null,cp,null,'').items,b=N.krulLines2024(WT,null,cp,null,'').items;const k=x=>x.link+' :: '+x.line;
 const gone=a.filter(x=>!b.some(y=>k(y)===k(x))),added=b.filter(x=>!a.some(y=>k(y)===k(x)));
 console.log('     '+r.debate_id.slice(0,8)+' '+r.judge_seat+': K-RUL items '+a.length+' -> '+b.length);gone.forEach(x=>console.log('        changed: '+k(x).slice(0,200)));added.forEach(x=>console.log('        now:     '+k(x).slice(0,200)));
 T(b.length<=a.length,r.debate_id.slice(0,8)+' '+r.judge_seat+': no new K-RUL item');}
// ---- units
const Q=N.krulQs;
const U=[["'I drop \"only\".' ([CR3]); '\"son of Joseph\" is only supposed. KEPT' ([CR4]).",['I drop "only".','"son of Joseph" is only supposed. KEPT']],
 ["'a husband who knew he was the cause would have no ground to put her away.' ([CR3]).",['a husband who knew he was the cause would have no ground to put her away.']],
 ["\"before they came together\" ([CR1]) and 'Joseph's house' ([CR2])",["Joseph's house","before they came together"]],
 ["‘thy cousin Elisabeth’ ([DR3])",['thy cousin Elisabeth']],
 ["the defender's answer, [CR3]",[]],
 ["\"he hath humbled his neighbour's wife\" ([CR3])",["he hath humbled his neighbour's wife"]]];
U.forEach(([s,e])=>{const g=Q(s);T(JSON.stringify(g.slice().sort())===JSON.stringify(e.slice().sort()),'krulQs: '+s.slice(0,70)+' -> '+JSON.stringify(g));});
const C=t=>({target:t});
T(N.krulMatch(C('D1 and D2 vs C2'),'D2 vs C2',null),'"D1 and D2 vs C2" matches D2 vs C2');
T(N.krulMatch(C('D1, D2 & D3 vs C4'),'D3 vs C4',null),'"D1, D2 & D3 vs C4" matches D3 vs C4');
T(!N.krulMatch(C('D1, D2 vs C2'),'D2 vs C3',null),'"D1, D2 vs C2" does not match D2 vs C3');
T(!N.krulMatch(C('D11 and D2 vs C2'),'D1 vs C2',null),'"D11 and D2 vs C2" does not match D1 vs C2');
T(N.krulMatch(C('D2 vs C3'),'D2 vs C3',null),'a single card matches as before');
{const card={target:'D1 vs C2',grade:'CHALLENGER LINK BROKEN',f:{CLAIM:'x',['NAMED BY']:"'was minded to put her away privily' ([CR3])",RULE:"Commitment 5 -- 'I will count a proven press.'",APPLIED:'y'}};
 const src='... was minded to put her away privily ...';T(N.krulCheckCard(card,src,null)===null,'a card quoted in single quotes passes, NAMED BY and RULE');T(/quotes nothing|RULE line/.test(String(O.krulCheckCard(card,src,null))),'the same card failed on the base ('+O.krulCheckCard(card,src,null)+')');
 card.f['NAMED BY']="'words the record never had' ([CR3])";T(/does not stand in the record/.test(String(N.krulCheckCard(card,src,null))),'a single-quoted NAMED BY not in the record still fails');}
console.log(bad?'FAILED '+bad:'ALL OK');
