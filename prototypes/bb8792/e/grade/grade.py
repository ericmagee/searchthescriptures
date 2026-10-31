# BB-8792 step 6: Worker_E's own tally and checks from git 8275552 (A3 outputs), not from tally117.txt.
import json, subprocess, re, hashlib
from collections import defaultdict
C='8275552'; B='prototypes/bb8792/a3/s5/'
g=lambda p: subprocess.run(['git','show',f'{C}:{B}{p}'],capture_output=True,text=True).stdout
files=[l for l in subprocess.run(['git','ls-tree','-r','--name-only',C,B+'out'],capture_output=True,text=True).stdout.split('\n') if l]
tools={l.split('\t')[0]:int(l.split('\t')[1]) for l in g('calls.tsv').split('\n') if '\t' in l}
inmd5={l.split('\t')[0]:l.split('\t')[-1] for l in g('inputs.tsv').split('\n') if '\t' in l}
tab=defaultdict(dict); fires=[]
for f in files:
    name=f.split('/')[-1]; unit,rule,rep=name[:-5].split('__')
    raw=g('out/'+name)
    try: o=json.loads(raw)
    except Exception: fires.append((name,'not one JSON object')); continue
    v=o.get('verdict'); 
    if o.get('rule')!=rule: fires.append((name,'rule key '+str(o.get('rule'))))
    if v not in ('BREACH','CLEAN'): fires.append((name,'verdict '+str(v)))
    inp=g(f'in/{unit}__{rule}.txt')
    if hashlib.md5(inp.encode()).hexdigest()!=inmd5.get(f'in/{unit}__{rule}.txt'): fires.append((name,'input md5 differs'))
    u=inp.split('JUDGE TEXT TO CHECK:\n',1)[1]; u=re.split(r'\n(?:THE ROUNDS THE JUDGE TEXT NAMES|THE JUDGE\'S OWN LINES THE RULE NAMES|NOTE: this judge text)',u)[0]
    q=(o.get('quote') or '').strip()
    if q and q not in u: fires.append((name,'quote not in unit'))
    if tools.get('out/'+name,0)>3: fires.append((name,f"tool_uses {tools.get('out/'+name)}"))
    tab[(unit,rule)][rep]=v[0] if v else '?'
print(len(files),'replies;',len(tools),'tool rows')
for k in sorted(tab): print(k[0],k[1],''.join(tab[k].get(r,'-') for r in ('r1','r2','r3')))
print('FIRES',len(fires)); [print(' ',x) for x in fires]
