# THE DEBATE FIXED (BB-7397, P2D rev 3 BB-7407, shape BB-7409), step 2 build, Worker_A3.
# Every edit is an (old, new) pair; old must occur exactly once in its node, else the build aborts. base/ is live 428fbdc3.
# Usage: python3 patch_fixed.py <base dir> <out dir>
import sys, os, json, hashlib

PLAIN = "Name people and things only in the KJV's own words or in plain English; no titles, honorifics or capitalised epithets the text does not use (it says 'the child', not 'the Boy'); every Greek or Hebrew word you use is followed by its plain English meaning."
PLAIN_JS = PLAIN.replace("'", "\\'")

CURE_NODES = ['Cure_Build', 'Cure_Normalize', 'Cure_Check', 'Panel_Cure_Build_1', 'Panel_Cure_Normalize_1', 'Panel_Cure_Build_2',
              'Panel_Cure_Normalize_2', 'Panel_Cure_Build_3', 'Panel_Cure_Normalize_3', 'Panel_Cure_Check', 'Alternate_Build',
              'Alternate_Cure_Build', 'Alternate_Cure_Normalize', 'Alternate_Merge']

# ---- the cure library, the same in all 14 cure nodes ----
LIB = [
 # K-G6 rule text for the cure request (DoD 3, binding note BB-7409)
 (r''' +"PROP-DEPENDENT or COLLAPSED, or with one RETRACTED line for each BROKEN link of that side.";''',
  r''' +"PROP-DEPENDENT or COLLAPSED, or with one RETRACTED line for each BROKEN link of that side. "
 +"K-G6 (a premise listed against a side that the PRESSED-WITNESS LEDGER marks NOT NAMED, which your CONCEDED LINKS or CHALLENGER CONCEDED LINKS "
 +"does not count): the rule you were given reads \"A verse marked NOT NAMED is unanswered by the rule\" and \"A premise whose pressed witness goes "
 +"unanswered is UNEXHIBITED: it counts toward CONCEDED LINKS and the standings\". Cure it either by counting it: CORRECTED COUNT for that side, "
 +"your count plus every K-G6 premise of that side you do not answer by statement, with CORRECTED STANDING for that side that the count makes true "
 +"(PROP-DEPENDENT, or COLLAPSED when twice the count exceeds the number of premises listed against that side); or by a STATEMENT for that premise "
 +"that quotes, word for word, the words of the transcript that show the verse is not a pressed witness of that premise.";'''),
 # the statement check names K-G6
 (r'''that round's own answer. Cured if it passes; else the violation stands. "''',
  r'''that round's own answer. For a K-G6 item it must quote, word for word, the transcript's words that show the verse is not a pressed witness of that premise. Cured if it passes; else the violation stands. "'''),
 # labels and the request lines
 (r'''const cureLabel=x=>x.rule==='K-B'?x.link:((x.rule==='K-G1'||x.rule==='K-G4')?x.rule+' '+x.link:'K-G3 '+x.side);''',
  r'''const cureLabel=x=>x.rule==='K-B'?x.link:((x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6')?x.rule+' '+x.link:'K-G3 '+x.side);'''),
 (r'''kg.map(x=>cureLabel(x)+': '+((x.rule==='K-G1'||x.rule==='K-G4')?String(x.line||'').trim():''',
  r'''kg.map(x=>cureLabel(x)+': '+((x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6')?String(x.line||'').trim():'''),
 # the K-G6 check
 (r'''  return res('UNCURED','unknown rule',null);});}''',
  r'''  // THE DEBATE FIXED (BB-7397, DoD 3, binding note BB-7409) K-G6: a premise the ledger marks NOT NAMED that the judge's count does not
  // count. Cured by a statement quoting the transcript, or by a CORRECTED COUNT at least the original count plus the side's K-G6 premises
  // not answered by statement, with the CORRECTED STANDING that count makes true (COLLAPSED when 2c > L, else PROP-DEPENDENT).
  if(x.rule==='K-G6'){const sq=y=>{const q=stmtQ(stmtOf(y));return Object.keys(R).find(k=>typeof R[k]==='string'&&q.some(z=>cureFound(z,R[k])))||null;};
   const rk=sq(x);if(rk)return res('CURED','statement quotes the transcript ('+rk+')',['STATEMENT: '+stmtOf(x)]);
   const k6=items.filter(y=>y.rule==='K-G6'&&y.side===x.side);const needN=(x.conc||0)+k6.filter(y=>!sq(y)).length;
   const cs=o.count.filter(c=>c.side===x.side);const ns=[...new Set(cs.map(c=>c.n))];const ss=o.standing.filter(s=>s.side===x.side);const sv=[...new Set(ss.map(s=>s.st))];const lines=cs.map(c=>c.line).concat(ss.map(s=>s.line));
   if(!ns.length)return res('UNCURED','no CORRECTED COUNT for '+x.side+' and no statement quoting the transcript for '+x.link,lines);
   if(ns.length>1)return res('UNCURED','two differing CORRECTED COUNT lines for '+x.side,lines);
   if(ns[0]<needN)return res('UNCURED','corrected count '+ns[0]+' is below '+needN,lines);
   if(sv.length>1)return res('UNCURED','two differing CORRECTED STANDING lines for '+x.side,lines);
   const want=(x.L&&2*ns[0]>x.L)?'COLLAPSED':'PROP-DEPENDENT';const got=sv.length===1?sv[0]:(x.st||null);
   if(got!==want)return res('UNCURED','count '+ns[0]+' of '+(x.L||'?')+' makes the '+x.side+' standing '+want+'; it reads '+(got||'none'),lines);
   return res('CURED','counted: '+x.side+' COUNT '+ns[0]+', STANDING '+want,lines);}
  return res('UNCURED','unknown rule',null);});}'''),
 # DoD 5: the corrected standing and count are written to the row
 (r'''const cureCorrLine=(seat,orig,c)=>''',
  r'''// THE DEBATE FIXED (BB-7397, DoD 5, BB-7406): a cure's CORRECTED STANDING and CORRECTED COUNT for a side with a CURED count or standing item
// (K-G1, K-G3, K-G6) are written to the row's columns; the original is kept in the judge's text by an AUDIT line.
function cureSet(reply,v){const o=cureLines(reply&&reply.ok?reply.text:'');const out={};
 // BB-7417 defect 3: a side is written only when every count or standing item of that side is CURED, and not when each is a K-G6
 // statement cure (no count was checked).
 for(const side of ['DEFENDER','CHALLENGER']){const ks=(v||[]).filter(x=>x.side===side&&(x.rule==='K-G1'||x.rule==='K-G3'||x.rule==='K-G6'));
  if(!ks.length||ks.some(x=>x.status!=='CURED')||ks.every(x=>x.rule==='K-G6'&&/^statement/.test(String(x.why||''))))continue;
  const ns=[...new Set(o.count.filter(c=>c.side===side).map(c=>c.n))];const sv=[...new Set(o.standing.filter(s=>s.side===side).map(s=>s.st))];
  if(ns.length===1||sv.length===1)out[side]={n:ns.length===1?ns[0]:null,st:sv.length===1?sv[0]:null};}
 return Object.keys(out).length?out:null;}
function cureSetApply(p,cs,seat){const F={DEFENDER:['defense_standing','conceded_links'],CHALLENGER:['challenge_standing','challenger_conceded_links']};const lines=[];
 for(const side of Object.keys(cs||{})){const fs=F[side][0],fn=F[side][1],c=cs[side];const was=(p[fs]||'?')+', '+(p[fn]==null?'?':p[fn]);
  if(c.st)p[fs]=c.st;if(c.n!=null)p[fn]=c.n;
  lines.push('[AUDIT v21: CORRECTED STANDING -- '+(seat?'SEAT: '+seat+'; ':'')+'SIDE: '+side+'; ORIGINAL: '+was+'; COUNTED: '+(p[fs]||'?')+', '+(p[fn]==null?'?':p[fn])+']');}
 return lines;}
const cureCorrLine=(seat,orig,c)=>'''),
]

