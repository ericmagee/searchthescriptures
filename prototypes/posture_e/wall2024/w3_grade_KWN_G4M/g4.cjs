const {mk,K}=require('./g2.cjs');const live=mk('/mnt/project-files/wall2024/fetchback_live_s119.json','Gate Record'),cand=mk('/mnt/project-files/wall2024/parent_s119_F2.json','Gate Record');
let body=null;const walk=(v,d)=>{if(body||d>6||!v||typeof v!=='object')return;if(Array.isArray(v)){v.forEach(x=>walk(x,d+1));return;}if(v.seat==='chatgpt'&&v.body&&v.body.messages){body=v.body;return;}for(const k in v)walk(v[k],d+1);};walk(K['Panel Judges Prep'],0);
const T1='D4 vs C1 (Matthew 1:20): DEFENDER LINK BROKEN (Commitment 5) -- The proven naming press was not met: [DR2] "four verses after 1:16 the angel greets the husband of 1:16 as David\'s son and gives him the child\'s naming." -- GROUND: [L1] Matthew 1:20 "Joseph, thou son of David" | [L3] Matthew 1:21 "thou shalt call his name JESUS"; the answer addresses Joseph\'s greeting but not the naming.';
const items={
 '1 terra stored line (meaning break)':{key:'K-G4|X|DEFENDER|D4 VS C1',lines:[T1]},
 '2 line says left unanswered':{key:'K-G4|X|DEFENDER|D4 VS C1',lines:[T1.replace('the answer addresses Joseph\'s greeting but not the naming','the witness was left unanswered')]},
 '3 challenger side':{key:'K-G4|X|CHALLENGER|D4 VS C1',lines:['D4 vs C1 (Hebrews 7:14): CHALLENGER LINK BROKEN -- the challenger\'s answer in [DR3] does not meet the point. GROUND: [L1] Hebrews 7:14 "evident that our Lord sprang out of Juda" | [L3] Hebrews 7:5 "out of the loins of Abraham"']},
 '3b no link in key':{key:'K-G4|X|DEFENDER|',lines:[T1]},
};
for(const n in items){const o=[];for(const h of [live,cand])h(ev=>{const R=ev('ciRounds')(ev('gatePromptText2024')(body));o.push(ev('g4GateNote2024')(items[n],{R}));});console.log('##',n,'\n live:',JSON.stringify(o[0]).slice(0,330),'\n F2  :',JSON.stringify(o[1]));}
// the note followed to the letter: FAILS written as a reason
cand(ev=>{const R=ev('ciRounds')(ev('gatePromptText2024')(body));const kf=ev('kfLines');
 const mk2=f=>'FORCED: D4 vs C1 -- MEANS [DR2]: "four verses after 1:16 the angel greets the husband of 1:16 as David\'s son and gives him the child\'s naming." -- ANSWER [CR3]: "It is Joseph\'s address, and the same verse states the source of the child." -- FAILS: "'+f+'"';
 for(const [n,f] of [['FAILS as the note words it (a reason)','the answer speaks of the address and cannot take the naming'],['FAILS as words of the answer','the same verse states the source of the child']])console.log('##',n,'| K-F items:',JSON.stringify(kf(mk2(f),R).items.map(z=>z.why)));});
