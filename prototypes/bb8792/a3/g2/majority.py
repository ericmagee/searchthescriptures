# Majority of three over the stored d20 DeepSeek replies. No model calls.
import json, os, collections
lab = {}
for line in open('labels.tsv'):
    p = line.rstrip('\n').split('\t')
    if len(p) >= 3: lab[(p[0], p[1])] = p[2]
rep = collections.defaultdict(list)
for f in sorted(os.listdir('deepseek/out')):
    if not f.endswith('.json'): continue
    unit, rule, r = f[:-5].split('__')
    v = json.load(open('deepseek/out/' + f)).get('verdict', '?')
    rep[(unit, rule)].append('B' if v.startswith('BREACH') else 'C' if v.startswith('CLEAN') else '?')
right = wrong = 0; lines = []
for k in sorted(rep):
    vs = rep[k]; c = collections.Counter(vs).most_common(1)[0]
    maj = c[0] if c[1] >= 2 else '?'
    l = lab.get(k, '-')
    mark = ''
    if l in ('B', 'C'):
        if maj == l: right += 1
        else: wrong += 1; mark = '  WRONG'
    lines.append(f"{k[0]:<12}{k[1]:<6} label {l} | calls {''.join(vs)} | majority {maj}{mark}")
print('\n'.join(lines))
print(f"majority of three: labelled cases right {right}, wrong {wrong}")
