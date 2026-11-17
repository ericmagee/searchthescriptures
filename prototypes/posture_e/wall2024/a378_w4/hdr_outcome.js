{const pv=r.panel_verdict,oc=r.outcome,sp=r.panel_split?' ('+r.panel_split+')':'';const MAPV={HELD:'DEFENDER PREVAILS',PARTIAL:'DEFENDER PREVAILS, WEAKENED',BROKEN:'CHALLENGER PREVAILS'};
 /* ASK 378 (operator 16:18 CST 11-17; W1 plan rev 2, W2 7914 and 7918): the outcome line names the rule of derive_debate_outcome that applied, in the function's order (tie majority, exact half, closing contradiction, citation, review, map), and the seats that triggered it. Presentation only; no seat or model is named here. */
 const lst=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];const W=['no','one','two','three','four','five','six'];const nw=x=>W[x]||String(x);
 const held=pv==='HELD'?"The defender's chain held"+sp:pv==='PARTIAL'?"The defender's chain held, weakened"+sp:pv==='BROKEN'?"The defender's chain was broken"+sp:pv?'The panel reached no majority verdict'+sp:'The panel did not finish';
 const cr=new Date(r.created_at||0).getTime();const UDS=(Array.isArray(r.underdetermined_seats)?r.underdetermined_seats:[]).map(String);
 const HS=(pv==='HELD'||pv==='PARTIAL')?J.filter(j=>j.verdict_tag===pv&&!j.truncated&&(+j.drv_uncured||0)===0):[];const HU=HS.filter(j=>UDS.includes(j.judge_seat+':RESULT'));
 const tieMaj=HS.length>0&&cr>=Date.parse('2026-10-14T01:45:00Z')&&HU.length*2>HS.length,tieHalf=!tieMaj&&HS.length>0&&cr>=Date.parse('2026-10-30T23:00:41Z')&&HU.length*2===HS.length;
 const afterTie=(tieMaj||tieHalf)?'UNDERDETERMINED':(MAPV[pv]||null);const REV=/REVIEW/.test(String(oc||''));
 const hn=a=>a.map(j=>nm(j.judge_seat));let why='';
 if(!oc)why='';
 else if(r.citation_block)why=held+', but '+String(r.citation_block).replace(/\.$/,'')+'. Under the citation rule, a side that would prevail on a load-bearing quotation the KJV citation check cannot find does not prevail, so the outcome goes to review.';
 else if(REV)why=held+'; '+(pv&&MAPV[pv]?'the outcome goes to review.':pv?'the verdict '+pv+' has no outcome in the map, so the outcome goes to review.':'fewer than two judges were counted, so the result is ungraded and goes to review.');
 else if(afterTie&&oc!==afterTie&&!REV){const side=oc==='UNDERDETERMINED'?'both sides':oc==='DEFENDER PREVAILS'?'the challenger':oc==='CHALLENGER PREVAILS'?'the defender':null;
  why=held+(tieMaj||tieHalf?' and the tie rule gave UNDERDETERMINED':'')+'; the outcome is '+oc+' because '+(side?'a confirmed closing contradiction by '+side+' forfeits the debate'+(side==='both sides'?' for both':' for that side'):'a later rule applied')+' (closing-contradiction rule).';}
 else if(tieMaj)why=pv+' by '+lst(hn(HS))+' ('+nw(HS.length)+' counted). '+lst(hn(HU))+' wrote RESULT: UNDERDETERMINED. When more than half of the counted judges who give the panel verdict write RESULT: UNDERDETERMINED, the outcome is UNDERDETERMINED (tie rule).';
 else if(tieHalf)why=pv+' by '+lst(hn(HS))+' ('+nw(HS.length)+' counted). '+lst(hn(HU))+' wrote RESULT: UNDERDETERMINED. When exactly half of the counted judges who give the panel verdict write RESULT: UNDERDETERMINED, the outcome is UNDERDETERMINED (tie rule, ruling 304).';
 else if(pv&&MAPV[pv]===oc)why=held+'; the panel verdict '+pv+' gives '+oc+'.';
 else why=held+'; the outcome is '+oc+'.';
 t += '**Outcome:** ' + (oc || 'not recorded') + (why ? '. ' + why : '') + '\n\n';}
