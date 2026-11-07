// pkgKWR (W3 grade_33276 item 3, Wall 2772, proposed there as "pkgKWC"; renamed because pkgKWC already names W3 2596's CONCEDED change):
// in the K-W NOT HELD cure, a parenthetical verse reference such as "(Isaiah 8:18)" is dropped from the flagged body and from the nhqFull sentences
// before the 6-word runs are built. Run 33276: chatgpt's NOT HELD quoted "Isaiah's own children are signs", the whole sentence but its "(Isaiah 8:18)",
// and stayed UNCURED because every 6-word run of the 8-word body held "isaiah 8 18". Only a parenthesis holding nothing but references is dropped.
// Base: pkgUNXA2/patched (graded first; same 19 nodes). With --on-live the base is live 4f62e6cf (fetchback_live_s28.json).
// Run from wall2024/: node pkgUNXA2/build_UNXA2.cjs && node pkgKWR/build_KWR.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const ONLIVE=process.argv.includes('--on-live');const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s28.json','utf8'));const L=(W.data||W);
const REF="const KWR_REF=/\\s*\\((?:\\s*(?:[1-3]\\s*)?[A-Z][A-Za-z]*\\.?(?:\\s+of\\s+[A-Z][a-z]+|\\s+[A-Z][a-z]+)?\\s+)?\\d+:\\d+(?:\\s*[-\\u2013]\\s*\\d+)?(?:\\s*[,;]\\s*(?:(?:[1-3]\\s*)?[A-Z][A-Za-z]*\\.?(?:\\s+[A-Z][a-z]+)?\\s+)?\\d+(?::\\d+)?(?:\\s*[-\\u2013]\\s*\\d+)?)*\\s*\\)/g; /* pkgKWR: a parenthesis of verse references only */";
const E=[["if(KW_NH){const nw=","if(KW_NH){"+REF+"const nw="],
 ["const fs0=a>=0&&b>a?q.slice(a+1,b):q;","const fs0=(a>=0&&b>a?q.slice(a+1,b):q).replace(KWR_REF,' ');"],
 ["nhqFull(x.line,R).map(f=>__rn(nw(f.replace(","nhqFull(x.line,R).map(f=>__rn(nw(f.replace(KWR_REF,' ').replace("]];
const plan={source:'W3 grade_33276 item 3 (Wall 2772)',base:ONLIVE?'live '+L.versionId:'pkgUNXA2/patched (on live '+L.versionId+')',nodes:[]};const OUT=ONLIVE?'pkgKWR/patched_on_live':'pkgKWR/patched';fs.mkdirSync(OUT,{recursive:true});
for(const n of L.nodes){const live=n.parameters&&n.parameters.jsCode;if(!live||!live.includes(E[0][0]))continue;const f=n.name.replace(/ /g,'_')+'.js';
 const s0=!ONLIVE&&fs.existsSync('pkgUNXA2/patched/'+f)?fs.readFileSync('pkgUNXA2/patched/'+f,'utf8'):live;let s=s0;
 for(const [a,b] of E){const c=s.split(a).length-1;if(c!==1)throw new Error(n.name+' anchor x'+c+': '+a.slice(0,40));s=s.replace(a,()=>b);}
 new Function('$','$input','$json','$execution','$workflow',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({name:n.name,file:f,live_sha:sha(live),base_sha:sha(s0),final_sha:sha(s)});}
fs.writeFileSync(ONLIVE?'pkgKWR/plan_KWR_on_live.json':'pkgKWR/plan_KWR.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes -> '+OUT);
