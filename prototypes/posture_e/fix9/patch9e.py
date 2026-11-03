# patch.py (judge_fix9): builds new/<node>.js from base/<node>.js (the live code of ORACLE_DEBATE_V1 version cb4b94e0, read by GET on
# 2026-11-03 into data/workflow_live.json and data/live_code/; equal to judge_fix8/new for its 42 nodes) and lib/, and add/nodes_9.json (the
# nodes fix set 9 adds). Offline; writes only new/ and add/. Anchored replacements: it refuses when an anchor is not found the expected number
# of times. The design: prototypes/proven_structure/PROVEN_STRUCTURE_DRAFT_v2.md, with operator rulings 400-402.
#  S1 judge rulebook: sentence (B) removed everywhere; ruling 396 in its place, with the FORCED line form; K-F (TRIAL)
#  S2 debater prompts: every critical point carries its layers; the Oracle seat's line; the fixed PRESSED WITH form; counts name their unit
#  S3 ledger and ruling 372 counting: PROVEN / PROVEN BY REFERENCE / UNPROVEN; K-G1, K-G4, K-G6, K-G10, K-G11, D4 Build count proven presses only;
#     the REFERENCE line form and K-R (TRIAL)
#  S4 the [L2] sheet to both debaters (rounds 2-4), the [L2] check and count check for the judges; K-L2 (TRIAL) on the judges' own [L2]
#  S5 synthesis: its quotations checked against the KJV; no verdict
#  S6 K-P (TRIAL): an unproven press counted as a witness, or a BROKEN grade resting on one
import os,sys,json,uuid,re
H=os.path.dirname(os.path.abspath(__file__));B=H+'/base';N=H+'/new';L=H+'/lib';A=H+'/add'
sys.path.insert(0,H);import texts as TX
os.makedirs(N,exist_ok=True);os.makedirs(A,exist_ok=True)
def rep(s,old,new,nm,count=1):
    c=s.count(old)
    if c!=count: sys.exit(f'{nm}: anchor found {c} times, want {count}: {old[:160]!r}')
    return s.replace(old,new)
lib=lambda n:open(f'{L}/{n}').read().rstrip('\n')
J=lambda x:json.dumps(x,ensure_ascii=False)
OUT={}
def get(nm):
    if nm not in OUT: OUT[nm]=open(f'{B}/{nm}.js').read()
    return OUT[nm]
def put(nm,s): OUT[nm]=s
CHECK=['Panel Payloads','Alternate Payloads','Extract Independent Verdict']
CURE=['Alternate Build','Alternate Cure Build','Alternate Cure Normalize','Alternate Merge','Cure Build','Cure Check','Cure Normalize',
      'Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Panel Cure Check','Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3']
JUDGE=['Panel Build','Build Independent Verdict']
POSTURE=['Accept Build','Accept Check','Accept Final','Accept Return Build','Alternate Build','Alternate Cure Build','Panel Build',
         'Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Reserve Build']
ROUND_BUILDS=['D1 Build','C1 Build','D2 Build','C2 Build','D3 Build','C3 Build','D4 Build','C4 Build']
SHEET_ROUNDS=[('D2','C1 Extract'),('C2','D2 Extract'),('D3','C2 Extract'),('C3','D3 Extract'),('D4','C3 Extract'),('C4','D4 Extract')]

# ---------- the shared library sources ----------
PB=open(f'{B}/Panel Build.js').read()
REFP_END='\n return {parse,keys,book,BK,BOOKS};})();'
REFP_SRC=PB[PB.index('const REFP=(()=>'):PB.index(REFP_END)+len(REFP_END)]
PP=open(f'{B}/Panel Payloads.js').read()
def line_of(s,start):
    i=s.index('\n'+start)+1;return s[i:s.index('\n',i)]
LBFOOT=PP[PP.index('function lbFoot('):PP.index('// the j-th LINK block of a link round')].rstrip('\n')
PRS_LB_SRC=('// judge_fix9: the footing reader of fix set 8 (lbFoot, R5 as amended by ruling 400), bundled for a node that has none of its own\n'
            'const PRS_LB=(()=>{'+'\n'.join(line_of(PP,x) for x in ['const DRV_SRC=','const DRV_TL_STOP=','const LB_REF=','const LB_GLOSS=','const LB_TL='])+'\n'+LBFOOT+'\nreturn lbFoot;})();')
PRS_SRC=lib('press.js');L2_SRC=lib('l2.js');KFR_SRC=lib('kfr.js');KFR_CURE=lib('kfr_cure.js')
HEAD='// ======== judge_fix9 (PROVEN_STRUCTURE_DRAFT_v2; rulings 396-402): shared libraries ========\n'
def inject(nm,parts,refp=False):
    s=get(nm);pre=HEAD+('' if (not refp or 'const REFP=(()=>' in s) else REFP_SRC+'\n')+'\n'.join(parts)+'\n// ======== end judge_fix9 libraries ========\n'
    put(nm,pre+s)

# ======================= S1: the judges' rulebook (Panel Build, Build Independent Verdict) =======================
NEW_B = ("Scripture does not contradict itself: if a link cannot agree with the meaning of a pressed witness, as the debaters show that meaning with its layers, "
         "the link fails; the verse stands, and the link is the error. You weigh only the meaning the debaters show and add none of your own. The wording of "
         "one verse alone never decides a link: \\\"no verse states it\\\", \\\"the text nowhere narrates it\\\" and \\\"no witness's own words state it\\\" are never a "
         "ground, for either side.")
B_SENT="A witness contradicts a link only when its own words state the contrary; a verb that leaves the point unnarrated does not, for either side. This tests a pressed witness, not a chained premise, which is judged by its footing (DG-61)."
for nm in JUDGE:
    s=get(nm)
    s=rep(s,NEW_B,NEW_B+' "+__R396F+" "+__RPROVEN+"',nm) # rebase on posture v5: the approved sentence stays
    s=rep(s,"any of those witnesses that a listed premise carries under PRESSED WITH: (COUNTING RULE;","any of those witnesses that a listed premise carries under PRESSED WITH: as a proven press (md_notes_rulings 398) (COUNTING RULE;",nm)
    put(nm,s)
# the posture text (dry regrade, posture mode): Commitment 3 replaced by ruling 396; Commitment 5 counts proven presses only
C5_LIVE="A witness carried under a listed premise's PRESSED WITH line, and left unanswered by the later rounds of the side that holds the link, makes that premise UNEXHIBITED. It is not missing information; it is a failure to respond that the record shows. A verse pressed with no listed premise behind it is not a witness."
C5_APPROVED="A proven press carried under a listed premise's PRESSED WITH line (one that carries its layers, or a checked reference to the round that shows them), and left unanswered by the later rounds of the side that holds the link, makes that premise UNEXHIBITED. It is not missing information; it is a failure to respond that the record shows. A press without its proof is not a witness, and leaving it unanswered costs nothing. A verse pressed with no listed premise behind it is not a witness."
for nm in POSTURE:
    s=get(nm);s=rep(s,C5_LIVE,C5_APPROVED,nm);put(nm,s) # rebase on posture v5: ruling 410

