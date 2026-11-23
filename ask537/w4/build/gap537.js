// ASK 537 open question 1 (W4, for W3 Wall 10649): do the close-round checks (C4P.press: ruling 377 DISREGARDED; C4P.of / C4P.ofD: NEW PRESS / NEW IN CLOSE, NOT COUNTED)
// fire on GAP lines? C4P and REFP are taken from the live Panel Build source (target_engine_531.json; Panel Build is not changed by 531). Rounds: run 41418 Final Output (stored).
// rev 2 (W2 10655): cases C8, C9, D6, D7 use the no-quote form "GAP: premise <n> [<round>] -- <verse> -- UNANSWERED".
// Each case appends a block to the stored close round and prints only what the block adds over the stored round. Usage: node gap537.js <engine.json> <part_ac.json>
const fs=require('fs');const [,,ENG,AC]=process.argv;const W=JSON.parse(fs.readFileSync(ENG,'utf8'));const node=n=>W.nodes.find(y=>y.name===n);
const PB=node('Panel Build').parameters.jsCode;const LIBT=node('Shared Library').parameters.jsCode;
const a=PB.indexOf('const REFP=(T=>{'),b=PB.indexOf('const C4P=(()=>{'),c=PB.indexOf('return {refs,fresh,of,note,ofD,noteD,renum,noteR,declared,dlinks,cblocks,press,noteP,noteL,stored};})();',b);
if(a<0||b<0||c<0)throw new Error('anchors');const SRC=PB.slice(a,b)+PB.slice(b,c)+'return {refs,fresh,of,note,ofD,noteD,renum,noteR,declared,dlinks,cblocks,press,noteP,noteL,stored};})();';
const $=n=>{if(n==='Shared Library')return {params:{jsCode:LIBT}};throw new Error('no '+n);};
const C4P=new Function('$',SRC+'\nreturn C4P;')($);
const J=JSON.parse(fs.readFileSync(AC,'utf8'));const R=(J.data&&J.data.resultData||J).runData;const F0=R['Final Output'].slice(-1)[0].data.main[0][0].json;
const QD='"The till-row bounds, it does not remove, the union."';            // challenger's premise 1 (list closing [DR2]) quoting the defender
const QC='"Verse 35 opens with \'The Holy Ghost shall come upon thee\' and so supplies the how of that conceiving."'; // defender's premise 1 (list closing [CR3]) quoting the challenger
const CASES=[
 ['C','C1 plan form','GAP: premise 1 '+QD+' -- Matthew 1:18 -- UNANSWERED.'],
 ['C','C2 names the link','GAP: premise 1 (LINK 5, D5) '+QD+' -- Matthew 1:18 -- UNANSWERED.'],
 ['C','C3 "the defender ... left it unanswered"','GAP: premise 1, the defender\'s words '+QD+' -- Matthew 1:18 -- the defender left it unanswered.'],
 ['C','C4 under a heading, two lines','## GAPS LEFT OPEN\nGAP: premise 1 '+QD+' -- Matthew 1:18 -- UNANSWERED.\nGAP: premise 1 '+QD+' -- Matthew 1:20 -- UNANSWERED.'],
 ['C','C5 GAPS: NONE','GAPS: NONE'],
 ['C','C7 names D5 and quotes words with a grade pattern (synthetic quote)','GAP: premise 1 (D5) "the union does not stand before the taking" -- Matthew 1:18 -- UNANSWERED.'],
 ['C','C6 CONTROL verse no earlier challenger round names','GAP: premise 1 '+QD+' -- Obadiah 1:21 -- UNANSWERED.'],
 ['D','D1 plan form','GAP: premise 1 '+QC+' -- Luke 1:35 -- UNANSWERED.'],
 ['D','D2 names the link','GAP: premise 1 (C2) '+QC+' -- Acts 1:8 -- UNANSWERED.'],
 ['D','D3 "the challenger ... left it unanswered"','GAP: premise 1, the challenger\'s words '+QC+' -- Matthew 17:5 -- the challenger left it unanswered.'],
 ['D','D4 under a heading','## GAPS LEFT OPEN\nGAP: premise 1 '+QC+' -- Luke 1:35 -- UNANSWERED.'],
 ['C','C8 W2 10655 form, no quote','GAP: premise 1 [DR2] -- Matthew 1:18 -- UNANSWERED.'],
 ['C','C9 W2 form, two lines under a heading','## GAPS LEFT OPEN\nGAP: premise 1 [DR2] -- Matthew 1:18 -- UNANSWERED.\nGAP: premise 1 [DR2] -- Matthew 1:20 -- UNANSWERED.'],
 ['D','D6 W2 10655 form, no quote','GAP: premise 1 [CR3] -- Luke 1:35 -- UNANSWERED.'],
 ['D','D7 W2 form, verse still unanswered against the defender','GAP: premise 1 [CR3] -- Matthew 1:23 -- UNANSWERED.'],
 ['D','D5 CONTROL verse no earlier round names','GAP: premise 1 '+QC+' -- Obadiah 1:21 -- UNANSWERED.']];
const k=x=>JSON.stringify(x);
const base={C:{p:C4P.press(F0,'C').map(x=>k(x)),n:C4P.of(F0)},D:{p:C4P.press(F0,'D').map(x=>k(x)),n:C4P.ofD(F0)}};
console.log('stored 41418: [DR4] press '+base.C.p.length+', [DR4] new refs '+k(base.C.n)+'; [CR4] press '+base.D.p.length+', [CR4] new refs '+k(base.D.n));
for(const [sd,name,blk] of CASES){const F={...F0};const f=sd==='C'?'dr4':'cr4';F[f]=String(F0[f])+'\n\n'+blk+'\n';
 const p=C4P.press(F,sd).filter(x=>!base[sd].p.includes(k(x)));const n=(sd==='C'?C4P.of(F):C4P.ofD(F)).filter(x=>!base[sd].n.includes(x));
 console.log(name+' ['+(sd==='C'?'DR4':'CR4')+']: DISREGARDED (ruling 377) added '+p.length+(p.length?' '+k(p):'')+' | NEW PRESS / NEW IN CLOSE added '+n.length+(n.length?' '+k(n):''));}
