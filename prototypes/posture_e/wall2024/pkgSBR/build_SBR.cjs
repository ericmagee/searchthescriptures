// pkgSBR (reader phase 2, the send-back readers; W3 assignment 2026-11-06 10:54 CST, spec sections 2, 3 and 11). Base pkgPS/patched (7da43b0).
// Run from wall2024/: node pkgSBR/build_SBR.cjs. The 6 gate nodes (SB_ROW, sbLabel, gateRead2024 live there); the other 16 are copied unchanged.
// (1) sbLabel: the label of a COLLISION (pair), KEYSTONE, CONCEDED (side), STANDING (side) or CLAUSE line comes from the shared reader; a RESTATED
//     line and every other form have no label (as before). A line the reader refuses is labelled by the old reader (sbLabel0), so no label is lost.
// (2) the K-S3 row lookup in sbApply2024: a CHANGE TO in the OUT-OF-ROUND row form finds the judge's own row by side, round and the WHOLE
//     sentence (spec 11), all three from the reader on both lines; the old key was the row's first quoted span. A CHANGE TO the reader does not
//     read as an OUT-OF-ROUND row is looked up by the old SB_ROW code.
// (3) gateRead2024: a GATE reply line comes from the reader's REPLY form (kind GATE: id, KEEP or CHANGE, the CHANGE TO payload, the sentence);
//     a line the reader refuses is read by GATE_LINE, as before.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const one=(s,a,b,n)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(n+': anchor count '+k);return s.split(a).join(b);};
const RL="function __sbRL(l){try{return __RL.readLine(String(l==null?'':l));}catch(e){return {form:null};}} /* pkgSBR: the shared reader on one line, never throwing */\n";
const LA="function sbLabel(l){const u=String(l||'')";
const LB=RL+"function sbLabel(l){const r=__sbRL(l);if(r&&r.form){const f=r.f||{};if(f.restated)return null; /* pkgSBR (1) */\n"
 +" if(r.form==='COLLISION')return String(f.pair).toUpperCase().replace(/\\s+VS\\.?\\s+/,' VS ');if(r.form==='KEYSTONE')return 'KEYSTONE';if(r.form==='CONCEDED')return f.side==='CHALLENGER'?'CHALLENGER CONCEDED LINKS':'CONCEDED LINKS';\n"
 +" if(r.form==='STANDING')return f.side+' STANDING';if(r.form==='CLAUSE')return 'CLAUSE';return null;}return sbLabel0(l);}\n"
 +"function sbLabel0(l){const u=String(l||'')";
const SA_HEAD="if(!o){const m=to.match(SB_ROW);";
const SB_HEAD="if(!o){const __a=__sbRL(to);const __oo=r=>r&&r.form==='OUT-OF-ROUND'?r.f:null;const __sk=s=>String(s||'').replace(/^[\"\\u201c]+|[\"\\u201d]+$/g,'').replace(/\\s+/g,' ').trim().toUpperCase(); /* pkgSBR (2) */\n"
 +"  if(__oo(__a)){const a=__oo(__a);o=lines.find(l=>{const b=__oo(__sbRL(l));return b&&b.side===a.side&&b.round===a.round&&__sk(b.sentence)===__sk(a.sentence);})||null;}else{const m=to.match(SB_ROW);";
const GA="for(const l0 of T2.split('\\n')){const l=l0.replace(/[*_`]+/g,'').trim();const m=l.match(GATE_LINE);";
const GB="for(const l0 of T2.split('\\n')){const l=l0.replace(/[*_`]+/g,'').trim();{const r=__sbRL(l);if(r&&r.form==='REPLY'&&r.f&&r.f.kind==='GATE'){const id=r.f.id;if(A[id])continue; /* pkgSBR (3) */\n"
 +"  A[id]={ans:r.f.answer,to:String(r.f.to||'').trim(),why:(J?String(r.f.sentence||'').replace(/\"\\s*,?\\s*[}\\]]*\\s*$/,''):String(r.f.sentence||'')).trim(),line:l};continue;}}const m=l.match(GATE_LINE);";
const plan={base:'pkgPS/patched (7da43b0)',nodes:[]};fs.mkdirSync('pkgSBR/patched',{recursive:true});
for(const f of fs.readdirSync('pkgPS/patched').filter(f=>f.endsWith('.js')).sort()){const b=fs.readFileSync('pkgPS/patched/'+f,'utf8');let s=b;const ed=[];
 if(b.includes('const SB_ROW=')){if(!b.includes('const __RL='))throw new Error(f+': no __RL');
  s=one(s,LA,LB,f+' sbLabel');ed.push('sbLabel');
  const i=s.indexOf(SA_HEAD);if(i<0||s.indexOf(SA_HEAD,i+1)>=0)throw new Error(f+': SB_ROW lookup anchor');const j=s.indexOf('||null;}}',i);if(j<0)throw new Error(f+': SB_ROW lookup end');
  s=s.slice(0,i)+SB_HEAD+s.slice(i+SA_HEAD.length,j)+'||null;}}}'+s.slice(j+'||null;}}'.length);ed.push('SB_ROW lookup');
  s=one(s,GA,GB,f+' gateRead');ed.push('gateRead2024');}
 new Function('$','$input','$json',s);fs.writeFileSync('pkgSBR/patched/'+f,s);plan.nodes.push({file:f,name:f.replace(/\.js$/,'').replace(/_/g,' '),base_sha:sha(b),final_sha:sha(s),edits:ed});}
fs.writeFileSync('pkgSBR/plan_SBR.json',JSON.stringify(plan,null,1));plan.nodes.filter(n=>n.edits.length).forEach(x=>console.log(x.name.padEnd(24),x.base_sha,'->',x.final_sha,x.edits.join('; ')));console.log(plan.nodes.length+' nodes');
