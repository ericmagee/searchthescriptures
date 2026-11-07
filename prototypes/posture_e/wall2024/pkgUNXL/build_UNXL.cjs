// pkgUNXL (W1, from 33289 grok DEFENDER premise 6): K-UNX on an ASSUMES/ROWS GIVE count that passes K-UNX-A but says the block "lacks" only layers the
// block exhibits. grok wrote "the block exhibits [L1] Luke 1:32 and [L2] pater and lacks [L1] for a gift apart from David's loins" on a block with
// [L1]-[L4]; K-UNX-A passed it because its ROWS GIVE quotes the block's [L1], so no reader saw the false lack. Raise only (TRIAL): no change refused,
// no count written (W3 2747). Lack reader: unxLack (UNXW2), copied byte for byte from Gate Build into the 3 raise-only nodes that lack it.
// Base: live s31 (fetchback_live_s31.json). Run from wall2024/: node pkgUNXL/build_UNXL.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const {closure}=require('../pkgEPK/lib_extract.cjs');
const FB='/mnt/project-files/wall2024/fetchback_live_s31.json';const w=JSON.parse(fs.readFileSync(FB,'utf8'));const W=w.data||w;const NS=(W.nodes||W.workflow.nodes);
const GB=NS.find(n=>n.name==='Gate Build').parameters.jsCode;const LACK=GB.slice(GB.indexOf('function unxLack('),GB.indexOf('\nfunction unxNamed('))+'\n';
if(!/^function unxLack\(s,kinds\)\{[\s\S]*\}\n$/.test(LACK))throw new Error('unxLack cut');
const A="    continue;}const blk=lbBlockText(R[rk],j);";
const B="    if(!ua&&bk){const kk=lbFoot(bk,true);const nl=all.map(z=>unxLack(z.seg,kk));const nm=[...new Set([].concat(...nl.map(r=>r.named)))].sort(); /* pkgUNXL */\n"
+"     if(kk.length>=2&&nm.length&&nl.every(r=>!r.missing.length)){const id=side+' premise '+j;if(!items.some(x=>x.link===id)){const z0=all[0];\n"
+"      const why='counted UNEXHIBITED in '+lab+' saying the block lacks '+nm.map(n=>'[L'+n+']').join(' and ')+', but its ['+rk+'] block exhibits '+kk.join(' and ')+'; the count names no layer the block lacks';\n"
+"      items.push({rule:'K-UNX',side,link:id,premise:j,kinds:kk,conc:n0,lack:nm,why,line:id+': '+why+'. Name the missing layer in a STATEMENT for this item (\"[L1]\", \"[L2]\", \"[L3]\" or \"[L4]\", one the block does not exhibit), or write a CORRECTED COUNT for '+lab+' without this premise and grade its fit at the collision (a FORCED line, ruling 411). Your count: '+z0.seg.replace(/\\s+/g,' ').trim().slice(0,400)});\n"
+"      marks.push('[AUDIT v49: DEBATE RULE VIOLATION (K-UNX) -- '+id+': '+why+'. TRIAL rule: answer it in the cure; it removes no seat; not counted in audit_flags.]');}}}\n"+A;
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor x'+n);return s.split(a).join(b);};
const OUT='pkgUNXL/patched',BASE='pkgUNXL/base';fs.mkdirSync(OUT,{recursive:true});fs.mkdirSync(BASE,{recursive:true});const plan={base:'live s31 (fetchback_live_s31.json)',nodes:[]};
for(const n of NS){const s0=(n.parameters||{}).jsCode;if(typeof s0!=='string'||!s0.includes('function kunxLines('))continue;let s=rep(s0,A,B,n.name);const ed=['raise'];
 if(!s0.includes('function unxLack(')){s=rep(s,'function kunxLines(',LACK+'function kunxLines(',n.name+' lib');ed.push('lib unxLack');}
 new Function('$','$input','$json','$execution','$workflow',s);const f=n.name.replace(/ /g,'_')+'.js';fs.writeFileSync(BASE+'/'+f,s0);fs.writeFileSync(OUT+'/'+f,s);
 plan.nodes.push({name:n.name,file:f,base_sha:sha(s0),final_sha:sha(s),edits:ed});console.log(n.name.padEnd(28),sha(s0),'->',sha(s),ed.join(','));}
fs.writeFileSync('pkgUNXL/plan_UNXL.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length,'nodes');
