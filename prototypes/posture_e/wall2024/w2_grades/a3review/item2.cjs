// Wall 5200 item C4: run 35296 luna K-W "DEFENDER CR2 no link heading #4" (debate_enforcer_log row 30394) graded UNCURED.
// Recompute the K-W NOT HELD quote test (library line 1201 of s151) with and without the pkgKWP branch (parentheticals removed), which went live in s149; the run was on s146.
const line='[CR2] no link heading: "I grant that her ‘know’ is present (Luke 1:31, ‘thou shalt conceive’ is future)."';
const rp='NOT HELD: “I grant that her ‘know’ is present” grants a tense reading, not withdrawal of footing from a declared link.';
const KWR_REF=/\s*\((?:\s*(?:[1-3]\s*)?[A-Z][A-Za-z]*\.?(?:\s+of\s+[A-Z][a-z]+|\s+[A-Z][a-z]+)?\s+)?\d+:\d+(?:\s*[-–]\s*\d+)?(?:\s*[,;]\s*(?:(?:[1-3]\s*)?[A-Z][A-Za-z]*\.?(?:\s+[A-Z][a-z]+)?\s+)?\d+(?::\d+)?(?:\s*[-–]\s*\d+)?)*\s*\)/g;
const nw=s=>String(s||'').toLowerCase().replace(/[‘’“”"'`*_]/g,'').replace(/[^a-z0-9Ͱ-Ͽἀ-῿]+/g,' ').trim().split(' ').filter(Boolean);
const LEAD=/^\s*I\s+(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)\b/i;
const rn0=b0=>b0.length<=6?[b0.join(' ')]:b0.slice(0,b0.length-5).map((_,i)=>b0.slice(i,i+6).join(' '));
const rn=b0=>{const r=rn0(b0);if(b0.length>=4&&/^(?:that|how|whether)$/.test(b0[0]))r.push(...rn0(b0.slice(1)));return r;};
const q=line,a=q.indexOf('"'),b=q.lastIndexOf('"');const inner=a>=0&&b>a?q.slice(a+1,b):q;
const runsOld=rn(nw(inner.replace(KWR_REF,' ').replace(LEAD,''))).concat(rn(nw(inner.replace(LEAD,''))));
const w=nw(inner.replace(/\s*\([^()]*\)/g,' ').replace(LEAD,''));const runsKWP=w.length>=4?rn(w):[];
const T=' '+nw(rp).join(' ')+' ';const hit=rs=>rs.filter(r=>T.includes(' '+r+' '));
console.log('flagged sentence words (lead removed):',nw(inner.replace(LEAD,'')).join(' '));
console.log('response words:',T.trim());
console.log('runs before pkgKWP (s146):',runsOld.length,'matching:',hit(runsOld));
console.log('runs from pkgKWP (parenthetical removed):',runsKWP,'matching:',hit(runsKWP));
console.log('curly quotes are stripped by nw() on both sides:',nw('“I grant that her ‘know’ is present”').join(' '));
