// pkgWLA2 (D57 follow-up; W2, 11-08; coordinator assigned after W1 3252): the ledger's by-id reader (pkgWLA) also reads a JOINT header that
// names several presses of one premise: `MEANS [CR3] P3.1, P3.2 and P3.3: "<MEANS>"`. Each listed id counts as answered when the quoted MEANS
// equals that press's MEANS and the block below carries an [L1]-[L3] tag (same bars as pkgWLA). Stacked on pkgWLA/out (not yet live).
// Saved runs: 0 joint headers in the challenger [DR3] of 28 readable runs (33218..33731), so the expected replay is byte-equal everywhere.
// Usage (from wall2024/): node pkgWLA2/build_WLA2.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const IN='pkgWLA/out/',OUT='pkgWLA2/out/';fs.mkdirSync(OUT,{recursive:true});
const OLDM="const m=L[i].match(/^\\s*[*_-]*\\s*MEANS\\s*\\[CR3\\]\\s*P(\\d+)\\.(\\d+)\\s*[*_]*\\s*:\\s*(.+)$/i);if(!m)continue;";
const NEWM="const m=L[i].match(/^\\s*[*_-]*\\s*MEANS\\s*\\[CR3\\]\\s*(P\\d+\\.\\d+(?:\\s*(?:,|and|&)\\s*(?:and\\s+)?P\\d+\\.\\d+)*)\\s*[*_]*\\s*:\\s*(.+)$/i);if(!m)continue; /* pkgWLA2: joint header */\n"
+"   const ids=[...m[1].matchAll(/P(\\d+)\\.(\\d+)/gi)].map(x=>[+x[1],+x[2]]);if(new Set(ids.map(x=>x[0])).size!==1)continue;";
const OLDP="H.push({n:+m[1],k:+m[2],means:wlaNorm2024(m[3]),lay});";
const NEWP="for(const [n,k] of ids)H.push({n,k,means:wlaNorm2024(m[2]),lay});";
const plan={base:IN,nodes:{}};
for(const nm of ['Panel Build','Build Independent Verdict']){const f=nm.replace(/ /g,'_')+'.js';let s=fs.readFileSync(IN+f,'utf8');const s0=s;
 for(const [a,b] of [[OLDM,NEWM],[OLDP,NEWP]]){if(s.split(a).length!==2)throw new Error(nm+': anchor not once: '+a.slice(0,60));s=s.replace(a,()=>b);}
 fs.writeFileSync(OUT+f,s);plan.nodes[nm]={from:sha(s0),to:sha(s)};}
fs.writeFileSync(OUT+'plan_WLA2.json',JSON.stringify(plan,null,1));console.log(JSON.stringify(plan.nodes));
