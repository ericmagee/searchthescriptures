// BB-6953 re-verify (Worker_A3): 6948 and 6951 cases as prose, the same in the fixed form (BB-6952), and new edges, against Worker_E's cure_lib.js at 9106eda. Usage: node mine3.cjs <p4 dir>
const fs=require('fs');const D=process.argv[2];
const L=new Function(fs.readFileSync(D+'/drv_block_0b3cbac.js','utf8')+'\n'+fs.readFileSync(D+'/cure_lib.js','utf8')+'\nreturn {cureVerdicts,cureReport,cureProse,cureRounds};')();
const K1={rule:'K-G1',side:'DEFENDER',link:'D6 vs C2',line:'D6 vs C2 (Matthew 1:25): DEFENDER LINK BROKEN -- the same unanswered timing witnesses.'};
const K3={rule:'K-G3',side:'DEFENDER',link:null,line:null};
const KB={rule:'K-B',side:'DEFENDER',link:'D4 vs C2',line:'D4 vs C2 (Matthew 1:18): DEFENDER LINK BROKEN -- x.'};
const BR={DEFENDER:['D4 vs C2','D5 vs C2','D6 vs C2'],CHALLENGER:[]};
const RO={DR2:'\nThe defender never answers this: before they came together, she was found with child of the Holy Ghost.\n',CR1:'\nMy first round says the named father is the begetter of the seed.\n'};
const ok=t=>({ok:true,text:t});let bad=0;
const Q='"she was found with child of the Holy Ghost"';
const cases=[
 // prose (6948, 6951): all UNCURED
 ['prose 6948-1a "I do not withdraw"',[K1],ok('K-G1 D6 vs C2: I do not withdraw the BROKEN grade; it stands.'),'UNCURED'],
 ['prose 6948-1b "I will not withdraw" naming all',[K3],ok('K-G3 DEFENDER: I will not withdraw D4 vs C2, D5 vs C2 or D6 vs C2.'),'UNCURED'],
 ['prose 6948-3 fabricated quote',[K1],ok('K-G1 D6 vs C2: CONCEDED LINKS: 1. [DR2] pressed "words that no round ever said".'),'UNCURED'],
 ['prose 6950 plain withdraw',[K1],ok('K-G1 D6 vs C2: I withdraw the BROKEN grade on D6 vs C2.'),'UNCURED'],
 ['prose 6950 real quote',[K1],ok('K-G1 D6 vs C2: CONCEDED LINKS: 1. [DR2] pressed '+Q+'.'),'UNCURED'],
 ['prose 6951-1 "but not D6"',[K3],ok('K-G3 DEFENDER: I withdraw D4 vs C2 and D5 vs C2 but not D6 vs C2.'),'UNCURED'],
 ['prose 6950 withdraw all three',[K3],ok('K-G3 DEFENDER: I withdraw the BROKEN grades on D4 vs C2, D5 vs C2 and D6 vs C2.'),'UNCURED'],
 ['prose 6950 standing',[K3],ok('K-G3 DEFENDER: DEFENSE STANDING: PROP-DEPENDENT.'),'UNCURED'],
 // fixed form
 ['form K-G1 WITHDRAWN',[K1],ok('WITHDRAWN: D6 vs C2'),'CURED'],
 ['form K-G1 count+PRESSED real',[K1],ok('CORRECTED COUNT: DEFENDER 1\nPRESSED: D6 vs C2 | [DR2] | '+Q),'CURED'],
 ['form K-G1 count+PRESSED fabricated',[K1],ok('CORRECTED COUNT: DEFENDER 1\nPRESSED: D6 vs C2 | [DR2] | "words that no round ever said"'),'UNCURED'],
 ['form K-G1 PRESSED from [CR1]',[K1],ok('CORRECTED COUNT: DEFENDER 1\nPRESSED: D6 vs C2 | [CR1] | "the named father is the begetter"'),'UNCURED'],
 ['form K-G1 count 0',[K1],ok('CORRECTED COUNT: DEFENDER 0\nPRESSED: D6 vs C2 | [DR2] | '+Q),'UNCURED'],
 ['form K-G1 PRESSED for another link',[K1],ok('CORRECTED COUNT: DEFENDER 1\nPRESSED: D5 vs C2 | [DR2] | '+Q),'UNCURED'],
 ['form K-G1 count for the wrong side',[K1],ok('CORRECTED COUNT: CHALLENGER 1\nPRESSED: D6 vs C2 | [DR2] | '+Q),'UNCURED'],
 ['form K-G3 two of three WITHDRAWN',[K3],ok('WITHDRAWN: D4 vs C2\nWITHDRAWN: D5 vs C2'),'UNCURED'],
 ['form K-G3 all three WITHDRAWN',[K3],ok('WITHDRAWN: D4 vs C2\nWITHDRAWN: D5 vs C2\nWITHDRAWN: D6 vs C2'),'CURED'],
 ['form K-G3 standing',[K3],ok('CORRECTED STANDING: DEFENDER PROP-DEPENDENT'),'CURED'],
 ['form K-G3 standing for the other side',[K3],ok('CORRECTED STANDING: CHALLENGER COLLAPSED'),'UNCURED'],
 ['form K-B restated UNDERDETERMINED',[KB],ok('RESTATED: D4 vs C2 (Matthew 1:18): UNDERDETERMINED -- [L1] "before they came together" and [L3] Matthew 1:25.'),'UNCURED'],
 ['form K-B restated kept grade, two kinds',[KB],ok('RESTATED: D4 vs C2 (Matthew 1:18): DEFENDER LINK BROKEN -- [L1] "before they came together" and [L3] Matthew 1:25.'),'CURED'],
 ['form K-B restated, one kind',[KB],ok('RESTATED: D4 vs C2 (Matthew 1:18): DEFENDER LINK BROKEN -- [L1] "before they came together" and [L1] "found with child".'),'UNCURED'],
 ['form K-B restated, layers named but negated',[KB],ok('RESTATED: D4 vs C2 (Matthew 1:18): DEFENDER LINK BROKEN -- no [L1] quotation and no [L3] reference is given.'),'UNCURED'],
 // edges
 ['edge prose refusal beside a WITHDRAWN line (6952: prose not read)',[K1],ok('I do not withdraw.\nWITHDRAWN: D6 vs C2'),'CURED'],
 ['edge WITHDRAWN: not D6 vs C2',[K1],ok('WITHDRAWN: not D6 vs C2'),'UNCURED'],
 ['edge WITHDRAWN: D6 vs C2 -- no',[K1],ok('WITHDRAWN: D6 vs C2 -- no, it stands'),'UNCURED'],
 ['edge WITHDRAWN: none',[K3],ok('WITHDRAWN: none'),'UNCURED'],
 ['edge lowercase keyword is prose',[K1],ok('withdrawn: D6 vs C2'),'UNCURED'],
 ['edge keyword inside a sentence is prose',[K1],ok('I have not WITHDRAWN: D6 vs C2'),'UNCURED'],
 ['edge bulleted WITHDRAWN line',[K1],ok('- WITHDRAWN: D6 vs C2'),'UNCURED'],
 ['edge trailing period',[K1],ok('WITHDRAWN: D6 vs C2.'),'UNCURED'],
 ['edge JSON reply, fixed line in reasoning',[K1],ok('{"reasoning":"WITHDRAWN: D6 vs C2","verdict":"x"}'),'CURED'],
 ['edge JSON reply, refusal in reasoning',[K1],ok('{"reasoning":"I do not withdraw D6 vs C2"}'),'UNCURED'],
 ['edge PRESSED with 2-word quote',[K1],ok('CORRECTED COUNT: DEFENDER 1\nPRESSED: D6 vs C2 | [DR2] | "Holy Ghost"'),'UNCURED'],
 ['edge two differing standings',[K3],ok('CORRECTED STANDING: DEFENDER PROP-DEPENDENT\nCORRECTED STANDING: DEFENDER COLLAPSED'),'UNCURED'],
 ['edge failed call',[KB,K1,K3],{ok:false,why:'timeout'},'UNCURED'],
];
for(const [n,items,reply,exp] of cases){for(const v of L.cureVerdicts(items,reply,BR,RO)){const okk=v.status===exp;if(!okk)bad++;console.log((okk?'AS EXPECTED':'**DIFFERS**').padEnd(12),'|',n,'->',v.status,'|',v.why||'');}}
const rep=L.cureReport('grok',L.cureVerdicts([KB],ok('RESTATED: D4 vs C2 (Matthew 1:18): DEFENDER LINK BROKEN -- [L1] "x y z" and [L3] Matthew 1:25.'),BR,RO))[0];
const one=s=>(s.match(/\]/g)||[]).length===1&&s.endsWith(']');if(!one(rep))bad++;console.log(one(rep)?'AS EXPECTED':'**DIFFERS**','| report line, one closing bracket:',rep);
const pr=L.cureProse('grok',ok('I do not withdraw [L1] anything.\nWITHDRAWN: D6 vs C2'));const pok=pr.length===1&&one(pr[0])&&!pr[0].includes('WITHDRAWN:');if(!pok)bad++;console.log(pok?'AS EXPECTED':'**DIFFERS**','| prose line once, fixed line not in it:',pr[0]);
console.log('differences',bad);
