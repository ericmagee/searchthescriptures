# W2 reference rule rev 2: owner attribution test is position-bound (owner phrase directly before the sentence), quote marks not required.
import re
from h325 import norm, SIDE_COLS, OTHER, FLOOR, parse
LABEL = re.compile(r'MEANS\s*\[\[?(?:CR|DR|GR)\d\]?\]?[^\n:]*:\s*$|\[\[?(?:CR|DR|GR)\d\]?\]\s*$', re.I)
def owner_re(other):
    o = other.lower()
    return re.compile(r"(the\s+)?" + o + r"('s|s')\s+(means|line|words|premise|claim|sentence|reading|link|p\d[\.\d]*)[^\n.]{0,25}(?:\d\.\d+)?[^\n.]{0,10}[,:]\s*$", re.I)
def occ(raw, q, other):
    out = []
    for line in raw.split('\n'):
        nl = norm(line)
        i = nl.find(q)
        while i >= 0:
            pre = nl[:i]
            # quoted if a MEANS [XRn] label (or bare [XRn]) ends right before, or an owner phrase naming the other side ends right before
            quoted = bool(LABEL.search(pre)) or bool(owner_re(other).search(pre))
            out.append(quoted)
            i = nl.find(q, i + 1)
    return out
def decide_full(side, earlier, deb):
    q = norm(earlier)
    if len(q) < FLOOR: return 'COUNTED', 'short/empty'
    own = []; oth = []
    for c in SIDE_COLS[side]: own += occ(deb.get(c) or '', q, OTHER[side])
    for c in SIDE_COLS[OTHER[side]]: oth += occ(deb.get(c) or '', q, side)
    if not any(not x for x in oth): return 'COUNTED', 'not in other side own unquoted text'
    if any(not x for x in own): return 'COUNTED', 'adopted'
    return 'NOT COUNTED', 'other side words, quoted'
def decide(row, deb):
    side, e = parse(row['response_line'])
    if not side: return 'COUNTED'
    return decide_full(side, e, deb)[0]
