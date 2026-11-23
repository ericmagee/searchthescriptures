import re,json,subprocess,urllib.parse
src=open('/mnt/project-files/ask534/w4/replay/fallback534.cjs').read()
K=re.search(r"const K='([^']+)'",src).group(1)
U='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/'
toks=sorted(set(x['t'] for x in json.load(open('rows_all.json'))))
res={}
for t in toks:
    q='debate_results?select=run_token,claude_r1,claude_r2,engine_r3,defender_r4,engine_r1,engine_r2,challenger_r3,challenger_r4&run_token=eq.'+urllib.parse.quote(t)
    d=json.loads(subprocess.run(['curl','-s',U+q,'-H','apikey: '+K,'-H','Authorization: Bearer '+K],capture_output=True).stdout)
    res[t]=d[0] if isinstance(d,list) and d else None
json.dump(res,open('rounds_all.json','w'))
for t,v in res.items(): print(t, None if v is None else {k:(len(v[k]) if v[k] else 0) for k in v if k!='run_token'})
