# patch.py (judge_fix7): builds new/<node>.js from base/<node>.js (the live code of ORACLE_DEBATE_V1 version 9165fb8a, read by GET on
# 2026-11-02 into data/workflow_live.json and data/live_code/; equal to judge_fix6/new for the 30 nodes fix set 6 changed) and lib/.
# Offline; writes only new/. Anchored replacements: it refuses when an anchor is not found the expected number of times.
#  J1 K-G4 judges each pressed witness on its own (lib/kg4.js): unanswered-false only when every witness the line rests on was answered
#  J2 K-G6 and K-G9 never mark a premise the seat ruled VOID (lib/cited_void.js); no cure count may include a VOID premise (lib/void.js)
#  J3 K-C: a line retracted under a counted RETRACTED line, or restated with its footing exhibited in the STATEMENT, is cured;
#     K-G9: a VOID re-ruling in the STATEMENT (premises named VOID, the transcript quoted) cures the verses of those premises
#  J4 each seat's system is the same in all four rounds (DEFENSE DISCIPLINE moves into the D1 and D2 user turns); C2 sends C1's opening message
#     as sent, as D2 sends D1's; rounds 3 and 4 unchanged
#  J5 the link-round format check (lib/linkform.js): no "LINK n:" block, or headed as another round, is a format fault (review_notes, a judge line)
#  J6 the engine opus (model_config row opus, anthropic/claude-opus-5.5), display name Claude Opus
import os,sys
H=os.path.dirname(os.path.abspath(__file__));B=H+'/base';N=H+'/new';L=H+'/lib';os.makedirs(N,exist_ok=True)
def rep(s,old,new,nm,count=1):
    c=s.count(old)
    if c!=count: sys.exit(f'{nm}: anchor found {c} times, want {count}: {old[:140]!r}')
    return s.replace(old,new)
lib=lambda n:open(f'{L}/{n}').read().rstrip('\n')
OUT={}
def get(nm):
    if nm not in OUT: OUT[nm]=open(f'{B}/{nm}.js').read()
    return OUT[nm]
CHECK=['Panel Payloads','Alternate Payloads','Extract Independent Verdict']
CURE=['Alternate Build','Alternate Cure Build','Alternate Cure Normalize','Alternate Merge','Cure Build','Cure Check','Cure Normalize',
      'Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Panel Cure Check','Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3']

# ======================= J5 (all 17): ciRounds ends a round at the link-round format note as at the close-round notes =======================
CIR_OLD="const c=t.indexOf('\\n\\n[CLOSE-ROUND',x.e);if(c>=0&&c<end)end=c;out[x.k]=t.slice(x.e,end);"
CIR_NEW=("const c=t.indexOf('\\n\\n[CLOSE-ROUND',x.e);if(c>=0&&c<end)end=c;const c7=t.indexOf('\\n\\n[LINK-ROUND FORMAT CHECK',x.e);if(c7>=0&&c7<end)end=c7; /* judge_fix7 J5 */"
         "out[x.k]=t.slice(x.e,end);")
for nm in CHECK+CURE:
    OUT[nm]=rep(get(nm),CIR_OLD,CIR_NEW,nm)

