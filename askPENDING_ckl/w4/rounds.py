import re,json,subprocess,urllib.parse
src=open('/mnt/project-files/ask534/w4/replay/fallback534.cjs').read()
K=re.search(r"const K='([^']+)'",src).group(1)
U='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/'
def get(q):
    return json.loads(subprocess.run(['curl','-s',U+q,'-H','apikey: '+K,'-H','Authorization: Bearer '+K],capture_output=True).stdout)
toks=['ODV1-41736-qtw0w6t1','ODV1-40891-umeouul3','ODV1-41024-2wbmceb5','ODV1-41102-8tdxwzkn','ODV1-41117-2xbwme8t','ODV1-40995-inaaza3z']
res={}
for t in toks:
    d=get('debate_results?select=run_token,claude_r1,claude_r2,engine_r3,defender_r4,engine_r1,engine_r2,challenger_r3,challenger_r4&run_token=eq.'+urllib.parse.quote(t))
    res[t]=d[0] if isinstance(d,list) and d else d
json.dump(res,open('rounds.json','w'))
print({t:(type(v).__name__, len(json.dumps(v))) for t,v in res.items()})
