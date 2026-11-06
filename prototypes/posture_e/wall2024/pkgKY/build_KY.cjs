// pkgKY (W3 2362, run 33025 grok G2/G3). Run from wall2024/: node pkgKY/build_KY.cjs
// A gate or send-back CHANGE TO may regrade a collision line on the keystone link (grok 33025: D5 vs C4 to DEFENDER LINK BROKEN). The KEYSTONE
// line is not a line of that item, so the judge has no legal way to move it, and E-APPLY refused the change as contradicting "KEYSTONE: D5 --
// STANDS". Now, when an applied change regrades a keystone collision and no change touched the KEYSTONE line, E-APPLY re-derives the KEYSTONE
// line from the keystone's collision grades (BROKEN when one is DEFENDER LINK BROKEN; STANDS when none is any longer and the old line is not
// exempt under rule 1) and records it as derived (sid "KEYSTONE (derived)"). A KEYSTONE line the judge itself changed is still checked and
// refused as before. Rule 2 (KEYSTONE BROKEN against the derived verdict) is unchanged.
// (b) A gate CHANGE whose line a later gate change of the same judge rewrote (the last change wins in E-APPLY) is judged with the change that
// wrote the line: it cures when its item is no longer raised. A new LIVE K item raised by that line is found by reading the text again without
// every change on the line (pkgGL read them one at a time, so two changes on one line hid it) and is counted once, on the change that wrote it.
// (33025 grok: G2 and G3 both rewrite D5 vs C4; G3 wins.)
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const A=" {const seen=new Set();for(const kx of keyChecks(build(map))){";
const B=" {const P0=rcLines(build(map));const km=P0.key?P0.key.u.match(/^KEYSTONE\\s*:\\s*(D\\d+)\\s*(?:--|\\u2014|-|:)?\\s*(STANDS|BROKEN)\\b/):null; /* pkgKY (W3 2362): the KEYSTONE line re-derived from its collision grades */\n"
 +"  if(km){const kraw=P0.key.raw;const keyO=lines.find(l=>l===kraw)||find(kraw);const touched=[...map].some(([o,c])=>nrm(o)===nrm(kraw)||nrm(c.to)===nrm(kraw));\n"
 +"   const g0=new Map(rcLines(text).col.map(z=>[U(z.link),z.grade]));const kc=P0.col.filter(z=>U(z.link).startsWith(km[1]+' VS'));const moved=kc.filter(z=>g0.has(U(z.link))&&g0.get(U(z.link))!==z.grade);\n"
 +"   const brl=kc.filter(z=>z.grade==='DEFENDER LINK BROKEN');let d=null;\n"
 +"   if(km[2]==='STANDS'&&brl.length&&moved.some(z=>z.grade==='DEFENDER LINK BROKEN'))d='BROKEN';\n"
 +"   else if(km[2]==='BROKEN'&&!brl.length&&moved.some(z=>g0.get(U(z.link))==='DEFENDER LINK BROKEN')&&!sbKeyExempt2024(kraw,P0,RD))d='STANDS';\n"
 +"   if(d&&keyO&&!touched){const pre=(String(keyO).match(/^\\s*(?:[-\\u2022]\\s+|\\d+[.)]\\s+)?[*_]*KEYSTONE[*_]*\\s*:\\s*[*_]*/i)||['KEYSTONE: '])[0];\n"
 +"    const to=pre+km[1]+' -- '+d+' -- derived by the engine from the collision grade'+(d==='BROKEN'?' '+brl.map(z=>z.link).join(', ')+' DEFENDER LINK BROKEN':'s of '+km[1]+' (none DEFENDER LINK BROKEN)')+' after the change of '+[...new Set([...map].filter(([o,c])=>moved.some(z=>nrm(c.to).includes(nrm(z.raw))||U(c.to).includes(U(z.link)))).map(([o,c])=>c.sid))].join(', ')+' (E-APPLY, W3 2362)';\n"
 +"    map.set(keyO,{sid:'KEYSTONE (derived)',to,over:[],derived:true});}}}\n"
 +" {const seen=new Set();for(const kx of keyChecks(build(map))){";
const C1A="if(!(a&&a.ans==='CHANGE'&&applied.has(x.gid)))continue;const R3=gateItems2024(seat,raw,F,its2.filter(z=>!(z&&z.rule==='E-GATE'&&z.sid===x.gid)),ctx);";
const C1B="if(!(a&&a.ans==='CHANGE'&&applied.has(x.gid)))continue;const grp=grpOf(x.gid);const R3=gateItems2024(seat,raw,F,its2.filter(z=>!(z&&z.rule==='E-GATE'&&grp.includes(z.sid))),ctx); /* pkgKY (b): without every change on its line */";
const C2A=" const kby=new Map();";
const C2B=" const nL=s=>String(s==null?'':s).replace(/\\\\+/g,'').replace(/[*_`]+/g,'').replace(/\\s+/g,' ').trim(); /* pkgKY (b): gate changes on one line; the last one wins */\n"
 +" const grpOf=g=>{const me=add.find(z=>z.sid===g&&!z.forced_add);if(!me||!me.line)return [g];return add.filter(z=>!z.forced_add&&z.line&&nL(z.line)===nL(me.line)).map(z=>z.sid);};\n"
 +" const supBy=new Map();for(const z of add){if(z.forced_add)continue;const g=grpOf(z.sid);const w=g[g.length-1];if(w!==z.sid)supBy.set(z.sid,w);}\n"
 +" const kby=new Map();";
const C3A="  else{const st=!applied.has(x.gid)&&a.ans==='CHANGE'";
const C3B="  else if(a.ans==='CHANGE'&&supBy.has(x.gid)&&!applied.has(x.gid)&&applied.has(supBy.get(x.gid))){cured=!now.has(x.key);why=cured?'the later gate change '+supBy.get(x.gid)+' of this judge rewrote the same line (the last change wins), and the item is no longer raised':'the later gate change '+supBy.get(x.gid)+' rewrote the same line, and the item is still raised';} /* pkgKY (b) */\n"
 +"  else{const st=!applied.has(x.gid)&&a.ans==='CHANGE'";
const NODES=['Gate_Build','Alt_Gate_Build','Gate_Record','Alt_Gate_Record','Alternate_Merge','Alternate_Merge_Seat'];
fs.mkdirSync('pkgKY/patched',{recursive:true});const plan={base:'pkgCL/patched (ccb5639)',nodes:[]};
for(const n of NODES){const b=rd('pkgCL/patched/'+n+'.js');const k=b.split(A).length-1;if(k!==1)throw new Error(n+': anchor count '+k);let s=b.split(A).join(B);if(['Gate_Record','Alt_Gate_Record','Alternate_Merge','Alternate_Merge_Seat','Gate_Build','Alt_Gate_Build'].includes(n)){for(const [a,c,t] of [[C1A,C1B,'c1'],[C2A,C2B,'c2'],[C3A,C3B,'c3']]){const k2=s.split(a).length-1;if(k2!==1)throw new Error(n+' '+t+': anchor count '+k2);s=s.split(a).join(c);}}
 fs.writeFileSync('pkgKY/patched/'+n+'.js',s);plan.nodes.push({file:n+'.js',name:n.replace(/_/g,' '),base_sha:sha(b),final_sha:sha(s)});}
fs.writeFileSync('pkgKY/plan_KY.json',JSON.stringify(plan,null,1));plan.nodes.forEach(x=>console.log(x.name,x.base_sha,'->',x.final_sha));
