  // BB-8327 D1: K-C is cured by one RESTATED line for the item that drops the stating ground and names the chain footing (two layer kinds); a regrade to LINK BROKEN needs one CORRECTED RESULT.
  if(x.rule==='K-C'){const rs=o.restated.filter(r=>U(r.link)===U(x.link));
   if(!rs.length)return res('UNCURED','no RESTATED line for '+x.link,null);if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   if(NET_STATE.some(rx=>rx.test(rs[0].text)))return res('UNCURED','the restated line keeps the ground that a verse does not state the link',[rs[0].line]);
   const k=drvKinds(rs[0].text);if(k.length<2)return res('UNCURED','the restated line names no chain footing: it exhibits '+k.length+' layer kind'+(k.length===1?'':'s'),[rs[0].line],k);
   if(/LINK BROKEN$/.test(rs[0].grade||'')&&o.result.length!==1)return res('UNCURED','regraded LINK BROKEN without exactly one CORRECTED RESULT line',[rs[0].line],k);
   return res('CURED',null,[rs[0].line],k);}
