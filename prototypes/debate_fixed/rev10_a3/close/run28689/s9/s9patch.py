# Step 6 build (P2D v6a, BB-8138): items 1a, 1b, 2, 3, 6a, 6b of step 5 text d647a890 on dfa2da34 node text (s8/final -> s9).
# Every edit is an exact anchor that must occur exactly once in each file it targets; any miss stops the run.
import os, sys, glob
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 's9')
SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), 's8', 'final')
files = {os.path.basename(p): open(p, encoding='utf-8').read() for p in glob.glob(os.path.join(SRC, '*.js'))}
log = []

def edit(names, old, new, tag):
    for n in names:
        t = files[n]
        c = t.count(old)
        if c != 1:
            sys.exit('STOP: %s anchor count %d in %s' % (tag, c, n))
        files[n] = t.replace(old, new)
        log.append('%s: %s' % (tag, n))

PROMPTS = ['Panel_Build.js', 'Build_Independent_Verdict.js']
LIB = sorted(n for n, t in files.items() if 'function drvCheck(' in t)          # 17
CURE = sorted(n for n, t in files.items() if 'function cureVerdicts(' in t)     # 14
assert len(LIB) == 17 and len(CURE) == 14, (len(LIB), len(CURE))

# ITEM 1a: the text's wording, appended to the CHAIN SCOPE sentence.
T1A = ("A link marked STANDS, or a collision graded UNDERDETERMINED, against a witness the other side exhibited names in the same line "
       "the round that answered that witness. A witness left unanswered is a BROKEN ground. That a single verse does not state a link or its "
       "contrary is never a ground for STANDS or UNDERDETERMINED, for either side.")
edit(PROMPTS, 'is never a ground for STANDS or UNDERDETERMINED. Grade a link BROKEN',
     'is never a ground for STANDS or UNDERDETERMINED. ' + T1A + ' Grade a link BROKEN', '1a')

# ITEM 6a: the chain-mark float test, in the text's words.
edit(PROMPTS, 'one or more load-bearing links float, asserted at L4 without exhibited footing; it stands only under charity.',
     'one or more load-bearing links float: a link floats only when the block that states it exhibits fewer than two prior layers; '
     'the mark names the layers exhibited and the layer lacking; it stands only under charity.', '6a')

# ITEM 6b: the insert clause, replaced in the text's words.
edit(PROMPTS, 'a verse held to contradict it is quoted in the words that state the contrary',
     'the witnesses held to contradict it are quoted, and they contradict it read together, line upon line', '6b')

# ITEM 3: the text's sentence in the cure answer form, after the retraction's effect.
T3 = ("A BROKEN line you retract is regraded in the same reply: UNDERDETERMINED only with the round that answered each witness named; "
      "a witness left unanswered keeps the line BROKEN in the corrected form. ")
edit(CURE, 'so that one line cures every item flagged on it (layer, count, pressing). ',
     'so that one line cures every item flagged on it (layer, count, pressing). ' + T3, '3')

# ITEM 1b: the check (K-S), one form in all 17 drvCheck copies.
edit(LIB, r"const DRV_WORDS=/\b(?:unanswered|not answered|unnamed|not named|none named|neither named|unaddressed)\b/i;",
     r"const DRV_WORDS=/\b(?:unanswered|not answered|unnamed|not named|none named|neither named|unaddressed)\b/i;" + "\n"
     r"// P2D v6a item 1b (BB-8136): K-S, a STANDS or UNDERDETERMINED line whose ground is that a single verse does not state a link or its" + "\n"
     r"// contrary, naming no later round ([CR2], [CR3], [DR2], [DR3]) that answered the witness. Sent to the cure to be regraded on the answered test." + "\n"
     r"const DRV_STATE=/\b(?:do|does|did)\s+not\s+state\b|\bnot\s+stated\b|\bnever\s+states?\b|\bneither\s+states?\b|\bnor\s+states?\b|\bno\s+(?:\S+\s+){0,4}?(?:verse|row|witness|quotation|passage|text)s?\b(?:\s+\S+){0,4}?\s+(?:states?|names?)\b|\bno\s+\[L[1-4]\](?:\s*\/\s*\[L[1-4]\])*\s+(?:states?|names?)\b|\b(?:met\s+by|without)\s+any\s+(?:verse|row|witness|quotation)\s+that\s+(?:states?|names?)\b/i;" + "\n"
     r"const DRV_ANS=/[\[(](?:CR|DR)[23]\b/i;", '1b consts')