# ======================= S3: the ledger (Panel Build, Build Independent Verdict) =======================
SIDE_OLD="    if(r.cvs.some(cv=>isNamed(N,r.book||r.ctx||'',cv)||(NE&&isNamed(PE,r.book||r.ctx||'',cv)&&isNamed(NE,r.book||r.ctx||'',cv))||(NE2&&isNamed(PE2,r.book||r.ctx||'',cv)&&isNamed(NE2,r.book||r.ctx||'',cv))))named++;else notNamed.push(label);}\n   return {n:k+1,link:lk,verses:seen.size,named,notNamed,info:info.filter(l=>!seen.has(l)&&!over.includes(l)),over};});"
SIDE_NEW=("    /* judge_fix9 S3 (rulings 398, 399): a press the parse marks UNPROVEN is not a witness: shown, never counted named or NOT NAMED */\n"
          "    {const ks=r.cvs.map(cv=>(r.book||r.ctx||'')+' '+cv);const pv=PRSP?ks.find(z=>PRSP.verses.some(v=>v.key===z&&v.cls!=='UNPROVEN')):true;if(PRSP&&!pv){const v0=PRSP.verses.find(v=>ks.includes(v.key));unp.push({l:label,w:(v0?v0.why:'no MEANS sentence')});continue;}if(PRSP&&PRSP.verses.some(v=>ks.includes(v.key)&&v.cls==='PROVEN BY REFERENCE'))byref++;else if(PRSP)prov++;}\n"
          "    if(r.cvs.some(cv=>isNamed(N,r.book||r.ctx||'',cv)||(NE&&isNamed(PE,r.book||r.ctx||'',cv)&&isNamed(NE,r.book||r.ctx||'',cv))||(NE2&&isNamed(PE2,r.book||r.ctx||'',cv)&&isNamed(NE2,r.book||r.ctx||'',cv))))named++;else notNamed.push(label);}\n"
          "   return {n:k+1,link:lk,verses:seen.size,named,notNamed,info:info.filter(l=>!seen.has(l)&&!over.includes(l)),over,unp,prov,byref};});")
PRSP_OLD="   const over=[];let nk=0;const kk=new Set(); /* judge_fix8 R13 (md_notes_rulings 393): at most 8 pressed verses per premise; the rest are over the cap, not witnesses */"
PRSP_NEW=PRSP_OLD+"\n   const PRSP=(typeof PRS!=='undefined'&&xw)?PRS.premise(xw,PWL_R,headRe===CH_RE?'CR3':'DR2',PRS_L2BAD):null;const unp=[];let prov=0,byref=0; /* judge_fix9 S3 */"
LINE_OLD="p.verses+' verse(s) carried under PRESSED WITH; '+p.named+' named'+inf+"
LINE_NEW="p.verses+' verse(s) carried under PRESSED WITH; '+(p.prov||0)+' PROVEN, '+(p.byref||0)+' PROVEN BY REFERENCE'+(p.unp&&p.unp.length?'; UNPROVEN, not a witness (ruling 398): '+[...new Set(p.unp.map(u=>u.w))].map(w=>p.unp.filter(u=>u.w===w).map(u=>u.l).join(', ')+' ('+w+')').join('; '):'')+'; of the proven, '+p.named+' named'+inf+"
HDR_OLD="'PRESSED-WITNESS LEDGER -- computed by the system from the transcript text, not by a model, by one rule for both sides. SCOPE:"
HDR_NEW=("'PRESSED-WITNESS LEDGER -- computed by the system from the transcript text, not by a model, by one rule for both sides. PROOF (md_notes_rulings 398, 399; judge_fix9): "
         "each press is parsed, not judged: PROVEN (a MEANS sentence with an [L2] or [L3] in place), PROVEN BY REFERENCE (a MEANS sentence with PROVEN IN [<round>], "
         "checked by the system: that round quotes the verse with its reference in a block of two layer kinds; you confirm the meaning on a REFERENCE line) or "
         "UNPROVEN (not a witness, ruling 398); only proven presses are counted named or NOT NAMED. SCOPE:")
for nm in JUDGE:
    s=get(nm)
    s=rep(s,PRSP_OLD,PRSP_NEW,nm);s=rep(s,SIDE_OLD,SIDE_NEW,nm);s=rep(s,LINE_OLD,LINE_NEW,nm);s=rep(s,HDR_OLD,HDR_NEW,nm)
    s=rep(s," const ledger=F=>({defender:"," const ledger=F=>(PWL_R=(typeof PRS!=='undefined'?PRS.RND(F):{}),{defender:",nm) # judge_fix9 S3: the rounds the parse reads
    put(nm,s)
# the [L2] check lines and the NOT COUNTED [L2] tags a press carries (Quote Report), before the ledger is computed
L2CHK=("/* judge_fix9 S4: the [L2] check (Quote Report): one line per tag, the result only (no gloss reaches the judges, rulings 382, 383) */\n"
 "PRS_L2BAD=(()=>{try{const q=$('Quote Report').first().json;return q&&q.l2&&Array.isArray(q.l2.tags)&&typeof PRS!=='undefined'?PRS.l2bad(q.l2.tags):null;}catch(e){return null;}})();\n"
 "const L2CHK=(()=>{let q=null;try{q=$('Quote Report').first().json;}catch(e){q=null;}if(!q||!q.l2||!Array.isArray(q.l2.tags))return '[L2] CHECK: not available this run; an [L2] counts only when its word stands in a verse its block cites.';\n"
 " const T=q.l2.tags.filter(t=>t.status!=='IGNORED');const n=s=>T.filter(t=>t.status===s).length;const L=[__RL2,'[L2] CHECK -- computed by the system, not by a model: '+T.length+' [L2] tags; '+n('COUNTED')+' COUNTED; '+n('NOT COUNTED')+' NOT COUNTED; '+n('UNVERIFIABLE')+' UNVERIFIABLE.'];\n"
 " for(const t of T)L.push(t.side+' ['+t.round+'] [L2] '+(t.words||[]).map(w=>w.w).join(', ').slice(0,120)+(t.words&&t.words.length?'':'(no word named)')+': '+t.status+(t.status==='COUNTED'?'':' ('+String(t.why||'').replace(/\\s*\\(cited:[^)]*\\)/,'').slice(0,160)+')'));\n"
 " for(const c of (q.l2.counts||[]))L.push(c.side+' ['+c.round+'] count \"'+c.said+'\" ('+(c.num||'no number')+'): '+c.status);\n"
 " return L.join(String.fromCharCode(10));})();\n")
s=get('Panel Build')
s=rep(s,"const LEDGER=PWL.judgeBlock(",L2CHK+"const LEDGER=PWL.judgeBlock(",'Panel Build')
s=rep(s,",'',KJVC,'',LEDGER,'',",",'',KJVC,'',L2CHK,'',LEDGER,'',",'Panel Build')
put('Panel Build',s)
s=get('Build Independent Verdict')
s=rep(s,"const LEDGER=PWL.judgeBlock(",L2CHK+"const LEDGER=PWL.judgeBlock(",'Build Independent Verdict')
s=rep(s,"+NL+NL+KJVC+NL+NL+LEDGER+NL+NL+","+NL+NL+KJVC+NL+NL+L2CHK+NL+NL+LEDGER+NL+NL+",'Build Independent Verdict')
put('Build Independent Verdict',s)
for nm in JUDGE:
    inject(nm,[PRS_LB_SRC,PRS_SRC,'let PWL_R={};let PRS_L2BAD=null;',
               'const __R396F='+J(TX.R396[TX.R396.index('A COLLISION POINTS line'):])+';','const __RPROVEN='+J(TX.RPROVEN)+';','const __RL2='+J(TX.RL2)+';'])

