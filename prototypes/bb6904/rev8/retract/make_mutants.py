# Worker_A3 step 3d, falsifier (8): four one-edit mutants of new/, each must fail the harness on its own node. Usage: python3 -I make_mutants.py
import shutil
M={'new_mutA':('Panel_Cure_Check.js','b.payload.verdict_tag=cc.word;',''),
   'new_mutB':('Alternate_Merge.js','const wd=new Set(o.result.length===1?o.withdrawn.map(w=>U(w.link)):[]);','const wd=new Set(o.withdrawn.map(w=>U(w.link)));'),
   'new_mutC':('Cure_Build.js','+"RETRACTED: D<n> vs C<m>\\n"','+"WITHDRAWN: D<n> vs C<m>\\n"'),
   'new_mutD':('Cure_Check.js','...(cc?{verdict_tag:cc.word}:{}),','')}
for d,(f,a,b) in M.items():
    shutil.rmtree(d,ignore_errors=True);shutil.copytree('new',d)
    s=open(f'{d}/{f}').read();assert s.count(a)==1,(d,s.count(a));open(f'{d}/{f}','w').write(s.replace(a,b))
