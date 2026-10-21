# BB-6904 revision 8, step 3 proposal (7177 DoD 2 as amended 7182): the exact code changes, as anchored replacements.
# Each anchor must occur exactly once in every node that holds it, or the patch refuses. Nothing here writes to n8n.
# Usage: python3 patch_rev8.py <node .js in> <node .js out>
import sys
A=[]
# A. drvCheck: K-G4, the pressing-sentence rule (Panel Build: "a cited verse counts as an unanswered witness only when the judge quotes
#    the sentence of the earlier round that pressed it against that link or a listed premise and names that round") applied to every
#    LINK BROKEN line, not only to lines K-G1 catches when the conceded count is 0.
A.append(("+' is 0. REVIEW THIS ROW.]');}}",
 "+' is 0. REVIEW THIS ROW.]');}\n"
 "  // BB-6904 rev 8 K-G4: every other LINK BROKEN line answers the pressing-sentence rule too; cured by a PRESSED line whose quotation is\n"
 "  // found in the named pressing round, or by WITHDRAWN (7176, 7184, 7186).\n"
 "  else{items.push({rule:'K-G4',side,link:id,line});marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G4) -- '+id+' '+g[1]+' counts a witness as unanswered; the rule counts it only with the quoted pressing sentence and its round. REVIEW THIS ROW.]');}}"))
# B. cure label
A.append(("const cureLabel=x=>x.rule==='K-B'?x.link:(x.rule==='K-G1'?'K-G1 '+x.link:'K-G3 '+x.side);",
 "const cureLabel=x=>x.rule==='K-B'?x.link:((x.rule==='K-G1'||x.rule==='K-G4')?x.rule+' '+x.link:'K-G3 '+x.side);"))
# C. cure rule text (prompt text: UNEXERCISED until the live run)
A.append(("+\"K-G3 (a standing graded SELF-SUPPORTED while links of that side are graded BROKEN): cure it either with CORRECTED STANDING for that side, \"",
 "+\"K-G4 (any other link you graded BROKEN on a witness left unanswered): cure it with a PRESSED line quoting the words of the earlier round that \"\n"
 " +\"pressed the witness (rounds as for K-G1), or with WITHDRAWN for that link. \"\n"
 " +\"For a K-G1 or K-G4 link whose cited verse the answering link round names ([CR3] against the defender, [DR3] against the challenger), add a SHORT line \"\n"
 " +\"quoting the words of that link round that answer it and saying from the text why they do not overturn the link; without it the link is not cured. \"\n"
 " +\"K-G3 (a standing graded SELF-SUPPORTED while links of that side are graded BROKEN): cure it either with CORRECTED STANDING for that side, \""))
# D. cure form
A.append(("+\"PRESSED: D<n> vs C<m> | [<round>] | \\\"<the words of that round, quoted exactly>\\\"\\n\"",
 "+\"PRESSED: D<n> vs C<m> | [<round>] | \\\"<the words of that round, quoted exactly>\\\"\\n\"\n"
 " +\"SHORT: D<n> vs C<m> | [<link round>] | \\\"<the words of that link round, quoted exactly>\\\" | <why they do not overturn the link>\\n\""))
# E. reply parser: SHORT lines
A.append(("const CURE_KEY=/^(RESTATED|WITHDRAWN|CORRECTED COUNT|CORRECTED STANDING|PRESSED)[ \\t]*:[ \\t]*(.*)$/;",
 "const CURE_KEY=/^(RESTATED|WITHDRAWN|CORRECTED COUNT|CORRECTED STANDING|PRESSED|SHORT)[ \\t]*:[ \\t]*(.*)$/;"))
A.append(("const o={restated:[],withdrawn:[],count:[],standing:[],pressed:[],malformed:[],prose:[]};",
 "const o={restated:[],withdrawn:[],count:[],standing:[],pressed:[],short:[],malformed:[],prose:[]};"))
A.append(("  else if(k[1]==='RESTATED'&&",
 "  else if(k[1]==='SHORT'&&(m=r.match(/^D(\\d+)\\s+vs\\.?\\s+C(\\d+)\\s*\\|\\s*\\[(CR3|DR3)\\]\\s*\\|\\s*[\"“](.+?)[\"”]\\s*\\|\\s*(\\S.{9,})$/i)))o.short.push({link:cureId(m[1],m[2]),round:m[3].toUpperCase(),q:m[4],why:m[5],line:l});\n"
 "  else if(k[1]==='RESTATED'&&"))