# ======================= S3: D4 Build, the close round's list of verses still pressed (proven only) =======================
s=get('D4 Build')
D4_OLD="    if(r.cvs.some(cv=>isNamed(N,r.book||r.ctx||'',cv)))named++;else notNamed.push(label);}\n   return {n:k+1,link:lk,verses:seen.size,named,notNamed};});"
D4_NEW=("    /* judge_fix9 S3 (ruling 398): an unproven press is not a witness and is not listed as still pressed */\n"
        "    {const ks=r.cvs.map(cv=>(r.book||r.ctx||'')+' '+cv);if(PRSP&&!ks.some(z=>PRSP.verses.some(v=>v.key===z&&v.cls!=='UNPROVEN'))){unp.push(label);continue;}}\n"
        "    if(r.cvs.some(cv=>isNamed(N,r.book||r.ctx||'',cv)))named++;else notNamed.push(label);}\n   return {n:k+1,link:lk,verses:seen.size,named,notNamed,unp};});")
s=rep(s,D4_OLD,D4_NEW,'D4 Build')
s=rep(s,"   let nk=0;const kk=new Set(); /* judge_fix8 R13 (md_notes_rulings 393): only the first 8 pressed verses of a premise are witnesses */",
      "   let nk=0;const kk=new Set(); /* judge_fix8 R13 (md_notes_rulings 393): only the first 8 pressed verses of a premise are witnesses */\n"
      "   const PRSP=(typeof PRS!=='undefined'&&xw)?PRS.premise(xw,PWL_R,headRe===CH_RE?'CR3':'DR2',null):null;const unp=[]; /* judge_fix9 S3 */",'D4 Build')
s=rep(s,"const OPEN=(()=>{try{const LF=String.fromCharCode(10);const out=[];","const OPEN=(()=>{try{const LF=String.fromCharCode(10);const out=[];PWL_R=(typeof PRS!=='undefined'?PRS.RND(RW):{}); /* judge_fix9 S3 */",'D4 Build')
s=rep(s," out.push('(a) PRESSED PREMISES (the list that closes the challenger\\'s round 2), verses carried under PRESSED WITH that no defender round after it names:'); // judge_fix8 K7",
      " out.push('(a) PRESSED PREMISES (the list that closes the challenger\\'s round 2), proven presses (md_notes_rulings 398) carried under PRESSED WITH that no defender round after it names:'); // judge_fix8 K7, judge_fix9 S3",'D4 Build')
s=rep(s," return 'STILL UNANSWERED AGAINST YOUR CHAIN --",
      " {const up=s.list?s.premises.filter(p=>p.unp&&p.unp.length):[];if(up.length)out.push('(b) UNPROVEN PRESSES, not witnesses (md_notes_rulings 398: no MEANS sentence with an [L2] or [L3], and no checked PROVEN IN reference); leaving them unanswered costs you nothing: '+up.map(p=>'premise '+p.n+': '+p.unp.join(', ')).join('; '));} /* judge_fix9 S3 */\n"
      " return 'STILL UNANSWERED AGAINST YOUR CHAIN --",'D4 Build')
put('D4 Build',s)
inject('D4 Build',[PRS_LB_SRC,PRS_SRC,'let PWL_R={};'])

# ======================= S3, S6: the checkers' and the cure nodes' press list (pwList: proven presses are the witnesses) =======================
PWL_OLD="  return {n:k+1,has:j>=0,seg:none?'':seg,keys:new Set(K.slice(0,PW_CAP)),over:K.slice(PW_CAP)};});}"
PWL_NEW=("  /* judge_fix9 S3 (rulings 398, 399): keys are the proven presses (PROVEN, PROVEN BY REFERENCE); all, every press within the cap; cls, the parse */\n"
         "  const P=(none||j<0||typeof PRS==='undefined')?null:PRS.premise(seg,R,PW_ROUND[side],(typeof PRS_L2BAD!=='undefined'?PRS_L2BAD:null));const all=new Set(K.slice(0,PW_CAP));\n"
         "  const pv=P?new Set(P.verses.filter(v=>v.cls!=='UNPROVEN').map(v=>v.key)):all;\n"
         "  return {n:k+1,has:j>=0,seg:none?'':seg,keys:new Set([...all].filter(z=>pv.has(z))),all,unproven:[...all].filter(z=>!pv.has(z)),cls:P?P.verses:[],over:K.slice(PW_CAP)};});}")
# drvPressWith: K-G10 counts proven presses only; a premise counted on an unproven press is K-P
KG10_A="const PW=new Set();PL.forEach(p=>p.keys.forEach(k=>PW.add(k)));const VD=lbVoid(text,side);"
KG10_A2="const PW=new Set();PL.forEach(p=>p.keys.forEach(k=>PW.add(k)));const PA=new Set();PL.forEach(p=>(p.all||p.keys).forEach(k=>PA.add(k)));const VD=lbVoid(text,side); /* judge_fix9 S3: PW proven, PA every press */"
KG10_B="    items.push({rule:'K-G10',side,link:id,premise:n,line:'premise '+n+': counted UNEXHIBITED on '+bad.join(', ')+', which no premise of the list that closes ['+PW_ROUND[side]+'] carries under PRESSED WITH; the count reads: '"
KG10_B2=("    const kp=bad.some(k=>PA.has(k)); /* judge_fix9 S6: K-P, a premise counted on a press the ledger marks UNPROVEN (ruling 398) */\n"
         "    items.push({rule:kp?'K-P':'K-G10',side,link:id,premise:n,line:'premise '+n+': counted UNEXHIBITED on '+bad.join(', ')+(kp?', which the ledger marks UNPROVEN, not a witness (ruling 398); ':', which no premise of the list that closes ['+PW_ROUND[side]+'] carries under PRESSED WITH; ')+'the count reads: '")
KG10_C="    marks.push('[AUDIT v26: DEBATE RULE VIOLATION (K-G10) -- '+id+': '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+' counts it UNEXHIBITED on '+bad.join(', ')+', which no premise"
KG10_C2=("    if(kp)marks.push('[AUDIT v28: DEBATE RULE VIOLATION (K-P) -- '+id+': '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+' counts it UNEXHIBITED on '+bad.join(', ')+', a press the ledger marks UNPROVEN: it carries no MEANS sentence with an [L2] or [L3] and no checked PROVEN IN reference. Ruling 398: only a proven press is a witness. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');else\n"
         +KG10_C)
