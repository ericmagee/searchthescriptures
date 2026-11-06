# D + VC + K on live 7599a747 (W2, WALL-2024 2176 plan step c): overlay merged_DVC (D+VC, from merge_DVC_check.py) on the live fetch, run
# pkgK/build_K.py on that overlay, and write one manifest whose live_sha is the live text and final_sha the D+VC+K text. Writes nothing live.
import json,sys,os,subprocess,hashlib,shutil
LIVE=sys.argv[1];H=os.path.dirname(os.path.abspath(__file__));sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
live=json.load(open(LIVE));M=json.load(open(os.path.join(H,'merged_DVC','manifest.json')))
assert live['workflow']['versionId']==M['live_version'],(live['workflow']['versionId'],M['live_version'])
w=json.loads(json.dumps(live));mn={x['name'] for x in M['nodes']}
for n in w['workflow']['nodes']:
    if n['name'] in mn: n['parameters']['jsCode']=open(os.path.join(H,'merged_DVC',n['name'].replace(' ','_')+'.js')).read()
ov=os.path.join(H,'pkgK','_overlay_DVC.json');json.dump(w,open(ov,'w'))
r=subprocess.run(['python3',os.path.join(H,'pkgK','build_K.py'),ov],capture_output=True,text=True);print(r.stdout[-400:]+r.stderr[-400:])
os.remove(ov);assert 'anchors unique, all parse' in r.stdout
K=json.load(open(os.path.join(H,'pkgK','plan_K.json')));kn={x['name'] for x in K['nodes']}
L={n['name']:n for n in live['workflow']['nodes']};out=os.path.join(H,'merged_DVCK');shutil.rmtree(out,ignore_errors=True);os.makedirs(out)
man={'live_version':live['workflow']['versionId'],'nodes':[]}
for nm in sorted(mn|kn):
    t=open(os.path.join(H,'pkgK','patched',nm.replace(' ','_')+'.js')).read() if nm in kn else open(os.path.join(H,'merged_DVC',nm.replace(' ','_')+'.js')).read()
    open(os.path.join(out,nm.replace(' ','_')+'.js'),'w').write(t)
    man['nodes'].append({'name':nm,'id':L[nm]['id'],'live_sha':sha(L[nm]['parameters']['jsCode']),'final_sha':sha(t),'from':'+'.join([p for p,s in (('D',None),('VC',None),('K',None)) if (p=='K' and nm in kn) or (p!='K' and nm in mn and (next(x['from'] for x in M['nodes'] if x['name']==nm).find(p)>=0))])})
json.dump(man,open(os.path.join(out,'manifest.json'),'w'),indent=1)
print('manifest',len(man['nodes']),'nodes; K-only:',sorted(kn-mn),'; untouched by K:',sorted(mn-kn))
