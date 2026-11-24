# ASK 583 step 6.4: Daily Drive Sync reads rpc/engine_manual_full and refuses a hollow text. Usage: build584sync.py <base.json> <target.json>
import json,sys
d=json.load(open(sys.argv[1])); N={n['name']:n for n in d['nodes']}
OLD_URL="https://bhffmkginddovmdcpnty.supabase.co/rest/v1/engine_manual?select=version,content&order=version.desc&limit=1"
NEW_URL="https://bhffmkginddovmdcpnty.supabase.co/rest/v1/rpc/engine_manual_full"
f=N['Fetch Engine Manual']['parameters']; assert f['url']==OLD_URL and f['method']=='GET'; f['url']=NEW_URL
b=N['Build Engine Manual']['parameters']
OLD="const r=$input.first().json;const rows=Array.isArray(r)?r:$input.all().map(i=>i.json);const row=rows[0];return [{json:"
NEW=("const r=$input.first().json;const rows=Array.isArray(r)?r:$input.all().map(i=>i.json);const row=rows[0];"
     "const FLOOR=100000;const len=row&&typeof row.content==='string'?row.content.length:0;"
     "if(len<FLOOR||!(Number(row&&row.version)>0)){throw new Error('ANTI-HOLLOW: engine manual fetch returned '+len+' chars (version '+(row&&row.version)+'); it needs a version and at least '+FLOOR+' chars - mirror push blocked');}"
     "return [{json:")
assert b['jsCode'].count(OLD)==1; b['jsCode']=b['jsCode'].replace(OLD,NEW)
json.dump({k:d[k] for k in ('name','nodes','connections','settings')}, open(sys.argv[2],'w'), ensure_ascii=False)