edit(LIB, r"const LS=text.split('\n');for(let li=0;li<LS.length;li++){const line=LS[li];const u=line.toUpperCase().replace(/[*_`]+/g,'').trim();",
     r"const LS=text.split('\n');for(let li=0;li<LS.length;li++){const line=LS[li];const u=line.toUpperCase().replace(/[*_`]+/g,'').trim();" + "\n"
     r"  {const ms=u.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(ms){const vs=/^VS\.?\s/.test(ms[2]);const gs=vs?((ms[2].match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/)||[])[1]||null):(/^STANDS\b/.test(ms[2])?'STANDS':null);" + "\n"
     r"   if((gs==='UNDERDETERMINED'||gs==='STANDS')&&DRV_STATE.test(line)&&!DRV_ANS.test(line)){const sid=vs?(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+ms[1]])[1].replace(/\s+VS\.?\s+/,' vs '):'D'+ms[1];" + "\n"
     r"    items.push({rule:'K-S',side:null,link:sid,line});marks.push('[AUDIT v22: DEBATE RULE VIOLATION (K-S) -- '+sid+' '+gs+' rests on a single verse not stating a link or its contrary and names no round that answered the witness. REVIEW THIS ROW.]');}}}",
     '1b detect')

# ITEM 1b cure side, in the 14 cure copies.
edit(CURE, r"""+"K-G8 (your counted_premises array for a side lists a different number of premises than that side's count): CORRECTED COUNT for that side equal to the number of premises your array lists plus every K-G6 or K-G7 premise of that side, with the CORRECTED STANDING that count makes true.";""",
     r"""+"K-G8 (your counted_premises array for a side lists a different number of premises than that side's count): CORRECTED COUNT for that side equal to the number of premises your array lists plus every K-G6 or K-G7 premise of that side, with the CORRECTED STANDING that count makes true. """
     r"""K-S (a link marked STANDS, or a collision graded UNDERDETERMINED, whose ground is that a verse does not state a link or its contrary, with no round named that answered the witness): """
     + T1A +
     r""" Cure it with one RESTATED line for that link (D<n> vs C<m>, or D<n> for a STANDS line), regraded: it names the round that answered the witness ([CR2] or [CR3] for a defender link, [DR2] or [DR3] for a challenger link), or it grades the line LINK BROKEN, with exactly one CORRECTED RESULT.";""",
     '1b ask rule')
edit(CURE, r"const cureLabel=x=>x.rule==='K-B'?x.link:((x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8')?x.rule+' '+x.link:'K-G3 '+x.side);",
     r"const cureLabel=x=>x.rule==='K-B'?x.link:((x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'||x.rule==='K-S')?x.rule+' '+x.link:'K-G3 '+x.side);",
     '1b label')
edit(CURE, r"kg.map(x=>cureLabel(x)+': '+((x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8')?String(x.line||'').trim()",
     r"kg.map(x=>cureLabel(x)+': '+((x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'||x.rule==='K-S')?String(x.line||'').trim()",
     '1b ask line')
edit(CURE, r"""  else if(k[1]==='RESTATED'&&(m=r.match(/^D(\d+)\s+vs\.?\s+C(\d+)\b/i))){const g=r.slice(m[0].length).toUpperCase().match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);
   o.restated.push({link:cureId(m[1],m[2]),grade:g?g[1]:null,text:r,line:l});}""",
     r"""  else if(k[1]==='RESTATED'&&(m=r.match(/^D(\d+)(?:\s+vs\.?\s+C(\d+))?\b/i))){const g=r.slice(m[0].length).toUpperCase().match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS)/);
   o.restated.push({link:m[2]?cureId(m[1],m[2]):'D'+m[1],grade:g?g[1]:null,text:r,line:l});}""",
     '1b restated')
edit(CURE, r"const keys=x.rule==='K-B'?[x.link]:", r"const keys=(x.rule==='K-B'||x.rule==='K-S')?[x.link]:", '1b keys')
edit(CURE, r"  return res('UNCURED','unknown rule',null);});}",
     r"""  // P2D v6a item 1b: K-S is cured by one RESTATED line for the link that names an answering round, or that grades it LINK BROKEN beside one CORRECTED RESULT.
  if(x.rule==='K-S'){const rs=o.restated.filter(r=>U(r.link)===U(x.link));
   if(!rs.length)return res('UNCURED','no RESTATED line for '+x.link,null);if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   if(/LINK BROKEN$/.test(rs[0].grade||'')){if(o.result.length!==1)return res('UNCURED','regraded LINK BROKEN without exactly one CORRECTED RESULT line',[rs[0].line]);return res('CURED','regraded LINK BROKEN',[rs[0].line,o.result[0].line]);}
   if(!DRV_ANS.test(rs[0].text))return res('UNCURED','the restated line names no round that answered the witness',[rs[0].line]);
   return res('CURED','regraded: answering round named',[rs[0].line]);}
  return res('UNCURED','unknown rule',null);});}""",
     '1b verdict')
