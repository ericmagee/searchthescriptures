// Wrong-if L4 (BB-7357), on a debate's Drive report. Independent fold (not the node's cureQ): lowercase; drop * _ `; drop all quote marks
// (straight and curly); dashes to '-'; collapse space; labels (Ln)/(DRn)/(CRn) read as [..]. Rounds parsed from the sent Text 1 (round headers).
// Limb A fires: an UNCURED "no quotation found in the named round" row whose PRESSED quotation, so folded, is in that round.
// Limb B fires: a CURED row whose PRESSED quotation is found only when bracketed labels are deleted from the round (a dropped label passed).
const fs=require('fs');const md=fs.readFileSync(process.argv[2],'utf8');
const fold=s=>String(s).toLowerCase().split('').filter(c=>!'*_`"\'\u201c\u201d\u2018\u2019'.includes(c)).join('').replace(/[\u2014\u2013]/g,'-').replace(/\(((?:l[1-4])|(?:[cd]r[1-3]))\)/g,'[$1]').replace(/\s+/g,' ').trim();
const nolab=s=>s.replace(/\[(?:l[1-4]|[cd]r[1-3])\]/g,' ').replace(/\s+/g,' ').trim();
const sent=md.slice(md.indexOf('## What the judges were sent'));const m=sent.match(/\*\*user message\*\* \(\d+ characters\)\n\n```text\n([\s\S]*?)\n```/);
if(md.indexOf('## What the judges were sent')<0||!m){console.log('L4 FIRED: no sent text to read');process.exit(0);}
const T=m[1];const heads=[...T.matchAll(/^\[(DR[1-3]|CR[1-3])\][^\n]*$/gm)];const R={};heads.forEach((h,i)=>{R[h[1]]=T.slice(h.index,i+1<heads.length?heads[i+1].index:T.length);});
const found=(q,r,f)=>q.split(/\.\.\.|\u2026/).map(p=>f(fold(p)).replace(/^[\s.,;:!?-]+|[\s.,;:!?-]+$/g,'')).filter(Boolean).every(p=>f(fold(r)).includes(p));
const A=[],B=[];
for(const row of md.split('\n').filter(l=>/^\| .*\| \*\*(CURED|UNCURED)\*\* \|/.test(l))){const st=/\*\*UNCURED\*\*/.test(row)?'U':'C';const who=row.split(' | ').slice(0,2).join(' ').replace(/^\| /,'');
 for(const p of row.matchAll(/PRESSED: (D\d+ vs C\d+) \\?\| \(([CD]R[1-3])\) \\?\| "(.*?)"(?= \/ | Not cured| \|)/g)){const r=R[p[2]];if(!r)continue;
  if(st==='U'&&row.includes('no quotation found in the named round')&&found(p[3],r,x=>x))A.push(who);
  if(st==='C'&&!found(p[3],r,x=>x)&&found(p[3],r,nolab))B.push(who);}}
console.log('rounds',Object.keys(R).join(','),'| L4 limb A',A.length?'FIRED: '+A.join('; '):'silent','| limb B',B.length?'FIRED: '+B.join('; '):'silent');
