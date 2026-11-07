// pkgESR (rulings item 9; Eric 11:06 CST 11-07 "i approve all ... put in the live run"). DeepSeek enforcer fix, side-neutral.
// Data (every saved enforcer call 33218-33389, 50 calls): the cost of a call is DeepSeek's reasoning, not its reply. Completion tokens run 2K-64K with
// max_tokens 64000; 33299 Alt call 1 (63 items) stopped on finish_reason "length" at 64000 (47 items NO VERDICT); 33222 Main call 2 (84 items) timed
// out at 300 s with no data (89 rows NO VERDICT). A least-squares fit of completion tokens on the item count by rule: intercept 7979, E-ANS 314,
// E-VOID 5648, E-COL 1684, E-HOLD 508, E-KEY 5244, E-PREM 1043, E-RES 4613, E-SYN 328 (rmse 9605). Item counts predict a call's cost only roughly, so
// the fix has two parts:
// (1) Build: a call also closes when its estimated cost (those weights, 1500 for any other rule) would pass 40000 tokens, beside the 40000-character
//     limit. MAX_CALLS 8 -> 10, so the extra split does not leave items unchecked.
// (2) Retry: two new nodes per side, between the Call and the Record. "Judge Enforcer Retry Build" finds each call that came back with no reply, an
//     empty reply, an error or finish_reason "length", splits its items in two halves (whole items, by prompt size) and sends each half once more
//     ("Judge Enforcer Retry Needed?" -> "Judge Enforcer Retry Call deepseek", the same request settings as the Call). The Record reads the original
//     replies from the Call node and puts each failed call's halves and their replies in its place. A half that fails again stays NO VERDICT with its
//     error named. When no call failed, the Retry Build emits one marker item and the Record runs as before.
// Bases: Builds/Records = pkgEAI/patched_on_pkgEID. Workflow wiring: patched.wiring.json (nodes to add, connections to change), for W4.
// Run from wall2024/: node pkgESR/build_ESR.cjs [--ebase dir] [--out dir]
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};
const EB=arg('--ebase','pkgEAI/patched_on_pkgEID'),OUT=arg('--out',__dirname+'/patched');fs.mkdirSync(OUT,{recursive:true});
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s45.json','utf8'));

// (1) Build
const B0="const CALL_CHARS=40000,MAX_CALLS=8; /* pkgJEC (b): was 60000; every empty or failed enforcer call so far was a 60K+ prompt */const calls=[[]];let used=0;const not_checked=[];";
const B1="const CALL_CHARS=40000,MAX_CALLS=10; /* pkgJEC (b): was 60000; every empty or failed enforcer call so far was a 60K+ prompt */const calls=[[]];let used=0;const not_checked=[];\n/* pkgESR (1): a call also closes when its estimated DeepSeek cost would pass ESR_CAP tokens (weights fitted on 50 saved calls, 33218-33389; MAX_CALLS was 8) */const ESR_W={'E-ANS':314,'E-VOID':5648,'E-COL':1684,'E-HOLD':508,'E-KEY':5244,'E-PREM':1043,'E-RES':4613,'E-SYN':328},ESR_BASE=7979,ESR_CAP=40000;let usedW=ESR_BASE;const esrW=it=>ESR_W[(it.ids&&it.ids[0]&&it.ids[0].rule)||'']||1500;";
const C0="for(const it of items){const sz=it.text.length+50;if(used+sz>CALL_CHARS&&calls[calls.length-1].length){";
const C1="for(const it of items){const sz=it.text.length+50;const __w=esrW(it);if((used+sz>CALL_CHARS||usedW+__w>ESR_CAP)&&calls[calls.length-1].length){";
const D0="calls.push([]);used=0;}calls[calls.length-1].push(it);used+=sz;}";
const D1="calls.push([]);used=0;usedW=ESR_BASE;}calls[calls.length-1].push(it);used+=sz;usedW+=__w;}";
const E_BUILD=[[B0,B1],[C0,C1],[D0,D1]];

