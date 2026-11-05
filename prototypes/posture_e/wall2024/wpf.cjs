// WALL-2024 check 2: the withdrawn-premise flag, narrow form (W2's form, W3's expectations at
// /mnt/project-files/w3/wall2024_withdrawn_flag_expectations.md). Written and committed BEFORE the run.
// Definition, line by line:
//  1. Sides: defender rounds cr1, cr2, cr3, cr4; challenger rounds gr1, gr2, dr3, dr4 (Build Save Body mapping).
//  2. A WITHDRAWAL is a sentence in a round that holds "I drop|withdraw|retract|concede|abandon", outside quotation
//     marks, whose clause after that verb holds a positive mind-verb claim about a named person (floor.cjs MIND verbs,
//     same "took ... to be" and 3-word negation rules). Its verses are the scripture references on the same line.
//  3. A LATER CLAIM is a sentence in a later round of the SAME side that holds a mind-verb outside quotation marks,
//     not negated within the 3 preceding words, and the line names the withdrawn actor.
//  4. It FLAGS when the later claim's line cites a verse the withdrawal's line cites (same verse), AND its object
//     (the words after the verb up to , ; . or "and") shares at least one content stem (5 letters) with the
//     withdrawn object (same object). Pronouns and stop words never count as object words.
//  5. The flag is a record fact for the judges ("withdrawn in R, reasserted in R'"); it does not change PROVEN.
// Stop rule: if it fires on a MUST-NOT case or misses a MUST case, it is dropped, not tuned.
const MIND=/\b(thought|think|thinks|thinking|believed|believe|believes|supposed|suppose|supposes|knew|know|knows|knowing|known|accounted|account|counted|esteemed|reckoned|considered|took|take|takes|taken)\b/gi;
const TOOK_TO_BE=/^(took|take|takes|taken)$/i;
const NEG=/\b(not|no|never|nor|none|without|neither)\b/i;
const NAMES=/\b(Joseph|Mary|Elisabeth|Zacharias|Adam|Eve|Jacob|Abraham|David|Herod|Jesus|Heli|Cain|Abel|Seth|Noah)\b/g;
const WD=/\bI\s+(drop|withdraw|retract|concede|abandon)\b/i;
const REF=/\b((?:[1-3]\s)?[A-Z][a-z]+)\s+(\d+):(\d+)/g;
const STOP=new Set('a an the of to and or but that which who whom this these those his her him he she it its they them their be is was were been being by with for from in on at as so not no into unto upon than then there here what when where whose would should could shall will may might must have has had do does did own same one i me my we us our thou thee thy ye you your'.split(' '));
const SIDES={D:['cr1','cr2','cr3','cr4'],C:['gr1','gr2','dr3','dr4']};
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z\s']/g,' ');
const stem=w=>w.replace(/'s$/,'').slice(0,5);
const inQuote=(line,idx)=>{const pre=line.slice(0,idx);return ((pre.match(/["“”]/g)||[]).length%2)===1;};
const refs=line=>{const s=new Set();let m;REF.lastIndex=0;while((m=REF.exec(line)))s.add(`${m[1]} ${m[2]}:${m[3]}`);return s;};
const objWords=after=>norm(after.split(/[,;.]|\band\b/i)[0]).split(/\s+/).filter(w=>w&&!STOP.has(w)&&w.length>=3).map(stem);
const sentences=line=>line.split(/(?<=[.!?])\s+/);
function mindClaims(text){ // positive mind-verb claims in a text: [{verb, idx, object}]
 const out=[];let x;MIND.lastIndex=0;
 while((x=MIND.exec(text))){const verb=x[1];const before=text.slice(0,x.index);const after=text.slice(x.index+verb.length);
  if(TOOK_TO_BE.test(verb)&&!/^\s+.{0,40}?\bto be\b/i.test(after))continue;
  if(NEG.test(before.trim().split(/\s+/).slice(-3).join(' ')))continue;
  if(/\bof\s*$/i.test(before))continue;
  if(inQuote(text,x.index))continue;
  out.push({verb,idx:x.index,object:objWords(after)});}
 return out;}
function withdrawals(round,text){const out=[];
 for(const line of String(text||'').split('\n'))for(const s of sentences(line)){const m=s.match(WD);if(!m||inQuote(s,m.index))continue;
  const clause=s.slice(m.index+m[0].length);
  for(const c of mindClaims(clause)){const names=(clause.slice(0,c.idx).match(NAMES)||[]);if(!names.length)continue;
   out.push({round,sentence:s.trim(),actor:names[names.length-1],verb:c.verb,object:c.object,verses:refs(line)});}}
 return out;}
function laterClaims(round,text,w){const out=[];
 for(const line of String(text||'').split('\n')){if(!new RegExp('\\b'+w.actor+'\\b').test(line))continue;
  const lv=refs(line);const sameVerse=[...w.verses].filter(v=>lv.has(v));
  for(const s of sentences(line))for(const c of mindClaims(s)){
   const shared=c.object.filter(o=>w.object.includes(o));
   out.push({round,sentence:s.trim(),verb:c.verb,object:c.object,sameVerse,shared,flag:sameVerse.length>0&&shared.length>0});}}
 return out;}
function run(fx){const res={run:fx.run_token,withdrawals:[],flags:[],near:[]};
 for(const [side,rs] of Object.entries(SIDES))rs.forEach((r,i)=>{for(const w of withdrawals(r,fx[r])){
  res.withdrawals.push({side,...w,verses:[...w.verses]});
  for(const r2 of rs.slice(i+1))for(const c of laterClaims(r2,fx[r2],w))(c.flag?res.flags:res.near).push({side,from:w.round,withdrawn:w.sentence,actor:w.actor,...c});}});
 return res;}
module.exports={run,withdrawals,mindClaims};
if(require.main===module){const fs=require('fs');const all=[];
 for(const id of ['32643','32677','32717','32791','32905']){const r=run(JSON.parse(fs.readFileSync(`fixtures/${id}.json`,'utf8')));all.push(r);
  console.log(`\n== ${id} withdrawals with a mind-verb claim: ${r.withdrawals.length}, flags: ${r.flags.length}, same-actor later lines not flagged: ${r.near.length}`);
  r.withdrawals.forEach(w=>console.log(`  W ${w.side} ${w.round} actor=${w.actor} verb=${w.verb} obj=[${w.object}] verses=[${w.verses}] :: ${w.sentence.slice(0,160)}`));
  r.flags.forEach(f=>console.log(`  FLAG ${f.from}->${f.round} verse=[${f.sameVerse}] shared=[${f.shared}] :: ${f.sentence.slice(0,200)}`));
  r.near.forEach(f=>console.log(`  near ${f.from}->${f.round} verse=[${f.sameVerse}] shared=[${f.shared}] :: ${f.sentence.slice(0,160)}`));}
 fs.writeFileSync('out/wpf.json',JSON.stringify(all,null,1));}
