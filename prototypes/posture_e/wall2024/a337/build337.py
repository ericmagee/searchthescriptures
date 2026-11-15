# ASK 337: drop ", not what it infers" from the 334 placeholder in C2 Build (all four seats agree). Usage: build337.py <base.json> <out.json>
import json,sys
b=json.load(open(sys.argv[1]))
OLD="ASSUMES: <the given fact the step takes for granted, not what it infers> -- ROWS GIVE: <what the rows the defender quotes do give"
NEW="ASSUMES: <the given fact the step takes for granted> -- ROWS GIVE: <what the rows the defender quotes do give"
hits=0
for n in b['nodes']:
    c=n['parameters'].get('jsCode')
    if isinstance(c,str) and OLD in c:
        assert c.count(OLD)==1 and n['name']=='C2 Build'; n['parameters']['jsCode']=c.replace(OLD,NEW); hits+=1
assert hits==1, hits
json.dump(b,open(sys.argv[2],'w')); print('C2 Build edited; delta',len(NEW)-len(OLD))
