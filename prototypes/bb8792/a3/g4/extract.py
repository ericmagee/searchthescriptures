# extract.py <saved execution file>: writes the judge reply to out/<tag>.txt from a pass-through branch execution record.
import json,sys
d=json.load(open(sys.argv[1])); rd=d['data']['resultData']['runData']
inn=[k for k in rd if k.startswith('Relay In')][0]; call=[k for k in rd if k.startswith('Call')][0]
tag=rd[inn][0]['data']['main'][0][0]['json']['body'].get('tag','untagged')
run=rd[call][0]
if run.get('error'): print(tag,d['execution']['id'],'ERROR',str(run['error'].get('message'))[:200]); sys.exit()
j=run['data']['main'][0][0]['json']; ch=j['choices'][0]; c=ch['message'].get('content') or ''
open(f'out/{tag}.txt','w').write(c)
print(tag,d['execution']['id'],j.get('model'),ch.get('finish_reason'),(j.get('usage') or {}).get('completion_tokens'),len(c))
