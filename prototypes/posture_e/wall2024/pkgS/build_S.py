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

# W3 grade 2192 (1): the single judge (Cure Check). Its drv_uncured is computed the same way (LIVE uncured plus silent), stored in its output
# and in its own record text (independent_verdict_raw), and its silent items are named in one REVIEW line, which Build Save Body copies into
# review_notes. It has no alternate, so no seat is removed and its verdict path does not change.
D="const cc=cureCorrected(r?r.reply:null,v);\nconst cs=cureSet(r?r.reply:null,v);const B2="
D2=("const __drvU=enfUncured(v);const __sil=v.filter(x=>x&&x.status!=='CURED'&&enfSilent(x)); /* WALL-2024 silence count, single judge (W3 2192) */\n"
    "const __silL=__sil.length?['[AUDIT v35: SINGLE JUDGE SILENCE COUNT -- drv_uncured '+__drvU+'; NO WRITTEN RESPONSE on '+__sil.length+' item'+(__sil.length===1?'':'s')+': '+cureSafe(__sil.map(x=>x.rule+' '+(x.rule==='K-G3'?x.side+' STANDING':x.link)).join(', '))+'; the single judge has no alternate, so no seat is removed and no verdict changes. REVIEW THIS ROW.]']:[];\n"
    +D)
E=".concat(RC?[RC.audit]:[]).join('\\n'),base.verdict_tag"
E2=".concat(RC?[RC.audit]:[]).concat(__silL).join('\\n'),base.verdict_tag"
F="debate_rule_report:v.map(x=>({rule:x.rule"
F2="drv_uncured:__drvU,debate_rule_report:v.map(x=>({rule:x.rule"
# W3 grade 2192 (2): the cure prompt states the rule (S7). W3's sentence verbatim, then where NOT HELD is written so the engine reads it.
SENT=("An item you leave without a RESPONSE line counts against your seat, under every rule, as an unanswered item of a live rule does, and your seat may be replaced. "
      "If you hold an item wrong, write NOT HELD with your reason. That is an answer. Write it on that item's RESPONSE line: RESPONSE: <the flagged item, as labelled above> | NOT HELD: <your reason>.")
G='Any other text is recorded only.";'
G2='Any other text is recorded only. '+SENT+'";'
EDITS=[(A,A2),(B,B2),(C,C2),(G,G2)]
CC=[(D,D2),(E,E2),(F,F2)]
out=os.path.join(H,'patched');os.makedirs(out,exist_ok=True);plan={'live_version':W['versionId'],'nodes':[]}
for n in W['nodes']:
    c=(n.get('parameters') or {}).get('jsCode') or ''
    if A not in c:continue
    t=c;done=[]
    for a,b in EDITS:
        k=t.count(a)
        if a in (C,G) and k==0:continue  # Extract Independent Verdict, Panel Payloads, Alternate Payloads hold no cureVerdicts and no CURE_FORM
        assert k==1,(n['name'],a[:40],k);t=t.replace(a,b);done.append(a[:24])
    if n['name']=='Cure Check':
        for a,b in CC:
            k=t.count(a);assert k==1,('Cure Check',a[:40],k);t=t.replace(a,b);done.append(a[:24])
    open(os.path.join(out,n['name'].replace(' ','_')+'.js'),'w').write(t)
    plan['nodes'].append({'name':n['name'],'id':n['id'],'live_sha':sha(c),'final_sha':sha(t),'edits':len(done)})
json.dump(plan,open(os.path.join(H,'plan_S.json'),'w'),indent=1)
print(len(plan['nodes']),'nodes; edits per node:',{x['name']:x['edits'] for x in plan['nodes']})
