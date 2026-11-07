// pkgESK (W4 33430 report finding 3; DeepSeek enforcer fix). A SHORT reply is retried too: run 33430 Judge Enforcer call 5 sent 26 ids and came back
// finish_reason "stop" with one line (Y1.1), so 25 checks got NO VERDICT and pkgESR did not retry (it retried only no reply, error, empty, length).
// Retry Build (main, Alt): for a call with a reply, each item (ITEM block) counts as answered when an ENFORCER line names one of its ids, or its bare
// item label (Y1), anywhere in the line's label part (so "P1.1 (gemini)", "gemini (P1.1)", "grok (H1)" count). A reply that names no id at all but has
// as many ENFORCER lines as ids (the seat-only form pkgEID maps by order) counts as whole. When some items are unanswered, only those are sent again:
// one call for one item, else two halves of whole items, as pkgESR does. The marker carries esr_short:true and esr_keep (the ids the reply answered).
// Record (main, Alt): for a short-reply call the original reply is read for esr_keep (every id it answered) and the halves only for the other ids
// (a half sends whole items, so it may repeat an answered id; that answer is not read). No id is read twice, and an answered id is never dropped. A failed call (pkgESR) is replaced by its halves as before.
// Bases: Retry Builds pkgESR/patched_on_pkgEAX; Records pkgEIS/patched (live in 33442). Run from wall2024/: node pkgESK/build_ESK.cjs [--rbase dir] [--ebase dir] [--out dir]
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};const RB=arg('--rbase','pkgESR/patched_on_pkgEAX'),EB=arg('--ebase','pkgEIS/patched'),OUT=arg('--out',__dirname+"/patched");fs.mkdirSync(OUT,{recursive:true});
const rep=(s,a,b,nm)=>{const c=s.split(a).length-1;if(c!==1)throw new Error(nm+' anchor x'+c+': '+a.slice(0,60));return s.replace(a,()=>b);};
const B0="B.forEach((b,i)=>{if(!b||b.je_skip||!Array.isArray(b.ids)||!b.body||!Array.isArray(b.body.messages))return;const w=why(R[i]);if(!w)return;";
const B1=`/* pkgESK (W4 33430): a reply that answers fewer items than were sent is retried for the unanswered items only */
const __essAns=(b,r)=>{const c=r&&r.choices&&r.choices[0];const txt=String(c&&c.message&&c.message.content||'');const L=txt.split('\\n').map(l=>l.replace(/[*_\`]+/g,'').trim()).filter(l=>/^ENFORCER\\s*:/i.test(l)).map(l=>l.replace(/^ENFORCER\\s*:\\s*/i,'').split(/\\s+(?:--|—|–)\\s+|\\s+-\\s+/)[0].toUpperCase());
 const toks=new Set(L.flatMap(l=>l.match(/[A-Z]\\d+(?:\\.\\d+)?/g)||[]));const hit=new Set(b.ids.filter(x=>{const id=String(x.id).toUpperCase();return toks.has(id)||toks.has(id.split('.')[0]);}).map(x=>x.id));
 if(!toks.size&&L.length>=b.ids.length)return new Set(b.ids.map(x=>x.id));return hit;};
B.forEach((b,i)=>{if(!b||b.je_skip||!Array.isArray(b.ids)||!b.body||!Array.isArray(b.body.messages))return;let w=why(R[i]);let __keep=null;
 if(!w){const a=__essAns(b,R[i]);if(a.size>=b.ids.length)return;__keep=[...a];w='short reply: '+a.size+' of '+b.ids.length+' ids answered (finish_reason '+String(((R[i].choices||[])[0]||{}).finish_reason)+')';}`;
const C0=" if(its.length<2)return; /* one item cannot be split; it stays NO VERDICT */";
const C1=" const __all=its.slice();if(__keep){const ks=new Set(__keep);its.splice(0,its.length,...its.filter(x=>b.ids.filter(y=>String(y.id).split('.')[0]===x.p).some(y=>!ks.has(y.id))));} /* pkgESK: only unanswered items */\n if(!__keep&&its.length<2)return; /* one item cannot be split; it stays NO VERDICT */\n if(!its.length)return;";
const D0=" const own=p=>b.ids.filter(x=>String(x.id).split('.')[0]===p);if(its.some(x=>!x.p||!own(x.p).length)||its.reduce((a,x)=>a+own(x.p).length,0)!==b.ids.length)return; /* every id must belong to exactly one item text */";
const D1=" const own=p=>b.ids.filter(x=>String(x.id).split('.')[0]===p);if(__all.some(x=>!x.p||!own(x.p).length)||__all.reduce((a,x)=>a+own(x.p).length,0)!==b.ids.length)return; /* every id must belong to exactly one item text */";
const F0="out.push({json:{esr_retry:true,esr_of:i,esr_half:h+1,esr_why:w,ids:g.flatMap(x=>own(x.p)),body,model:b.model,run_token:b.run_token}});";
const F1="out.push({json:{esr_retry:true,esr_of:i,esr_half:h+1,esr_why:w,ids:g.flatMap(x=>own(x.p)),body,model:b.model,run_token:b.run_token,...(__keep?{esr_short:true,esr_keep:__keep}:{})}});";
const G0="__esr.retried.push(i+1);__esr.why[i+1]=hs[0].h.esr_why;for(const z of hs){";
const G1="__esr.retried.push(i+1);__esr.why[i+1]=hs[0].h.esr_why;if(hs[0].h.esr_short){const ks=new Set(hs[0].h.esr_keep||[]);nb.push({...b,ids:b.ids.filter(x=>ks.has(x.id))});nr.push(R[i]);__esr.short=(__esr.short||0)+1;} /* pkgESK: a short reply keeps the ids it answered */for(const z of hs){const __ks=z.h.esr_short?new Set(z.h.esr_keep||[]):null;";
const H0="nb.push({...b,ids:z.h.ids,",H1="nb.push({...b,ids:__ks?z.h.ids.filter(x=>!__ks.has(x.id)):z.h.ids,...(__ks?{esr_skip:[...__ks].map(x=>String(x).toUpperCase())}:{}),";
const I0="  if(m){if(/^ENFORCER",I1="  if(m&&((B[i]||{}).esr_skip||[]).includes(String(m[1]).toUpperCase()))continue; /* pkgESK: an answered id the half repeats is not read again */\n  if(m){if(/^ENFORCER";
const plan={source:'W2 pkgESK (33430 short reply retry)',nodes:[]};
for(const pre of ['','Alt ']){
 {const name=pre+'Judge Enforcer Retry Build',f=name.replace(/ /g,'_')+'.js';const s0=fs.readFileSync(RB+'/'+f,'utf8');let s=s0;for(const [a,b] of [[B0,B1],[C0,C1],[D0,D1],[F0,F1]])s=rep(s,a,b,name);
  new Function('$','$input','$json','$execution','$workflow','$node','$items',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({name,file:f,base:RB,base_sha:sha(s0),final_sha:sha(s)});}
 {const name=pre+'Judge Enforcer Record',f=name.replace(/ /g,'_')+'.js';const s0=fs.readFileSync(EB+'/'+f,'utf8');const s=rep(rep(rep(s0,G0,G1,name),H0,H1,name),I0,I1,name);
  new Function('$','$input','$json','$execution','$workflow','$node','$items',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({name,file:f,base:EB,base_sha:sha(s0),final_sha:sha(s)});}}
fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));console.log(plan.nodes.map(n=>n.name+' '+n.base_sha+'->'+n.final_sha).join('\n'));
