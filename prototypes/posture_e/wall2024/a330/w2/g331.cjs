const L=require('./lib.cjs');const fs=require('fs');const N=L.load('t331.json');
const oa=fs.readFileSync('/home/claude/searchthescriptures/prototypes/posture_e/wall2024/a330b/oa331.js','utf8').trim();
const S=L.src(N,'Shared Library'===0?'':'Gate Record');
const nodes=Object.keys(S.S.MAP).filter(k=>S.rb(S.S.MAP[k].p).includes('function __oa331'));console.log('nodes holding oa331.js:',nodes.length,nodes.join(', '));
console.log('verbatim in each:',nodes.every(k=>S.rb(S.S.MAP[k].p).includes(oa)));
const N0=L.load('t330.json');const S0=L.src(N0,'Gate Record');const diffN=Object.keys(S.S.MAP).filter(k=>S.rb(S.S.MAP[k].p)!==S0.rb(S0.S.MAP[k].p));console.log('331 over 330 changes nodes:',diffN.join(', '));
let PASS;const $=()=>({isExecuted:false,first:()=>({json:{}}),all:()=>[]});
const M=new Function('$','PASS',oa+'\nreturn {__oa331,__oaSkip};')($,undefined);
const T=[
['judge MEETS, CHANGE TO MEETS, no count field','E-PREM D2 vs C3 -- MEETS -- the row gives it','MEETS -- the row gives it, read again',true],
['grade differs','E-PREM D2 vs C3 -- MEETS -- x','MISSES -- x',false],
['CONCEDED LINKS 0 vs 1 (hydrogen 40161 shape)','CONCEDED LINKS: 0 -- none','CONCEDED LINKS: 1 -- Premise 2: UNEXHIBITED',false],
['DEFENSE STANDING differs, grade equal','DEFENSE STANDING: SELF-SUPPORTED -- n=3 w=0','DEFENSE STANDING: PROP-DEPENDENT -- n=3 w=0',false],
['L differs, grade equal','CHALLENGE STANDING: PROP-DEPENDENT -- L=4 c=0','CHALLENGE STANDING: PROP-DEPENDENT -- L=3 c=0',false],
['unreadable CHANGE TO','E-PREM -- MEETS -- x','the line is right as read',false],
['E-GATE MISSES vs MISSES (41074 shape)','D3 vs C2 -- MISSES -- the verse does not give it','MISSES -- the verse gives no such word',true],
['quoted grade word inside text ignored','D1 -- HELD -- "it STANDS" says the side','HELD -- the side says "BROKEN"',true],
];
let f=0;for(const [nm,a,b,exp] of T){const r=M.__oa331(a,b);const okk=r.ok===exp;if(!okk)f++;console.log((okk?'OK   ':'FAIL ')+nm+' -> '+(r.ok?'not counted':'counted')+' | '+r.why);}
// __oaSkip gating
const it={line:'E-PREM D2 vs C3 -- MEETS -- x'};
const chk=(nm,a,exp)=>{const r=M.__oaSkip(it,a,{},'sol');const okk=r===exp;if(!okk)f++;console.log((okk?'OK   ':'FAIL ')+'skip: '+nm+' -> '+(r?'not counted':'counted'));};
chk('KEEP answer',{ans:'KEEP',to:''},false);chk('no answer',null,false);chk('CHANGE TO NOT HELD',{ans:'CHANGE',to:'NOT HELD -- x'},false);
chk('CHANGE TO, seat text not found (no bodies)',{ans:'CHANGE',to:'MEETS -- x'},false);
const M2=new Function('$','PASS',oa+'\nreturn {__oaSkip};')($,{bodies:[{payload:{judge_seat:'sol',verdict_raw:'COLLISION POINTS\nE-PREM D2 vs C3 -- MEETS -- x\nend'}}]});
const r1=M2.__oaSkip(it,{ans:'CHANGE',to:'MEETS -- y'},{},'sol');console.log((r1?'OK   ':'FAIL ')+'skip: line in seat text, grade equal -> '+(r1?'not counted':'counted'));if(!r1)f++;
const r2=M2.__oaSkip({line:'E-PREM D9 -- MEETS -- z'},{ans:'CHANGE',to:'MEETS -- y'},{},'sol');console.log((!r2?'OK   ':'FAIL ')+'skip: line NOT in seat text -> '+(r2?'not counted':'counted'));if(r2)f++;
console.log('FAILS',f);
