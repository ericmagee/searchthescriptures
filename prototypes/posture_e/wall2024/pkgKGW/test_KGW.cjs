// pkgKGW tests. Run from wall2024/: node pkgKGW/test_KGW.cjs
// 1 every node edited as planned; 2 K-W ids, base vs patched, on every saved run's judge prompts (only ids with a cut reference change);
// 3 KWK matching units; 4 the recompute guard on 33129 chatgpt; 5 the RETRACTED sentence carries the 421 exception.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);let ok=0;
const T=(c,m)=>{if(!c){console.log('FAIL',m);process.exitCode=1;}else{ok++;console.log('OK  ',m);}};const rd=f=>fs.readFileSync(f,'utf8');
const plan=JSON.parse(rd('pkgKGW/plan_KGW.json'));
for(const n of plan.nodes){T(sha(rd('pkgNHE/patched/'+n.file))===n.base_sha&&sha(rd('pkgKGW/patched/'+n.file))===n.final_sha,'1 '+n.file+' base and final sha');}
T(plan.nodes.length===22&&plan.nodes.filter(n=>n.edits===7).length===19,'1 22 nodes: 19 with 7 edits, 3 with the label edit only');
// 2 K-W ids
const grab=(src,names)=>{globalThis.__G=null;try{new Function('$','$input','$json','globalThis.__G={'+names+'};\n'+src)(()=>({first:()=>({json:{}}),all:()=>[],isExecuted:false,params:{}}),{first:()=>({json:{}}),all:()=>[]},{});}catch(e){}return globalThis.__G;};
const B=grab(rd('pkgNHE/patched/Panel_Payloads.js'),'kwLines421'),P=grab(rd('pkgKGW/patched/Panel_Payloads.js'),'kwLines421');
T(B&&P&&typeof B.kwLines421==='function','2 kwLines421 loads from both Panel Payloads');
const rounds=ptext=>{const t=String(ptext||'');const re=/^===\s*\[(CR[1-4]|DR[1-4])\][^\n]*===\s*$/gm;const at=[];let m;while((m=re.exec(t)))at.push({k:m[1],s:m.index,e:m.index+m[0].length});const out={};at.forEach((x,i)=>{if(out[x.k]!=null)return;out[x.k]=t.slice(x.e,i+1<at.length?at[i+1].s:t.length);});return out;};
const changes=[];let same=0;
for(const run of ['33040','33060','33083','33107','33129']){const PB=JSON.parse(rd('corpus/raw/gate_'+run+'.json'))['Panel Build'].slice(-1)[0][0];const J=PB.judges[0];
 const pt=J.body.messages.map(m=>typeof m.content==='string'?m.content:(m.content||[]).map(c=>c&&c.text||'').join('\n')).join('\n');const R=rounds(pt);
 const a=B.kwLines421('',R).items.filter(x=>x.rule==='K-W').map(x=>x.link),b=P.kwLines421('',R).items.filter(x=>x.rule==='K-W').map(x=>x.link);
 T(a.length===b.length,'2 '+run+' same number of K-W items ('+a.length+')');
 a.forEach((x,i)=>{if(x===b[i])same++;else changes.push(run+': '+x+' -> '+b[i]);});
 T(a.every((x,i)=>x===b[i]||(/\(/.test(x)&&!/\(/.test(b[i])&&x.replace(/\s*\([^#]*/,' ')===b[i])),'2 '+run+' only ids with a cut reference change, and only by dropping it');}
console.log('   K-W ids unchanged '+same+'; changed '+changes.length+':\n     '+changes.join('\n     '));
// 3 KWK
const K=grab(rd('pkgKGW/patched/Panel_Cure_Check.js'),'x:1');const src=rd('pkgKGW/patched/Panel_Cure_Check.js');
const kwkSrc=src.match(/const NZ=s=>[^\n]*?\/\* pkgKGW \(2\)/)[0];const U=s=>String(s==null?'':s).toUpperCase();const KWK=new Function('U',kwkSrc.replace(/\/\* pkgKGW \(2\)$/,'')+';return KWK;')(U);
T(KWK('DEFENDER CR2 D3 (Luke 1 #1')==='DEFENDER CR2 D3 #1'&&KWK('K-W DEFENDER CR2 D3 #1')==='DEFENDER CR2 D3 #1','3 the cut label and the clean label give one key');
T(KWK('K-W DEFENDER CR3 LINK 2 #4')==='DEFENDER CR3 LINK2 #4'&&KWK('DEFENDER CR3 LINK 2 #4')===KWK('DEFENDER CR3 LINK2 #4'),'3 LINK n keys');
T(KWK('K-W DEFENDER CR2 D3 #1')!==KWK('K-W DEFENDER CR2 D3 #2')&&KWK('K-W DEFENDER CR2 D3 #1')!==KWK('K-W CHALLENGER CR2 D3 #1')&&KWK('K-W DEFENDER CR3 D3 #1')!==KWK('K-W DEFENDER CR2 D3 #1')&&KWK('K-W DEFENDER CR2 D4 #1')!==KWK('K-W DEFENDER CR2 D3 #1'),'3 side, round, link and #n each separate keys');
T(KWK('K-G4 D4 vs C6')===null&&KWK('K-W DEFENDER CR2 D3')===null,'3 no key without side, round, link and #n');
// 4 recompute guard + 5 sentence: replay 33129 whole
const {load}=require('../corpus/replay_node.cjs');
const run=pkg=>{const N=load('33129');const mock=name=>{const r=N.nodes[name];if(!r)return {isExecuted:false,first:()=>{throw new Error('x');},all:()=>{throw new Error('x');}};const it=r[r.length-1]||[];return {isExecuted:true,first:()=>({json:it[0]}),last:()=>({json:it[it.length-1]}),all:()=>it.map(j=>({json:j})),item:{json:it[0]}};};
 return new Function('$','$input','$json',rd(pkg+'/patched/Panel_Cure_Check.js'))(mock,{first:()=>({json:{}}),all:()=>[],item:{json:{}}},{})[0].json;};
const OB=run('pkgNHE'),OP=run('pkgKGW');const sB=OB.summary.find(s=>s.seat==='chatgpt'),sP=OP.summary.find(s=>s.seat==='chatgpt');
const tag=O=>{const b=O.bodies.map(x=>JSON.parse(x).payload).find(p=>p.judge_seat==='chatgpt');return b.verdict_tag+' / '+b.drv_uncured;};
console.log('   33129 chatgpt stored tag / drv_uncured: base '+tag(OB)+', patched '+tag(OP)+'; recomputed base '+JSON.stringify(sB.recomputed&&sB.recomputed.trigger)+', patched '+JSON.stringify(sP.recomputed&&sP.recomputed.trigger));
T(sB.recomputed&&/RETRACTED D4 vs C6/.test(sB.recomputed.trigger.join()),'4 base: the refused retraction is applied (HELD)');
T(!sP.recomputed||!/D4 vs C6/.test((sP.recomputed.trigger||[]).join()),'4 patched: neither the refused retraction nor the RESTATED regrade of D4 vs C6 is applied');
T(/^BROKEN/.test(tag(OP)),'4 patched: chatgpt keeps its BROKEN text, the text the enforcer accepted');
T((sP.cure||[]).filter(c=>c.status==='UNCURED').map(c=>c.rule).join()==='K-G4','4 patched: chatgpt uncured only K-G4 (K-V by pkgKVQ, K-W by this package)');
const wB=OB.summary.find(s=>s.seat==='sol'),wP=OP.summary.find(s=>s.seat==='sol');
console.log('   33129 sol uncured: base '+wB.cure.filter(c=>c.status==='UNCURED').map(c=>c.link).join('; ')+' | patched '+wP.cure.filter(c=>c.status==='UNCURED').map(c=>c.link).join('; '));
for(const f of plan.nodes.filter(n=>n.edits===7).map(n=>n.file))T(rd('pkgKGW/patched/'+f).includes('except a K-G4 item marked MEANING BREAK'),'5 '+f+' RETRACTED sentence states the 421 exception');
console.log(ok+' OK');