KG11_A="  if(!PWS[side]){const PL=pwList(R,side);PWS[side]=PL?new Set(PL.flatMap(p=>[...p.keys])):null;}const PW=PWS[side];if(!PW)continue;"
KG11_A2="  if(!PWS[side]){const PL=pwList(R,side);PWS[side]=PL?new Set(PL.flatMap(p=>[...p.keys])):null;PWS[side+'A']=PL?new Set(PL.flatMap(p=>[...(p.all||p.keys)])):null;}const PW=PWS[side];if(!PW)continue;const PA=PWS[side+'A']||PW; /* judge_fix9 S3 */"
KG11_B="  items.push({rule:'K-G11',side,link:id,line:l.slice(0,600),verses:U,pwNamed:named,pwk:[...PW]});"
KG11_B2=("  const kp=U.some(k=>PA.has(k)); /* judge_fix9 S6: K-P, a BROKEN line resting on presses the ledger marks UNPROVEN (ruling 398) */\n"
         "  items.push({rule:kp?'K-P':'K-G11',side,link:id,line:l.slice(0,600),verses:U,pwNamed:named,pwk:[...PW]});\n"
         "  if(kp){marks.push('[AUDIT v28: DEBATE RULE VIOLATION (K-P) -- '+id+' '+g+' rests, as unanswered, only on '+U.join(', ')+', presses the ledger marks UNPROVEN or carries under no PRESSED WITH; ruling 398: only a proven press is a witness, and an unproven press left unanswered is no BROKEN ground. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');continue;}")
CI_CALL={'Panel Payloads':'jd.body','Alternate Payloads':'a.body','Extract Independent Verdict':'prev&&prev.verdictBody'}
KG1_OLD="  if(conc===0&&DRV_WORDS.test(line)){items.push({rule:'K-G1',side,link:id,line});"
KG1_NEW=("  /* judge_fix9 S3 (ruling 398): a BROKEN line whose unanswered verses are all presses the ledger marks UNPROVEN raises no K-G1 or K-G4 (K-P reads it) */\n"
         "  if(prsUnprovenOnly(line,side)){marks.push('[AUDIT v28: K-G1/K-G4 NOT RAISED -- '+id+' '+g[1]+' rests, as unanswered, only on presses the ledger marks UNPROVEN (ruling 398); K-P reads the line.]');}\n"
         "  else if(conc===0&&DRV_WORDS.test(line)){items.push({rule:'K-G1',side,link:id,line});")
PASS_OLD=" if(pass)marks.push('[AUDIT v26: K-G10 PASS: '"
PASS_NEW=(" {const F9=kfLines(text,R);F9.items.forEach(x=>items.push(x));F9.marks.forEach(x=>marks.push(x));} // judge_fix9 S1: K-F (lib/kfr.js)\n"
          " {const R9=krLines(text,R);R9.items.forEach(x=>items.push(x));R9.marks.forEach(x=>marks.push(x));} // judge_fix9 S3: K-R\n"
          " {const X9=kl2Lines(text,l2Data());X9.items.forEach(x=>items.push(x));X9.marks.forEach(x=>marks.push(x));} // judge_fix9 S4: K-L2\n"
          +PASS_OLD)
for nm in CHECK:
    s=get(nm)
    s=rep(s,"'K-LXX':'TRIAL',","'K-LXX':'TRIAL','K-P':'TRIAL','K-F':'TRIAL','K-R':'TRIAL','K-L2':'TRIAL',",nm)
    s=rep(s,PWL_OLD,PWL_NEW,nm);s=rep(s,KG10_A,KG10_A2,nm);s=rep(s,KG10_B,KG10_B2,nm);s=rep(s,KG10_C,KG10_C2,nm)
    s=rep(s,KG11_A,KG11_A2,nm);s=rep(s,KG11_B,KG11_B2,nm);s=rep(s,KG1_OLD,KG1_NEW,nm);s=rep(s,PASS_OLD,PASS_NEW,nm)
    s=rep(s,"const DRV=drvCheck(","PRS_CTX.R=ciRounds(drvPromptText("+CI_CALL[nm]+"));PRS_L2BAD=(()=>{try{const q=$('Quote Report').first().json;return q&&q.l2&&Array.isArray(q.l2.tags)?PRS.l2bad(q.l2.tags):null;}catch(e){return null;}})(); /* judge_fix9 S3: the rounds the press parse reads */\nconst DRV=drvCheck(",nm)
    put(nm,s)
    inject(nm,[PRS_SRC,L2_SRC,'let PRS_L2BAD=null;',KFR_SRC])

# ======================= S1, S3, S4, S6: the cure prompt and cure checks (14 nodes) =======================
WIT_OLD="WITNESS (md_notes_rulings 392): in every item below a witness is a verse a listed premise carries under PRESSED WITH: (the list that closes [DR2] against the defender, the list that closes [CR3] against the challenger);"
WIT_NEW="WITNESS (md_notes_rulings 392, 398): in every item below a witness is a verse a listed premise carries under PRESSED WITH: (the list that closes [DR2] against the defender, the list that closes [CR3] against the challenger) as a proven press, one the ledger marks PROVEN or PROVEN BY REFERENCE; a press it marks UNPROVEN is not a witness;"
LXX_CURE_OLD=" K-LXX (your text says no Septuagint reading or reference occurred, but the system scan found a round that rests a reading on the Greek Old Testament): cure it with a STATEMENT for the item that names the Septuagint reading and the round that rests on it, quoting that round, or with one RESTATED CITATION CHECK line that names it. "
for nm in CURE:
    s=get(nm)
    s=rep(s,"'K-LXX':'TRIAL',","'K-LXX':'TRIAL','K-P':'TRIAL','K-F':'TRIAL','K-R':'TRIAL','K-L2':'TRIAL',",nm)
    s=rep(s,WIT_OLD,WIT_NEW,nm)
    s=rep(s,LXX_CURE_OLD,LXX_CURE_OLD+'"+__CURE396+"',nm)
    s=rep(s,PWL_OLD,PWL_NEW,nm)
    # the labels and the FLAGGED ITEMS list carry the new rules; the link-keyed rules keep their link
    s=rep(s,"x.rule==='K-S2'||x.rule==='K-LXX'||x.rule==='K-C'","x.rule==='K-S2'||x.rule==='K-LXX'||x.rule==='K-P'||x.rule==='K-F'||x.rule==='K-R'||x.rule==='K-L2'||x.rule==='K-C'",nm,2)
    s=rep(s,"x.rule==='K-S2'||x.rule==='K-LXX'||x.rule==='K-N'","x.rule==='K-S2'||x.rule==='K-LXX'||x.rule==='K-F'||x.rule==='K-L2'||x.rule==='K-N'",nm)
    # K-P on a count is cured as K-G10 (by a count); K-P on a BROKEN line as K-G11 (retracted, regraded, or restated on a proven press)
    s=rep(s,"  if(x.rule==='K-G10'){const pr=x.side==='DEFENDER'?'DR2':'CR3';","  if(x.rule==='K-G10'||(x.rule==='K-P'&&x.premise!=null)){const pr=x.side==='DEFENDER'?'DR2':'CR3'; /* judge_fix9 S6: K-P on a count */",nm)
    s=rep(s,"   const st0=stated(x);if(st0)return res('CURED','statement quotes the PRESSED WITH line","   const st0=x.rule==='K-P'?null:stated(x);if(st0)return res('CURED','statement quotes the PRESSED WITH line",nm)
    s=rep(s,"   const open=new Set(items.filter(y=>y.rule==='K-G10'&&y.side===x.side&&!stated(y)).map(y=>y.premise));",
          "   const open=new Set(items.filter(y=>((y.rule==='K-G10'&&!stated(y))||(y.rule==='K-P'&&y.premise!=null))&&y.side===x.side).map(y=>y.premise));",nm)
    s=rep(s,"  if(x.rule==='K-G11'){","  if(x.rule==='K-G11'||(x.rule==='K-P'&&x.premise==null)){ /* judge_fix9 S6: K-P on a BROKEN line */",nm)
    s=rep(s,"x.rule==='K-G9'||x.rule==='K-G10'||(x.rule==='K-V'&&x.status==='CURED'","x.rule==='K-G9'||x.rule==='K-G10'||(x.rule==='K-P'&&x.premise!=null)||(x.rule==='K-V'&&x.status==='CURED'",nm)
    s=rep(s,"x.rule==='K-G9'||x.rule==='K-G10'||x.rule==='K-LB')&&x.status!=='CURED'","x.rule==='K-G9'||x.rule==='K-G10'||(x.rule==='K-P'&&x.premise!=null)||x.rule==='K-LB')&&x.status!=='CURED'",nm)
    s=rep(s,"  if(x.rule==='K-LXX'){",KFR_CURE+"\n  if(x.rule==='K-LXX'){",nm)
    put(nm,s)
    inject(nm,[PRS_SRC,L2_SRC,'let PRS_L2BAD=null;',KFR_SRC,'const __CURE396='+J(TX.CURE396)+';'])

