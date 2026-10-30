# F6 (wake_link 7B(3)): for each edit in patch_c1.py, a copy of new/ with only that edit reverted; the constructed tests must show a change.
import os,shutil,subprocess,json,importlib.util,sys,io,contextlib
H=os.path.dirname(os.path.abspath(__file__))
src=open(os.path.join(H,'patch_c1.py'),encoding='utf-8').read().split('\nfor f in sorted(os.listdir(B)):')[0]
g={'__file__':os.path.join(H,'patch_c1.py')};exec(src,g)
full=json.loads(subprocess.run(['node','test_constructed.cjs','new'],cwd=H,capture_output=True,text=True).stdout)
for f,eds in g['E'].items():
  for k,(old,new) in enumerate(eds):
    d=os.path.join(H,'probe');shutil.rmtree(d,ignore_errors=True);shutil.copytree(os.path.join(H,'new'),d)
    p=os.path.join(d,f);t=open(p,encoding='utf-8').read();assert t.count(new)==1;open(p,'w',encoding='utf-8').write(t.replace(new,old))
    r=subprocess.run(['node','test_constructed.cjs','probe'],cwd=H,capture_output=True,text=True)
    if r.returncode!=0:print(f,k,'CRASH',r.stderr.strip().splitlines()[-1][:120]);continue
    o=json.loads(r.stdout);diff=[c for c in full if full[c]!=o[c]]
    print(f,'edit',k,'changed cases:',diff or 'NONE (not exercised by the constructed set)')
shutil.rmtree(os.path.join(H,'probe'),ignore_errors=True)
