# BB-8172 step 9 (P2D revision 3, BB-8270/8272; shape BB-8273): C3 sentence + quote-round sentence at the VOID rule,
# silent-verb sentence + chain clause at CHAIN SCOPE, the listing pre-check block before the COUNTING RULE, and the two
# VOID sentences quoted in Format Markdown's reader bullet. Anchored: each anchor must occur exactly once or the file is refused.
import os, sys, hashlib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from texts import C3, QR, SV, CL, WANT
HERE = os.path.dirname(os.path.abspath(__file__))
B, N = os.path.join(HERE, 'base'), os.path.join(HERE, 'new')
for k, v in WANT.items():
    if hashlib.md5(globals()[k].encode()).hexdigest() != v: sys.exit('REFUSED: text ' + k + ' md5 differs from its board row')
PRE = open(os.path.join(HERE, 'precheck.js'), encoding='utf-8').read()
sq = lambda s: s.replace('\\', '\\\\').replace("'", "\\'")      # inside a single-quoted JS string
VOID_A = "exclude it from every count and standing."
CHAIN_A = "That a single verse does not state a link or its contrary is never a ground for STANDS or UNDERDETERMINED, for either side."
EDITS = {
 'Panel_Build.js': [
   ("const F=RGL?RGL.f:$('Final Output').first().json;\n", "const F=RGL?RGL.f:$('Final Output').first().json;\n" + PRE),
   (VOID_A, VOID_A + ' ' + sq(C3) + ' ' + sq(QR)),
   (CHAIN_A, CHAIN_A + ' ' + SV + ' ' + CL),
   ("is not.\",'',\n'COUNTING RULE -- BINDING", "is not.\",'',preCheckBlock(F),'',\n'COUNTING RULE -- BINDING"),
 ],
 'Build_Independent_Verdict.js': [
   ("const d=$('Final Output').first().json;const NL=String.fromCharCode(10);\n", "const d=$('Final Output').first().json;const NL=String.fromCharCode(10);\n" + PRE),
   (VOID_A, VOID_A + ' ' + sq(C3) + ' ' + sq(QR)),
   (CHAIN_A, CHAIN_A + ' ' + SV + ' ' + CL),
   ("(d.dr3?SAN(d.dr3):'(missing)')+NL+NL+'COUNTING RULE -- BINDING", "(d.dr3?SAN(d.dr3):'(missing)')+NL+NL+preCheckBlock(d)+NL+NL+'COUNTING RULE -- BINDING"),
 ],
 'Format_Markdown.js': [
   ('NOT a concession\\".', 'NOT a concession\\". It adds: \\"' + C3 + '\\" and \\"' + QR + '\\"'),
 ],
}
for f, eds in EDITS.items():
    t = open(os.path.join(B, f), encoding='utf-8').read(); n = t
    for a, r in eds:
        c = n.count(a)
        if c != 1: sys.exit('REFUSED ' + f + ' anchor count ' + str(c) + ': ' + a[:60])
        n = n.replace(a, r)
    assert n != t
    open(os.path.join(N, f), 'w', encoding='utf-8').write(n)
    print(f, hashlib.md5(t.encode()).hexdigest(), '->', hashlib.md5(n.encode()).hexdigest(), len(t), '->', len(n))
