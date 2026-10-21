// Worker_A3 step 8: run the published matcher (cureQ/cureFound from Cure Check, 5fd3b03c = ee8f4b9 new/) on run 27613's single-judge PRESSED quotes.
const fs=require('fs');const s=fs.readFileSync('new/Cure_Check.js','utf8');
const cut=(a,b)=>{const i=s.indexOf(a),j=s.indexOf(b,i);if(i<0||j<0)throw new Error('anchor '+a);return s.slice(i,j);};
const F=new Function(cut('const cureQ=','const CURE_KEY=')+';return {cureQ,cureFound};')();
const R=JSON.parse(fs.readFileSync('step8/rounds.json','utf8'));
const Q=[['D4 vs C2','engine_r2',"The defender's round 2 never touches *dio*. He offers only *eperchomai* and *episkiazō* as lexical parallels, and he does not say why a power that 'comes upon' and 'overshadows' would be followed by a man's seed as cause."],
 ['D5 vs C1','engine_r2',"In Matthew the order is reversed, and the text states the reversal. The defender calls this 'timing,' but a text that fixes conception before any union has narrated what the conception was not. It has also named the source, 'of the Holy Ghost.'"],
 ['D6 vs C2','engine_r1',"(L1) Luke 1:34: 'How shall this be, seeing I know not a man?' Luke 1:35: 'The Holy Ghost shall come upon thee, and the power of the Highest shall overshadow thee: therefore also (dio kai) that holy thing which shall be born of thee shall be called the Son of God.' (L2) *Dio* is causal: the Spirit's coming is the ground of the title."]];
for(const [k,col,q] of Q){const raw=R[col];const round=raw.replace(/\[/g,'(').replace(/\]/g,')');
 const dq=q.replace(/'(?=[A-Za-z(])|(?<=[A-Za-z.,?!:])'(?=[\s.,;:?!]|$)/g,'"');
 console.log(k,'| raw',F.cureFound(q,raw),'| brackets round',F.cureFound(q,round),'| quote marks made double',F.cureFound(dq,raw),F.cureFound(dq,round));}
// Probe 2: quote marks folded to one character on both sides (judge text and round text), brackets made round in the round text.
const fold=x=>x.replace(/["“”'‘’]/g,'"');
for(const [k,col,q] of Q){const round=R[col].replace(/\[/g,'(').replace(/\]/g,')');
 console.log(k,'| quote marks folded both sides',F.cureFound(fold(q),fold(R[col])),'| folded + brackets round',F.cureFound(fold(q),fold(round)));}
