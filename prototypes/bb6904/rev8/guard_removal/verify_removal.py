# BB-6904 step 6 verify (7223): the guard block removal A to C, draft against the active flow. Read-only.
# Usage: python3 -I verify_removal.py <baseline workflow json> <draft workflow json>
# Each json is a get_workflow_details result ({"workflow": {...}}) or a bare workflow object.
import json,sys,hashlib,difflib,re,subprocess,tempfile,os
def wf(p):
    d=json.load(open(p));return d.get('workflow',d)
B,D=wf(sys.argv[1]),wf(sys.argv[2])
JUDGE=['Build Independent Verdict','Panel Build']
md5=lambda s:hashlib.md5(s.encode('utf-8')).hexdigest()
ok=True
def say(flag,msg):
    global ok
    ok&=flag;print(('PASS ' if flag else 'FAIL ')+msg)
bn={n['name']:n for n in B['nodes']};dn={n['name']:n for n in D['nodes']}
say(set(bn)==set(dn),'node set equal (%d against %d)'%(len(bn),len(dn)))
say(json.dumps(B.get('connections'),sort_keys=True)==json.dumps(D.get('connections'),sort_keys=True),'connections equal')
say(json.dumps(B.get('settings'),sort_keys=True)==json.dumps(D.get('settings'),sort_keys=True),'settings equal')
diffn=[]
for k in sorted(set(bn)&set(dn)):
    a,b=dict(bn[k]),dict(dn[k])
    if k in JUDGE:
        a=json.loads(json.dumps(a));b=json.loads(json.dumps(b));a['parameters'].pop('jsCode',None);b['parameters'].pop('jsCode',None)
    if json.dumps(a,sort_keys=True)!=json.dumps(b,sort_keys=True):diffn.append(k)
say(not diffn,'every node other than the two judge jsCode strings equal'+(': differs '+', '.join(diffn) if diffn else ''))
BAD=['GUARD-INADMISSIBLE','who-belongs','Joshua 5:5','SEED-NOT-BLOOD']
OLDK='WITHDRAWN if it is withdrawn or conceded, or if the GUARD-INADMISSIBLE block orders it graded unexhibited; BROKEN if it is graded DEFENDER LINK BROKEN at a collision; STANDS otherwise.'
NEWK='WITHDRAWN if it is withdrawn or conceded; BROKEN if it is graded DEFENDER LINK BROKEN at a collision; STANDS otherwise.'
TERMS='A defender link that the GUARD-INADMISSIBLE block orders graded unexhibited counts as WITHDRAWN.'
for k in JUDGE:
    s0=bn[k]['parameters']['jsCode'];s1=dn[k]['parameters']['jsCode']
    print('\n== %s  before md5 %s (%d chars)  after md5 %s (%d chars)'%(k,md5(s0),len(s0),md5(s1),len(s1)))
    for w in BAD:say(s1.count(w)==0,'%s: "%s" occurs %d times after'%(k,w,s1.count(w)))
    say(s1.count(TERMS)==0,'%s: TERMS sentence gone'%k)
    say(s1.count(NEWK)==1 and s1.count(OLDK)==0,'%s: KEYSTONE new text once, old text gone'%k)
    sm=difflib.SequenceMatcher(None,s0,s1,autojunk=False)
    ops=[o for o in sm.get_opcodes() if o[0]!='equal']
    print('changed segments: %d'%len(ops))
    for t,i1,i2,j1,j2 in ops:
        old,new=s0[i1:i2],s1[j1:j2]
        print('  %s before[%d:%d] (%d chars, md5 %s) -> after[%d:%d] (%d chars)'%(t,i1,i2,len(old),md5(old)[:8],j1,j2,len(new)))
        print('    OLD: '+repr(old[:160])+(' ... '+repr(old[-120:]) if len(old)>300 else ''))
        print('    NEW: '+repr(new[:300]))
    blk=[o for o in ops if 'GUARD-INADMISSIBLE: the text' in s0[o[1]:o[2]]]
    if blk:
        t,i1,i2,j1,j2=blk[0];seg=s0[i1:i2];a=seg.find('GUARD-INADMISSIBLE: the text')
        print('  block segment holds the block start at offset %d of the removed text; removed text md5 %s'%(a,md5(seg)))
    with tempfile.NamedTemporaryFile('w',suffix='.js',delete=False) as f:f.write('async function __n(){'+s1+'\n}');fn=f.name
    r=subprocess.run(['node','--check',fn],capture_output=True,text=True);os.unlink(fn)
    say(r.returncode==0,'%s: node --check'%k+(' '+r.stderr[:300] if r.returncode else ''))
    print('remaining hits (guard, census, seed, cliff), with sentence:')
    for m in re.finditer(r'(?i)guard|census|seed|cliff',s1):
        a=max(s1.rfind('. ',0,m.start()),s1.rfind('\\n',0,m.start()),m.start()-200);z=s1.find('. ',m.end());z=m.end()+200 if z<0 or z-m.end()>200 else z+1
        print('  @%d %s: %s'%(m.start(),m.group(0),s1[a+1:z].replace('\n',' ')[:260]))
print('\nVERIFY', 'PASS' if ok else 'FAIL')
