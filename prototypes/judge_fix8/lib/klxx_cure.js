  // judge_fix8 R11 K-LXX (TRIAL): a STATEMENT for the item naming the Septuagint reading with the round it names and words of that round quoted,
  // or one RESTATED CITATION CHECK line that names it.
  if(x.rule==='K-LXX'){const st=stmtOf(x);const rx=/\bSeptuagint\b|\bLXX\b|\bGreek\s+Old\s+Testament\b/i;
   const rl=String(reply&&reply.ok?reply.text:'').split('\n').find(l=>/^[\s*`]*RESTATED\s*:\s*CITATION CHECK\b/i.test(l)&&rx.test(l));
   if(rl)return res('CURED','the restated CITATION CHECK line names the Septuagint reading',[rl.trim()]);
   if(st&&rx.test(st)){const rk=(st.match(/\[(CR[1-4]|DR[1-4])\]/)||[])[1];const q=rk&&typeof R[rk]==='string'?stmtQ(st).find(q=>cureFound(q,R[rk])):null;
    if(q)return res('CURED','statement names the Septuagint reading and quotes ['+rk+']',['STATEMENT: '+st]);return res('UNCURED','the STATEMENT names the Septuagint reading but quotes no words of the round it names',['STATEMENT: '+st]);}
   return res('UNCURED','no STATEMENT naming the Septuagint reading with its round quoted, and no RESTATED CITATION CHECK line naming it',null);}
