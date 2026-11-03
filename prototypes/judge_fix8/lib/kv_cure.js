  // judge_fix8 K6 K-V (TRIAL): a VOID ruling that quotes no charge words beyond the quote, or names no kind. Cured by a STATEMENT for the item
  // that does both (the charge read from the list in the rounds), or by a RESTATED count line for the side whose segment for the premise no longer
  // rules it VOID: SUPPORTED or NARROWED, or counted (UNEXHIBITED or CONCEDED) with a CORRECTED COUNT above the seat's count and the standing that
  // count makes true.
  if(x.rule==='K-V'){const CH=kvCharges(R,x.side);const st=stmtOf(x);
   if(st&&CH){const v=kvRulingOk(st,x.premise,CH);if(v.ok)return res('CURED','statement quotes the charge words ('+(v.q||v.why)+') and names the kind',['STATEMENT: '+st]);}
   const lab=x.side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS';const rc=o.restated.filter(r=>r.link===lab);
   if(rc.length===1){const sg=kvSegments(lab+': '+rc[0].text,x.side).find(z=>z.ns.includes(x.premise));
    if(!sg){const T=rc[0].text;const re=new RegExp('\\bpremises?\\s+(?:\\d+\\s*(?:,|and|&)\\s*)*'+x.premise+'\\b[^.;]{0,160}','i');const m=T.match(re);const seg=m?m[0]:'';
     if(/\b(?:SUPPORTED|NARROWED|SPARED|STANDS)\b/i.test(seg)&&!/\b(?:UNEXHIBITED|CONCEDED)\b/.test(seg))return res('CURED','regraded in the restated count: '+seg.slice(0,120),[rc[0].line]);
     if(/\b(?:UNEXHIBITED|CONCEDED)\b/.test(seg)){const cs=o.count.filter(c=>c.side===x.side);const ns=[...new Set(cs.map(c=>c.n))];const ss=o.standing.filter(s=>s.side===x.side);const sv=[...new Set(ss.map(s=>s.st))];const ls=[rc[0].line].concat(cs.map(c=>c.line),ss.map(s=>s.line));
      if(ns.length!==1||ns[0]<=(x.conc||0))return res('UNCURED','the restated count counts premise '+x.premise+' but no single CORRECTED COUNT above '+(x.conc||0)+' for '+x.side,ls);
      const want=(x.L&&2*ns[0]>x.L)?'COLLAPSED':'PROP-DEPENDENT';const got=sv.length===1?sv[0]:(x.st||null);if(got!==want)return res('UNCURED','count '+ns[0]+' of '+(x.L||'?')+' makes the '+x.side+' standing '+want+'; it reads '+(got||'none'),ls);
      return res('CURED','counted: '+x.side+' COUNT '+ns[0]+', STANDING '+want,ls);}
     return res('UNCURED','the restated count does not grade premise '+x.premise,[rc[0].line]);}
    const v=kvRulingOk(sg.seg,x.premise,CH);if(v.ok)return res('CURED','the restated VOID ruling quotes the charge words ('+(v.q||v.why)+') and names the kind',[rc[0].line]);
    return res('UNCURED','the restated count still rules premise '+x.premise+' VOID without the charge words and the kind',[rc[0].line]);}
   return res('UNCURED','no STATEMENT quoting the charge words and naming the kind, and no RESTATED '+lab+' line regrading premise '+x.premise,null);}
