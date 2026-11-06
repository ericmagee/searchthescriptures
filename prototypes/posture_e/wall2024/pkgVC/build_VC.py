# WALL-2024 Parts 1 and 2 (W2), built from a live fetch (argv[1]). Writes nothing live. Def: WALL-2024 2153 (W3 agreed 2154).
import json,sys,hashlib,subprocess,os
D=os.path.dirname(os.path.abspath(__file__))
live=json.load(open(sys.argv[1]))['workflow'];sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
SL=open(os.path.join(D,'vc_slice.js')).read().strip('\n');PASS=open(os.path.join(D,'vc_pass.js')).read().strip('\n')
PP=[("const bodies=[];const summary=[];","const __VCW=[];\n"+SL+"\nconst bodies=[];const summary=[];"),
 ("const offKey=v.reasoning==null&&v.reason!=null;const WT=offKey?v.reason:v.reasoning;","const offKey=v.reasoning==null&&v.reason!=null;const WT=offKey?v.reason:v.reasoning;__VCW.push({seat:jd.seat,WT:String(WT||''),R:ciRounds(drvPromptText(jd.body))}); /* WALL-2024 Part 1 (W2) */"),
 ("if(new Set(summary.map(s=>s.api_model)).size!==3)",PASS+"\nif(new Set(summary.map(s=>s.api_model)).size!==3)"),
 ("return [{json:{run_token:TOK,debate_id:P.debate_id,bodies,summary,substitution,panel_effective}}];","return [{json:{run_token:TOK,debate_id:P.debate_id,bodies,summary,substitution,panel_effective,vc_single,vc_error}}];")]
AM=[("const panel_effective=summary.map(x=>x.seat).sort();\nreturn [{json:{...PP,enforcer_log",
 "try{const __PV=$('Panel Payloads').first().json;const __T=new Date().toISOString();(__PV.vc_single||[]).forEach(x=>enforcer_log.push({run_token:S.run_token,seat:'single',seat_role:'single',judge_model:x.judge_model||null,kind:'cure',rule:'K-CON',item:x.item,flagged_line:x.flagged_line,prompt_sent:null,full_reply:null,reply_error:null,response_line:null,cure_status:'UNCURED',cure_reason:'TRIAL rule (recorded only, after the panel; no call was made; it removes no seat): '+x.mark,at:__T}));}catch(e){} // WALL-2024 Part 1 (W2): the single judge's missed verified contradiction, record-only\nconst panel_effective=summary.map(x=>x.seat).sort();\nreturn [{json:{...PP,enforcer_log")]
CR_A="   const cr=(F0&&F0.verdict_tag&&F0.verdict_tag!==F.verdict_tag)?"
CR_B="   if(F0&&F0.verdict_tag&&F0.verdict_tag!==F.verdict_tag&&!j.includes('SUPERSEDED BY CURE: verdict')){const __h='SUPERSEDED BY CURE: verdict '+F0.verdict_tag+' to '+F.verdict_tag+'; see the cure lines below';j=j.replace(/(\"reasoning\"\\s*:\\s*\")/,m=>m+enc(__h+'\\n'));} /* WALL-2134 (W2, Part 2): the stored reasoning opens with the change the cure made */\n"+CR_A
# Part 2b (WALL-2024, run 32949 failure): the verdict change in 32949 chatgpt came by cureCorrected (the judge's own RESULT line in its cure
# reply), which sets verdict_tag in Panel Cure Check and Alternate Merge without cureRewrite. The header is written on that path too.
SH_DEF="function cureSupHead(raw,o,n){let s=String(raw||'');if(!o||!n||o===n||s.includes('SUPERSEDED BY CURE: verdict'))return s;const a=s.indexOf('{');const b=a<0?-1:rcObjEnd(s,a);if(b<0)return s;const enc=x=>JSON.stringify(String(x)).slice(1,-1);const j=s.slice(a,b).replace(/(\"reasoning\"\\s*:\\s*\")/,m=>m+enc('SUPERSEDED BY CURE: verdict '+o+' to '+n+'; see the cure lines below\\n'));return s.slice(0,a)+j+s.slice(b);} // WALL-2134 Part 2b (W2)\n"
SH_A="const cureCorrLine=(seat,orig,c)=>"
CC_A="if(cc){b.payload.verdict_raw=b.payload.verdict_raw+'\\n'+cureCorrLine("
CC_B="if(cc){b.payload.verdict_raw=cureSupHead(b.payload.verdict_raw,b.payload.verdict_tag,cc.word)+'\\n'+cureCorrLine("
plan={'live_version':live['versionId'],'nodes':[]};bad=[]
def one(c,a,b,nm):
    if c.count(a)!=1: bad.append(nm+' anchor x'+str(c.count(a))+': '+a[:60]);return c
    return c.replace(a,b)
os.makedirs(os.path.join(D,'patched'),exist_ok=True)
for n in live['nodes']:
    c0=n.get('parameters',{}).get('jsCode') or '';c=c0;ed=[]
    if n['name']=='Panel Payloads':
        for a,b in PP:c=one(c,a,b,n['name'])
        ed.append('P1:VC')
    if n['name']=='Alternate Merge':
        for a,b in AM:c=one(c,a,b,n['name'])
        ed.append('P1:single row')
    if 'function cureRewrite(' in c0:
        c=one(c,CR_A,CR_B,n['name']);ed.append('P2:superseded')
    if CC_A in c0:
        c=one(c,SH_A,SH_DEF+SH_A,n['name']);c=one(c,CC_A,CC_B,n['name']);ed.append('P2b:superseded on cureCorrected')
    if c!=c0:
        open('/tmp/_c.js','w').write('(async function(){'+c+'\n})')
        r=subprocess.run(['node','-e',"new Function('return '+require('fs').readFileSync('/tmp/_c.js','utf8'))"],capture_output=True,text=True)
        if r.returncode: bad.append('PARSE '+n['name']+r.stderr[:300])
        open(os.path.join(D,'patched',n['name'].replace(' ','_')+'.js'),'w').write(c)
        plan['nodes'].append({'name':n['name'],'id':n['id'],'live_sha':sha(c0),'new_sha':sha(c),'delta':len(c)-len(c0),'edits':ed})
json.dump(plan,open(os.path.join(D,'plan_VC.json'),'w'),indent=1)
print(live['versionId'],len(plan['nodes']),'nodes');[print(' ',x['name'],x['live_sha'],'->',x['new_sha'],x['delta'],x['edits']) for x in plan['nodes']]
print('BAD',bad) if bad else print('anchors unique, all parse')
