// pkgVC test on stored 32980 data: panel prompts (pkgR2 fixture) + panel judgments (debate_judgments). Run from wall2024/.
const fs=require('fs');const LIB=require('./lib.cjs');const N=['vcBuild2024','vcRev2024','vcParse2024','vcCaught2024','ciRounds','drvPromptText','kwLines421','kvNorm'];
let ok=0,bad=0;const t=(c,m)=>{if(c){ok++;console.log('OK  ',m);}else{bad++;console.log('FAIL',m);}};
const PB=JSON.parse(fs.readFileSync('pkgR2/fixture_32980_panelbuild_item0.json','utf8')).judges;
const JG=JSON.parse(fs.readFileSync('pkgVC/fixture_32980_judgments.json','utf8'));
const bodyOf=seat=>(PB.find(j=>j.seat===seat)||PB.find(j=>j.seat==='chatgpt')).body; // sol sat in chatgpt's slot
const WTof=raw=>{const a=raw.indexOf('{'),b=raw.lastIndexOf('}');const v=JSON.parse(raw.slice(a,b+1));return String(v.reasoning!=null?v.reasoning:v.reason||'');};
function run(file){const L=LIB(file,N);const W=JG.map(r=>{const P=L.drvPromptText(bodyOf(r.seat));const w={seat:r.seat,WT:WTof(r.verdict_raw),R:L.ciRounds(P)};if(L.vcRev2024)w.RV=L.vcRev2024(P);return w;});
 return {L,W,V:L.vcBuild2024(W,R=>L.kwLines421('',R))};}
const A=run('pkgKCON/patched/Panel_Payloads.js'),Bn=run('pkgVC/patched/Panel_Payloads.js');
const is125=v=>/matthew 1 25 denies that knowing/.test(require('./lib.cjs')('pkgKCON/patched/Panel_Payloads.js',['kvNorm']).kvNorm(v.q2));
console.log('base VC:',A.V.map(v=>v.id+' :: '+v.q2.slice(0,60)));console.log('new  VC:',Bn.V.map(v=>v.id+' :: '+v.q2.slice(0,60)));
t(A.V.some(is125),'base reproduces the 32980 VC on "Matthew 1:25 denies that knowing up to the birth."');
t(Bn.W.every(w=>w.RV.length===1),'each panel prompt yields the one reversal-hint pair: '+Bn.W.map(w=>w.seat+'='+w.RV.length).join(', '));
t(!Bn.V.some(is125),'new: that pair is no longer a VC, so the single judge gets no item for it');
t(Bn.V.length===A.V.length-A.V.filter(is125).length&&Bn.V.every(v=>A.V.some(a=>a.id===v.id)),'new: every other VC is unchanged ('+Bn.V.length+' of '+A.V.length+')');
// unit: a pair not in the hint still verifies; a hint with no matching line changes nothing
const L=Bn.L;t(L.vcRev2024('x [CLOSE-ROUND REVERSAL CHECK -- ... (1) [CR4] "A b c d." -- earlier: "E f g h.". Where ... DISREGARDED as footing.]').length===1,'vcRev2024 reads a note');
t(L.vcRev2024('no note here').length===0,'vcRev2024: no note, no pair');
const W2=Bn.W.map(w=>({...w,RV:[]}));t(L.vcBuild2024(W2,R=>L.kwLines421('',R)).length===A.V.length,'with RV empty the new code gives the base VC set');
const W3=Bn.W.map(w=>({...w,RV:[['some other close sentence','some other grant']]}));t(L.vcBuild2024(W3,R=>L.kwLines421('',R)).some(is125),'a hint pair that differs from the judge line leaves the VC in place');
console.log(ok,'OK',bad,'FAIL');process.exit(bad?1:0);
