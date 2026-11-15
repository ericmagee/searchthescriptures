# W2 replay harness for ASK 325 (close-enforcer misattribution). Read-only; no model calls.
# Usage: python3 h325.py [candidate.py]
#   candidate.py must define decide(row, deb) -> 'COUNTED' | 'NOT COUNTED'
#   row: debate_enforcer_log row (response_line, flagged_line); deb: debate_results row (round columns)
# Without a candidate it runs W2's reference rule only and prints the population result + plants.
import json, re, sys, copy, importlib.util, os
H = os.path.dirname(os.path.abspath(__file__))
SIDE_COLS = {'DEFENDER': ['claude_r1', 'claude_r2', 'engine_r3', 'defender_r4'],
             'CHALLENGER': ['engine_r1', 'engine_r2', 'challenger_r3', 'challenger_r4']}
OTHER = {'DEFENDER': 'CHALLENGER', 'CHALLENGER': 'DEFENDER'}
FLOOR = 40  # normalized chars; shorter quotes stay COUNTED (fail safe)

def norm(s):
    s = s or ''
    s = s.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')
    s = s.replace('—', '-').replace('–', '-')
    s = re.sub(r'[*_`#>"]', ' ', s)
    s = re.sub(r"(^|\s)'|'(\s|$)", r'\1 \2', s)
    return re.sub(r'\s+', ' ', s).strip().lower()

def parse(resp):
    m = re.match(r'CLOSE-CONTRADICTION:\s*\S+\s*--\s*(DEFENDER|CHALLENGER)\s*--.*?--\s*CONFIRMED\s*--\s*EARLIER\s*\[[^\]]*\]\s*"(.*?)"\s*--\s*CLOSING', resp or '', re.S)
    return (m.group(1), m.group(2)) if m else (None, None)

QUOTE_LABEL = re.compile(r'MEANS\s*\[\[?(?:CR|DR|GR)\d\]?\]?[^\n:]*:|\[\[?(?:CR|DR|GR)\d\]?\]\s*"', re.I)
OWNER_WORDS = re.compile(r"(the\s+)?(defender|challenger|opponent|other side)('s|s')?\b", re.I)

def quoted_at(text_raw, pos_norm, ntext, q):
    """Is the occurrence at normalized position pos_norm inside a quoted press?
    Map to the raw line: look back on the same raw line (or the 1 line before) for a MEANS [XRn] label,
    or for an owner phrase naming a side followed by a quote mark (A2: misattribution counts as quoted)."""
    # locate raw line by searching normalized lines
    for line_i, line in enumerate(text_raw.split('\n')):
        if q in norm(line):
            head = line[:max(0, line.lower().find(q[:20].split(' ')[0]))]
            prev = text_raw.split('\n')[line_i - 1] if line_i else ''
            if QUOTE_LABEL.search(line) or QUOTE_LABEL.search(prev[-200:]):
                return True
            if OWNER_WORDS.search(line) and '"' in line:
                return True
            return False
    return False

def occurrences(deb, side, q):
    out = []
    for c in SIDE_COLS[side]:
        raw = deb.get(c) or ''
        n = norm(raw)
        if q in n:
            out.append((c, quoted_at(raw, n.find(q), n, q)))
    return out

def reference(row, deb):
    side, earlier = parse(row['response_line'])
    if not side:
        return 'COUNTED', 'unparsed'
    q = norm(earlier)
    if len(q) < FLOOR:
        return 'COUNTED', 'short or empty quote'
    own = occurrences(deb, side, q)
    oth = occurrences(deb, OTHER[side], q)
    oth_unquoted = [c for c, qd in oth if not qd]
    if not oth_unquoted:
        return 'COUNTED', 'not in other side own text'
    if any(not qd for c, qd in own):
        return 'COUNTED', 'flagged side also states it unquoted (adopted)'
    return 'NOT COUNTED', 'EARLIER is the other side\'s words, quoted (own=%s other=%s)' % (own, oth_unquoted)

