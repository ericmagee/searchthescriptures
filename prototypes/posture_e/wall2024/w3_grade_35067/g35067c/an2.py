import json,re
from collections import OrderedDict,Counter
from cmp import parse,load
row=json.load(open('row_clean.json'))
ROUND={'CR1':'claude_r1','CR2':'claude_r2','CR3':'engine_r3','CR4':'defender_r4','DR1':'engine_r1','DR2':'engine_r2','DR3':'challenger_r3','DR4':'challenger_r4'}
V={}
for v in ['127','128','129','130']:
    calls,items=parse(v); V[v]=(calls,items)
def nm(t): return re.sub(r'\n\s*\n','\n',t).strip()
def strip(t):
    t=re.sub(r"THE ANSWER IN FULL, FROM .*?(?=\nTHE SIDE'S OTHER LINES|\nTHE JUDGES' GRADES:)",'',t,flags=re.S)
    t=re.sub(r"\nTHE SIDE'S OTHER LINES ON THIS VERSE .*?(?=\nTHE JUDGES' GRADES:)",'',t,flags=re.S)
    return nm(t)
def stripother(t): return re.sub(r"\nTHE SIDE'S OTHER LINES ON THIS VERSE .*?(?=\nTHE JUDGES' GRADES:)",'',t,flags=re.S)
def ids(v): return [y for c in V[v][0] for y in c['ids']]
out=[]
P=out.append
# compare grade lists
for a,b in [('127','128'),('128','129'),('129','130'),('128','130'),('127','130')]:
    ia=ids(a);ib=ids(b)
    ka={y['id']:y for y in ia};kb={y['id']:y for y in ib}
    miss=[k for k in ka if k not in kb]; add=[k for k in kb if k not in ka]
    chg=[k for k in ka if k in kb and any(ka[k][f]!=kb[k][f] for f in ('rule','seat','grade','item','flagged_line','response_line'))]
    P('GRADES %s->%s: ids %d vs %d; missing %s; added %s; changed(rule/seat/grade/item/flagged/response) %s'%(a,b,len(ia),len(ib),miss,add,chg))
    ea=V[a][1];eb=V[b][1]
    keys=list(ea.keys())
    mi=[k for k in keys if k not in eb]; ad=[k for k in eb if k not in ea]
    full_lost=[k for k in keys if ea[k]['rule']=='E-ANS' and ea[k]['full'] and k in eb and not eb[k]['full']]
    full_gain=[k for k in keys if (not ea[k]['full']) and k in eb and eb[k]['full'] and ea[k]['rule']=='E-ANS']
    s_eq=[k for k in keys if k in eb and ((ea[k]['rule']=='E-ANS' and strip(ea[k]['text'])!=strip(eb[k]['text'])) or (ea[k]['rule']!='E-ANS' and nm(ea[k]['text'])!=nm(eb[k]['text'])))]
    P('ITEMS %s->%s: items %d vs %d; missing %s; added %s; FULL lost %s; FULL gained %d; items differing outside FULL/OTHER sections: %s'%(a,b,len(ea),len(eb),mi,ad,full_lost,len(full_gain),s_eq))
    # full text equal?
    fe=[k for k in keys if ea[k]['rule']=='E-ANS' and k in eb and ea[k]['full'] and eb[k]['full'] and re.search(r"THE ANSWER IN FULL.*?(?=\nTHE SIDE'S OTHER|\nTHE JUDGES' GRADES:)",ea[k]['text'],re.S).group(0)!=re.search(r"THE ANSWER IN FULL.*?(?=\nTHE SIDE'S OTHER|\nTHE JUDGES' GRADES:)",eb[k]['text'],re.S).group(0)]
    P('   FULL blocks present in both but differing: %s'%fe)
    # byte-equal items
    eq=[k for k in keys if k in eb and nm(ea[k]['text'])==nm(eb[k]['text'])]
    P('   E-ANS items byte-equal %d of %d'%(len([k for k in eq if ea[k]['rule']=="E-ANS"]),len([k for k in keys if ea[k]['rule']=="E-ANS"])))
    P('   items byte-equal %d of %d'%(len(eq),len(keys)))
print('\n'.join(out))
json.dump({v:{k:{kk:vv for kk,vv in x.items() if kk!='text'} for k,x in V[v][1].items()} for v in V},open('items_meta.json','w'))
