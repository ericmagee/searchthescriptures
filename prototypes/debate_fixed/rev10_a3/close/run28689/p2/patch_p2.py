# P2 (BB-7994 step 4): items 5 and 6 as agreed (WALL-1842 reply 1880; WALL-1843 reply 1881). Each anchor exactly once or abort.
# Reads base_<node>.js, writes new_<node>.js beside it.
import os, sys, hashlib
D = os.path.dirname(os.path.abspath(__file__))
L = {'CR1': '[CR1] DEFENDER R1', 'DR1': '[DR1] CHALLENGER R1', 'CR2': '[CR2] DEFENDER R2', 'DR2': '[DR2] CHALLENGER R2',
     'CR3': '[CR3] DEFENDER R3 -- LINK ROUND (defender exhibit-or-concede)',
     'DR3': '[DR3] CHALLENGER R3 -- LINK ROUND (challenger exhibit-or-concede)'}
H = {k: '=== ' + v + ' ===' for k, v in L.items()}
NEITHER = "You hold neither seat. The [CR] rounds are the DEFENDER's and the [DR] rounds are the CHALLENGER's. Write about both sides in the third person; never call either side's rounds your own."
SECOND = "The debate's verdict is the panel's. The panel judges after this diagnostic is written, so it is not known here. Review the second opinion's break; do not announce a verdict."
LABEL = "SECOND OPINION (single judge, not the debate's verdict): "
REVIEW_A = "(A review of the single judge's second opinion, which was "
REVIEW_B = ". The debate's verdict is the panel's.)"
def patch(name, pairs):
    src = open(os.path.join(D, 'base_' + name + '.js')).read(); out = src
    for a, b in pairs:
        n = out.count(a)
        if n != 1: sys.exit('ABORT %s: anchor occurs %d times: %r' % (name, n, a[:80]))
        out = out.replace(a, b)
    open(os.path.join(D, 'new_' + name + '.js'), 'w').write(out)
    print(name, hashlib.md5(src.encode()).hexdigest(), '->', hashlib.md5(out.encode()).hexdigest(), len(out))
# Item 5 EDIT 1: Build Independent Verdict, the six block headers.
patch('Build_Independent_Verdict', [
    ("NL+'[CR1]'+NL+SAN(d.cr1)", "NL+'" + H['CR1'] + "'+NL+SAN(d.cr1)"),
    ("NL+'[DR1]'+NL+SAN(d.gr1)", "NL+'" + H['DR1'] + "'+NL+SAN(d.gr1)"),
    ("NL+'[CR2]'+NL+SAN(d.cr2)", "NL+'" + H['CR2'] + "'+NL+SAN(d.cr2)"),
    ("NL+'[DR2]'+NL+SAN(d.gr2)", "NL+'" + H['DR2'] + "'+NL+SAN(d.gr2)"),
    ("'[CR3 -- LINK ROUND (defender exhibit-or-concede)]'+NL+(d.cr3", "'" + H['CR3'] + "'+NL+(d.cr3"),
    ("'[DR3 -- LINK ROUND (challenger exhibit-or-concede)]'+NL+(d.dr3", "'" + H['DR3'] + "'+NL+(d.dr3"),
])
# Item 5 EDITS 2, 3 and item 6 EDITS 1, 2: Build Diagnostic Prompt.
J = lambda s: s.replace("'", "\\'")
patch('Build_Diagnostic_Prompt', [
    ("const roles=$('Init with Guards').first().json.posline+'\\n'",
     "const roles=$('Init with Guards').first().json.posline+'\\n'+'" + J(NEITHER) + "\\n'"),
    ("'INDEPENDENT VERDICT: BROKEN\\n'", "'" + J(LABEL) + "BROKEN\\n" + J(SECOND) + "\\n'"),
    ("'INDEPENDENT VERDICT: '+vt+'\\n'", "'" + J(LABEL) + "'+vt+'\\n" + J(SECOND) + "\\n'"),
    ("'\\n\\nTRANSCRIPT: [CR1]\\n'", "'\\n\\nTRANSCRIPT:\\n" + H['CR1'] + "\\n'"),
    ("'\\n[GR1]\\n'", "'\\n" + H['DR1'] + "\\n'"),
    ("'\\n[CR2]\\n'", "'\\n" + H['CR2'] + "\\n'"),
    ("'\\n[GR2]\\n'", "'\\n" + H['DR2'] + "\\n'"),
    ("'\\n[CR3 -- LINK ROUND]\\n'", "'\\n" + H['CR3'] + "\\n'"),
    ("'\\n[GR3 -- LINK ROUND]\\n'", "'\\n" + H['DR3'] + "\\n'"),
])
# Item 6 (1876/1881): Extract Diagnostic, the review line right after either separator; separators unchanged.
patch('Extract_Diagnostic', [
    ("const fs=prev.synthesis+sep+diagnostic;",
     "const fs=prev.synthesis+sep+'" + J(REVIEW_A) + "'+prev.verdict_tag+'" + J(REVIEW_B) + "\\n'+diagnostic;"),
])
