const run=require('./rep.cjs');
const RESP='NOT HELD: The grant “that her ‘know’ is present” and that “thou shalt conceive” is future',STMT='NOT HELD: “that her ‘know’ is present (Luke 1:31, ‘thou shalt conceive’ is future)”';
global.PLANT=(raw,fn)=>fn!=='ex35296_full.json'?raw:raw.split(RESP).join('NOT HELD: The grant “that her womb was blessed” accepts the timing').split(STMT).join('NOT HELD: “that her womb was blessed”');
run('parent_s148_KWP.json',['Panel Cure Check'],(fn,n,a,b)=>{if(fn!=='35296')return;const s=JSON.stringify(b);let i=s.indexOf('#4');while(i>=0){const t=s.slice(i,i+700);if(/NOT HELD|statement|response/i.test(t))console.log(t,'\n');i=s.indexOf('#4',i+1);}});