# ======================= J2: the checkers (K-G6 drvLedger, K-G9 drvCited) skip VOID premises =======================
for nm in CHECK:
    s=get(nm)
    s=rep(s,"function drvLedger(text,ptext,dConc,cConc,dStand,cStand,CPV){",lib('cited_void.js')+"\nfunction drvLedger(text,ptext,dConc,cConc,dStand,cStand,CPV){",nm)
    s=rep(s," const countLine=side=>drvCountLine(T,side);\n",
          " const countLine=side=>drvCountLine(T,side);\n const VD={DEFENDER:lbVoid(text,'DEFENDER'),CHALLENGER:lbVoid(text,'CHALLENGER')}; // judge_fix7 J2: the premises the seat ruled VOID\n",nm)
    s=rep(s,"   if(cp.present&&cp.set.has(+m[1]))continue;\n   const id=side+' premise '+m[1];\n   items.push({rule:'K-G6',side,link:id,line:l,conc:cp.present?cp.set.size:sc,st:side==='DEFENDER'?dStand:cStand,L:LG[side].length});",
          "   if(cp.present&&cp.set.has(+m[1]))continue;\n   if(VD[side].has(+m[1]))continue; // judge_fix7 J2: a premise the seat ruled VOID counts for neither side and is never marked\n"
          "   const id=side+' premise '+m[1];\n   items.push({rule:'K-G6',side,link:id,line:l,conc:cp.present?cp.set.size:sc,st:side==='DEFENDER'?dStand:cStand,L:LG[side].length,void:lbVoidList(VD[side])});",nm)
    # drvCited: VOID premises, missing rulings and uncounted verses
    s=rep(s,"  const missing=[],why=[];const mine=",
          "  const VD=lbVoid(text,side);const PL=ciPlist(R,side);const onVoid=z=>ciVoidOf(z,PL,VD); // judge_fix7 J2\n  const missing=[],why=[];const mine=",nm)
    s=rep(s,"  if(lg)for(const lab of lg.labels){const K=ciKeys(lab);const rs=mine.filter(x=>[...x.keys].some(k=>K.has(k)));if(!rs.length){missing.push(lab);continue;}",
          "  if(lg)for(const lab of lg.labels){const K=ciKeys(lab);if(onVoid({ref:lab,keys:K}))continue; /* judge_fix7 J2: a verse of a VOID premise needs no ruling */const rs=mine.filter(x=>[...x.keys].some(k=>K.has(k)));if(!rs.length){missing.push(lab);continue;}",nm)
    s=rep(s,"const uncounted=pu.filter(x=>typeof conc!=='number'||conc<1||![...x.keys].some(k=>CK.has(k))).map(x=>x.ref);",
          "const uncounted=pu.filter(x=>!onVoid(x)).filter(x=>typeof conc!=='number'||conc<1||![...x.keys].some(k=>CK.has(k))).map(x=>x.ref); /* judge_fix7 J2: not a verse of a VOID premise */",nm)
    s=rep(s,"items.push({rule:'K-G9',side,link:side+' CITED-IN',line,missing,uncounted:[...new Set(uncounted)],conc:typeof conc==='number'?conc:0,st,L:(LN&&LN[side])||null});",
          "items.push({rule:'K-G9',side,link:side+' CITED-IN',line,missing,uncounted:[...new Set(uncounted)],conc:typeof conc==='number'?conc:0,st,L:(LN&&LN[side])||null,void:lbVoidList(VD),plist:PL.map(p=>({n:p.n,keys:p.keys}))});",nm)
    # J2: lbVoid reads "Premises 1, 4, and 5 are VOID" (run 32302 ChatGPT: the serial comma before "and" stopped the list at 4)
    s=rep(s,"const ns=[...s.matchAll(/\\bPremises?\\s+(\\d+(?:\\s*(?:,|and|&|or)\\s*\\d+)*)/gi)]","const ns=[...s.matchAll(/\\bPremises?\\s+(\\d+(?:\\s*(?:,\\s*(?:and|or|&)?|and|&|or)\\s*\\d+)*)/gi)] /* judge_fix7 J2: serial comma */",nm)
    # K-LB items carry the VOID set too (the cure's count cap)
    s=rep(s,"kinds:k,conc:cp.present?cp.set.size:sc,st:side==='DEFENDER'?dStand:cStand,L:(LN&&LN[side])||null});",
          "kinds:k,conc:cp.present?cp.set.size:sc,st:side==='DEFENDER'?dStand:cStand,L:(LN&&LN[side])||null,void:lbVoidList(VD)});",nm)
    OUT[nm]=s

# ======================= J1, J2, J3: the cure library (14 nodes) =======================
KG4_PROMPT_OLD="for each pressed witness your line and your PRESSED quotation name; if any of those rounds names the witness, it was answered, the BROKEN grade is unanswered-false and only RETRACTED cures it."
KG4_PROMPT_NEW=("for each pressed witness your line and your PRESSED quotation name, each witness on its own; a witness one of those rounds names was answered. "
 "The BROKEN grade is unanswered-false, and only RETRACTED cures it, when every witness the line rests on as unanswered was answered: those its GROUND names, "
 "or all of them when the GROUND names none. While one of them is named in no later round, the grade stands (judge_fix7 J1).")
