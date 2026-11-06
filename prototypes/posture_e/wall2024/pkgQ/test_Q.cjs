// pkgQ offline tests (W1). Run from wall2024: node pkgQ/test_Q.cjs. Base = merged_PW. Writes nothing live.
const fs=require('fs');const sha=s=>require('crypto').createHash('sha256').update(s).digest('hex').slice(0,16);
let bad=0;const T=(ok,m)=>{console.log((ok?'OK  ':'FAIL')+' '+m);if(!ok)bad++;};
const base=f=>fs.readFileSync('merged_PW/'+f,'utf8'),pat=f=>fs.readFileSync('pkgQ/patched/'+f,'utf8');
const plan=JSON.parse(fs.readFileSync('pkgQ/plan_Q.json','utf8'));
T(plan.nodes.length===14&&plan.nodes.every(x=>sha(base(x.file))===x.base_sha&&sha(pat(x.file))===x.final_sha),'14 cure nodes; hashes match base and patched');
const $=()=>{throw new Error('offline');};const lib=c=>c.slice(0,c.lastIndexOf('\nreturn $input'));
const mk=c=>new Function('$','$input',lib(c)+'\nreturn {cureVerdicts};')($,null);
const NP=mk(pat('Panel_Cure_Normalize_2.js')),OP=mk(base('Panel_Cure_Normalize_2.js')),NS=mk(pat('Cure_Normalize.js')),OS=mk(base('Cure_Normalize.js'));
const F=JSON.parse(fs.readFileSync('pkgW/fixture_32973_cure_rows.json','utf8'));const RP={};F.replies.forEach(r=>RP[r.h]=r);
const side=r=>/^DEFENDER/.test(r.item||'')?'DEFENDER':/^CHALLENGER/.test(r.item||'')?'CHALLENGER':'JUDGE';
const g={};F.rows.filter(r=>r.rule==='K-W').forEach(r=>(g[r.h]=g[r.h]||[]).push(r));
for(const [h,rows] of Object.entries(g)){const seat=RP[h].seat;const [N,O]=seat==='single'?[NS,OS]:[NP,OP];
 const items=rows.map(r=>({rule:'K-W',side:side(r),link:r.item,line:r.fl}));const rp={ok:true,text:RP[h].full_reply};
 const v=N.cureVerdicts(items,rp,null,null).slice(0,items.length),v0=O.cureVerdicts(items,rp,null,null).slice(0,items.length);
 const ch=v.map((x,i)=>v0[i].status!==x.status?rows[i].item+' '+v0[i].status+'->'+x.status:null).filter(Boolean);
 T(ch.length===0,seat+' 32973: K-W status unchanged on all '+items.length+' items'+(ch.length?' CHANGED: '+ch.join('; '):''));
 v.forEach((x,i)=>{if(/conceded/i.test(x.reason||x.why||''))console.log('     CONCEDED cure kept: '+seat+' '+rows[i].item+' | '+String((x.lines||x.line||[''])[0]||'').slice(0,90));});
 if(seat==='gemini'){const i=rows.findIndex(r=>r.item==='DEFENDER CR3 LINK 1 #3');T(i>=0&&v[i].status==='CURED'&&/stands without/i.test(v[i].reason||v[i].why||''),'gemini DEFENDER CR3 LINK 1 #3 stays CURED, by STANDS WITHOUT IT on its RESPONSE line (not by its STATEMENT prose "conceded")');}}
// ---- 32949 replay (W2, Wall 2226): sentence-start anchor keeps the "Fact: .... CONCEDED; ..." form
{const F9=JSON.parse(fs.readFileSync('pkgS/fixture_32949_cure_rows.json','utf8'));const R9={};F9.replies.forEach(r=>R9[r.h]=r.full_reply);
 const g9={};F9.rows.filter(r=>r.rule==='K-W').forEach(r=>{(g9[r.seat+' '+r.h]=g9[r.seat+' '+r.h]||[]).push(r)});
 const exp={'gemini a750dd48':[10,10],'chatgpt d7c13b3f':[11,9],'grok af20ea15':[12,12],'sol 6d710d40':[11,10],'sol a4717fdd':[10,8]};
 for(const [k,rows] of Object.entries(g9)){const it=rows.map(r=>({rule:'K-W',side:side(r),link:r.item,line:r.flagged_line}));const rp={ok:true,text:R9[rows[0].h]};
  const v=NP.cureVerdicts(it,rp,null,null).slice(0,it.length),v0=OP.cureVerdicts(it,rp,null,null).slice(0,it.length);const c=a=>a.filter(x=>x.status==='CURED').length;
  const key=k.split(' ')[0]+' '+k.split(' ')[1].slice(0,8);const lost=v.map((x,i)=>v0[i].status==='CURED'&&x.status!=='CURED'?rows[i].item:null).filter(Boolean);
  if(key==='chatgpt d7c13b3f'){const rest=v.map((x,i)=>x.status==='CURED'&&/conceded/i.test(x.reason||x.why||'')&&!/^\s*\**CONCEDED/.test(String((x.lines||[''])[0]||'').replace(/^.*?\|\s*/,''))?rows[i].item:null).filter(Boolean);
   T(rest.length===8,'32949 chatgpt: 8 "Fact: .... CONCEDED" answers restored by the sentence-start anchor (refused by the answer-start anchor): '+rest.join('; '));}
  {const U={'chatgpt d7c13b3f':['DEFENDER CR3 LINK 2 [premise 2] #6','CHALLENGER DR2 no link heading #1'],'sol 6d710d40':['CHALLENGER DR2 no link heading #1'],'sol a4717fdd':['DEFENDER CR2 D3 #3','CHALLENGER DR2 no link heading #1']}[key];
   if(U)T(U.every(u=>{const i=rows.findIndex(r=>r.item===u);return i>=0&&v[i].status!=='CURED';}),'32949 '+key+': stays uncured (no unqualified form word): '+U.join('; '));}
  T(exp[key]&&c(v0)===exp[key][0]&&c(v)===exp[key][1],'32949 '+key+': K-W CURED '+c(v0)+' -> '+c(v)+'/'+it.length+(lost.length?' (un-cured, no form word: '+lost.join('; ')+')':''));}}
