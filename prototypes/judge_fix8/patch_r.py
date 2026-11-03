# patch_r.py (judge_fix8 part R, after the reviews of run 32306 by Worker_E and Worker_G1, and ruling 393): run by patch.py, in its namespace
# (OUT, get, rep, cut, lib, CHECK, CURE). Offline; anchored, refusing on a wrong count. Items:
#  R1  close-round grading check marks only grades/verdicts of the other side's links and new premise lists or presses (lib/c4p_press.js)
#  R2  the check computed once (Build Synthesis), stored (Build Save Body, review_notes AUDIT v27), printed from the stored result
#  R3  the single judge printed in the transcript after the panel, with its flags and cures (Format Markdown)
#  R4  a cure's corrected lines written in place, the originals kept as SUPERSEDED LINE audit lines and printed below them; a count cure's
#      table row carries the item's own RESPONSE
#  R5  K-LB reads footing, not tags (lib/lbfoot.js); FOOTING LAYERS in the rulebook and the cure prompt; the cure tests the block's own words
#  R6  K-S2 (TRIAL item, lib/ks2.js): GLM's forms of the retired single-verse ground, every GROUND clause and the reasoning line, cured like K-C
#  R7  the universal test (pre-check UNIVERSAL TEST; K-V passes a ruling that names the word, lib/kv.js); whole claim sentence in the lists
#  R8  the defender placeholder: removed from DD-2 (D1 Build, D2 Build), stripped in the defender extracts with a review line; the synthesis told
#  R9  the challenger close forbids premise lists and charges; a round heading that contradicts its round is normalized in the extracts
#  R10 S-E reads the claim's own words against every round of the side, the close rounds included
#  R11 K-LXX (TRIAL, lib/klxx.js): Septuagint scan served with the pre-check; a judge that says none occurred is marked
#  R12 the verse sheet serves Acts 13:33, Hebrews 1:5 and Hebrews 5:5 whenever it serves Psalms 2:7 or Acts 13:33 (guard DG-18)
#  R13 ruling 393: at most 8 pressed verses per listed premise, both sides; the rest are not witnesses and are listed as over the cap
C4P_NODES=['Build Independent Verdict','Build Save Body','Build Synthesis','C4 Build','C4 Extract','D4 Build','D4 Extract','Format Markdown','Panel Build']
EXTRACT=['C1 Extract','C2 Extract','C3 Extract','C4 Extract','D1 Extract','D2 Extract','D3 Extract','D4 Extract']
SHEET_NODES=['C1 Build','C1 Extract','C2 Build','C2 Extract','C3 Build','C3 Extract','C4 Build','D1 Build','D2 Build','D2 Extract','D3 Build','D3 Extract','D4 Build','D4 Extract','Init with Guards']
JB=['Panel Build','Build Independent Verdict']
def span(s,a,b,new,nm):
    i=s.find(a)
    if i<0 or s.count(a)!=1: sys.exit(f'{nm}: span start found {s.count(a)} times: {a[:100]!r}')
    j=s.find(b,i)
    if j<0: sys.exit(f'{nm}: span end not found: {b[:100]!r}')
    return s[:i]+new+s[j+len(b):]

# ---------------- R1, R2: the close-round grading check (9 copies of C4P) ----------------
C4P_NEW=lib('c4p_press.js')
for nm in C4P_NODES:
    OUT[nm]=span(get(nm)," const press=(F,sd)=>{"," return {refs,fresh,of,note,ofD,noteD,renum,noteR,declared,dlinks,cblocks,press,noteP};})();",C4P_NEW,nm)
s=get('Build Synthesis')
s=rep(s,"const __out={topic:I.topic,","const __CG=C4P.all({cr1,gr1,cr2,gr2,cr3,dr3,cr4,dr4}); /* judge_fix8 R2: the close-round grading check, computed once, from every round */\nconst __out={topic:I.topic,",'Build Synthesis')
s=rep(s,"C4P.noteP({cr1,dr3,cr4},'D')","C4P.noteL(__CG.D,'D')",'Build Synthesis')
s=rep(s,"C4P.noteP({cr1,dr3,dr4},'C')","C4P.noteL(__CG.C,'C')",'Build Synthesis')
s=rep(s,"sd:I.sd,requestBody:","sd:I.sd,close_graded:__CG,requestBody:",'Build Synthesis')
# R8: the synthesis is told the placeholder is a defect
s=rep(s,"4. How did the challenger engage, and did the defense hold its ground? ",
      "4. How did the challenger engage, and did the defense hold its ground? A sentence that stands in for an answer, such as the defender placeholder \"Noted. Not conceding here. Goes to review.\", is a defect of method, not discipline: name it as a defect, and never credit it as method (judge_fix8 R8). ",'Build Synthesis')
OUT['Build Synthesis']=s
CGS=("const __CGS=sd=>{try{if($('Build Synthesis').isExecuted){const g=$('Build Synthesis').first().json.close_graded;if(g&&Array.isArray(g[sd]))return g[sd];}}catch(e){}"
     "try{if($('Regrade Row').isExecuted){const p=C4P.stored($('Regrade Row').first().json.review_notes,sd);if(p)return p;}}catch(e){}return null;}; /* judge_fix8 R2: the stored close-round grading check (Build Synthesis, or the saved row on a regrade); else computed from every round */")
