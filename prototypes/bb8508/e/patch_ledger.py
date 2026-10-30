import sys,os
T=open('chlen_raw.txt').read().strip()
EDITS=[
 # (a) a range or list followed by a colon reads whole; "1:24-2:5" still refused
 ("const TAIL='((?:\\\\s?[–—-]\\\\s?\\\\d{1,3}(?![\\\\d:])|\\\\s?,\\\\s?\\\\d{1,3}(?![\\\\d:]|\\\\s+[A-Z]))*)';",
  "const TAIL='((?:\\\\s?[–—-]\\\\s?\\\\d{1,3}(?!\\\\d|:\\\\d)|\\\\s?,\\\\s?\\\\d{1,3}(?!\\\\d|:\\\\d|\\\\s+[A-Z]))*)';/* BB-8508 (a): a range or list followed by a colon ('Matthew 1:24-25:') reads whole */"),
 # (c) chapter lengths, KJV, from kjv_verses
 (" const verses=(c,v,tail)=>",
  " // BB-8508 (c): KJV chapter lengths (kjv_verses, 66 books); a verse past its chapter's end is not a verse and is dropped.\n const CHL=(()=>{const o={};'"+T+"'.split('|').forEach(x=>{const p=x.split('=');o[p[0]]=p[1].split(',').map(Number);});return o;})();\n const isVerse=(bk,cv)=>{const L=bk?CHL[bk]:null;if(!L)return true;const a=String(cv).split(':');const n=L[+a[0]-1];return !!n&&+a[1]>=1&&+a[1]<=n;};\n const verses=(c,v,tail)=>"),
 # (b) bare reference: inherit the last book only in the same chapter as its last named reference
 ]
REPL_ALL=[]
CITED=("const citedLabels=t=>{const out=[];const seen=new Set();for(const r of refs(t)){const bk=r.book||r.ctx;if(!bk)continue;",
       "const citedLabels=t=>{const out=[];const seen=new Set();for(const r of refs(t)){const bk=r.book;if(!bk)continue;/* BB-8508 (b): only a reference written with its book is listed; a bare one cannot be bound to its book with certainty */")
ENDREFS=("}}return out;};\n // 6643 (b)", "}}return out.map(r=>({...r,cvs:r.cvs.filter(cv=>isVerse(r.book||r.ctx,cv))})).filter(r=>r.cvs.length).map(r=>({...r,cv:r.cvs[0]}));};\n // 6643 (b)")
SIDE=("+': '+p.verses+' verse(s) carried; '+p.named+' named; NOT NAMED: '+(p.notNamed.length?p.notNamed.join(', '):'none')",
      "+': '+(p.verses===0?'no verse carried; the judge reads this premise from the transcript':p.verses+' verse(s) carried; '+p.named+' named; NOT NAMED: '+(p.notNamed.length?p.notNamed.join(', '):'none'))")
HDR=("Not read by this ledger: ranges longer than 12 verses, references written with v., slash forms such as 24:16/43, and chapter-only references.",
     "Not read by this ledger: ranges longer than 12 verses, references written with v., slash forms such as 24:16/43, and chapter-only references. A reference to a verse past the end of its chapter in the KJV is dropped; the cited-in line lists only references written with their book.")
def one(s,a,b,name,lab):
  n=s.count(a)
  if n!=1: sys.exit('%s: %s found %d times'%(name,lab,n))
  return s.replace(a,b)
for f in sys.argv[1:]:
  s=open('base/'+f).read(); name=f
  for i,(a,b) in enumerate(EDITS): s=one(s,a,b,name,'edit%d'%i)
  for a,b in REPL_ALL:
    n=s.count(a)
    if n<1: sys.exit('%s: ctx not found'%name)
    s=s.replace(a,b); print(name,'ctx replaced',n)
  s=one(s,CITED[0],CITED[1],name,'cited')
  s=one(s,ENDREFS[0],ENDREFS[1],name,'endrefs')
  s=one(s,SIDE[0],SIDE[1],name,'side')
  s=one(s,HDR[0],HDR[1],name,'hdr')
  open('new/'+f,'w').write(s); print(name,'OK',len(s))
