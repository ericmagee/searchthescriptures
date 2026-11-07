// pkgUNX0 (W1, from 33311 gemini CHALLENGER premise 4; Wall 2805): kunxLines raises K-UNX only when the side's count is 1 or more.
// In 33311 gemini's cure took premise 4 out (CORRECTED COUNT 0) but left its own line "Premise 4: UNEXHIBITED (a pressed witness left unanswered ...)".
// ciCountSection reads every line after the count line, so the post-cure text (count 0) still raised K-UNX premise 4 by the K-UNX-A route; when the
// gate change G12 put the count back to 1, the gate re-read (gateNewK2024) dropped the same key as "not new". A count of 0 counts nothing, so no
// K-UNX item can stand on it. TRIAL rule: raise only, no count written (W3 2747).
// Run from wall2024/: node pkgUNX0/build_UNX0.cjs [--fb f] [--on dir1,dir2,...] [--out dir]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};
const FB=arg('--fb','/mnt/project-files/wall2024/fetchback_live_s32.json');const OUT=arg('--out','pkgUNX0/patched');const ON=arg('--on',null);
const w=JSON.parse(fs.readFileSync(FB,'utf8'));const W=w.data||w;const NS=(W.nodes||W.workflow.nodes);
if(ON)for(const d of ON.split(','))for(const n of NS){const f=d+'/'+n.name.replace(/ /g,'_')+'.js';if(n.parameters&&typeof n.parameters.jsCode==='string'&&fs.existsSync(f))n.parameters.jsCode=fs.readFileSync(f,'utf8');}
const A="const lab=side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS';\n  const SG=unxSegs(sec);";
const B="const lab=side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS';if(!(n0>=1))continue; /* pkgUNX0 (W1 2805): a count of 0 counts nothing; a stray UNEXHIBITED line under it raises no K-UNX */\n  const SG=unxSegs(sec);";
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor x'+n);return s.split(a).join(b);};
const BASE=ON?OUT+'_base':OUT.replace(/patched[^/]*$/,'base');fs.mkdirSync(OUT,{recursive:true});fs.mkdirSync(BASE,{recursive:true});const plan={base:FB+(ON?' + '+ON:''),nodes:[]};
for(const n of NS){const s0=(n.parameters||{}).jsCode;if(typeof s0!=='string'||!s0.includes('function kunxLines('))continue;const s=rep(s0,A,B,n.name);
 new Function('$','$input','$json','$execution','$workflow',s);const f=n.name.replace(/ /g,'_')+'.js';fs.writeFileSync(BASE+'/'+f,s0);fs.writeFileSync(OUT+'/'+f,s);
 plan.nodes.push({name:n.name,file:f,base_sha:sha(s0),final_sha:sha(s),edits:['count test']});console.log(n.name.padEnd(28),sha(s0),'->',sha(s));}
fs.writeFileSync(OUT+'/../plan_'+OUT.split('/').pop()+'.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length,'nodes');
