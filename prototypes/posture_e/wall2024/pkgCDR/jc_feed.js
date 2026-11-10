/* pkgCDR (W1): the two code checks already served to the judges also name candidates for the judge contradiction enforcer (coordinator 02:29Z, W3 3958 point 3).
   (1) CLOSE-ROUND REVERSAL CHECK (ruling 412), as Panel Build served it: each "(n) [CR4|DR4] "<close>" -- earlier: "<grant>"" pair.
   (2) ANTI-CHEAT CHECK (ruling 427), Anticheat Record's REVERSED rows.
   The earlier round is the one of that side's rounds 1-3 in which the earlier quote stands. A pair that overlaps one already listed (same side,
   both quotes overlapping) joins it. The checks name candidates only; the enforcer answers each and Judge Contradiction Record checks it as before. */
const cdrRound=(side,q)=>{const P=CEC_PRE[side];for(const r of [3,2,1]){const k=CEC_RK[P+r];if(cecStands(q,F[k]))return P+r;}return null;};
const cdrJoin=(seat,side,er,eq,lr,lq,by)=>{const f=found.find(x=>x.side===side&&over(x.closing_q,lq)&&over(x.earlier_q,eq));if(f){if(f.by!==by){if(!f.also)f.also=[];if(!f.also.includes(by))f.also.push(by);}return;}add(seat,side,er,eq,lr,lq,by);};
try{if($('Panel Build').isExecuted){const T=JSON.stringify($('Panel Build').first().json).replace(/\\n/g,'\n').replace(/\\"/g,'"');let at=0;
 for(;;){const a=T.indexOf('[CLOSE-ROUND REVERSAL CHECK',at);if(a<0)break;at=a+1;const b=T.indexOf('DISREGARDED as footing',a);const seg=T.slice(a,b<0?a+4000:b);
  for(const m of seg.matchAll(/\(\d+\)\s*\[([CD]R4)\]\s*"([^"]*)"\s*--\s*earlier:\s*"([^"]*)"/g)){const side=m[1]==='CR4'?'DEFENDER':'CHALLENGER';const lq=m[2].trim(),eq=m[3].replace(/^\s*[-•>]\s+/,'').trim();const er=cdrRound(side,eq);
   if(er&&cecStands(lq,F[CEC_RK[m[1]]]))cdrJoin('reversal check',side,er,eq,m[1],lq,'reversal');}}}}catch(e){}
try{if($('Anticheat Record').isExecuted){const R=(($('Anticheat Record').first().json.acx||{}).reversed)||{};for(const sd of Object.keys(R))for(const r of (R[sd]||[])){
 const side=sd==='D'||sd==='DEFENDER'?'DEFENDER':'CHALLENGER';const lr=CEC_PRE[side]+'4';const eq=String(r.earlier_q||'').trim(),lq=String(r.close_q||'').trim();const er=cdrRound(side,eq);
 if(er&&cecStands(lq,F[CEC_RK[lr]]))cdrJoin('anti-cheat check',side,er,eq,lr,lq,'anticheat');}}}catch(e){}