TAIL = {
 'Panel_Cure_Check': [
  (r''' const cc=cureCorrected(r?r.reply:null,v);if(cc){b.payload.verdict_raw=b.payload.verdict_raw+'\n'+cureCorrLine(s.seat,b.payload.verdict_tag,cc);b.payload.verdict_tag=cc.word;s.corrected=cc;}''',
   r''' const cc=cureCorrected(r?r.reply:null,v);if(cc){b.payload.verdict_raw=b.payload.verdict_raw+'\n'+cureCorrLine(s.seat,b.payload.verdict_tag,cc);b.payload.verdict_tag=cc.word;s.corrected=cc;}
 const cs=cureSet(r?r.reply:null,v);if(cs){b.payload.verdict_raw=b.payload.verdict_raw+'\n'+cureSetApply(b.payload,cs,s.seat).join('\n');s.corrected_standing=cs;}'''),
 ],
 'Alternate_Merge': [
  (r'''  const cc=cureCorrected(c?c.reply:null,v);if(cc){b.payload.verdict_raw=b.payload.verdict_raw+'\n'+cureCorrLine(a.seat,b.payload.verdict_tag,cc);b.payload.verdict_tag=cc.word;}}''',
   r'''  const cc=cureCorrected(c?c.reply:null,v);if(cc){b.payload.verdict_raw=b.payload.verdict_raw+'\n'+cureCorrLine(a.seat,b.payload.verdict_tag,cc);b.payload.verdict_tag=cc.word;}
  const cs=cureSet(c?c.reply:null,v);if(cs)b.payload.verdict_raw=b.payload.verdict_raw+'\n'+cureSetApply(b.payload,cs,a.seat).join('\n');}'''),
 ],
 'Cure_Check': [
  (r'''const cc=cureCorrected(r?r.reply:null,v);
return [{json:{...base,...(cc?{verdict_tag:cc.word}:{}),independent_verdict_raw:base.independent_verdict_raw+'\n\n'+cureReport(null,v).concat(cureProse(null,r?r.reply:null)).concat(cc?[cureCorrLine(null,base.verdict_tag,cc)]:[]).join('\n'),''',
   r'''const cc=cureCorrected(r?r.reply:null,v);
const cs=cureSet(r?r.reply:null,v);const B2={defense_standing:base.defense_standing,conceded_links:base.conceded_links,challenge_standing:base.challenge_standing,challenger_conceded_links:base.challenger_conceded_links};const csl=cs?cureSetApply(B2,cs,null):[];
return [{json:{...base,...(cc?{verdict_tag:cc.word}:{}),...(cs?B2:{}),independent_verdict_raw:base.independent_verdict_raw+'\n\n'+cureReport(null,v).concat(cureProse(null,r?r.reply:null)).concat(cc?[cureCorrLine(null,base.verdict_tag,cc)]:[]).concat(csl).join('\n'),'''),
 ],
}

