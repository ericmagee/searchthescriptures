# Unpacks a saved execute_sql result (json_agg of runs) into data/run<N>.json
import json,re,sys
s=json.load(open(sys.argv[1]))['result']
a=s.index('\n[{');b=s.rindex('}]')+2
rows=json.loads(s[a:b])
for r in rows[0]['json_agg']:
    n=re.match(r'ODV1-(\d+)',r['run_token']).group(1)
    json.dump(r,open(f'data/run{n}.json','w'))
    print(n,{k:(len(v) if isinstance(v,(str,list)) else v) for k,v in r.items() if k!='judgments'},[ (j['seat'],len(j['verdict_raw'])) for j in r['judgments']])