const it={rule:'K-W',side:'DEFENDER',link:'DEFENDER CR3 LINK 2 #4',line:'x'};const run=(N,t)=>N.cureVerdicts([it],{ok:true,text:t},null,null)[0];
const C=[
 ['RESPONSE: K-W DEFENDER CR3 LINK 2 #4 | NOT CONCEDED.','UNCURED','"NOT CONCEDED."'],
 ['RESPONSE: K-W DEFENDER CR3 LINK 2 #4 | Fact: the taking. **CONCEDED**: the link falls.','CURED','"x. **CONCEDED**:"'],
 ['STATEMENT: K-W DEFENDER CR3 LINK 2 #4 | Fact: the taking was into the house. CONCEDED; [CR3] grants it.\nRESPONSE: K-W DEFENDER CR3 LINK 2 #4 | I accept the grant.','CURED','"Fact: .... CONCEDED;" (32949 chatgpt form)'],
 ['RESPONSE: K-W DEFENDER CR3 LINK 2 #4 | CONCEDED.','CURED','"| CONCEDED."'],
 ['RESPONSE: K-W DEFENDER CR3 LINK 2 #4 | CONCEDED: the link falls without the footing.','CURED','"| CONCEDED:"'],
 ['RESPONSE: K-W DEFENDER CR3 LINK 2 #4 | CONCEDED','CURED','"| CONCEDED" at the end'],
 ['RESPONSE: K-W DEFENDER CR3 LINK 2 #4 | CONCEDED -- the link falls.','CURED','"| CONCEDED --"'],
 ['STATEMENT: K-W DEFENDER CR3 LINK 2 #4 | CONCEDED: the claim was dropped.\nRESPONSE: K-W DEFENDER CR3 LINK 2 #4 | I accept the withdrawal.','CURED','"| CONCEDED:" on the STATEMENT line'],
 ['RESPONSE: K-W DEFENDER CR3 LINK 2 #4 | NOT HELD: the defender conceded nothing in [CR3].','UNCURED','"conceded" in NOT HELD prose'],
 ['STATEMENT: K-W DEFENDER CR3 LINK 2 #4 | The defender conceded that Psalms 2:7 applies to the resurrection.\nRESPONSE: K-W DEFENDER CR3 LINK 2 #4 | I accept the withdrawal.','UNCURED','"conceded" in STATEMENT prose (the gemini #3 wording, without its STANDS line)'],
 ['RESPONSE: K-W DEFENDER CR3 LINK 2 #4 | I accept; the challenger CONCEDED it in R2.','UNCURED','uppercase CONCEDED inside prose, not after the bar'],
 ['RESPONSE: K-W DEFENDER CR3 LINK 2 #4 | Conceded that the verse dates the finding.','UNCURED','lowercase "Conceded" opening prose'],
 ['RESPONSE: K-W DEFENDER CR3 LINK 2 #4 | NOT CONCEDED: the link keeps its other footing.','UNCURED','"NOT CONCEDED"'],
 ['RESPONSE: K-W DEFENDER CR3 LINK 2 #4 | CONCEDED LINKS: 1 -- premise 6 UNEXHIBITED.','UNCURED','"CONCEDED LINKS"'],
 ['RESPONSE: K-W DEFENDER CR3 LINK 2 #4 | **CONCEDED**: the link falls.','CURED','bold "**CONCEDED**:"'],
 ['RESPONSE: K-W DEFENDER CR3 LINK 2 #4 | STANDS WITHOUT IT because it is carried by [L1] Matthew 1:18 "before they came together".','CURED','STANDS WITHOUT IT unchanged'],
 ['RESPONSE: K-W DEFENDER CR3 LINK 2 #4 | REASSERTED IN [CR4] "the taking was the coming together, so he knew her then."','CURED','REASSERTED IN unchanged'],
];
C.forEach(([t,e,m])=>{const s=run(NP,t).status;T(s===e,'synthetic: '+m+' -> '+s);});
console.log(bad?'FAILED '+bad:'ALL OK');