s=get('Panel Build')
s=rep(s,"const IG=RGL?RGL.ig:$('Init with Guards').first().json;const F=RGL?RGL.f:$('Final Output').first().json;","const IG=RGL?RGL.ig:$('Init with Guards').first().json;const F=RGL?RGL.f:$('Final Output').first().json;\n"+CGS,'Panel Build')
s=rep(s,"C4P.noteP(F,'D')","C4P.noteP(F,'D',__CGS('D'))",'Panel Build');s=rep(s,"C4P.noteP(F,'C')","C4P.noteP(F,'C',__CGS('C'))",'Panel Build')
OUT['Panel Build']=s
s=get('Build Independent Verdict')
s=rep(s,"const d=$('Final Output').first().json;const NL=String.fromCharCode(10);","const d=$('Final Output').first().json;const NL=String.fromCharCode(10);\n"+CGS,'Build Independent Verdict')
s=rep(s,"C4P.noteP(d,'D')","C4P.noteP(d,'D',__CGS('D'))",'Build Independent Verdict');s=rep(s,"C4P.noteP(d,'C')","C4P.noteP(d,'C',__CGS('C'))",'Build Independent Verdict')
OUT['Build Independent Verdict']=s
s=get('Format Markdown')
s=rep(s,"const rounds = [['Round 1 - Defender",
      "const __FR={cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3,cr4:r.defender_r4,dr4:r.challenger_r4}; /* judge_fix8 R2: every round */\n"
      "const __CGF=sd=>{const p=C4P.stored(r.review_notes,sd);if(p)return p;try{if($('Build Synthesis').isExecuted){const g=$('Build Synthesis').first().json.close_graded;if(g&&Array.isArray(g[sd]))return g[sd];}}catch(e){}return null;}; /* the stored result, as the judges were sent it */\n"
      "const rounds = [['Round 1 - Defender",'Format Markdown')
s=rep(s,"C4P.noteP({cr1: r.claude_r1, dr3: r.challenger_r3, cr4: r.defender_r4},'D')","C4P.noteP(__FR,'D',__CGF('D'))",'Format Markdown')
s=rep(s,"C4P.noteP({cr1: r.claude_r1, dr3: r.challenger_r3, dr4: r.challenger_r4},'C')","C4P.noteP(__FR,'C',__CGF('C'))",'Format Markdown')
OUT['Format Markdown']=s
s=get('Build Save Body')
s=rep(s,"const d=$input.first().json;const S=$('Init Seats').first().json;",
      "const d=$input.first().json;const S=$('Init Seats').first().json;\nconst __CGB=()=>{try{if($('Build Synthesis').isExecuted){const g=$('Build Synthesis').first().json.close_graded;if(g&&Array.isArray(g.D)&&Array.isArray(g.C))return g;}}catch(e){}return C4P.all(d);}; /* judge_fix8 R2 */",'Build Save Body')
s=rep(s,"pC=C4P.of(d).concat(C4P.press(d,'C').map(x=>x.s));pD=C4P.press(d,'D').map(x=>x.s);","const CG=__CGB();pC=C4P.of(d).concat(CG.C||[]);pD=CG.D||[]; /* judge_fix8 R2 */",'Build Save Body')
s=span(s,"for(const sd of ['D','C']){let gp=[];try{gp=C4P.press(d,sd);}","'. REVIEW THIS ROW.]');} // judge_fix5 G3",
       "{let CG={D:[],C:[]};try{CG=__CGB();}catch(e){}for(const sd of ['D','C']){if(!(sd==='D'?d.cr4:d.dr4))continue;FF.push(C4P.storeLine(CG[sd]||[],sd));}} // judge_fix8 R2 (judge_fix5 G3): the stored close-round grading check, in full, read back by Panel Build on a regrade and by Format Markdown",'Build Save Body')
OUT['Build Save Body']=s
OUT['D4 Extract']=rep(get('D4 Extract'),"graded=C4P.press(F4,'D').map(x=>x.s);","graded=[]; /* judge_fix8 R2: the grading check is computed once, in Build Synthesis */",'D4 Extract')
OUT['C4 Extract']=rep(get('C4 Extract'),"let graded=[];try{graded=C4P.press({dr4:raw},'C').map(x=>x.s);}catch(x){graded=[];} // judge_fix5 G3","// judge_fix8 R2: the close-round grading check is computed once, in Build Synthesis (judge_fix5 G3 computed it here, unused)",'C4 Extract')

# ---------------- R8, R9: the round extracts ----------------
TRUNC="let raw=e.text;if(e.trunc){raw+='\\n\\n[TRUNCATED: the provider reported the token limit -- raise max_tokens]';}"
for nm in EXTRACT:
    n=nm[1];dfd=nm[0]=='D'
    fx=("\n// judge_fix8 R8 (run 32306: the defender's round 2 wrote \"Noted. Not conceding here. Goes to review.\" three times; the synthesis praised it) and R9\n"
        "// (its challenger round 2 was headed \"Round 3 (close)\"): the placeholder is stripped from a defender round, and a heading in the first lines that names\n"
        "// another round number is set to this round's; each is recorded (round_fix) and Build Save Body writes a review line.\n"
        "const __RFX=(()=>{const n="+n+";const fx={heading:null,placeholder:0};"
        +("const PH=/(?:\\*\\*|__)?[\"“]?Noted\\.\\s*Not\\s+conceding\\s+here\\.\\s*Goes\\s+to\\s+review\\.?[\"”]?(?:\\*\\*|__)?/gi;const pm=raw.match(PH);if(pm){fx.placeholder=pm.length;raw=raw.replace(PH,'(placeholder removed by the system)');}" if dfd else "")
        +"const L=raw.split('\\n');for(let i=0,k=0;i<L.length&&k<3;i++){if(!L[i].trim())continue;k++;const h=L[i].match(/^([ \\t#*_>-]*)(.*?\\bRound\\s+)(\\d)\\b(\\s*\\((?:close|closing|close round|link round|link)\\)|\\s*[-–—:]?\\s*(?:close|closing)\\b(?:\\s+round)?)?(.*)$/i);"
        "if(!h||(!/^[ \\t]*(?:#|\\*\\*|__)/.test(L[i])&&L[i].length>160))continue;if(+h[3]===n)break;fx.heading=L[i].trim();L[i]=h[1]+h[2]+n+(n===4?' (close)':n===3?' (link round)':'')+h[5];break;}"
        "if(fx.heading)raw=L.join('\\n');return fx;})();")
    s=rep(get(nm),TRUNC,TRUNC+fx,nm)
    s=rep(s,"return [{json:{run_token:TOK,round:'"+nm[:2]+"',raw,","return [{json:{run_token:TOK,round:'"+nm[:2]+"',raw,round_fix:__RFX,",nm)
    OUT[nm]=s
