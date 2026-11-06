// pkgW offline tests (W2). Run from the wall2024 dir: node pkgW/test_W.cjs. Base = merged_TLRN + pkgP/patched. Writes nothing live.
const fs=require('fs');const sha=s=>require('crypto').createHash('sha256').update(s).digest('hex').slice(0,16);
let bad=0;const T=(ok,m)=>{console.log((ok?'OK  ':'FAIL')+' '+m);if(!ok)bad++;};
const baseOf=f=>fs.existsSync('pkgP/patched/'+f)?fs.readFileSync('pkgP/patched/'+f,'utf8'):fs.readFileSync('merged_TLRN/'+f,'utf8');
const plan=JSON.parse(fs.readFileSync('pkgW/plan_W.json','utf8'));const pat=f=>fs.readFileSync('pkgW/patched/'+f,'utf8');
T(plan.nodes.length===14&&plan.nodes.every(x=>sha(baseOf(x.file))===x.base_sha&&sha(pat(x.file))===x.final_sha),'14 cure nodes; base_sha equals merged_TLRN + pkgP, final_sha equals the patched file');
const kwA=s=>s.indexOf("if(x.rule==='K-W'){const rp=respOf(x)"),kwB=s=>s.indexOf('}',s.indexOf("res('UNCURED',",s.indexOf("return res('UNCURED','",kwA(s))-1))+1;
const cut=s=>{const a=kwA(s);const b=s.indexOf("null));}",a)+8;return s.slice(0,a)+'@KW@'+s.slice(b);};
const cutB=s=>{const a=kwA(s);const b=s.indexOf("rp?[rp]:null);}",a)+15;return s.slice(0,a)+'@KW@'+s.slice(b);};
T(plan.nodes.every(x=>cut(pat(x.file)).replace("(\\S.{9,}|CONCEDED\\.?)$/i)","(\\S.{9,})$/)")===cutB(baseOf(x.file))),'outside the K-W check and the RESPONSE pattern nothing changes (reverse edit)');
const s0=pat('Panel_Cure_Check.js');const blk=s=>s.slice(kwA(s),s.indexOf("null));}",kwA(s))+8);T(plan.nodes.every(x=>blk(pat(x.file))===blk(s0)),'the new K-W check is the same text in all 14 nodes');
const $=()=>{throw new Error('no node data offline');};const lib=c=>c.slice(0,c.lastIndexOf('\nreturn $input'));
const mk=c=>new Function('$','$input',lib(c)+'\nreturn {cureVerdicts,enfUncured,cureLabel,cureLines};')($,null);
const NP=mk(pat('Panel_Cure_Normalize_2.js')),OP=mk(baseOf('Panel_Cure_Normalize_2.js')),NS=mk(pat('Cure_Normalize.js')),OS=mk(baseOf('Cure_Normalize.js'));
// ---- 32973 K-W replay (stored replies; md5 checked when the fixture was built)
const F=JSON.parse(fs.readFileSync('pkgW/fixture_32973_cure_rows.json','utf8'));const RP={};F.replies.forEach(r=>RP[r.h]=r);
T(F.replies.every(r=>require('crypto').createHash('md5').update(r.full_reply).digest('hex')===r.h),'32973 fixture: each stored reply matches its md5 in debate_enforcer_log');
const side=r=>/^DEFENDER/.test(r.item||'')?'DEFENDER':/^CHALLENGER/.test(r.item||'')?'CHALLENGER':'JUDGE';
const g={};F.rows.filter(r=>r.rule==='K-W').forEach(r=>(g[r.h]=g[r.h]||[]).push(r));const exp={chatgpt:[0,12],sol:[0,12],single:[8,12],gemini:[12,12],grok:[12,12]};
for(const [h,rows] of Object.entries(g)){const seat=RP[h].seat;const [N,O]=seat==='single'?[NS,OS]:[NP,OP];const items=rows.map(r=>({rule:'K-W',side:side(r),link:r.item,line:r.fl}));const rp={ok:true,text:RP[h].full_reply};
 const v=N.cureVerdicts(items,rp,null,null).slice(0,items.length),v0=O.cureVerdicts(items,rp,null,null).slice(0,items.length);const c=a=>a.filter(x=>x.status==='CURED').length;
 T(rows.every((r,i)=>v0[i].status===r.cure_status),seat+': the base replay gives the stored live status on every K-W item');
 T(c(v0)===exp[seat][0]&&c(v)===exp[seat][1],seat+': K-W CURED '+c(v0)+'/12 -> '+c(v)+'/12 (expected '+exp[seat].join(' -> ')+')');
 T(v.every((x,i)=>!(v0[i].status==='CURED'&&x.status!=='CURED')),seat+': no K-W item that was CURED becomes uncured');}
// ---- the RESPONSE pattern: across every stored 32949 and 32973 reply, only "| CONCEDED" lines are newly read
const F9=JSON.parse(fs.readFileSync('pkgS/fixture_32949_cure_rows.json','utf8'));let nd=0,odd=[];
for(const r of F9.replies.concat(F.replies)){const a=OP.cureLines(r.full_reply),b=NP.cureLines(r.full_reply);const add=b.response.filter(x=>!a.response.some(y=>y.line===x.line));nd+=add.length;add.forEach(x=>{if(!/^CONCEDED\.?$/i.test(x.text))odd.push(x.line);});
 if(b.malformed.some(l=>!a.malformed.includes(l)))odd.push('new malformed in '+r.seat);}
