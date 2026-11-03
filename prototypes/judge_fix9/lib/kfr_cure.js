  // judge_fix9 S1 K-F (TRIAL; ruling 396): cured by RETRACTED for the line (with one CORRECTED RESULT), by a RESTATED line not graded LINK
  // BROKEN, or by one FORCED line for the item whose three quotations stand in the rounds it names (MEANS in its round, ANSWER and FAILS in the
  // answer's round).
  if(x.rule==='K-F'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   const rs=cureRest(o,x).filter(r=>!r.retraction);if(rs.length&&rs[0].grade&&!/LINK BROKEN$/.test(rs[0].grade))return res('CURED','regraded '+rs[0].grade,[rs[0].line]);
   const fl=String(reply&&reply.ok?reply.text:'').split('\n').map(l=>l.trim().replace(/^[*`]+|[*`]+$/g,'')).filter(l=>/^(?:[-•]\s*)?FORCED\s*:/i.test(l)&&U(l).replace(/\s+VS\.?\s+/g,' VS ').includes(U(x.link).replace(/\s+VS\s+/g,' VS ')));
   if(!fl.length)return res('UNCURED','no FORCED line for '+x.link+', no RETRACTED line and no RESTATED line regrading it',null);
   const chk=kfLines(fl[0],R);if(chk.items.length)return res('UNCURED','the FORCED line does not hold: '+chk.items[0].why,[fl[0]]);
   return res('CURED','the FORCED line quotes the MEANS sentence, the answer and the failing layer, each in the round it names',[fl[0]]);}
  // judge_fix9 S3 K-R (TRIAL; ruling 399): cured by one REFERENCE line for the press whose first quotation stands in the round the press names and
  // whose second is the press's MEANS sentence (CONFIRMED or NOT CONFIRMED, the seat's own call).
  if(x.rule==='K-R'){const key=String(x.key||'');
   const rl=String(reply&&reply.ok?reply.text:'').split('\n').map(l=>l.trim().replace(/^[*`]+|[*`]+$/g,'')).filter(l=>/^(?:[-•]\s*)?REFERENCE\s*:/i.test(l)&&ciKeys(l).has(key));
   if(!rl.length)return res('UNCURED','no REFERENCE line for '+key,null);const m=rl[0].replace(/[*_`]+/g,'').match(KR_LINE);
   if(!m)return res('UNCURED','the REFERENCE line is not in the form',[rl[0]]);const rk=m[2].toUpperCase();
   if(rk!==x.round)return res('UNCURED','the REFERENCE line names ['+rk+']; the press names ['+x.round+']',[rl[0]]);
   if(typeof R[rk]!=='string'||!ciFound(m[4],R[rk]))return res('UNCURED','its first quotation is not in ['+rk+']',[rl[0]]);
   if(!x.means||!ciFound(m[5],x.means))return res('UNCURED','its second quotation is not the press\'s MEANS sentence',[rl[0]]);
   return res('CURED','REFERENCE '+m[3].toUpperCase()+' with both meanings quoted',[rl[0]]);}
  // judge_fix9 S4 K-L2 (TRIAL): cured by RETRACTED for the line, or by one RESTATED line for it whose [L2] words each stand in a verse the line
  // cites (or that drops the [L2]).
  if(x.rule==='K-L2'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   const rs=cureRest(o,x).filter(r=>!r.retraction);if(!rs.length)return res('UNCURED','no RESTATED or RETRACTED line for '+x.link,null);
   const L2D=l2Data();
   const k=L2D?kl2Lines(String(rs[0].line).replace(/^RESTATED\s*:\s*/i,''),L2D):{items:[]};if(k.items.length)return res('UNCURED','the restated line still carries an [L2] NOT COUNTED ('+k.items[0].why+')',[rs[0].line]);
   return res('CURED','restated: every [L2] of the line stands in a verse it cites, or none is left',[rs[0].line]);}
