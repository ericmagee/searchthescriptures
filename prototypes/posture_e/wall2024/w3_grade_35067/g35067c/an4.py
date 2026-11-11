import json,re,sys,io
_o=sys.stdout; sys.stdout=io.StringIO()
from an3 import V,EA,sections,row,st
sys.stdout=_o
S='and also the block the answer points to'
for v in ['127','128','129','130']:
    calls=V[v][0]
    print(v,[ (i+1, S in c['body']['messages'][1]['content'], 'RULE E-ANS' in c['body']['messages'][1]['content'], c['body']['messages'][0]['content'].count(S)) for i,c in enumerate(calls)], 'sum user',sum(len(c['body']['messages'][1]['content']) for c in calls),'sum sys',sum(len(c['body']['messages'][0]['content']) for c in calls),'max user',max(len(c['body']['messages'][1]['content']) for c in calls))
    its=V[v][1]
    print('   FULL in non-E-ANS items',sum(1 for x in its.values() if x['rule']!='E-ANS' and x['full']), Counter if False else '')
# sizes for other items: E-ANS rule-block length diff
a=V['128'][0][0]['body']['messages'][1]['content'];b=V['130'][0][0]['body']['messages'][1]['content']
i=a.find('RULE E-ANS');j=b.find('RULE E-ANS');print(a[i:i+60]);
ra=a[i:a.find('\nRULE E-VOID')];rb=b[j:b.find('\nRULE E-VOID')];print(len(ra),len(rb),len(rb)-len(ra))
import difflib
sm=difflib.SequenceMatcher(None,ra,rb)
for op in sm.get_opcodes():
    if op[0]!='equal': print(op[0],repr(ra[op[1]:op[2]]),'=>',repr(rb[op[3]:op[4]]))
# other-section total chars
tot=sum(len(x['other'])+len("THE SIDE'S OTHER LINES ON THIS VERSE (the block the answer points to, and its later rounds that name the pressed verse): \"\"\n") for x in EA.values() if x['other'])
print('OTHER chars',tot,'sections',sum(1 for x in EA.values() if x['other']))
print('sum diff 128->130 user', sum(len(c['body']['messages'][1]['content']) for c in V['130'][0])-sum(len(c['body']['messages'][1]['content']) for c in V['128'][0]))
