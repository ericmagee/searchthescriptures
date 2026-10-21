# BB-6904 rev 8 step 6 draft (7223, 7224, 7227): guard removal A-C, then patch_rev8.py 61ee557a items 1, 2, 5 (item 3, the refused-round
# check, anchors 11 and 12, held). Reads the active nodes (95f04001), writes composed/; nothing here writes to n8n.
import sys,os,glob,hashlib,importlib.util
here=os.path.dirname(os.path.abspath(__file__))
src=open(os.path.join(here,'../rev8w/patch_rev8.py')).read()
ns={};exec(src[:src.index("src=open(sys.argv[1])")],{'sys':sys},ns);P=ns['A']
ITEM3={11,12};A=[a for k,a in enumerate(P) if k not in ITEM3]
gspec=importlib.util.spec_from_file_location('g',os.path.join(here,'../gr/patch_guard_lib.py'));g=importlib.util.module_from_spec(gspec);gspec.loader.exec_module(g)
os.makedirs(os.path.join(here,'composed'),exist_ok=True);rep=[]
for f in sorted(glob.glob(os.path.join(here,'../rev8v/live/*.js'))):
    s=open(f).read();out=s;n_g=0;n_p=0
    if os.path.basename(f) in ('Build_Independent_Verdict.js','Panel_Build.js'):out=g.patch(out);n_g=3
    for old,new in A:
        c=out.count(old)
        if c==0:continue
        if c!=1:sys.exit('REFUSED %s: anchor x%d %r'%(f,c,old[:50]))
        out=out.replace(old,new);n_p+=1
    open(os.path.join(here,'composed',os.path.basename(f)),'w').write(out)
    if out!=s:rep.append((os.path.basename(f)[:-3].replace('_',' '),n_g,n_p,hashlib.md5(s.encode()).hexdigest()[:8],hashlib.md5(out.encode()).hexdigest()[:8],len(out)))
for r in rep:print('%-30s guard %d patch %2d  %s -> %s  %d'%r)
print(len(rep),'nodes changed')
