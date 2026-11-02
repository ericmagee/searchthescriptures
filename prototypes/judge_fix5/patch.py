# patch.py (judge_fix5): builds new/<node>.js from base/<node>.js (the live code of ORACLE_DEBATE_V1 version 681c085a, read by GET on
# 2026-11-02; base/ equals judge_fix4/new for every node judge_fix4 changed). Offline; writes only new/ and flow/nodes.json (the nodes added and
# the connections changed, read by write_package.py). Anchored replacements: it refuses when an anchor is not found the expected number of times.
#  G1 close rounds get the declared chain and the [DR3] C list; the numbering check reads wording and label content
#  G2 K-G9: every judge rules on the ledger's cited-in line in a fixed form; a PRESSED and UNANSWERED verse must be counted (ruling 372)
#  G3 a close sentence that grades or presses the other side is DISREGARDED (printed beside the close, a review line)
#  G4 a reserve substitution prints one line (seat, reason, reserve; HTTP status and body length where exposed)
#  G5 one reference parser (REFP) for the ledger, the close checks, the citation scan, K-G4, K-G6, K-G9 and the C-label record
#  G6 escapes removed before quote matching      G7 hyphen switch in the quote match, default OFF
#  G8 transcript header: the outcome first, with one computed line when verdict and outcome differ
#  G9 one retry of the DeepSeek panel call on an empty reply (two nodes added)      G10 synthesis checks S-D widened and S-F; chain marks (sql/)
#  G11 VERSE SHEET before every round after round 1 (8 nodes added)      G12 DeepSeek off the panel and the reserve      G13 K-LB, the burden rule on link-round blocks
import os,sys,re,json,copy,uuid
H=os.path.dirname(os.path.abspath(__file__));B=H+'/base';N=H+'/new';L=H+'/lib';os.makedirs(N,exist_ok=True);os.makedirs(H+'/flow',exist_ok=True)
def rep(s,old,new,nm,count=1):
    c=s.count(old)
    if c!=count: sys.exit(f'{nm}: anchor found {c} times, want {count}: {old[:120]!r}')
    return s.replace(old,new)
def cut(s,a,b,new,nm,start=0):
    i=s.find(a,start)
    if i<0 or s.find(a,i+1)>=0 and start==0 and s.count(a)!=1: sys.exit(f'{nm}: span start not unique/found: {a[:80]!r}')
    j=s.find(b,i)
    if j<0: sys.exit(f'{nm}: span end not found: {b[:80]!r}')
    return s[:i]+new+s[j+len(b):]
rd=lambda nm:open(f'{B}/{nm}.js').read()
lib=lambda n:open(f'{L}/{n}').read()
REFP=lib('refp.js');CLOSE=lib('close.js');CITED=lib('citedin.js');BLOCKS=lib('blocks.js');SHEET=lib('sheet.js')
CURE_NODES=['Alternate Build','Alternate Cure Build','Alternate Cure Normalize','Alternate Merge','Cure Build','Cure Check','Cure Normalize',
            'Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Panel Cure Check','Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3']
CHECK_NODES=['Panel Payloads','Alternate Payloads','Extract Independent Verdict']
C4P_NODES=['Panel Build','Build Independent Verdict','D4 Extract','C4 Extract','Build Save Body','Build Synthesis','Format Markdown']
OUT={}
def get(nm):
    if nm not in OUT: OUT[nm]=rd(nm)
    return OUT[nm]
def top(s,block):  # a block placed before the node's first line
    return block+'\n'+s

# ======================= G5 + G1 + G3: the close-round block (C4P) on REFP, in the seven nodes that carry it =======================
for nm in C4P_NODES:
    s=get(nm)
    s=cut(s,"// judge_fix3 B2 (operator ruling: the challenger's close"," return {refs,fresh,of,note,ofD,noteD,renum,noteR};})();",REFP+CLOSE.rstrip('\n'),nm)
    # G3: the grading check printed beside each close, after its numbering note
    s=re.sub(r"C4P\.noteR\((\{[^{}]*\}|[A-Za-z]+)\s*,\s*'([DC])'\)",lambda m:"C4P.noteR("+m.group(1)+",'"+m.group(2)+"')+C4P.noteP("+m.group(1)+",'"+m.group(2)+"')",s)
    OUT[nm]=s
# Format Markdown passes only cr1/dr3/cr4 to noteR; noteP reads cr4/dr4 from the same object, which it carries.
for nm in ['Panel Build','Build Independent Verdict','Build Synthesis','Format Markdown']:
    if OUT[nm].count('C4P.noteP(')!=2: sys.exit(nm+': noteP not placed twice ('+str(OUT[nm].count('C4P.noteP('))+')')

# ======================= G5: the ledger's reader (PWL.refs) on REFP =======================
PWL_SCOPED=(" const refs=(t,scoped)=>REFP.parse(t,{scoped:!!scoped}).map(r=>{const cvs=verses(r.c,r.v1,r.v2>r.v1?'-'+r.v2:'');return {book:r.book,cv:cvs[0],cvs,label:r.label,ctx:r.ctx};})"
            ".map(r=>({...r,cvs:r.cvs.filter(cv=>isVerse(r.book||r.ctx,cv))})).filter(r=>r.cvs.length).map(r=>({...r,cv:r.cvs[0]})); // judge_fix5 G5: REFP, the one reference parser")
for nm in ['Panel Build','Build Independent Verdict','D4 Build','C4 Build','D3 Build','C3 Build']:
    s=get(nm);p=s.find('const PWL=')
    if p<0: sys.exit(nm+': PWL not found')
    i=s.find(' const refs=',p);j=s.find('cv:r.cvs[0]}));};',i)
    if i<0 or j<0: sys.exit(nm+': PWL refs span not found')
    s=s[:i]+PWL_SCOPED+s[j+len('cv:r.cvs[0]}));};'):]
    if nm in ('D3 Build','C3 Build','D4 Build','C4 Build'): s=top(s,REFP.rstrip('\n'))
    OUT[nm]=s

# ======================= G1: the close requests carry the declared chain and the C list =======================
G1_D=("\n// judge_fix5 G1 (run 32284: the defender's close \"I have not seen the text of my round 1 declaration\"): the close request carries the defender's\n"
      "// round 1 DECLARED CHAIN verbatim and the [DR3] C list, both read by code (C4P.declared, C4P.cblocks), with the instruction to keep those numbers.\n"
      "const G1F={cr1:$('D1 Extract').first().json.raw,dr3:$('C3 Extract').first().json.raw};\n"
      "const G1DECL=(()=>{try{const d=C4P.declared(G1F);return d?'YOUR DECLARED CHAIN -- your round 1 DECLARED CHAIN, copied verbatim by the system. Keep these numbers in this round: D<n> is link n of this list and no other link; do not renumber, relabel or reorder the links:\\n'+d:'YOUR DECLARED CHAIN: the system found no DECLARED CHAIN heading in your round 1; keep the numbers your round 1 gave its links.';}catch(e){return '';}})();\n"
      "const G1CL=(()=>{try{const c=C4P.cblocks(G1F);return c.length?'THE C NUMBERS -- the LINK blocks of the challenger\\'s round 3 link round, in its order, read by the system; C<j> is the j-th block and no other:\\n'+c.map(x=>'C'+x.j+' = [DR3] '+x.head.slice(0,220)).join('\\n'):'';}catch(e){return '';}})();\n")
