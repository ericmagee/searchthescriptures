# BB-8172 step 4 (C1, his word BB-8209; changes ruling 4 of 2026-10-13): one reference-reading rule for Citation Scan and the ledger.
# Anchored edits on base/ (live ORACLE_DEBATE_V1 f620e9a9 node code); each anchor must occur exactly once or the file is refused.
# Writes new/ and prints each file's md5. Nothing is written to the flow.
import os,sys,hashlib
B=os.path.join(os.path.dirname(os.path.abspath(__file__)),'base');N=os.path.join(os.path.dirname(os.path.abspath(__file__)),'new')
os.makedirs(N,exist_ok=True)
E={}
def edit(f,old,new):E.setdefault(f,[]).append((old,new))

# --- Ledger: one function, four copies ---
LA=" const citedLabels=t=>{const out=[];const seen=new Set();for(const r of refs(t)){if(!r.book)continue;const label=r.book+' '+r.label.replace(/[–—]/g,'-');if(seen.has(label))continue;seen.add(label);out.push({label,r});}return out;};"
LN=(" // BB-8172 C1 (BB-8209): a bare reference takes the book named last before it in the same text (refs ctx); with none, it is left out.\n"
    " // The item carries that book, so the not-named test reads the verse under it.\n"
    " const citedLabels=t=>{const out=[];const seen=new Set();for(const r of refs(t)){const bk=r.book||r.ctx;if(!bk)continue;const label=bk+' '+r.label.replace(/[–—]/g,'-');if(seen.has(label))continue;seen.add(label);out.push({label,r:r.book?r:{...r,book:bk}});}return out;};")
for f in ['Panel_Build.js','Build_Independent_Verdict.js','D3_Build.js','C3_Build.js']:edit(f,LA,LN)

# --- Citation Scan ---
CS='Citation_Scan.js'
edit(CS,"const rounds=[['DEFENDER','R1',F.cr1],",
 "// BB-8172 C1 (his word 2026-10-29, BB-8209; changes ruling 4 of 2026-10-13): a bare reference (\"(1:3)\") takes the book named last before it\n"
 "// in the same round text; with none before it, it is left out.\n"
 "const BREF=/((?<![A-Za-z0-9])(?:[1-3]\\s)?[A-Z][a-z]+(?:\\s(?:of\\s)?[A-Z][a-z]+)?)\\.?\\s(\\d{1,3}):(\\d{1,3})/g;\n"
 "const lastBook=(t,pos)=>{let b=null;for(const x of String(t).slice(0,pos).matchAll(BREF)){const k=BK[key(x[1])]||BK[key(String(x[1]).split(/\\s/).pop())];if(k)b=k;}return b;};\n"
 "const rounds=[['DEFENDER','R1',F.cr1],")
# the bare quote-first forms, after rqL's definition line
RQL_END="(?:\\s?[–—-]\\s?\\d{1,3}|\\s?,\\s?\\d{1,3})*)/g;\n// ORDER (BB-6827"
edit(CS,RQL_END,
 "(?:\\s?[–—-]\\s?\\d{1,3}|\\s?,\\s?\\d{1,3})*)/g;\n"
 "// BB-8172 C1: the quote-first forms with a bare reference in parentheses (\"...\" (1:3); \"...\" a few words (1:5)); group 2 is empty, so the\n"
 "// book is lastBook's. Only the parenthesized bare form is read.\n"
 "const rqB=/[“\"]([^”\"]{12,400})[”\"][ \\t]*\\**[ \\t]*\\(\\s*()(\\d{1,3}):(\\d{1,3})((?:\\s?[–—-]\\s?\\d{1,3}|\\s?,\\s?\\d{1,3})*)\\s*\\)/g;\n"
 "const rqBP=/[“\"]([^”\"]{12,400})[”\"](?:[^“”\"\\n()]{1,30})\\(\\s*()(\\d{1,3}):(\\d{1,3})((?:\\s?[–—-]\\s?\\d{1,3}|\\s?,\\s?\\d{1,3})*)\\s*\\)/g;\n"
 "// ORDER (BB-6827")