# F. cure verdicts: K-G4, and the SHORT requirement (K-G5) on K-G1 and K-G4 cures
A.append(("  if(!reply||!reply.ok)return res('UNCURED','cure call failed: '+(reply?reply.why:'no reply'),null);",
 "  if(!reply||!reply.ok)return res('UNCURED','cure call failed: '+(reply?reply.why:'no reply'),null);\n"
 "  // BB-6904 rev 8 K-G5 (operational_doc 27 class 1): the verses in the line's parentheses that the answering link round names; for those a\n"
 "  // SHORT line quoting that link round (found in its text) must stand beside the PRESSED line.\n"
 "  const lrK=x.side==='DEFENDER'?'CR3':'DR3';const refsIn=(ln)=>{const p=String(ln||'').match(/\\(([^)]*\\d+:\\d+[^)]*)\\)/);return p?p[1].split(/;\\s*/).map(s=>s.trim()).filter(Boolean):[];};\n"
 "  const named=(x.rule==='K-G1'||x.rule==='K-G4')&&typeof R[lrK]==='string'?refsIn(x.line).filter(r=>cureQ(R[lrK]).includes(cureQ(r))):[];\n"
 "  const shortOk=()=>!named.length||o.short.some(s=>U(s.link)===U(x.link)&&s.round===lrK&&cureFound(s.q,R[lrK]));\n"
 "  if(x.rule==='K-G4'){if(wd.has(U(x.link)))return res('CURED','withdrawn',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));\n"
 "   const ps=o.pressed.filter(p=>U(p.link)===U(x.link));const sl=o.short.filter(s=>U(s.link)===U(x.link)).map(s=>s.line);const lines=ps.map(p=>p.line).concat(sl);\n"
 "   if(!ps.length)return res('UNCURED','no PRESSED line and no WITHDRAWN line for '+x.link,lines);\n"
 "   const ok=ps.filter(p=>CURE_PRESS[x.side].includes(p.round));if(!ok.length)return res('UNCURED','PRESSED round '+ps.map(p=>'['+p.round+']').join(', ')+' does not press the '+x.side.toLowerCase(),lines);\n"
 "   const hit=ok.find(p=>typeof R[p.round]==='string'&&cureFound(p.q,R[p.round]));if(!hit)return res('UNCURED',ok.every(p=>typeof R[p.round]!=='string')?'the named round text could not be read':'no quotation found in the named round',lines);\n"
 "   if(!shortOk())return res('UNCURED','the link round '+lrK+' names '+named.join(', ')+'; no SHORT line quoting it',lines);\n"
 "   return res('CURED','pressed: quotation found in '+hit.round+(named.length?'; SHORT found in '+lrK:''),lines);}"))
A.append(("   if(hit)return res('CURED','corrected: '+x.side+' COUNT '+ns[0]+'; quotation found in '+hit.round,lines);",
 "   if(hit&&!shortOk())return res('UNCURED','the link round '+lrK+' names '+named.join(', ')+'; no SHORT line quoting it',lines);\n"
 "   if(hit)return res('CURED','corrected: '+x.side+' COUNT '+ns[0]+'; quotation found in '+hit.round,lines);"))
A.append(("const keys=x.rule==='K-B'?[x.link]:x.rule==='K-G1'?[x.link,x.side]:",
 "const keys=x.rule==='K-B'?[x.link]:(x.rule==='K-G1'||x.rule==='K-G4')?[x.link,x.side]:"))
# G. round extracts (D1, C1, D2, C2, D3, C3): a refusal the provider returns as the reply text (27177: 112 characters, normal finish).
#    Measured on one specimen; the pattern is that text, exact.
A.append(("if(RF)throw new Error(",
 "const RFT=(e.text&&/^\\s*The request was rejected because it was considered high risk\\.?\\s*$/i.test(e.text))?'reply text is the provider rejection \"'+String(e.text).trim().slice(0,80)+'\"':null; // BB-6904 rev 8: 27177\n"
 "if(RF||RFT)throw new Error("))
A.append(("refused by the provider: '+RF+';", "refused by the provider: '+(RF||RFT)+';"))
src=open(sys.argv[1]).read();out=src;done=[];
for old,new in A:
    n=out.count(old)
    if n==0: continue
    if n!=1: sys.exit('REFUSED: anchor occurs %d times: %r'%(n,old[:60]))
    out=out.replace(old,new);done.append(old[:40])
open(sys.argv[2],'w').write(out)
print(len(done),'anchors applied')
