// pkgPPJ v2 (W1, 11-07): the three judge replies, one item per seat slot in slot order, from the rows the Panel Judge Call workflow stored.
// A slot with no stored reply (its dispatch failed, or nothing arrived within 980 s) gets a transport error, which Panel Check treats as a failed judge call.
const P=$('Panel Judges Prep').all().map(i=>i.json);const D=$('Panel Judges Parallel').all().map(i=>i.json||{});
const F=($('Panel Judges Fetch').first().json)||{};const rows=Array.isArray(F.rows)?F.rows:[];const el=Math.round((Date.now()-P[0].ppj_t0)/1000);
const out=P.map((q,i)=>{const r=rows.find(x=>x&&x.slot===q.ppj_slot);let resp=null;try{resp=r&&typeof r.response_text==='string'?JSON.parse(r.response_text):null;}catch(e){resp=null;}
 if(resp&&typeof resp==='object')return {json:{ppj_slot:q.ppj_slot,ppj_provider:r.provider,response:resp}};
 const de=D[i]&&D[i].error;const why=de?'dispatch to the Panel Judge Call webhook failed: '+String((de&&(de.message||de.description))||JSON.stringify(de)).slice(0,200):'no reply stored for slot '+q.ppj_slot+' ('+q.ppj_provider+') after '+el+' s';
 return {json:{ppj_slot:q.ppj_slot,ppj_provider:q.ppj_provider,error:{message:why,ppj_transport:true}}};});
return out;