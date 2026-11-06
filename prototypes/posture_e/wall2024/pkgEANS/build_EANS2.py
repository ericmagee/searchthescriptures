# pkgEANS rev 2 (W3 2279, ruling 2283; built by W2). Run from wall2024/ after build_EANS.py (rev 1) and pkgSBS/build_SBS.py.
# (a) The E-ANS reader (Judge Enforcer Build and its Alt clone) reads MEANS and ANSWER in double, single or curly quotes. A quote closes only at
#     a mark followed by "--", so an apostrophe inside a word is not a mark (pkgR2's rule). FAILS is read as MISSES (2283 rule 1), and each seat
#     with FAILS lines gets one record-only form note in code_rows ("FAILS read as MISSES, n lines"); it is not an item.
# (b) K-AG (TRIAL form item, 2283 rules 3 and 4): kagLines2024 and kagCure in every library node, 'K-AG':'TRIAL' in ENF_STATUS, K-AG in
#     cureLabel and the FLAGGED ITEMS list, the cure read in cureVerdicts, and the calls in Panel Payloads, Alternate Payloads and Extract
#     Independent Verdict after kkjvLines2024. The library text added is one text in every node.
import hashlib,json,os
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
rd=lambda p:open(p).read()
O='pkgEANS/patched2';os.makedirs(O,exist_ok=True)
KAG=rd('pkgEANS/kag_lib.js')
def rep(s,a,b,name):
    assert s.count(a)==1,(name,a[:70],s.count(a));return s.replace(a,b)
# (a) E-ANS reader
def eans(s,role):
    s=rep(s,'MEANS:\\s*"([\\s\\S]*?)"\\s*--\\s*ANSWER:\\s*"([\\s\\S]*)"\\s*--\\s*(MEETS|MISSES)\\b',
      'MEANS:\\s*["\'\\u201c\\u2018]([\\s\\S]*?)["\'\\u201d\\u2019]\\s*--\\s*ANSWER:\\s*["\'\\u201c\\u2018]([\\s\\S]*)["\'\\u201d\\u2019]\\s*--\\s*(MEETS|MISSES|FAILS)\\b\\s*(?:\\([^)]*\\)\\s*)?','AC')
    s=rep(s,'const AG=[];\n','const AG=[];const __FC={}; /* pkgEANS rev 2: MEANS and ANSWER in double, single or curly quotes; FAILS read as MISSES (W3 2283) */\n','AG')
    s=rep(s," g.grades.push({seat:j.seat,grade:m[5],why:(m[6]||'').trim(),line:l});}",
      " if(m[5]==='FAILS')__FC[j.seat]=(__FC[j.seat]||0)+1;g.grades.push({seat:j.seat,grade:m[5]==='FAILS'?'MISSES':m[5],why:(m[6]||'').trim(),line:l});}",'push')
    s=rep(s,'const code_rows=[];const T0=new Date().toISOString();',
      "const code_rows=[];const T0=new Date().toISOString();\nfor(const __s of Object.keys(__FC))code_rows.push({run_token:S.run_token,seat:__s,seat_role:'"+role+"',judge_model:null,kind:'enforcer_check',rule:'E-ANS',item:'FAILS READ AS MISSES',flagged_line:null,prompt_sent:null,full_reply:null,reply_error:null,response_line:null,cure_status:null,cure_reason:'form note, record-only, not an item: FAILS read as MISSES, '+__FC[__s]+' line'+(__FC[__s]===1?'':'s')+' (W3 2283 rule 1)',at:T0});",'code_rows')
    return s
