# Merge check for package D (W1, b410802) and pkgVC (W2, 404b036) on 8dd6d614: apply each build onto the other's patched output, in both
# orders, in a temp dir; every anchor must be unique and both orders must give the same text. Writes nothing live and changes no package dir.
import json,sys,os,shutil,subprocess,tempfile,hashlib
LIVE=sys.argv[1];H=os.path.dirname(os.path.abspath(__file__));sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
live=json.load(open(LIVE))
def overlay(src_dir,names):
    w=json.loads(json.dumps(live));
    for n in w['workflow']['nodes']:
        p=os.path.join(src_dir,n['name'].replace(' ','_')+'.js')
        if n['name'] in names and os.path.exists(p): n['parameters']['jsCode']=open(p).read()
    return w
def run(pkg,script,base_json):
    t=tempfile.mkdtemp();shutil.copytree(os.path.join(H,pkg),os.path.join(t,pkg));shutil.rmtree(os.path.join(t,pkg,'patched'),ignore_errors=True)
    for x in ['pkgA']: 
        if os.path.exists(os.path.join(H,x)): shutil.copytree(os.path.join(H,x),os.path.join(t,x))
    bj=os.path.join(t,'base.json');json.dump(base_json,open(bj,'w'))
    r=subprocess.run(['python3',os.path.join(t,pkg,script),bj],capture_output=True,text=True)
    out={f[:-3].replace('_',' '):open(os.path.join(t,pkg,'patched',f)).read() for f in os.listdir(os.path.join(t,pkg,'patched'))} if os.path.exists(os.path.join(t,pkg,'patched')) else {}
    return r.stdout+r.stderr,out
D=json.load(open(os.path.join(H,'pkgD','plan_D.json')));V=json.load(open(os.path.join(H,'pkgVC','plan_VC.json')))
dn={x['name'] for x in D['nodes']};vn={x['name'] for x in V['nodes']}
print('overlap',sorted(dn&vn))
# order 1: D then VC
log1,o1=run('pkgVC','build_VC.py',overlay(os.path.join(H,'pkgD','patched'),dn))
# order 2: VC then D (build_D asserts the versionId, which the overlay keeps)
log2,o2=run('pkgD','build_D.py',overlay(os.path.join(H,'pkgVC','patched'),vn))
print('D->VC:',[l for l in log1.splitlines() if 'BAD' in l or 'anchors' in l]);print('VC->D:',[l for l in log2.splitlines() if 'BAD' in l or 'anchors' in l])
def final(first_out,first_set,second_out,base_dir):
    res={}
    for nm in dn|vn:
        if nm in second_out: res[nm]=second_out[nm]
        else: res[nm]=open(os.path.join(H,base_dir,'patched',nm.replace(' ','_')+'.js')).read()
    return res
F1=final(None,None,o1,'pkgD');F2=final(None,None,o2,'pkgVC')
same=all(F1[n]==F2[n] for n in dn|vn);print('nodes',len(dn|vn),'both orders identical:',same)
if same:
    os.makedirs(os.path.join(H,'merged_DVC'),exist_ok=True)
    m={'live_version':live['workflow']['versionId'],'nodes':[]}
    L={n['name']:n for n in live['workflow']['nodes']}
    for nm in sorted(dn|vn):
        open(os.path.join(H,'merged_DVC',nm.replace(' ','_')+'.js'),'w').write(F1[nm])
        m['nodes'].append({'name':nm,'id':L[nm]['id'],'live_sha':sha(L[nm]['parameters']['jsCode']),'final_sha':sha(F1[nm]),'from':('D+VC' if nm in dn and nm in vn else ('D' if nm in dn else 'VC'))})
    json.dump(m,open(os.path.join(H,'merged_DVC','manifest.json'),'w'),indent=1)
    print('manifest',len(m['nodes']),'nodes; D+VC:',[x['name'] for x in m['nodes'] if x['from']=='D+VC'])