G1_C=G1_D.replace("YOUR DECLARED CHAIN -- your round 1 DECLARED CHAIN, copied verbatim by the system. Keep these numbers in this round: D<n> is link n of this list and no other link; do not renumber, relabel or reorder the links:",
                  "THE DEFENDER\\'S DECLARED CHAIN -- the defender\\'s round 1 DECLARED CHAIN, copied verbatim by the system. Name the defender\\'s links only by these numbers: D<n> is link n of this list and no other:") \
         .replace("YOUR DECLARED CHAIN: the system found no DECLARED CHAIN heading in your round 1; keep the numbers your round 1 gave its links.","") \
         .replace("THE C NUMBERS -- the LINK blocks of the challenger\\'s round 3 link round, in its order, read by the system; C<j> is the j-th block and no other:",
                  "YOUR C NUMBERS -- the LINK blocks of your round 3 link round, in its order, read by the system. Keep these numbers in this round: C<j> is the j-th block and no other; do not renumber or restate your links under new numbers:") \

for nm,blk in (('D4 Build',G1_D),('C4 Build',G1_C)):
    s=get(nm)
    s=top(s,CLOSE.rstrip('\n'))  # C4P (declared, cblocks); REFP was placed first above, so move it ahead of C4P
    s=REFP.rstrip('\n')+'\n'+s.replace(REFP.rstrip('\n')+'\n','',1)
    a="const sys=I.dsys;const msgs=" if nm=='D4 Build' else "const sys=I.csys;const msgs="
    s=rep(s,a,blk+a,nm)
    if nm=='D4 Build': s=rep(s,"$('C3 Extract').first().json.raw+'\\n\\n'+OPEN+'\\n\\nCLOSE ROUND","$('C3 Extract').first().json.raw+'\\n\\n'+(G1DECL?G1DECL+'\\n\\n':'')+(G1CL?G1CL+'\\n\\n':'')+OPEN+'\\n\\nCLOSE ROUND",nm)
    else: s=rep(s,"$('D4 Extract').first().json.raw+(OWN?'\\n\\n'+OWN:'')+'\\n\\nCLOSE ROUND","$('D4 Extract').first().json.raw+(OWN?'\\n\\n'+OWN:'')+(G1CL?'\\n\\n'+G1CL:'')+(G1DECL?'\\n\\n'+G1DECL:'')+'\\n\\nCLOSE ROUND",nm)
    OUT[nm]=s

# D4 Extract / C4 Extract: the grading check (G3) recorded on the item
s=get('D4 Extract')
s=rep(s,"new_in_close=C4P.ofD(F4);renumbered=C4P.renum(F4,'D');}catch(x){new_in_close=[];renumbered=[];}","new_in_close=C4P.ofD(F4);renumbered=C4P.renum(F4,'D');graded=C4P.press(F4,'D').map(x=>x.s);}catch(x){new_in_close=[];renumbered=[];graded=[];} // judge_fix5 G3",'D4 Extract')
s=rep(s,"let new_in_close=[],renumbered=[];","let new_in_close=[],renumbered=[],graded=[];",'D4 Extract')
s=rep(s,"new_in_close,renumbered}}];","new_in_close,renumbered,graded,...SHEET.plan([$('D1 Extract').first().json.raw,$('C1 Extract').first().json.raw,$('D2 Extract').first().json.raw,$('C2 Extract').first().json.raw,$('D3 Extract').first().json.raw,$('C3 Extract').first().json.raw,raw])}}]; // judge_fix5 G11: the C4 verse sheet",'D4 Extract')
OUT['D4 Extract']=s
s=get('C4 Extract')
s=rep(s,"let renumbered=[];try{renumbered=C4P.renum({cr1:$('D1 Extract').first().json.raw,dr3:$('C3 Extract').first().json.raw,dr4:raw},'C');}catch(x){renumbered=[];} // judge_fix4 F5",
      "let renumbered=[];try{renumbered=C4P.renum({cr1:$('D1 Extract').first().json.raw,dr3:$('C3 Extract').first().json.raw,dr4:raw},'C');}catch(x){renumbered=[];} // judge_fix4 F5\nlet graded=[];try{graded=C4P.press({dr4:raw},'C').map(x=>x.s);}catch(x){graded=[];} // judge_fix5 G3",'C4 Extract')
OUT['C4 Extract']=s

# ======================= G11: the VERSE SHEET =======================
SHEET_SRC={'D1':("Init with Guards",'sheet_url','sheet_req','sheet_off_url'),'C1':("Init with Guards",'sheet_url_c1','sheet_req_c1','sheet_off_url_c1'),
 'D2':('C1 Extract','sheet_url','sheet_req','sheet_off_url'),'C2':('D2 Extract','sheet_url','sheet_req','sheet_off_url'),'D3':('C2 Extract','sheet_url','sheet_req','sheet_off_url'),
 'C3':('D3 Extract','sheet_url','sheet_req','sheet_off_url'),'D4':('C3 Extract','sheet_url','sheet_req','sheet_off_url'),'C4':('D4 Extract','sheet_url','sheet_req','sheet_off_url')}
EXTRACT_TEXTS={'C1 Extract':['D1'],'D2 Extract':['D1','C1'],'C2 Extract':['D1','C1','D2'],'D3 Extract':['D1','C1','D2','C2'],'C3 Extract':['D1','C1','D2','C2','D3']}
for nm,prev in EXTRACT_TEXTS.items():
    s=get(nm);rnd=nm.split()[0]
    s=top(s,REFP.rstrip('\n')+'\n'+SHEET.rstrip('\n'))
    arr='['+','.join("$('"+p+" Extract').first().json.raw" for p in prev)+',raw]'
    s=rep(s,"return [{json:{run_token:TOK,round:'"+rnd+"',raw,labelled,usage:e.u,fam:B.fam,model:B.model}}];",
          "const __SP=(()=>{try{return SHEET.plan("+arr+");}catch(x){return {sheet_url:null,sheet_req:[],sheet_off_url:[]};}})(); // judge_fix5 G11: the next round's verse sheet\nreturn [{json:{run_token:TOK,round:'"+rnd+"',raw,labelled,usage:e.u,fam:B.fam,model:B.model,...__SP}}];",nm)
    OUT[nm]=s
s=get('D4 Extract');s=s.replace(REFP.rstrip('\n'),REFP.rstrip('\n')+'\n'+SHEET.rstrip('\n'),1);OUT['D4 Extract']=s
s=get('Init with Guards');s=top(s,REFP.rstrip('\n')+'\n'+SHEET.rstrip('\n'))
s=rep(s,"return [{json:{run_token:TOK,topic:S.topic,dsys,csys,fref,lab,posline,d_served,c_served,d_named,c_named,rc_labels:labels,rc_linked:rcLinked,gl:R.gl,sd:S.sd}}];",
 "// judge_fix5 G11: round 1 has no sheet of verses cited; the Oracle seat's round 1 is served the KJV text of the verses its served rows name.\n"
 "const __SV=(()=>{try{return SHEET.plan([rc.map(x=>String(x.passage_anchor||'')+'\\n'+String(x.conclusion_text||'')).join('\\n')]);}catch(e){return {sheet_url:null,sheet_req:[],sheet_off_url:[]};}})();const __NO={sheet_url:SHEET.url([]).url,sheet_req:[],sheet_off_url:[]};\n"
 "const __D1=S.defender.profile==='oracle'?__SV:__NO,__C1=S.challenger.profile==='oracle'?__SV:__NO;\n"
 "return [{json:{run_token:TOK,topic:S.topic,dsys,csys,fref,lab,posline,d_served,c_served,d_named,c_named,rc_labels:labels,rc_linked:rcLinked,gl:R.gl,sd:S.sd,sheet_url:__D1.sheet_url||__NO.sheet_url,sheet_req:__D1.sheet_req,sheet_off_url:__D1.sheet_off_url,sheet_url_c1:__C1.sheet_url||__NO.sheet_url,sheet_req_c1:__C1.sheet_req,sheet_off_url_c1:__C1.sheet_off_url}}];",'Init with Guards')
