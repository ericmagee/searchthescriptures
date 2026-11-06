# WALL-2024 silence count (W2, on Eric's instruction 2026-11-05 21:18 CST; scope WALL-2024 reply 2185). Writes nothing live.
# A cure item of ANY rule, TRIAL included, that gets NO WRITTEN RESPONSE counts in drv_uncured like a LIVE item.
# "No written response" is decided where the engine decides it: cureVerdicts' branch for an item with no RESPONSE line (respOf null),
# after a cure reply arrived. The item is flagged silent:true there, unless the judge wrote a refused (malformed) line for that item,
# which is a written response that fails the form (W1, reply after 2185). No cure_reason text is read.
# Not silence: a failed or absent cure call, a written response that fails its rule's form (TRIAL stays recorded), NOT HELD with a reason.
# usage: python3 build_S.py <live fetch json of 683c995f>
import json,sys,os,hashlib
LIVE=sys.argv[1];H=os.path.dirname(os.path.abspath(__file__));sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
live=json.load(open(LIVE));W=live['workflow'];assert W['versionId'].startswith('683c995f'),W['versionId']
A="const enfUncured=v=>(v||[]).filter(x=>x&&x.status!=='CURED'&&enfLive(x)).length;"
A2=("// WALL-2024 silence count (Eric 2026-11-05 21:18 CST, reply 2185): an item of ANY rule, TRIAL included, with NO WRITTEN RESPONSE (flagged silent by\n"
    "// cureVerdicts) counts in drv_uncured like a LIVE item, so it removes a panel seat and keeps an alternate from being seated. A written response\n"
    "// that fails a TRIAL rule's form is still recorded only.\n"
    "const enfSilent=x=>!!(x&&x.silent===true);\n"
    "const enfUncured=v=>(v||[]).filter(x=>x&&x.status!=='CURED'&&(enfLive(x)||enfSilent(x))).length;")
B="const enfTrialWhy=(x,why)=>enfLive(x)?why:'TRIAL rule (recorded and answered; it removes no seat)'+(why?': '+why:'');"
B2="const enfTrialWhy=(x,why)=>enfLive(x)?why:(enfSilent(x)?'TRIAL rule, NO WRITTEN RESPONSE: counts in drv_uncured like a LIVE item (silence count)':'TRIAL rule (recorded and answered; it removes no seat)')+(why?': '+why:'');"
C="  if(!respOf(x))return res('UNCURED','no written response',null);"
C2="  if(!respOf(x)){const z=res('UNCURED','no written response',null);z.silent=!o.malformed.find(l=>cureOwn(l,x));return z;} // WALL-2024 silence count: silent unless the judge wrote a refused line for this item"
EDITS=[(A,A2),(B,B2),(C,C2)]
out=os.path.join(H,'patched');os.makedirs(out,exist_ok=True);plan={'live_version':W['versionId'],'nodes':[]}
for n in W['nodes']:
    c=(n.get('parameters') or {}).get('jsCode') or ''
    if A not in c:continue
    t=c;done=[]
    for a,b in EDITS:
        k=t.count(a)
        if a==C and k==0:continue  # Extract Independent Verdict, Panel Payloads, Alternate Payloads hold no cureVerdicts
        assert k==1,(n['name'],a[:40],k);t=t.replace(a,b);done.append(a[:24])
    open(os.path.join(out,n['name'].replace(' ','_')+'.js'),'w').write(t)
    plan['nodes'].append({'name':n['name'],'id':n['id'],'live_sha':sha(c),'final_sha':sha(t),'edits':len(done)})
json.dump(plan,open(os.path.join(H,'plan_S.json'),'w'),indent=1)
print(len(plan['nodes']),'nodes;',sum(x['edits']==3 for x in plan['nodes']),'with cureVerdicts')
