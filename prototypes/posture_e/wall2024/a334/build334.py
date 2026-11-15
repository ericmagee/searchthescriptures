import json
t333=json.load(open('a333/target_333.json')); t335=json.load(open('a335/target_335.json'))
base=json.load(open('rdf/fetchback_s221_329.json'))
# cumulative base: 333 (C2 Build) + 335 (Init with Guards)
cum=json.loads(json.dumps(t333))
for i,n in enumerate(cum['nodes']):
    if n['name']=='Init with Guards': cum['nodes'][i]=json.loads(json.dumps([x for x in t335['nodes'] if x['name']=='Init with Guards'][0]))
json.dump(cum,open('a334/base_333_335.json','w'))
t=json.loads(json.dumps(cum))
# 334a: C2 round-2 premise form
A_OLD="and the premise may charge only what that quote says. After the quote, write PRESSED WITH:"
A_NEW=("and the premise may charge only what that quote says. If the premise charges a fact about a person, house, time or act that the quoted words take as given and no quoted row gives (CHARGE THE ASSUMPTION), write after the quote, on its own line before PRESSED WITH:, "
 "STEP: <the step of the defender\\'s link> -- ASSUMES: <the given fact the step takes for granted, not what it infers> -- ROWS GIVE: <what the rows the defender quotes do give, quoted with book, chapter and verse>. "
 "Write that line only for such a premise; it carries none of the words no, not, none, never, only, without, alone, every or no other. After the quote, write PRESSED WITH:")
c2=[n for n in t['nodes'] if n['name']=='C2 Build'][0]
s=c2['parameters']['jsCode']; assert s.count(A_OLD)==1; c2['parameters']['jsCode']=s.replace(A_OLD,A_NEW)
# 334b: system prompt CHARGE THE ASSUMPTION to ruling 460 three-part form
B_OLD="write the charge in the positive form only: ASSUMES: <the fact the quoted words take as given> -- ROWS GIVE:"
B_NEW="write the charge in the positive form only: STEP: <the step of your opponent\\'s link> -- ASSUMES: <the fact the quoted words take as given> -- ROWS GIVE:"
iw=[n for n in t['nodes'] if n['name']=='Init with Guards'][0]
s=iw['parameters']['jsCode']; assert s.count(B_OLD)==1; iw['parameters']['jsCode']=s.replace(B_OLD,B_NEW)
json.dump(t,open('a334/target_334_cum.json','w'))
for a,b in zip(cum['nodes'],t['nodes']):
    if a!=b: print('vs 333+335 changed:',a['name'],len(a['parameters']['jsCode']),'->',len(b['parameters']['jsCode']))
for a,b in zip(base['nodes'],t['nodes']):
    if a!=b: print('vs live changed:',a['name'])
print('connections same',base['connections']==t['connections'])
for nm in ('C2 Build','Init with Guards'):
    open('a334/'+nm.replace(' ','_')+'.js','w').write('async function f(){'+[n for n in t['nodes'] if n['name']==nm][0]['parameters']['jsCode']+'\n}')
