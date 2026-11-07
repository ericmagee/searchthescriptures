// pkgL2R build: every code node that holds the [L2] library L2C gets the same 5 edits (src_L2R.cjs), and Build Save Body gets its new
// AUDIT v28 [L2] CHECK line. Each edit must match exactly once, inside the L2C statement, or the build stops. The edits are text-exact, so
// the build runs on any base that holds this L2C; W4 runs it on its own fresh fetch-back.
// Default base: fetchback_live_1b49671d with pkgSLA laid on it (= live n24). Run from wall2024/:
//   node pkgL2R/build_L2R.cjs [in workflow JSON] [out workflow JSON]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const {L2C_PAIRS,BSB_OLD,BSB_NEW}=require('./src_L2R.cjs');const {stmt}=require('./lib.cjs');
const IN=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_1b49671d.json',OUTW=process.argv[3]||'pkgL2R/out/workflow_L2R.json';
let w=JSON.parse(fs.readFileSync(IN,'utf8'));w=w.nodes?w:(w.data||w);const N=Object.fromEntries(w.nodes.map(n=>[n.name,n]));
if(!process.argv[2]){const SP=JSON.parse(fs.readFileSync('pkgSLA/plan_SLA.json','utf8'));for(const x of SP.nodes){const n=x.file.slice(0,-3).replace(/_/g,' ');const cur=N[n].parameters.jsCode;
 if(sha(cur)===x.final_sha)continue;if(sha(cur)!==x.base_sha)throw new Error('pkgSLA '+n+': sha '+sha(cur)+' is neither its base nor its final');N[n].parameters.jsCode=fs.readFileSync('pkgSLA/patched/'+x.file,'utf8');}}
for(const d of ['patched','base','out'])fs.mkdirSync('pkgL2R/'+d,{recursive:true});
const once=(s,a,b,where)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(where+': edit found '+k+' times: '+a.slice(0,70));return s.replace(a,()=>b);};
const plan={base:IN,nodes:[]};const H='const L2C=(()=>{';
for(const n of w.nodes){const s0=(n.parameters||{}).jsCode;if(typeof s0!=='string'||!s0.includes(H))continue;
 const L0=stmt(s0,H);let L1=L0;for(const [a,b] of L2C_PAIRS)L1=once(L1,a,b,n.name);let s=s0.replace(L0,()=>L1);
 if(n.name==='Build Save Body')s=once(s,BSB_OLD,BSB_NEW,n.name);
 new Function('$','$input','$json',s);const f=n.name.replace(/ /g,'_')+'.js';fs.writeFileSync('pkgL2R/base/'+f,s0);fs.writeFileSync('pkgL2R/patched/'+f,s);n.parameters.jsCode=s;
 plan.nodes.push({node:n.name,base_sha:sha(s0),final_sha:sha(s),l2c_base:sha(L0),l2c_final:sha(L1)});}
// Build Save Body holds no L2C: its one edit on its own
{const n=N['Build Save Body'];if(!plan.nodes.some(p=>p.node===n.name)){const s0=n.parameters.jsCode;const s=once(s0,BSB_OLD,BSB_NEW,n.name);new Function('$','$input','$json',s);
 fs.writeFileSync('pkgL2R/base/Build_Save_Body.js',s0);fs.writeFileSync('pkgL2R/patched/Build_Save_Body.js',s);n.parameters.jsCode=s;plan.nodes.push({node:n.name,base_sha:sha(s0),final_sha:sha(s)});}}
const L2Cs=new Set(plan.nodes.filter(p=>p.l2c_base).map(p=>p.l2c_base+'>'+p.l2c_final));if(L2Cs.size!==1)throw new Error('the L2C copies differ: '+[...L2Cs].join(' '));
plan.l2c=[...L2Cs][0];fs.writeFileSync(OUTW,JSON.stringify(w));fs.writeFileSync('pkgL2R/plan_L2R.json',JSON.stringify(plan,null,1));
console.log(plan.nodes.length+' nodes ('+(plan.nodes.length-1)+' with L2C + Build Save Body); one L2C '+plan.l2c);
