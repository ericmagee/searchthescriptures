import sys,re
def chk(path,label):
    t=open(path).read(); top=t.split('## What the judges were sent')[0]; s8=t.split('## What the judges were sent')[1] if '## What the judges were sent' in t else ''
    r={}
    r['F10.1 no SECOND OPINION']= 'SECOND OPINION' not in t
    r['F10.1 no "single judge" above s8']= not re.search(r'single judge',top,re.I)
    r['F10.2 no Diagnostic section']= '## Diagnostic' not in t and 'ORACLE_DEBATE_V1 BROKEN DIAGNOSTIC' not in t
    r['F10.3 no Single judge rows']= 'Single judge:' not in t
    r['F10.4 s8 no single-judge text']= not re.search(r'single judge',s8,re.I)
    r['F10.5 reasons on 3 seats']= len(re.findall(r'^- Panel judge \d: .*\. Reason: ',top,re.M))==3
    r['F13a.1 panel texts printed']= all(('panel judge %d'%i) in s8 for i in (1,2,3))
    r['F13a.2 no Panel Build read error']= 'Panel Build:' not in t
    r['Debate complete line']= '*Debate complete.*' in t
    print(label, sum(r.values()),'/',len(r)); [print('  ',('PASS' if v else 'FAIL'),k) for k,v in r.items()]
chk(sys.argv[1],'base'); chk(sys.argv[2],'new')
