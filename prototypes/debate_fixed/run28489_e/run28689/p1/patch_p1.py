# P1 (BB-7994, P2D BB-8004 step 2): rule (A) of WALL-1864/1865 on top of the fix7 build (../fix7/new_*.js, itself built from live 23cf8db4).
# Each anchor must occur exactly once or the patch aborts. Writes p1/new_<node>.js. Nodes not touched here keep their fix7 build.
import hashlib, os, sys
D = os.path.dirname(os.path.abspath(__file__)); F7 = os.path.join(D, '..', 'fix7')
def patch(name, edits):
    src = open(os.path.join(F7, 'new_' + name + '.js')).read(); out = src
    for old, new in edits:
        n = out.count(old)
        if n != 1: sys.exit('ABORT %s: anchor occurs %d times: %r' % (name, n, old[:80]))
        out = out.replace(old, new)
    if out == src: sys.exit('ABORT %s: no change' % name)
    open(os.path.join(D, 'new_' + name + '.js'), 'w').write(out)
    print(name, hashlib.md5(src.encode()).hexdigest(), '->', hashlib.md5(out.encode()).hexdigest(), len(out))

# Citation Scan: keep the quotation's segments, split where it marks words left out ("..." or the ellipsis character),
# so Quote Compare can check each segment where the verse has it. The quote field itself is unchanged.
CS = [
 ("  const quote=m[5].replace(/…|\\.\\.\\./g,' ').replace(/\\*+/g,'').trim();",
  "  const quote=m[5].replace(/…|\\.\\.\\./g,' ').replace(/\\*+/g,'').trim();const segs=SEGS(m[5]);"),
 ("  items.push({ref,book,chapter:+m[2],v1,v2,quote,side,round,alt,",
  "  items.push({ref,book,chapter:+m[2],v1,v2,quote,segs,side,round,alt,"),
 ("  const quote=m[1].replace(/…|\\.\\.\\./g,' ').replace(/\\*+/g,'').trim();",
  "  const quote=m[1].replace(/…|\\.\\.\\./g,' ').replace(/\\*+/g,'').trim();const segs=SEGS(m[1]);"),
 ("  items.push({ref,book,chapter:+m[3],v1,v2,quote,side,round,order:'quote-first',",
  "  items.push({ref,book,chapter:+m[3],v1,v2,quote,segs,side,round,order:'quote-first',"),
 ("const QN=s=>",
  "// Item 7 (A), WALL-1864/1865: a quotation's segments, split where it marks words left out.\n"
  "const SEGS=s=>String(s).split(/…|\\.\\.\\./).map(x=>x.replace(/\\*+/g,'').trim()).filter(Boolean);\n"
  "const QN=s=>"),
]
# Quote Compare: a quotation MATCHES only when every segment stands contiguous in the cited text, in order; the cited text
# first loses its margin notes (a bracket holding a colon); 0.75 only binds a quote to its verse or its rebound verse.
QC = [
 ("const unGloss=(s,cited)=>{const cv=' '+fold(cited)+' ';",
  "// Item 7 (A), WALL-1864/1865: margin notes in the stored verse (\"[sabbath: Gr. sabbath day]\") are not the verse's words.\n"
  "const noMargin=s=>String(s||'').replace(/\\[[^\\]]*:[^\\]]*\\]/g,' ');\n"
  "const unGloss=(s,cited)=>{const cv=' '+fold(noMargin(cited))+' ';"),
 ("const idx={};",
  "// Item 7 (A): every segment of the quotation, folded, stands contiguous in the folded cited text, the segments in order.\n"
  "const contig=(i,cited)=>{if(!cited)return false;const cv=' '+fold(noMargin(cited))+' ';const segs=(Array.isArray(i.segs)&&i.segs.length?i.segs:[i.quote]).map(x=>fold(unGloss(x,cited))).filter(Boolean);\n"
  " if(!segs.length)return false;let at=0;for(const g of segs){const k=cv.indexOf(' '+g+' ',at);if(k<0)return false;at=k+g.length+1;}return true;};\n"
  "const idx={};"),
 ("if(q.length<3){const ph=fold(unGloss(i.quote,cited));if(ph&&cited&&(' '+fold(cited)+' ').includes(' '+ph+' '))return",
  "if(q.length<3){if(contig(i,cited))return"),
 ("  if(sa>=0.75)return {...i,ref:i.alt.ref,",
  "  if(sa>=0.75&&contig(i,at))return {...i,ref:i.alt.ref,"),
 ("if(score<0.75&&i.alt){",
  "if(!(score>=0.75&&contig(i,cited))&&i.alt){"),
 ("status:score>=0.75?'MATCHES':'PENDING'};});",
  "status:score>=0.75&&contig(i,cited)?'MATCHES':'PENDING'};});"),
]
patch('Citation_Scan', CS)
patch('Quote_Compare', QC)