# ======================= F1 (live run 32341, enforcer row 124): a RETRACTED line is a retraction unless it regrades the link LINK BROKEN =======================
# GLM's "RETRACTED: D3 vs C4 -- [DR3] LINK 4 answered every witness ... so the CHALLENGER LINK BROKEN grade rested on no pressed witness left
# unanswered ..." was refused as malformed because its reason names the retracted grade; the seat was dropped and Sol substituted. Now a
# RETRACTED line is refused only when it regrades the link to a LINK BROKEN grade: its reason opens with that grade (after the label, any
# parenthetical and a separator, "regraded to" allowed), or says "regraded / graded / now ... LINK BROKEN". A reason that names the grade it
# retracts is allowed.
RX_OLD="&&!/\\bLINK\\s+BROKEN\\b/i.test(m[3].replace(/\\bnot\\s+(?:a\\s+)?(?:\\S+\\s+)?LINK\\s+BROKEN\\b/ig,''))){"
RX_NEW="&&!cureRegradesBroken(m[3])){ /* judge_fix9 F1 (run 32341): refused only when it regrades the link LINK BROKEN */"
RX_FN=("// judge_fix9 F1 (live run 32341, enforcer row 124): a RETRACTED line regrades the link LINK BROKEN only when its reason opens with that grade\n"
 "// (after the label, a parenthetical and a separator; \"regraded to\" allowed) or says \"regraded / graded / now ... LINK BROKEN\"; naming the\n"
 "// retracted grade (\"the CHALLENGER LINK BROKEN grade rested on ...\") is a reason, not a regrade.\n"
 "function cureRegradesBroken(rest){const G='(?:(?:DEFENDER|CHALLENGER)\\\\s+)?LINK\\\\s+BROKEN\\\\b';let t=String(rest||'').replace(/\\bnot\\s+(?:a\\s+)?(?:\\S+\\s+)?LINK\\s+BROKEN\\b/ig,' ');\n"
 " t=t.replace(/^\\s*\\([^)]*\\)\\s*/,'').replace(/^\\s*(?:--|—|–|-|:|,)\\s*/,'');\n"
 " if(new RegExp('^(?:(?:re-?)?grade[sd]?\\\\s+(?:to\\\\s+|as\\\\s+)?)?'+G,'i').test(t))return true;\n"
 " return new RegExp('\\\\b(?:re-?graded|graded|regrade[sd]?|now)\\\\s+(?:(?:to|as|it|the\\\\s+link|this\\\\s+link)\\\\s+)?'+G,'i').test(t);}\n")
for nm in []:
    s0=get(nm);s0=rep(s0,RX_OLD,RX_NEW,nm);s0=rep(s0,"\nfunction cureLines(text){","\n"+RX_FN+"function cureLines(text){",nm);put(nm,s0)

# ======================= S2: the debaters =======================
s=get('Init with Guards')
s=rep(s,"+'\\n\\n'+LAYER+'\\n\\n'+rcSection+burden(role)+","+'\\n\\n'+LAYER+'\\n\\n'+__PROVE9+'\\n\\n'+rcSection+burden(role)+",'Init with Guards')
s=rep(s,"+'\\n\\n'+LAYER+burden(role);};","+'\\n\\n'+LAYER+'\\n\\n'+__PROVE9+burden(role);};",'Init with Guards')
s=rep(s,"const LAYER=\"LAYER RULES:","const __ORACLE9="+J(TX.ORACLE)+"; // judge_fix9 S2 (md_notes_rulings 397: the Oracle seat is told to prove every position with the layers)\nconst __PROVE9="+J(TX.PROVE)+"; // judge_fix9 S2\nconst LAYER=\"LAYER RULES:",'Init with Guards')
put('Init with Guards',s)
SHT_APPEND="if(__SHT){for(let k=msgs.length-1;k>=0;k--){if(msgs[k]&&msgs[k].role==='user'&&typeof msgs[k].content==='string'){msgs[k]={...msgs[k],content:msgs[k].content+'\\n\\n'+__SHT};break;}}}"
for nm in ROUND_BUILDS:
    s=get(nm);r=nm.split()[0];prev=dict(SHEET_ROUNDS).get(r)
    add=("\n// judge_fix9 S2 (md_notes_rulings 397-400): every critical point carries its layers; appended to the round's last user message.\n"
         "const __PROVE9="+J(TX.PROVE)+";\n")
    if prev:
        add+=("// judge_fix9 S4: the [L2] SHEET (original_words and lexicon_words, read by \""+r+" Words Sheet\" and \""+r+" Lexicon Sheet\"), served to both seats alike; the judges never see it.\n"
              "const __L2S=(()=>{try{if(typeof L2C==='undefined')return '';const P=$('"+prev+"').first().json;let ow=[],lx=[];try{ow=$('"+r+" Words Sheet').all().map(i=>i.json).filter(x=>x&&x.book);}catch(e){ow=[];}try{lx=$('"+r+" Lexicon Sheet').all().map(i=>i.json).filter(x=>x&&x.strongs_number);}catch(e){lx=[];}return L2C.sheet(ow,lx,P);}catch(e){return '';}})();\n")
    add+=("{const __X9=[__PROVE9"+(",__L2S" if prev else "")+"].filter(Boolean).join('\\n\\n');for(let k=msgs.length-1;k>=0;k--){if(msgs[k]&&msgs[k].role==='user'&&typeof msgs[k].content==='string'){msgs[k]={...msgs[k],content:msgs[k].content+'\\n\\n'+__X9};break;}}}")
    s=rep(s,SHT_APPEND,SHT_APPEND+add,nm)
    if r in ('C2','D3'):
        s=rep(s,"each by reference with its KJV words as you quoted them; write PRESSED WITH: none if you pressed none.",
              "each in the PRESS FORM below; write PRESSED WITH: none if you pressed none. '+__PWFORM9+'",nm)
        s="const __PWFORM9="+J(TX.PWFORM)+"; // judge_fix9 S2: the fixed PRESSED WITH form (rulings 398, 399)\n"+s
    put(nm,s)
    if prev: inject(nm,[L2_SRC],refp=True)
