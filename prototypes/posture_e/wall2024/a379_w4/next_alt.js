// ASK 379 Next Alternate? decision, model-neutral. State travels in the item (ACC = every pass so far, in order).
// Generalizes live Second Alternate?. Retry rule as live (W1 7959, W3 7960 correction): a model whose only try returned no verdict may be tried once more; after that, never again.
function nextAlternate(S,RS,R1,ACC,CAP){
  const QA=S.dry===true&&S.qualify_alternate?S.qualify_alternate:null;
  const o={run:false,pass:ACC.length+2,seats:[],free:[],tried:[],why:null};
  if(QA){o.why='the qualify path makes no further pass';return o;}
  const tries=(R1.alternates_tried||[]).concat(...ACC.map(p=>p.alternates_tried||[])).filter(x=>x&&x.alternate&&x.api_model&&x.alternate!=='none');
  const seated=(R1.alternates_seated||[]).concat(...ACC.map(p=>p.alternates_seated||[]));const filled=new Set(seated.map(x=>x.removed_seat));
  const NOV=/returned content null|returned no JSON object|JSON did not parse/;const byM={};tries.forEach(x=>{(byM[x.api_model]=byM[x.api_model]||[]).push(x);});
  o.retry=Object.keys(byM).filter(m=>byM[m].length===1&&byM[m][0].result==='NOT SEATED'&&!filled.has(byM[m][0].removed_seat)&&NOV.test(byM[m][0].why||''));
  o.tried=Object.keys(byM).filter(m=>o.retry.indexOf(m)<0);
  const failed=[...new Set(tries.filter(x=>x.result!=='SEATED'&&!filled.has(x.removed_seat)).map(x=>x.removed_seat))];
  o.seats=failed.slice(0,Math.max(0,2-seated.length));
  const deb=RS.debaters||[];const sitting=new Set((S.sitting_models||[]));
  const free=(RS.alternates||[]).filter(a=>!deb.some(d=>d.model===a.api_model||(d.family===a.family&&!(a.family==='anthropic'&&deb.every(x=>x.family==='anthropic'))))&&!sitting.has(a.api_model)&&o.tried.indexOf(a.api_model)<0);
  o.free=free.map(a=>a.seat);
  if(ACC.length>=CAP){o.why='the cap of '+CAP+' further pass'+(CAP===1?'':'es')+' is reached';return o;}
  o.run=o.seats.length>0&&free.length>0;
  o.why=o.run?'pass '+o.pass+' for '+o.seats.join(', ')+'; free: '+o.free.join(', ')
   :!tries.length?'no alternate was tried'
   :!failed.length?'every tried alternate is seated'
   :!o.seats.length?'two alternates already sit'
   :'no pool model is left (pool: '+((RS.alternates||[]).map(a=>a.seat).join(', ')||'empty')+'; tried: '+o.tried.join(', ')+')';
  return o;}
module.exports={nextAlternate};
