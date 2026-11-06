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
 "try{const __PV=$('Panel Payloads').first().json;const __T=new Date().toISOString();(__PV.vc_single||[]).forEach(x=>enforcer_log.push({run_token:S.run_token,seat:'single',seat_role:'single',judge_model:x.judge_model||null,kind:'enforcer_check',rule:'K-CON',item:x.item,flagged_line:x.flagged_line,prompt_sent:null,full_reply:null,reply_error:null,response_line:null,cure_status:null,cure_reason:'TRIAL rule (recorded only, after the panel; no call was made; it removes no seat): '+x.mark,at:__T}));}catch(e){} // WALL-2024 Part 1 (W2): the single judge's missed verified contradiction, record-only\nconst panel_effective=summary.map(x=>x.seat).sort();\nreturn [{json:{...PP,enforcer_log")]
# Part 2c (WALL-2024 2176/2177, after run 32949): ONE header, written last for each judgment, comparing the verdict before any cure with the
# final verdict (W3 2177). It replaces the Part 2 header in cureRewrite and the Part 2b header on the cureCorrected path: a verdict can change
# more than once (cureCorrected, then the recount), and only the final tag is named. Panel judgments carry it inside the JSON reasoning;
# the single judge's plain text carries it as its first line. A header already present is replaced, never doubled.
SH_DEF="function cureSupHead(raw,o,n){let s=String(raw||'');const H=/SUPERSEDED BY CURE: verdict [A-Z-]+ to [A-Z-]+; see the cure lines below(?:\\\\n|\\n)/;const enc=x=>JSON.stringify(String(x)).slice(1,-1);const hd=(o&&n&&o!==n)?'SUPERSEDED BY CURE: verdict '+o+' to '+n+'; see the cure lines below':null;const t=s.trimStart();if(t[0]==='{'){const a=s.indexOf('{');const b=rcObjEnd(s,a);if(b<0)return s;let j=s.slice(a,b).replace(H,'');if(hd)j=j.replace(/(\"reasoning\"\\s*:\\s*\")/,m=>m+enc(hd+'\\n'));return s.slice(0,a)+j+s.slice(b);}s=s.replace(H,'');return hd?hd+'\\n'+s:s;} // WALL-2134 Part 2c (W2; W3 2177)\n"
SH_A="const cureCorrLine=(seat,orig,c)=>"
P2C={'Panel Cure Check':[
  (" const b=JSON.parse(bodies[i]);b.payload.drv_uncured=enfUncured(v);"," const b=JSON.parse(bodies[i]);const __t0=b.payload.verdict_tag;b.payload.drv_uncured=enfUncured(v);"),
  ("s.recomputed={trigger:rc.trig,fields:rc.fields,result:rc.result};}}\n bodies[i]=JSON.stringify(b);});","s.recomputed={trigger:rc.trig,fields:rc.fields,result:rc.result};}}\n b.payload.verdict_raw=cureSupHead(b.payload.verdict_raw,__t0,b.payload.verdict_tag); /* WALL-2134 Part 2c */\n bodies[i]=JSON.stringify(b);});"),
  ("if(rc&&rc.trig.indexOf('TIE (KB-0030)')>=0){b.payload.verdict_raw=cureRewrite(b.payload.verdict_raw,true,rc,s.seat,F0);Object.assign(b.payload,rc.fields);","if(rc&&rc.trig.indexOf('TIE (KB-0030)')>=0){b.payload.verdict_raw=cureRewrite(b.payload.verdict_raw,true,rc,s.seat,F0);Object.assign(b.payload,rc.fields);b.payload.verdict_raw=cureSupHead(b.payload.verdict_raw,F0.verdict_tag,b.payload.verdict_tag); /* WALL-2134 Part 2c */")],
 'Alternate Merge':[
  (" const b=JSON.parse(r.body);let v=[];"," const b=JSON.parse(r.body);const __t0=b.payload.verdict_tag;let v=[];"),
  ("\n const ok=a.qualify||b.payload.drv_uncured===0;","\n b.payload.verdict_raw=cureSupHead(b.payload.verdict_raw,__t0,b.payload.verdict_tag); /* WALL-2134 Part 2c */\n const ok=a.qualify||b.payload.drv_uncured===0;")],
 'Cure Check':[
  ("independent_verdict_raw:RAW0+'\\n\\n'+cureReport(null,v).concat(cureProse(null,r?r.reply:null)).concat(cc?[cureCorrLine(null,base.verdict_tag,cc)]:[]).concat(csl).concat(cureCountHeld(r?r.reply:null,v,cs,null)).concat(RC?[RC.audit]:[]).join('\\n'),",
   "independent_verdict_raw:cureSupHead(RAW0+'\\n\\n'+cureReport(null,v).concat(cureProse(null,r?r.reply:null)).concat(cc?[cureCorrLine(null,base.verdict_tag,cc)]:[]).concat(csl).concat(cureCountHeld(r?r.reply:null,v,cs,null)).concat(RC?[RC.audit]:[]).join('\\n'),base.verdict_tag,RC&&RC.fields&&RC.fields.verdict_tag?RC.fields.verdict_tag:(cc?cc.word:base.verdict_tag)), /* WALL-2134 Part 2c */")]}
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
    if n['name'] in P2C:
        c=one(c,SH_A,SH_DEF+SH_A,n['name'])
        for x,y in P2C[n['name']]: c=one(c,x,y,n['name'])
        ed.append('P2c:one final header')
    if c!=c0:
        open('/tmp/_c.js','w').write('(async function(){'+c+'\n})')
        r=subprocess.run(['node','-e',"new Function('return '+require('fs').readFileSync('/tmp/_c.js','utf8'))"],capture_output=True,text=True)
        if r.returncode: bad.append('PARSE '+n['name']+r.stderr[:300])
        open(os.path.join(D,'patched',n['name'].replace(' ','_')+'.js'),'w').write(c)
        plan['nodes'].append({'name':n['name'],'id':n['id'],'live_sha':sha(c0),'new_sha':sha(c),'delta':len(c)-len(c0),'edits':ed})
json.dump(plan,open(os.path.join(D,'plan_VC.json'),'w'),indent=1)
print(live['versionId'],len(plan['nodes']),'nodes');[print(' ',x['name'],x['live_sha'],'->',x['new_sha'],x['delta'],x['edits']) for x in plan['nodes']]
print('BAD',bad) if bad else print('anchors unique, all parse')