OUT['Init with Guards']=s
HEAD_R1="the KJV text of the verses your served record rows name (round 1 has no sheet of verses cited; this sheet is served to the Oracle seat only, from its served rows)."
HEAD_N="the KJV text of every verse cited so far in this debate, by either side, in the order first cited."
for r,(src,u,q,o) in SHEET_SRC.items():
    nm=r+' Build';s=get(nm)
    if 'const SHEET=' not in s: s=top(s,SHEET.rstrip('\n')) if 'const REFP=' in s else top(s,REFP.rstrip('\n')+'\n'+SHEET.rstrip('\n'))
    m=re.search(r"\nreturn \[\{json:\{run_token:TOK,round:'"+r+"',",s)
    if not m: sys.exit(nm+': return line not found')
    head=HEAD_R1 if r in ('D1','C1') else HEAD_N
    blk=("\n// judge_fix5 G11: the VERSE SHEET, read by \""+r+" Verse Sheet\" (kjv_verses), appended to the last user message.\n"
         "const __SHT=(()=>{try{const P=$('"+src+"').first().json;let rows=[];try{rows=$('"+r+" Verse Sheet').all().map(i=>i.json).filter(x=>x&&x.book);}catch(e){rows=[];}return SHEET.text(rows,{sheet_req:P['"+q+"']||[],sheet_off_url:P['"+o+"']||[]},'"+head.replace("'","\\'")+"');}catch(e){return '';}})();\n"
         "if(__SHT){for(let k=msgs.length-1;k>=0;k--){if(msgs[k]&&msgs[k].role==='user'&&typeof msgs[k].content==='string'){msgs[k]={...msgs[k],content:msgs[k].content+'\\n\\n'+__SHT};break;}}}")
    s=s[:m.start()]+blk+s[m.start():]
    if r=='D1': s=s.replace("opening_user:msgs[0].content","opening_user:msgs[0].content")
    OUT[nm]=s

# ======================= G6: escapes removed before the pre-check's quote match =======================
for nm in ['Panel Build','Build Independent Verdict']:
    s=get(nm)
    s=rep(s,"function preCheckSide(listText,oppTexts,side){const s=String(listText||'');",
          "function preCheckSide(listText,oppTexts,side){const UNESC=x=>String(x||'').replace(/\\\\([\"'\\\\])/g,'$1'); /* judge_fix5 G6: \\\" and the like read as the mark they stand for */listText=UNESC(listText);oppTexts=(oppTexts||[]).map(UNESC);const s=String(listText||'');",nm)
    OUT[nm]=s

# ======================= G2, G13: the judges' rule text =======================
CITED_RULE=("CITED-IN RULINGS (md_notes_rulings 372 and 373) -- required. After the citation check, add a section titled exactly CITED-IN RULINGS, the title on its own line. "
 "For EVERY verse each line of the PRESSED-WITNESS LEDGER that begins \\\"cited in\\\" lists, write one line in one of these forms and nothing else on the line: "
 "PRESSED: <book chapter:verse> -- [<the round that pressed it>] -- \\\"<the pressing sentence, quoted exactly from that round>\\\" -- UNANSWERED ; "
 "PRESSED: <book chapter:verse> -- [<the round that pressed it>] -- \\\"<the pressing sentence, quoted exactly>\\\" -- ANSWERED IN [<a later round of the side that holds the link, naming the verse by book, chapter and verse>] ; "
 "NOT PRESSED: <book chapter:verse>. A verse is PRESSED when the round that cites it quotes or names it against a link or a listed premise of the other side. "
 "A verse ruled PRESSED and UNANSWERED makes that premise UNEXHIBITED (ruling 372): count it in CONCEDED LINKS or CHALLENGER CONCEDED LINKS, tagged UNEXHIBITED, and name the verse on that line. "
 "An answer counts in any later round of the side that holds the link (ruling 373), and only with the verse's book, chapter and verse named. A \\\"cited in\\\" line that reads (0 of n): none needs no ruling. "
 "The system checks that every listed verse has a ruling line, that each quotation stands in the round named, and that the count includes every verse ruled PRESSED and UNANSWERED.")
G13_OLD="when the block asserted the link and offered no layer footing at all, or when a witness"
G13_NEW="when the block asserted the link and offered no layer footing at all or exhibited fewer than two prior layers (the burden rule, the same in every round: a load-bearing [L4] counts only when it exhibits at least two prior layers and the chain from them; fewer floats and carries zero weight), or when a witness"
G13_TAG_OLD="UNEXHIBITED (no footing offered, or a pressed witness left unanswered)"
G13_TAG_NEW="UNEXHIBITED (no footing offered or fewer than two prior layers exhibited, or a pressed witness left unanswered)"
s=get('Panel Build')
s=rep(s,"LEDGER,'',\n\"OUT-OF-ROUND CONCESSIONS -- after the COLLISION POINTS lines","LEDGER,'',\""+CITED_RULE+"\",'',\n\"OUT-OF-ROUND CONCESSIONS -- after the COLLISION POINTS lines",'Panel Build')
s=rep(s,"the citation check, OUT-OF-ROUND CONCESSIONS, DEFENDER CHAIN MARK","the citation check, CITED-IN RULINGS, OUT-OF-ROUND CONCESSIONS, DEFENDER CHAIN MARK",'Panel Build')
OUT['Panel Build']=s
s=get('Build Independent Verdict')
s=rep(s,"LEDGER+NL+NL+\"OUT-OF-ROUND CONCESSIONS -- after the COLLISION POINTS lines","LEDGER+NL+NL+\""+CITED_RULE+"\"+NL+NL+\"OUT-OF-ROUND CONCESSIONS -- after the COLLISION POINTS lines",'Build Independent Verdict')
OUT['Build Independent Verdict']=s
for nm,n1,n2 in (('Panel Build',2,2),('Build Independent Verdict',2,2),('Format Markdown',1,1)):
    s=get(nm);s=rep(s,G13_OLD,G13_NEW,nm,count=n1);s=rep(s,G13_TAG_OLD,G13_TAG_NEW,nm,count=n2);OUT[nm]=s

# ======================= G5, G2, G13 (+G9, G4): the checker nodes =======================
CREFS_NEW="function cRefs(t){return REFP.keys(t,{cap:30}).map(k=>({key:k.key,pos:k.pos}));} // judge_fix5 G5: REFP\n"
G9_PICK=("// judge_fix5 G9: slot 1's DeepSeek call is repeated once, by \"Panel Judge 1 deepseek retry\", when its first reply is empty (no error, no content);\n"
 "// the retry's reply is the slot's reply when it ran.\n"
 "const G9R='Panel Judge 1 deepseek retry';const g9Ran=()=>{try{return $(G9R).isExecuted;}catch(e){return false;}};const g9Node=n=>(n==='Panel Judge 1 deepseek'&&g9Ran())?G9R:n;\n")
for nm in CHECK_NODES:
    s=get(nm)
    s=rep(s,"const DRV_REF=/",REFP.rstrip('\n')+"\nconst DRV_REF=/",nm)
    if nm!='Extract Independent Verdict':
        i=s.find('function cRefs(t){');j=s.find('\n return out;}\n',i)
        if i<0 or j<0: sys.exit(nm+': cRefs not found')
        s=s[:i]+CREFS_NEW+s[j+len('\n return out;}\n'):]
    s=rep(s,"// BB-8327 D1 and D2 (WALL-1908 as amended; his word at BB-8342): the chain-stating net, K-C.",CITED+BLOCKS+"// BB-8327 D1 and D2 (WALL-1908 as amended; his word at BB-8342): the chain-stating net, K-C.",nm)
    OUT[nm]=s
