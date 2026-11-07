// pkgRCT (W1 2818; W3 ruling 2819), ENFORCER fix, side-neutral: a send-back or gate change that counts again a premise this judge took out by a CURED
// CORRECTED COUNT (the K-UNX or K-UNX-A cure) is NOT APPLIED, unless its reason (the change's own premise segment or its stated reason) passes the K-UNX lack
// test (unxLack, UNXW2) against that premise's block: it must name a layer the block does not exhibit. The count stays at the cure value.
// 33311 gemini: the cure took CHALLENGER premise 4 out (CORRECTED COUNT 0); gate changes G7-G12 wrote "CHALLENGER CONCEDED LINKS: 1 -- ... Premise 4: UNEXHIBITED"
// and G12 applied (stored "COUNT CHALLENGER 0 to 1"), an Oracle concede the judge had already withdrawn.
// At the send-back stage the refusal is a NOT APPLIED item, so it goes to the gate as one G item (an uncured G item counts as the gate rules say).
// At the gate-answer stage a NOT APPLIED item whose gate change pkgRCT refused is cured with the reason recorded: no seat removed (W3 2819 item 3).
// Only a premise the line being replaced does not count is a recount (33249 alternate grok: its line already counted premise 2; not refused).
// The whole change is refused (its other premises stay as they were), so no line is half-rewritten and the count number cannot go stale.
// Base: live ed50d341 (fetchback_live_s38.json). Run from wall2024/: node pkgRCT/build_RCT.cjs [--fb f] [--out dir]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};
const FB=arg('--fb','/mnt/project-files/wall2024/fetchback_live_s38.json');const OUT=arg('--out','pkgRCT/patched');const ON=arg('--on',null);
const w=JSON.parse(fs.readFileSync(FB,'utf8'));const W=w.data||w;const NS=(W.nodes||W.workflow.nodes);
if(ON)for(const d of ON.split(','))for(const n of NS){const f=d+'/'+n.name.replace(/ /g,'_')+'.js';if(n.parameters&&typeof n.parameters.jsCode==='string'&&fs.existsSync(f))n.parameters.jsCode=fs.readFileSync(f,'utf8');}
const LIB=`// pkgRCT (W1 2818; W3 2819): premises this judge's own cure took out by CORRECTED COUNT (a CURED K-UNX report), and the refusal of a change that counts one again.
function rctOut(raw,side){const o=new Set();const rx=/\\[AUDIT v21: DEBATE RULE VIOLATION REPORT -- SEAT: [^;\\]]*; ITEM: (DEFENDER|CHALLENGER) premise (\\d+); RULE: K-UNX; RESULT: CURED; WHY: [^\\]]*?CORRECTED COUNT \\d+ takes the premise out of the count/g;
 for(const m of String(raw||'').replace(/\\\\+"/g,'"').matchAll(rx))if(m[1]===side)o.add(+m[2]);return o;}
function rctCheck(to,x,raw,RD,cur){const lk=sbLabel(to);const side=lk==='CHALLENGER CONCEDED LINKS'?'CHALLENGER':lk==='CONCEDED LINKS'?'DEFENDER':null;if(!side)return null;
 const out=rctOut(raw,side);if(!out.size)return null;const P=psGrades(to);if(!P)return null;const Q=psGrades(cur);const back=[...out].filter(j=>P.g[j]==='COUNTED'&&!(Q&&Q.g[j]==='COUNTED')); /* only a premise the line being replaced does not count (33249 grok: the line already counted it) */if(!back.length)return null;
 const rk=side==='CHALLENGER'?'DR3':'CR3';const bad=[];
 for(const j of back){const bk=RD&&typeof RD[rk]==='string'?lbBlockText(RD[rk],j):'';if(!bk)continue;const kk=lbFoot(bk,true);if(!kk.length)continue; /* no block read: not refused */
  const txt=unxSegs(String(to)).filter(s=>s.ns.includes(j)).map(s=>s.seg).concat([String(x&&x.why||'')]);if(!txt.some(t=>unxLack(t,kk).missing.length>0))bad.push({j,kk});}
 if(!bad.length)return null;
 return 'RECOUNTED AFTER CURE (pkgRCT, W3 2819): '+bad.map(b=>side+' premise '+b.j).join(', ')+' was taken out by your CORRECTED COUNT; the change names no layer the block lacks (its ['+rk+'] block exhibits '+bad[0].kk.join(' and ')+'). The count stays at your cure value. To count it again, name in the reason a layer ("[L1]", "[L2]", "[L3]") that block does not exhibit.';}
`;
const A="  const lk=sbLabel(to);const same=lk?lines.filter(l=>sbLabel(l)===lk):[];";
const B="  {const __rct=rctCheck(to,x,raw,RD,map.has(o)?map.get(o).to:o);if(__rct){items.push({sid:x.sid,kind:'NOT APPLIED',why:__rct,to,lines:[o],rct:true});continue;}} /* pkgRCT (W3 2819) */\n"+A;
const C="cured=a.ans==='KEEP'||applied.has(x.gid)||dup||sup;";
const D=C+"const __rct=!cured&&a.ans==='CHANGE'&&((R2.R1&&R2.R1.items)||[]).find(z=>z&&z.sid===x.gid&&z.rct); /* pkgRCT (W3 2819 item 3): the refusal is recorded; no seat removed */if(__rct){cured=true;}";
const E0="why=a.ans==='KEEP'?'KEEP: the change stays unapplied':(applied.has(x.gid)";
const E1="why=__rct?'pkgRCT refused the gate change and the count stays at your cure value (recorded, no seat removed; W3 2819): '+String(__rct.why).slice(0,300):a.ans==='KEEP'?'KEEP: the change stays unapplied':(applied.has(x.gid)";
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor x'+n);return s.split(a).join(b);};
const BASE=ON?OUT+'_base':OUT.replace(/patched[^/]*$/,'base');fs.mkdirSync(OUT,{recursive:true});fs.mkdirSync(BASE,{recursive:true});const plan={base:FB+(ON?' + '+ON:''),nodes:[]};
for(const n of NS){const s0=(n.parameters||{}).jsCode;if(typeof s0!=='string'||!s0.includes('function sbApply2024('))continue;
 let s=rep(s0,A,B,n.name+' apply');s=rep(s,C,D,n.name+' gate cure');s=rep(s,E0,E1,n.name+' gate why');s=rep(s,'function sbApply2024(',LIB+'function sbApply2024(',n.name+' lib');
 new Function('$','$input','$json','$execution','$workflow',s);const f=n.name.replace(/ /g,'_')+'.js';fs.writeFileSync(BASE+'/'+f,s0);fs.writeFileSync(OUT+'/'+f,s);
 plan.nodes.push({name:n.name,file:f,base_sha:sha(s0),final_sha:sha(s),edits:['apply','gate cure','gate why','lib']});console.log(n.name.padEnd(28),sha(s0),'->',sha(s));}
fs.writeFileSync(OUT+'/../plan_'+OUT.split('/').pop()+'.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length,'nodes');
