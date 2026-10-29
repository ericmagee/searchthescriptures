# Step 9 verify: published version dfa2da34 against final/ (20 nodes) and against c1bdcd5a (all other nodes, connections).
import json,hashlib,glob,os
D=json.load(open('p9/details.json'))['workflow']
print('details versionId',D['versionId'][:8],'activeVersionId',D['activeVersionId'][:8],'active',D['active'])
P=json.load(open('p9/v_dfa2da34.json'));B=json.load(open('p9/v_c1bdcd5a.json'))
print('fetched versions',P['versionId'][:8],B['versionId'][:8])
NP={n['name']:n for n in P['nodes']};NB={n['name']:n for n in B['nodes']};ND={n['name']:n for n in D['nodes']}
print('node counts',len(P['nodes']),len(B['nodes']),len(D['nodes']),'names equal',set(NP)==set(NB)==set(ND))
fin={os.path.basename(f)[:-3].replace('_',' '):open(f).read() for f in glob.glob('final/*.js')}
ok=0
for nm in sorted(fin):
    js=NP[nm]['parameters']['jsCode'];e=js==fin[nm];ok+=e
    print('%-30s %s %s'%(nm,hashlib.md5(js.encode()).hexdigest()[:8],'EQUAL' if e else 'MISMATCH'))
print('published equal to final:',ok,'of',len(fin))
def strip(n):
    n=json.loads(json.dumps(n));n['parameters'].pop('jsCode',None);return n
diff=[nm for nm in NP if json.dumps(NP[nm],sort_keys=True)!=json.dumps(NB[nm],sort_keys=True)]
print('nodes differing from c1bdcd5a:',len(diff),'all in final/:',set(diff)==set(fin))
print('differ outside jsCode:',[nm for nm in diff if json.dumps(strip(NP[nm]),sort_keys=True)!=json.dumps(strip(NB[nm]),sort_keys=True)])
print('connections equal to c1bdcd5a:',json.dumps(P['connections'],sort_keys=True)==json.dumps(B['connections'],sort_keys=True))
print('draft == published (all nodes):',all(json.dumps(ND[n],sort_keys=True)==json.dumps(NP[n],sort_keys=True) for n in NP))
cr="on the line itself or on the line directly under it,"
print('CURE_RULE new sentence nodes:',sum(cr in (n['parameters'].get('jsCode') or '') for n in P['nodes']))
print('old sentence left:',sum('exhibit, on the line itself, at least two lower layers' in (n['parameters'].get('jsCode') or '') for n in P['nodes']))