for nm in CURE:
    s=get(nm)
    s=rep(s,"const kg4Txt=a=>a.map(z=>'['+z.round+'] '+z.ref+' at '+z.pos).join('; ');",
          "const kg4Txt=a=>a.map(z=>'['+z.round+'] '+z.ref+' at '+z.pos).join('; ');\n"+lib('kg4.js')+"\n"+lib('void.js'),nm)
    s=rep(s,"    const an=kg4Answered(x.side,x.line,[sp],R);if(an.length)return res('UNCURED','unanswered-false: statement quotes '+sp.round+', but a later '+x.side.toLowerCase()+' round names the pressed witness: '+kg4Txt(an),lines.concat([sp.line]));\n"
            "    return res('CURED','statement passes the check: quotation found in '+sp.round+'; the pressed witness is named in no later '+x.side.toLowerCase()+' round',lines.concat([sp.line]));}",
          "    const ks=kg4Split(x.side,x.line,[sp],R);if(ks.rests.length&&!ks.open.length)return res('UNCURED','unanswered-false: statement quotes '+sp.round+', but a later '+x.side.toLowerCase()+' round names every pressed witness the line rests on: '+kg4Txt(ks.answered),lines.concat([sp.line])); // judge_fix7 J1\n"
          "    return res('CURED',kg4Why(ks,x.side,'statement passes the check: quotation found in '+sp.round),lines.concat([sp.line]));}",nm)
    s=rep(s,"   const an=kg4Answered(x.side,x.line,hits,R);if(an.length)return res('UNCURED','unanswered-false: quotation found in '+hits.map(p=>p.round).join(', ')+', but a later '+x.side.toLowerCase()+' round names the pressed witness: '+kg4Txt(an),lines);\n"
            "   return res('CURED','pressed: quotation found in '+hits.map(p=>p.round).join(', ')+'; the pressed witness is named in no later '+x.side.toLowerCase()+' round',lines);}",
          "   const ks=kg4Split(x.side,x.line,hits,R);if(ks.rests.length&&!ks.open.length)return res('UNCURED','unanswered-false: quotation found in '+hits.map(p=>p.round).join(', ')+', but a later '+x.side.toLowerCase()+' round names every pressed witness the line rests on: '+kg4Txt(ks.answered),lines); // judge_fix7 J1\n"
          "   return res('CURED',kg4Why(ks,x.side,'pressed: quotation found in '+hits.map(p=>p.round).join(', ')),lines);}",nm)
    s=rep(s,KG4_PROMPT_OLD,KG4_PROMPT_NEW,nm)
    # J2: no corrected count may count a VOID premise (kCount: K-G6, K-G7, K-G8, K-LB)
    s=rep(s,"   if(ns[0]<needN)return res('UNCURED','corrected count '+ns[0]+' is below '+needN,lines);\n   if(sv.length>1)",
          "   if(ns[0]<needN)return res('UNCURED','corrected count '+ns[0]+' is below '+needN,lines);\n"
          "   if(ns[0]>cvCap(x))return res('UNCURED','corrected count '+ns[0]+' counts a premise the seat ruled VOID ('+cvTxt(x)+' of '+x.L+'; a VOID premise counts for neither side, so the count is at most '+cvCap(x)+')',lines); // judge_fix7 J2\n   if(sv.length>1)",nm)
    # J2/J3: K-G9 -- verses of VOID premises (the seat's, or re-ruled VOID in the STATEMENT) need no count; the count never includes a VOID premise
    s=rep(s,"   const still=(x.uncounted||[]).filter(ref=>!hit(ref,RU).some(z=>ok9(z)&&(z.kind==='NOT PRESSED'||z.ans==='ANSWERED')));const need=[...new Set(pu.concat(still))];\n"
            "   if(!need.length)return res('CURED','every listed verse ruled; none PRESSED and UNANSWERED',lines);",
          "   const still=(x.uncounted||[]).filter(ref=>!hit(ref,RU).some(z=>ok9(z)&&(z.kind==='NOT PRESSED'||z.ans==='ANSWERED')));const need0=[...new Set(pu.concat(still))];\n"
          "   // judge_fix7 J2/J3 (run 32302, enforcer row 109: Sol re-ruled the charges of the pressed verses VOID and was refused for giving no CORRECTED\n"
          "   // COUNT): a verse of a listed premise the seat ruled VOID, or that the STATEMENT re-rules VOID (premises named VOID, the transcript quoted),\n"
          "   // is not counted; a verse of no listed premise is excused only by such a re-ruling.\n"
          "   const st9=stmtOf(x);const rv=cvStmtVoid(st9);const rr=(rv.all||rv.set.size>0)&&!!sq(x);const V9=new Set([...cvSet(x.void)].concat(rr?[...rv.set]:[]));const vall=!!(x.void&&x.void.all)||(rr&&rv.all);\n"
          "   const vOf=ref=>{const ps=cvPrem(x,ref);return ps.length?(vall||ps.every(j=>V9.has(j))):rr;};const exc=need0.filter(vOf);const need=need0.filter(r=>!vOf(r));\n"
          "   if(!need.length&&exc.length)return res('CURED','VOID: '+exc.join(', ')+' '+(exc.length>1?'were':'was')+' pressed only under premises ruled VOID ('+(vall?'every premise':[...V9].sort((a,b)=>a-b).join(', '))+(rr?'; re-ruled in the STATEMENT, which quotes the transcript':'')+'); a VOID premise counts for neither side',lines.concat(st9?['STATEMENT: '+st9]:[]));\n"
          "   if(!need.length)return res('CURED','every listed verse ruled; none PRESSED and UNANSWERED',lines);",nm)
    s=rep(s,"const needN=Math.max(1,(x.conc||0)+(named?0:1))+kNeed(x.side,x);if(n9<needN)return res('UNCURED','corrected count '+n9+' is below '+needN+' (ruled PRESSED and UNANSWERED: '+need.join(', ')+')',ls);",
          "const needN=Math.max(1,(x.conc||0)+(named?0:1))+kNeed(x.side,x);if(n9<needN)return res('UNCURED','corrected count '+n9+' is below '+needN+' (ruled PRESSED and UNANSWERED: '+need.join(', ')+')',ls);\n"
          "   if(n9>cvCap(x))return res('UNCURED','corrected count '+n9+' counts a premise the seat ruled VOID ('+cvTxt(x)+' of '+x.L+'; a VOID premise counts for neither side, so the count is at most '+cvCap(x)+')',ls); // judge_fix7 J2",nm)
    # J3: K-C -- a retracted line, or footing exhibited in the STATEMENT
    s=rep(s,"  if(x.rule==='K-C'){const rs=cureRest(o,x);\n   if(!rs.length)return res('UNCURED','no RESTATED line for '+x.link,null);",
          "  // judge_fix7 J3 (run 32302, enforcer row 107: Sol retracted \"D3 vs C3\" under a counted RETRACTED line, restated it UNDERDETERMINED on a weighing\n"
          "  // ground, and gave the chain footing ([L1] Matthew 1:25, [L2] synerchomai, [L3] Genesis 4:1) in its K-C STATEMENT; the check read the restated line\n"
          "  // only, found no layer tag and left the item UNCURED): the grade the K-C item marked is withdrawn when the line is retracted (and, if restated, the\n"
          "  // restated line drops the stating ground); otherwise the footing may stand in the item's STATEMENT, which must itself drop the stating ground.\n"
          "  if(x.rule==='K-C'){const rs=cureRest(o,x);\n   if(!rs.length&&wd.has(U(x.link)))return res('CURED','retracted under a counted RETRACTED line',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));\n"
          "   if(!rs.length)return res('UNCURED','no RESTATED line for '+x.link,null);",nm)
    s=rep(s,"   const k=drvKinds(rs[0].text);if(k.length<2)return res('UNCURED','the restated line names no chain footing: it exhibits '+k.length+' layer kind'+(k.length===1?'':'s'),[rs[0].line],k);",
          "   const k=drvKinds(rs[0].text);if(k.length<2){const st=stmtOf(x);const sk=st&&!netKeeps(st)?drvKinds(st):[];\n"
          "    if(wd.has(U(x.link))&&!/LINK BROKEN$/.test(rs[0].grade||''))return res('CURED','retracted under a counted RETRACTED line and restated '+(rs[0].grade||'')+' without the stating ground',[rs[0].line].concat(st?['STATEMENT: '+st]:[]),sk.length?sk:k); // judge_fix7 J3\n"
          "    if(sk.length>=2)return res('CURED','the restated line drops the stating ground; the chain footing is exhibited in the STATEMENT ('+sk.join(' and ')+')',[rs[0].line,'STATEMENT: '+st],sk); // judge_fix7 J3\n"
          "    return res('UNCURED','the restated line names no chain footing: it exhibits '+k.length+' layer kind'+(k.length===1?'':'s')+(st?', and the STATEMENT '+(sk.length?'exhibits '+sk.length:'keeps the stating ground or exhibits fewer than two'):''),[rs[0].line],k);}",nm)
    OUT[nm]=s

