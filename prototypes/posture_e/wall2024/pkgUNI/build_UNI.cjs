// pkgUNI (W3 33160 grade, build 1; Wall). Base: pkgKGW/patched 926914f = live ff8967bb, the 6 nodes that hold sbApply2024.
// Run from wall2024/: node pkgUNI/build_UNI.cjs
// 33160 gemini: E-UNG items S9, S11, S12, S13 flag "(no COLLISION POINTS line for D<n>)", a placeholder the judge text never holds, so the
// judge's graded CHANGE TO line was refused ("the flagged line is not in the judge text"); the gate sent the same lines back (G2 to G5), they
// were refused again, and the 4 LIVE NOT APPLIED gate items gave drv_uncured 4 and removed the seat.
// Cause: E-UNG (pkgUND) counts only a BROKEN, UNDERDETERMINED or WITHDRAWN grade as grading a pressed link, and its flagged line is the
// judge's "D<n>:" line or else the placeholder. gemini held "D1 vs C6 (Matthew 1:20): STANDS" (also D3 vs C4, D5 vs C3, D6 vs C1), so the
// item carried the placeholder, and apply looked for the placeholder in the text.
// Fix: a change on that placeholder, or on a collision line for D<n> that the text does not hold (the gate copy of such a change), whose
// CHANGE TO is a graded collision line for the same D<n>, replaces the judge's own collision line for the same pair (all the usual apply
// checks then run on it). When the text has no line for that pair, the line is INSERTED into COLLISION POINTS (after the last collision
// line, else after the COLLISION POINTS heading). A later change naming an inserted line replaces it (same D<n>, graded form); a FORCED
// line for an inserted pair goes after it. Nothing else changes.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const BASE='pkgKGW/patched',OUT='pkgUNI/patched';fs.mkdirSync(OUT,{recursive:true});const plan={base:'live ff8967bb ('+BASE+' 926914f)',nodes:[]};
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor found '+n+' times: '+a.slice(0,80));return s.replace(a,()=>b);};
const NODES=['Gate_Build','Gate_Record','Alt_Gate_Build','Alt_Gate_Record','Alternate_Merge','Alternate_Merge_Seat'];
const E=[];
// (0) the insertion list
E.push(["const map=new Map();let resTo=null;","const map=new Map();let resTo=null;const INS=new Map(); /* pkgUNI: anchor line -> lines inserted after it */\n"
 +" const __UGR=/^\\s*(?:[-\\u2022*]\\s*|\\d+[.)]\\s*)?\\**(D\\d+)\\s+vs\\.?\\s+C\\d+\\b(?:\\s*\\([^)\\n]*\\))?[^:\\n(]*:\\s*\\**(?:DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS|WITHDRAWN)\\b/i;\n"
 +" const __uIns=()=>[...INS.values()].flat();const __uFind=n=>__uIns().find(i=>nrm(i.line)===n)||null;"]);
// (1) a FORCED line for an inserted pair goes after the inserted line
E.push(["if(!o&&lk)o=lines.find(l=>sbLabel(top(l))===lk)||null;",
 "if(!o&&lk)o=lines.find(l=>sbLabel(top(l))===lk)||null;\n"
 +"  if(!o&&kf){const __i=__uIns().find(i=>sbLabel(String(i.line).split('\\n')[0])===lk);if(__i){if(!nrm(__i.line).includes(nrm(toF)))__i.line=__i.line+'\\n'+toF;__i.forced=(__i.forced||[]).concat(x.sid);continue;}} /* pkgUNI */"]);
// (2) a change on an inserted line replaces it
E.push(["let o=find(x.line);if(!o){const n=nrm(x.line);for(const [o2,c2] of map){if(n&&nrm(c2.to)===n){o=o2;break;}}} /* E-GATE",
 "let o=find(x.line);if(!o){const n=nrm(x.line);for(const [o2,c2] of map){if(n&&nrm(c2.to)===n){o=o2;break;}}}\n"
 +"  if(!o){const __i=__uFind(nrm(x.line));const __t=to.match(__UGR);if(__i&&__t&&__t[1].toUpperCase()===__i.d){__i.over=(__i.over||[]).concat(__i.sid);__i.sid=x.sid;__i.line=__i.pre+to;continue;}} /* pkgUNI: a change on an inserted line */ /* E-GATE"]);