REVL=("// judge_fix8 R8, R9: the placeholder stripped from a defender round and a round heading normalized, as the extracts record them.\n"
 "for(const nd of ['D1','C1','D2','C2','D3','C3','D4','C4']){let fx=null;try{if($(nd+' Extract').isExecuted)fx=$(nd+' Extract').first().json.round_fix;}catch(e){fx=null;}if(!fx)continue;\n"
 " if(fx.placeholder)FF.push('[AUDIT v27: DEFENDER PLACEHOLDER STRIPPED ('+nd+') -- the round held the placeholder \"Noted. Not conceding here. Goes to review.\" '+fx.placeholder+' time(s); the system removed it: it stands in for an answer and is a defect, not method. REVIEW THIS ROW.]');\n"
 " if(fx.heading)FF.push('[AUDIT v27: ROUND HEADING NORMALIZED ('+nd+') -- the model headed the round \"'+String(fx.heading).replace(/[\\[\\]\"]/g,'').slice(0,120)+'\", which contradicts its round label; the heading now names round '+nd.slice(1)+'. REVIEW THIS ROW.]');}\n")
CAPL=("// judge_fix8 R13 (md_notes_rulings 393): a listed premise carries at most 8 pressed verses under PRESSED WITH:; those after the 8th are listed.\n"
 "for(const [rk,who,txt,re] of [['DR2','challenger',d.gr2,/UNSUPPORTED-?\\s*\\[?L4\\]?\\s*PREMISES/gi],['CR3','defender',d.cr3,/CHALLENGER.{0,2}S\\s+UNSUPPORTED-?\\s*\\[?L4\\]?\\s*PREMISES/gi]]){const t=String(txt||'');let i=-1;for(const m of t.matchAll(re))i=m.index;if(i<0)continue;\n"
 " const its=t.slice(i).split(/\\n(?=\\s*\\**\\s*(?:\\d+[.)]\\s|LINK\\s+(?:\\d+|none)\\s*:))/i).filter(x=>/^\\s*\\**\\s*(?:\\d+[.)]\\s|LINK\\s+(?:\\d+|none)\\s*:)/i.test(x));\n"
 " its.forEach((x,k)=>{const j=x.search(/PRESSED WITH\\s*:/i);if(j<0)return;let seg=x.slice(j);const b=seg.search(/\\n\\s*\\n/);if(b>=0)seg=seg.slice(0,b);let K=[];try{K=[...new Set(REFP.keys(seg.replace(/^PRESSED WITH\\s*:\\s*/i,''),{scoped:true,cap:12}).map(z=>z.key))];}catch(e){K=[];}\n"
 "  if(K.length>8)FF.push('[AUDIT v27: PRESSED-WITH CAP (md_notes_rulings 393) -- the '+who+'\\'s list ['+rk+'] premise '+(k+1)+' carries '+K.length+' verses under PRESSED WITH:; the '+(K.length-8)+' after the 8th are over the cap and are not witnesses (ruling 392 applies to them): '+K.slice(8).join(', ')+'. REVIEW THIS ROW.]');});}\n")
s=get('Build Save Body')
s=rep(s,"const RN=FF.length?FF.join(' '):null;",REVL+CAPL+"const RN=FF.length?FF.join(' '):null;",'Build Save Body')
OUT['Build Save Body']=s
# R8: the source (DD-2 in the defender's prompts)
for nm in ['D1 Build','D2 Build']:
    OUT[nm]=rep(get(nm),"The only in-battle response to a correction — however textually accurate — is: \"Noted. Not conceding here. Goes to review.\" All self-examination",
      "A correction is answered on the chain, with book, chapter and verse; no stock phrase stands in for an answer, and a sentence that only defers a point to review is a defect, not an answer (judge_fix8 R8). All self-examination",nm)
# R9: the challenger's close
OUT['C4 Build']=rep(get('C4 Build'),"no verse your earlier rounds did not cite, no new premise, no new charge.",
  "no verse your earlier rounds did not cite, no new premise, no new charge. Write NO premise list in this round (no UNSUPPORTED-L4 PREMISES section, no numbered charges against the defender\\'s words, no PRESSED WITH: line) and NO charge or grade against any defender link (D1..Dn): the system marks every such sentence DISREGARDED (ruling 377). Head this round as round 4, your close, and as no other round.",'C4 Build')

# ---------------- R12: the verse sheet (15 copies of SHEET) ----------------
SH_OLD="if(m)out.push({book:m[1],c:+m[2],v:+m[3],key:k.key});}return out;};"
SH_NEW=("if(m)out.push({book:m[1],c:+m[2],v:+m[3],key:k.key});}\n"
 "  /* judge_fix8 R12 (guard DG-18: never quote Psalm 2:7 without its three NT occasions): a sheet that serves Psalms 2:7 or Acts 13:33 serves Acts 13:33, Hebrews 1:5 and Hebrews 5:5 with it */\n"
 "  if(seen.has('Psalms 2:7')||seen.has('Acts 13:33'))for(const k of ['Acts 13:33','Hebrews 1:5','Hebrews 5:5']){if(seen.has(k))continue;seen.add(k);const m=k.match(/^(.+) (\\d+):(\\d+)$/);out.push({book:m[1],c:+m[2],v:+m[3],key:k});}\n"
 "  return out;};")
for nm in SHEET_NODES: OUT[nm]=rep(get(nm),SH_OLD,SH_NEW,nm)

# ---------------- R7, R13: the debaters' lists ----------------
for nm,who in [('C2 Build','defender'),('D3 Build','challenger')]:
    OUT[nm]=rep(get(nm),"(operator ruling 392: a press must have a premise behind it).",
      "(operator ruling 392: a press must have a premise behind it). PRESSED WITH: carries at most 8 verses for one premise (operator ruling 393): a verse after the 8th is not a witness and is not weighed, so carry the 8 that bear most. The verbatim quote of each listed premise is a whole claim sentence of the "+who+", copied from its first word to its full stop, never a fragment of one.",nm)