s=get('Panel Payloads')
s=rep(s,"for(const x of DB.marks)marks.push(x);\n","for(const x of DB.marks)marks.push(x);\n {const PT=drvPromptText(jd.body);const LN={DEFENDER:drvLedgerN(PT,'DEFENDER'),CHALLENGER:drvLedgerN(PT,'CHALLENGER')};const CPV={DEFENDER:v.counted_premises_defender,CHALLENGER:v.counted_premises_challenger}; // judge_fix5 G2 (K-G9), G13 (K-LB)\n  const CI=drvCited(WT,PT,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,LN);for(const x of CI.items)DRV.items.push(x);for(const x of CI.marks)marks.push(x);\n  const LB=drvBlocks(WT,PT,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,CPV,LN);for(const x of LB.items)DRV.items.push(x);for(const x of LB.marks)marks.push(x);}\n",'Panel Payloads')
OUT['Panel Payloads']=s
s=get('Alternate Payloads')
s=rep(s,"for(const x of DB.marks)marks.push(x);\n","for(const x of DB.marks)marks.push(x);\n  {const PT=drvPromptText(a.body);const LN={DEFENDER:drvLedgerN(PT,'DEFENDER'),CHALLENGER:drvLedgerN(PT,'CHALLENGER')};const CPV={DEFENDER:v.counted_premises_defender,CHALLENGER:v.counted_premises_challenger}; // judge_fix5 G2 (K-G9), G13 (K-LB)\n  const CI=drvCited(WT,PT,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,LN);for(const x of CI.items)DRV.items.push(x);for(const x of CI.marks)marks.push(x);\n  const LB=drvBlocks(WT,PT,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,CPV,LN);for(const x of LB.items)DRV.items.push(x);for(const x of LB.marks)marks.push(x);}\n",'Alternate Payloads')
OUT['Alternate Payloads']=s
s=get('Extract Independent Verdict')
a="const DL=drvLedger(raw0,drvPromptText(prev&&prev.verdictBody),conceded_links,challenger_conceded_links,defense_standing,challenge_standing,null);for(const x of DL.items)DRV.items.push(x);for(const x of DL.marks)raw+='\\n\\n'+x;"
s=rep(s,a,a+"\n{const PT=drvPromptText(prev&&prev.verdictBody);const LN={DEFENDER:drvLedgerN(PT,'DEFENDER'),CHALLENGER:drvLedgerN(PT,'CHALLENGER')}; // judge_fix5 G2 (K-G9), G13 (K-LB)\n const CI=drvCited(raw0,PT,conceded_links,challenger_conceded_links,defense_standing,challenge_standing,LN);for(const x of CI.items)DRV.items.push(x);for(const x of CI.marks)raw+='\\n\\n'+x;\n const LB=drvBlocks(raw0,PT,conceded_links,challenger_conceded_links,defense_standing,challenge_standing,null,LN);for(const x of LB.items)DRV.items.push(x);for(const x of LB.marks)raw+='\\n\\n'+x;}",'Extract Independent Verdict')
OUT['Extract Independent Verdict']=s

# ======================= G5, G2, G13: the cure library (14 nodes) =======================
CURE_REFS_NEW="function cureRefs(t,scoped){return REFP.keys(t,{scoped:!!scoped,cap:30}).map(k=>({key:k.key,pos:k.pos}));} // judge_fix5 G5: REFP, the one reference parser\n"
KG9_RULE=(" K-G9 (the PRESSED-WITNESS LEDGER's \"cited in\" line lists a verse your judgment does not rule on in the fixed form, or you ruled a verse PRESSED and "
 "UNANSWERED and your count does not count it): for every verse the item lists, write one ruling line: PRESSED: <book chapter:verse> -- [<the round that pressed it>] -- "
 "\"<the pressing sentence, quoted exactly>\" -- UNANSWERED; or the same with -- ANSWERED IN [<a later round of the side that holds the link that names the verse by book, chapter and verse>]; "
 "or NOT PRESSED: <book chapter:verse>. Ruling 372: a pressed witness left unanswered makes the premise UNEXHIBITED and it counts; for verses you rule PRESSED and UNANSWERED write "
 "CORRECTED COUNT for that side, your count plus at least one (or RESTATED: <CONCEDED LINKS or CHALLENGER CONCEDED LINKS>: <the count and its items>, naming each such verse "
 "under the premise it was pressed against), with the CORRECTED STANDING that count makes true. Ruling 373: an answer counts in any later round of the side that holds the link."
 " K-LB (a link-round block of [CR3] or [DR3] that exhibits fewer than two prior layer kinds, which your count does not count; the burden rule is the same in every round: a "
 "load-bearing [L4] counts only when it exhibits at least two prior layers and the chain from them): cure it by counting it, CORRECTED COUNT for that side, your count plus every "
 "such premise, with its CORRECTED STANDING; or by a STATEMENT for the item that quotes the block's own words and exhibits, on that line, the two layer kinds the block shows "
 "([L1] the KJV words quoted, [L2] the source word, [L3] the cross-reference named).")
KG9_FORM=("PRESSED: <book chapter:verse> -- [<pressing round>] -- \\\"<the pressing sentence, quoted exactly>\\\" -- UNANSWERED   (a K-G9 ruling; or -- ANSWERED IN [<round>])\\n"
 "NOT PRESSED: <book chapter:verse>   (a K-G9 ruling)\\n")
