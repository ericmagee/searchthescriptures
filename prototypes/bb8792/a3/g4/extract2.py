# extract2.py <saved execution file>: as extract.py, and reports an error on any node.
import json,sys
d=json.load(open(sys.argv[1])); rdd=d['data']['resultData']; rd=rdd['runData']
inn=[k for k in rd if k.startswith('Relay In')]
tag=rd[inn[0]][0]['data']['main'][0][0]['json']['body'].get('tag','untagged') if inn else '?'
call=[k for k in rd if k.startswith('Call')]
if not call or rd[call[0]][0].get('error'):
    e=(rd[call[0]][0].get('error') if call else rdd.get('error')) or {}
    print(tag,d['execution']['id'],'ERROR',str(e.get('message'))[:160],'|',str(e.get('description'))[:200]); sys.exit()
j=rd[call[0]][0]['data']['main'][0][0]['json']; ch=j['choices'][0]; c=ch['message'].get('content') or ''
open(f'out/{tag}.txt','w').write(c)
print(tag,d['execution']['id'],j.get('model'),ch.get('finish_reason'),(j.get('usage') or {}).get('completion_tokens'),len(c))