# ---------------- R5, R7, R11, R13: the judges' rulebook and pre-check (Panel Build, Build Independent Verdict) ----------------
FOOT_DEF=("FOOTING LAYERS (judge_fix8; the definition the system link-round check uses; md_notes_rulings 400: L3 is supporting verse(s) for L1): a quoted KJV verse given with its book, chapter and verse is [L1], whether or not it is tagged; "
 "a named Hebrew or Greek word given with its meaning is [L2]; any other verse quoted with its book, chapter and verse after that [L1] verse, as its support, is [L3], whether or not it is tagged, the same chapter included. A reference with no quotation adds no layer. "
 "A tag alone makes no layer, and relabelling a verse in a judgment does not change what the block shows.")
KLXX=lib('klxx.js')
for nm in JB:
    s=get(nm)
    s=rep(s,"that one test applies to the defender and the challenger alike.","that one test applies to the defender and the challenger alike. "+FOOT_DEF,nm)
    s=rep(s,"(a premise with no verbatim quote is ruled VOID on that ground).","(a premise with no verbatim quote is ruled VOID on that ground). The system computes the universal test for every premise and gives it in the PRE-CHECK (UNIVERSAL TEST): a VOID ruling names the word that makes the charge stronger, as the test lists it, or quotes the claim the quote does not make.",nm)
    s=rep(s,"lines are informational and are not a list of witnesses.","lines are informational and are not a list of witnesses. A PRESS HAS A CAP (md_notes_rulings 393): a premise carries at most eight pressed witnesses; a verse after the eighth under the PRESSED WITH: of one premise is not a witness (ruling 392 applies to it), and the ledger lists it as over the cap.",nm)
    s=rep(s,"  return label+': absent from its quote: '+(out.length?out.slice(0,30).join(', '):'none');});}",
      "  const U=[...new Set((charge.toLowerCase().match(/[a-z]+/g)||[]).filter(w=>(NEG.test(w)||UNI.test(w)||/^(?:reversed|any|nothing|nowhere|excludes?|excluded)$/.test(w))&&!qw.has(w)))]; /* judge_fix8 R7: the universal test */\n"
      "  return label+': absent from its quote: '+(out.length?out.slice(0,30).join(', '):'none')+' || UNIVERSAL TEST: '+(U.length?'the charge adds '+U.map(w=>w.toUpperCase()).join(', ')+', which its quote lacks':'no negation or universal word beyond its quote');});}",nm)
    s=rep(s," const lines=[].concat(preCheckSide(r.gr2,[r.cr1,r.cr2],'CHALLENGER LIST [DR2]'),preCheckSide(r.cr3,[r.gr1,r.gr2],'DEFENDER LIST [CR3]'));",
      " const lines=[].concat(preCheckSide(r.gr2,[r.cr1,r.cr2],'CHALLENGER LIST [DR2]'),preCheckSide(r.cr3,[r.gr1,r.gr2],'DEFENDER LIST [CR3]'),[(()=>{try{return lxxLine({CR1:r.cr1,DR1:r.gr1,CR2:r.cr2,DR2:r.gr2,CR3:r.cr3,DR3:r.dr3,CR4:r.cr4,DR4:r.dr4});}catch(e){return 'SEPTUAGINT SCAN: not computed';}})()]); /* judge_fix8 R11 */",nm)
    s=rep(s,"A line that says no verbatim quote found is not a ground for VOID: check the quote against the opponent\\'s rounds yourself.'",
      "A line that says no verbatim quote found is not a ground for VOID: check the quote against the opponent\\'s rounds yourself. UNIVERSAL TEST (computed by the system, judge_fix8): for each premise, a negation or universal word (only, never, all, none, no, not, every, reversed ...) in its charge that its quote lacks; a VOID ruling for a charge stronger than its quote names that word, or quotes the claim the quote does not make. The SEPTUAGINT SCAN line lists any round that rests a reading on the Greek Old Testament: name it at the citation check.'",nm)
    s=rep(s,"\nfunction preCheckSide(","\n"+KLXX+"\nfunction preCheckSide(",nm)
    # R13: the ledger counts at most 8 pressed verses per premise; the rest are listed as over the cap
    s=rep(s,"   for(const r of refs(xw)){const label=((r.book||r.ctx)?((r.book||r.ctx)+' '):'')+r.label;if(seen.has(label))continue;seen.add(label);\n    if(r.cvs.some(",
      "   const over=[];let nk=0;const kk=new Set(); /* judge_fix8 R13 (md_notes_rulings 393): at most 8 pressed verses per premise; the rest are over the cap, not witnesses */\n"
      "   for(const r of refs(xw)){const label=((r.book||r.ctx)?((r.book||r.ctx)+' '):'')+r.label;if(seen.has(label))continue;const nw=r.cvs.filter(cv=>!kk.has((r.book||r.ctx||'')+' '+cv));if(nk>=8&&nw.length){if(!over.includes(label))over.push(label);continue;}nw.forEach(cv=>kk.add((r.book||r.ctx||'')+' '+cv));nk+=nw.length;seen.add(label);\n    if(r.cvs.some(",nm)
    s=rep(s,"   return {n:k+1,link:lk,verses:seen.size,named,notNamed,info:info.filter(l=>!seen.has(l))};});","   return {n:k+1,link:lk,verses:seen.size,named,notNamed,info:info.filter(l=>!seen.has(l)&&!over.includes(l)),over};});",nm)
    s=rep(s,"p.verses+' verse(s) carried under PRESSED WITH; '+p.named+' named'+inf+'; NOT NAMED: '",
      "p.verses+' verse(s) carried under PRESSED WITH; '+p.named+' named'+inf+(p.over&&p.over.length?'; over the cap of 8 pressed verses (md_notes_rulings 393), not witnesses: '+p.over.join(', '):'')+'; NOT NAMED: '",nm)
    OUT[nm]=s
