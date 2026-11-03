# get_live.py (judge_fix9): one GET of ORACLE_DEBATE_V1 into data/workflow_live.json and data/live_code/<node>.js. Read-only. N8N_API_KEY never printed.
import json,os,sys,urllib.request
KEY=os.environ.get('N8N_API_KEY') or sys.exit('N8N_API_KEY not set')
H=os.path.dirname(os.path.abspath(__file__))
r=urllib.request.Request('https://truthapp.app.n8n.cloud/api/v1/workflows/moMxiV4Irg1uRBZN',method='GET',headers={'X-N8N-API-KEY':KEY,'Accept':'application/json'})
wf=json.load(urllib.request.urlopen(r,timeout=120))
json.dump(wf,open(H+'/workflow_live.json','w'),ensure_ascii=False)
n=0
for x in wf['nodes']:
    c=x.get('parameters',{}).get('jsCode')
    if isinstance(c,str): open(f"{H}/live_code/{x['name'].replace('/','_')}.js",'w').write(c);n+=1
print('versionId',wf.get('versionId'),'updatedAt',wf.get('updatedAt'),'nodes',len(wf['nodes']),'code nodes',n)
