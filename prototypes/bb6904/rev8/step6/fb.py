# fetch-back check: every Code node of the fetched workflow against composed/ (changed) or the 95f04001 base (unchanged)
import json,sys,glob,os,hashlib
w=json.load(open(sys.argv[1]));w=w.get('workflow',w)
print('versionId',w.get('versionId'),'active',w.get('activeVersionId'),'nodes',w.get('nodeCount'))
N={n['name']:n for n in w['nodes']}
written=set(sys.argv[2].split(',')) if len(sys.argv)>2 and sys.argv[2] else set()
ok=bad=pend=0
for f in sorted(glob.glob('../rev8v/live/*.js')):
    nm=os.path.basename(f)[:-3].replace('_',' ');live=N[nm]['parameters'].get('jsCode')
    comp=open('composed/'+os.path.basename(f)).read();base=open(f).read()
    if live==comp and comp!=base: ok+=1;print('WRITTEN OK',nm,hashlib.md5(live.encode()).hexdigest()[:8])
    elif live==base and comp!=base: pend+=1
    elif live==base: pass
    else: bad+=1;print('MISMATCH',nm,hashlib.md5(live.encode()).hexdigest()[:8],'expected',hashlib.md5(comp.encode()).hexdigest()[:8])
print('written',ok,'pending',pend,'mismatch',bad)
