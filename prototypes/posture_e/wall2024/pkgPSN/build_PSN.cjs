// pkgPSN (W3 grade_33289 item 3, Wall 2780): psGrades reads a negated count ("not counted", "are not counted", "never counted", "uncounted") as SPARED.
// Run 33289 sol G14/G15: the line "Premises 1, 2, 3, 4 and 6 are spared" and the change "premises 2, 3 and 6 retain exhibited footing and are not counted"
// give the same grade, but psGrades took "counted" out of "not counted" as the clause's first grade word, so the change was read as regrading 2, 3, 6.
// Base: live a353b9e8 (fetchback_live_s31.json). With --on <dir>, the base for a node is <dir>/<file> when it exists (e.g. pkgUNXL/patched).
// Run from wall2024/: node pkgPSN/build_PSN.cjs  [and: node pkgPSN/build_PSN.cjs --on pkgUNXL/patched]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const i=process.argv.indexOf('--on');const ON=i>0?process.argv[i+1]:null;const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s31.json','utf8'));const L=(W.data||W);
const E=[["const c=c0.replace(/\\bnone\\s+counted\\b/ig,' ');","const c=c0.replace(/\\bnone\\s+counted\\b/ig,' ').replace(/\\b(?:(?:are|is|were|was|be|been)\\s+)?(?:not|never)\\s+counted\\b|\\buncounted\\b/ig,' spared '); /* pkgPSN (W3 2780): a negated count is SPARED */"]];
const tag=ON?ON.replace(/[\/]/g,'_'):'live';const OUT='pkgPSN/patched'+(ON?'_on_'+tag:'');const plan={source:'W3 grade_33289 item 3 (Wall 2780)',base:ON?ON+' (else live '+L.versionId+')':'live '+L.versionId,nodes:[]};fs.mkdirSync(OUT,{recursive:true});
for(const n of L.nodes){const live=n.parameters&&n.parameters.jsCode;if(!live||!live.includes('function psGrades('))continue;const f=n.name.replace(/ /g,'_')+'.js';
 const s0=ON&&fs.existsSync(ON+'/'+f)?fs.readFileSync(ON+'/'+f,'utf8'):live;let s=s0;
 for(const [a,b] of E){const c=s.split(a).length-1;if(c!==1)throw new Error(n.name+' anchor x'+c);s=s.replace(a,()=>b);}
 new Function('$','$input','$json','$execution','$workflow',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({name:n.name,file:f,base:s0===live?'live':ON,live_sha:sha(live),base_sha:sha(s0),final_sha:sha(s)});}
fs.writeFileSync('pkgPSN/plan_PSN'+(ON?'_on_'+tag:'')+'.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes -> '+OUT+' ('+plan.nodes.filter(x=>x.base!=='live').length+' on '+(ON||'-')+')');
