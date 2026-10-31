# BB-8792 step 6S: Worker_E's grade of the 16 Sonnet calls (A3 git 8e5545a) beside the Haiku cells (my grade_out.txt, b37de501).
import json, subprocess, sys
B = sys.argv[1]
files = subprocess.check_output(['git','-C','/home/user/searchthescriptures','ls-tree','-r','--name-only',B,'prototypes/bb8792/a3/s5_sonnet/out/'],text=True).split()
exp = {'K2 K-G4':'C','K3a K-C':'B','K3b K-C':'B','K4 K-G4':'B','C_0ff61f2c K-S2':'C','C_25eae673 K-S2':'C'}
haiku = {}
for l in open('../grade/grade_out.txt'):
    p = l.split()
    if len(p)==3 and p[2].isalpha() and set(p[2])<=set('BC'): haiku[p[0]+' '+p[1]] = p[2]
cells = {}
for f in sorted(files):
    u, r, rep = f.split('/')[-1][:-5].split('__')
    d = json.loads(subprocess.check_output(['git','-C','/home/user/searchthescriptures','show',B+':'+f],text=True))
    cells.setdefault(u+' '+r, []).append((rep, d['verdict'][0]))
for k in exp:
    s = ''.join(v for _, v in sorted(cells[k]))
    ok = all(c==exp[k] for c in s); steady = len(set(s))==1
    print(f"{k:18} expected {exp[k]} | Sonnet {s:3} | Haiku {haiku.get(k,'?'):3} | right {ok} | steady {steady}")
