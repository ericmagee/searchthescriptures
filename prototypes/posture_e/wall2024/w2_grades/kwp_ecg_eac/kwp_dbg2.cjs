const run=require('./rep.cjs');
const RESP='NOT HELD: The grant “that her ‘know’ is present” and that “thou shalt conceive” is future',STMT='NOT HELD: “that her ‘know’ is present (Luke 1:31, ‘thou shalt conceive’ is future)”';
global.PLANT=(raw,fn)=>fn!=='ex35296_full.json'?raw:raw.split(RESP).join('NOT HELD: The grant “that her womb was blessed” accepts the timing').split(STMT).join('NOT HELD: “that her womb was blessed”');
run('parent_s148_KWP.json',['Panel Cure Check'],(fn,n,a,b,rd)=>{if(fn!=='35296')return;const L=b[0].json.summary.find(x=>x.seat==='luna');console.log(JSON.stringify(L.cure.find(c=>/#4$/.test(c.link||'')&&c.rule==='K-W')));
 const s=JSON.stringify(rd['Panel Cure Call 1 openrouter']||rd['Panel Cure Normalize 1']);let i=s.indexOf('heading #4 |');console.log(i, s.slice(i,i+300));});