edit(CS," const claimed=new Set();for(const R of [rq,rqL]){R.lastIndex=0;while((m=R.exec(t))!==null){if(BK[key(m[2])])claimed.add(m.index);}}",
 " const claimed=new Set();for(const R of [rq,rqL,rqB]){R.lastIndex=0;while((m=R.exec(t))!==null){if(m[2]?BK[key(m[2])]:lastBook(t,m.index))claimed.add(m.index);}}")
# reference-then-quote: the reference after the quote is scored first, the one before is the fallback
edit(CS,"  const k2=side+'|'+round+'|'+ref+'|'+quote.toLowerCase();if(seen.has(k2))continue;seen.add(k2);\n  // Nearer reference",
 "  // BB-8172 C1: in \"'quote' (ref)\" the reference written right after the quote is scored first (a bare one takes the book named last\n"
 "  // before it); the reference before the quote, or the nearer one between them as ruling 4 kept it, is the fallback (after_first).\n"
 "  const pm=t.slice(m.index+m[0].length).match(/^\\s*\\((?:vv?\\.?\\s*)?(?:((?<![A-Za-z0-9])(?:[1-3]\\s)?[A-Z][a-z]+(?:\\s(?:of\\s)?[A-Z][a-z]+)?)\\.?\\s)?(\\d{1,3}):(\\d{1,3})/);\n"
 "  const pb=pm?(pm[1]?BK[key(pm[1])]:lastBook(t,m.index+m[0].length)):null;const fref=pb?pb+' '+pm[2]+':'+pm[3]:ref;\n"
 "  const k2=side+'|'+round+'|'+fref+'|'+quote.toLowerCase();if(seen.has(k2))continue;seen.add(k2);\n  // Nearer reference")
edit(CS,"  let alt=null;if(am){const ab=am[1]?BK[key(am[1])]:book;if(ab)alt={ref:ab+' '+am[2]+':'+am[3],book:ab,chapter:+am[2],verse:+am[3]};}\n  items.push({ref,book,chapter:+m[2],v1,v2,quote,segs,side,round,alt,",
 "  if(pb){const nb=pr.length>1?(pr[1][1]?BK[key(pr[1][1])]:book):null;\n"
 "   const fb=nb?{ref:nb+' '+pr[1][2]+':'+pr[1][3],book:nb,chapter:+pr[1][2],verse:+pr[1][3]}:{ref,book,chapter:+m[2],verse:v1,v2};\n"
 "   items.push({ref:fref,book:pb,chapter:+pm[2],v1:+pm[3],v2:+pm[3],quote,segs,side,round,alt:fb,after_first:true,cite_form:!/\\d/.test(m[5])&&!OPP(ri,m[5]),opp_words:OPPW(ri,m[5]),opp_short:OPPS(ri,m[5]),...LB(t,round,m.index+m[0].length-m[5].length-1)});continue;}\n"
 "  let alt=null;if(am){const ab=am[1]?BK[key(am[1])]:book;if(ab)alt={ref:ab+' '+am[2]+':'+am[3],book:ab,chapter:+am[2],verse:+am[3]};}\n  items.push({ref,book,chapter:+m[2],v1,v2,quote,segs,side,round,alt,")
edit(CS," for(const R of [rq,rqL,rqP]){R.lastIndex=0;\n while((m=R.exec(t))!==null){if(spans.has(m.index))continue;const book=BK[key(m[2])];if(!book)continue;",
 " for(const R of [rq,rqL,rqP,rqB,rqBP]){R.lastIndex=0;\n while((m=R.exec(t))!==null){if(spans.has(m.index))continue;const book=m[2]?BK[key(m[2])]:lastBook(t,m.index);if(!book)continue;")
edit(CS,"!(R===rqP&&/\\b(?:not|never|nor|no)\\b/i",
 "!((R===rqP||R===rqBP)&&/\\b(?:not|never|nor|no)\\b/i")
edit(CS,"...items.filter(i=>i.alt).map(i=>i.alt.book+'|'+i.alt.chapter+'|'+i.alt.verse+'|'+i.alt.verse)",
 "...items.filter(i=>i.alt).map(i=>i.alt.book+'|'+i.alt.chapter+'|'+i.alt.verse+'|'+(i.alt.v2||i.alt.verse))")

