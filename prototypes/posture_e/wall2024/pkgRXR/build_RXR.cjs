// pkgRXR (W3 grade_33299 item 3, Wall 2790): a RETRACTED line's reason may be the item's own RESPONSE line, when that line names a round ([CR3] etc.)
// and quotes 3 or more words that stand in that round (cureFound). Before, cureReasoned read STATEMENT lines, prose and the RETRACTED line's own reason,
// not RESPONSE lines. Run 33299 chatgpt D5 vs C5 and D6 vs C6: RESPONSE "Accepted: [CR3] names Luke 2:48 and says, 'These are household usage ...'" and
// "Accepted: [CR3] names Luke 1:27 and says, 'That is the legal house, granted.'" were not read, so both retractions were refused (rxNoWhy) and chatgpt was removed.
// The rounds reach cureReasoned as a third argument from cureVerdicts; cureCorrected and cureRecompute (called after cureVerdicts for the same seat) use the
// rounds cureVerdicts last saw, so all three read the same reasons.
// Base: live 44e800f1 (fetchback_live_s32.json). With --on <dir>, a node's base is <dir>/<file> when it exists.
// Run from wall2024/: node pkgRXR/build_RXR.cjs [--on pkgPSN/patched_on_pkgUNXL_patched]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const i=process.argv.indexOf('--on');const ON=i>0?process.argv[i+1]:null;const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s32.json','utf8'));const L=(W.data||W);
const E=[["function cureReasoned(o,flags){const U=s=>String(s).toUpperCase();const out=new Set();",
 "var __RXR_R=null; /* pkgRXR: the rounds of the last cureVerdicts call (one debate per run: the same rounds for every seat) */\nfunction cureReasoned(o,flags,R0){const U=s=>String(s).toUpperCase();const out=new Set();const __R=R0||__RXR_R;"],
 [".concat(o.withdrawn.filter(w=>w.reason).map(w=>({name:w.link+' '+strip(w.reason),body:strip(w.reason)})));",
  ".concat(o.withdrawn.filter(w=>w.reason).map(w=>({name:w.link+' '+strip(w.reason),body:strip(w.reason)})))"+
  ".concat((o.response||[]).filter(s=>{const b=String(s.text||'');const qs=[...b.matchAll(/[\"\\u201c]([^\"\\u201d]{8,})[\"\\u201d]|(?:^|[\\s(\\[{:;,])['\\u2018]([^\\n]{8,}?)['\\u2019](?=$|[\\s.,;:!?)\\]}\"\\u201d])/g)].map(m=>m[1]||m[2]);"+
  "return __R&&[...b.matchAll(/\\b([CD]R[1-4])\\b/gi)].some(m=>{const t=__R[m[1].toUpperCase()];return typeof t==='string'&&qs.some(q=>cureFound(q,t));});}).map(s=>({name:fold(s.label)+' '+strip(s.text),body:strip(s.text)}))); /* pkgRXR (W3 2790): the item's RESPONSE line, when it names a round and quotes words standing in it */"],
 ["function cureVerdicts(items,reply,broken,rounds){const U=s=>String(s).toUpperCase();const o=cureLines(reply&&reply.ok?reply.text:'');const R=rounds||{};",
  "function cureVerdicts(items,reply,broken,rounds){const U=s=>String(s).toUpperCase();const o=cureLines(reply&&reply.ok?reply.text:'');const R=rounds||{};__RXR_R=rounds||null; /* pkgRXR */"],
 ["const rsn=cureReasoned(o,items.map(x=>x.line));","const rsn=cureReasoned(o,items.map(x=>x.line),R);"]];
const tag=ON?ON.replace(/[\/]/g,'_'):'live';const OUT='pkgRXR/patched'+(ON?'_on_'+tag:'');const plan={source:'W3 grade_33299 item 3 (Wall 2790)',base:ON?ON+' (else live '+L.versionId+')':'live '+L.versionId,nodes:[]};fs.mkdirSync(OUT,{recursive:true});
for(const n of L.nodes){const live=n.parameters&&n.parameters.jsCode;if(!live||!live.includes('function cureReasoned('))continue;const f=n.name.replace(/ /g,'_')+'.js';
 const s0=ON&&fs.existsSync(ON+'/'+f)?fs.readFileSync(ON+'/'+f,'utf8'):live;let s=s0;
 for(const [a,b] of E){const c=s.split(a).length-1;if(c!==1)throw new Error(n.name+' anchor x'+c+': '+a.slice(0,50));s=s.replace(a,()=>b);}
 new Function('$','$input','$json','$execution','$workflow',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({name:n.name,file:f,base:s0===live?'live':ON,live_sha:sha(live),base_sha:sha(s0),final_sha:sha(s)});}
fs.writeFileSync('pkgRXR/plan_RXR'+(ON?'_on_'+tag:'')+'.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes -> '+OUT+' ('+plan.nodes.filter(x=>x.base!=='live').length+' on '+(ON||'-')+')');