# ---- the K-G6 raise, in the three nodes that raise the other items ----
LEDGER_FN = r'''
// THE DEBATE FIXED (BB-7397, DoD 3, binding note BB-7409) K-G6: per premise, both sides. A premise line of the PRESSED-WITNESS LEDGER sent
// to this judge that marks a verse NOT NAMED, and that the judge's CONCEDED LINKS (defender) or CHALLENGER CONCEDED LINKS (challenger) line
// does not count as CONCEDED or UNEXHIBITED (by "premise n", or "LINK m"), is one item. No ledger or no count line in the text: no item.
function drvPromptText(body){try{const b=body||{};const out=[];if(b.systemInstruction&&b.systemInstruction.parts)b.systemInstruction.parts.forEach(p=>out.push(String(p.text||'')));
 (b.messages||[]).forEach(m=>out.push(typeof m.content==='string'?m.content:JSON.stringify(m.content)));(b.contents||[]).forEach(c=>(c.parts||[]).forEach(p=>out.push(String(p.text||''))));return out.join('\n');}catch(e){return '';}}
function drvLedger(text,ptext,dConc,cConc,dStand,cStand){const items=[],marks=[];if(typeof text!=='string'||typeof ptext!=='string')return {items,marks};
 const i=ptext.indexOf('AGAINST THE DEFENDER, answered in [CR3]:');const j=i<0?-1:ptext.indexOf('AGAINST THE CHALLENGER, answered in [DR3]:',i);const k=j<0?-1:ptext.indexOf('A verse marked NOT NAMED',j);
 if(i<0||j<0||k<0)return {items,marks};
 const prem=s=>s.split('\n').map(l=>l.trim()).filter(l=>/^premise \d+/.test(l));const LG={DEFENDER:prem(ptext.slice(i,j)),CHALLENGER:prem(ptext.slice(j,k))};
 const T=text.replace(/[*_`]+/g,'');
 const countLine=side=>{const m=T.match(side==='DEFENDER'?/^[ \t>#-]*CONCEDED LINKS[ \t]*:.*$/im:/^[ \t>#-]*CHALLENGER CONCEDED LINKS[ \t]*:.*$/im);return m?m[0]:null;};
 // The count line's own clauses (BB-7417 defects 1-2): a premise or LINK number is counted when the CONCEDED or UNEXHIBITED word that
 // governs it is not negated. The governing word is the one in the number's own comma part, else the nearest in the clause; lists
 // ("premises 1 and 3", "1, 3") and ranges ("1-3") count every member; "not conceded" counts nothing; "no ... or UNEXHIBITED" counts nothing.
 const countedSet=line=>{const P=new Set(),K=new Set();const NEG=/\b(?:not|no|never|none|neither|nor)\b/gi;
  for(const cl of String(line).replace(/^[^:]*:/,'').split(/[;.](?=\s|$)/)){
   const W=[...cl.matchAll(/\b(?:UNEXHIBITED|CONCEDED)\b/gi)].map(w=>{const pre=cl.slice(0,w.index);const ns=[...pre.matchAll(NEG)];const g=ns.length?ns[ns.length-1].index:-1;
    return {at:w.index,end:w.index+w[0].length,neg:g>=0&&!/\b(?:and|but|so|thus|therefore|hence)\b/i.test(pre.slice(g))};});
   if(!W.length)continue;const cuts=[0];for(const c of cl.matchAll(/,/g))cuts.push(c.index);cuts.push(cl.length);const part=i=>cuts.findIndex((c,k)=>k<cuts.length-1&&i>=c&&i<cuts[k+1]);
   for(const m of cl.matchAll(/\b(premises?|links?)\s*((?:\d+(?:\s*(?:-|–|to)\s*\d+)?(?:\s*(?:,|and|&)\s*(?=\d))?)+)/gi)){
    const own=W.filter(w=>part(w.at)===part(m.index));const gap=w=>w.at>=m.index+m[0].length?w.at-(m.index+m[0].length):Math.abs(m.index-w.end);
    const gw=(own.length?own:W).reduce((x,y)=>gap(y)<gap(x)?y:x);if(gw.neg)continue;const T=/^link/i.test(m[1])?K:P;
    for(const q of m[2].split(/\s*(?:,|and|&)\s*/)){const r=q.match(/(\d+)\s*(?:-|–|to)\s*(\d+)/);if(r){for(let z=+r[1];z<=+r[2]&&z-+r[1]<50;z++)T.add(z);}else if(/\d/.test(q))T.add(+q.match(/\d+/)[0]);}}}
  return {P,K};};
 for(const side of ['DEFENDER','CHALLENGER']){const cl=countLine(side);if(cl===null)continue;const CS=countedSet(cl);
  for(const l of LG[side]){const m=l.match(/^premise (\d+)(?: \(LINK (\d+)\))?: .*NOT NAMED: (.+)$/);if(!m||/^none\s*$/i.test(m[3]))continue;
   if(CS.P.has(+m[1])||CS.K.has(+(m[2]||m[1])))continue;
   const id=side+' premise '+m[1];
   items.push({rule:'K-G6',side,link:id,line:l,conc:side==='DEFENDER'?dConc:cConc,st:side==='DEFENDER'?dStand:cStand,L:LG[side].length});
   marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G6) -- '+id+(m[2]?' (LINK '+m[2]+')':'')+': the PRESSED-WITNESS LEDGER marks '+m[3].trim()+' NOT NAMED and '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+' does not count it. REVIEW THIS ROW.]');}}
 return {items,marks};}
'''

