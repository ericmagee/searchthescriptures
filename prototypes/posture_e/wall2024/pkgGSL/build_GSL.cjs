// pkgGSL (run 33222 grok, first live alternate, unseated by 3 false E-GATE items): gate changes on one line, the last one wins, for NOT APPLIED items.
// grok was sent 4 E-APPLY items (S35-S38), all refused changes to its one CONCEDED LINKS line. At the gate it answered G1-G4 with four CHANGE TO
// lines for that same line. E-APPLY wrote the last (G4), so G4 was CURED ("the gate change was applied"). G1-G3's changes were superseded, not
// refused, but the NOT APPLIED branch of gateCure2024 cures only on KEEP, its own change applied, or its own text already standing in the
// corrected text (pkgCL). Their wording differs from G4's, so all three stayed UNCURED, counted in drv_uncured, and grok was not seated.
// pkgKY (b) already cures a superseded gate change ("the last change wins") for other item kinds; its branch comes after the NOT APPLIED branch,
// so NOT APPLIED items never reached it.
// Fix (gateCure2024, the 6 gate-library nodes): a NOT APPLIED item whose CHANGE was superseded by a later gate change of the same judge on the
// same line (supBy, pkgKY b), where that later change was applied, is CURED. The pkgGL check (a change that raised a new LIVE K item does not
// cure) still runs after it. Nothing else changes.
// Base: live s16 (7efcffc7, fetchback_live_s16.json). Run from wall2024/: node pkgGSL/build_GSL.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const SRC=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s16.json';const LIVE=JSON.parse(fs.readFileSync(SRC,'utf8'));
const NODES=['Gate Build','Gate Record','Alt Gate Build','Alt Gate Record','Alternate Merge Seat','Alternate Merge'];
const A="cured=a.ans==='KEEP'||applied.has(x.gid)||dup;why=a.ans==='KEEP'?'KEEP: the change stays unapplied':(applied.has(x.gid)?'the gate change was applied':dup?'the gate change is already in the corrected text (another change wrote the same line; W3 2319)':'the gate change was not applied');}";
const B="const sup=!dup&&a.ans==='CHANGE'&&!applied.has(x.gid)&&supBy.has(x.gid)&&applied.has(supBy.get(x.gid)); /* pkgGSL (33222 grok G1-G3): superseded on its line by a later applied gate change of this judge (pkgKY b) */\n  cured=a.ans==='KEEP'||applied.has(x.gid)||dup||sup;why=a.ans==='KEEP'?'KEEP: the change stays unapplied':(applied.has(x.gid)?'the gate change was applied':dup?'the gate change is already in the corrected text (another change wrote the same line; W3 2319)':sup?'the later gate change '+supBy.get(x.gid)+' of this judge rewrote the same line (the last change wins) and was applied':'the gate change was not applied');}";
const plan={source:'run 33222 grok G1-G3',live:LIVE.versionId,nodes:[]};for(const d of ['base','patched'])fs.mkdirSync('pkgGSL/'+d,{recursive:true});
for(const n of NODES){const f=n.replace(/ /g,'_')+'.js';const s0=LIVE.nodes.find(z=>z.name===n).parameters.jsCode;const c=s0.split(A).length-1;if(c!==1)throw new Error(n+': anchor x'+c);
 const s=s0.split(A).join(B);new Function('$','$input','$json','$execution','$workflow',s);fs.writeFileSync('pkgGSL/base/'+f,s0);fs.writeFileSync('pkgGSL/patched/'+f,s);
 plan.nodes.push({name:n,file:f,base_sha:sha(s0),final_sha:sha(s)});console.log(n.padEnd(22),sha(s0),'->',sha(s));}
fs.writeFileSync('pkgGSL/plan_GSL.json',JSON.stringify(plan,null,1));
