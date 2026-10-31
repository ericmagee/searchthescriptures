"""BB-8792 step 5 input builder (Worker_A3). Fills E's template (git 563517c, 123a048a) by E's context rule (4a0c3bae). No model touches the text."""
import json, hashlib, re, os
md = lambda s: hashlib.md5(s.encode()).hexdigest()
T = open('e/template.txt').read()
R = json.load(open('e/rules.json'))
rule = lambda k: R[k]['text']
rounds = {x['run_token'].split('-')[1]: x for x in json.load(open('rounds.json'))}
COL = {'CR1':'claude_r1','CR2':'claude_r2','CR3':'engine_r3','DR1':'engine_r1','DR2':'engine_r2','DR3':'challenger_r3'}
ORDER = ['CR1','CR2','CR3','DR1','DR2','DR3']
UD = '../cut/units/'
NOTE = "NOTE: this judge text is the stored cure report; the record's audit line cut it short where it shows ..."
exec(open('../cut/units_src.py').read())   # gives U (known) and C (clean draw) with run ids
units = {k: ('30268' if k=='K1' else '30304', open(UD+k+'.txt').read()) for k in ('K1','K2','K3a','K3b','K4','K6')}
cmap = {key: rt for (key, rt, seat, pr, m, b) in C}
for key, rt in cmap.items(): units['C_'+key] = (rt, open(UD+'C_'+key+'.txt').read())
def k_context(rt, text):
    labs = sorted({a+b for a,b in re.findall(r'[\[(](CR|DR)([123])[\])]', text)}, key=ORDER.index)
    if not labs: return 'THE ROUNDS THE JUDGE TEXT NAMES, whole:\n(none named)', labs
    return 'THE ROUNDS THE JUDGE TEXT NAMES, whole:\n' + '\n\n'.join('=== [%s] ===\n%s' % (l, rounds[rt][COL[l]]) for l in labs), labs
def r_context():
    raw = json.load(open('j865.json'))[0]['verdict_raw']
    t = raw.replace('\\n', '\n').replace('\\"', '"')
    lines = [l for l in t.split('\n') if re.match(r'\s*\**\s*CHALLENGE STANDING:', l) or (re.match(r'\s*\**\s*D\d+\s+vs\.?\s+C\d+', l) and 'CHALLENGER LINK BROKEN' in l)]
    cures = re.findall(r'(\[AUDIT v\d+: DEBATE RULE VIOLATION REPORT[^\]]*\])', t)
    broken_items = [re.match(r'\s*\**\s*(D\d+ vs C\d+)', l).group(1) for l in lines if 'vs' in l]
    cures = [c for c in cures if any(('ITEM: %s;' % b) in c for b in broken_items)]
    return "THE JUDGE'S OWN LINES THE RULE NAMES:\n" + '\n'.join(lines + cures)
calls = []
plan = [(k, 'K-S2' if k=='K1' else 'K-G4' if k in ('K2','K4') else 'K-C' if k.startswith('K3') else 'RESULT', 3) for k in ('K1','K2','K3a','K3b','K4','K6')]
cand = ['C_2838a3b7','C_2539d24c','C_3c15e8ee']
clean = sorted(k for k in units if k.startswith('C_') and k not in cand)
plan += [(c, r, 3) for c in cand for r in ('K-S2','K-C')]
plan += [(c, r, 3) for c in clean for r in ('K-S2','K-C','K-G4')]
os.makedirs('in', exist_ok=True); log = []
for unit, rk, reps in plan:
    rt, text = units[unit]
    ctx, labs = (r_context(), []) if rk == 'RESULT' else k_context(rt, text)
    body = T.replace('{RULE_KEY}', rk).replace('{RULE_TEXT}', rule(rk)).replace('{UNIT}', text) \
            .replace('{EXCERPT_NOTE}', NOTE if unit in ('K2','K6') else '').replace('{CONTEXT}', ctx)
    fn = 'in/%s__%s.txt' % (unit, rk); open(fn, 'w').write(body)
    log.append((fn, rk, unit, rt, reps, '+'.join(labs), len(body), md(body)))
with open('inputs.tsv','w') as f:
    for row in log: f.write('\t'.join(map(str,row))+'\n')
print('files', len(log), 'calls', sum(r[4] for r in log))
for r in log: print(r[0], r[5] or '-', r[6], r[7][:8])
