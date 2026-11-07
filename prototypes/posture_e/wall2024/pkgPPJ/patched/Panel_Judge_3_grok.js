// pkgPPJ (W1, 11-07): judge 3 (grok) was called together with the other two judges; Panel Judges Collect holds the stored replies by seat slot.
// This node hands out slot 3's reply exactly as the old HTTP node gave it, so every reader of "Panel Judge 3 grok" is unchanged.
const K=3,P="grok";const it=$('Panel Judges Collect').all();const j=((it.find(i=>i&&i.json&&i.json.ppj_slot===K))||{}).json||{};
const pe=e=>{const o={message:String((typeof e==='string')?e:((e&&(e.message||e.description))||JSON.stringify(e)))};if(e&&typeof e==='object'){for(const f of ['name','description','httpCode','status','statusCode','code'])if(e[f]!=null&&typeof e[f]!=='object')o[f]=e[f];}return o;};
let out;
if(j.error&&!j.response){const e=pe(j.error);e.message='pkgPPJ transport: '+e.message;e.ppj_transport=true;out={error:e};}
else if(j.ppj_slot!==K||j.ppj_provider!==P)out={error:{message:'pkgPPJ: slot '+K+' ('+P+') reply missing or mismatched: got slot '+j.ppj_slot+' ('+j.ppj_provider+')',ppj_transport:true}};
else if(!j.response||typeof j.response!=='object')out={error:{message:'pkgPPJ: slot '+K+' ('+P+') webhook answered without a reply object',ppj_transport:true}};
else out=j.response;
return [{json:out}];