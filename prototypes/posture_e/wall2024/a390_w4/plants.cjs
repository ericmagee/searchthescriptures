// ASK 390 DoD 1: plants (real rounds and made-up lines) through wn390
const fs=require('fs');const wn390=new Function(fs.readFileSync(__dirname+'/wn390.js','utf8')+';return wn390;')();
const R=JSON.parse(fs.readFileSync(__dirname+'/rounds.json'));const g=(tok,c)=>R.find(r=>r.run_token.startsWith(tok))[c];
const P=[['REAL 38593 spark challenger R2',g('ODV1-38593','engine_r2')],['REAL 37812 glm defender R4',g('ODV1-37812','defender_r4')],
['REAL-SHAPE 1b claude "**Wait.**" sentence','**Wait.** Let me parse what the defender just said:'],['REAL-SHAPE 1b "Let me establish"','The chain holds. Let me establish the ground layer by layer.'],
['REAL-SHAPE 1b "I should have said"',"I should have said: John 10:16's sheep are functionally fold-members."],
['PLANT KJV quote holding wait','[L1] Psalm 27:14: "Wait on the LORD: be of good courage, and he shall strengthen thine heart: wait, I say, on the LORD."'],
['REAL-SHAPE list item "- Correction:"','- Correction: Paul does issue a status in his own voice.'],
['REAL-SHAPE reader-facing sheet','Genesis 16:15 and 24:67 are off the sheet, so I do not lean on them.'],
['PLANT mid-sentence hmm','The verse names Joseph, hmm, no: it names Mary first.'],
['PLANT flagged talk','I quote it again so it will not be flagged by the checker.']];
for(const [nm,t] of P){const w=wn390(t);if(!w.notes.length){console.log('UNCHANGED '+nm+(w.text===t?' (byte-equal)':' !! CHANGED'));continue;}
 let back='',o=0,q=0;for(const x of w.notes){const pre=x.span[0]-q;back+=w.text.slice(o,o+pre);o+=pre+'[working note: '.length;const len=x.span[1]-x.span[0];back+=w.text.slice(o,o+len);o+=len+1;q=x.span[1];}back+=w.text.slice(o);
 console.log('MARKED    '+nm+' | markers: '+w.notes.map(x=>x.marker).join('; ')+' | marks off = original: '+(back===t));
 for(const x of w.notes){const s=w.text.indexOf('[working note: ');console.log('   '+w.text.slice(s,s+'[working note: '.length+(x.span[1]-x.span[0])+1).replace(/\s+/g,' '));}}
