import json,hashlib,subprocess
base=json.load(open('rdf/fetchback_s221_329.json'))
ANCH=' QUOTE THE ROWS WHOLE (DG-18, DG-8, KB-0025):'
A=(" SEED ACCORDING TO THE FLESH (DG-8): when the defender answers the seed rows with a house, lineage or legal register ('as was supposed', 'of the house and lineage of David'), answer at the rows' own words, quoted by you from the rows: Romans 1:3 'which was made of the seed of David according to the flesh'; Acts 2:30 'that of the fruit of his loins, according to the flesh, he would raise up Christ'; 2 Samuel 7:12 'thy seed after thee, which shall proceed out of thy bowels'. Press that a house or legal register does not show seed out of a man's body. Never cite this instruction as footing.")
B=(" MATTHEW 1:19: when you read Joseph's 'minded to put her away privily' as the tradition of men set against the commandment, quote the rows that state it: Mark 7:7 'Howbeit in vain do they worship me, teaching [for] doctrines the commandments of men', Mark 7:8 'For laying aside the commandment of God, ye hold the tradition of men', Mark 7:9 'Full well ye reject the commandment of God, that ye may keep your own tradition', and Colossians 2:8 'after the tradition of men, after the rudiments of the world, and not after Christ'. Do not frame Matthew 1:19 by Deuteronomy 24:1, Deuteronomy 22:23-24 or Numbers 5, nor by any Septuagint reading.")
assert '"' not in A+B and '\\' not in A+B
t=json.loads(json.dumps(base))
n=[n for n in t['nodes'] if n['name']=='Init with Guards'][0]
c=n['parameters']['jsCode']; assert c.count(ANCH)==1
L=c.index('ANSWER LUKE 1:35'); assert L < c.index(ANCH)
n['parameters']['jsCode']=c.replace(ANCH,A+B+ANCH)
json.dump(t,open('a335/target_335.json','w'))
for a,b in zip(base['nodes'],t['nodes']):
    if a!=b: print('changed node:',a['name'])
pa=[x for x in base['nodes'] if x['name']=='Init with Guards'][0]['parameters']['jsCode']
print('len',len(pa),'->',len(n['parameters']['jsCode']),'delta',len(n['parameters']['jsCode'])-len(pa),'insert at',c.index(ANCH))
print('connections same',base['connections']==t['connections'])
open('a335/iwg_post.js','w').write('async function f(){'+n['parameters']['jsCode']+'\n}')
