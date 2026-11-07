// pkgMEM (W2; Eric approved 07:59 CST 11-07 "approved", items 1 and 2 of the coordinator's bundle): two memory cuts on the alternate path.
// Part 1 pkgDUP: Alternate Merge Seat and Alternate Merge stop carrying enforcer_log_body (a second full copy of enforcer_log). Write Enforcer Log builds
//   the same body itself: {p_debate_id: debate_id||null, p_run_token: Init Seats run_token, p_rows: enforcer_log}. On 33218-33299 the old body equals that
//   object exactly (keys, order, rows).
// Part 2 pkgPRD: enfRows writes the cure prompt and reply in full on the FIRST row of a cure call only; the other rows of that call carry a short token
//   [[PRD:<field>:<length>:<fnv32>]] when the text is 2000 chars or more (the threshold Write Enforcer Log already uses for its SAME marker). Write Enforcer
//   Log expands every token back to its full text before its existing SAME pass, so the rows sent to record_enforcer_log are byte-identical to today's.
//   No node reads prompt_sent or full_reply of a log row (all 50 occurrences in s39 are writers).
// Base per node: --on <dir> file if present, else live ae5636d0 (fetchback_live_s39.json). Run from wall2024/: node pkgMEM/build_MEM.cjs [--on pkgDPT/patched]
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const i0=process.argv.indexOf('--on');const ON=i0>0?process.argv[i0+1]:null;
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s39.json','utf8'));const L=(W.data||W);
const OUT='pkgMEM/patched'+(ON?'_on_'+ON.replace(/[\/]/g,'_'):'');fs.mkdirSync(OUT,{recursive:true});
const plan={source:'Eric approved 07:59 CST 11-07 (items 1 pkgDUP, 2 prompt dedupe)',base:(ON?ON+' > ':'')+'live '+L.versionId,nodes:[]};
const one=(s,a,b,name)=>{const c=s.split(a).length-1;if(c!==1)throw new Error(name+': anchor x'+c+': '+a.slice(0,60));return s.replace(a,()=>b);};
// Part 2 edits (enfRows), all 19 copies
const PRD_A="function enfRows(meta,v,reply,body){const T=new Date().toISOString();const ps=enfPrompt(body);const full=reply&&reply.ok?String(reply.text==null?'':reply.text):null;\n return (v||[]).map(x=>({";
const PRD_B="function prdTok(f,t){if(typeof t!=='string'||t.length<2000)return t;let h=0x811c9dc5;for(let i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return '[[PRD:'+f+':'+t.length+':'+h.toString(16)+']]';} /* pkgPRD: a repeat of the call's prompt or reply travels as a token; Write Enforcer Log expands it */\nfunction enfRows(meta,v,reply,body){const T=new Date().toISOString();const ps=enfPrompt(body);const full=reply&&reply.ok?String(reply.text==null?'':reply.text):null;\n return (v||[]).map((x,__k)=>({";
const PRD_C="flagged_line:x.line||null,prompt_sent:ps,full_reply:full,";
const PRD_D="flagged_line:x.line||null,prompt_sent:__k?prdTok('prompt_sent',ps):ps,full_reply:__k?prdTok('full_reply',full):full,";
// Part 1 edits
const DUP_SEAT=[",enforcer_log_body:{p_debate_id:PP.debate_id||null,p_run_token:S.run_token,p_rows:enforcer_log}",""];
const DUP_M1=[",enforcer_log_body:{...__b,p_rows:(Array.isArray(__b.p_rows)?__b.p_rows:(AM.enforcer_log||[])).concat(__rk)}",""];
const DUP_M2=[",enforcer_log_body:{...(AM.enforcer_log_body||{}),p_rows:log}",""];
for(const n of L.nodes){const live=n.parameters&&n.parameters.jsCode;if(!live)continue;const f=n.name.replace(/ /g,'_')+'.js';
 const hasE=live.includes('function enfRows(');const isS=n.name==='Alternate Merge Seat',isM=n.name==='Alternate Merge';if(!hasE&&!isS&&!isM)continue;
 const s0=ON&&fs.existsSync(ON+'/'+f)?fs.readFileSync(ON+'/'+f,'utf8'):live;let s=s0;const did=[];
 if(hasE){s=one(s,PRD_A,PRD_B,n.name);s=one(s,PRD_C,PRD_D,n.name);did.push('PRD');}
 if(isS){s=one(s,DUP_SEAT[0],DUP_SEAT[1],n.name);did.push('DUP');}
 if(isM){s=one(s,DUP_M1[0],DUP_M1[1],n.name);s=one(s,DUP_M2[0],DUP_M2[1],n.name);did.push('DUP');}
 if(s.includes('enforcer_log_body:'))throw new Error(n.name+' still writes enforcer_log_body');
 new Function('$','$input','$json','$execution','$workflow',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({name:n.name,file:f,parts:did,base:s0===live?'live':ON,live_sha:sha(live),base_sha:sha(s0),final_sha:sha(s)});}
// Write Enforcer Log (HTTP node, jsonBody expression)
const WN=L.nodes.find(n=>n.name==='Write Enforcer Log');const jb0=WN.parameters.jsonBody;
const OLD_SRC="$('Alternate Merge').first().json.enforcer_log_body";
const NEW_SRC="(j=>({p_debate_id:j.debate_id||null,p_run_token:$('Init Seats').first().json.run_token,p_rows:j.enforcer_log}))($('Alternate Merge').first().json)";
const OLD_HEAD="(b=>{if(!b||!Array.isArray(b.p_rows))return b;const R=b.p_rows;";
const NEW_HEAD="(b=>{if(!b||!Array.isArray(b.p_rows))return b;const R=(R0=>{const H=t=>{let h=0x811c9dc5;for(let i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h.toString(16);};const D={};R0.forEach(r=>['prompt_sent','full_reply'].forEach(f=>{const t=r&&r[f];if(typeof t==='string'&&t.length>=2000&&!t.startsWith('[[PRD:'))D['[[PRD:'+f+':'+t.length+':'+H(t)+']]']=t;}));return R0.map(r=>{if(!r)return r;let o=r;['prompt_sent','full_reply'].forEach(f=>{const t=r[f];if(typeof t==='string'&&t.startsWith('[[PRD:')&&D[t]!==undefined){if(o===r)o=Object.assign({},r);o[f]=D[t];}});return o;});})(b.p_rows);";
let jb=one(jb0,OLD_SRC,NEW_SRC,'Write Enforcer Log');jb=one(jb,OLD_HEAD,NEW_HEAD,'Write Enforcer Log');
fs.writeFileSync(OUT+'/Write_Enforcer_Log.jsonBody.txt',jb);plan.nodes.push({name:'Write Enforcer Log',file:'Write_Enforcer_Log.jsonBody.txt',parts:['DUP','PRD'],base:'live',live_sha:sha(jb0),final_sha:sha(jb)});
fs.writeFileSync('pkgMEM/plan_MEM'+(ON?'_on_'+ON.replace(/[\/]/g,'_'):'')+'.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes -> '+OUT+' ('+plan.nodes.filter(x=>x.base&&x.base!=='live').length+' on '+(ON||'-')+')');