# ======================= J4 (narrowed, coordinator 2026-11-02): the system is the same in every round; C2 and D2 resend the opening as sent =======================
# (a) DEFENSE DISCIPLINE moves, unchanged, from the D1 and D2 system into the end of the D1 and D2 user turn (before the verse sheet), so each
#     seat's system is I.dsys or I.csys, one block, byte-identical in all four rounds (32302 D3: system_changed).
# (b) C1 stores its opening message as sent (opening_user, verse sheet included), and C2 sends it unchanged as message 0, as D2 already does with
#     D1's (32302 C2: messages_changed). Rounds 3 and 4 are not touched: a fresh conversation, as now.
SYSB_OLD="// cachefix: Claude cache markers. System split at the DEFENSE DISCIPLINE block (D3 sends the instructions without it); last message marked."
SYSB_NEW=("// cachefix: Claude cache markers. System split at the DEFENSE DISCIPLINE block (D3 sends the instructions without it); last message marked.\n"
          "// judge_fix7 J4: no system holds that block now (it sits at the end of the D1 and D2 user turn), so each seat's system is one block, the same\n"
          "// in every round; with the last-message marker a request carries two cache_control breakpoints (the limit is four), all with the 1-hour TTL.")
for nm in ['D1 Build','D2 Build','C1 Build','C2 Build']:
    OUT[nm]=rep(get(nm),SYSB_OLD,SYSB_NEW,nm)
