// pkgR1B (W2, 11-08; reader phase 2 item 1b, W3 order /mnt/project-files/w3/reader_p2_order.md). The two gate readers that still parse ANSWER CHECK
// lines with their own regex read them through the shared reader (__acRead -> __RL.readLine) when the line names exactly one round:
//  - gateAnsGround2024: verse, round, grade and the MEANS NONE skip;
//  - dptCheck: verse, round and the MEANS text.
// A line the reader refuses, a restated line, or a line with more than one round keeps the old regex read, unchanged.
// Library layer on pkgLIB/strip_KCR2 (live s54 = LIB v14_KCR2). Run from wall2024/: node pkgR1B/build_R1B.cjs -> pkgLIB/strip_R1B/patched (22 files)
const fs=require('fs'),c=require('crypto');const sha=s=>c.createHash('sha256').update(s).digest('hex').slice(0,12);
const IN='pkgLIB/strip_KCR2/patched/',OUT='pkgLIB/strip_R1B/patched/';fs.mkdirSync(OUT,{recursive:true});
const once=(s,a,b,nm)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(nm+': anchor found '+k+' times: '+a.slice(0,60));return s.replace(a,()=>b);};
const E=[
 // gateAnsGround2024
 ["const l=raw.replace(/[*_`]+/g,'').trim();const m=l.match(/^(?:[-•]|\\d+[.)])?\\s*ANSWER CHECK\\s*:\\s*(.+?)\\s*(?:--|—)\\s*\\[\\s*([CD]R[1-4])\\s*\\]/i);if(!m)continue;\n  const gs=[...l.matchAll(/(?:--|—)\\s*(MEETS|MISSES)\\b/gi)];if(!gs.length||gs[gs.length-1][1].toUpperCase()!=='MISSES')continue;if(/(?:--|—)\\s*MEANS\\s*:\\s*NONE\\b/i.test(l))continue;",
  "const l=raw.replace(/[*_`]+/g,'').trim();const __a=__acRead(raw);const __one=!!(__a&&Array.isArray(__a.rounds)&&__a.rounds.length===1&&__a.verse); /* pkgR1B: shared reader when the line names one round */\n  const m=__one?[null,String(__a.verse),String(__a.rounds[0])]:l.match(/^(?:[-•]|\\d+[.)])?\\s*ANSWER CHECK\\s*:\\s*(.+?)\\s*(?:--|—)\\s*\\[\\s*([CD]R[1-4])\\s*\\]/i);if(!m)continue;\n  const gs=[...l.matchAll(/(?:--|—)\\s*(MEETS|MISSES)\\b/gi)];if(__one?String(__a.grade||'').toUpperCase()!=='MISSES':(!gs.length||gs[gs.length-1][1].toUpperCase()!=='MISSES'))continue;if(__one?/^NONE\\b/i.test(String(__a.means||'').trim()):/(?:--|—)\\s*MEANS\\s*:\\s*NONE\\b/i.test(l))continue;"],
 // dptCheck: verse and round
 ["const am=L0.match(/ANSWER CHECK\\s*:\\s*((?:[1-3]\\s)?[A-Za-z][A-Za-z ]*?)\\s+(\\d+):(\\d+)\\s*(?:--|\\u2014)\\s*\\[\\s*([CD]R[1-4])\\s*\\]/i);if(!am)return no('the ANSWER CHECK line was not read');",
  "const __a=__acRead((x.lines||[])[0]);const __v=(__a&&Array.isArray(__a.rounds)&&__a.rounds.length===1)?String(__a.verse||'').match(/^((?:[1-3]\\s)?[A-Za-z][A-Za-z ]*?)\\s+(\\d+):(\\d+)$/):null; /* pkgR1B: shared reader when the line names one round */\n const am=__v?[null,__v[1],__v[2],__v[3],String(__a.rounds[0])]:L0.match(/ANSWER CHECK\\s*:\\s*((?:[1-3]\\s)?[A-Za-z][A-Za-z ]*?)\\s+(\\d+):(\\d+)\\s*(?:--|\\u2014)\\s*\\[\\s*([CD]R[1-4])\\s*\\]/i);if(!am)return no('the ANSWER CHECK line was not read');"],
 // dptCheck: MEANS
 ["const MEANS=mm?mm[1]:'';","const MEANS=(__v&&typeof __a.means==='string')?__a.means:(mm?mm[1]:''); /* pkgR1B */"]];
const FILES=['Gate_Build','Gate_Record','Alt_Gate_Build','Alt_Gate_Record','Alternate_Merge','Alternate_Merge_Seat'];const plan={base:'pkgLIB/strip_KCR2',nodes:{}};
for(const f of fs.readdirSync(IN).filter(f=>f.endsWith('.js'))){let s=fs.readFileSync(IN+f,'utf8');const b=s;
 if(FILES.includes(f.replace(/\.js$/,'')))for(const [a,n] of E)s=once(s,a,n,f);fs.writeFileSync(OUT+f,s);if(s!==b)plan.nodes[f]={base:sha(b),patched:sha(s)};}
if(Object.keys(plan.nodes).length!==6)throw new Error('expected 6 changed files');
fs.writeFileSync('pkgR1B/plan_R1B.json',JSON.stringify(plan,null,1));console.log(JSON.stringify(plan.nodes));