KG9_CURE=r"""  // judge_fix5 G2 K-G9: every listed verse needs a valid ruling line in the reply (the original's valid rulings do not cure the item); a verse ruled
  // PRESSED and UNANSWERED, or one the original ruled so and did not count, must be counted (ruling 372), unless re-ruled NOT PRESSED or ANSWERED IN.
  if(x.rule==='K-G9'){const RU=o.cited||[];const lines=RU.map(z=>z.line).slice(0,30);const ok9=z=>ciValid(z,x.side,R).ok;const hit=(ref,zs)=>{const K=ciKeys(ref);return zs.filter(z=>[...z.keys].some(k=>K.has(k)));};
   const miss=(x.missing||[]).filter(lab=>!hit(lab,RU).some(ok9));
   if(miss.length)return res('UNCURED','no valid ruling line in the reply for '+miss.length+' listed verse(s): '+miss.slice(0,12).join(', ')+(miss.length>12?', ...':''),lines);
   const pu=RU.filter(z=>z.kind==='PRESSED'&&z.ans==='UNANSWERED'&&CI_PRESS[x.side].includes(z.round)&&ok9(z)).map(z=>z.ref);
   const still=(x.uncounted||[]).filter(ref=>!hit(ref,RU).some(z=>ok9(z)&&(z.kind==='NOT PRESSED'||z.ans==='ANSWERED')));const need=[...new Set(pu.concat(still))];
   if(!need.length)return res('CURED','every listed verse ruled; none PRESSED and UNANSWERED',lines);
   const lab9=x.side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS';const rc=o.restated.filter(r=>r.link===lab9);const cs=o.count.filter(c=>c.side===x.side);const ns=[...new Set(cs.map(c=>c.n))];
   const ss=o.standing.filter(s=>s.side===x.side);const sv=[...new Set(ss.map(s=>s.st))];const ls=lines.concat(cs.map(c=>c.line),ss.map(s=>s.line),rc.map(r=>r.line));
   const named=rc.length===1&&need.every(ref=>{const K=ciKeys(rc[0].text);return [...ciKeys(ref)].some(k=>K.has(k));});const lead=rc.length===1?(rc[0].text.match(/^\s*(\d+)\b/)||[])[1]:null;
   if(ns.length>1)return res('UNCURED','two differing CORRECTED COUNT lines for '+x.side,ls);const n9=ns.length===1?ns[0]:(lead!=null?+lead:null);
   if(n9==null)return res('UNCURED','ruled PRESSED and UNANSWERED ('+need.join(', ')+'), but no CORRECTED COUNT for '+x.side+' (ruling 372: the premise is UNEXHIBITED and counts)',ls);
   const needN=Math.max(1,(x.conc||0)+(named?0:1))+kNeed(x.side);if(n9<needN)return res('UNCURED','corrected count '+n9+' is below '+needN+' (ruled PRESSED and UNANSWERED: '+need.join(', ')+')',ls);
   if(sv.length>1)return res('UNCURED','two differing CORRECTED STANDING lines for '+x.side,ls);const want=(x.L&&2*n9>x.L)?'COLLAPSED':'PROP-DEPENDENT';const got=sv.length===1?sv[0]:(x.st||null);
   if(got!==want)return res('UNCURED','count '+n9+' of '+(x.L||'?')+' makes the '+x.side+' standing '+want+'; it reads '+(got||'none'),ls);
   return res('CURED','counted under ruling 372: '+x.side+' COUNT '+n9+', STANDING '+want+(named?'; restated count names '+need.join(', '):''),ls);}
  // judge_fix5 G13 K-LB: counted (the K-G6 count, K-LB premises joined), or a statement that quotes the block's round and exhibits two layer kinds.
  if(x.rule==='K-LB'){const st=stmtOf(x);const rk=x.side==='CHALLENGER'?'DR3':'CR3';
   if(st&&!o.count.some(c=>c.side===x.side&&c.n>(x.conc||0))){const k=drvKinds(st);if(k.length>=2&&typeof R[rk]==='string'&&stmtQ(st).some(q=>cureFound(q,R[rk])))return res('CURED','statement quotes ['+rk+'] and exhibits '+k.join(' and '),['STATEMENT: '+st],k);}
   return kCount(x,'no statement quoting ['+rk+'] with two layer kinds');}
"""
for nm in CURE_NODES:
    s=get(nm)
    s=top(s,REFP.rstrip('\n'))
    i=s.find('function cureRefs(t,scoped){');j=s.find('\n return out;}\n',i)
    if i<0 or j<0: sys.exit(nm+': cureRefs not found')
    s=s[:i]+CURE_REFS_NEW+s[j+len('\n return out;}\n'):]
    s=rep(s,"// The rounds that press a witness against each side (the judge prompt's UNANSWERED WITNESS rule).",CITED+"// The rounds that press a witness against each side (the judge prompt's UNANSWERED WITNESS rule).",nm)
    s=rep(s,"const CURE_KEY=/^(RESTATED|RETRACTED|CORRECTED RESULT|CORRECTED COUNT|CORRECTED STANDING|PRESSED|","const CURE_KEY=/^(RESTATED|RETRACTED|CORRECTED RESULT|CORRECTED COUNT|CORRECTED STANDING|NOT PRESSED|PRESSED|",nm)
    s=rep(s,"const o={restated:[],withdrawn:[],result:[],count:[],standing:[],pressed:[],short:[],statement:[],response:[],malformed:[],prose:[]};","const o={restated:[],withdrawn:[],result:[],count:[],standing:[],pressed:[],short:[],statement:[],response:[],malformed:[],prose:[],cited:[]};",nm)
    s=rep(s,"  else if(k[1]==='CORRECTED RESULT'&&","  else if((k[1]==='PRESSED'||k[1]==='NOT PRESSED')&&ciForm(k[1],r)){for(const z of ciRulings(l))o.cited.push(z);} // judge_fix5 G2: a K-G9 ruling line\n  else if(k[1]==='CORRECTED RESULT'&&",nm)
    s=rep(s,"x.rule==='K-G8'||x.rule==='K-S'||","x.rule==='K-G8'||x.rule==='K-G9'||x.rule==='K-LB'||x.rule==='K-S'||",nm,count=2)
    s=rep(s,'+"K-G7 (a COLLISION POINTS line you graded DEFENDER LINK BROKEN','+"'+KG9_RULE.replace('"','\\"')+' "\n +"K-G7 (a COLLISION POINTS line you graded DEFENDER LINK BROKEN',nm)
    s=rep(s,' +"SHORT: D<n> vs C<m> |',' +"'+KG9_FORM+'"\n +"SHORT: D<n> vs C<m> |',nm)
    s=rep(s,"  if(x.rule==='K-G8')return kCount(x,'no other cure');",KG9_CURE+"  if(x.rule==='K-G8')return kCount(x,'no other cure');",nm)
    s=rep(s,"if(y.rule==='K-G7'&&!wd.has(U(y.link)))ps.add(y.premise!=null?'P'+y.premise:'L'+U(y.link));}return ps.size;};",
          "if(y.rule==='K-G7'&&!wd.has(U(y.link)))ps.add(y.premise!=null?'P'+y.premise:'L'+U(y.link));if(y.rule==='K-LB'&&y.premise!=null)ps.add('P'+y.premise); /* judge_fix5 G13 */}return ps.size;};",nm)
    s=rep(s,"(x.rule==='K-G1'||x.rule==='K-G3'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8')","(x.rule==='K-G1'||x.rule==='K-G3'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'||x.rule==='K-G9'||x.rule==='K-LB')",nm,count=2)
    s=rep(s,"ks.every(x=>x.rule==='K-G6'&&/^statement/.test(String(x.why||'')))","ks.every(x=>((x.rule==='K-G6'||x.rule==='K-LB')&&/^statement/.test(String(x.why||'')))||(x.rule==='K-G9'&&/^every listed verse ruled/.test(String(x.why||''))))",nm)
    s=rep(s,"(x.rule==='K-SC'&&/restated count/.test(String(x.why||'')))","(x.rule==='K-SC'&&/restated count/.test(String(x.why||'')))||(x.rule==='K-G9'&&x.side===sd&&/restated count names/.test(String(x.why||'')))",nm)
    OUT[nm]=s

# ======================= G5, G6: Citation Scan =======================
s=get('Citation Scan');s=top(s,REFP.rstrip('\n'))
OLDT=r"((?:\s?[–—-]\s?\d{1,3}|\s?,\s?\d{1,3})*)";NEWT=r"((?:\s?[–—-]\s?\d{1,3}(?!\d|:\d)|\s?,\s?\d{1,3}:\d{1,3}|\s?,\s?\d{1,3}(?![\d:]))*)"
s=rep(s,OLDT,NEWT,'Citation Scan',count=6)
s=rep(s,"const items=[];const seen=new Set();",
      "// judge_fix5 G6 (run 32284: the challenger's list carried backslash-escaped quotation marks, \\\"father.\\\"): escapes read as the mark they stand for.\n"
      "rounds.forEach(x=>{x[2]=String(x[2]||'').replace(/\\\\([\"'\\\\])/g,'$1');});\n"
      "// judge_fix5 G5 (run 32284: \"Isaiah 7:11, 7:14\" was read as \"Isaiah 7:11,7\"): the reference after its head is read by REFP; a comma list of full\n"
      "// chapter:verse references, or of bare verses, is several parts, each read and matched; a quotation joined from two verses is matched part by part.\n"
      "const scanParts=(c,v,tail)=>{const ps=REFP.parse('Genesis '+c+':'+v+String(tail||'')).map(r=>({chapter:r.c,v1:r.v1,v2:r.v2}));return ps.length?ps:[{chapter:+c,v1:+v,v2:+v}];};\n"
      "const items=[];const seen=new Set();",'Citation Scan')
