const {unpack,rb,load}=require('./tools/lib.cjs');const $=()=>({isExecuted:false,all:()=>[],first:()=>({json:{}})});
const tu=unpack(require('./mine.json'));let src=rb(tu.L,tu.M['Panel Cure Check']);
const a="const MW=/\\b(?:meaning|sense|reading)\\b/i;",b="const MW=/\\b(?:meanings?|senses?|readings?)\\b/i;";
const c="if(/\\b(?:meaning|sense|reading)\\s*$/i.test(cl))continue;",d="if(/\\b(?:meanings?|senses?|readings?)\\s*$/i.test(cl)||(p===P[1]&&MW.test(cl)))continue;";
const e="(?!\\s+(?:meaning|sense|reading)\\b)",f="(?!\\s+(?:[\\w'’-]+\\s+)?(?:meanings?|senses?|readings?)\\b)";
for(const [x,y] of [[a,b],[c,d],[e,f]]){const n=src.split(x).length-1;if(n<1)throw 'anchor '+x+' '+n;src=src.split(x).join(y);}
const T=load(src,$),O=load(rb(tu.L,tu.M['Panel Cure Check']),$);
const rows=require('./b/g4rows.json');const ch=[];for(const r of rows){if(T.g4Unans2024(r.flagged_line)!==O.g4Unans2024(r.flagged_line))ch.push(r.id);}console.log('replay differs from rev2:',ch);
for(const s of ["the meaning that was pressed is not met","The answer misses the meanings pressed.","The answer does not meet the pressed meanings.","The answer fails to meet the pressed words' meaning.","The answer misses the press.","The press is not met.","The answer misses the pressed inference about the meaning of 'knew'.","The answer misses the proven timing press."])console.log(T.g4Press2024(s),'|',s);