// (2) Record: original replies from the Call node; failed calls replaced by their retried halves
const R0="const R=$input.all().map(x=>x.json);const V={};";
const recR=(call,rb,rc)=>`let R=(()=>{try{if($('${call}').isExecuted)return $('${call}').all().map(x=>x.json);}catch(e){}return $input.all().map(x=>x.json);})(); /* pkgESR: the original replies come from the Call node, whichever branch reached this node */
const __esr={retried:[],halves:0,why:{}};try{if($('${rc}').isExecuted){const RB=$('${rb}').all().map(x=>x.json),RR=$('${rc}').all().map(x=>x.json);const nb=[],nr=[];
 B.forEach((b,i)=>{const hs=RB.map((h,k)=>({h,r:RR[k]})).filter(z=>z.h&&z.h.esr_retry===true&&z.h.esr_of===i);if(!hs.length){nb.push(b);nr.push(R[i]);return;}
  __esr.retried.push(i+1);__esr.why[i+1]=hs[0].h.esr_why;for(const z of hs){__esr.halves++;nb.push({...b,ids:z.h.ids,body:z.h.body,code_rows:[],esr_half:z.h.esr_half});nr.push(z.r||{});}});
 const cr=(B[0]&&B[0].code_rows)||[];B=nb;if(B[0])B[0]={...B[0],code_rows:cr};R=nr;}}catch(e){__esr.error=String(e&&e.message||e).slice(0,200);}
const V={};`;
const E_REC=(call,rb,rc)=>[["const B=$('","let B=$('"],[R0,recR(call,rb,rc)],["errors,eid:__eid}","errors,eid:__eid,esr:__esr}"]];

// Retry Build node code
const retryCode=(bn)=>`// pkgESR (rulings item 9): each enforcer call that came back with no reply, an empty reply, an error or finish_reason "length" is split into two
// halves of whole items and sent once more. Emits one marker item ({esr_retry:false}) when no call failed.
const B=$('${bn}').all().map(x=>x.json);const R=$input.all().map(x=>x.json);
const why=r=>{if(!r)return 'no reply';if(r.error)return 'error: '+String(r.error.message||JSON.stringify(r.error)).slice(0,160);const c=r.choices&&r.choices[0];if(!c)return 'no choices ('+String(r.message||Object.keys(r).slice(0,6).join(',')).slice(0,120)+')';
 if(c.finish_reason==='length')return 'finish_reason length (the reply was cut at the token cap)';if(!String((c.message&&c.message.content)||'').trim())return 'empty content';return null;};
const out=[];
B.forEach((b,i)=>{if(!b||b.je_skip||!Array.isArray(b.ids)||!b.body||!Array.isArray(b.body.messages))return;const w=why(R[i]);if(!w)return;
 const msg=String(b.body.messages[1]&&b.body.messages[1].content||'');const parts=msg.split(/\\n\\n(?=ITEM [A-Z]\\d+ \\()/);const head=parts[0];const its=parts.slice(1).map(t=>({t,p:(t.match(/^ITEM ([A-Z]\\d+) \\(/)||[])[1]}));
 if(its.length<2)return; /* one item cannot be split; it stays NO VERDICT */
 const own=p=>b.ids.filter(x=>String(x.id).split('.')[0]===p);if(its.some(x=>!x.p||!own(x.p).length)||its.reduce((a,x)=>a+own(x.p).length,0)!==b.ids.length)return; /* every id must belong to exactly one item text */
 const tot=its.reduce((a,x)=>a+x.t.length,0);let acc=0,cut=1;for(let k=0;k<its.length-1;k++){acc+=its[k].t.length;if(acc>=tot/2){cut=k+1;break;}cut=k+1;}
 [its.slice(0,cut),its.slice(cut)].forEach((g,h)=>{if(!g.length)return;const body={...b.body,messages:[b.body.messages[0],{...b.body.messages[1],content:head+'\\n\\n'+g.map(x=>x.t).join('\\n\\n')}]};
  out.push({json:{esr_retry:true,esr_of:i,esr_half:h+1,esr_why:w,ids:g.flatMap(x=>own(x.p)),body,model:b.model,run_token:b.run_token}});});});
return out.length?out:[{json:{esr_retry:false}}];`;

