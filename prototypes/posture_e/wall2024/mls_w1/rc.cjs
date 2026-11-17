const fs=require('fs');const {unpack,rb,load}=require('../tools/lib.cjs');
const tw=JSON.parse(fs.readFileSync('../mls_w4/build/target_mls.json'));const tu=unpack(tw.nodes?tw:(tw.workflow||tw));
const keys=Object.keys(tu.M).filter(k=>/function cureRecompute/.test(rb(tu.L,tu.M[k])));console.log('nodes with cureRecompute',keys);
const $=n=>({all:()=>[],first:()=>({json:{}}),isExecuted:false});
const C=load(rb(tu.L,tu.M[keys[0]]),$);
// minimal judge text with a FORCED/BROKEN line on D3 vs C3 and verdict lines
const text=['D3 vs C3 (Matthew 1:25): CHALLENGER LINK BROKEN -- x (Commitment 3) -- GROUND: [L1] Matthew 1:25 "And knew her not till she had brought forth her firstborn son"',
'DEFENSE STANDING: HELD','CONCEDED LINKS: 0','CHALLENGE STANDING: BROKEN','CHALLENGER CONCEDED LINKS: 1','RESULT: DEFENDER PREVAILS (HELD)'].join('\n');
const F0={verdict_tag:'HELD',defense_standing:'HELD',conceded_links:0,challenge_standing:'BROKEN',challenger_conceded_links:1};
const item={rule:'K-ML',side:'JUDGE',link:'D3 vs C3 (K-ML)',pair:'D3 vs C3',add:['at all'],line:'[Matthew 1:25] your FORCED line takes the MEANS [CR3] which adds "at all"'};
const reply={ok:true,text:'RETRACTED: D3 vs C3 -- [DR3] reads "knew her not till states the withholding from the taking to the birth"\nCORRECTED RESULT: BROKEN-1'};
const v=[Object.assign({},item,{status:'UNCURED',why:'TRIAL rule'})];
try{const o=C.cureLines(reply.text);console.log('withdrawn',JSON.stringify(o.withdrawn),'result',JSON.stringify(o.result));
const rs=C.cureReasoned(o,[item.line]);console.log('reasoned',[...rs]);
const rc=C.cureRecompute('grok',text,F0,[item],v,reply);console.log('recompute retracted',rc&&rc.retracted,'fields',rc&&JSON.stringify(rc.fields));}catch(e){console.log('ERR',e.message);}