RAISE = {
 'Panel_Payloads': [
  (r'''const DRV=drvCheck(WT,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,drvAsk);for(const x of DRV.marks)marks.push(x);
 p.drv_uncured=DRV.items.length;''',
   r'''const DRV=drvCheck(WT,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,drvAsk);for(const x of DRV.marks)marks.push(x);
 const DL=drvLedger(WT,drvPromptText(jd.body),p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing);for(const x of DL.items)DRV.items.push(x);for(const x of DL.marks)marks.push(x);
 p.drv_uncured=DRV.items.length;'''),
 ],
 'Alternate_Payloads': [
  (r'''  const DRV=drvCheck(WT,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,drvAsk);for(const x of DRV.marks)marks.push(x);
  p.drv_uncured=DRV.items.length;''',
   r'''  const DRV=drvCheck(WT,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,drvAsk);for(const x of DRV.marks)marks.push(x);
  const DL=drvLedger(WT,drvPromptText(a.body),p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing);for(const x of DL.items)DRV.items.push(x);for(const x of DL.marks)marks.push(x);
  p.drv_uncured=DRV.items.length;'''),
 ],
 'Extract_Independent_Verdict': [
  (r'''const DRV=drvCheck(raw0,conceded_links,challenger_conceded_links,defense_standing,challenge_standing,askedD);for(const x of DRV.marks)raw+='\n\n'+x;''',
   r'''const DRV=drvCheck(raw0,conceded_links,challenger_conceded_links,defense_standing,challenge_standing,askedD);for(const x of DRV.marks)raw+='\n\n'+x;
const DL=drvLedger(raw0,drvPromptText(prev&&prev.verdictBody),conceded_links,challenger_conceded_links,defense_standing,challenge_standing);for(const x of DL.items)DRV.items.push(x);for(const x of DL.marks)raw+='\n\n'+x;'''),
 ],
}
# the function goes in front of drvCheck in each raise node
RAISE_FN_ANCHOR = r'''function drvCheck(text,dConc,cConc,dStand,cStand,askedCC){'''

