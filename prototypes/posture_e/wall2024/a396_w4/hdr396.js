/* ASK 396 (rulings 428 and 490): one header line listing each seat's open premise (E-PREM) and answer (E-ANS) disagreements, read from this run's own final send-back statuses (the Alternate Merge enforcer_log, the rows this run saves to debate_enforcer_log). Recorded only; not counted. */
{let EL=null;try{if($('Alternate Merge').isExecuted)EL=$('Alternate Merge').first(0).json.enforcer_log;}catch(e){EL=null;}
 const RM396=new Set((Array.isArray(r.drv_removed)?r.drv_removed:[]).map(x=>x&&x.seat).filter(Boolean));const by396=new Map(),seen396=new Set();
 if(Array.isArray(EL))for(const x of EL){if(!x||x.kind!=='send_back'||x.cure_status!=='UNCURED'||!/^E-(PREM|ANS)$/.test(String(x.rule||'')))continue;const k=x.seat+'|'+x.rule+'|'+x.item;if(seen396.has(k))continue;seen396.add(k);
  let it=String(x.item||'');if(x.rule==='E-PREM'){const m=it.match(/^premise listed against the (defender|challenger) (\d+)$/i);if(m)it=m[1].toLowerCase()+' premise '+m[2];}else it=it.replace(/^ANSWER CHECK\s+/i,'');
  const s=by396.get(x.seat)||{P:[],A:[]};(x.rule==='E-PREM'?s.P:s.A).push(it);by396.set(x.seat,s);}
 const parts396=[...by396].map(([sd,s])=>(ALTN0[sd]||nm(sd))+(RM396.has(sd)?' (removed)':'')+': '+[s.P.length?'E-PREM '+s.P.join(', '):'',s.A.length?'E-ANS '+s.A.join(', '):''].filter(Boolean).join('; '));
 t += '**OPEN ENFORCER DISAGREEMENTS (recorded, not counted; rulings 428 and 490, ASK 396):** ' + (!Array.isArray(EL)?'not read: this run holds no enforcer log':parts396.length?parts396.join(' | '):'none') + '\n\n';}
