import json, sys
sys.path.insert(0, '.')
from ref2 import decide_full
P = json.load(open('/home/claude/searchthescriptures/prototypes/posture_e/wall2024/a325/w4_plants.json'))
C = {c['id']: c for c in P['cases']}
COL = {'DEFENDER': {'r1': 'claude_r1', 'r2': 'claude_r2', 'r3': 'engine_r3', 'r4': 'defender_r4'},
       'CHALLENGER': {'r1': 'engine_r1', 'r2': 'engine_r2', 'r3': 'challenger_r3', 'r4': 'challenger_r4'}}
def deb_of(c):
    src = C[c['same_texts_as']] if 'same_texts_as' in c else c
    d = {}
    for side, k in (('DEFENDER', 'defender'), ('CHALLENGER', 'challenger')):
        for r, t in (src.get(k) or {}).items(): d[COL[side][r]] = t
    if src.get('synthesis'): d['synthesis'] = src['synthesis']
    return d
extra = []
# W2 extra plant P11: own claim on a line that names the other side, not as owner of the sentence
extra.append({'id': 'P11_names_other_not_owner', 'defender': {'r2': 'P5: the angel names the child and the husband takes the wife into his house by the record.'},
  'challenger': {'r3': "The defender's reading fails here. The angel names the child and the husband takes the wife into his house by the record.", 'r4': 'C2 kept.'},
  'row': {'side': 'CHALLENGER', 'earlier_q': 'The angel names the child and the husband takes the wife into his house by the record'}, 'expect': 'KEEP'})
ok = 0
for c in P['cases'] + extra:
    if 'same_texts_as' not in c: C[c['id']] = c
    r, why = decide_full(c['row']['side'], c['row']['earlier_q'], deb_of(c))
    got = 'DEMOTE' if r == 'NOT COUNTED' else 'KEEP'
    ok += got == c['expect']
    print('%-30s expect %-7s W2 %-7s %s | %s' % (c['id'], c['expect'], got, 'OK' if got == c['expect'] else 'DIFF', why))
print('%d/%d' % (ok, len(P['cases']) + len(extra)))