# the [L2] sheet's read plan (the Extract before each of rounds 2-4)
PLAN_OLD=" const plan=texts=>{const r=req(texts);const u=url(r);return {sheet_url:u.url,sheet_req:r.map(x=>x.key),sheet_off_url:u.off};};"
PLAN_NEW=" const plan=texts=>{const r=req(texts);const u=url(r);return {sheet_url:u.url,sheet_req:r.map(x=>x.key),sheet_off_url:u.off,...(typeof L2C!=='undefined'?L2C.sheetPlan(texts,r.map(x=>x.key)):{})};}; // judge_fix9 S4: the [L2] sheet's read"
for r,prev in SHEET_ROUNDS:
    s=get(prev);s=rep(s,PLAN_OLD,PLAN_NEW,prev);put(prev,s);inject(prev,[L2_SRC],refp=True)

# ======================= S4, S5: Citation Scan, L2 Count Plan, Quote Report =======================
s=get('Citation Scan')
CS_R="const rounds=[['DEFENDER','R1',F.cr1],['CHALLENGER','R1',F.gr1],['DEFENDER','R2',F.cr2],['CHALLENGER','R2',F.gr2],['DEFENDER','R3',F.cr3],['CHALLENGER','R3',F.dr3]].concat(F.cr4?[['DEFENDER','R4',F.cr4]]:[],F.dr4?[['CHALLENGER','R4',F.dr4]]:[]);"
s=rep(s,CS_R,CS_R[:-1]+".concat(F.synthesis?[['SYNTHESIS','S',F.synthesis]]:[]); // judge_fix9 S5: the synthesis's quotations are checked too",'Citation Scan')
CS_RET="return [{json:{items:items3.map("
s=rep(s,CS_RET,("// judge_fix9 S4: the [L2] tags of the debaters' rounds, the verses their blocks cite (read by \"L2 Words\"), and the count claims;\n"
 "// S5: the synthesis is scanned for a verdict (recorded, never counted)\n"
 "const __L2T=(()=>{try{const RA=[['DEFENDER','CR1',F.cr1],['CHALLENGER','DR1',F.gr1],['DEFENDER','CR2',F.cr2],['CHALLENGER','DR2',F.gr2],['DEFENDER','CR3',F.cr3],['CHALLENGER','DR3',F.dr3],['DEFENDER','CR4',F.cr4],['CHALLENGER','DR4',F.dr4]].filter(x=>x[2]);\n"
 " const TG=L2C.tags(RA);const keys=[...new Set(TG.flatMap(t=>t.verses))];return {l2_tags:TG,l2_urls:L2C.wordsUrls(keys).map(x=>x.url),l2_read:keys,l2_claims:L2C.countClaims(RA)};}catch(e){return {l2_tags:[],l2_urls:[],l2_read:[],l2_claims:[],l2_error:String(e.message||e).slice(0,200)};}})(); // every verse read, in batches (no cap)\n"
 "const __SYV=(()=>{const t=String(F.synthesis||'');if(!t)return [];const RX=/\\b(?:the\\s+)?(?:defender|challenger|defen[cs]e)(?:'s\\s+(?:case|chain|position))?\\s+(?:wins|won|prevails|prevailed|carries|carried|has\\s+the\\s+stronger|is\\s+(?:right|correct|vindicated))\\b|\\bverdict\\s*:|\\b(?:the\\s+)?(?:defender|challenger)(?:'s\\s+(?:case|chain|link))?\\s+(?:holds|stands|fails|collapses|is\\s+broken)\\b|\\bwinner\\b/gi;const out=[];let m;while((m=RX.exec(t))&&out.length<10)out.push(t.slice(Math.max(0,m.index-60),m.index+m[0].length+40).replace(/\\s+/g,' ').trim());return out;})();\n"
 "return [{json:{...__L2T,synth_verdict:__SYV,items:items3.map("),'Citation Scan')
put('Citation Scan',s);inject('Citation Scan',[L2_SRC],refp=True)
s=get('Quote Report')
s=rep(s,"const items=all.filter(i=>","const itemsAll=all.filter(i=>",'Quote Report')
s=rep(s,"const n=s=>items.filter(i=>s==='MATCHES'?/^MATCHES\\b/.test(i.status):i.status===s).length;",
      ("// judge_fix9 S5: the synthesis's quotations are reported apart (side SYNTHESIS); the judges' citation check reads the debaters' only\n"
       "const items=itemsAll.filter(i=>i.side!=='SYNTHESIS');const synth=itemsAll.filter(i=>i.side==='SYNTHESIS');\n"
       "const SYN=(()=>{let v=[];try{v=$('Citation Scan').first().json.synth_verdict||[];}catch(e){v=[];}const bad=synth.filter(i=>!/^MATCHES\\b/.test(i.status)&&i.status!=='NOT CHECKED');return {checked:synth.length,matches:synth.filter(i=>/^MATCHES\\b/.test(i.status)).length,not_checked:synth.filter(i=>i.status==='NOT CHECKED').length,bad:bad.map(i=>({ref:i.ref,quote:String(i.quote).slice(0,200),status:i.status})),verdict_phrases:v};})();\n"
       "// judge_fix9 S4: the [L2] check (L2 Count Plan) and the count check (L2 Counts); the rows read are kept for the judges' own [L2] (K-L2)\n"
       "const L2R=(()=>{try{const P=$('L2 Count Plan').first().json;let cr=[];try{cr=$('L2 Counts').all().map(i=>i.json).filter(r=>r&&r.strongs_number);}catch(e){cr=[];}\n"
       " const counts=L2C.countCheck(P.claims||[],cr,cr.length>=1000,P.tags||[]);return {l2:{tags:P.tags||[],counts},l2_data:{ow:P.ow||[],lex:P.lex||[],read:P.read||[]}};}catch(e){return {l2:null,l2_data:null};}})();\n"
       "const n=s=>items.filter(i=>s==='MATCHES'?/^MATCHES\\b/.test(i.status):i.status===s).length;"),'Quote Report')
