  // judge_fix8 K2 K-G10 (TRIAL; md_notes_rulings 392): the seat counted a premise UNEXHIBITED on a verse no listed premise carries under
  // PRESSED WITH:. Cured (a) by a STATEMENT for the item quoting the PRESSED WITH: line that carries the verse: a quotation that stands in a
  // PRESSED WITH: segment of the list against that side ([DR2] against the defender, [CR3] against the challenger, read from the rounds, or from
  // the item when the rounds are not to hand) and names the verse by book, chapter and verse; or (b) by a CORRECTED COUNT for the side that no
  // longer counts the side's K-G10 premises not cured by statement (at most the seat's count less their number), with the standing that count
  // makes true (SELF-SUPPORTED at 0 unless a link of that side stands graded BROKEN after the reply's retractions, PROP-DEPENDENT, or COLLAPSED when 2c > L).
  if(x.rule==='K-G10'){const pr=x.side==='DEFENDER'?'DR2':'CR3';
   const segs=y=>{const L=typeof pwList==='function'?pwList(R,y.side):null;return L&&L.some(p=>p.has)?L.filter(p=>p.has).map(p=>p.seg):(y.pw||[]).map(p=>p.seg);};
   const stated=y=>{const st=stmtOf(y);if(!st)return null;const qs=stmtQ(st);const S=segs(y);
    for(const v of (y.verses||[])){const K=ciKeys(v);const q=qs.find(q=>[...ciKeys(q)].some(k=>K.has(k))&&S.some(s=>cureFound(q,s)&&[...ciKeys(s)].some(k=>K.has(k))));if(!q)return null;}
    return st;};
   const st0=stated(x);if(st0)return res('CURED','statement quotes the PRESSED WITH line ('+pr+') that carries '+(x.verses||[]).join(', '),['STATEMENT: '+st0]);
   const open=new Set(items.filter(y=>y.rule==='K-G10'&&y.side===x.side&&!stated(y)).map(y=>y.premise));const cap=Math.max(0,(x.conc||0)-open.size);
   const cs=o.count.filter(c=>c.side===x.side);const ns=[...new Set(cs.map(c=>c.n))];const ss=o.standing.filter(s=>s.side===x.side);const sv=[...new Set(ss.map(s=>s.st))];const lines=cs.map(c=>c.line).concat(ss.map(s=>s.line));
   if(!ns.length)return res('UNCURED','no CORRECTED COUNT for '+x.side+' and no STATEMENT quoting the PRESSED WITH line ('+pr+') that carries '+(x.verses||[]).join(', ')+' (ruling 392: a verse pressed without a premise is not a witness)',lines);
   if(ns.length>1)return res('UNCURED','two differing CORRECTED COUNT lines for '+x.side,lines);
   if(ns[0]>cap)return res('UNCURED','corrected count '+ns[0]+' still counts '+(open.size>1?'premises':'premise')+' '+[...open].join(', ')+' on a verse no listed premise carries under PRESSED WITH (the count is at most '+cap+')',lines);
   if(sv.length>1)return res('UNCURED','two differing CORRECTED STANDING lines for '+x.side,lines);
   const brk=((broken||{})[x.side]||[]).filter(l=>!wd.has(U(l))).length>0; /* judge_fix8 K5: a line retracted in this reply is not BROKEN */const want=ns[0]===0?(brk?'PROP-DEPENDENT':'SELF-SUPPORTED'):((x.L&&2*ns[0]>x.L)?'COLLAPSED':'PROP-DEPENDENT');const got=sv.length===1?sv[0]:(x.st||null);
   if(got!==want)return res('UNCURED','count '+ns[0]+' of '+(x.L||'?')+' makes the '+x.side+' standing '+want+'; it reads '+(got||'none'),lines);
   return res('CURED','recounted under ruling 392: '+x.side+' COUNT '+ns[0]+', STANDING '+want,lines);}
