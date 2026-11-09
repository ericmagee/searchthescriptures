// pkgWLG (Eric approved option 1, 22:09Z 11-08): the gate treats a judge's "unanswered" claim as false only for a witness NAMED IN AN ANSWER.
// kg4Split counts a later own-round hit on a pressed witness only where that hit is in an answer, by pkgWLD's rule (kgaInAns2024 = wldInAns2024).
// Run from wall2024/: node pkgWLG/build_WLG.cjs [base strip dir, default pkgLIB/strip_JGR_KWI] [out strip dir, default pkgLIB/strip_WLG]
const fs=require('fs');
const BASE=(process.argv[2]||'pkgLIB/strip_JGR_KWI')+'/patched/',OUT=(process.argv[3]||'pkgLIB/strip_WLG');
fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(OUT+'/patched',{recursive:true});
const FN=String.raw`const kgaInAns2024=(t,pos)=>{t=String(t||'');const ls=t.lastIndexOf('\n',pos-1)+1;const le=t.indexOf('\n',pos);const line=t.slice(ls,le<0?t.length:le);const before=t.slice(ls,pos); /* pkgWLG: a hit is in an answer by pkgWLD's rule (rev 2: a list item may name several verses, each with its quoted words, before the hit; a heading may read "Presses answered", "Pressed witnesses, answered" and the like): a MEANS [<round>] header line; a bold label that opens with the verse; or a list item that opens with the verse under an "Answer ... press/witness" heading. Never a line that restates a press. */
 if(/press(?:ed)?\s+with\s*:|The press means|^\s*\*?Premise:/i.test(before)||/^\s*[*_-]*\s*PRESSED WITH/i.test(line))return false;
 if(/^\s*[*_-]*\s*MEANS\s*\[/i.test(line))return true;
 if(/^\s*(?:[-*]\s*)?\*\*\s*(?:\([a-z0-9]\)\s*)?(?:Press\s+)?$/i.test(before))return true;
 if(!/^\s*(?:[-*]|\d+[.)])\s+[*_]*\s*(?:[*_]*(?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?\.?\s+\d+:\d+(?:\s?[-–—]\s?\d+)?[*_]*\s*(?:"[^"\n]{0,200}"|“[^”\n]{0,200}”)?\s*(?:,|;|and|&)?\s*)*[*_]*$/.test(before))return false;
 const U=t.slice(0,Math.max(0,ls-1)).split('\n');for(let j=U.length-1;j>=0;j--){const x=U[j];
  if(/^\s*[*_#]*\s*(?:[A-Z]\.\s+)?(?:Answers?\s+(?:to|for)\s+(?:the\s+)?(?:presses|witnesses(?:\s+pressed)?|pressed\s+witnesses)\b(?:\s+on\s+LINK\s+\d+)?[\s*_:.]*$|(?:the\s+)?(?:presses|pressed\s+witnesses|witnesses\s+pressed)\s*,?\s*(?:each\s+)?answered[\s*_:.]*$)/i.test(x))return true;
  if(/^\s*-{3,}\s*$/.test(x)||/^\s*[*#]*\s*LINK\s+(?:\d+|none)\b/i.test(x)||/^\s*#{1,6}\s/.test(x)||/^\s*\*[^*\n]+\*\s*$/.test(x)||/^\s*[*_-]*\s*MEANS\s*\[/i.test(x)||/UNSUPPORTED-L4 PREMISES/i.test(x))return false;}
 return false;};`;
const E=[
 ['const h=cureRefs(R[k],true).find(r=>r.key===w);if(h)hs.push({ref:w,round:k,pos:h.pos});','const h=cureRefs(R[k],true).find(r=>r.key===w&&kgaInAns2024(R[k],r.pos));if(h)hs.push({ref:w,round:k,pos:h.pos});',1],
 ["' named in no later '+side.toLowerCase()+' round, so the grade stands'","' named in no answer in a later '+side.toLowerCase()+' round, so the grade stands'",1],
 ["round names every pressed witness the line rests on: '","round names every pressed witness the line rests on in an answer: '",null],
];
const rep={};let n=0;
for(const f of fs.readdirSync(BASE).filter(f=>f.endsWith('.js'))){let s=fs.readFileSync(BASE+f,'utf8');const r={};
 if(s.includes('function kg4Split(')){
  if(s.includes('kgaInAns2024'))throw new Error(f+': already has kgaInAns2024');
  const a=s.indexOf('\nfunction kg4Split(');if(a<0||s.indexOf('\nfunction kg4Split(',a+1)>=0)throw new Error(f+': kg4Split anchor not once');
  s=s.slice(0,a+1)+FN+'\n'+s.slice(a+1);r.fn=1;
  for(const [o,nw,want] of E){const c=s.split(o).length-1;if(want!==null&&c!==want)throw new Error(f+': '+o.slice(0,40)+' x'+c);s=s.split(o).join(nw);r[o.slice(0,24)]=c;}
  n++;}
 fs.writeFileSync(OUT+'/patched/'+f,s);rep[f]=r;}
if(n!==26)throw new Error('expected 26 files with kg4Split, got '+n);
console.log(JSON.stringify(rep,null,1));
