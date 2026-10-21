# BB-6904 / 7223 A-C: remove the GUARD-INADMISSIBLE block and the two sentences that name it, from the two judge nodes.
import sys,hashlib
BLK_MD5='f61b8aed'
def patch(s):
    i=s.index('GUARD-INADMISSIBLE: the text');blk=s[i:i+2204]
    assert hashlib.md5(blk.encode()).hexdigest().startswith(BLK_MD5)
    old='+NL+NL+"'+blk+'"'          # A: block with its joining glue
    assert s.count(old)==1;s=s.replace(old,'')
    B='A defender link that the GUARD-INADMISSIBLE block orders graded unexhibited counts as WITHDRAWN. '
    assert s.count(B)==1;s=s.replace(B,'')
    C=('WITHDRAWN if it is withdrawn or conceded, or if the GUARD-INADMISSIBLE block orders it graded unexhibited; BROKEN if it is graded DEFENDER LINK BROKEN at a collision; STANDS otherwise.',
       'WITHDRAWN if it is withdrawn or conceded; BROKEN if it is graded DEFENDER LINK BROKEN at a collision; STANDS otherwise.')
    assert s.count(C[0])==1;s=s.replace(*C)
    return s

# E (7229): Format Markdown's reader section: drop the who-belongs bullet; three rules remain (UNEXHIBITED, VOID, KEYSTONE).
def patch_fm(s):
    i=s.index("- **Who-belongs verdicts.**");j=s.index("- **UNEXHIBITED.**",i)
    old=s[i:j];assert s.count(old)==1;s=s.replace(old,'')
    o2="The judges' rulebook adds four rules, quoted here in its own words.";assert s.count(o2)==1
    return s.replace(o2,"The judges' rulebook adds three rules, quoted here in its own words.")

# F (7235): the posline roles sentence leaves both judge prompts; the field stays in Init with Guards for its other readers.
F_SITES={'Build_Independent_Verdict.js':("'Evaluate ONLY what was argued in this transcript.'+NL+$('Init with Guards').first().json.posline+NL+\"THE FRAMEWORK",
                                          "'Evaluate ONLY what was argued in this transcript.'+NL+\"THE FRAMEWORK"),
         'Panel_Build.js':("IG.posline+' Grade each side by its ROLE; neither reading is presumed.'",
                           "'Grade each side by its ROLE; neither reading is presumed.'")}
def patch_f(name,s):
    o,n=F_SITES[name];assert s.count(o)==1,(name,o[:40]);return s.replace(o,n)

# ITEM 8 (7234 P2): Format Markdown appends "What the judges were sent"; Plain Rule Lines rewrites only the text above that section.
import os as _os
ITEM8=open(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)),'../it8/item8_block.js')).read()
def patch_item8_fm(s):
    a="const fileName = (PF ? 'INCOMPLETE - ' : '') +";assert s.count(a)==1
    return s.replace(a,ITEM8.lstrip('\n')+a)
PRL=("const md = String(x.md || '').replace(/^CLAUSE:",
     "// ITEM 8 (BB-7234): the section \"What the judges were sent\" is verbatim judge text; only the text above it is rewritten here.\n"
     "const SENT_AT = String(x.md || '').indexOf('\\n## What the judges were sent\\n');\n"
     "const HEAD = SENT_AT >= 0 ? String(x.md).slice(0, SENT_AT) : String(x.md || ''), TAIL = SENT_AT >= 0 ? String(x.md).slice(SENT_AT) : '';\n"
     "const md0 = HEAD.replace(/^CLAUSE:")
def patch_item8_prl(s):
    o,n=PRL;assert s.count(o)==1;s=s.replace(o,n)
    a="'. The defender declared ' + n + ' links, withdrew ' + w + ', and the challenger refuted ' + k + '.');"
    assert s.count(a)==1;s=s.replace(a,a+"\nconst md = md0 + TAIL;")
    b="const left = (md.match(";assert s.count(b)==1;return s.replace(b,"const left = (md0.match(")