s=rep(s,"const vs=[+m[3],...((m[4]||'').match(/\\d{1,3}/g)||[]).map(Number)];const v1=Math.min(...vs),v2=Math.max(...vs);","const PS=scanParts(m[2],m[3],m[4]);const v1=PS[0].v1,v2=PS[0].v2;",'Citation Scan')
s=rep(s,"const vs=[+m[4],...((m[5]||'').match(/\\d{1,3}/g)||[]).map(Number)];const v1=Math.min(...vs),v2=Math.max(...vs);","const PS=scanParts(m[3],m[4],m[5]);const v1=PS[0].v1,v2=PS[0].v2;",'Citation Scan')
s=rep(s,"chapter:+m[2],v1,v2,quote,","chapter:+m[2],v1,v2,...(PS.length>1?{parts:PS}:{}),quote,",'Citation Scan')
s=rep(s,"chapter:+m[3],v1,v2,quote,","chapter:+m[3],v1,v2,...(PS.length>1?{parts:PS}:{}),quote,",'Citation Scan')
s=rep(s,"items3.forEach(i=>vadd(i.book,i.chapter,i.v1,i.v2));","items3.forEach(i=>(i.parts||[{chapter:i.chapter,v1:i.v1,v2:i.v2}]).forEach(p=>vadd(i.book,p.chapter,p.v1,p.v2)));",'Citation Scan')
s=rep(s,"items3.map(i=>readK.has(i.book+'|'+i.chapter)?i:{...i,unread:true})","items3.map(i=>(i.parts||[{chapter:i.chapter}]).every(p=>readK.has(i.book+'|'+p.chapter))?i:{...i,unread:true})",'Citation Scan')
OUT['Citation Scan']=s

# ======================= G5, G7: Quote Compare, Quote Report =======================
s=get('Quote Compare')
s=rep(s,"const words=s=>[...new Set(String(s||'').toLowerCase()",
 "// judge_fix5 G7 (run 32284: \"Maher-shalal-hash-baz\" against the KJV's \"Mahershalalhashbaz\"): ONE SWITCH, default OFF until the operator rules. When true,\n"
 "// a hyphen inside a word is removed before matching, on the quotation and the verse alike, both sides.\nconst HYPHEN_JOIN=false;\n"
 "const hj=s=>HYPHEN_JOIN?String(s==null?'':s).replace(/([A-Za-z])-(?=[A-Za-z])/g,'$1'):String(s==null?'':s);\n"
 "// judge_fix5 G5: a reference of several parts (\"Isaiah 7:11, 7:14\") is read part by part; the cited text is the parts' verses in order.\n"
 "const PARTS=i=>Array.isArray(i.parts)&&i.parts.length?i.parts:[{chapter:i.chapter,v1:i.v1,v2:i.v2}];\n"
 "const words=s=>[...new Set(hj(s).toLowerCase()",'Quote Compare')
s=rep(s,"const fold=s=>String(s||'').toLowerCase()","const fold=s=>hj(s).toLowerCase()",'Quote Compare')
s=rep(s,"const parts=[];for(let v=i.v1;v<=i.v2;v++){const t=idx[i.book+'|'+i.chapter+'|'+v];if(t)parts.push(t);}","const parts=[];for(const pt of PARTS(i))for(let v=pt.v1;v<=pt.v2;v++){const t=idx[i.book+'|'+pt.chapter+'|'+v];if(t)parts.push(t);}",'Quote Compare')
s=rep(s,"cited_rows:rows.length,","cited_rows:rows.length,hyphen_join:HYPHEN_JOIN,",'Quote Compare')
OUT['Quote Compare']=s
s=get('Quote Report')
s=rep(s,"const words=s=>[...new Set(String(s||'').toLowerCase()","const words=s=>[...new Set((C.hyphen_join===true?String(s||'').replace(/([A-Za-z])-(?=[A-Za-z])/g,'$1'):String(s||'')).toLowerCase() /* judge_fix5 G7 */",'Quote Report')
s=rep(s,"const inRange=best&&best.book===i.book&&+best.chapter===+i.chapter&&+best.verse>=+i.v1&&+best.verse<=+i.v2;",
      "const inRange=best&&best.book===i.book&&(Array.isArray(i.parts)&&i.parts.length?i.parts:[{chapter:i.chapter,v1:i.v1,v2:i.v2}]).some(p=>+best.chapter===+p.chapter&&+best.verse>=+p.v1&&+best.verse<=+p.v2); // judge_fix5 G5",'Quote Report')
OUT['Quote Report']=s

# ======================= G4, G9: Panel Check, Panel Payloads, Panel Tokens =======================
G4_LINE=("// judge_fix5 G4 (run 32284: DeepSeek's seat went to the reserve and nothing said why): one line naming the seat, the reason (error, timeout, empty\n"
 "// reply, unreadable, refused) and the reserve; the HTTP status where the node exposes it (on an error) and the reply text length.\n"
 "const g4Line=(sb,N)=>{if(!sb||!sb.failed_seat)return null;N=N||(x=>x);const d=String(sb.detail||'');const why=sb.reason||(sb.failure_kind==='timeout'?'timeout':sb.failure_kind==='refused'?'refused':sb.failure_kind==='error'?'error':/returned no JSON object\\. First 200 chars:\\s*$/.test(d)?'empty reply':'unreadable');\n"
 " const ex=[];if(why==='empty reply'||why==='error')ex.push(sb.http_status!=null?'HTTP status '+sb.http_status:'HTTP status not exposed by the node');if(sb.body_chars!=null)ex.push('reply text '+sb.body_chars+' characters');else if(why==='empty reply')ex.push('reply text 0 characters');if(sb.retried)ex.push('the call was repeated once on its empty reply');\n"
 " return 'Reserve seated: panel seat '+N(sb.failed_seat)+' gave no usable judgment ('+why+(ex.length?'; '+ex.join('; '):'')+'); the reserve '+N(sb.substitute)+' judged in its place.';};\n")
s=get('Panel Check')
s=rep(s,"const ran=names=>",G9_PICK+"const ran=names=>",'Panel Check')
s=rep(s," const items=$(r[0]).all();"," const items=$(g9Node(r[0])).all();",'Panel Check')
s=rep(s," if(!c.ok){let txt=null;",
 " // judge_fix5 G4: the reason in words, with the HTTP status (on an error, where the node exposes it) and the reply text length.\n"
 " const g4=(()=>{let t0=null;try{t0=envelope(jd.seat,raw).text;}catch(e){t0=null;}const j=raw||{};const ch=Array.isArray(j.choices)&&j.choices[0]?j.choices[0]:null;\n"
 "  const empty=!j.error&&(Object.keys(j).length===0||(ch&&!(ch.message&&typeof ch.message.content==='string'&&ch.message.content.trim()))||(typeof j.data==='string'&&!j.data.trim())||(t0!=null&&!String(t0).trim()));\n"
 "  const st=(j.error&&typeof j.error==='object'&&(j.error.httpCode||j.error.status||j.error.statusCode))||null;\n"
 "  return {reason:c.kind==='timeout'?'timeout':c.kind==='refused'?'refused':c.kind==='error'?'error':c.kind==='test'?'test':empty?'empty reply':'unreadable',http_status:st,body_chars:t0==null?(empty?0:null):String(t0).length,retried:i===0&&r[0]==='Panel Judge 1 deepseek'&&g9Ran()};})();\n"
 " if(!c.ok){let txt=null;",'Panel Check')