// (3) a change on the placeholder (or on a collision line for D<n> the text does not hold) replaces the judge's own line for the same pair,
//     or, when the text has none, is inserted
E.push(["if(!o){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the flagged line is not in the judge text',to});continue;}",
 "if(!o){const __ph=nrm(x.line).match(/^\\(no COLLISION POINTS line for (D\\d+)\\)$/i);const __lg=nrm(x.line).match(__UGR);const __t=to.match(__UGR); /* pkgUNI (W3 33160 grade 1): an E-UNG change on the placeholder line */\n"
 +"   const __gc=__lg&&x.rule==='E-GATE'&&(its||[]).some(y=>y&&y.rule==='E-UNG'&&nrm(y.to)===nrm(x.line));const __d=__ph?__ph[1].toUpperCase():(__gc?__lg[1].toUpperCase():null); /* the gate copy: its flagged line is an E-UNG change of this seat */const __pk=__t?sbLabel(to):null;\n"
 +"   if(__d&&__t&&__t[1].toUpperCase()===__d&&__pk){const __own=lines.find(l=>sbLabel(l)===__pk)||null;\n"
 +"    if(__own)o=__own; /* the judge's own line for the same pair (33160 gemini: D1 vs C6 STANDS) takes the change */\n"
 +"    else if(!__uIns().some(i=>sbLabel(String(i.line).split('\\n')[0])===__pk)){const __col=lines.filter(l=>/^D\\d+ VS C\\d+$/.test(sbLabel(l)||''));const __a=__col.length?__col[__col.length-1]:(lines.find(l=>/^[\\s>#*_-]*COLLISION POINTS\\b/i.test(l))||null);\n"
 +"     if(__a!=null){const pre=__col.length?(String(__a).match(/^\\s*(?:[-\\u2022]\\s+|\\d+[.)]\\s+)?/)||[''])[0]:'';if(!INS.has(__a))INS.set(__a,[]);INS.get(__a).push({d:__d,sid:x.sid,pre,line:pre+to});continue;}}}}\n"
 +"  if(!o){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the flagged line is not in the judge text',to});continue;}"]);
// (4) merge the insertions into the map before any check reads the corrected text
E.push([" const build=M=>text.split('\\n')",
 " for(const [a,L] of INS){const p=map.get(a);map.set(a,{sid:p?p.sid:L[0].sid,to:(p?p.to:a)+'\\n'+L.map(i=>i.line).join('\\n'),over:p?p.over:[],forced:((p&&p.forced)||[]).concat(L.flatMap(i=>[i.sid].concat(i.forced||[]))),ins:L});} /* pkgUNI */\n"
 +" const build=M=>text.split('\\n')"]);
// (5) the derived reason names each inserted line
E.push(["for(const [o,z] of map){const g0=(rcLines(o).col[0]||{}).grade||null",
 "for(const L of INS.values())for(const i of L){const r=(rcLines(String(i.line).split('\\n')[0]).col[0]||{});trig.push('ADDED '+(r.link||i.d)+' ('+(r.grade||'no grade')+'; '+i.sid+', no line of the judge for '+i.d+' to replace)');} /* pkgUNI */\n"
 +" for(const [o,z] of map){const g0=(rcLines(o).col[0]||{}).grade||null"]);
for(const f of NODES){let s=fs.readFileSync(BASE+'/'+f+'.js','utf8');const b=sha(s);for(const [a,c] of E)s=rep(s,a,c,f);fs.writeFileSync(OUT+'/'+f+'.js',s);plan.nodes.push({node:f.replace(/_/g,' '),base_sha:b,new_sha:sha(s),edits:E.length});}
fs.writeFileSync('pkgUNI/plan_UNI.json',JSON.stringify(plan,null,1));console.log(JSON.stringify(plan.nodes));
