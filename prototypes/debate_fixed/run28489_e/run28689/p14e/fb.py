# Fetch-back check: compare every node in final/ with the fetched draft (path given), report md5 and equality.
import json,hashlib,glob,os,sys
d=json.load(open(sys.argv[1]))['workflow'];N={n['name']:n for n in d['nodes']}
print('versionId',d['versionId'][:8],'active',d['activeVersionId'][:8])
ok=0
for f in sorted(glob.glob('final/*.js')):
    nm=os.path.basename(f)[:-3].replace('_',' ');js=N[nm]['parameters']['jsCode'];fin=open(f).read();base=open('base/'+os.path.basename(f)).read()
    st='WRITTEN-OK' if js==fin else ('UNCHANGED' if js==base else 'MISMATCH')
    ok+=js==fin
    print('%-30s %s %s'%(nm,hashlib.md5(js.encode()).hexdigest()[:8],st))
print('equal to final:',ok,'of',len(glob.glob('final/*.js')))
