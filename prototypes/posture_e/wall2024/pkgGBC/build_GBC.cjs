// pkgGBC (W1, from 33311 gemini G13; Wall 2805), ENFORCER fix, side-neutral: a gate change that raises a fresh LIVE E-GATE B contradiction does not cure.
// In 33311 gemini's G13 was a CONTRADICTION item (its ANSWER CHECK on Matthew 1:18 grades MISSES while D4 vs C4 is footed on Matthew 1:18). Its CHANGE TO
// swapped the [L3] ground to Genesis 4:1, which its own ANSWER CHECK also grades MISSES. G13's key cleared, so it read CURED, and the same contradiction
// under the new verse was "RECORD-ONLY, not counted" (gateCure2024 ties only fresh LIVE "K re-read" items to the change that raised them; pkgGL, W3 2341).
// Change (narrow, W3 2813): the pkgGL attribution also takes a fresh LIVE E-GATE B item, but only for a gate change that flipped the grade of the collision
// the item names (33006 chatgpt G1: D2 vs C4 CHALLENGER LINK BROKEN to DEFENDER LINK BROKEN). A ground-only change (33311 G13) is not tied: RECORD-ONLY. The change whose removal clears the item stays UNCURED and is counted there once;
// the fresh row names it ("raised by the gate change of G13"). Nothing else moves.
// Run from wall2024/: node pkgGBC/build_GBC.cjs [--fb f] [--on dir1,dir2,...] [--out dir]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};
const FB=arg('--fb','/mnt/project-files/wall2024/fetchback_live_s32.json');const OUT=arg('--out','pkgGBC/patched');const ON=arg('--on',null);
const w=JSON.parse(fs.readFileSync(FB,'utf8'));const W=w.data||w;const NS=(W.nodes||W.workflow.nodes);
if(ON)for(const d of ON.split(','))for(const n of NS){const f=d+'/'+n.name.replace(/ /g,'_')+'.js';if(n.parameters&&typeof n.parameters.jsCode==='string'&&fs.existsSync(f))n.parameters.jsCode=fs.readFileSync(f,'utf8');}
const A="const NK=(R2.items||[]).filter(z=>!keysG.has(z.key)&&z.src==='K re-read'&&z.live);";
const B="const NK=(R2.items||[]).filter(z=>!keysG.has(z.key)&&(z.src==='K re-read'||z.src==='E-GATE B')&&z.live); /* pkgGBC (W1 2805, W3 2813): a fresh LIVE E-GATE B contradiction is tied to the gate change that flipped that collision's grade */";
const A2="const hit=NK.filter(z=>!k3.has(z.key));if(hit.length)kby.set(x.gid,hit);";
const B2="const hit=NK.filter(z=>!k3.has(z.key)&&(z.src!=='E-GATE B'||gbcFlip(z.key,R2.T1,R3.T1)));if(hit.length)kby.set(x.gid,hit); /* pkgGBC narrow (W3 2813): a ground-only change (33311 G13) is not tied; the fresh item stays RECORD-ONLY */";
const LIB="// pkgGBC (W1; W3 2813): did the gate change flip the grade of the collision an E-GATE B key names? Ta: text with the change, Tb: without it.\nfunction gbcFlip(key,Ta,Tb){const L=String(key||'').split('|')[3];if(!L)return false;const g=T=>{const c=(rcLines(T).col||[]).find(q=>String(q.link||'').toUpperCase().replace(/\\s+VS\\.?\\s+/,' VS ')===L);return c?(c.grade||null):null;};const a=g(Ta),b=g(Tb);return a!=null&&b!=null&&a!==b;}\n";
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor x'+n);return s.split(a).join(b);};
const BASE=ON?OUT+'_base':OUT.replace(/patched[^/]*$/,'base');fs.mkdirSync(OUT,{recursive:true});fs.mkdirSync(BASE,{recursive:true});const plan={base:FB+(ON?' + '+ON:''),nodes:[]};
for(const n of NS){const s0=(n.parameters||{}).jsCode;if(typeof s0!=='string'||!s0.includes('function gateCure2024('))continue;let s=rep(s0,A,B,n.name);s=rep(s,A2,B2,n.name+' narrow');s=rep(s,'function gateCure2024(',LIB+'function gateCure2024(',n.name+' lib');
 new Function('$','$input','$json','$execution','$workflow',s);const f=n.name.replace(/ /g,'_')+'.js';fs.writeFileSync(BASE+'/'+f,s0);fs.writeFileSync(OUT+'/'+f,s);
 plan.nodes.push({name:n.name,file:f,base_sha:sha(s0),final_sha:sha(s),edits:['attribution','narrow','lib gbcFlip']});console.log(n.name.padEnd(28),sha(s0),'->',sha(s));}
fs.writeFileSync(OUT+'/../plan_'+OUT.split('/').pop()+'.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length,'nodes');
