import sys,pickle,json
sys.path.insert(0,'.')
from strc import *
T=pickle.load(open('T.pkl','rb'))
db={k:json.load(open(f'db_{t}.json')) for k,t in [('n','35067'),('o','34852')]}
bsb={k:T['Build Save Body'][k][0][0] for k in 'no'}
fm={k:T['Format Markdown'][k][0][0] for k in 'no'}
texts={'DB synthesis (debate_results.synthesis)':(db['n']['synthesis'],db['o']['synthesis']),
 'Build Save Body diagnostic':(bsb['n']['diagnostic'],bsb['o']['diagnostic']),
 'Build Save Body synthesis field':(bsb['n']['synthesis'],bsb['o']['synthesis']),
 'Build Save Body saveBody (JSON string?)':(None,None),
 'Format Markdown md':(fm['n']['md'],fm['o']['md'])}
print({k:type(bsb['n'][k]).__name__ for k in ['saveBody','diagnostic','requestBody','verdictBody','audit_flags','enforcer_log']})
out=[]
for name,(a,b) in texts.items():
    if a is None: continue
    out.append(f'### {name}: new {len(a)} chars, old {len(b)} chars')
    ha,ta,la=structure(a);hb,tb,lb=structure(b)
    cmp(ha,hb,'headings',out);cmp(ta,tb,'table header rows',out);cmp(la,lb,'labelled lines (label before colon, plus [AUDIT ..] and **ENGINE: ..** tags)',out)
open('struct_out.txt','w').write('\n'.join(out))
print('\n'.join(out)[:9000])
