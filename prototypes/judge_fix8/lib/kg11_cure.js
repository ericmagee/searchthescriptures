  // judge_fix8 K5 (1) K-G11 (TRIAL; ruling 392 at the COLLISION POINTS): a LINK BROKEN line resting, as unanswered, only on verses under no
  // PRESSED WITH:. Cured by RETRACTED for the line (beside one CORRECTED RESULT, with its reason), by a RESTATED line not graded LINK BROKEN, or
  // by a RESTATED LINK BROKEN line naming, as left unanswered, a verse the list against that side carries under PRESSED WITH:.
  if(x.rule==='K-G11'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   const rs=cureRest(o,x).filter(r=>!r.retraction);if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   if(rs.length&&rs[0].grade&&!/LINK BROKEN$/.test(rs[0].grade))return res('CURED','regraded '+rs[0].grade,[rs[0].line]);
   if(rs.length){const P=new Set(x.pwk||[]);const un=pwUnans(rs[0].text).filter(k=>P.has(k));if(un.length)return res('CURED','restated LINK BROKEN on a pressed witness under PRESSED WITH: '+un.join(', '),[rs[0].line]);
    return res('UNCURED','the restated line still rests, as unanswered, on no verse a listed premise carries under PRESSED WITH (ruling 392)',[rs[0].line]);}
   return res('UNCURED','no RETRACTED or RESTATED line for '+x.link+'; it rests, as unanswered, only on '+(x.verses||[]).join(', ')+', under no PRESSED WITH (ruling 392)',null);}
