import json,re,sys
D='/root/.claude/projects/-home-user-searchthescriptures/58ba9d31-f07a-5e6e-a230-4fe44a036213/tool-results/'
out=[]
for f in ['1792476299539','1792476303643','1792476304931','1792476305751']:
    s=json.load(open(D+'mcp-supbase-fix-execute_sql-'+f+'.txt'))['result']
    m=re.search(r'<untrusted-data-[0-9a-f-]+>\n(.*)\n</untrusted-data',s,re.S)
    out+=json.loads(m.group(1))[0]['json_agg']
seen=set();runs=[]
for r in out:
    if r['tok'] in seen: continue
    seen.add(r['tok']);runs.append(r)
json.dump(runs,open('runs.json','w'))
print(len(out),len(runs),[r['tok'] for r in runs][:3])
