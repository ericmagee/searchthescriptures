// pkgUNXA2 (W3 grade_33276 item 4, Wall 2772): the K-UNX-A STATEMENT cure reads the missing layer with unxLack, the same test as the plain K-UNX cure (pkgUNXW/UNXW2).
// Before: any lack word ("lacks any footing for the step", a fit ground) after the [L1] quote cured it. The item's own line asked for that ("name what that verse lacks for the step").
// Now: the STATEMENT must still quote the block's [L1], and must name a layer the block does not exhibit; the line asks for exactly that.
// Base: live 4f62e6cf (/mnt/project-files/wall2024/fetchback_live_s28.json). Run from wall2024/: node pkgUNXA2/build_UNXA2.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s28.json','utf8'));const L=(W.data||W);
const CURE=[["const lack=/\\b(?:not|no|lacks?|lacking|without|silent|never|nothing|none|neither|nor)\\b/i.test(bare);","const lack=!!st&&unxLack(st,x.kinds).missing.length>0; /* pkgUNXA2: a layer named as missing (unxLack), not any lack word */"],
 ["and says what it lacks',['STATEMENT: '+st]);","and names a layer the block does not exhibit ([L'+unxLack(st,x.kinds).missing.join('], [L')+'])',['STATEMENT: '+st]);"],
 ["'the STATEMENT quotes the [L1] but says nothing it lacks'","'the STATEMENT quotes the [L1] but names no layer the block does not exhibit (a failure of fit is graded at the collision, not counted)'"]];
const ASK=[" in a STATEMENT for this item and name what that verse lacks for the step, or write"," in a STATEMENT for this item and name the layer the block lacks (\"[L1]\", \"[L2]\", \"[L3]\" or \"[L4]\", one the block does not exhibit; a failure of fit is not a missing layer), or write"];
const plan={source:'W3 grade_33276 item 4 (Wall 2772)',base:'live '+L.versionId+' fetchback_live_s28.json',nodes:[]};fs.mkdirSync('pkgUNXA2/patched',{recursive:true});
for(const n of L.nodes){const s0=n.parameters&&n.parameters.jsCode;if(!s0||!s0.includes(ASK[0]))continue;const E=s0.includes('function unxLack(')?CURE.concat([ASK]):[ASK];let s=s0;
 for(const [a,b] of E){const c=s.split(a).length-1;if(c!==1)throw new Error(n.name+' anchor x'+c+': '+a.slice(0,40));s=s.replace(a,()=>b);}
 new Function('$','$input','$json','$execution','$workflow',s);const f=n.name.replace(/ /g,'_')+'.js';fs.writeFileSync('pkgUNXA2/patched/'+f,s);plan.nodes.push({name:n.name,file:f,edits:E.length,base_sha:sha(s0),final_sha:sha(s)});}
fs.writeFileSync('pkgUNXA2/plan_UNXA2.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes, '+plan.nodes.filter(x=>x.edits===4).length+' with the cure');