# --- Quote Compare: a fallback may span verses (the reference before the quote) ---
QC='Quote_Compare.js'
edit(QC,"const at=idx[i.alt.book+'|'+i.alt.chapter+'|'+i.alt.verse];",
 "const ap=[];for(let v=i.alt.verse;v<=(i.alt.v2||i.alt.verse);v++){const x=idx[i.alt.book+'|'+i.alt.chapter+'|'+v];if(x)ap.push(x);}const at=ap.join(' '); /* BB-8172 C1: a fallback may span verses */")
edit(QC,"v1:i.alt.verse,v2:i.alt.verse,q,cited:at,",
 "v1:i.alt.verse,v2:i.alt.v2||i.alt.verse,q,cited:at,")

# --- Format Markdown: the rebound line names its direction ---
FM='Format_Markdown.js'
edit(FM,"  const rb = QRd.items.filter(i => i.status === 'MATCHES' && i.rebound_from);",
 "  const rb = QRd.items.filter(i => i.status === 'MATCHES' && i.rebound_from && !i.after_first);")
edit(FM,"' (first reference before it: ' + i.rebound_from + ').\\n'; }); t += '\\n'; }\n",
 "' (first reference before it: ' + i.rebound_from + ').\\n'; }); t += '\\n'; }\n"
 "  // BB-8172 C1 (BB-8209): the reference written after a quotation is scored first; a match made on the reference before it is listed.\n"
 "  const ra = QRd.items.filter(i => i.status === 'MATCHES' && i.rebound_from && i.after_first);\n"
 "  if (ra.length) { t += ra.length + (ra.length === 1 ? ' match was' : ' matches were') + ' made on the reference before the quotation, after the reference written after it did not match:\\n\\n'; ra.forEach(i => { t += '- ' + (i.side === 'DEFENDER' ? 'Defender' : 'Challenger') + ', round ' + String(i.round).replace(/^R/, '') + ': \"' + String(i.quote).slice(0, 200) + '\" matches ' + i.ref + ' (reference after it: ' + i.rebound_from + ').\\n'; }); t += '\\n'; }\n")

# --- OPTION 2 (BB-8212, BB-8214; ruled BB-8215; OPT2=0 builds the rule without it, for comparison): "a book named" also reads a book name written in
# capitals ("LUKE 1:34-37") and a book name with a possessive ("Matthew's own genealogy"), in both readers. ---
if os.environ.get('OPT2','1')=='1': # ruled BB-8215
  RA=r"[A-Z][a-z]+(?:\\s(?:of\\s)?[A-Z][a-z]+)?)\\.?\\s)?(\\d{1,3}):(\\d{1,3})'+TAIL,'g');let lastBook=null;"
  RN=(r"[A-Z][A-Za-z]+(?:\\s(?:of\\s)?[A-Z][A-Za-z]+)?)\\.?\\s)?(\\d{1,3}):(\\d{1,3})'+TAIL,'g');let lastBook=null;"
      "\n  // BB-8172 C1 option 2 (BB-8212): a book name with a possessive (\"Matthew's own genealogy\") is a book named; a bare reference after it takes it."
      "\n  const PO=[...T.matchAll(/(?<![A-Za-z0-9])((?:[1-3]\\s)?[A-Z][A-Za-z]+)['’]s\\b/g)].map(x=>({at:x.index,b:BK[key(x[1])]||null})).filter(x=>x.b);let pi=0,lastAt=-1;")
  for f in ['Panel_Build.js','Build_Independent_Verdict.js','D3_Build.js','C3_Build.js']:
    edit(f,RA,RN)
    edit(f,"if(b)lastBook=b;","while(pi<PO.length&&PO[pi].at<m.index){if(PO[pi].at>lastAt){lastBook=PO[pi].b;lastAt=PO[pi].at;}pi++;}if(b){lastBook=b;lastAt=m.index;}")
  E[CS]=[(o,n.replace("const BREF=/((?<![A-Za-z0-9])(?:[1-3]\\s)?[A-Z][a-z]+(?:\\s(?:of\\s)?[A-Z][a-z]+)?)\\.?\\s(\\d{1,3}):(\\d{1,3})/g;\n"
      "const lastBook=(t,pos)=>{let b=null;for(const x of String(t).slice(0,pos).matchAll(BREF)){const k=BK[key(x[1])]||BK[key(String(x[1]).split(/\\s/).pop())];if(k)b=k;}return b;};\n",
      "// Option 2 (BB-8212): a book name in capitals, or with a possessive (\"Matthew's own genealogy\"), is a book named.\n"
      "const BREF=/((?<![A-Za-z0-9])(?:[1-3]\\s)?[A-Z][A-Za-z]+(?:\\s(?:of\\s)?[A-Z][A-Za-z]+)?)(?:\\.?\\s(\\d{1,3}):(\\d{1,3})|['’]s\\b)/g;\n"
      "const lastBook=(t,pos)=>{let b=null;for(const x of String(t).slice(0,pos).matchAll(BREF)){const k=BK[key(x[1])]||BK[key(String(x[1]).split(/\\s/).pop())];if(k)b=k;}return b;};\n")) for (o,n) in E[CS]]

