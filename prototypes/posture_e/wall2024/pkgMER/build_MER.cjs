// pkgMER build. Run from wall2024/: node pkgMER/build_MER.cjs [live fetchback, default s62]
// Writes pkgMER/out/: nodes_new.json (Enforcer Retry Build, Enforcer Retry Needed?, Enforcer Retry Call deepseek), Enforcer_Record.js (patched), plan_MER.json.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const F=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s62.json';const W=JSON.parse(fs.readFileSync(F,'utf8'));const N=n=>W.nodes.find(x=>x.name===n);
const OUT='pkgMER/out/';fs.mkdirSync(OUT,{recursive:true});
const REC0=N('Enforcer Record').parameters.jsCode;
const A="let rep=null;try{if($('Enforcer Call deepseek').isExecuted)rep=$('Enforcer Call deepseek').first().json;}catch(e){rep=null;}\n";
const A2=A+"/* pkgMER: when the call failed, Enforcer Retry Build cut it into parts of whole ITEMs and Enforcer Retry Call deepseek sent each once; the parts' replies take the call's place.\n   A part that fails again leaves its ids NO VERDICT, with that part's failure as their reply_error. */\n"
 +"let __MP=[];try{if($('Enforcer Retry Call deepseek').isExecuted){const RB=$('Enforcer Retry Build').all().map(x=>x.json);const RC=$('Enforcer Retry Call deepseek').all().map(x=>x.json);__MP=RB.map((x,i)=>({x,rep:RC[i]})).filter(z=>z.x&&z.x.esr_retry===true);}}catch(e){__MP=[];}\n";
const Bx="if(!B.enf_skip){const e=env(rep);";
const B2="const __mEnv=j=>{const v=env(j);if(v.ok&&!String(v.text).trim()){const c=j&&j.choices&&j.choices[0];return {ok:false,why:'empty content (finish_reason '+((c&&c.finish_reason)||'none')+')'};}return v;}; /* pkgMER: an empty reply is a failure */\n"+"if(!B.enf_skip){let e=env(rep);const __ME={};if(__MP.length){const ps=__MP.map(z=>({ids:(z.x.ids||[]).map(y=>String(y.id).toUpperCase()),e:__mEnv(z.rep),part:z.x.esr_part}));\n"
 +" for(const p of ps)if(!p.e.ok)for(const id of p.ids)__ME[id]='pkgMER retry part '+p.part+' of '+ps.length+': '+p.e.why;\n"
 +" e=ps.some(p=>p.e.ok)?{ok:true,text:ps.filter(p=>p.e.ok).map(p=>p.e.text).join('\\n')}:{ok:false,why:'pkgMER: every retry part failed ('+ps.map(p=>p.e.why).join(' | ').slice(0,280)+')'};}";
const C="full_reply:k===0&&e.ok?e.text:null,reply_error:e.ok?null:e.why,";
const C2="full_reply:k===0&&e.ok?e.text:null,reply_error:__MP.length?(e.ok?(__ME[String(x.id).toUpperCase()]||null):e.why):(e.ok?null:e.why),";
const Dx="tally},enf421_rows:rows}}];";
const D2="tally,...(__MP.length?{mer:{retried:__MP[0].x.esr_why,parts:__MP.length,failed_parts:__MP.filter(z=>!__mEnv(z.rep).ok).map(z=>z.x.esr_part)}}:{})},enf421_rows:rows}}];";
let R=REC0;for(const [a,b] of [[A,A2],[Bx,B2],[C,C2],[Dx,D2]]){if(R.split(a).length!==2)throw new Error('anchor not found once: '+a.slice(0,60));R=R.replace(a,()=>b);}
fs.writeFileSync(OUT+'Enforcer_Record.js',R);
const RB=fs.readFileSync('pkgMER/retry_build.js','utf8');
const EC=N('Enforcer Call deepseek'),JRN=N('Judge Enforcer Retry Needed?'),JRC=N('Judge Enforcer Retry Call deepseek');const P=EC.position;
const cl=x=>JSON.parse(JSON.stringify(x));
const ifp=cl(JRN.parameters);ifp.conditions.conditions[0].id='7d2e5f10-3c1a-4b8e-9f21-6a0d4c2b9e51';
const rc=cl(JRC);delete rc.id;
const nodes=[{name:'Enforcer Retry Build',type:'n8n-nodes-base.code',typeVersion:2,position:[P[0]+110,P[1]+380],parameters:{jsCode:RB}},
 {name:'Enforcer Retry Needed?',type:'n8n-nodes-base.if',typeVersion:2.2,position:[P[0]+220,P[1]+380],parameters:ifp},
 {...rc,name:'Enforcer Retry Call deepseek',position:[P[0]+330,P[1]+380]}];
fs.writeFileSync(OUT+'nodes_new.json',JSON.stringify(nodes,null,1));
const plan={base:F,base_versionId:W.versionId,
 update:{'Enforcer Record':{from:sha(REC0),to:sha(R)}},
 add_nodes:nodes.map(n=>n.name),
 connections:{remove:[['Enforcer Call deepseek',0,'Enforcer Record',0]],
  add:[['Enforcer Call deepseek',0,'Enforcer Retry Build',0],['Enforcer Retry Build',0,'Enforcer Retry Needed?',0],['Enforcer Retry Needed?',0,'Enforcer Retry Call deepseek',0],
   ['Enforcer Retry Needed?',1,'Enforcer Record',0],['Enforcer Retry Call deepseek',0,'Enforcer Record',0]]},
 keep:'Enforcer Needed? false branch -> Enforcer Record (unchanged). Enforcer Call deepseek settings unchanged.',
 retry_call:{copied_from:'Judge Enforcer Retry Call deepseek',retryOnFail:rc.retryOnFail,maxTries:rc.maxTries,options:rc.parameters.options,credential:rc.credentials}};
fs.writeFileSync(OUT+'plan_MER.json',JSON.stringify(plan,null,1));
console.log('Enforcer Record',sha(REC0),'->',sha(R),'; Retry Build',sha(RB),'; nodes',nodes.length);
