// pkgGSU (W3 ruling Wall 2996 on W2 2995; W1 check 2999). Gate "superseded" taken from the apply step's own replace record.
// 33490 gemini: G1 (collision line) and G2 (FORCED line) both answered with a COLLISION line for D1 vs C1. The apply step (sbApply2024) wrote G2 over
// both lines and recorded "G2 replaces G1 on the same line (the last change wins)"; gateCure2024 re-derived "same line" from the flagged line text
// (grpOf), did not group them, and counted G1 "the gate change was not applied" (false UNCURED; likewise G3/G4, G5/G6).
// Change (the 6 gate nodes that carry sbApply2024 + gateCure2024; library, ships as a LIB repack):
//  1. sbApply2024 returns its replace record: replace:[{sid,over:[...]}] (the same data its audit prints).
//  2. gateCure2024 takes "superseded" ONLY from that record (rule 1). grpOf stays only as the fallback when R1 carries no record (rule 4).
//  3. A superseded item is CURED when the winner was applied and the winner's line is for the same pair (or the same label) as the item's own change (rule 2);
//     a winner that was refused never cures it (rule 3, the applied test). With another pair or label, the item takes the winner's cure status (rule 2).
// Base layer: pkgLIB/strip_KFN (the last layer of pkgLIB_v13, live). Run from wall2024/: node pkgGSU/build_GSU.cjs  -> pkgLIB/strip_GSU/patched (6 files)
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const SRC=(process.argv[2]||'pkgLIB/strip_KFN/patched').replace(/\/?$/,'/'),OUT=(process.argv[3]||'pkgLIB/strip_GSU/patched').replace(/\/?$/,'/'); /* restack: node pkgGSU/build_GSU.cjs <last LIB layer>/patched pkgLIB/strip_GSU_on_X/patched */fs.mkdirSync(OUT,{recursive:true});
const NODES=['Alt_Gate_Build.js','Alt_Gate_Record.js','Alternate_Merge.js','Alternate_Merge_Seat.js','Gate_Build.js','Gate_Record.js'];
const R=[
 ["cpAdd:null,items,applied:sids}","cpAdd:null,items,applied:sids,replace:[...map.values()].filter(z=>z&&Array.isArray(z.over)&&z.over.length).map(z=>({sid:z.sid,over:z.over.slice()}))}"],
 ["const supBy=new Map();for(const z of add){if(z.forced_add)continue;const g=grpOf(z.sid);const w=g.slice(g.indexOf(z.sid)+1).filter(s=>applied.has(s)).pop();if(w)supBy.set(z.sid,w);}",
  "const supBy=new Map();const __gsuRep=R2.R1&&Array.isArray(R2.R1.replace)?R2.R1.replace:null;"
  +"if(__gsuRep){for(const r of __gsuRep)for(const s of r.over){const w0=supBy.get(s);if(!w0||(!applied.has(w0)&&applied.has(r.sid)))supBy.set(s,r.sid);}}"
  +"else for(const z of add){if(z.forced_add)continue;const g=grpOf(z.sid);const w=g.slice(g.indexOf(z.sid)+1).filter(s=>applied.has(s)).pop();if(w)supBy.set(z.sid,w);}"
  +"const __gsuKey=t=>{const u=String(t==null?'':t).replace(/\\\\+/g,'').replace(/[*_`]+/g,'').trim();const m=u.match(/^(?:RESTATED\\s*:\\s*)?(?:FORCED(?:\\s*\\(\\s*Commitment\\s+\\d+\\s*\\))?\\s*:\\s*)?(D\\d+)\\s+vs\\.?\\s+(C\\d+)\\b/i);if(m)return 'PAIR '+m[1].toUpperCase()+' VS '+m[2].toUpperCase();const l=sbLabel(u);return l?'LABEL '+l:null;};"
  +"const __gsuTo=s=>{const z=add.find(q=>q.sid===s&&!q.forced_add);if(z)return z.to;const a0=A[s];return a0&&a0.to?a0.to:null;};"
  +"const __gsuSame=(g,w)=>{const k1=__gsuKey(A[g]&&A[g].to),k2=__gsuKey(__gsuTo(w));return !!k1&&k1===k2;};const __gsuOther=new Map();"],
 ["const sup=!dup&&a.ans==='CHANGE'&&!applied.has(x.gid)&&supBy.has(x.gid)&&applied.has(supBy.get(x.gid));",
  "const __gw=!dup&&a.ans==='CHANGE'&&!applied.has(x.gid)&&supBy.has(x.gid)&&applied.has(supBy.get(x.gid))?supBy.get(x.gid):null;const sup=!!__gw&&(!__gsuRep||__gsuSame(x.gid,__gw));if(__gw&&!sup)__gsuOther.set(x.gid,__gw); /* pkgGSU */"],
 [" const keys0=new Set(G.map(x=>x.key));const fresh=",
  " if(__gsuOther.size)for(const r of res){const w=__gsuOther.get(r.gid);if(!w)continue;const rw=res.find(q=>q.gid===w);r.cured=rw?!!rw.cured:false;r.why='the later gate change '+w+' of this judge rewrote the same line (the last change wins; apply record) but its line is for another pair or label, so this item takes '+w+(rw?'\\'s cure status: '+(rw.cured?'CURED':'UNCURED'):', which is not a gate item: UNCURED')+' (pkgGSU, W3 2996)';}\n const keys0=new Set(G.map(x=>x.key));const fresh="],
];
const plan={base:SRC,nodes:{}};
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){let s=fs.readFileSync(SRC+f,'utf8');const s0=s;
 if(NODES.includes(f)){for(const [x,y] of R){const c=s.split(x).length-1;if(c!==1)throw new Error(f+': '+c+' x '+x.slice(0,70));s=s.replace(x,()=>y);}
  s=s.replace("'the later gate change '+supBy.get(x.gid)+' of this judge rewrote the same line (the last change wins) and was applied'",()=>"'the later gate change '+supBy.get(x.gid)+' of this judge rewrote the same line (the last change wins) and was applied'+(__gsuRep?' (apply record; pkgGSU)':'')");}
 new Function('$','$input','return (async()=>{'+s+'\n})()');if(s!==s0){fs.writeFileSync(OUT+f,s); /* only the 6 changed nodes: a pack layer replaces whole files */plan.nodes[f]={base:h(s0),patched:h(s)};console.log(f.padEnd(28),h(s0),'->',h(s));}}
fs.writeFileSync('pkgGSU/build_plan.json',JSON.stringify(plan,null,1));