s=get('D1 Build')
s=rep(s,"const sys=I.dsys+DD;const msgs=[{role:'user',content:'DEBATE TOPIC: '+I.topic+'\\n\\nOpen the debate.","const sys=I.dsys;const msgs=[{role:'user',content:'DEBATE TOPIC: '+I.topic+'\\n\\nOpen the debate.",'D1 Build')
s=rep(s,"every later round is scored against it.'}];","every later round is scored against it.'+DD}]; // judge_fix7 J4: DEFENSE DISCIPLINE in the user turn, unchanged",'D1 Build')
OUT['D1 Build']=s
s=get('D2 Build')
s=rep(s,"const sys=I.dsys+DD;const msgs=[{role:'user',content:($('D1 Build').first().json.opening_user||'DEBATE TOPIC: '+I.topic)},{role:'assistant',content:$('D1 Extract').first().json.raw},{role:'user',content:'THE CHALLENGER ANSWERED:\\n\\n'+$('C1 Extract').first().json.raw+'\\n\\nRound 2. Tag every layer.'}];",
      "const sys=I.dsys;const msgs=[{role:'user',content:($('D1 Build').first().json.opening_user||'DEBATE TOPIC: '+I.topic)},{role:'assistant',content:$('D1 Extract').first().json.raw},{role:'user',content:'THE CHALLENGER ANSWERED:\\n\\n'+$('C1 Extract').first().json.raw+'\\n\\nRound 2. Tag every layer.'+DD}]; // judge_fix7 J4: DEFENSE DISCIPLINE in the user turn, unchanged",'D2 Build')
OUT['D2 Build']=s
s=get('C1 Build')
s=rep(s,"return [{json:{run_token:TOK,round:'C1',call:","return [{json:{run_token:TOK,round:'C1',opening_user:msgs[0].content,call:",'C1 Build') # judge_fix7 J4 (b)
OUT['C1 Build']=s
s=get('C2 Build')
s=rep(s,"const sys=I.csys;const msgs=[{role:'user',content:'DEBATE TOPIC: '+I.topic+'\\n\\nThe defender opened:\\n\\n'+$('D1 Extract').first().json.raw+'\\n\\nChallenge this. Verse-level precision.'},",
      "const sys=I.csys;const msgs=[{role:'user',content:(()=>{let o=null;try{o=$('C1 Build').first().json.opening_user;}catch(e){o=null;}return typeof o==='string'&&o?o:'DEBATE TOPIC: '+I.topic+'\\n\\nThe defender opened:\\n\\n'+$('D1 Extract').first().json.raw+'\\n\\nChallenge this. Verse-level precision.';})()}, /* judge_fix7 J4 (b): C1's opening message as sent, verse sheet included */",'C2 Build')
OUT['C2 Build']=s