s=rep(s,"fails.push({slot:i,seat:jd.seat,model:jd.api_model||null,kind:c.kind,detail:c.detail,msg:c.msg,text:txt});","fails.push({slot:i,seat:jd.seat,model:jd.api_model||null,kind:c.kind,detail:c.detail,msg:c.msg,text:txt,...g4});",'Panel Check')
s=rep(s,"sub:{slot:f.slot,failed_seat:f.seat,substitute:RES.seat,failure_kind:f.kind,detail:f.detail,at},failed_raw:{seat:f.seat,model:f.model,kind:f.kind,detail:f.detail,text:f.text,at}",
      "sub:{slot:f.slot,failed_seat:f.seat,substitute:RES.seat,failure_kind:f.kind,detail:f.detail,at,reason:f.reason,http_status:f.http_status,body_chars:f.body_chars,retried:f.retried},failed_raw:{seat:f.seat,model:f.model,kind:f.kind,detail:(f.reason?f.reason+': ':'')+f.detail,text:f.text,at}",'Panel Check')
OUT['Panel Check']=s
s=get('Panel Payloads')
s=rep(s,"const ran=names=>",G9_PICK+G4_LINE+"const ran=names=>",'Panel Payloads')
s=rep(s," const items=$(r[0]).all();"," const items=$(isSub?r[0]:g9Node(r[0])).all();",'Panel Payloads')
s=rep(s," p.drv_uncured=DRV.items.length;"," if(isSub){const gl=g4Line(SUB);if(gl)marks.push('[AUDIT v26: '+gl.replace(/[\\[\\]]/g,'')+']');} // judge_fix5 G4: the reserve's own row says why it sat\n p.drv_uncured=DRV.items.length;",'Panel Payloads')
s=rep(s,"const substitution=SUB?{failed_seat:SUB.failed_seat,substitute:SUB.substitute,failure_kind:SUB.failure_kind,detail:SUB.detail,at:SUB.at}:null;",
      "const substitution=SUB?{failed_seat:SUB.failed_seat,substitute:SUB.substitute,failure_kind:SUB.failure_kind,detail:SUB.detail,at:SUB.at,reason:SUB.reason||null,http_status:SUB.http_status==null?null:SUB.http_status,body_chars:SUB.body_chars==null?null:SUB.body_chars,retried:SUB.retried===true}:null; // judge_fix5 G4",'Panel Payloads')
OUT['Panel Payloads']=s
s=get('Panel Tokens');s=rep(s,'const NODES=["Panel Judge 1 deepseek",','const NODES=["Panel Judge 1 deepseek", "Panel Judge 1 deepseek retry",','Panel Tokens');OUT['Panel Tokens']=s

# ======================= G12: DeepSeek off the panel and the reserve =======================
s=get('Init Seats')
s=rep(s,"const free=ORDER.filter(s=>!seated[s]);const panel_order=free.slice(0,3);",
 "// judge_fix5 G12 (operator, 2026-11-02: \"remove deepseek from panel\"; md_notes_rulings 366: \"... leave it as the enforcer\"): DeepSeek sits on no panel\n"
 "// slot, reserve or alternate. The single judge, the synthesis and the diagnostic stay the first free seat of ORDER (DeepSeek unless it debates);\n"
 "// the panel, the reserve and the alternates come from the panel order, ORDER without DeepSeek.\n"
 "// judge_fix5 G12 correction (md_notes_rulings 362: a model over the time limit is removed \"as debater and judge\"): qwen sits on no panel either.\n"
 "// sol (ruling 378, the operator's rank-3 choice) then fills the panel, reserve or alternate place its ORDER position gives it; a seat of the same\n"
 "// family as a debater (sol and chatgpt, both openai) is skipped here, as Resolve Seats would refuse it.\n"
 "const NOT_PANEL=['deepseek','qwen'];const FAM_PANEL={chatgpt:'openai',sol:'openai'};const dfam=[FAM_PANEL[D.engine],FAM_PANEL[C.engine]].filter(Boolean);\n"
 "const free=ORDER.filter(s=>!seated[s]);const pfree=free.filter(s=>NOT_PANEL.indexOf(s)<0&&!(FAM_PANEL[s]&&dfam.indexOf(FAM_PANEL[s])>=0));const panel_order=pfree.slice(0,3);",'Init Seats')
s=rep(s,"const panel_reserve=(free.length>3&&JUDGE_TIME_REMOVED.indexOf(free[3])<0)?free[3]:null;","const panel_reserve=(pfree.length>3&&JUDGE_TIME_REMOVED.indexOf(pfree[3])<0)?pfree[3]:null; // judge_fix5 G12",'Init Seats')
s=rep(s,"const ALT_ORDER=free.slice(4).filter(","const ALT_ORDER=pfree.slice(4).filter( /* judge_fix5 G12 */",'Init Seats')
OUT['Init Seats']=s

# ======================= G1, G3, G4, G8, G10, G2/G13 labels: Format Markdown =======================
s=get('Format Markdown')
s=rep(s,"let t = '# TRUTH App Debate\\n\\n';",G4_LINE+"let t = '# TRUTH App Debate\\n\\n';",'Format Markdown')
G8=("// judge_fix5 G8 (Worker_E A7: \"Verdict of the debate: HELD\" above \"Outcome: UNDERDETERMINED\" read as a contradiction): the outcome first, with one\n"
 "// plain line, computed from the row's fields, when the panel verdict and the outcome differ.\n"
 "{const pv=r.panel_verdict,oc=r.outcome,sp=r.panel_split?' ('+r.panel_split+')':'';const MAPV={HELD:'DEFENDER PREVAILS',PARTIAL:'DEFENDER PREVAILS, WEAKENED',BROKEN:'CHALLENGER PREVAILS'};\n"
 " const W=['no','one','two','three','four','five'];const nw=x=>W[x]||String(x);const ud=(Array.isArray(r.underdetermined_seats)?r.underdetermined_seats:[]).filter(x=>/:RESULT$/.test(String(x))).length;\n"
 " let why='';if(oc&&!(pv&&MAPV[pv]===oc)){const held=pv==='HELD'?\"The defender's chain held\"+sp:pv==='PARTIAL'?\"The defender's chain held, weakened\"+sp:pv==='BROKEN'?\"The defender's chain was broken\"+sp:pv?'The panel reached no majority verdict'+sp:'The panel did not finish';\n"
 "  why=oc==='UNDERDETERMINED'?held+\"; the challenger's chain also stood for \"+nw(ud)+' judge'+(ud===1?'':'s')+', so the question is left open.':r.citation_block?held+', but '+String(r.citation_block).replace(/\\.$/,'')+'; the outcome goes to review.':/REVIEW/.test(oc)?held+'; the outcome goes to review.':held+'; the outcome is '+oc+'.';}\n"
 " t += '**Outcome:** ' + (oc || 'not recorded') + (why ? '. ' + why : '') + '\\n\\n';}\n")
s=rep(s,"t += '**Topic:** ' + r.topic + '\\n\\n';",G8+"t += '**Topic:** ' + r.topic + '\\n\\n';",'Format Markdown')
s=rep(s,"t += '- Panel result: **' + (r.panel_verdict || '?') + '**' + (r.panel_split ? ' (' + r.panel_split + ')' : '') + VSIDE + '\\n';",
      "t += '- Panel result: **' + (r.panel_verdict || '?') + '**' + (r.panel_split ? ' (' + r.panel_split + ')' : '') + VSIDE + '\\n';\n{const gl=g4Line(r.panel_substitution,nm);if(gl)t += '- ' + gl + '\\n';} // judge_fix5 G4",'Format Markdown')
