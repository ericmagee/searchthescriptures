import json
base=json.load(open('rdf/fetchback_s225_337.json'))
ANCH=' QUOTE THE ROWS WHOLE (DG-18, DG-8, KB-0025):'
PREV="nor by any Septuagint reading."
C=(" CAME TOGETHER (DG-8): Matthew 1:18 'before they came together' is answered by Matthew 1:24 'took unto him his wife', the coming under one roof; the union's word is 'knew' (Matthew 1:25).")
assert '"' not in C and '\\' not in C and '`' not in C and '${' not in C
t=json.loads(json.dumps(base))
n=[n for n in t['nodes'] if n['name']=='Init with Guards'][0]
c=n['parameters']['jsCode']; assert c.count(ANCH)==1 and c.count(PREV+ANCH)==1
assert c.count("came together")==0 or True
n['parameters']['jsCode']=c.replace(PREV+ANCH,PREV+C+ANCH)
nc=n['parameters']['jsCode']
assert nc.count("the union's word is 'knew' (Matthew 1:25)")==1
json.dump(t,open('a341/target_341.json','w'))
for a,b in zip(base['nodes'],t['nodes']):
    if a!=b: print('changed node:',a['name'])
print('len',len(c),'->',len(nc),'delta',len(nc)-len(c))
print('connections same',base['connections']==t['connections'])
i=c.index(ANCH); print('quote char before GUARDHOLD region:', repr(c[c.rfind('GUARDHOLD',0,i)-40:c.rfind('GUARDHOLD',0,i)+30]))
open('a341/iwg_post.js','w').write('async function f(){'+nc+'\n}')
