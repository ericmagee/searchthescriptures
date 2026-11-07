// pkgPPJ (W1, 11-07): judge 2 (grok) was called by Panel Judges Parallel together with the other two judges.
// This node hands out slot 2's reply exactly as the old HTTP node gave it, so every reader of "Panel Judge 2 grok" is unchanged.
const K=2,P="grok";const it=$('Panel Judges Parallel').all();const j=(it[K-1]&&it[K-1].json)||{};
const pe=e=>{const o={message:String((typeof e==='string')?e:((e&&(e.message||e.description))||JSON.stringify(e)))};if(e&&typeof e==='object'){for(const f of ['name','description','httpCode','status','statusCode','code'])if(e[f]!=null&&typeof e[f]!=='object')o[f]=e[f];}return o;};
let out;
if(j.error&&j.ppj_slot==null){const e=pe(j.error);e.message='pkgPPJ transport (Panel Judge Call webhook): '+e.message;e.ppj_transport=true;out={error:e};}
else if(j.ppj_slot!==K||j.ppj_provider!==P)out={error:{message:'pkgPPJ: slot '+K+' ('+P+') reply missing or mismatched: got slot '+j.ppj_slot+' ('+j.ppj_provider+')',ppj_transport:true}};
else if(!j.response||typeof j.response!=='object')out={error:{message:'pkgPPJ: slot '+K+' ('+P+') webhook answered without a reply object',ppj_transport:true}};
else out=j.response;
return [{json:out}];