edit(CURE, r"if(!(v||[]).some(x=>x.status==='CURED'&&/^retracted/.test(x.why||'')))return null;",
     r"if(!(v||[]).some(x=>x.status==='CURED'&&/^(?:retracted|regraded LINK BROKEN)/.test(x.why||'')))return null;",
     '1b corrected')

# ITEM 2: a withdrawal the link round states, missed by the judge, is counted (panel and alternate payloads; single judge).
PAY = ['Panel_Payloads.js', 'Alternate_Payloads.js']
edit(PAY, r"""  else out.push('[EXTRACTOR v18: WITHDRAWN MISSED D'+i+' -- CR3 states LINK '+i+': CONCEDED; the judge marks it STANDS. REVIEW THIS ROW.]');}}
 return out;}""",
     r"""  else{out.push('[EXTRACTOR v18: WITHDRAWN MISSED D'+i+' -- CR3 states LINK '+i+': CONCEDED; the judge marks it STANDS. REVIEW THIS ROW.]');(out.missed=out.missed||[]).push(i);}}}
 out.nwk=nwk?[n,parseInt(nwk[2],10),parseInt(nwk[3],10)]:null;out.ks=keystone_state==='STANDS'?keystone_link:null; // P2D v6a item 2: the missed withdrawals and the judge's own counts
 return out;}""", '2 k2')
edit(PAY, r"for(const x of k2Marks(WT))marks.push(x);",
     r"""{const K2W=k2Marks(WT);for(const x of K2W)marks.push(x); // P2D v6a item 2 (BB-8136): the conceded link counts in w; the clause is recomputed from the judge's own counts
  if(K2W.missed&&K2W.missed.length&&K2W.nwk){const n0=K2W.nwk[0],w1=K2W.nwk[1]+K2W.missed.length,k0=K2W.nwk[2],ksW=K2W.ks!=null&&K2W.missed.includes(K2W.ks);
   const tg=k0>=1?'BROKEN-1':((2*w1>n0||ksW)?'BROKEN-2':(w1>=1?'PARTIAL-1':(p.defense_standing==='COLLAPSED'?'PARTIAL-2':'HELD-1')));const wd2=tg.split('-')[0];
   if(wd2!==p.verdict_tag){marks.push('[AUDIT v22: WITHDRAWAL COUNTED -- D'+K2W.missed.join(', D')+' stated CONCEDED in CR3 and marked STANDS by the judge, counted withdrawn: n='+n0+' w='+w1+' k='+k0+(ksW?' keystone WITHDRAWN':'')+' gives '+tg+'; ORIGINAL: '+p.verdict_tag+'; COUNTED: '+wd2+']');p.verdict_tag=wd2;}}}""",
     '2 count')
edit(['Extract_Independent_Verdict.js'],
     r"""if(e2!==e1&&clause!==e2){rej('CLAUSE '+clause+' AGAINST ITS OWN COUNTS WITH THE WITHDRAWALS CR3 STATES AND THE JUDGE MISSED (D'+K2.miss.join(', D')+'): n='+n+' w='+w+'+'+K2.miss.length+' k='+k+' keystone='+ks2+' ds='+defense_standing+', WHICH GIVE '+e2+'.');}""",
     r"""if(e2!==e1&&clause!==e2){rej('CLAUSE '+clause+' AGAINST ITS OWN COUNTS WITH THE WITHDRAWALS CR3 STATES AND THE JUDGE MISSED (D'+K2.miss.join(', D')+'): n='+n+' w='+w+'+'+K2.miss.length+' k='+k+' keystone='+ks2+' ds='+defense_standing+', WHICH GIVE '+e2+'.');}
 // P2D v6a item 2 (BB-8136): the conceded link counts; the verdict is the clause recomputed from the judge's own counts.
 if(e2!==e1){const w2=e2.split('-')[0];if(w2!==verdict){raw+='\n\n[AUDIT v22: WITHDRAWAL COUNTED -- D'+K2.miss.join(', D')+' stated CONCEDED in CR3 and marked STANDS by the judge, counted withdrawn: gives '+e2+'; ORIGINAL: '+verdict+'; COUNTED: '+w2+']';verdict=w2;}}""",
     '2 single')

for n, t in files.items():
    open(os.path.join(D, n), 'w', encoding='utf-8').write(t)
print('\n'.join(log)); print('edits', len(log))
