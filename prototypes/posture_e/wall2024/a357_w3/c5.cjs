const {unpack,rb,load}=require('./tools/lib.cjs');
const $=()=>({isExecuted:false,all:()=>[],first:()=>({json:{}})});
const lu=unpack(require('../v182/fb242.json')),tu=unpack(require('./mine.json'));
const Lv=load(rb(lu.L,lu.M['Panel Cure Check']),$),T=load(rb(tu.L,tu.M['Panel Cure Check']),$);
const rows=require('./g4rows.json');let c5=0,c5ml=0,c5mt=0,chg=[],nonC5=[];
for(const r of rows){const s=r.flagged_line||'';const isC5=/Commitment\s*5\b/i.test(s);const a=Lv.g4Unans2024(s),b=T.g4Unans2024(s);
 if(isC5){c5++;if(!a)c5ml++;if(!b){c5mt++;console.log('C5 still meaning:',r.id,s.slice(0,240));}}
 if(a!==b)chg.push(r.id+(isC5?'':'(noC5)'));if(!isC5&&T.g4Press2024(s))nonC5.push(r.id);}
console.log({total:rows.length,c5,c5_meaning_live:c5ml,c5_meaning_357:c5mt,changed:chg,press_read_without_C5:nonC5});
const P=["The answer misses the meaning pressed.","The answer does not meet the meaning pressed, as its quoted words cannot agree.","the pressed meaning is not met"];
for(const p of P)console.log(T.g4Unans2024(p),'|',p);
