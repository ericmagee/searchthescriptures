// WALL-2024 cure-label match fix, offline tests (W2). argv[2]: fetch of live 6b077f9e. Run from the wall2024 dir. Writes nothing live.
const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).workflow;const LN={};W.nodes.forEach(n=>LN[n.name]=n.parameters&&n.parameters.jsCode||'');
const MM=JSON.parse(fs.readFileSync('merged_TLR/manifest.json','utf8'));MM.nodes.forEach(x=>LN[x.name]=fs.readFileSync('merged_TLR/'+x.name.replace(/ /g,'_')+'.js','utf8')); // base = 6b077f9e + T + L + R
const plan=JSON.parse(fs.readFileSync('pkgN/plan_N.json','utf8'));const pat=n=>fs.readFileSync('pkgN/patched/'+n.replace(/ /g,'_')+'.js','utf8');
let bad=0;const T=(ok,m)=>{console.log((ok?'OK  ':'FAIL')+' '+m);if(!ok)bad++;};const sha=s=>require('crypto').createHash('sha256').update(s).digest('hex').slice(0,16);
T(plan.nodes.length===14&&plan.nodes.every(x=>sha(LN[x.name])===x.base_sha&&sha(pat(x.name))===x.final_sha),'14 cure nodes; base_sha equals 6b077f9e + merged_TLR, final_sha equals the patched file');
const s0=pat('Panel Cure Check');const blk=s=>s.slice(s.indexOf('function cureVerdicts'),s.indexOf('const stmtQ='));T(plan.nodes.every(x=>blk(pat(x.name))===blk(s0)),'the changed block is the same text in all 14 nodes');
T(plan.nodes.every(x=>{const p=pat(x.name),l=LN[x.name];const a=p.indexOf(' // WALL-2024 cure-label match'),b=p.indexOf(' const stmtQ=');const la=l.indexOf('const respOf=(x)=>'),lb=l.indexOf(' const stmtQ=');return p.slice(0,a)+p.slice(b)===l.slice(0,la)+l.slice(lb);}),'outside respOf and stmtOf nothing changes');
const $=()=>{throw new Error('no node data offline');};const lib=c=>c.slice(0,c.lastIndexOf('\nreturn $input'));
const mk=c=>new Function('$','$input',lib(c)+'\nreturn {cureVerdicts,enfUncured,cureLabel};')($,null);const N=mk(pat('Panel Cure Normalize 2')),O=mk(LN['Panel Cure Normalize 2']);
// ---- 32949 replay on every stored cure reply
const F=JSON.parse(fs.readFileSync('pkgS/fixture_32949_cure_rows.json','utf8'));const RP={};F.replies.forEach(r=>RP[r.h]=r.full_reply);
const side=r=>/^DEFENDER/.test(r.item||'')?'DEFENDER':/^CHALLENGER/.test(r.item||'')?'CHALLENGER':/DEFENDER/.test((r.item||'')+' '+(r.flagged_line||''))?'DEFENDER':/CHALLENGER/.test((r.item||'')+' '+(r.flagged_line||''))?'CHALLENGER':'JUDGE';
const groups={};F.rows.filter(r=>!/\(restated in the cure\)/.test(r.item||'')).forEach(r=>{(groups[r.seat+' '+r.h]=groups[r.seat+' '+r.h]||[]).push(r);});const per=[];
for(const [k,rows] of Object.entries(groups)){const items=rows.map(r=>r.rule==='K-G3'?{rule:r.rule,side:r.item.split(' ')[0],link:null,line:r.flagged_line}:{rule:r.rule,side:side(r),link:r.item,ruling:r.rule==='K-RUL'?r.item:undefined,line:r.flagged_line});
 const rp={ok:true,text:RP[rows[0].h]};const v=N.cureVerdicts(items,rp,null,null),v0=O.cureVerdicts(items,rp,null,null);
 const sil=v.filter(x=>x.silent),sil0=v0.filter(x=>x.silent);
 // every item silent before and answered now must have a RESPONSE line in the reply that names it with the colon dropped
 const U=s=>String(s).toUpperCase().replace(/[:|]+/g,' ').replace(/\s+/g,' ').trim();const gained=v0.filter((x,i)=>x.silent&&!v[i].silent);
 const txt=U(RP[rows[0].h].replace(/\\n/g,'\n'));T(gained.every(x=>txt.includes('RESPONSE '+U(N.cureLabel(x)))||(items.filter(y=>y.rule===x.rule).length===1&&new RegExp('RESPONSE '+x.rule+'( |$)','m').test(txt))),k.split(' ')[0]+': each newly read answer is a RESPONSE line naming that item, or headed by its rule when it is the only item of that rule ('+gained.length+')');
 T(v.every((x,i)=>!(v0[i].status==='CURED'&&x.status!=='CURED')),k.split(' ')[0]+': no item that was CURED becomes uncured');
 per.push(k.split(' ')[0]+' silent '+sil0.length+' -> '+sil.length+', drv_uncured '+O.enfUncured(v0)+' -> '+N.enfUncured(v));}