s=get('D4 Build')
s=rep(s,"   for(const r of refs(xw)){const label=((r.book||r.ctx)?((r.book||r.ctx)+' '):'')+r.label;if(seen.has(label))continue;seen.add(label);\n    if(r.cvs.some(cv=>isNamed(N,r.book||r.ctx||'',cv)))named++;",
  "   let nk=0;const kk=new Set(); /* judge_fix8 R13 (md_notes_rulings 393): only the first 8 pressed verses of a premise are witnesses */\n"
  "   for(const r of refs(xw)){const label=((r.book||r.ctx)?((r.book||r.ctx)+' '):'')+r.label;if(seen.has(label))continue;const nw=r.cvs.filter(cv=>!kk.has((r.book||r.ctx||'')+' '+cv));if(nk>=8&&nw.length)continue;nw.forEach(cv=>kk.add((r.book||r.ctx||'')+' '+cv));nk+=nw.length;seen.add(label);\n    if(r.cvs.some(cv=>isNamed(N,r.book||r.ctx||'',cv)))named++;",'D4 Build')
OUT['D4 Build']=s


# judge_fix8 R5 as amended by ruling 400 (coordinator): one definition everywhere. The judges' BROKEN-line rule (rulebook and the 14 cure prompts)
# reads layers by FOOTING LAYERS, and the BROKEN-line checker (drvLayers, the K-B count and the K-C/K-LB cure tests) uses the same reader, lbFoot.
for nm in JB+CURE:
    s=get(nm)
    s=span(s,"at least two lower layers of DIFFERENT kinds, each tagged: [L1] with the KJV words quoted;","Two quotations at one layer are one layer.",
           "at least two lower layers of DIFFERENT kinds, read by FOOTING LAYERS (md_notes_rulings 400). "+FOOT_DEF,nm)
    OUT[nm]=s
for nm in CHECK+CURE:
    OUT[nm]=rep(get(nm),"function drvLayers(text){","function drvLayers(text){return lbFoot(text,true);} /* judge_fix8 R5, ruling 400: the layer kinds of a line or block, read by FOOTING LAYERS (lib/lbfoot.js) */\nfunction drvLayersByTag(text){",nm)
s=get('Format Markdown')
s=rep(s,"[L1] the KJV words quoted, [L2] the Hebrew","[L1] the first KJV verse quoted with its reference (tagged or not), [L2] the Hebrew",'Format Markdown')
s=rep(s,"or [L3] the cross-reference named. A judge whose line","or [L3] any other verse quoted with its reference after it, as its support (operator ruling 400); a tag alone makes no layer. A judge whose line",'Format Markdown')
OUT['Format Markdown']=s

# ---------------- R5, R6, R11: the checkers (3) and the checker copies in the cure nodes (14) ----------------
KS2=lib('ks2.js');LBF=lib('lbfoot.js')
for nm in CHECK+CURE:
    s=get(nm)
    s=rep(s,"'K-V':'TRIAL',","'K-V':'TRIAL','K-S2':'TRIAL','K-LXX':'TRIAL',",nm)
    s=rep(s,"\nfunction drvCheck(","\n"+KS2+"\n"+LBF+"\nfunction drvCheck(",nm)
    s=rep(s,"if(DRV_STATE.test(drvGround(line,DL))&&(DRV_ANS.test(line)||DRV_BARE.test(line)))marks.push('[AUDIT v22: DEBATE RULE VIOLATION (K-S2)",
          "if(false&&DRV_STATE.test(drvGround(line,DL))&&(DRV_ANS.test(line)||DRV_BARE.test(line)))marks.push('[AUDIT v22: DEBATE RULE VIOLATION (K-S2)",nm) # judge_fix8 R6: the K-S2 item below replaces this mark
    s=rep(s,"the chain is weighed as a whole. REVIEW THIS ROW.]');}\n return {items,marks};}",
          "the chain is weighed as a whole. REVIEW THIS ROW.]');}\n {const kc=new Set(items.filter(x=>x.rule==='K-C').map(x=>String(x.link).toUpperCase()));const k2=ks2Lines(text,kc);k2.items.forEach(x=>items.push(x));k2.marks.forEach(x=>marks.push(x));} // judge_fix8 R6: K-S2 (TRIAL, lib/ks2.js)\n return {items,marks};}",nm)
    if nm in CHECK:
        s=rep(s,"const lbKinds=block=>drvLayers(block);","const lbKinds=block=>lbFoot(block); /* judge_fix8 R5: the block's footing (FOOTING LAYERS), not its tags */",nm)
        s=rep(s,"\nfunction drvPressWith(","\n"+KLXX+"\nfunction drvPressWith(",nm)
    OUT[nm]=s

# ---------------- R4, R5, R6, R7, R11: the cure (14 nodes) ----------------
KS2_PROMPT=(" K-S2 (a collision line, or your reasoning line, that rests in any GROUND clause on the retired single-verse ground in another form: no witness states it in its "
 "own words, none states that, states no ...): that a verse or witness does not state the point in its own words is never a ground (DG-61). Cure it as K-C: one RESTATED line "
 "for the item that drops that ground and weighs the chains on their footing (two layer kinds), or a RETRACTED line with one CORRECTED RESULT. ")
KLXX_PROMPT=(" K-LXX (your text says no Septuagint reading or reference occurred, but the system scan found a round that rests a reading on the Greek Old Testament): cure it with "
 "a STATEMENT for the item that names the Septuagint reading and the round that rests on it, quoting that round, or with one RESTATED CITATION CHECK line that names it. ")
