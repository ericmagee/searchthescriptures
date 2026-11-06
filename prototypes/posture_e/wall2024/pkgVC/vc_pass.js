let vc_single=[],vc_error=null;try{const __V=vcBuild2024(__VCW,R=>kwLines421('',R));
 if(__V.length){__VCW.forEach(w=>{const miss=__V.filter(v=>!vcCaught2024(w.WT,v));if(!miss.length)return;const k=summary.findIndex(x=>x.seat===w.seat);if(k<0)return;
   const b=JSON.parse(bodies[k]);const ms=[];const none=vcNone2024(w.WT);miss.forEach(v=>{const z=vcItem2024(v,none);(summary[k].drv=summary[k].drv||[]).push(z.item);ms.push(z.mark);});
   b.payload.verdict_raw=b.payload.verdict_raw+(/\n\n\[AUDIT /.test(b.payload.verdict_raw)?'\n':'\n\n')+ms.join('\n');bodies[k]=JSON.stringify(b);});
  const ST=SJ&&typeof SJ.independent_verdict_raw==='string'?netUnwrap(SJ.independent_verdict_raw):null;
  if(ST!=null){const none=vcNone2024(ST);__V.filter(v=>!vcCaught2024(ST,v)).forEach(v=>{const z=vcItem2024(v,none);vc_single.push({item:z.item.link,flagged_line:z.item.line,mark:z.mark,judge_model:(SJ&&(SJ.judge_model||SJ.independent_model))||null});});}}}
catch(e){vc_single=[];vc_error=String(e&&e.message||e).slice(0,300);} // WALL-2024 Part 1 (W2): verified contradictions across the panel; TRIAL, record words only
