// pkgEAX (W3 grade_33389 fault 2 proposal; W1 independent check Wall 2900). DeepSeek enforcer fix, Record only (Judge Enforcer Record, Alt).
// An E-ANS "DISAGREE (right: MISSES)" whose reason calls the answer a grant or says it gives no fit is HELD ("ENFORCER HELD (pkgEAX, not sent; ...)",
// which Send Back does not send) when the layered answer holding the quoted words, in the round the item names, carries 3+ distinct [Ln] tags, or
// 1+ tag and a fit sentence after the words (eax_lib.js). The rounds are read in the Record (no copy in the items). A truly bare grant is still sent.
// TRIAL (--status TRIAL): the row gets "(TRIAL pkgEAX: would not be sent: ...)" only. Run from wall2024/: node pkgEAX/build_EAI.cjs [--base dir] [--status S] [--out dir]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};
const BASE=arg('--base','pkgEAI/patched_on_pkgEID'),ST=arg('--status','LIVE'),OUT=arg('--out','pkgEAX/'+(ST==='LIVE'?'patched_live':'patched'));
const LIB=fs.readFileSync(__dirname+'/eax_lib.js','utf8');
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor x'+n);return s.split(a).join(b);};
const A="rows.push(...CODE);";
const INS="/* pkgEAX (W1 Wall 2900; residual to W2's pkgEAI) */\n"+LIB+"const EAX_STATUS='"+ST+"';let __eaxHeld=0;{let RR=null;for(const f of [()=>$('Panel Cure Normalize 1'),()=>$('Panel Cure Normalize 2'),()=>$('Panel Cure Normalize 3')]){try{const nd=f();if(nd.isExecuted)for(const it of nd.all()){const c=it.json&&it.json.cure;if(c&&c.rounds){RR=c.rounds;break;}}}catch(e){}if(RR)break;}\n"+
 "if(RR)for(const r of rows){if(r.rule!=='E-ANS')continue;const m=String(r.cure_reason||'').match(/^ENFORCER DISAGREE \\(right: MISSES\\): ([\\s\\S]*?) \\(judge wrote /);if(!m)continue;let n=null;try{n=eaxHold(m[1],r.item,RR);}catch(e){n=null;}if(!n)continue;__eaxHeld++;const note=n.replace(/[()]/g,' ');\n"+
 " r.cure_reason=EAX_STATUS==='LIVE'?r.cure_reason.replace(/^ENFORCER DISAGREE/,'ENFORCER HELD (pkgEAX, not sent; W1 2900: '+note+')'):r.cure_reason+' (TRIAL pkgEAX: would not be sent: '+note+')';}}\n"+A;
fs.mkdirSync(OUT,{recursive:true});const plan={base:BASE,status:ST,nodes:[]};
for(const f of ['Judge_Enforcer_Record.js','Alt_Judge_Enforcer_Record.js']){const s0=fs.readFileSync(BASE+'/'+f,'utf8');const s=rep(s0,A,INS,f);new Function(s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base_sha:sha(s0),final_sha:sha(s)});console.log(f.padEnd(30),sha(s0),'->',sha(s));}
for(const f of ['Judge_Enforcer_Build.js','Alt_Judge_Enforcer_Build.js']){fs.copyFileSync(BASE+'/'+f,OUT+'/'+f);plan.nodes.push({file:f,base_sha:sha(fs.readFileSync(BASE+'/'+f,'utf8')),final_sha:'unchanged (carried from base)'});}
fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));console.log('->',OUT);
