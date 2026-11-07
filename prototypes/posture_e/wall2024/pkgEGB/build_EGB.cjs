// pkgEGB-1 (W1, screen_EGB.md), ENFORCER accuracy fix, side-neutral: E-GATE B (gateAnsGround2024) reads an ANSWER CHECK graded MISSES as "that press stands".
// A check whose MEANS is NONE grades a press the ledger holds unproven (not a witness): no press stands, so no ground can contradict it.
// 33149 chatgpt G1 (Matthew 1:19 [CR3]) and 33299 chatgpt G1 (Luke 1:27 [DR2]) were raised this way. Every other E-GATE B item is unchanged.
// Base: live ae5636d0 (fetchback_live_s39.json). Run from wall2024/: node pkgEGB/build_EGB.cjs [--fb f] [--on dirs] [--out dir]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};
const FB=arg('--fb','/mnt/project-files/wall2024/fetchback_live_s39.json');const OUT=arg('--out','pkgEGB/patched');const ON=arg('--on',null);
const w=JSON.parse(fs.readFileSync(FB,'utf8'));const W=w.data||w;const NS=(W.nodes||W.workflow.nodes);
if(ON)for(const d of ON.split(','))for(const n of NS){const f=d+'/'+n.name.replace(/ /g,'_')+'.js';if(n.parameters&&typeof n.parameters.jsCode==='string'&&fs.existsSync(f))n.parameters.jsCode=fs.readFileSync(f,'utf8');}
const A="if(!gs.length||gs[gs.length-1][1].toUpperCase()!=='MISSES')continue;";
const B=A+"if(/(?:--|—)\\s*MEANS\\s*:\\s*NONE\\b/i.test(l))continue; /* pkgEGB-1: MEANS NONE = an unproven press; none stands */";
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor x'+n);return s.split(a).join(b);};
const BASE=ON?OUT+'_base':OUT.replace(/patched[^/]*$/,'base');fs.mkdirSync(OUT,{recursive:true});fs.mkdirSync(BASE,{recursive:true});const plan={base:FB+(ON?' + '+ON:''),nodes:[]};
for(const n of NS){const s0=(n.parameters||{}).jsCode;if(typeof s0!=='string'||!s0.includes('function gateAnsGround2024('))continue;
 const s=rep(s0,A,B,n.name);new Function('$','$input','$json','$execution','$workflow',s);const f=n.name.replace(/ /g,'_')+'.js';fs.writeFileSync(BASE+'/'+f,s0);fs.writeFileSync(OUT+'/'+f,s);
 plan.nodes.push({name:n.name,file:f,base_sha:sha(s0),final_sha:sha(s),edits:['means none']});console.log(n.name.padEnd(28),sha(s0),'->',sha(s));}
fs.writeFileSync(OUT+'/../plan_'+OUT.split('/').pop()+'.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length,'nodes');