# ======================= J5: the link-round format check =======================
LRF=lib('linkform.js')
for nm,sd in [('D3 Extract','D'),('C3 Extract','C')]:
    s=get(nm);s=LRF+'\n'+s
    s=rep(s,f"return [{{json:{{run_token:TOK,round:'{nm[:2]}',raw,labelled,",f"const link_format=(()=>{{try{{return LRF.check(raw);}}catch(x){{return null;}}}})(); // judge_fix7 J5\nreturn [{{json:{{run_token:TOK,round:'{nm[:2]}',raw,labelled,link_format,",nm)
    OUT[nm]=s
s=LRF+'\n'+get('Panel Build')
s=rep(s,"['[CR3] DEFENDER R3 -- LINK ROUND (defender exhibit-or-concede)',SAN(F.cr3)],['[DR3] CHALLENGER R3 -- LINK ROUND (challenger exhibit-or-concede)',SAN(F.dr3)],",
      "['[CR3] DEFENDER R3 -- LINK ROUND (defender exhibit-or-concede)',F.cr3?SAN(F.cr3)+LRF.note(F.cr3,'D'):SAN(F.cr3)],['[DR3] CHALLENGER R3 -- LINK ROUND (challenger exhibit-or-concede)',F.dr3?SAN(F.dr3)+LRF.note(F.dr3,'C'):SAN(F.dr3)], /* judge_fix7 J5 */",'Panel Build')
OUT['Panel Build']=s
s=LRF+'\n'+get('Build Independent Verdict')
s=rep(s,"(d.cr3?SAN(d.cr3):'(missing)')","(d.cr3?SAN(d.cr3)+LRF.note(d.cr3,'D'):'(missing)')",'Build Independent Verdict')
s=rep(s,"(d.dr3?SAN(d.dr3):'(missing)')","(d.dr3?SAN(d.dr3)+LRF.note(d.dr3,'C'):'(missing)')",'Build Independent Verdict')
OUT['Build Independent Verdict']=s
s=LRF+'\n'+get('Build Save Body')
s=rep(s,"{let np=[];try{np=C4P.of(d);}catch(e){np=[];}",
      "for(const sd of ['D','C']){let a='';try{a=LRF.audit(sd==='D'?d.cr3:d.dr3,sd);}catch(e){a='';}if(a)FF.push(a);} // judge_fix7 J5\n{let np=[];try{np=C4P.of(d);}catch(e){np=[];}",'Build Save Body')
OUT['Build Save Body']=s
s=LRF+'\n'+get('Failure Salvage')
s=rep(s," if(cd.length)body.review_notes=(body.review_notes?body.review_notes+' ':'')+cd.join(' ');}",
      " if(cd.length)body.review_notes=(body.review_notes?body.review_notes+' ':'')+cd.join(' ');}\n"
      "// judge_fix7 J5: the link-round format faults the D3 and C3 Extracts recorded, unless already there.\n"
      "{const lf=[];[['D3','D','cr3'],['C3','C','dr3']].forEach(([r,sd])=>{const t=P(r+' Extract',j=>j.raw);const a=typeof t==='string'?LRF.audit(t,sd):'';if(a&&!String(body.review_notes||'').includes(a))lf.push(a);});\n"
      " if(lf.length)body.review_notes=(body.review_notes?body.review_notes+' ':'')+lf.join(' ');}",'Failure Salvage')
OUT['Failure Salvage']=s

# ======================= J6: the engine opus (operator: "let's go with opus 5.5") =======================
s=get('Init Seats')
s=rep(s,"haiku:{fam:'openrouter',mc:'haiku'},","haiku:{fam:'openrouter',mc:'haiku'},opus:{fam:'openrouter',mc:'opus'}, /* judge_fix7 J6: the Oracle seat from now on (model_config row opus, anthropic/claude-opus-5.5) */",'Init Seats')
OUT['Init Seats']=s
s=get('Format Markdown')
s=rep(s,"haiku:'Claude Haiku',","haiku:'Claude Haiku',opus:'Claude Opus',",'Format Markdown')
OUT['Format Markdown']=s
s=get('Failure Salvage')
s=rep(s,"haiku:'Claude Haiku',","haiku:'Claude Haiku',opus:'Claude Opus',",'Failure Salvage')
OUT['Failure Salvage']=s

base=sorted(f[:-3] for f in os.listdir(B) if f.endswith('.js'))
miss=[n for n in base if n not in OUT]
if miss: sys.exit('base nodes not patched: '+', '.join(miss))
for nm,s in OUT.items():
    if nm not in base: sys.exit(nm+': not in base/')
    open(f'{N}/{nm}.js','w').write(s)
print(f'wrote {len(OUT)} nodes to new/')