KV_P_OLD="Cure it with a STATEMENT for the item that quotes, word for word, the charge words that go beyond the quote and names the kind;"
KV_P_NEW="Cure it with a STATEMENT for the item that names the word that makes the charge stronger, as the pre-check UNIVERSAL TEST lists it, or that quotes, word for word, the charge words that go beyond the quote and names the kind;"
LB_P_OLD="the two layer kinds the block shows ([L1] the KJV words quoted, in double or single quotation marks, [L2] the source word with its meaning, [L3] the cross-reference named). "
LB_P_NEW=("the two layer kinds the block itself shows, read by FOOTING LAYERS; a tag you add, or a verse you relabel, does not change the block. "+FOOT_DEF+" ")
KLXXC=lib('klxx_cure.js')
for nm in CURE:
    s=get(nm)
    s=rep(s,"x.rule==='K-G11'||x.rule==='K-V'||x.rule==='K-LB'||x.rule==='K-S'","x.rule==='K-G11'||x.rule==='K-V'||x.rule==='K-LB'||x.rule==='K-S'||x.rule==='K-S2'||x.rule==='K-LXX'",nm,2)
    s=rep(s,KV_P_OLD,KV_P_NEW,nm)
    s=rep(s,KV_P_NEW,KV_P_NEW,nm)
    s=rep(s,LB_P_OLD,LB_P_NEW,nm)
    i=s.find(KV_P_NEW);j=s.find(" K-LB (a link-round block",i)
    if i<0 or j<0: sys.exit(nm+': K-V/K-LB prompt order not found')
    s=s[:j]+KS2_PROMPT+KLXX_PROMPT+s[j:]
    # K-S2 is cured as K-C is, its own pattern testing the restated line
    a=s.find("  if(x.rule==='K-C'){const rs=cureRest(o,x);");b=s.find("  // judge_fix2 E1, E4: K-N and K-K",a)
    if a<0 or b<0 or s.count("  if(x.rule==='K-C'){const rs=cureRest(o,x);")!=1: sys.exit(nm+': K-C cure branch not found')
    br=s[a:b];br2=br.replace("  if(x.rule==='K-C'){const rs=cureRest(o,x);","  if(x.rule==='K-C'||x.rule==='K-S2'){const KEEP=x.rule==='K-S2'?ks2Keeps:netKeeps; /* judge_fix8 R6 */const rs=cureRest(o,x);")
    if br2.count("netKeeps(")!=2: sys.exit(nm+': K-C branch netKeeps count '+str(br2.count("netKeeps(")))
    br2=br2.replace("if(netKeeps(rs[0].text))","if(KEEP(rs[0].text))").replace("st&&!netKeeps(st)","st&&!KEEP(st)")
    s=s[:a]+br2+s[b:]
    s=rep(s,"x.rule==='K-S'||x.rule==='K-C'||x.rule==='K-N'||x.rule==='K-SC'||x.rule==='K-K')?[x.link]","x.rule==='K-S'||x.rule==='K-C'||x.rule==='K-S2'||x.rule==='K-LXX'||x.rule==='K-N'||x.rule==='K-SC'||x.rule==='K-K')?[x.link]",nm)
    # K-LXX
    s=rep(s,"  // judge_fix5 G13 K-LB: counted",KLXXC+"\n  // judge_fix5 G13 K-LB: counted",nm)
    # R5: the K-LB statement is tested on the block's own words; a reply that says the premise is not counted is not cured by another premise's count
    s=rep(s,"if(st&&!o.count.some(c=>c.side===x.side&&c.n>(x.conc||0))){const k=drvKinds(st);const qs=stmtQ(st);const hit=typeof R[rk]==='string'&&qs.some(q=>cureFound(q,R[rk]));\n    if(k.length>=2&&hit)return res('CURED','statement quotes ['+rk+'] and exhibits '+k.join(' and '),['STATEMENT: '+st],k);",
      "const notC=/\\bnot\\s+counted\\b|\\bmark\\s+is\\s+wrong\\b|\\bshould\\s+not\\s+be\\s+counted\\b/i.test(String(respOf(x)||'')+' '+String(st||'')); /* judge_fix8 R4: the item's own answer, not another premise's count */\n"
      "   if(st&&(notC||!o.count.some(c=>c.side===x.side&&c.n>(x.conc||0)))){const k=lbFoot(lbBlockText(R[rk],x.premise),true); /* judge_fix8 R5: the block's own words, read by FOOTING LAYERS; the judge's tags and relabelling do not count */const qs=stmtQ(st);const hit=typeof R[rk]==='string'&&qs.some(q=>cureFound(q,R[rk]));\n"
      "    if(k.length>=2&&hit)return res('CURED','statement quotes ['+rk+'] and the block, read by FOOTING LAYERS, exhibits '+k.join(' and '),['STATEMENT: '+st],k);",nm)
    s=rep(s,"step=!qs.length?'step 2 (quotation): the STATEMENT quotes no words in quotation marks':!hit?'step 2 (quotation): no quotation in the STATEMENT stands in ['+rk+']':'step 3 (layer kinds): the STATEMENT exhibits '+(k.length?k.join(' and ')+' only':'no layer kind')+', fewer than two';}",
      "step=!qs.length?'step 2 (quotation): the STATEMENT quotes no words in quotation marks':!hit?'step 2 (quotation): no quotation in the STATEMENT stands in ['+rk+']':'step 3 (layer kinds): the block, read by FOOTING LAYERS, exhibits '+(k.length?k.join(' and ')+' only':'no layer kind')+', fewer than two; a tag or relabelling in the STATEMENT does not change the block';\n"
      "    if(notC)return res('UNCURED','the item\\'s own answer says the premise is not counted, and the STATEMENT was refused at '+step,['STATEMENT: '+st],k);}",nm)
    # R4: a count cure's report carries the item's own RESPONSE beside the count lines it shares
    s=rep(s,"   return res('CURED','counted: '+x.side+' COUNT '+ns[0]+', STANDING '+want,lines);};",
      "   return res('CURED','counted: '+x.side+' COUNT '+ns[0]+', STANDING '+want,lines.concat(respOf(x)?['RESPONSE: '+respOf(x)]:[]));}; /* judge_fix8 R4: the item's own answer stands beside the count it shares */",nm)
    # R4: the recompute compares the lines as the judge wrote them, and writes a restated line of the same grade in place of the original
    s=rep(s,"  const rs=cureRest(o,x).filter(r=>!r.retraction);if(rs.length!==1||!rs[0].grade||rs[0].grade==='STANDS'||rs[0].grade===c.grade)continue;done.add(U(c.link));",
      "  const rs=cureRest(o,x).filter(r=>!r.retraction);if(rs.length!==1||!rs[0].grade||rs[0].grade==='STANDS')continue;\n"
      "  if(rs[0].grade===c.grade){done.add(U(c.link));same.push([c.raw,rs[0].text]);continue;} /* judge_fix8 R4: same grade, the restated line written in place */done.add(U(c.link));",nm)
    s=rep(s,"const trig=[];const rp=[];const col=P.col.map(c=>({...c}));const done=new Set();","const trig=[];const rp=[];const same=[];const col=P.col.map(c=>({...c}));const done=new Set();",nm)
    s=rep(s," if(!trig.length)return null;",
      " if(!trig.length){if(!same.length)return null; /* judge_fix8 R4: only restated lines of the same grade: written in place, the fields unchanged */\n"
      "  return {fields:{verdict_tag:F.verdict_tag,defense_standing:F.defense_standing,conceded_links:F.conceded_links,challenge_standing:F.challenge_standing,challenger_conceded_links:F.challenger_conceded_links},result:null,result0:null,tag:null,trig:[],rp:same,retracted:[],\n"
      "   audit:'[AUDIT v27: RESTATED LINES WRITTEN -- '+(seat?'SEAT: '+seat+'; ':'')+same.length+' collision line(s) restated in the cure with the same grade are written in place of the originals; the fields are unchanged]'};}\n rp.push(...same);",nm)
    s=rep(s,"  if(x&&(st!==st0||c[sd]!==cnt[sd]))rp.push(",
      "  const tv=x?(x.u.match(/STANDING\\s*:\\s*([A-Z-]+)/)||[])[1]:null,tc=x?(x.u.match(/\\bC\\s*=\\s*(\\d+)/)||[])[1]:null; /* judge_fix8 R4: the line as the judge wrote it, not only the fields (run 32306 GLM) */\n"
      "  if(x&&(st!==st0||c[sd]!==cnt[sd]||(tv&&tv!==st)||(tc!=null&&+tc!==c[sd])))rp.push(",nm)
    s=rep(s,"  const y=P.cn[lab[sd]];if(y&&cnew[sd])rp.push([y.raw,lab[sd]+': '+c[sd]+' -- '+why+(cnew[sd].from?",
      "  const y=P.cn[lab[sd]];const yc=y?(y.u.match(/^(?:CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\\s*:\\s*(\\d+)/)||[])[1]:null;if(y&&(cnew[sd]||(yc!=null&&+yc!==c[sd])))rp.push([y.raw,lab[sd]+': '+c[sd]+' -- '+why+(cnew[sd]&&cnew[sd].from?",nm)
    # R4: each replaced line's original kept, in full, on a SUPERSEDED LINE audit line Format Markdown prints below the corrected line
    s=rep(s," return s+'\\n'+R.audit;}",
      " const lab=l=>{const u=rcOne(l).replace(/[*_`]+/g,'').replace(/^(?:[-•]|\\d+[.)])?\\s*/,'').toUpperCase();const m=u.match(/^(D\\d+\\s+VS\\.?\\s+C\\d+|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|RESULT|CLAUSE|KEYSTONE)\\b/);return m?m[1].replace(/\\s+VS\\.?\\s+/,' VS '):'LINE';};\n"
      " const sup=(R.rp||[]).map(([o0,n0])=>'\\n[AUDIT v27: SUPERSEDED LINE -- '+(seat?'SEAT: '+seat+'; ':'')+'LABEL: '+lab(n0)+'; ORIGINAL: '+cureSafe(rcOne(o0)).replace(/;\\s*END\\]/g,', END')+' ; END]').join(''); /* judge_fix8 R4 */\n"
      " return s+'\\n'+R.audit+sup;}",nm)
    OUT[nm]=s