def plants(rows, debs):
    base_row = next(r for r in rows if r['id'] == 40640)
    base = copy.deepcopy(debs[base_row['debate_id']])
    sent = 'the row bounds the not-knowing at the bringing-forth of the firstborn, so any knowing the record allows stands after the birth.'
    P = []
    def mk(name, expect, resp=None, edit=None):
        r = copy.deepcopy(base_row); d = copy.deepcopy(base)
        if resp: r['response_line'] = resp(r['response_line'])
        if edit: edit(d)
        P.append((name, expect, r, d))
    mk('P0 37372 as stored', 'NOT COUNTED')
    mk('C1a empty EARLIER', 'COUNTED', resp=lambda s: s.replace('"' + sent + '"', '""'))
    mk('C1b EARLIER missing', 'COUNTED', resp=lambda s: re.sub(r'EARLIER \[DR3\] ".*?" --', 'EARLIER [DR3] -- ', s))
    mk('C1c paraphrased EARLIER', 'COUNTED', resp=lambda s: s.replace(sent, 'the verse bounds the not-knowing at the birth, so any knowing allowed by the record comes after it.'))
    mk('C2 label is own tag [DR3]', 'NOT COUNTED', edit=lambda d: d.update(challenger_r3=d['challenger_r3'].replace('MEANS [CR3] P1.3:', 'MEANS [DR3] P1.3:')))
    def swap(d):
        for a, b in zip(SIDE_COLS['DEFENDER'], SIDE_COLS['CHALLENGER']):
            d[a], d[b] = d[b], d[a]
    mk('C3 symmetric, defender flagged', 'NOT COUNTED', resp=lambda s: s.replace('-- CHALLENGER --', '-- DEFENDER --'), edit=swap)
    mk('C4 adopted later unquoted', 'COUNTED', edit=lambda d: d.update(challenger_r4=d['challenger_r4'] + '\n\nI hold this myself: ' + sent[0].upper() + sent[1:] + '\n'))
    def synth_only(d):
        d['engine_r3'] = d['engine_r3'].replace(sent, 'the row bounds it.')  # remove from defender own text
        d['synthesis'] = (d.get('synthesis') or '') + '\n' + sent
    mk('A1 echo only in synthesis/engine column', 'COUNTED', edit=synth_only)
    mk('A2 misattribution in flagged side (names defender as owner)', 'NOT COUNTED', edit=lambda d: d.update(challenger_r4=d['challenger_r4'] + '\n\nThe defender\'s line, "' + sent + '", does not bind me.\n'))
    return P

def main():
    rows = json.load(open(os.path.join(H, 'rows.json')))
    debs = {d['id']: d for d in json.load(open(os.path.join(H, 'debates.json')))}
    cand = None
    if len(sys.argv) > 1:
        spec = importlib.util.spec_from_file_location('cand', sys.argv[1]); cand = importlib.util.module_from_spec(spec); spec.loader.exec_module(cand)
    print('POPULATION: debate_enforcer_log rule E-CLOSECON seat close enforcer, response_line CONFIRMED: %d rows, %d debates' % (len(rows), len(debs)))
    flips = 0; dis = 0
    for r in rows:
        d = debs[r['debate_id']]
        ref, why = reference(r, d)
        c = cand.decide(r, d) if cand else None
        if ref != 'COUNTED': flips += 1
        if cand and c != ref: dis += 1
        if ref != 'COUNTED' or (cand and c != ref):
            print(' ', r['id'], r['run_token'], 'REF', ref, '|', why[:120], '| CAND', c)
    print('reference flips: %d of %d' % (flips, len(rows)), ('candidate disagreements: %d' % dis) if cand else '')
    ok = 0; P = plants(rows, debs)
    for name, exp, r, d in P:
        ref, why = reference(r, d); c = cand.decide(r, d) if cand else None
        good = (ref == exp) and (c is None or c == exp)
        ok += good
        print('  PLANT %-55s expect %-11s ref %-11s cand %-11s %s' % (name, exp, ref, c, 'OK' if good else 'FAIL'))
    print('plants %d/%d' % (ok, len(P)))

if __name__ == '__main__':
    main()
