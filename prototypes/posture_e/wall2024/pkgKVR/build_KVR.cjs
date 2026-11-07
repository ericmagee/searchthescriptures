// pkgKVR (W2, run 33311 chatgpt): a K-V item may be answered on its RESPONSE line. The K-V cure read only a STATEMENT for the item; chatgpt answered
// "CHALLENGER premise 3" on a RESPONSE that quotes the charge words ("and not to the divine act") and names the kind ("a claim the quoted words do not make"),
// so the item stood UNCURED and removed the seat. Now, when no STATEMENT passes, the item's RESPONSE (respOf, the same reader the other cures use) is run
// through the same kvRulingOk test. Nothing else changes: a RESPONSE that fails kvRulingOk stays UNCURED, and the restated-count path is untouched.
// Base per node: pkgPSN/patched_on_pkgCPD_patched_on_RXR/<file>, else pkgCPD/patched_on_RXR/<file>, else live 44e800f1 (fetchback_live_s32.json).
// Run from wall2024/: node pkgKVR/build_KVR.cjs
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s32.json','utf8'));const L=(W.data||W);
const BASES=['pkgPSN/patched_on_pkgCPD_patched_on_RXR','pkgCPD/patched_on_RXR'];
const A="if(st&&CH){const v=kvRulingOk(st,x.premise,CH,UNI);if(v.ok)return res('CURED','statement quotes the charge words ('+(v.q||v.why)+') and names the kind',['STATEMENT: '+st]);}";
const E=[[A,A+"{const rp=CH?respOf(x):null;if(rp){const v=kvRulingOk(rp,x.premise,CH,UNI);if(v.ok)return res('CURED','response quotes the charge words ('+(v.q||v.why)+') and names the kind',['RESPONSE: '+rp]);}} /* pkgKVR (33311 chatgpt premise 3): the item's RESPONSE carries the statement */"]];
const OUT='pkgKVR/patched';const plan={source:'W2, run 33311 chatgpt K-V premise 3',base:BASES.join(' > ')+' > live '+L.versionId,nodes:[]};fs.mkdirSync(OUT,{recursive:true});
for(const n of L.nodes){const live=n.parameters&&n.parameters.jsCode;if(!live||!live.includes(A.slice(0,40)))continue;const f=n.name.replace(/ /g,'_')+'.js';
 let s0=live,src='live';for(const d of BASES)if(fs.existsSync(d+'/'+f)){s0=fs.readFileSync(d+'/'+f,'utf8');src=d;break;}
 let s=s0;for(const [a,b] of E){const c=s.split(a).length-1;if(c!==1)throw new Error(n.name+' anchor x'+c);s=s.replace(a,()=>b);}
 new Function('$','$input','$json','$execution','$workflow',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({name:n.name,file:f,base:src,live_sha:sha(live),base_sha:sha(s0),final_sha:sha(s)});}
fs.writeFileSync('pkgKVR/plan_KVR.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes -> '+OUT);