# (b) library
ENF_A="'K-RUL':'TRIAL','K-KJV':'TRIAL'};";ENF_B="'K-RUL':'TRIAL','K-KJV':'TRIAL','K-AG':'TRIAL'};"
ANCH='function kkjvCure(x,reply){'
LBL_A="x.rule==='K-RUL'||x.rule==='K-KJV')?x.rule+' '+x.link";LBL_B="x.rule==='K-RUL'||x.rule==='K-KJV'||x.rule==='K-AG')?x.rule+' '+x.link"
FL_A="x.rule==='K-RUL'||x.rule==='K-KJV')?String(x.line";FL_B="x.rule==='K-RUL'||x.rule==='K-KJV'||x.rule==='K-AG')?String(x.line"
CU_A="  {const kk=kkjvCure(x,reply&&reply.ok?reply.text:'');"
CU_B="  {const ag=kagCure(x,reply&&reply.ok?reply.text:'',respOf(x));if(ag)return res(ag.st,ag.why,ag.line?[ag.line]:null);} // K-AG (TRIAL; W3 2279, 2283)\n"+CU_A
CALL={'Panel Payloads':("  {const KK=kkjvLines2024(WT,kkjvRows());KK.items.forEach(x=>DRV.items.push(x));KK.marks.forEach(x=>marks.push(x));} // Commitment 12: K-KJV (TRIAL)\n",
       "  {const KA=kagLines2024(WT);KA.items.forEach(x=>DRV.items.push(x));KA.marks.forEach(x=>marks.push(x));} // K-AG (TRIAL; W3 2279, 2283)\n"),
 'Extract Independent Verdict':("  {const KK=kkjvLines2024(raw0,kkjvRows());KK.items.forEach(x=>DRV.items.push(x));KK.marks.forEach(x=>{raw+='\\n\\n'+x;});} // Commitment 12: K-KJV (TRIAL; the single judge is cured, WALL-2024 2172)\n",
       "  {const KA=kagLines2024(raw0);KA.items.forEach(x=>DRV.items.push(x));KA.marks.forEach(x=>{raw+='\\n\\n'+x;});} // K-AG (TRIAL; W3 2279, 2283)\n")}
CALL['Alternate Payloads']=CALL['Panel Payloads']
def lib(s,name,cure):
    s=rep(s,ENF_A,ENF_B,name+' ENF');s=rep(s,ANCH,KAG+ANCH,name+' anchor')
    if cure:s=rep(s,LBL_A,LBL_B,name+' label');s=rep(s,FL_A,FL_B,name+' flagged');s=rep(s,CU_A,CU_B,name+' cure')
    if name in CALL:a,b=CALL[name];s=rep(s,a,a+b,name+' call')
    return s
TG=['Alternate Build','Alternate Cure Build','Alternate Cure Normalize','Cure Build','Cure Check','Cure Normalize','Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Panel Cure Check','Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3']
f_=lambda n:n.replace(' ','_')+'.js'
SRC=[(n,'pkgTG/patched/'+f_(n),True) for n in TG]+[(n,'pkgALT/patched/'+f_(n),True) for n in ['Alternate Merge Seat','Gate Build','Gate Record','Alt Gate Build','Alt Gate Record']]\
 +[('Alternate Merge','pkgSBS/patched/Alternate_Merge.js',True)]+[(n,'pkgKCR/patched/'+f_(n),False) for n in ['Panel Payloads','Alternate Payloads','Extract Independent Verdict']]
plan={'base':'pkgEANS rev 1 (265de62) for the two enforcer builds; pkgTG, pkgALT, pkgSBS and pkgKCR finals for the library nodes','kag_lib_sha':sha(KAG),'nodes':[]}
for name,p,cure in SRC:
    b=rd(p);s=lib(b,name,cure);open(O+'/'+f_(name),'w').write(s);plan['nodes'].append({'file':f_(name),'name':name,'base':p,'base_sha':sha(b),'final_sha':sha(s)})
for name,role in [('Judge Enforcer Build','panel'),('Alt Judge Enforcer Build','alternate')]:
    p='pkgEANS/patched/'+f_(name);b=rd(p);s=eans(b,role);open(O+'/'+f_(name),'w').write(s);plan['nodes'].append({'file':f_(name),'name':name,'base':p,'base_sha':sha(b),'final_sha':sha(s)})
json.dump(plan,open('pkgEANS/plan_EANS2.json','w'),indent=1);print(len(plan['nodes']),'nodes');[print(' ',n['name'],n['base_sha'],'->',n['final_sha']) for n in plan['nodes']]
