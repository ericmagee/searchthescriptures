# Item 7 fix (WALL-1844, agreed set 1853): anchored edits to four nodes of ORACLE_DEBATE_V1 23cf8db4.
# Each anchor must occur exactly once in the live code or the patch aborts. Writes new_<node>.js beside live_<node>.js.
import hashlib, os, sys
D = os.path.dirname(os.path.abspath(__file__))

def patch(name, edits):
    src = open(os.path.join(D, 'live_' + name + '.js')).read()
    out = src
    for old, new in edits:
        n = out.count(old)
        if n != 1:
            sys.exit('ABORT %s: anchor occurs %d times: %r' % (name, n, old[:80]))
        out = out.replace(old, new)
    if out == src:
        sys.exit('ABORT %s: no change' % name)
    open(os.path.join(D, 'new_' + name + '.js'), 'w').write(out)
    print(name, hashlib.md5(src.encode()).hexdigest(), '->', hashlib.md5(out.encode()).hexdigest(), len(out))

# (3) Citation Scan: a reference closed at once by ")" belongs to the quotation before it, so it does not take the
# quotation after it; and a quotation followed by a few words of prose and then "(Reference)" is paired with that reference.
CS = [
 ("const rqL=/",
  "// Item 7 (3), WALL-1844: a quotation, then a few words of prose with no quote mark or bracket, then the reference in parentheses\n"
  "// (ODV1-28689: \"I will multiply thy seed\" to Hagar (Genesis 16:10)). Prose that denies the verse makes it a phrase, not a citation.\n"
  "const rqP=/[“\"]([^”\"]{12,400})[”\"](?:[^“”\"\\n()]{1,30})\\(\\s*((?<![A-Za-z0-9])(?:[1-3]\\s)?[A-Z][a-z]+(?:\\s(?:of\\s)?[A-Z][a-z]+)?)\\.?\\s(\\d{1,3}):(\\d{1,3})((?:\\s?[–—-]\\s?\\d{1,3}|\\s?,\\s?\\d{1,3})*)\\s*\\)/g;\n"
  "const rqL=/"),
 ("while((m=re.exec(t))!==null){const book=BK[key(m[1])];if(!book)continue;",
  "while((m=re.exec(t))!==null){const book=BK[key(m[1])];if(!book)continue;\n"
  "  // Item 7 (3), WALL-1844: a reference closed at once by \")\" cites the quotation before it (ODV1-28689 Genesis 16:10, Luke 1:13; WALL-1822 John 6:42).\n"
  "  {const rc=RF.exec(m[0]);if(rc&&/^[ \\t]*\\)/.test(m[0].slice(rc[0].length)))continue;}"),
 (" for(const R of [rq,rqL]){R.lastIndex=0;\n while((m=R.exec(t))!==null){if(spans.has(m.index))continue;",
  " for(const R of [rq,rqL,rqP]){R.lastIndex=0;\n while((m=R.exec(t))!==null){if(spans.has(m.index))continue;"),
 ("order:'quote-first',cite_form:!/\\d/.test(m[1])&&!OPP(ri,m[1]),",
  "order:'quote-first',cite_form:!/\\d/.test(m[1])&&!OPP(ri,m[1])&&!(R===rqP&&/\\b(?:not|never|nor|no)\\b/i.test(m[0].slice(m[1].length+2,m[0].indexOf('(',m[1].length+2)))),"),
]

# (1) and (2) Quote Compare: parentheses and brackets are set aside as gloss only when their words are not in the cited verse;
# a quotation under three counted words is checked as an exact phrase, and stays NOT CHECKED only when the phrase is not found.
QC = [
 ("const unGloss=s=>String(s||'').replace(/\\[[^\\]]*\\]|\\([^)]*\\)/g,' ');",
  "// Item 7 (2), WALL-1844: the KJV prints its own parentheses and [italics] (Luke 3:23 \"(as was supposed)\"); such a span is kept when its words\n"
  "// stand in the cited verse, and set aside as the side's gloss only when they do not.\n"
  "const fold=s=>String(s||'').toLowerCase().replace(/[^a-z ]/g,' ').replace(/\\s+/g,' ').trim();\n"
  "const unGloss=(s,cited)=>{const cv=' '+fold(cited)+' ';return String(s||'').replace(/\\[([^\\]]*)\\]|\\(([^)]*)\\)/g,(all,a,b)=>{const inner=fold(a!==undefined?a:b);return inner&&cv.includes(' '+inner+' ')?' '+inner+' ':' ';});};"),
 ("const items=S.items.map(i=>{const q=words(unGloss(i.quote));if(q.length<3)return {...i,status:'NOT CHECKED'};\n const parts=[];for(let v=i.v1;v<=i.v2;v++){const t=idx[i.book+'|'+i.chapter+'|'+v];if(t)parts.push(t);}\n const cited=parts.join(' ');",
  "const items=S.items.map(i=>{\n const parts=[];for(let v=i.v1;v<=i.v2;v++){const t=idx[i.book+'|'+i.chapter+'|'+v];if(t)parts.push(t);}\n const cited=parts.join(' ');const q=words(unGloss(i.quote,cited));\n"
  " // Item 7 (1), WALL-1844: a short quotation (\"made of a woman\") is checked as an exact phrase; found, it MATCHES; not found, it stays NOT CHECKED.\n"
  " if(q.length<3){const ph=fold(unGloss(i.quote,cited));if(ph&&cited&&(' '+fold(cited)+' ').includes(' '+ph+' '))return {...i,q,cited,score:1,status:'MATCHES',phrase:true};return {...i,status:'NOT CHECKED'};}"),
]

# (4) Build Independent Verdict and Panel Build (one rulebook): an unchecked LOAD-BEARING quotation is listed to the judge by reference.
KJ_OLD = " if(!bad.length)return head;\n return head+NL+bad.map("
KJ_NEW = (" // Item 7 (4), WALL-1844: an unchecked load-bearing quotation is listed by reference, so the judge reads that verse itself.\n"
          " const ncl=x.items.filter(i=>i.status==='NOT CHECKED'&&i.load_bearing);\n"
          " const ncs=ncl.length?NL+'NOT CHECKED BY THE SYSTEM, load-bearing (read the verse yourself before you credit the link): '+ncl.map(i=>i.side+' '+i.round+(i.link?' LINK '+i.link:'')+': '+i.ref).join('; ')+'.':'';\n"
          " if(!bad.length)return head+ncs;\n return head+ncs+NL+bad.map(")

patch('Citation_Scan', CS)
patch('Quote_Compare', QC)
patch('Build_Independent_Verdict', [(KJ_OLD, KJ_NEW)])
patch('Panel_Build', [(KJ_OLD, KJ_NEW)])
