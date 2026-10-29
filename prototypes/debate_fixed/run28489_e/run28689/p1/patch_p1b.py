# P1 amendment 1 (ruling BB-8010 on BB-8006): WORDING DIFFERS FROM <ref> for a PENDING quote whose best found row lies in the cited range.
# Quote Report and Format Markdown from live 23cf8db4 (p1/live_*.js); the judge rule line in Build Independent Verdict and Panel Build
# on their fix7 builds (../fix7/new_*.js). Each anchor exactly once or abort. Writes p1/new_<node>.js.
import hashlib, os, sys
D = os.path.dirname(os.path.abspath(__file__)); F7 = os.path.join(D, '..', 'fix7')
def patch(name, src_path, edits):
    src = open(src_path).read(); out = src
    for old, new in edits:
        n = out.count(old)
        if n != 1: sys.exit('ABORT %s: anchor occurs %d times: %r' % (name, n, old[:80]))
        out = out.replace(old, new)
    open(os.path.join(D, 'new_' + name + '.js'), 'w').write(out)
    print(name, hashlib.md5(src.encode()).hexdigest(), '->', hashlib.md5(out.encode()).hexdigest(), len(out))
QR = [("const status=!i.cited?'CITED VERSE DOES NOT EXIST':(best&&bs>=0.75)?'WORDS ARE AT '+best.book+' '+best.chapter+':'+best.verse:'WORDING NOT FOUND IN '+i.book;",
       "// Item 7, ruling BB-8010: a best row inside the cited range means the quote changed that verse's words, not that it cited the wrong verse.\n"
       " const inRange=best&&best.book===i.book&&+best.chapter===+i.chapter&&+best.verse>=+i.v1&&+best.verse<=+i.v2;\n"
       " const status=!i.cited?'CITED VERSE DOES NOT EXIST':(best&&bs>=0.75)?(inRange?'WORDING DIFFERS FROM '+i.ref:'WORDS ARE AT '+best.book+' '+best.chapter+':'+best.verse):'WORDING NOT FOUND IN '+i.book;")]
FM = [("const plain = st => /^WORDS ARE AT /.test(st) ? 'the words are at ' + st.slice(13) :",
       "const plain = st => /^WORDS ARE AT /.test(st) ? 'the words are at ' + st.slice(13) : /^WORDING DIFFERS FROM /.test(st) ? 'the wording differs from ' + st.slice(21) :")]
RULE_OLD = " A quotation whose wording is NOT FOUND in the book named, or whose cited verse does not exist, is NOT [L1] footing for any link that rests on it."
RULE_NEW = " A quotation whose wording DIFFERS FROM its cited verse, or is NOT FOUND in the book named, or whose cited verse does not exist, is NOT [L1] footing for any link that rests on it."
patch('Quote_Report', os.path.join(D, 'live_Quote_Report.js'), QR)
patch('Format_Markdown', os.path.join(D, 'live_Format_Markdown.js'), FM)
patch('Build_Independent_Verdict', os.path.join(F7, 'new_Build_Independent_Verdict.js'), [(RULE_OLD, RULE_NEW)])
patch('Panel_Build', os.path.join(F7, 'new_Panel_Build.js'), [(RULE_OLD, RULE_NEW)])
