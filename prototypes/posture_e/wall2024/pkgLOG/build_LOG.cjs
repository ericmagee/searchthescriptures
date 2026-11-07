// pkgLOG (33222: Write Enforcer Log timed out on a 7.7 MB, 687-row body; anon's statement_timeout is 3 s): the log body sends each long
// prompt_sent and full_reply text once. A later row whose field is the same text (2,000 characters or more) carries a pointer instead:
// "[SAME <field> AS row <n> of this run's log: seat <s>, kind <k>, rule <r>, item <i>]", where n counts the body's rows from 1 in sent order.
// One edit, in Write Enforcer Log's jsonBody expression; the flow's own enforcer_log and every Code node are unchanged.
// Run from wall2024/: node pkgLOG/build_LOG.cjs [in workflow JSON] [out workflow JSON]   (default in: the latest live fetch-back, s16)
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const IN=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s16.json',OUTW=process.argv[3]||'pkgLOG/out/workflow_LOG.json';
for(const d of ['out'])fs.mkdirSync('pkgLOG/'+d,{recursive:true});
let w=JSON.parse(fs.readFileSync(IN,'utf8'));w=w.nodes?w:(w.data||w);
const A="={{ JSON.stringify($('Alternate Merge').first().json.enforcer_log_body) }}";
const DEDUP="(b=>{if(!b||!Array.isArray(b.p_rows))return b;const R=b.p_rows;const seen={};const rows=R.map((r,i)=>{const o=Object.assign({},r);['prompt_sent','full_reply'].forEach(f=>{const t=o[f];if(typeof t!=='string'||t.length<2000)return;const k=f+'|'+t;if(seen[k]){o[f]=seen[k];}else{seen[k]='[SAME '+f+' AS row '+(i+1)+' of this run\\'s log: seat '+o.seat+', kind '+o.kind+', rule '+o.rule+', item '+o.item+']';}});return o;});return Object.assign({},b,{p_rows:rows});})";
const B="={{ JSON.stringify("+DEDUP+"($('Alternate Merge').first().json.enforcer_log_body)) }}";
const n=w.nodes.find(x=>x.name==='Write Enforcer Log');if(!n)throw new Error('no Write Enforcer Log');if(n.parameters.jsonBody!==A)throw new Error('jsonBody is not the expected base: '+n.parameters.jsonBody);
n.parameters.jsonBody=B;fs.writeFileSync(OUTW,JSON.stringify(w));
const plan={base:IN,node:'Write Enforcer Log',field:'parameters.jsonBody',base_value:A,final_value:B,base_sha:sha(A),final_sha:sha(B)};fs.writeFileSync('pkgLOG/plan_LOG.json',JSON.stringify(plan,null,1));
console.log('Write Enforcer Log jsonBody',plan.base_sha,'->',plan.final_sha);module.exports={DEDUP,A,B};
