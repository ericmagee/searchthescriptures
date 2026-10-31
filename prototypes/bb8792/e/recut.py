# BB-8792 step 2: independent re-cut by Worker_E, written from the cut RULE as stated in
# A3's cut comments and cases.md (not from A3's SQL). Input: results.json, judgments.json
# fetched by REST from debate_results / debate_judgments for the three runs.
import json, re, hashlib, sys

R = json.load(open('results.json'))
J = json.load(open('judgments.json'))
rt_of = {r['id']: r['run_token'] for r in R}

src = []
for j in J:
    src.append((rt_of[j['debate_id']], f"panel:{j['judge_seat']}:{j['id']}", j['verdict_raw'] or ''))
for r in R:
    src.append((r['run_token'], 'single', r['independent_verdict_raw'] or ''))
    if r['drv_removed'] is not None:
        # jsonb::text form: ", " and ": " separators, non-ASCII kept
        src.append((r['run_token'], 'removed', json.dumps(r['drv_removed'], ensure_ascii=False)))

def text_of(raw):
    if re.match(r'^\s*\{', raw) and '"reasoning": "' in raw:
        raw = raw[raw.index('"reasoning": "') + 14:]
    return raw.replace('\\n', '\n').replace('\\"', '"')

def kind(line):
    if re.match(r'^\s*\**\s*D\d+\s+vs\.?\s+C\d+', line): return 'graded'
    if re.match(r'^\s*\**\s*RESULT:', line): return 'result'
    if re.match(r'^\s*\**\s*[DC]\d+\s*:', line): return 'head'
    if re.match(r'^\s*\**\s*[A-Z][A-Z /-]{2,40}:', line): return 'head'
    if re.match(r'^\s*\**\s*[A-Z][A-Z /-]{3,40}\s*$', line): return 'head'
    if line.strip(' \t\r\n\f\v') == '': return 'blank'
    return None

md5 = lambda s: hashlib.md5(s.encode('utf-8')).hexdigest()
out = []
for rt, seat, raw in src:
    txt = text_of(raw)
    lines = txt.split('\n')
    sts = [kind(l) for l in lines]
    starts = [i for i, s in enumerate(sts) if s not in (None, 'blank')]
    first = starts[0] if starts else len(lines)
    groups = {}
    g = 0
    for i, (l, s) in enumerate(zip(lines, sts)):
        if s is not None: g += 1
        key = 'reasoning' if i < first else g
        groups.setdefault(key, []).append((i, l, s))
    units = []
    for key, items in groups.items():
        st0 = items[0][2]
        if key != 'reasoning' and st0 not in ('graded', 'result'): continue
        body = '\n'.join(l for _, l, _ in items).strip(' \n')
        k = 'reasoning' if key == 'reasoning' else st0
        m = re.search(r'(D\d+\s+vs\.?\s+C\d+)', body)
        units.append((items[0][0], k, m.group(1) if m else '', body))
    units.sort()
    occ = {}
    for n0, k, pr, body in units:
        occ[(k, pr)] = occ.get((k, pr), 0) + 1
        out.append((rt.replace('ODV1-', ''), seat, k, pr, occ[(k, pr)], len(body), md5(body)[:12]))
    cures = [m.group(1) for m in re.finditer(r'(\[AUDIT v\d+: DEBATE RULE VIOLATION REPORT[^\]]*\])', txt)]
    for i, body in enumerate(sorted(cures)):
        m = re.search(r'ITEM: ([^;]+);', body)
        out.append((rt.replace('ODV1-', ''), seat, 'cure', m.group(1) if m else '', i + 1, len(body), md5(body)[:12]))

lines = sorted('|'.join(map(str, o)) for o in out)
open('my_index.txt', 'w').write('\n'.join(lines) + '\n')
from collections import Counter
print(len(src), 'judgment texts;', len(lines), 'units;', dict(Counter(o[2] for o in out)))
