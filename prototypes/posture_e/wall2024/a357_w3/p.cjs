const {unpack,rb,load}=require('./tools/lib.cjs');const $=()=>({isExecuted:false,all:()=>[],first:()=>({json:{}})});
const tu=unpack(require('./mine.json'));const T=load(rb(tu.L,tu.M['Panel Cure Check']),$);
const i=tu.L[850].indexOf('function g4Press2024');console.log(tu.L[850].slice(i,i+1100));
const S=[['N',"The answer misses the meaning pressed."],['N',"The answer does not meet the meaning pressed, as its quoted words cannot agree."],['N',"the pressed meaning is not met"],
['N',"the meaning that was pressed is not met"],['N',"The answer misses the reading pressed by DR2."],['N',"The answer does not meet the sense pressed."],['N',"The pressed reading is not met."],['N',"The answer misses the pressed sense of 'knew'."],
['N',"The answer misses the meanings pressed."],['N',"The answer does not meet the pressed meanings."],['N',"The answer fails to meet the pressed words' meaning."],
['Y',"The answer misses the press."],['Y',"The answer misses the proven timing press."],['Y',"The press is not met."],['Y',"The answer does not meet the press, so no fit stands."],
['Y',"The answer misses the pressed inference about the meaning of 'knew'."],['Y',"No fit is shown; the answer misses the pressed inference."],['Y',"The answer does not meet the press concerning meaning."]];
for(const [e,s] of S){const r=T.g4Press2024(s);console.log((r===(e==='Y')?'ok  ':'MISS')+' want '+e+' got '+r+' | '+s);}