# --- (v), ruled BB-8219 (3.16 amendment to step 4): the judges' premises ledger reads the answering side's round 2 and link round, as the
# judge text already states (BB-7374, rulings 86). Panel Build and Build Independent Verdict only (D3/C3 Build never call judgeBlock). ---
for f in ['Panel_Build.js','Build_Independent_Verdict.js']:
  edit(f,"const ledger=F=>({defender:side(F.gr2,F.cr3,DEF_RE),challenger:side(F.cr3,F.dr3,CH_RE),",
   "// BB-8172 (v), BB-8219, order per BB-8222: a premise verse is answered in the link round, or in the answering side's round 2 when the\n"
   " // verse was already pressed before that round ([DR1] for the defender; [CR1] or [CR2] for the challenger): an answer counts only from a later round (BB-7374).\n"
   " const ledger=F=>({defender:side(F.gr2,F.cr3,DEF_RE,F.cr2,F.gr1),challenger:side(F.cr3,F.dr3,CH_RE,F.gr2,String(F.cr1||'')+LF+String(F.cr2||'')),")
  edit(f," const side=(pressing,answering,headRe)=>{const i=lastHead(pressing,headRe);if(i<0)return {list:false,premises:[]};\n  const list=String(pressing).slice(i);const N=namedIn(answering);",
   " const side=(pressing,answering,headRe,early,earlier)=>{const i=lastHead(pressing,headRe);if(i<0)return {list:false,premises:[]};\n  const list=String(pressing).slice(i);const N=namedIn(answering);const NE=early?namedIn(early):null,PE=early?namedIn(earlier):null;")
  edit(f,"if(r.cvs.some(cv=>isNamed(N,r.book||r.ctx||'',cv)))named++;",
   "if(r.cvs.some(cv=>isNamed(N,r.book||r.ctx||'',cv)||(NE&&isNamed(PE,r.book||r.ctx||'',cv)&&isNamed(NE,r.book||r.ctx||'',cv))))named++;")
  edit(f,"and whether the answering link round names each verse anywhere.",
   "and whether the answering side\\'s round 2 or link round names each verse anywhere (the defender\\'s [CR2] or [CR3], the challenger\\'s [DR2] or [DR3]).")
  edit(f,"sideLines(L.defender,'AGAINST THE DEFENDER, answered in [CR3]')","sideLines(L.defender,'AGAINST THE DEFENDER, answered in [CR2] or [CR3]')")
  edit(f,"sideLines(L.challenger,'AGAINST THE CHALLENGER, answered in [DR3]')","sideLines(L.challenger,'AGAINST THE CHALLENGER, answered in [DR2] or [DR3]')")

for f in sorted(os.listdir(B)):
  t=open(os.path.join(B,f),encoding='utf-8').read();n=t
  for old,new in E.get(f,[]):
    c=n.count(old)
    if c!=1:sys.exit('REFUSED '+f+' anchor count '+str(c)+': '+old[:70])
    n=n.replace(old,new)
  if f in E:assert n!=t
  open(os.path.join(N,f),'w',encoding='utf-8').write(n)
  print(f,'patched' if f in E else 'unchanged',hashlib.md5(n.encode()).hexdigest())
