// judge_fix6 H3, H4: the renumbering check (renum) and the close-round press check (press) on 32293, 32284 and 32266, base (judge_fix5 lib) and new.
const fs=require('fs');const L=require('./libload.cjs');
const load=dir=>new Function(fs.readFileSync(dir+'/refp.js','utf8')+'\n'+fs.readFileSync(dir+'/close.js','utf8')+'\nreturn C4P;')();
const NEW=load(__dirname+'/../lib'),BASE=load(__dirname+'/../../judge_fix5/lib');
const only=process.argv[2];
for(const n of ['32293','32284','32266']){const F=L.F_(L.run(n));
 for(const sd of ['D','C']){const lab=(sd==='D'?"defender's close [CR4]":"challenger's close [DR4]");
  if(only!=='press'){const b=BASE.renum(F,sd),w=NEW.renum(F,sd);console.log(`RENUM ${n} ${lab}: base ${b.length?'FLAGGED ('+b.length+')':'no flag'} | new ${w.length?'FLAGGED ('+w.length+')':'no flag'}`);w.forEach(x=>console.log('    new: '+x.slice(0,230)));}
  if(only!=='renum'){const b=BASE.press(F,sd),w=NEW.press(F,sd);console.log(`PRESS ${n} ${lab}: base ${b.length} | new ${w.length}`);w.forEach((x,i)=>console.log(`    ${i+1}. [${x.why}] "${x.s}"`));
   const lost=b.filter(x=>!w.some(y=>y.s===x.s));if(lost.length)console.log('    base marks not in new: '+lost.map(x=>'"'+x.s.slice(0,120)+'"').join(' | '));}}}
