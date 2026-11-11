import json,re
from collections import OrderedDict
def load(v):
    return json.load(open('rb_%s_Judge_Enforcer_Build.json'%v))
def parse(v):
    calls=load(v); items=OrderedDict(); 
    for ci,c in enumerate(calls):
        u=c['body']['messages'][1]['content']
        # split items
        parts=re.split(r'\n(?=ITEM [A-Z]\d+ \()',u)
        for p in parts[1:]:
            m=re.match(r'ITEM ([A-Z]\d+) \(([^;)]*)',p)
            iid,rule=m.group(1),m.group(2)
            items[(iid)]=dict(call=ci+1,rule=rule,text=p,full='THE ANSWER IN FULL' in p,other="THE SIDE'S OTHER LINES ON THIS VERSE" in p,len=len(p))
    return calls,items
if __name__=='__main__':
    for v in ['127','128','129','130']:
        calls,items=parse(v)
        ea=[k for k,x in items.items() if x['rule']=='E-ANS']
        print(v,'calls',len(calls),'sizes',[len(c['body']['messages'][1]['content']) for c in calls],'items(all rules)',len(items),'E-ANS items',len(ea),'FULL',sum(items[k]['full'] for k in ea),'OTHER',sum(items[k]['other'] for k in ea),'ids grades',sum(len(c['ids']) for c in calls if True))