const rep=(s,a,b,nm)=>{const c=s.split(a).length-1;if(c!==1)throw new Error(nm+' anchor x'+c+': '+a.slice(0,70));return s.replace(a,()=>b);};
const plan={source:'W2 pkgESR, rulings item 9 (enforcer calls sized by estimated cost; split and retry a failed call)',ebase:EB,nodes:[]};
const job=(name,E,src)=>{const f=name.replace(/ /g,'_')+'.js';const s0=src!=null?src:fs.readFileSync(EB+'/'+f,'utf8');let s=s0;for(const [a,b] of E)s=rep(s,a,b,name);
 new Function('$','$input','$json','$execution','$workflow','$node','$items',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({name,file:f,base_sha:src!=null?'(new node)':sha(s0),final_sha:sha(s),bytes:[src!=null?0:s0.length,s.length]});};
job('Judge Enforcer Build',E_BUILD);job('Alt Judge Enforcer Build',E_BUILD);
job('Judge Enforcer Record',E_REC('Judge Enforcer Call deepseek','Judge Enforcer Retry Build','Judge Enforcer Retry Call deepseek'));
job('Alt Judge Enforcer Record',E_REC('Alt Judge Enforcer Call deepseek','Alt Judge Enforcer Retry Build','Alt Judge Enforcer Retry Call deepseek'));
job('Judge Enforcer Retry Build',[],retryCode('Judge Enforcer Build'));job('Alt Judge Enforcer Retry Build',[],retryCode('Alt Judge Enforcer Build'));
// wiring for W4
const N=n=>W.nodes.find(z=>z.name===n);const uid=s=>{const h=crypto.createHash('sha256').update('pkgESR '+s).digest('hex');return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20,32);};
const wiring={add:[],connections_set:{}};
for(const pre of ['','Alt ']){const call=N(pre+'Judge Enforcer Call deepseek'),need=N(pre+'Judge Enforcer Needed?'),rec=N(pre+'Judge Enforcer Record');const [x,y]=call.position;
 const rb=pre+'Judge Enforcer Retry Build',rn=pre+'Judge Enforcer Retry Needed?',rc=pre+'Judge Enforcer Retry Call deepseek';
 wiring.add.push({id:uid(rb),name:rb,type:'n8n-nodes-base.code',typeVersion:2,position:[x+110,y+220],parameters:{jsCode:'(from patched/'+rb.replace(/ /g,'_')+'.js)'}});
 wiring.add.push({id:uid(rn),name:rn,type:'n8n-nodes-base.if',typeVersion:2.2,position:[x+220,y+220],parameters:{conditions:{combinator:'and',conditions:[{id:uid(rn+' c'),leftValue:'={{ $json.esr_retry === true }}',operator:{operation:'true',singleValue:true,type:'boolean'},rightValue:''}],options:{caseSensitive:true,leftValue:'',typeValidation:'loose'}},options:{}}});
 wiring.add.push({...JSON.parse(JSON.stringify(call)),id:uid(rc),name:rc,position:[x+330,y+220]}); /* the same request settings, credentials and retry options as the Call */
 wiring.connections_set[call.name]={main:[[{node:rb,type:'main',index:0}]]};
 wiring.connections_set[rb]={main:[[{node:rn,type:'main',index:0}]]};
 wiring.connections_set[rn]={main:[[{node:rc,type:'main',index:0}],[{node:rec.name,type:'main',index:0}]]};
 wiring.connections_set[rc]={main:[[{node:rec.name,type:'main',index:0}]]};
 wiring.unchanged_note=(wiring.unchanged_note||'')+need.name+' keeps its false branch to '+rec.name+' (the je_skip path). ';}
fs.writeFileSync(OUT+'.wiring.json',JSON.stringify(wiring,null,1));
fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));console.log(plan.nodes.map(n=>n.name+' '+n.base_sha+'->'+n.final_sha).join('\n'));
