// pkgASE (W3 2784 item 4, from W1 2782 item 5; TRIAL, record-only, side-neutral): after the send-back, an E-PREM CHANGE TO whose ASSUMES clause holds
// a 5-word run that stands in the enforcer's reason (reason_full when pkgEPK cut it) and in no round is recorded as "ASSUMES from the enforcer, not the record".
// Run 33289 grok S1 (log 12461): ASSUMES "the throne's gift comes by a road apart from David's loins"; the E-PREM reason said "the assumed road \"apart from
// David's loins\""; no round holds "road apart from davids loins". 5 words, not 6: the shared run there is 5 words once the apostrophe is dropped (the N of enf428Cure).
// Nodes: Send Back Record, Alt Send Back Record. Base: pkgPSN/patched (both nodes are in pkgPSN); --on-live builds on live a353b9e8 (fetchback_live_s31.json).
// Run from wall2024/: node pkgPSN/build_PSN.cjs && node pkgASE/build_ASE.cjs [--on-live]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const ONLIVE=process.argv.includes('--on-live');const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s31.json','utf8'));const L=(W.data||W);
const ADD=`/* pkgASE (W3 2784 item 4; TRIAL, record-only): an E-PREM CHANGE TO whose ASSUMES clause holds a 5-word run found in the enforcer's reason and in no round */
{const __N=s=>String(s==null?'':s).toLowerCase().replace(/\\\\+"/g,'"').replace(/[‘’“”"'\`*_]/g,'').replace(/[—–-]/g,' ').replace(/[^a-z0-9Ͱ-Ͽἀ-῿֐-׿ ]+/g,' ').replace(/\\s+/g,' ').trim();
 const __rt=(__RD&&typeof __RD==='object')?' '+Object.values(__RD).filter(v=>typeof v==='string').map(__N).join(' | ')+' ':'';
 if(__rt.trim())for(const s of shown){if(s.rule!=='E-PREM'||s.ans!=='CHANGE')continue;const m=String(s.to||'').replace(/\\\\+"/g,'"').match(/\\bASSUMES\\b\\s*:?\\s*([\\s\\S]*?)(?=\\s*--\\s*ROWS\\s+GIVE\\b|\\bROWS\\s+GIVE\\b|$)/i);if(!m)continue;
  const b=B.find(x=>x.seat===s.seat)||{};const it=(b.items||[]).find(y=>y.sid===s.sid)||{};const rs=' '+__N(it.reason_full||it.reason||s.reason)+' ';const w=__N(m[1]).split(' ').filter(Boolean);let hit=null;
  for(let i=0;i+5<=w.length&&!hit;i++){const r=' '+w.slice(i,i+5).join(' ')+' ';if(rs.includes(r)&&!__rt.includes(r))hit=r.trim();}if(!hit)continue;
  rows.push({run_token:b.run_token||null,seat:s.seat,seat_role:ROLE,judge_model:b.api_model||null,kind:'send_back',rule:'E-ASE',item:s.sid+' '+String(s.item||'').slice(0,80),flagged_line:String(s.to||'').slice(0,1500),prompt_sent:null,full_reply:null,reply_error:null,response_line:null,cure_status:'UNCURED',
   cure_reason:'RECORD-ONLY (TRIAL, pkgASE; it removes no seat): ASSUMES from the enforcer, not the record: the ASSUMES clause holds "'+hit+'", which stands in the E-PREM reason and in no round',at:T});}}
let bodies=null,anySil=false;`;
const plan={source:'W3 2784 item 4',base:ONLIVE?'live '+L.versionId:'pkgPSN/patched (on live '+L.versionId+')',nodes:[]};const OUT=ONLIVE?'pkgASE/patched_on_live':'pkgASE/patched';fs.mkdirSync(OUT,{recursive:true});
for(const [name,role] of [['Send Back Record','panel'],['Alt Send Back Record','alternate']]){const f=name.replace(/ /g,'_')+'.js';const live=L.nodes.find(z=>z.name===name).parameters.jsCode;const s0=ONLIVE?live:fs.readFileSync('pkgPSN/patched/'+f,'utf8');
 const a='let bodies=null,anySil=false;';const c=s0.split(a).length-1;if(c!==1)throw new Error(name+' anchor x'+c);const s=s0.replace(a,()=>ADD.replace('seat_role:ROLE',"seat_role:'"+role+"'"));
 new Function('$','$input','$json','$execution','$workflow',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({name,file:f,live_sha:sha(live),base_sha:sha(s0),final_sha:sha(s)});}
fs.writeFileSync(ONLIVE?'pkgASE/plan_ASE_on_live.json':'pkgASE/plan_ASE.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes -> '+OUT);
