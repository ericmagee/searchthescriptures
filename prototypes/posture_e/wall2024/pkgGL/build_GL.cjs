// pkgGL (W3 2341; built by W2). Run from wall2024/: node pkgGL/build_GL.cjs
// A gate CHANGE that raises a new LIVE K item does not cure: the item stays UNCURED and counts once; a new TRIAL item stays record-only.
// Run 33020 grok G2 regraded D1 vs C2 to DEFENDER LINK BROKEN; on pkgKS the K re-read raises K-G4 on it, but only as an item "raised after the
// gate answers" (record-only), so G2 was CURED and grok counted. The change that raised a new item is found by the engine: the corrected text is
// read again without that one gate change, and the new LIVE K items that then disappear are that change's. A new item no single change raises
// alone stays record-only (named so). 6 gate nodes on pkgKS/patched.
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const rep=(s,a,b,n)=>{const c=s.split(a).length-1;if(c!==1)throw new Error(n+': anchor count '+c+' for '+a.slice(0,60));return s.split(a).join(b);};
const E=[
 [" const res=G.map(x=>{const a=A[x.gid];let cured=false,why;",
  " const kby=new Map(); /* pkgGL (W3 2341): the new LIVE K items each applied gate CHANGE raised, found by reading the text again without it */\n"
 +" {const keysG=new Set(G.map(x=>x.key));const NK=(R2.items||[]).filter(z=>!keysG.has(z.key)&&z.src==='K re-read'&&z.live);\n"
 +"  if(NK.length)for(const x of G){const a=A[x.gid];if(!(a&&a.ans==='CHANGE'&&applied.has(x.gid)))continue;const R3=gateItems2024(seat,raw,F,its2.filter(z=>!(z&&z.rule==='E-GATE'&&z.sid===x.gid)),ctx);const k3=new Set((R3.items||[]).map(z=>z.key));const hit=NK.filter(z=>!k3.has(z.key));if(hit.length)kby.set(x.gid,hit);}}\n"
 +" const res=G.map(x=>{const a=A[x.gid];let cured=false,why;"],
 ["  return {gid:x.gid,kind:x.kind,src:x.src,live:x.live,ans:",
  "  if(cured&&kby.has(x.gid)){cured=false;why='the gate change raised a new LIVE item: '+kby.get(x.gid).map(z=>z.kind+' -- '+String(z.why||'').slice(0,240)).join('; ')+' (W3 2341: a change that raises a new LIVE K item does not cure; counted once, here)';} /* pkgGL */\n"
 +"  return {gid:x.gid,kind:x.kind,src:x.src,live:x.live,ans:"],
 ["const fresh=(R2.items||[]).filter(z=>!keys0.has(z.key)).map(z=>({kind:z.kind,src:z.src,why:z.why}));",
  "const fresh=(R2.items||[]).filter(z=>!keys0.has(z.key)).map(z=>({kind:z.kind,src:z.src,why:z.why,by:[...kby].filter(([g,l])=>l.some(y=>y.key===z.key)).map(([g])=>g).join(', ')||null}));"]];
const ER=[
 ["raised after the gate answers; RECORD-ONLY, not counted. REVIEW THIS ROW.]",
  "raised after the gate answers; '+(f.by?'raised by the gate change of '+f.by+', which stays UNCURED and is counted there once':'RECORD-ONLY, not counted')+'. REVIEW THIS ROW.]"],
 ["cure_reason:'raised after the gate answers: '+String(f.why).slice(0,600)+' (RECORD-ONLY)'",
  "cure_reason:'raised after the gate answers: '+String(f.why).slice(0,600)+(f.by?' (raised by the gate change of '+f.by+', which stays UNCURED and is counted there once; W3 2341)':' (RECORD-ONLY)')"]];
const NODES=['Gate_Build','Alt_Gate_Build','Gate_Record','Alt_Gate_Record','Alternate_Merge','Alternate_Merge_Seat'];
const plan={base:'pkgKS/patched (09bde04)',nodes:[]};
for(const n of NODES){const b=rd('pkgKS/patched/'+n+'.js');let s=b;for(const [a,c] of E.concat(/Gate_Record$/.test(n)?ER:[]))s=rep(s,a,c,n);
 fs.writeFileSync('pkgGL/patched/'+n+'.js',s);plan.nodes.push({file:n+'.js',name:n.replace(/_/g,' '),base_sha:sha(b),final_sha:sha(s)});}
fs.writeFileSync('pkgGL/plan_GL.json',JSON.stringify(plan,null,1));plan.nodes.forEach(x=>console.log(x.name+' '+x.base_sha+' -> '+x.final_sha));
