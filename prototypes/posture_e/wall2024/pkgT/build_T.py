# WALL-2024 alternate shortage fix (W2; W3 ruling 2198 b). Base: live 6b077f9e (683c995f + pkgS 60a15c0). Writes nothing live.
# 1. Alternate Build: guard G4. A pool model already offered to an earlier removed seat is not offered again, so each removed seat gets the
#    next model in the pool (alt_order). Before, every removed seat drew the same first model and Alternate Merge seated it once, so a
#    second removed seat never had an alternate.
# 2. Build Save Body: one review line per removed panel seat that ends with no alternate seated, naming its uncured count and every try.
# usage: python3 build_T.py <live fetch json of 6b077f9e>
import json,sys,os,hashlib
LIVE=sys.argv[1];H=os.path.dirname(os.path.abspath(__file__));sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
W=json.load(open(LIVE))['workflow'];assert W['versionId'].startswith('6b077f9e'),W['versionId']
A="  if(!QA&&pay.some(q=>q.judge_api_model===a.api_model))return 'G3: '+a.api_model+' already sits on this panel';"
A2=A+"\n  if(!QA&&used.indexOf(a.api_model)>=0)return 'G4: '+a.api_model+' is already offered to an earlier removed seat'; // WALL-2024 2198 (b): each removed seat gets the next pool model"
B="const RN=FF.length?FF.join(' '):null;"
B2=("// WALL-2024 2198 (b): a removed panel seat left with no alternate is stated plainly in review_notes.\n"
    "try{if($('Alternate Merge').isExecuted){const AM=$('Alternate Merge').first().json;const sd=new Set((AM.alternates_seated||[]).map(x=>x.removed_seat));const T=AM.alternates_tried||[];const sf=s=>String(s).replace(/[\\[\\]]/g,'').replace(/\\s+/g,' ').trim();\n"
    " const du=s=>{for(const b of (AM.bodies||[])){try{const p=JSON.parse(b).payload;if(p.judge_seat===s)return p.drv_uncured;}catch(e){}}return null;};\n"
    " [...new Set(T.map(x=>x.removed_seat).filter(Boolean))].filter(s=>!sd.has(s)).forEach(s=>{const tr=T.filter(x=>x.removed_seat===s).map(x=>(x.alternate||'no alternate')+(x.api_model?' ('+x.api_model+')':'')+': '+x.result+(x.why?', '+sf(String(x.why).slice(0,200)):''));\n"
    "  FF.push('[AUDIT v36: PANEL SEAT LEFT UNFILLED -- SEAT: '+s+'; drv_uncured '+du(s)+'; no alternate was seated ('+tr.join('; ')+'); this seat is not counted in the panel result. REVIEW THIS ROW.]');});}}catch(e){}\n"
    +B)
EDITS={'Alternate Build':[(A,A2)],'Build Save Body':[(B,B2)]}
out=os.path.join(H,'patched');os.makedirs(out,exist_ok=True);plan={'live_version':W['versionId'],'nodes':[]}
for n in W['nodes']:
    if n['name'] not in EDITS:continue
    c=n['parameters']['jsCode'];t=c
    for a,b in EDITS[n['name']]:
        assert t.count(a)==1,(n['name'],t.count(a));t=t.replace(a,b)
    open(os.path.join(out,n['name'].replace(' ','_')+'.js'),'w').write(t)
    plan['nodes'].append({'name':n['name'],'id':n['id'],'live_sha':sha(c),'final_sha':sha(t)})
json.dump(plan,open(os.path.join(H,'plan_T.json'),'w'),indent=1);print(len(plan['nodes']),'nodes')
