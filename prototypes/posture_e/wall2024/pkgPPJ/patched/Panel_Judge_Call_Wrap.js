// pkgPPJ (W1, 11-07): answer the main workflow with the provider reply for this seat slot.
// A provider HTTP error item ({error: <reason>}) is passed on with its message, description and status as plain fields,
// because an Error's message does not survive JSON. Panel Check reads e.message / e.description and httpCode / status / statusCode.
const q=$('Panel Judge Call').first().json.body||{};const j=$json||{};
const pe=e=>{const o={message:String((typeof e==='string')?e:((e&&(e.message||e.description))||JSON.stringify(e)))};if(e&&typeof e==='object'){for(const f of Object.keys(e))if(e[f]!=null&&typeof e[f]!=='object'&&!(f in o))o[f]=e[f];for(const f of ['name','description','httpCode','status','statusCode','code'])if(e[f]!=null&&typeof e[f]!=='object')o[f]=e[f];}return o;};
const response=j.error?Object.assign({},j,{error:pe(j.error)}):j;
return [{json:{ppj_slot:q.ppj_slot,ppj_provider:q.ppj_provider,response}}];