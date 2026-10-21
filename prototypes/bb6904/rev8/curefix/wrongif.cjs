// Wrong-if for the cure-code fix (revision 9), run on a debate's Drive report (markdown) with the fixed Cure Check node.
// L1 fires: a violation row "Not cured: no quotation found in the named round" whose PRESSED quotation, with * _ ` removed,
//   is found by the fixed matcher in that round's text as the judge received it (Text sections of "What the judges were sent").
// L0 fires: the report has no "What the judges were sent" section or no Text in it (nothing to test against).
// L2 fires: any cure request in "What the judges were sent" lists a K-G4 item with a standing sentence instead of its own line.
const fs=require('fs');const [rep,node]=process.argv.slice(2);const md=fs.readFileSync(rep,'utf8');
const cut=(s,a,b)=>{const i=s.indexOf(a),j=s.indexOf(b,i);return s.slice(i,j);};const s=fs.readFileSync(node,'utf8');
const F=new Function(cut(s,'function cureRounds','// The rounds that press')+cut(s,'const cureQ=','const CURE_KEY=')+';return {cureRounds,cureFound};')();
const sent=md.slice(md.indexOf('## What the judges were sent'));
const texts=[...sent.matchAll(/### Text (\d+), md5 \w+\n\nSent to: ([^\n]*)[\s\S]*?\*\*user message\*\* \(\d+ characters\)\n\n```text\n([\s\S]*?)\n```/g)].map(m=>({n:m[1],to:m[2],R:F.cureRounds({messages:[{role:'user',content:m[3]}]})}));
const restore=t=>t.replace(/\((L[1-4]|[CD]R[1-3])\)/g,'[$1]').replace(/\\\|/g,'|');
let l1=[],l2=[];
if(md.indexOf('## What the judges were sent')<0||texts.length===0){console.log('L0 FIRED: no sent texts to read');process.exit(0);}
for(const row of md.split('\n').filter(l=>/^\| .*\| \*\*UNCURED\*\* \|/.test(l)&&l.includes('no quotation found in the named round'))){
 const judge=row.split(' | ')[0].replace(/^\| /,'');const item=row.split(' | ')[1];
 for(const m of restore(row).matchAll(/PRESSED: (D\d+ vs C\d+) \| \[([CD]R[1-3])\] \| "(.*?)"(?= \/ | Not cured| \|)/g)){
  const hit=texts.filter(t=>t.R[m[2]]&&F.cureFound(m[3],t.R[m[2]])).map(t=>'Text '+t.n);
  if(hit.length)l1.push(judge+' '+item+' quotation found in '+m[2]+' of '+hit.join(','));}}
for(const m of sent.matchAll(/^K-G4 (D\d+ vs C\d+): (DEFENDER|CHALLENGER) STANDING SELF-SUPPORTED/gm))l2.push(m[1]);
console.log('L1',l1.length?'FIRED: '+l1.join('; '):'silent');console.log('L2',l2.length?'FIRED: '+l2.length+' K-G4 items sent a standing sentence ('+[...new Set(l2)].join(', ')+')':'silent');