T(odd.length===0&&nd===6,'cureLines on all stored 32949 and 32973 replies: '+nd+' newly read RESPONSE lines, each "| CONCEDED.", no new malformed line (expected 6: single on 32973 x4, gemini on 32949 x2)');
// ---- 32949 replay, all rules (as test_N): nothing that was CURED becomes uncured
{const RP9={};F9.replies.forEach(r=>RP9[r.h]=r.full_reply);const side9=r=>/^DEFENDER/.test(r.item||'')?'DEFENDER':/^CHALLENGER/.test(r.item||'')?'CHALLENGER':/DEFENDER/.test((r.item||'')+' '+(r.flagged_line||''))?'DEFENDER':/CHALLENGER/.test((r.item||'')+' '+(r.flagged_line||''))?'CHALLENGER':'JUDGE';
 const gr={};F9.rows.filter(r=>!/\(restated in the cure\)/.test(r.item||'')).forEach(r=>{(gr[r.seat+' '+r.h]=gr[r.seat+' '+r.h]||[]).push(r);});let ok=true,kw=[];
 for(const [k,rows] of Object.entries(gr)){const items=rows.map(r=>r.rule==='K-G3'?{rule:r.rule,side:r.item.split(' ')[0],link:null,line:r.flagged_line}:{rule:r.rule,side:side9(r),link:r.item,ruling:r.rule==='K-RUL'?r.item:undefined,line:r.flagged_line});
  const rp={ok:true,text:RP9[rows[0].h]};const v=NP.cureVerdicts(items,rp,null,null),v0=OP.cureVerdicts(items,rp,null,null);
  if(v.some((x,i)=>v0[i].status==='CURED'&&x.status!=='CURED'))ok=false;const c=a=>a.filter(x=>x.rule==='K-W'&&x.status==='CURED').length;kw.push(k.split(' ')[0]+' '+c(v0)+'->'+c(v)+'/'+items.filter(x=>x.rule==='K-W').length);}
 T(ok,'32949, every seat and rule: no item that was CURED becomes uncured (K-W CURED: '+kw.join(', ')+')');}
// ---- synthetic
const it={rule:'K-W',side:'DEFENDER',link:'DEFENDER CR3 LINK 2 #4',line:'x'};const run=(N,t)=>N.cureVerdicts([it],{ok:true,text:t},null,null)[0];
{const t='STATEMENT: K-W DEFENDER CR3 LINK 2 #4 | The withdrawal was NOT CONCEDED by the side.\nRESPONSE: K-W DEFENDER CR3 LINK 2 #4 | NOT CONCEDED: the link keeps its other footing.';T(run(OP,t).status==='CURED'&&run(NP,t).status==='UNCURED','"NOT CONCEDED": CURED before (false cure), UNCURED now');}
{const t='RESPONSE: K-W DEFENDER CR3 LINK 2 #4 | REASSERTED IN [CR4] "the taking was the coming together, so he knew her then."';T(run(OP,t).status==='UNCURED'&&run(NP,t).status==='CURED','REASSERTED IN [CR4] "<quote>": UNCURED before, CURED now');}
{const t='RESPONSE: K-W DEFENDER CR3 LINK 2 #4 | REASSERTED IN CR4 without a quote.';T(run(NP,t).status==='UNCURED','REASSERTED IN with no quote stays UNCURED');}
{const t='RESPONSE: K-W DEFENDER CR3 LINK 2 #4 | CONCEDED';T(run(OP,t).status==='UNCURED'&&run(NP,t).status==='CURED','RESPONSE "| CONCEDED" (no period): refused as malformed before, CURED now');}
{const t='RESPONSE: K-W DEFENDER CR3 LINK 2 #4 | CONCEDED LINKS: 1 -- premise 6 UNEXHIBITED.';T(run(NP,t).status==='UNCURED','"CONCEDED LINKS" is not a concession of the withdrawn link');}
{const t='STATEMENT: K-W DEFENDER CR3 LINK 2 #4 | STANDS WITHOUT IT because the dating is carried by [L1] Matthew 1:18 "before they came together".\nRESPONSE: K-W DEFENDER CR3 LINK 2 #4 | NOT HELD: the narrowed link keeps the finding.';const v=run(NP,t);T(run(OP,t).status==='UNCURED'&&v.status==='CURED'&&/STATEMENT line/.test(v.why),'form on the STATEMENT line, NOT HELD on the RESPONSE line: CURED now, and the reason says it was read from the STATEMENT line');}
{const t='STATEMENT: K-W DEFENDER CR3 LINK 2 #4 | STANDS WITHOUT IT because it is carried by [L1] Matthew 1:18.';const v=run(NP,t);T(v.status==='UNCURED'&&v.silent===true,'a STATEMENT line with no RESPONSE line stays a silent item (the silence count is unchanged)');}
{const t='STATEMENT: K-W DEFENDER CR3 LINK 2 #4 | I considered it.\nRESPONSE: K-W DEFENDER CR3 LINK 2 #4 | I accept the withdrawal as stated.';T(run(NP,t).status==='UNCURED','neither line gives a form: UNCURED');}
console.log(bad?'FAILED '+bad:'ALL OK');
