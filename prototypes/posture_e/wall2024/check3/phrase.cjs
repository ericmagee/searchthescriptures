// WALL-2024 check 3: phrase-run backstop (W2). Definition fixed on WALL-2024 post 2106 BEFORE this run.
// Mark-only. Stop rule: any X1..X5 fire, or any B1..B3 miss, drops it. No retuning of N or STOP after results.
const fs=require('fs'),path=require('path');
const N=5;
const STOP=new Set('a an the of to and or but that which who whom this these those his her him he she it its they them their be is was were been being by with for from in on at as so not no into unto upon than then there here what when where whose would should could shall will may might must have has had do does did own same one i me my we us our thou thee thy ye you your'.split(' '));
const WD=/\bI\s+(drop|withdraw|retract|concede|abandon)\b|\bwithdrawn\b|\bno longer rests? on\b/i;
const SIDES={D:['cr1','cr2','cr3','cr4'],C:['gr1','gr2','dr3','dr4']};
const BOOK='(?:[1-3]\\s)?[A-Z][a-z]+';
const REFTOK=new RegExp(`\\b${BOOK}\\s+\\d+:\\d+(?:[-–]\\d+)?(?:\\s*(?:,|and)\\s*\\d+(?::\\d+)?(?:[-–]\\d+)?)*`,'g');
const HASREF=new RegExp(`${BOOK}\\s+\\d+:\\d+|\\b\\d+:\\d+`);
// rule 3: drop quoted spans tied to a verse reference (ref within 4 chars after close, or within 80 chars before open)
function stripScripture(t){
 const re=/"[^"\n]*"|“[^”\n]*”/g;let out='',last=0,m;
 while((m=re.exec(t))){const after=t.slice(m.index+m[0].length,m.index+m[0].length+4+12);const before=t.slice(Math.max(0,m.index-80),m.index);
  const tied=/^.{0,4}?\(?\s*(?:[1-3]\s)?[A-Z][a-z]+\s+\d+:\d+|^.{0,4}?\(?\d+:\d+/.test(after)||HASREF.test(before);
  out+=t.slice(last,m.index)+(tied?' ':m[0]);last=m.index+m[0].length;}
 out+=t.slice(last);return out.replace(REFTOK,' ');}
const words=t=>t.toLowerCase().replace(/[^a-z\s']/g,' ').replace(/'/g,'').split(/\s+/).filter(Boolean);
function runs(ws){const out=[];for(let i=0;i+N<=ws.length;i++){const r=ws.slice(i,i+N);if(r.filter(w=>STOP.has(w)).length>=4)continue;out.push(r.join(' '));}return out;}
function sections(text){const lines=String(text||'').split('\n');const secs=[];let cur={head:'',lines:[]};
 for(const l of lines){if(/^## /.test(l)){secs.push(cur);cur={head:l,lines:[]};}cur.lines.push(l);}secs.push(cur);return secs;}
const sentences=line=>line.split(/(?<=[.!?])\s+/);
function withdrawals(round,text){const out=[];
 for(const sec of sections(text)){const prem=sec.lines.find(l=>/^\*Premise:/.test(l.trim()))||'';
  for(const line of sec.lines)for(const s of sentences(line)){if(!WD.test(s))continue;
   const src=stripScripture(s)+' \n '+stripScripture(prem);
   const rs=new Set([...runs(words(stripScripture(s))),...runs(words(stripScripture(prem)))]);
   out.push({round,head:sec.head,sentence:s.trim(),premise:prem.trim(),runs:rs});}}
 return out;}
function run(fx){const res={run:fx.run_token,withdrawals:[],marks:[]};
 for(const [side,rs] of Object.entries(SIDES))rs.forEach((r,i)=>{for(const w of withdrawals(r,fx[r])){res.withdrawals.push({side,...w,runs:w.runs.size});
  for(const r2 of rs.slice(i+1)){const later=String(fx[r2]||'').split('\n');
   later.forEach((line,ln)=>{const lw=words(stripScripture(line)).join(' ');const lr=new Set(runs(lw.split(' ')));
    const hit=[...w.runs].filter(x=>lr.has(x));if(hit.length)res.marks.push({side,from:r,to:r2,line:ln+1,withdrawn:w.sentence,premise:w.premise,hit,text:line.trim()});});}}});
 return res;}
module.exports={run,withdrawals,stripScripture,runs,words};
if(require.main===module){for(const id of process.argv.slice(2)){const fx=JSON.parse(fs.readFileSync(path.join(__dirname,'..','fixtures',id+'.json'),'utf8'));const r=run(fx);
 console.log(`\n== ${id}: withdrawals ${r.withdrawals.length}, marks ${r.marks.length}`);
 r.withdrawals.forEach(w=>console.log(`  W ${w.side} ${w.round} runs=${w.runs} :: ${w.sentence.slice(0,170)}${w.premise?'  || '+w.premise.slice(0,120):''}`));
 r.marks.forEach(m=>console.log(`  MARK ${m.side} ${m.from}->${m.to} L${m.line} hit=${JSON.stringify(m.hit)}\n     withdrawn: ${m.withdrawn.slice(0,150)}\n     later: ${m.text.slice(0,220)}`));}}