# ---------------- R3, R4: the transcript (Format Markdown) ----------------
s=get('Format Markdown')
s=rep(s,"const panelText = (raw, j) => {",
 "// judge_fix8 R4 (run 32306: GLM's printed judgment kept DEFENSE STANDING: SELF-SUPPORTED -- L=6 c=0 and four collision lines in their first form after\n"
 "// the cure): the cure writes each corrected line in place and keeps the original on an AUDIT v27 SUPERSEDED LINE; the original prints below it.\n"
 "const superOf = raw => [...String(raw || '').matchAll(/\\[AUDIT v27: SUPERSEDED LINE -- (?:SEAT: [^;\\]]*; )?LABEL: ([^;\\]]*); ORIGINAL: ([^\\]]*?) ; END\\]/g)].map(m => ({ label: m[1].trim().toUpperCase(), orig: m[2].replace(/\\((CR[1-4]|DR[1-4]|L[1-4])\\)/g, '[$1]') }));\n"
 "const superApply = (txt, raw) => { const S = superOf(raw); if (!S.length) return txt; const used = new Set(); const out = [];\n"
 "  for (const l of String(txt).split('\\n')) { out.push(l); const u = l.replace(/[*_`]+/g, '').replace(/^\\s*(?:[-•]|\\d+[.)])?\\s*/, '').replace(/\\s+VS\\.?\\s+/i, ' VS ').toUpperCase(); const k = S.findIndex((x, i) => !used.has(i) && u.startsWith(x.label)); if (k < 0) continue; used.add(k);\n"
 "    out[out.length - 1] = l + ' *(corrected by the cure)*'; out.push('', '> *Superseded by the cure (the judge\\'s line before it):* ' + S[k].orig.replace(/\\s+/g, ' '), ''); }\n"
 "  return out.join('\\n'); };\n"
 "const panelText = (raw, j) => {",'Format Markdown')
s=rep(s,"demote(nameGuards(noMarkers(beforeCure((o.reasoning == null && o.reason != null ? o.reason : o.reasoning) || '(no reasoning given)', curedTo(raw)))))",
        "demote(nameGuards(noMarkers(superApply(beforeCure((o.reasoning == null && o.reason != null ? o.reason : o.reasoning) || '(no reasoning given)', curedTo(raw)), raw))))",'Format Markdown')
