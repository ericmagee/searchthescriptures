// ASK 390 DoD 2 (W1 8104 3a): replay over every stored round; list every hit and every near-miss for the graders
const fs=require('fs');const wn390=new Function(fs.readFileSync(__dirname+'/wn390.js','utf8')+';return wn390;')();
const R=JSON.parse(fs.readFileSync(__dirname+'/rounds.json'));const C=['claude_r1','engine_r1','claude_r2','engine_r2','engine_r3','challenger_r3','defender_r4','challenger_r4'];
let n=0,hit=0;const near={};const NEAR=[['wait',/\bwait\b/i],['hmm/oops',/\b(?:hmm+|oops)\b/i],['sheet',/\bsheet\b/i],['flag',/\bflag(?:ged)?\b/i],['stay safe/safer',/\b(?:stay safe|safer?)\b/i],['correction',/\bcorrection\b|\bscratch that\b/i],['let me (rhetoric)',/(?:^|[.!?]\s+|\n)\s*\**let me\b/i],['I should have said',/\bI should have said\b/i]];
const out=[];
for(const r of R)for(const c of C){const t=r[c];if(!t)continue;n++;const w=wn390(t);const mask=String(t).replace(/"[^"\n]*"|“[^”\n]*”/g,m=>' '.repeat(m.length));
 if(w.notes.length){hit++;out.push('HIT '+r.run_token+' '+c+' | '+w.notes.map(x=>x.marker+' :: '+t.slice(x.span[0],x.span[1]).replace(/\s+/g,' ').slice(0,260)).join(' || '));
  let back='',o=0,q=0;for(const x of w.notes){const pre=x.span[0]-q;back+=w.text.slice(o,o+pre);o+=pre+'[working note: '.length;const len=x.span[1]-x.span[0];back+=w.text.slice(o,o+len);o+=len+1;q=x.span[1];}back+=w.text.slice(o);if(back!==t)out.push('   !! marked text is not byte-equal to the round once the marks are taken off');}
 else for(const [k,re] of NEAR){const m=mask.match(new RegExp('.{0,90}'+re.source+'.{0,90}',re.flags));if(m){(near[k]=near[k]||[]).push(r.run_token+' '+c+' | '+m[0].replace(/\s+/g,' '));}}}
console.log('rounds',n,'| marked',hit);out.forEach(x=>console.log(x));
for(const k of Object.keys(near)){console.log('NEAR-MISS',k,near[k].length);}
fs.writeFileSync(__dirname+'/nearmiss.txt',Object.entries(near).map(([k,v])=>'== '+k+' ('+v.length+')\n'+v.join('\n')).join('\n'));
