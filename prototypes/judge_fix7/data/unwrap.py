# unwrap.py: turns a saved execute_sql result file (the tool's text envelope) into the JSON it holds. Usage: unwrap.py <saved> <out.json> [column]
import json,sys,re
t=open(sys.argv[1]).read()
try: t=json.loads(t)['result'] if t.lstrip().startswith('{') else t
except Exception: pass
if isinstance(t,list): t=t[0]['text']
if isinstance(t,dict): t=t.get('result',t)
a=t.index('\n<untrusted-data-');a=t.index('>',a)+1;b=t.rindex('</untrusted-data-')
rows=json.loads(t[a:b].strip())
col=sys.argv[3] if len(sys.argv)>3 else None
out=[json.loads(r[col]) if isinstance(r[col],str) else r[col] for r in rows] if col else rows
if col and len(out)==1: out=out[0]
json.dump(out,open(sys.argv[2],'w'),ensure_ascii=False,indent=1);print('ok',type(out).__name__,len(out))
