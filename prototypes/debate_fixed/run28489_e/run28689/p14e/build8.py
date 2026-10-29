# Step 8 build (BB-7994 P2D v5b, set named at 8083/8084): from the live flow fetched now (base/, c1bdcd5a), apply by anchor:
# Quote Report F1+F2 (A3 8066), the 8069 insert (Panel Build, Build Independent Verdict), K-B patch6b A1-A5 as amended (A3 1424783, 17 nodes),
# and the CURE_RULE sentence (14 nodes). Every anchor must occur exactly once in its node.
import glob,os,hashlib,re,sys
def once(s,a,n,f):
    c=s.count(a)
    if c!=1: sys.exit('ANCHOR count %d in %s: %r'%(c,f,a[:80]))
    return s.replace(a,n,1)
out={}
for f in sorted(glob.glob('base/*.js')): out[os.path.basename(f)]=open(f).read()
# Quote Report
QR='Quote_Report.js'
qa1=" let best=null,bs=0;for(const r of found){if(r.book!==i.book)continue;const tw=new Set(words(r.text));const s=i.q.filter(w=>tw.has(w)).length/i.q.length;if(s>bs){bs=s;best=r;}}\n"
qn1=qa1+" // F1, BB-7994 P2D v5a step 3 (ODV1-29199 Haggai 2:23 quoted with \"Zorubbabel\", a spelling no KJV verse carries): the cited verse itself is a candidate.\n // When its own word share (Quote Compare's score) is at least the bar and no found row scores higher, the quote changed the cited verse's words.\n if(i.cited&&i.score>=0.75&&i.score>=bs){bs=i.score;best={book:i.book,chapter:i.chapter,verse:i.v1};}\n"
qa2="const items=all.filter(i=>i.status==='MATCHES'||i.status==='NOT CHECKED'||(i.cite_form!==false&&!i.opp_words&&!(i.opp_short&&/^WORDING NOT FOUND IN /.test(i.status))));"
qn2="// F2, BB-7994 P2D v5a step 3 (WALL-1889; ODV1-29199 1 Chronicles 28:6): a load-bearing quotation (Citation Scan load_bearing: [L1] footing in a\n// LINK block of the link round) was offered as the verse whatever words stand before it; cite_form false does not leave it out. opp_words and\n// opp_short still do (the other side's own words are not a scripture citation).\nconst items=all.filter(i=>i.status==='MATCHES'||i.status==='NOT CHECKED'||((i.cite_form!==false||i.load_bearing===true)&&!i.opp_words&&!(i.opp_short&&/^WORDING NOT FOUND IN /.test(i.status))));"
out[QR]=once(once(out[QR],qa1,qn1,QR),qa2,qn2,QR)
# 8069 insert
A='Name every floating [L4] on either side before weighing it;'
INS=' '+open('../p12e/insert.txt').read().rstrip('\n')
for f in ['Panel_Build.js','Build_Independent_Verdict.js']: out[f]=once(out[f],A,A+INS,f)
# K-B: A3's patch pairs, read from patch6b_a3.py
ns={};exec(open('patch6b_a3.py').read().split('P=[')[0],ns)
P=[(ns['A%d'%i],ns['N%d'%i]) for i in range(1,6)]
kb=[k for k,v in out.items() if 'function drvExhibits' in v]
for f in kb:
    for a,n in P: out[f]=once(out[f],a,n,f)
# CURE_RULE sentence
CA='+"Each such line must exhibit, on the line itself, at least two lower layers'
CN='+"Each such line must exhibit, on the line itself or on the line directly under it, at least two lower layers'
cure=[]
for f in kb:
    if CA in out[f]: out[f]=once(out[f],CA,CN,f); cure.append(f)
for f,s in out.items(): open('final/'+f,'w').write(s)
print('K-B nodes',len(kb),'CURE_RULE nodes',len(cure),'not CURE:',sorted(set(kb)-set(cure)))
for f in sorted(out): print(f, hashlib.md5(open('base/'+f).read().encode()).hexdigest()[:8],'->',hashlib.md5(out[f].encode()).hexdigest()[:8], len(out[f]))
