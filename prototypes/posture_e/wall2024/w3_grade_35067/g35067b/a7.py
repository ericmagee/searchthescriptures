import json,pickle,re,difflib
T=pickle.load(open('T.pkl','rb'))
db={k:json.load(open(f'db_{t}.json')) for k,t in [('n','35067'),('o','34852')]}
bsb={k:T['Build Save Body'][k][0][0] for k in 'no'}
for k in 'no':
    a=bsb[k]['synthesis'];b=db[k]['synthesis']
    print(k,len(a),len(b),a==b)
    if a!=b:
        sm=difflib.SequenceMatcher(None,a,b,autojunk=False)
        for op in sm.get_opcodes():
            if op[0]!='equal': print(op, repr(a[op[1]:op[2]][:300]), '=>', repr(b[op[3]:op[4]][:900]))
