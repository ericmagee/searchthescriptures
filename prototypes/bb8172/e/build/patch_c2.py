# BB-8172 step 1 (C2): add two mark-only checks to drvCheck's STANDS/UNDERDETERMINED branch.
# Anchored edits; each anchor must occur exactly once per file or the file is refused. Existing K-S and its cure are unchanged.
import os,sys,hashlib
B='base';N='new'
A1="const DRV_ANS=/[\\[(](?:CR|DR)[23]\\b/i;\n"
R1=A1+("// BB-8172 C2 (B): a round named without a bracket after in, at, by or from (\"answered in CR3\") counts as named, for the K-S2 mark only.\n"
 "const DRV_BARE=/\\b(?:in|at|by|from)\\s+(?:CR|DR)[23]\\b/i; // a round named as answering (\"answered in CR3\"), never a label such as \"Challenger-DR1/DR2\" (642)\n"
 "// BB-8172 C2 (A): K-U, a STANDS or UNDERDETERMINED line that itself says a witness went unnamed or unanswered (8193, the 7 MARK lines).\n"
 "// Positive forms only; a form counts only when the clause before it (since the last ; . or --) holds no negator, so \"no witness ...\n"
 "// was left unanswered\" and \"neither reading was left unanswered\" are not marked (8193, the 14 NO MARK lines).\n"
 "const DRV_UNANS=[/\\b(?:was|were|is|are)\\s+(?:left\\s+)?(?:not\\s+named|unnamed|unanswered|not\\s+answered)\\b/gi,/,\\s*not\\s+named\\b/gi,/\\bleft\\s+(?:\\S+\\s+){1,8}?unnamed\\b/gi,/\\bunanswered\\s+(?:[1-3]\\s+)?[A-Z][a-z]+\\s+\\d+:\\d+/g,/\\bthe\\s+unanswered\\s+[a-z]+/gi];\n"
 "const DRV_UNEG=/\\b(?:no|neither|nor|not|never|without|cannot)\\b/i;\n"
 "function drvUnans(line){for(const rx of DRV_UNANS){rx.lastIndex=0;let m;while((m=rx.exec(line))){const pre=line.slice(0,m.index);\n"
 "  const cl=pre.split(/;|\\.(?=\\s)|--|\\u2014/).pop();if(!DRV_UNEG.test(cl))return m[0];}}return null;}\n")
A2=("   if((gs==='UNDERDETERMINED'||gs==='STANDS')&&DRV_STATE.test(line)&&!DRV_ANS.test(line)){const sid=vs?(u.match(/^(?:[-•]|\\d+[.)])?\\s*(D\\d+\\s+VS\\.?\\s+C\\d+)/)||[null,'D'+ms[1]])[1].replace(/\\s+VS\\.?\\s+/,' vs '):'D'+ms[1];\n"
    "    items.push({rule:'K-S',side:null,link:sid,line});marks.push('[AUDIT v22: DEBATE RULE VIOLATION (K-S) -- '+sid+' '+gs+' rests on a single verse not stating a link or its contrary and names no round that answered the witness. REVIEW THIS ROW.]');}}}\n")
R2=("   if((gs==='UNDERDETERMINED'||gs==='STANDS')&&DRV_STATE.test(line)&&!DRV_ANS.test(line)){const sid=vs?(u.match(/^(?:[-•]|\\d+[.)])?\\s*(D\\d+\\s+VS\\.?\\s+C\\d+)/)||[null,'D'+ms[1]])[1].replace(/\\s+VS\\.?\\s+/,' vs '):'D'+ms[1];\n"
    "    items.push({rule:'K-S',side:null,link:sid,line});marks.push('[AUDIT v22: DEBATE RULE VIOLATION (K-S) -- '+sid+' '+gs+' rests on a single verse not stating a link or its contrary and names no round that answered the witness. REVIEW THIS ROW.]');}\n"
    "   // BB-8172 C2: marks only, never items, so nothing here reaches the cure, drv_uncured or a grade (8192, 8193).\n"
    "   if(gs==='UNDERDETERMINED'||gs==='STANDS'){const sid=vs?(u.match(/^(?:[-•]|\\d+[.)])?\\s*(D\\d+\\s+VS\\.?\\s+C\\d+)/)||[null,'D'+ms[1]])[1].replace(/\\s+VS\\.?\\s+/,' vs '):'D'+ms[1];\n"
    "    if(DRV_STATE.test(line)&&(DRV_ANS.test(line)||DRV_BARE.test(line)))marks.push('[AUDIT v22: DEBATE RULE VIOLATION (K-S2) -- '+sid+' '+gs+' gives as a ground that a verse does not state a link or its contrary, beside the round it names; that is never a ground. REVIEW THIS ROW.]');\n"
    "    const un=drvUnans(line);if(un)marks.push('[AUDIT v22: DEBATE RULE VIOLATION (K-U) -- '+sid+' '+gs+' says a witness went unanswered (\"'+un+'\"); a witness left unanswered is a BROKEN ground. REVIEW THIS ROW.]');}}}\n")
out=[]
for f in sorted(os.listdir(B)):
  t=open(os.path.join(B,f),encoding='utf-8').read()
  c1,c2=t.count(A1),t.count(A2)
  if (c1,c2)==(0,0): open(os.path.join(N,f),'w',encoding='utf-8').write(t); out.append((f,'unchanged')); continue
  if (c1,c2)!=(1,1): sys.exit('REFUSED '+f+' anchors '+str((c1,c2)))
  n=t.replace(A1,R1).replace(A2,R2)
  assert n!=t
  open(os.path.join(N,f),'w',encoding='utf-8').write(n); out.append((f,'patched'))
for f,s in out:
  print(f,s,hashlib.md5(open(os.path.join(N,f),'rb').read()).hexdigest())
