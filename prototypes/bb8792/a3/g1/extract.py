# extract.py <saved execution file>: writes the judge reply to deepseek/out/<tag>.txt from an n8n execution record.
import json,sys
d=json.load(open(sys.argv[1])); rd=d['data']['resultData']['runData']
tag=rd['Relay In'][0]['data']['main'][0][0]['json']['body'].get('tag','untagged')
j=rd['Call DeepSeek'][0]['data']['main'][0][0]['json']; ch=j['choices'][0]
c=ch['message'].get('content') or ''
open(f'deepseek/out/{tag}.txt','w').write(c)
print(tag, d['execution']['id'], ch['finish_reason'], j['usage']['completion_tokens'], len(c))