SJSEC=("// judge_fix8 R3 (run 32306, Worker_E A3: the single judge wrote a 15,584-character second opinion, was flagged four times and cured all four, and none of it\n"
 "// was printed): the single judge's verdict, its text (its corrected lines in place), its flags and its cures, after the panel. A second opinion: not counted.\n"
 "{ const s = String(r.independent_verdict_raw || ''); if (s.trim()) { const i = s.indexOf('\\n\\n[AUDIT'); const txt = i < 0 ? s : s.slice(0, i); const tail = i < 0 ? '' : s.slice(i);\n"
 "  const flags = (tail.match(/\\[(?:EXTRACTOR|AUDIT) v\\d+[^\\]\\n]*REVIEW THIS ROW[^\\]\\n]*\\]/g) || []); const cs = curedSet(s); const rows = drvRead('Single judge ' + SJN, s).rows;\n"
 "  t += '## Single judge (second opinion): ' + SJN + ' (' + (r.judge_model || 'model not recorded') + '): ' + (SJV || '?') + VSIDE + '\\n\\n*A second opinion, not counted in the panel result. Its own text follows, with the lines its cure corrected written in place.*\\n\\n' + demote(nameGuards(noMarkers(superApply(beforeCure(txt, curedTo(s)), s)))) + '\\n\\n';\n"
 "  t += '**Its flags** (' + flags.length + '):' + (flags.length ? '\\n\\n' + flags.map(x => { const k = flagKey(x); const cured = k && cs.has(k); return '- ' + (cured ? 'Cured: ' : 'For review: ') + x.slice(1, -1).replace(/\\s*REVIEW THIS ROW\\.?/, '').trim(); }).join('\\n') : ' none') + '\\n\\n';\n"
 "  if (rows.length) { t += '**Its cures** (' + rows.filter(x => x.RESULT === 'CURED').length + ' cured of ' + rows.length + '):\\n\\n| Item | Rule | Result | Original line | Cure statement, or why not cured | Judge\\'s own statement |\\n|---|---|---|---|---|---|\\n';\n"
 "   rows.forEach(x => { const last = x.RESULT === 'CURED' ? (x.STATEMENT || x.WHY || '') : ((x.STATEMENT ? x.STATEMENT + ' -- ' : '') + (x.WHY ? 'Not cured: ' + x.WHY + '.' : 'Not cured.')); t += '| ' + drvCell(x.ITEM) + ' | ' + drvCell(DRV_RULE[x.RULE] || x.RULE) + ' | **' + drvCell(x.RESULT) + '** | ' + drvCell(x.LINE || '') + ' | ' + drvCell(last) + ' | ' + drvCell(x['JUDGE STATEMENT'] || '') + ' |\\n'; }); t += '\\n'; }\n"
 "  else t += '**Its cures:** none (no item was sent to its cure).\\n\\n';\n"
 "  t += '---\\n\\n'; } }\n")
s=rep(s,"t += (PF ? '*Debate incomplete: the panel stage failed (see the notice at the top).*' : '*Debate complete.*')",SJSEC+"t += (PF ? '*Debate incomplete: the panel stage failed (see the notice at the top).*' : '*Debate complete.*')",'Format Markdown')
s=rep(s,"'K-V': 'VOID ruling without the charge words or the kind (K-V)',","'K-V': 'VOID ruling without the charge words or the kind (K-V)', 'K-S2': 'Single-verse ground in another form (K-S2)', 'K-LXX': 'Septuagint reading said not to occur (K-LXX)',",'Format Markdown')
s=rep(s,"x.match(/\\((K-S|K-C|K-N|K-SC|K-K|K-DG8)\\) -- (D\\d+(?: vs C\\d+)?|REASONING|","x.match(/\\((K-S|K-S2|K-LXX|K-C|K-N|K-SC|K-K|K-DG8)\\) -- (D\\d+(?: vs C\\d+)?|REASONING|CITATION CHECK|",'Format Markdown')
OUT['Format Markdown']=s
OUT['Build Save Body']=rep(get('Build Save Body'),"x.match(/\\((K-S|K-C|K-N|K-SC|K-K|K-DG8)\\) -- (D\\d+(?: vs C\\d+)?|REASONING|","x.match(/\\((K-S|K-S2|K-LXX|K-C|K-N|K-SC|K-K|K-DG8)\\) -- (D\\d+(?: vs C\\d+)?|REASONING|CITATION CHECK|",'Build Save Body')

# ---------------- R10: S-E reads the claim's own words against every round of the side, the close rounds included ----------------
s=get('Build Save Body')
s=rep(s,"   if(!affirmed(SIDEC[side],fr,objs))SX.push('(S-E) --",
 "   /* judge_fix8 R10 (run 32306: \"C3 (Galatians 4:4 says what Job 14:1 and Matthew 11:11 say) ... conceded by the defender\", while the defender's close reads\n"
 "      \"Galatians 4:4, 'made of a woman,' says what Job 14:1 and Matthew 11:11 say of every mortal\"): the claim's own references, read before the verb, standing\n"
 "      together within 300 characters of a round of that side (its close included), hold the words */\n"
 "   const held=(()=>{const pre=s.slice(0,s.toLowerCase().indexOf(verb));const rf=[...new Set([...pre.matchAll(/\\b((?:[1-3]\\s)?[A-Z][a-z]+)\\.?\\s+(\\d{1,3}):(\\d{1,3})/g)].map(m=>m[1]+' '+m[2]+':'+m[3]))];if(rf.length<2)return false;\n"
 "    const T=String(SIDEC[side]||'').replace(/[*_]+/g,'');const at=rf.map(x=>{const o=[];let i=-1;while((i=T.indexOf(x,i+1))>=0)o.push(i);return o;});return at[0].some(p=>at.every(a=>a.some(q=>Math.abs(q-p)<=300)));})();\n"
 "   if(!held&&!affirmed(SIDEC[side],fr,objs))SX.push('(S-E) --",'Build Save Body')
OUT['Build Save Body']=s