OTHER = {
 'Format_Markdown': [
  (r'''t += '**Judges:**\n\n';''',
   r'''t += '**Judges:**\n\n';
// THE DEBATE FIXED (BB-7397, DoD 1): the panel's verdict is the debate's verdict; the single judge is a SECOND OPINION, its word read from its
// own stored text (a CORRECTED RESULT line first), never from framework_verdict, which now carries the panel's verdict.
const SJV = (() => { const s = String(r.independent_verdict_raw || ''); const c = s.match(/\[AUDIT v21: CORRECTED RESULT -- [^\]]*COUNTED: (HELD|PARTIAL|BROKEN)\b/); if (c) return c[1]; const m = s.replace(/[*_`#>\s]+/g, ' ').trim().match(/^"?\{?[^A-Z]*?\b(HELD|PARTIAL|BROKEN)\b/); return m ? m[1] : null; })();
t += '- Verdict of the debate: ' + (r.panel_verdict ? '**' + r.panel_verdict + '** (the panel)' : '**UNGRADED** (the panel did not finish)') + VSIDE + '\n';'''),
  (r'''t += '- Single judge: ' + SJN + ' (' + (r.judge_model || '') + '): **' + (r.framework_verdict || '?') + '**' + VSIDE + '\n\n';''',
   r'''t += '- SECOND OPINION (single judge, not the verdict): ' + SJN + ' (' + (r.judge_model || '') + '): **' + (SJV || '?') + '**' + VSIDE + '\n\n';'''),
  (r'''after the single judge\'s BROKEN verdict''',
   r'''after the single judge\'s BROKEN second opinion'''),
  (r'''t += '## Single judge: ' + SJN + ' (' + (r.judge_model || '') + '): ' + (r.framework_verdict || '?') + VSIDE''',
   r'''t += '## SECOND OPINION (single judge, not the verdict): ' + SJN + ' (' + (r.judge_model || '') + '): ' + (SJV || '?') + VSIDE'''),
  (r'''const DRV_RULE = { 'K-B': 'Two kinds of layer (K-B)', 'K-G1': 'Conceded count (K-G1)', 'K-G3': 'Standing (K-G3)', 'K-G4': 'Pressing sentence (K-G4)' };''',
   r'''const DRV_RULE = { 'K-B': 'Two kinds of layer (K-B)', 'K-G1': 'Conceded count (K-G1)', 'K-G3': 'Standing (K-G3)', 'K-G4': 'Pressing sentence (K-G4)', 'K-G6': 'Unanswered premise not counted (K-G6)' };'''),
  (r'''// (BB-7154 finding 2, BB-7157). Only CURED rows correct; the stored columns keep the judge's own answer.''',
   r'''// (BB-7154 finding 2, BB-7157). Only CURED rows correct. From BB-7406 (DoD 5) the stored columns carry the correction too; the judge's
// own answer is kept in its text by an AUDIT v21 CORRECTED STANDING line.'''),
 ],
 'Init_with_Guards': [
  (r'''return 'You are the TRUTH App debate AI, built on Isaiah 28:10. '+roleLine(role)+'\n\n'+LAYER''',
   r'''return 'You are the TRUTH App debate AI, built on Isaiah 28:10. '+roleLine(role)+' '+'%s'+'\n\n'+LAYER''' % PLAIN_JS),
  (r'''Do not yield without direct textual warrant.\n\n'+LAYER+burden(role);};''',
   r'''Do not yield without direct textual warrant. '+'%s'+'\n\n'+LAYER+burden(role);};''' % PLAIN_JS),
 ],
 'Build_Independent_Verdict': [
  (r'''content:'You are an independent judge bound by the same layer rules as all debate participants.'}''',
   r'''content:'You are an independent judge bound by the same layer rules as all debate participants. %s'}''' % PLAIN_JS),
 ],
 'Panel_Build': [
  (r''''Grade each side by its ROLE; neither reading is presumed.',''',
   r''''Grade each side by its ROLE; neither reading is presumed.','','%s',''' % PLAIN_JS),
 ],
 'Build_Save_Body': [
  (r'''framework_verdict:d.verdict_tag,''',
   r'''framework_verdict:null,'''),
 ],
}

