// BB-6950 re-verify (Worker_A3): 6948's cases plus new ones, against Worker_E's cure_lib.js at 6d486c8. Usage: node mine2.cjs <p4 dir>
const fs=require('fs');const D=process.argv[2];
const L=new Function(fs.readFileSync(D+'/drv_block_0b3cbac.js','utf8')+'\n'+fs.readFileSync(D+'/cure_lib.js','utf8')+'\nreturn {cureVerdicts,cureReport,cureRounds};')();
const K1={rule:'K-G1',side:'DEFENDER',link:'D6 vs C2',line:'D6 vs C2 (Matthew 1:25): DEFENDER LINK BROKEN -- the same unanswered timing witnesses.'};
const K3={rule:'K-G3',side:'DEFENDER',link:null,line:null};
const KB={rule:'K-B',side:'DEFENDER',link:'D4 vs C2',line:'D4 vs C2 (Matthew 1:18): DEFENDER LINK BROKEN -- x.'};
const BR={DEFENDER:['D4 vs C2','D5 vs C2','D6 vs C2'],CHALLENGER:[]};
const RO={DR2:'\nThe defender never answers this: before they came together, she was found with child of the Holy Ghost.\n',CR1:'\nMy first round says the named father is the begetter of the seed.\n'};
const ok=t=>({ok:true,text:t});let bad=0;
const cases=[
 ['6948-1a K-G1 "I do not withdraw"',[K1],ok('K-G1 D6 vs C2: I do not withdraw the BROKEN grade; it stands.'),'UNCURED',RO],
 ['6948-1b K-G3 "I will not withdraw" naming all',[K3],ok('K-G3 DEFENDER: I will not withdraw D4 vs C2, D5 vs C2 or D6 vs C2.'),'UNCURED',RO],
 ['6948-2 K-B restated as UNDERDETERMINED',[KB],ok('D4 vs C2: D4 vs C2 (Matthew 1:18): UNDERDETERMINED -- [L1] "before they came together" and [L3] Matthew 1:25.'),'UNCURED',RO],
 ['6948-3 K-G1 fabricated quote',[K1],ok('K-G1 D6 vs C2: CONCEDED LINKS: 1. [DR2] pressed "words that no round ever said".'),'UNCURED',RO],
 ['control K-G1 plain withdraw',[K1],ok('K-G1 D6 vs C2: I withdraw the BROKEN grade on D6 vs C2.'),'CURED',RO],
 ['control K-B kept grade, two kinds',[KB],ok('D4 vs C2: D4 vs C2 (Matthew 1:18): DEFENDER LINK BROKEN -- [L1] "before they came together" and [L3] Matthew 1:25.'),'CURED',RO],
 ['NEW K-G1 real quote in its named pressing round',[K1],ok('K-G1 D6 vs C2: CONCEDED LINKS: 1. [DR2] pressed "she was found with child of the Holy Ghost".'),'CURED',RO],
 ['NEW K-G1 real quote but from [CR1], not a round pressing the defender',[K1],ok('K-G1 D6 vs C2: CONCEDED LINKS: 1. [CR1] said "the named father is the begetter".'),'UNCURED',RO],
 ['NEW K-G1 real quote, count still 0',[K1],ok('K-G1 D6 vs C2: CONCEDED LINKS: 0. [DR2] pressed "she was found with child of the Holy Ghost".'),'UNCURED',RO],
 ['NEW K-G3 withdraw two, refuse one, one sentence',[K3],ok('K-G3 DEFENDER: I withdraw D4 vs C2 and D5 vs C2 but not D6 vs C2.'),'UNCURED',RO],
 ['NEW K-G3 withdraw all three by name',[K3],ok('K-G3 DEFENDER: I withdraw the BROKEN grades on D4 vs C2, D5 vs C2 and D6 vs C2.'),'CURED',RO],
 ['NEW K-G3 corrected standing',[K3],ok('K-G3 DEFENDER: DEFENSE STANDING: PROP-DEPENDENT.'),'CURED',RO],
 ['NEW failed call',[KB,K1],{ok:false,why:'timeout'},'UNCURED',RO],
];
for(const [n,items,reply,exp,ro] of cases){for(const v of L.cureVerdicts(items,reply,BR,ro)){const okk=v.status===exp;if(!okk)bad++;console.log((okk?'AS EXPECTED':'**DIFFERS**').padEnd(12),'|',n,'->',v.status,'|',v.why||'');}}
const rep=L.cureReport('grok',L.cureVerdicts([KB],ok('D4 vs C2: D4 vs C2 (Matthew 1:18): DEFENDER LINK BROKEN -- [L1] "x y z" and [L3] Matthew 1:25.'),BR,RO))[0];
const one=(rep.match(/\]/g)||[]).length===1&&rep.endsWith(']');if(!one)bad++;console.log(one?'AS EXPECTED':'**DIFFERS**','| report line has one closing bracket:',rep);
console.log('differences',bad);
