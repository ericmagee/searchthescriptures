// pkgERS (W1; run 35296 F2, W4 first reading; W1 Wall 5087 second reading): a DeepSeek enforcer retry half that comes back with no reply
// (transport error such as {"error":"aborted"}: no choices) is sent once more. The Retry Call nodes carry retryOnFail, but with
// onError continueRegularOutput the HTTP node returns the error as an item and never throws, so n8n's retry never runs.
// For each of the four retry paths P (Enforcer, Judge Enforcer, Alt Judge Enforcer, R2 Alt Judge Enforcer):
// 1. New Code "P Resend Build": the retry halves whose reply has no choices, with the same body; else one {ers_resend:false} item.
// 2. New IF "P Resend Needed?" and new HTTP "P Resend Call deepseek" (a copy of P Retry Call deepseek).
// 3. Wiring: P Retry Call deepseek -> P Resend Build -> P Resend Needed? -> (true) P Resend Call deepseek -> P Record; (false) -> P Record.
// 4. P Record puts each resent reply in place of the failed one before it reads the halves; the Library Records count it in esr.resent.
// A length or empty-content half is not resent (the model, not the transport, failed). No prompt text changes.
// Usage: node build.cjs <parent workflow json> <out json>
const fs=require('fs'),crypto=require('crypto');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const byN=n=>{const x=W.nodes.find(z=>z.name===n);if(!x)throw new Error('no node '+n);return x;};
const one=(s,o,n,what)=>{if(s.split(o).length!==2)throw new Error('anchor not unique: '+what);return s.replace(o,()=>n);};
const C=W.connections;const cl=o=>JSON.parse(JSON.stringify(o));
const N=byN('Shared Library');const T=N.parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
if(T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)!==T)throw new Error('serialisation differs');
for(const P of ['Enforcer','Judge Enforcer','Alt Judge Enforcer','R2 Alt Judge Enforcer']){
 const RC=byN(P+' Retry Call deepseek'),RN=byN(P+' Retry Needed?'),REC=P+' Record';byN(REC);
 if(JSON.stringify(C[RC.name].main)!==JSON.stringify([[{node:REC,type:'main',index:0}]]))throw new Error(P+' retry wiring differs');
 const x0=RC.position[0],y0=RC.position[1];
 const SB={id:crypto.randomUUID(),name:P+' Resend Build',type:'n8n-nodes-base.code',typeVersion:2,position:[x0+110,y0+180],parameters:{jsCode:
  "const RB=$('"+P+" Retry Build').all().map(x=>x.json),RR=$input.all().map(x=>x.json),out=[]; /* pkgERS: a retry half with no reply (no choices) is sent once more */\n"+
  "RB.forEach((h,k)=>{const r=RR[k];if(h&&h.esr_retry===true&&h.body&&!(r&&Array.isArray(r.choices)&&r.choices.length))out.push({json:{ers_resend:true,ers_k:k,body:h.body,model:h.model,run_token:h.run_token}});});\n"+
  "return out.length?out:[{json:{ers_resend:false}}];"}};
 const SN=cl(RN);Object.assign(SN,{id:crypto.randomUUID(),name:P+' Resend Needed?',position:[x0+220,y0+180]});SN.parameters.conditions.conditions[0].id=crypto.randomUUID();SN.parameters.conditions.conditions[0].leftValue='={{ $json.ers_resend === true }}';
 const SC=cl(RC);Object.assign(SC,{id:crypto.randomUUID(),name:P+' Resend Call deepseek',position:[x0+330,y0+180]});
 W.nodes.push(SB,SN,SC);
 C[RC.name].main=[[{node:SB.name,type:'main',index:0}]];C[SB.name]={main:[[{node:SN.name,type:'main',index:0}]]};
 C[SN.name]={main:[[{node:SC.name,type:'main',index:0}],[{node:REC,type:'main',index:0}]]};C[SC.name]={main:[[{node:REC,type:'main',index:0}]]};
 const sub="try{if($('"+P+" Resend Call deepseek').isExecuted){const SB=$('"+P+" Resend Build').all().map(x=>x.json),SR=$('"+P+" Resend Call deepseek').all().map(x=>x.json);SB.forEach((s,j)=>{if(s&&s.ers_resend===true&&SR[j]){";
 if(M[REC]){ // Library Record: own line 109; stub reads list
  let hit=0;const anc="RR=$('"+P+" Retry Call deepseek').all().map(x=>x.json);const nb=[],nr=[];";
  M[REC].p=M[REC].p.map(e=>{if(Array.isArray(e)&&typeof e[0]==='string'&&e[0].includes(anc)){hit++;return [one(e[0],anc,anc+sub+"RR[s.ers_k]=SR[j];__esr.resent=(__esr.resent||0)+1;}});}}catch(e){__esr.resend_error=String(e&&e.message||e).slice(0,120);} /* pkgERS */",REC)];}return e;});
  if(hit!==1)throw new Error(REC+' own line hits '+hit);
  const st=byN(REC);st.parameters.jsCode=one(st.parameters.jsCode,'$("'+P+' Retry Call deepseek");','$("'+P+' Retry Call deepseek");$("'+P+' Resend Build");$("'+P+' Resend Call deepseek");',REC+' stub');
 } else { const st=byN(REC);const anc="const RC=$('"+P+" Retry Call deepseek').all().map(x=>x.json);";
  st.parameters.jsCode=one(st.parameters.jsCode,anc,anc+sub+"RC[s.ers_k]=SR[j];}});}}catch(e){} /* pkgERS */",REC); }
}
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16));
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3]);