s=rep(s,"if(!C.read_ok)return [{json:{unavailable:true,items:[]}}];","if(!C.read_ok)return [{json:{unavailable:true,items:[],...(()=>{try{const P=$('L2 Count Plan').first().json;return {l2:{tags:P.tags||[],counts:[]},l2_data:{ow:P.ow||[],lex:P.lex||[],read:P.read||[]}};}catch(e){return {};}})()}}]; // judge_fix9 S4: the [L2] check stands without the KJV read",'Quote Report')
s=rep(s,"mismatches:items.length-n('MATCHES')-n('NOT CHECKED'),items}}];","mismatches:items.length-n('MATCHES')-n('NOT CHECKED'),items,synthesis:SYN,...L2R}}];",'Quote Report')
put('Quote Report',s);inject('Quote Report',[L2_SRC],refp=True)
COUNT_PLAN=(HEAD+REFP_SRC+'\n'+L2_SRC+'\n// ======== end judge_fix9 libraries ========\n'
 "// L2 Count Plan (judge_fix9 S4): the [L2] check of every tag the Citation Scan read, against the words of the verses its block cites (\"L2 Words\",\n"
 "// original_words) and their lexicon rows (\"L2 Lexicon\", lexicon_words; dictionary forms only, no gloss); then the read plan of the count claims.\n"
 "const S=$('Citation Scan').first().json;let ow=[],lex=[];try{ow=$('L2 Words').all().map(i=>i.json).filter(r=>r&&r.book);}catch(e){ow=[];}try{lex=$('L2 Lexicon').all().map(i=>i.json).filter(r=>r&&r.strongs_number);}catch(e){lex=[];}\n"
 "const read=new Set(ow.map(r=>r.book+' '+r.chapter+':'+r.verse));const tags=L2C.check(S.l2_tags||[],ow,lex,[...read]); // a verse is read when its batch returned its rows; none is skipped for a cap\n"
 "const claims=S.l2_claims||[];const wn={};for(const t of tags)for(const w of t.words||[])if(w.ok&&w.num)wn[L2C.norm(w.w)]=w.num;\n"
 "const nums=claims.map(c=>c.subj||(c.word?wn[L2C.norm(c.word.w)]:null)).filter(Boolean);\n"
 "return [{json:{tags,claims,counts_url:L2C.countsUrl(nums),read:[...read],ow:ow.map(r=>({book:r.book,chapter:r.chapter,verse:r.verse,strongs_number:r.strongs_number,transliteration:r.transliteration,original_script:r.original_script,morph:r.morph})),lex:lex.map(r=>({strongs_number:r.strongs_number,original_script:r.original_script,transliteration:r.transliteration}))}}];\n")
open(f'{A}/L2 Count Plan.js','w').write(COUNT_PLAN)

# ======================= S5: the synthesis prompt =======================
s=get('Build Synthesis')
s=rep(s,"5. Most vulnerable? Do NOT deliver a verdict.'}]}};","5. Most vulnerable? Do NOT deliver a verdict.'+__SYNTH9}]}};",'Build Synthesis')
s="const __SYNTH9="+J(TX.SYNTH)+"; // judge_fix9 S5: the synthesis quotes only the record and gives no verdict; its quotations are checked (Citation Scan)\n"+s
put('Build Synthesis',s)

# ======================= the record: Build Save Body and Format Markdown =======================
FK_A="(K-S|K-S2|K-LXX|K-C|K-N|K-SC|K-K|K-DG8)"
FK_B="(K-G6|K-G10|K-V)"
s=get('Format Markdown')
s=rep(s,FK_A,"(K-S|K-S2|K-LXX|K-C|K-N|K-SC|K-K|K-DG8|K-F|K-L2|K-P)",'Format Markdown');s=rep(s,FK_B,"(K-G6|K-G10|K-V|K-P|K-R)",'Format Markdown')
s=rep(s,"'K-V': 'VOID ruling without the charge words or the kind (K-V)',",
      "'K-V': 'VOID ruling without the charge words or the kind (K-V)', 'K-P': 'Unproven press counted as a witness (K-P)', 'K-F': 'Forced link without its three quotations (K-F)', 'K-R': 'Press proven by reference without a REFERENCE line (K-R)', 'K-L2': 'Judge [L2] not in the cited verse (K-L2)',",'Format Markdown')
s=rep(s,"if (QRd && !QRd.unavailable && Array.isArray(QRd.items)) {",
      "if (QRd && QRd.synthesis && QRd.synthesis.checked) { const Sy = QRd.synthesis; t += '## Citation check of the synthesis\\n\\nThe synthesis quotes only the record (judge_fix9 S5): ' + Sy.checked + ' quotation' + (Sy.checked === 1 ? '' : 's') + ' checked against the KJV, ' + Sy.matches + ' match' + (Sy.bad.length ? '; these do not:\\n\\n' + Sy.bad.map(b => '- ' + b.ref + ': \"' + b.quote + '\" -- ' + b.status).join('\\n') : '.') + (Sy.verdict_phrases && Sy.verdict_phrases.length ? '\\n\\nThe synthesis gives no verdict; these phrases read as one and are recorded for review: ' + Sy.verdict_phrases.map(v => '\"' + v + '\"').join('; ') : '') + '\\n\\n'; } // judge_fix9 S5\n"
      "if (QRd && !QRd.unavailable && Array.isArray(QRd.items)) {",'Format Markdown')
put('Format Markdown',s)
s=get('Build Save Body')
s=rep(s,FK_A,"(K-S|K-S2|K-LXX|K-C|K-N|K-SC|K-K|K-DG8|K-F|K-L2|K-P)",'Build Save Body');s=rep(s,FK_B,"(K-G6|K-G10|K-V|K-P|K-R)",'Build Save Body')
s=rep(s,"const __CC=(()=>{try{const q=$('Quote Report').first().json;",
      "// judge_fix9 S4, S5: review lines for the [L2] check, the count check and the synthesis's citation check and verdict scan\n"
      "const __L2RV=(()=>{try{const q=$('Quote Report').first().json;const out=[];if(q&&q.l2&&Array.isArray(q.l2.tags)){const T=q.l2.tags.filter(t=>t.status!=='IGNORED');const n=s=>T.filter(t=>t.status===s).length;out.push('[AUDIT v28: [L2] CHECK -- '+T.length+' tags; '+n('COUNTED')+' COUNTED; '+n('NOT COUNTED')+' NOT COUNTED; '+n('UNVERIFIABLE')+' UNVERIFIABLE'+(n('NOT COUNTED')?': '+T.filter(t=>t.status==='NOT COUNTED').slice(0,12).map(t=>t.round+' '+(t.words||[]).map(w=>w.w).join('/')).join(', '):'')+'.]');\n"
      " const D=(q.l2.counts||[]).filter(c=>/DIFFERS/.test(c.status));if(D.length)out.push('[AUDIT v28: [L2] COUNT DIFFERS FROM THE RECORD -- '+D.map(c=>c.round+' \"'+c.said+'\" ('+c.num+'): '+c.status).join('; ')+'. REVIEW THIS ROW.]');}\n"
      " if(q&&q.synthesis){const Y=q.synthesis;if(Y.bad&&Y.bad.length)out.push('[AUDIT v28: SYNTHESIS CITATION CHECK -- '+Y.bad.length+' of '+Y.checked+' quotations do not match the KJV: '+Y.bad.map(b=>b.ref+' ('+b.status+')').join('; ')+'. REVIEW THIS ROW.]');if(Y.verdict_phrases&&Y.verdict_phrases.length)out.push('[AUDIT v28: SYNTHESIS VERDICT -- the synthesis gives no verdict; these phrases read as one: '+Y.verdict_phrases.map(v=>'\"'+String(v).replace(/[\\[\\]\"]/g,'')+'\"').join('; ')+'. REVIEW THIS ROW.]');}\n"
      " return out;}catch(e){return [];}})();\n"
      "const __CC=(()=>{try{const q=$('Quote Report').first().json;",'Build Save Body')