def apply(src, pairs, name):
    for a, b in pairs:
        n = src.count(a)
        if n != 1:
            raise SystemExit('ABORT %s: anchor found %d times: %s' % (name, n, a[:90]))
        src = src.replace(a, b)
    return src

def main(base, out):
    os.makedirs(out, exist_ok=True)
    plan = {}
    for n in CURE_NODES:
        plan.setdefault(n, []).extend(LIB)
    for n, p in TAIL.items():
        plan.setdefault(n, []).extend(p)
    for n, p in RAISE.items():
        plan.setdefault(n, []).append((RAISE_FN_ANCHOR, LEDGER_FN.lstrip('\n') + RAISE_FN_ANCHOR))
        plan[n].extend(p)
    for n, p in OTHER.items():
        plan.setdefault(n, []).extend(p)
    rec = {}
    for n, pairs in sorted(plan.items()):
        src = open(os.path.join(base, n + '.js')).read()
        new = apply(src, pairs, n)
        # reverse: every pair undone in reverse order must give the base back
        rev = new
        for a, b in reversed(pairs):
            if rev.count(b) != 1:
                raise SystemExit('ABORT %s: replacement not unique for reverse: %s' % (n, b[:90]))
            rev = rev.replace(b, a)
        if rev != src:
            raise SystemExit('ABORT %s: reverse does not give the base' % n)
        open(os.path.join(out, n + '.js'), 'w').write(new)
        rec[n] = {'base': hashlib.md5(src.encode()).hexdigest(), 'new': hashlib.md5(new.encode()).hexdigest(), 'pairs': len(pairs)}
    json.dump(rec, open(os.path.join(out, '..', 'NEW_MD5S.json'), 'w'), indent=1, sort_keys=True)
    for n in sorted(rec):
        print(n, rec[n]['pairs'], rec[n]['base'][:8], '->', rec[n]['new'][:8])
    print(len(rec), 'nodes built')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
