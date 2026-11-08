// pkgRI4 (reader phase 2 item 4, FORCED; W3 order; W1, 11-08): the FORCED form reads in the library ask the shared reader first; where it
// reads no FORCED line (or a RESTATED one), the old regex decides as before (pkgSBR/pkgSBX rule). The field parse (KF_LINE) is already on
// the reader (pkgKFN); this moves the remaining label and field reads:
//  - kfLines, kffLines, kfcLines (all library nodes): the "is this a FORCED line" test.
//  - cureVerdicts (K-F, K-FF, K-FC cures): the FORCED-line filter on the cure reply.
//  - gateForced2024: the FORCED-line filter on the gate reply, id (the pair) and sideOf (the MEANS round).
// Run from wall2024/: node pkgRI4/build_RI4.cjs [base strip, default pkgLIB/strip_A2R_RI3B_G33731] [dest strip, default pkgLIB/strip_RI4]
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const SRC=(process.argv[2]||'pkgLIB/strip_A2R_RI3B_G33731')+'/patched/',DST=(process.argv[3]||'pkgLIB/strip_RI4')+'/patched/';
const PLAN='pkgRI4/plan_'+(process.argv[3]||'pkgLIB/strip_RI4').replace(/\/$/,'').split('/').pop()+'.json';fs.rmSync(DST,{recursive:true,force:true});fs.mkdirSync(DST,{recursive:true});
const A0='function __kfM(';
const FN=String.raw`/* pkgRI4 (reader item 4): the reader's FORCED fields for a line (null: no FORCED form, or RESTATED); a FORCED label test, reader first, else the old regex */
function ri4F2024(l){try{const r=__RL.readLine(String(l==null?'':l).trim());if(r&&r.form==='FORCED'&&r.f&&r.f.pair&&!r.f.restated)return r.f;}catch(e){}return null;}
function ri4IsF2024(l,re){return !!ri4F2024(l)||re.test(l);}
`;
const R=[
 ['label test (kf/kff/kfc)',String.raw`const l=raw.trim();if(!/^(?:[-•]|\d+[.)])?\s*FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:/i.test(l))continue;`,
  String.raw`const l=raw.trim();if(!ri4IsF2024(l,/^(?:[-•]|\d+[.)])?\s*FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:/i))continue;`,3],
 ['cureVerdicts filter',String.raw`/^(?:[-•]\s*)?FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:/i.test(l)`,String.raw`ri4IsF2024(l,/^(?:[-•]\s*)?FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:/i)`,3],
 ['gateForced2024 segs',String.raw`.filter(s=>/^FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:/i.test(s));`,String.raw`.filter(s=>ri4IsF2024(s,/^FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:/i));`,1],
 ['gateForced2024 id',String.raw`const id=s=>{const m=s.match(/^FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:\s*(D\d+)\s+vs\.?\s+(C\d+)/i);return m?(m[1]+' VS '+m[2]).toUpperCase():null;};`,
  String.raw`const id=s=>{const __f=ri4F2024(s);if(__f&&/^D\d+\s+vs\.?\s+C\d+$/i.test(__f.pair))return __f.pair.replace(/\s+vs\.?\s+/i,' VS ').toUpperCase();const m=s.match(/^FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:\s*(D\d+)\s+vs\.?\s+(C\d+)/i);return m?(m[1]+' VS '+m[2]).toUpperCase():null;};`,1],
 ['gateForced2024 sideOf',String.raw`const sideOf=s=>{const m=s.match(/MEANS\s*\[{0,2}\s*((?:CR|DR)[1-4])/i);return m?(/^CR/i.test(m[1])?'CHALLENGER':'DEFENDER'):null;};`,
  String.raw`const sideOf=s=>{const __f=ri4F2024(s);if(__f&&/^(?:CR|DR)[1-4]$/i.test(String(__f.meansRound||'')))return /^CR/i.test(__f.meansRound)?'CHALLENGER':'DEFENDER';const m=s.match(/MEANS\s*\[{0,2}\s*((?:CR|DR)[1-4])/i);return m?(/^CR/i.test(m[1])?'CHALLENGER':'DEFENDER'):null;};`,1]];
const plan={base:SRC,nodes:{}};
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');let s=s0;const hits=[];
 for(const [k,a,b,want] of R){const n=s.split(a).length-1;if(!n)continue;if(n!==want)throw new Error(f+' '+k+' anchor x'+n+', want '+want);s=s.split(a).join(b);hits.push(k+' x'+n);}
 if(hits.length){if(s0.split(A0).length!==2)throw new Error(f+' A0');s=s.replace(A0,()=>FN+A0);new Function('$','$input','return (async()=>{\n'+s+'\n})();');plan.nodes[f]={base:h(s0),patched:h(s),anchors:hits};}
 fs.writeFileSync(DST+f,s);}
const tally={};for(const v of Object.values(plan.nodes))for(const k of v.anchors)tally[k]=(tally[k]||0)+1;plan.tally=tally;
fs.writeFileSync(PLAN,JSON.stringify(plan,null,1));console.log(Object.keys(plan.nodes).length+' nodes patched;',JSON.stringify(tally));