s=rep(s,"t += '| Run | ' + (r.run_token || '') + ', ' + date + ' |\\n\\n';","{const gl=g4Line(r.panel_substitution,nm);if(gl)t += '| Reserve | ' + gl.replace(/\\|/g,'\\\\|') + ' |\\n';} // judge_fix5 G4\nt += '| Run | ' + (r.run_token || '') + ', ' + date + ' |\\n\\n';",'Format Markdown')
s=rep(s,"'K-G8': 'Counted premises list differs from the count (K-G8)' };","'K-G8': 'Counted premises list differs from the count (K-G8)', 'K-G9': 'Cited-in line not ruled, or a pressed and unanswered verse not counted (K-G9)', 'K-LB': 'Link-round block with fewer than two layers not counted (K-LB)' };",'Format Markdown')
s=rep(s,"m = x.match(/\\((K-G8)\\) -- counted_premises_(defender|challenger)/);","m = x.match(/\\((K-G9)\\) -- ((?:DEFENDER|CHALLENGER) CITED-IN)/); if (m) return 'K-G9|' + m[2].toUpperCase(); m = x.match(/\\((K-LB)\\) -- ((?:DEFENDER|CHALLENGER) premise \\d+)/); if (m) return 'K-LB|' + m[2].toUpperCase(); m = x.match(/\\((K-G8)\\) -- counted_premises_(defender|challenger)/);",'Format Markdown')
s=rep(s,"SYNTHESIS CHECK \\((S-[A-E])\\)","SYNTHESIS CHECK \\((S-[A-F])\\)",'Format Markdown')
OUT['Format Markdown']=s

# ======================= G3, G10, G2/G13 labels: Build Save Body =======================
s=get('Build Save Body')
s=rep(s,"{let np=[];try{np=C4P.of(d);}catch(e){np=[];}",
 "for(const sd of ['D','C']){let gp=[];try{gp=C4P.press(d,sd);}catch(e){gp=[];}if(gp.length)FF.push('[AUDIT v26: CLOSE-ROUND GRADING CHECK ('+sd+'4) -- the '+(sd==='D'?'defender':'challenger')+'\\'s close round holds '+gp.length+' sentence(s) that grade or press the '+(sd==='D'?'challenger':'defender')+'\\'s links; each is marked DISREGARDED for the judges: '+gp.map(x=>'\"'+x.s.slice(0,140).replace(/[\\[\\]\"]/g,'')+'\"').join('; ')+'. REVIEW THIS ROW.]');} // judge_fix5 G3\n"
 "{let np=[];try{np=C4P.of(d);}catch(e){np=[];}",'Build Save Body')
OLD_SD=r"""SL.forEach(l=>{if(/\bguards?\b[^.\n]{0,80}\bbinds?\b[^.\n]{0,40}\bboth\s+(?:seats|sides)\b|\bbinds?\s+both\s+seats\b|\bboth\s+seats\b[^.\n]{0,40}\bbound\s+by\b[^.\n]{0,30}\bguards?\b/i.test(l))SX.push('(S-D) -- the synthesis says the guards bind both seats; the guards bind the record seat only: "'+cut(l)+'"');});"""
NEW_SD=r"""SL.forEach(l=>{if(/\bguards?\b[^.\n]{0,80}\bbinds?\b[^.\n]{0,40}\bboth\s+(?:seats|sides)\b|\bbinds?\s+both\s+seats\b|\bboth\s+seats\b[^.\n]{0,40}\bbound\s+by\b[^.\n]{0,30}\bguards?\b/i.test(l))SX.push('(S-D) -- the synthesis says the guards bind both seats; the guards bind the record seat only: "'+cut(l)+'"');
  // judge_fix5 G10 (run 32284: "the defender's seat is never run against the guards ... that omission is the largest unchecked surface"; ruling 383): S-D
  // also reads a sentence that the guards bind, should bind, or should be run against the defender.
  else if(/\bguards?\b[^.\n]{0,80}\b(?:binds?|bound|should\s+bind|must\s+bind|run\s+against|tested\s+against|applied\s+to)\b[^.\n]{0,60}\bdefen(?:der|ce|se)(?:['’]s)?\b|\bdefen(?:der|ce|se)(?:['’]s)?\s+seat\b[^.\n]{0,60}\b(?:never|not)\s+(?:run|tested|checked|held)\s+against\s+the\s+guards?\b|\bshould\s+bind\s+the\s+defen(?:der|ce|se)\b|\bguard-tests?\s+the\s+challenger\s+seat\s+only\b/i.test(l))SX.push('(S-D) -- the synthesis says the guards bind, or should bind, the defender; the guards bind the Debate Oracle seat only (ruling 383): "'+cut(l)+'"');});
 // judge_fix5 G10 (run 32284: "The close round pressed nothing new" while the challenger's close graded D1 to D4): (S-F) a sentence that says a close
 // pressed nothing (new) while the C4 new-press check or the close-round grading check (G3) found a press in that close.
 {let pC=[],pD=[];try{pC=C4P.of(d).concat(C4P.press(d,'C').map(x=>x.s));pD=C4P.press(d,'D').map(x=>x.s);}catch(e){}
  SL.forEach(l=>{for(const s of l.split(/(?<=[.!?])\s+(?=[A-Z*_"“])/)){if(!/\bpress(?:ed|es)?\s+nothing(?:\s+new)?\b|\bno\s+new\s+press\b|\bdid\s+not\s+press\b|\bnothing\s+new\s+(?:was\s+)?pressed\b/i.test(s))continue;
   const who=/\bchallenger\b|\bDR4\b/i.test(s)?'C':/\bdefen(?:der|ce|se)\b|\bCR4\b/i.test(s)?'D':'?';const hit=who==='C'?pC:who==='D'?pD:pC.concat(pD);
   if(hit.length)SX.push('(S-F) -- the synthesis says the close pressed nothing new, while the system found '+hit.length+' press(es) in '+(who==='D'?"the defender's":who==='C'?"the challenger's":'a')+' close (first: '+String(hit[0]).slice(0,100).replace(/[\[\]"]/g,'')+'): "'+cut(s)+'"');}});}"""
s=rep(s,OLD_SD,NEW_SD,'Build Save Body')
s=rep(s,"m=x.match(/\\((K-G6)\\) -- ((?:DEFENDER|CHALLENGER) premise \\d+)/);if(m)return 'K-G6|'+m[2].toUpperCase();",
      "m=x.match(/\\((K-G6)\\) -- ((?:DEFENDER|CHALLENGER) premise \\d+)/);if(m)return 'K-G6|'+m[2].toUpperCase();m=x.match(/\\((K-G9)\\) -- ((?:DEFENDER|CHALLENGER) CITED-IN)/);if(m)return 'K-G9|'+m[2].toUpperCase();m=x.match(/\\((K-LB)\\) -- ((?:DEFENDER|CHALLENGER) premise \\d+)/);if(m)return 'K-LB|'+m[2].toUpperCase();",'Build Save Body')
OUT['Build Save Body']=s

# ======================= write =======================
for nm,s in OUT.items():
    if s==rd(nm): sys.exit(nm+': unchanged')
    open(f'{N}/{nm}.js','w').write(s)
print('wrote',len(OUT),'nodes:',', '.join(sorted(OUT)))
