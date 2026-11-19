// ASK 430 plants (W1): run the old and new `forms` and the line-166 hit test on planted (gloss part, KJV words) cases.
const {OLD,NEW}=require('./p430.cjs');
const mk=line=>new Function('return p=>{const o=new Set([p]);const ws=p.split(\' \');const l=ws.pop();const pre=ws.length?ws.join(\' \')+\' \':\'\';'+line+'return [...o];};')();
const fo=mk(OLD),fn=mk(NEW);
const hit=(forms,part,W)=>{const S=new Set(W);return forms(part).some(f=>S.has(f))||part.split(' ').some(w=>forms(w).some(f=>S.has(f)));};
const C=[['prepare',['prepared'],'known-good: G2675'],['prepared',['prepare'],'reverse'],['conceive',['conceived'],'W4 8744'],['carry',['carried'],'-ied'],['carried',['carry'],'-ied reverse'],['stop',['stopped'],'doubled'],['stopped',['stop'],'doubled reverse'],['seed',['seeds'],'old -s, unchanged'],
 ['fee',['feed'],'KNOWN-BAD plant: different word'],['feed',['fee'],'KNOWN-BAD reverse plant (W4 9093 N2)'],['bee',['bed'],'plant'],['need',['nee'],'plant'],['sprung up',['sprang'],'not an -ed form: stays NOT FOUND'],['used',['us'],'KNOWN-BAD (m430 G1096): rev 1 needs 3 letters before -ed'],['used',['use'],'rev 1: -d strip still reads use'],['intended',['intend'],'rev 1: -ed strip, stem 6']];
for(const [p,W,why] of C)console.log((hit(fo,p,W)?'FOUND':'NOT  ')+' -> '+(hit(fn,p,W)?'FOUND':'NOT  ')+' | "'+p+'" vs KJV '+JSON.stringify(W)+' | '+why);