per.forEach(p=>console.log('     '+p));
{const solS=Object.entries(groups).filter(([k])=>k.startsWith('sol ')).map(([k,rows])=>{const items=rows.map(r=>({rule:r.rule,side:side(r),link:r.item,ruling:r.rule==='K-RUL'?r.item:undefined,line:r.flagged_line}));return N.cureVerdicts(items,{ok:true,text:RP[rows[0].h]},null,null).filter(x=>x.silent).length;});
 T(solS.every(n=>n===0),'32949 sol, both tries: 0 silent items (W3 2208 expectation)');}
// ---- synthetic
const it=n=>({rule:'K-S3',side:'DEFENDER',link:'S3 DEFENDER CR4: #'+n,line:'[CR4] "I grant that."'});
{const v=N.cureVerdicts([it(1)],{ok:true,text:'RESPONSE: K-S3 S3 DEFENDER CR4: #1 | TOUCHES NO LINK: [CR4] keeps it.'},null,null),v0=O.cureVerdicts([it(1)],{ok:true,text:'RESPONSE: K-S3 S3 DEFENDER CR4: #1 | TOUCHES NO LINK: [CR4] keeps it.'},null,null);T(!v[0].silent&&!v0[0].silent&&v[0].status===v0[0].status,'the exact label, as before: read, same status ('+v[0].status+')');}
{const r={ok:true,text:'{"verdict_tag":"HELD","reasoning":"RESPONSE: K-S3 S3 DEFENDER CR4 #1 | TOUCHES NO LINK: [CR4] keeps it."}'};T(!N.cureVerdicts([it(1)],r,null,null)[0].silent&&O.cureVerdicts([it(1)],r,null,null)[0].silent,'a JSON-bodied reply with the colon dropped: silent before, read now');}
{const r={ok:true,text:'RESPONSE: K-S3 S3 DEFENDER CR4: #10 | TOUCHES NO LINK.'};const v=N.cureVerdicts([it(1),it(10)],r,null,null),v0=O.cureVerdicts([it(1),it(10)],r,null,null);T(v[0].silent===true&&!v[1].silent&&v0[0].silent!==true,'with items #1 and #10, a #10 line does not answer #1 (the old substring test took it as an answer)');}
{const r={ok:true,text:'RESPONSE: K-CMT | NOT A GRADE: these are counts.'};const x={rule:'K-CMT',side:'JUDGE',link:'contested grades without a commitment',line:'x'};T(!N.cureVerdicts([x],r,null,null)[0].silent&&O.cureVerdicts([x],r,null,null)[0].silent,'the one K-CMT item: "RESPONSE: K-CMT | ..." answers it now (silent before)');
 const y={rule:'K-W',side:'DEFENDER',link:'DEFENDER CR2 D1 #1',line:'x'},z={rule:'K-W',side:'DEFENDER',link:'DEFENDER CR2 D2 #2',line:'x'};const w=N.cureVerdicts([y,z],{ok:true,text:'RESPONSE: K-W | CONCEDED.'},null,null);T(w.every(q=>q.silent),'two items of one rule: a RESPONSE headed only by the rule answers neither');}
console.log(bad?'FAILED '+bad:'ALL OK');