s=rep(s,"for(const nd of ['D1','C1','D2','C2','D3','C3','D4','C4']){let fx=null;","for(const x of __L2RV)FF.push(x); // judge_fix9 S4, S5\nfor(const nd of ['D1','C1','D2','C2','D3','C3','D4','C4']){let fx=null;",'Build Save Body')
put('Build Save Body',s)

# ======================= S4: the nodes fix set 9 adds (add/nodes_9.json): the [L2] reads, paginated =======================
# Each round 2-4 sheet: "<R> Verse Sheet" -> "<R> Words Plan" (code: one item per batch of 20 verses, from the Extract's plan; every cited
# verse) -> "<R> Words Sheet" (one original_words request per item) -> "<R> Lexicon Plan" (code: the Strong's numbers read, function words left
# out, batches of 250) -> "<R> Lexicon Sheet" (one lexicon_words request per item, gloss included) -> "<R> Build". The judges' path: "Find
# Words" -> "L2 Words Plan" -> "L2 Words" -> "L2 Lexicon Plan" (no gloss; every number) -> "L2 Lexicon" -> "L2 Count Plan" (the check; the
# counts' read) -> "L2 Counts" -> "Quote Report". The HTTP nodes always output and continue on error, as the Verse Sheet nodes do; a failed
# batch leaves its verses unread (the sheet lists them; the check marks their tags UNVERIFIABLE). Credentials: the Verse Sheet nodes'.
WF=json.load(open(H+'/data/workflow_live.json'));NODES={x['name']:x for x in WF['nodes']}
CRED=NODES['D2 Verse Sheet']['credentials']
NS=uuid.UUID('6a1f0c9e-9f00-4c3a-9a39-000000000009')
SB='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/'
EMPTY=SB+'original_words?select=book&id=eq.-1';EMPTYLEX=SB+'lexicon_words?select=strongs_number&strongs_number=in.(NONE)'
def http(name,pos,url="={{ $json.url }}",once=False):
    n={'id':str(uuid.uuid5(NS,name)),'name':name,'type':'n8n-nodes-base.httpRequest','typeVersion':4.3,'alwaysOutputData':True,'retryOnFail':True,'maxTries':3,'waitBetweenTries':3000,'onError':'continueRegularOutput',
       'position':pos,'parameters':{'url':url,'authentication':'genericCredentialType','genericAuthType':'httpHeaderAuth','options':{}},'credentials':CRED}
    if once: n['executeOnce']=True
    return n
def code(name,pos,fname,body):
    open(f'{A}/{fname}.js','w').write(body)
    return {'id':str(uuid.uuid5(NS,name)),'name':name,'type':'n8n-nodes-base.code','typeVersion':2,'executeOnce':True,'position':pos,'parameters':{'jsCode':'@file:add/'+fname+'.js'}}
WPLAN=lambda src,who:("// "+who+" (judge_fix9 S4): one item per batch of verses to read from original_words (L2C.wordsUrls, planned by \""+src+"\"): every cited\n"
 "// verse is read, none left off for a cap. With no plan (a run of the old shape) one item whose read returns nothing.\n"
 "let P={};try{P=$('"+src+"').first().json||{};}catch(e){P={};}const U=Array.isArray(P.l2_urls)&&P.l2_urls.length?P.l2_urls:['"+EMPTY+"'];\nreturn U.map(url=>({json:{url}}));\n")
LPLAN=lambda src,who,sheet:(HEAD+L2_SRC+'\n// ======== end judge_fix9 libraries ========\n'
 "// "+who+" (judge_fix9 S4): one item per batch of 250 Strong's numbers of the words \""+src+"\" read"+(" (function words left out: articles, conjunctions,\n// prepositions, particles, pronouns, by morph code; the gloss is read for the debaters' sheet)" if sheet else " (every number; no gloss: the judges get none)")+".\n"
 "let ow=[];try{ow=$('"+src+"').all().map(i=>i.json).filter(r=>r&&r.book);}catch(e){ow=[];}const U=L2C.lexUrls(ow,{sheet:"+('true' if sheet else 'false')+"});\nreturn (U.length?U:['"+EMPTYLEX+"']).map(url=>({json:{url}}));\n")
ADD=[];RM=[];AL=[]
for r,prev in SHEET_ROUNDS:
    vs=NODES[r+' Verse Sheet']['position'];x,y=vs
    ADD.append(code(r+' Words Plan',[x,y+112],r+' Words Plan',WPLAN(prev,r+' Words Plan')))
    ADD.append(http(r+' Words Sheet',[x+112,y+112]))
    ADD.append(code(r+' Lexicon Plan',[x,y+224],r+' Lexicon Plan',LPLAN(r+' Words Sheet',r+' Lexicon Plan',True)))
    ADD.append(http(r+' Lexicon Sheet',[x+112,y+224]))
    RM.append([r+' Verse Sheet','main',0,r+' Build','main',0])
    ch=[r+' Verse Sheet',r+' Words Plan',r+' Words Sheet',r+' Lexicon Plan',r+' Lexicon Sheet',r+' Build']
    AL+=[[ch[i],'main',0,ch[i+1],'main',0] for i in range(len(ch)-1)]
fx,fy=NODES['Find Words']['position']
ADD.append(code('L2 Words Plan',[fx,fy+176],'L2 Words Plan',WPLAN('Citation Scan','L2 Words Plan')))
ADD.append(http('L2 Words',[fx+112,fy+176]))
ADD.append(code('L2 Lexicon Plan',[fx+224,fy+176],'L2 Lexicon Plan',LPLAN('L2 Words','L2 Lexicon Plan',False)))
ADD.append(http('L2 Lexicon',[fx+336,fy+176]))
ADD.append({'id':str(uuid.uuid5(NS,'L2 Count Plan')),'name':'L2 Count Plan','type':'n8n-nodes-base.code','typeVersion':2,'executeOnce':True,'position':[fx+448,fy+176],'parameters':{'jsCode':'@file:add/L2 Count Plan.js'}})
ADD.append(http('L2 Counts',[fx+560,fy+176],"={{ $('L2 Count Plan').first().json.counts_url || '"+EMPTY+"' }}",once=True))
RM.append(['Find Words','main',0,'Quote Report','main',0])
ch=['Find Words','L2 Words Plan','L2 Words','L2 Lexicon Plan','L2 Lexicon','L2 Count Plan','L2 Counts','Quote Report']
AL+=[[ch[i],'main',0,ch[i+1],'main',0] for i in range(len(ch)-1)]
json.dump({'nodes':ADD,'remove_links':RM,'add_links':AL},open(A+'/nodes_9.json','w'),ensure_ascii=False,indent=1)
print('add/:',len(ADD),'nodes;',len(RM),'links removed,',len(AL),'added')

# ======================= write =======================
for nm,s in OUT.items(): open(f'{N}/{nm}.js','w').write(s)
print('new/:',len(OUT),'nodes written:',', '.join(sorted(OUT)))
