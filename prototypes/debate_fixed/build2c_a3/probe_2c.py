# Per-site misedit probes for 2c (Worker_A3; rule of drift BB-7414): each (old,new) pair of patch_2c.py undone alone in its node;
# DETECTED = the suite output (h_2c, h_site, h_cure, h_ask, h_fm) differs from the clean suite's.
import sys, os, shutil, subprocess, tempfile, importlib.util
HERE=os.path.dirname(os.path.abspath(__file__)); REP=os.path.abspath(sys.argv[1])
spec=importlib.util.spec_from_file_location('pc',os.path.join(HERE,'patch_2c.py'));pc=importlib.util.module_from_spec(spec);spec.loader.exec_module(pc)
def plan():
    p={}
    for n in pc.CALLS: p[n]=pc.raise_pairs(open(os.path.join(HERE,'base10',n+'.js')).read())+pc.CALLS[n]
    for n in pc.CURE_NODES: p.setdefault(n,[]).extend(pc.LIB)
    for n,x in pc.OTHER.items(): p.setdefault(n,[]).extend(x)
    return p
def suite(d):
    w=tempfile.mkdtemp(dir=os.path.dirname(d))
    for h in ('h_2c.cjs','h_site.cjs','h_site2.cjs','h_fm8.cjs','h_cure.cjs','h_ask.cjs','h_fm.cjs','row27665.json'): shutil.copy(os.path.join(HERE,h),w)
    os.symlink(d,os.path.join(w,'P'));o=[]
    for c in ['node h_2c.cjs P '+REP,'node h_site.cjs P '+REP,'node h_cure.cjs P '+REP,'node h_ask.cjs P','node h_fm.cjs P/Format_Markdown.js panel','node h_site2.cjs P '+REP,'node h_fm8.cjs P/Format_Markdown.js']:
        r=subprocess.run(c,cwd=w,shell=True,capture_output=True,text=True,timeout=120);o.append(r.stdout+r.stderr)
    fm=os.path.join(w,'fm_out_panel_P.md');o.append(open(fm).read() if os.path.exists(fm) else '')
    # text output: the judge texts the two build nodes send (the schema lines, the removed sentence)
    for n in sorted(x[:-3] for x in os.listdir(d)):
        s=open(os.path.join(d,n+'.js')).read();o.append(n+' '+str(s.count('counted_premises'))+' '+str(s.count('COUNTED PREMISES DEFENDER: followed'))+' '+str(s.count('array lists'))+' '+str(s.count('each counted_premises array MUST')))
    shutil.rmtree(w);return '\n'.join(o)
root=tempfile.mkdtemp(prefix='p2c_',dir=HERE);clean=os.path.join(root,'clean');shutil.copytree(os.path.join(HERE,'new10'),clean);C=suite(clean)
rows=[];P=plan()
for n in sorted(P):
    for i,(a,b) in enumerate(P[n]):
        d=os.path.join(root,'p');shutil.rmtree(d,ignore_errors=True);shutil.copytree(clean,d);f=os.path.join(d,n+'.js');s=open(f).read()
        assert s.count(b)==1,(n,i);open(f,'w').write(s.replace(b,a));rows.append((n,i,'DETECTED' if suite(d)!=C else 'SILENT'))
shutil.rmtree(root)
for r in rows: print('%-28s pair %2d  %s'%r)
print('sites',len(rows),'| DETECTED',sum(r[2]=='DETECTED' for r in rows),'| SILENT',sum(r[2]=='SILENT' for r in rows))
