// Worker_A3 step 11: negative cases on the NEW and BASE matcher (cureFound from each Cure Check), round windows from step8/rounds.json.
const fs=require('fs');const R=JSON.parse(fs.readFileSync('/tmp/claude-0/-home-user-searchthescriptures/b26695b3-56b9-5f42-92b7-63fcf7fb72c9/scratchpad/retract/step8/rounds.json','utf8'));
const ld=f=>{const s=fs.readFileSync(f,'utf8');const c=(a,b)=>{const i=s.indexOf(a),j=s.indexOf(b,i);return s.slice(i,j);};return new Function(c('const cureQ=','const CURE_KEY=')+';return cureFound;')();};
const NEW=ld('/tmp/claude-0/-home-user-searchthescriptures/b26695b3-56b9-5f42-92b7-63fcf7fb72c9/scratchpad/step11/prototypes/bb6904/rev8/fold/new/Cure_Check.js'),BASE=ld('/tmp/claude-0/-home-user-searchthescriptures/b26695b3-56b9-5f42-92b7-63fcf7fb72c9/scratchpad/step11/prototypes/bb6904/rev8/fold/base/Cure_Check.js');
const q6="(L1) Luke 1:34: 'How shall this be, seeing I know not a man?' Luke 1:35: 'The Holy Ghost shall come upon thee, and the power of the Highest shall overshadow thee: therefore also (dio kai) that holy thing which shall be born of thee shall be called the Son of God.' (L2) *Dio* is causal: the Spirit's coming is the ground of the title.";
const C=[['good: D6 quote as written',q6,true],
 ['label dropped mid-quote (L2) removed',q6.replace('(L2) ',''),false],
 ['label changed (L2)->(L3)',q6.replace('(L2)','(L3)'),false],
 ['one word changed causal->casual',q6.replace('causal','casual'),false],
 ['word added',q6.replace('the ground of the title','the true ground of the title'),false],
 ['quote mark inserted where the round has none',"The defender's round 2 never touches 'dio'. He offers only",true]];
for(const [n,q,want] of C){const a=NEW(q,R.engine_r1+'\n'+R.engine_r2),b=BASE(q,R.engine_r1+'\n'+R.engine_r2);console.log((a===want?'ok  ':'FAIL')+' | '+n+' | new '+a+' | base '+b);}
