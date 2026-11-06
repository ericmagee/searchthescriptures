// WALL-2024 check 3, W2's phrase-run definition (wall reply 2106), implemented INDEPENDENTLY by W1 as the cross-check,
// written and committed before any run and before reading W2's code or results. Where 2106 leaves a choice, W1's choice is noted [W1].
// 1 trigger: K-W's pattern (I do not claim|no longer claim|withdraw|grant|concede|drop) + "withdrawn" + "no longer rest(s) on".
// 2 word source: the withdrawal sentence + the section's "*Premise: ...*" line; section = last "## " heading before .. next "## ".
// 3 scripture exclusion: drop quoted spans with a verse reference within 4 chars after the close or 80 chars before the open;
//   drop every verse-reference token. Quotes with no reference nearby are kept.
// 4 normalize: lowercase, strip punctuation, split on whitespace.  5 runs of N=5; skip a run with >=4 stop words.
// 6 search: later rounds of the same side only, same exclusion and normalization.  7 output: a mark only.
// [W1] stop list: the ~60 function words below (W2 commits its own; a difference is reported, not tuned).
// [W1] markdown * _ ` are stripped before step 3, as kwLines421 does.
const N=5;
const STOP=new Set('a an the of to and or but that which who whom this these those his her him he she it its they them their be is was were been being by with for from in on at as so not no into unto upon than then there here what when where whose would should could shall will may might must have has had do does did i me my we our you your'.split(' '));
const TRIG=/\bI\s+(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)\b|\bwithdrawn\b|\bno\s+longer\s+rests?\s+on\b/i;
const BOOK='(?:[1-3]\\s?)?[A-Z][a-z]+';
const REF=new RegExp('\\b'+BOOK+'\\.?\\s+\\d+:\\d+(?:[-–]\\d+)?(?:\\s*,\\s*\\d+(?::\\d+)?(?:[-–]\\d+)?)*','g');
const REFTEST=new RegExp('\\b'+BOOK+'\\.?\\s+\\d+:\\d+|\\b\\d+:\\d+');
const SIDES={D:['cr1','cr2','cr3','cr4'],C:['gr1','gr2','dr3','dr4']};
function clean(t){t=String(t||'').replace(/[*_`]+/g,'');
 // quoted spans tied to a reference
 t=t.replace(/["“]([^"”\n]*)["”]/g,(m,inner,off,all)=>{const before=all.slice(Math.max(0,off-80),off);const after=all.slice(off+m.length,off+m.length+4+12);
   const afterNear=all.slice(off+m.length,off+m.length+4);
   const refAfter=REFTEST.test(afterNear)||new RegExp('^.{0,4}'+BOOK+'\\.?\\s+\\d+:\\d+').test(after)||/^.{0,4}\d+:\d+/.test(after);
   return (REFTEST.test(before)||refAfter)?' ':m;});
 return t.replace(REF,' ');}
const norm=t=>clean(t).toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(Boolean);
function runs(words){const out=[];for(let i=0;i+N<=words.length;i++){const r=words.slice(i,i+N);if(r.filter(w=>STOP.has(w)).length>=4)continue;out.push(r.join(' '));}return out;}
function sections(text){const lines=String(text||'').split('\n');const secs=[];let cur={head:'',lines:[]};
 for(const l of lines){if(/^##\s/.test(l)){secs.push(cur);cur={head:l,lines:[l]};}else cur.lines.push(l);}secs.push(cur);return secs;}
function withdrawals(text){const out=[];
 for(const s of sections(text)){const body=s.lines.join('\n');const prem=(body.match(/^\s*\*?\s*\*?Premise:[^\n]*/m)||[''])[0];
  for(const line of s.lines)for(const sent of line.split(/(?<=[.!?])\s+/)){const t=sent.replace(/[*_`]+/g,'');if(!TRIG.test(t))continue;
   out.push({sentence:sent.trim(),premise:prem.trim(),runs:[...new Set(runs(norm(sent)).concat(prem?runs(norm(prem)):[]))]});}}
 return out;}
function run(fx){const res=[];
 for(const [side,rs] of Object.entries(SIDES))rs.forEach((r,i)=>{for(const w of withdrawals(fx[r])){
  for(const r2 of rs.slice(i+1)){for(const line of String(fx[r2]||'').split('\n')){const lw=norm(line).join(' ');
    const hit=w.runs.filter(x=>(' '+lw+' ').includes(' '+x+' '));if(hit.length)res.push({side,from:r,to:r2,withdrawal:w.sentence.slice(0,200),runs:hit,line:line.trim().slice(0,240)});}}}});
 return res;}
module.exports={run,withdrawals,norm,runs};
if(require.main===module){const fs=require('fs');
 for(const id of ['32643','32677','32717','32791','32905','32924']){const f=JSON.parse(fs.readFileSync(`../fixtures/${id}.json`,'utf8'));const r=run(f);
  console.log(`\n== ${id}: marks ${r.length}`);r.forEach(m=>console.log(`  ${m.side} ${m.from}->${m.to} runs=[${m.runs.join(' | ')}]\n     W: ${m.withdrawal}\n     L: ${m.line}`));}}
