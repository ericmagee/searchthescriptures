// pkgGDUP (W3 2319; mechanism W1 2320; built by W2). Run from wall2024/: node pkgGDUP/build_GDUP.cjs
// Run 33006 grok G5 and G6: three gate items named one ANSWER CHECK line (as send-back S8 had rewritten it), and the judge gave the same
// CHANGE TO for each. E-APPLY wrote G4's change; G5 and G6 then could not find the line (sbApply's fallback matches only a map entry's current
// "to"), so they were not applied, and gateCure2024's last branch required each item's own change to apply. The seat was removed for 2 items
// its corrected text no longer raised. Fix (cure rule only, sbApply unchanged, so G4 stays the applied change): a CHANGE answer cures when the
// item is no longer raised and its CHANGE TO line stands in the corrected text, written there by another change. 6 gate nodes on pkgGD/patched.
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const rep=(s,a,b,name)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(name+': anchor count '+n);return s.split(a).join(b);};
const A1="  else{cured=!now.has(x.key)&&applied.has(x.gid);why=cured?'the gate change was applied and the item is no longer raised':(!applied.has(x.gid)?'the gate change was not applied':'the corrected text still raises it');}";
const B1="  else{const st=!applied.has(x.gid)&&a.ans==='CHANGE'&&gateStands2024(a.to,R2.T1); /* pkgGDUP (W3 2319): the same line written by another change */\n"
 +"   cured=!now.has(x.key)&&(applied.has(x.gid)||st);why=cured?(applied.has(x.gid)?'the gate change was applied and the item is no longer raised':'the gate change is already in the corrected text (another change wrote the same line), and the item is no longer raised (W3 2319)'):(!applied.has(x.gid)?(st?'the gate change is already in the corrected text, but the item is still raised':'the gate change was not applied'):'the corrected text still raises it');}";
const HELP="// pkgGDUP (W3 2319): a CHANGE TO line stands in the corrected text when a line of that text reads the same, compared as E-APPLY writes it\n"
 +"function gateStands2024(to,T){if(!to||!T)return false;const f=s=>String(s==null?'':s).replace(/\\\\+\"/g,'\"').replace(/[*_`]+/g,'').replace(/\\s+/g,' ').trim().replace(/^(?:[-\\u2022]|\\d+[.)])\\s*/,'').replace(/^[\"\\u201c]+|[\"\\u201d]+$/g,'').trim();\n"
 +" const t=f(to);if(!t)return false;return String(T).split('\\n').some(l=>f(l)===t);}\n";
const NODES=['Gate_Build','Alt_Gate_Build','Gate_Record','Alt_Gate_Record','Alternate_Merge','Alternate_Merge_Seat'];
const plan={base:'pkgGD/patched (8c8da96)',nodes:[]};
for(const n of NODES){const b=rd('pkgGD/patched/'+n+'.js');let s=rep(b,A1,B1,n);s=rep(s,'function gateCure2024(',HELP+'function gateCure2024(',n+' help');
 fs.writeFileSync('pkgGDUP/patched/'+n+'.js',s);plan.nodes.push({file:n+'.js',name:n.replace(/_/g,' '),base_sha:sha(b),final_sha:sha(s)});}
fs.writeFileSync('pkgGDUP/plan_GDUP.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes');plan.nodes.forEach(x=>console.log('  '+x.name+' '+x.base_sha+' -> '+x.final_sha));
