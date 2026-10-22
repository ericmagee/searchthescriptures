# THE DEBATE FIXED (BB-7397), DoD 9 as typed fields (ruling BB-7455; P2D rev 6 BB-7456), portion 2c. Builder Worker_A3.
# Falsifiers: FALSIFIERS10.txt (git d73882b), committed before this file. Base: base10/ = Worker_E's new9 at 0779040.
# Every edit is an (old, new) pair; old must occur exactly once in its node, and the pairs undone in reverse must give the base back.
# Usage: python3 patch_2c.py <base10 dir> <out dir>
import sys, os, json, hashlib

def cut(src, start, end):
    if src.count(start) != 1:
        raise SystemExit('ABORT cut: start not once: ' + start[:80])
    i = src.find(start); j = src.find(end, i)
    if j < 0:
        raise SystemExit('ABORT cut: end not found: ' + end[:80])
    return src[i:j + len(end)]

NEW_CPA = r'''// THE DEBATE FIXED (BB-7397, DoD 9 as typed fields, BB-7455): the panel judge's own JSON fields counted_premises_defender and
// counted_premises_challenger, each an array of ledger premise numbers. Missing or null: ABSENT. Anything but an array of integers >= 1:
// INVALID, the raw value kept for the mark; so is a number above the count of that side's ledger premises (BB-7457 F-range). No text of the judge's prose is read for the set. Where a field is ABSENT or INVALID the checks
// by number fall back to the stated count (A): an item only at a count of 0. The single judge returns no fields, so it is always (A).
function drvLedgerN(ptext,side){if(typeof ptext!=='string')return null;const i=ptext.indexOf('AGAINST THE DEFENDER, answered in [CR3]:');const j=i<0?-1:ptext.indexOf('AGAINST THE CHALLENGER, answered in [DR3]:',i);
 const k=j<0?-1:ptext.indexOf('A verse marked NOT NAMED',j);if(i<0||j<0||k<0)return null;const n=(side==='DEFENDER'?ptext.slice(i,j):ptext.slice(j,k)).split('\n').filter(l=>/^\s*premise \d+/.test(l)).length;return n||null;}
function drvCPA(val,max){if(val===undefined||val===null)return {present:false,why:'absent'};
 if(!Array.isArray(val)||!val.every(x=>Number.isInteger(x)&&x>=1&&(!max||x<=max))){let r;try{r=JSON.stringify(val);}catch(e){r=String(val);}return {present:false,why:'invalid',raw:String(r).slice(0,200)};}
 return {present:true,set:new Set(val),line:JSON.stringify(val)};}'''

def raise_pairs(src):
    old_fn = cut(src, "// THE DEBATE FIXED (BB-7397, DoD 9, design (B) BB-7436): the judge's own COUNTED PREMISES line per side", "return {present:true,set,line:m[0]};}")
    return [
        (old_fn, NEW_CPA),
        (r'''function drvBroken(text,dConc,dStand,prior,cConc,cStand,ptext){''', r'''function drvBroken(text,dConc,dStand,prior,cConc,cStand,ptext,CPV){'''),
        (r''' // DoD 9: each side's COUNTED PREMISES line; its absence is written to the row; a line whose number differs from its count is K-G8.
 const LK=drvLinkMap(ptext);const CP={DEFENDER:drvCP(T,'DEFENDER',LK),CHALLENGER:drvCP(T,'CHALLENGER',LK)};''',
         r''' // DoD 9 (BB-7455): each side's counted_premises field; ABSENT or INVALID is written to the row; a valid array whose size differs from its count is K-G8.
 const LK=drvLinkMap(ptext);const CP={DEFENDER:drvCPA(CPV&&CPV.DEFENDER,drvLedgerN(ptext,'DEFENDER')),CHALLENGER:drvCPA(CPV&&CPV.CHALLENGER,drvLedgerN(ptext,'CHALLENGER'))};'''),
        (r'''marks.push('[AUDIT v21: COUNTED PREMISES '+sd+' LINE '+(cp.why==='unreadable'?'UNREADABLE: "'+String(cp.line||'').trim().slice(0,200).replace(/[\[\]]/g,'')+'"':'ABSENT')+' -- the checks by number fall back to the stated count (A).]');''',
         r'''marks.push('[AUDIT v21: COUNTED PREMISES '+sd+' FIELD '+(cp.why==='invalid'?'INVALID: '+String(cp.raw||'').replace(/\[/g,'(').replace(/\]/g,')'):'ABSENT')+' -- the checks by number fall back to the stated count (A).]');'''),
        (r'''marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G8) -- COUNTED PREMISES '+sd+' names '+cp.set.size+' premise(s) while the count is '+sc+'. REVIEW THIS ROW.]');''',
         r'''marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G8) -- counted_premises_'+sd.toLowerCase()+' lists '+cp.set.size+' premise(s) while the count is '+sc+'. REVIEW THIS ROW.]');'''),
        (r"""'COUNTED PREMISES DEFENDER does not name premise '+ps.join(' or ')""", r"""'counted_premises_defender does not list premise '+ps.join(' or ')"""),
        (r'''function drvLedger(text,ptext,dConc,cConc,dStand,cStand){''', r'''function drvLedger(text,ptext,dConc,cConc,dStand,cStand,CPV){'''),
        (r'''const cp=drvCP(T,side,drvLinkMap(ptext));''', r'''const cp=drvCPA(CPV&&CPV[side],drvLedgerN(ptext,side));'''),
    ]

CPV = r''',{DEFENDER:v.counted_premises_defender,CHALLENGER:v.counted_premises_challenger}'''
CALLS = {
 'Panel_Payloads': [
  (r'''drvLedger(WT,drvPromptText(jd.body),p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing)''',
   r'''drvLedger(WT,drvPromptText(jd.body),p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing''' + CPV + ')'),
  (r'''p.challenger_conceded_links,p.challenge_standing,drvPromptText(jd.body))''', r'''p.challenger_conceded_links,p.challenge_standing,drvPromptText(jd.body)''' + CPV + ')')],
 'Alternate_Payloads': [
  (r'''drvLedger(WT,drvPromptText(a.body),p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing)''',
   r'''drvLedger(WT,drvPromptText(a.body),p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing''' + CPV + ')'),
  (r'''p.challenger_conceded_links,p.challenge_standing,drvPromptText(a.body))''', r'''p.challenger_conceded_links,p.challenge_standing,drvPromptText(a.body)''' + CPV + ')')],
 'Extract_Independent_Verdict': [
  (r'''drvLedger(raw0,drvPromptText(prev&&prev.verdictBody),conceded_links,challenger_conceded_links,defense_standing,challenge_standing)''',
   r'''drvLedger(raw0,drvPromptText(prev&&prev.verdictBody),conceded_links,challenger_conceded_links,defense_standing,challenge_standing,null)'''),
  (r'''challenger_conceded_links,challenge_standing,drvPromptText(prev&&prev.verdictBody))''', r'''challenger_conceded_links,challenge_standing,drvPromptText(prev&&prev.verdictBody),null)''')],
}

CURE_NODES = ['Cure_Build', 'Cure_Normalize', 'Cure_Check', 'Panel_Cure_Build_1', 'Panel_Cure_Normalize_1', 'Panel_Cure_Build_2',
              'Panel_Cure_Normalize_2', 'Panel_Cure_Build_3', 'Panel_Cure_Normalize_3', 'Panel_Cure_Check', 'Alternate_Build',
              'Alternate_Cure_Build', 'Alternate_Cure_Normalize', 'Alternate_Merge']
LIB = [
 (r'''K-G8 (your COUNTED PREMISES line for a side names a different number of premises than that side's count): CORRECTED COUNT for that side equal to the number of premises your line names''',
  r'''K-G8 (your counted_premises array for a side lists a different number of premises than that side's count): CORRECTED COUNT for that side equal to the number of premises your array lists'''),
 (r'''// DoD 9 K-G8: the side's COUNTED PREMISES line and its count differ;''', r'''// DoD 9 K-G8: the side's counted_premises array and its count differ;'''),
]

OLD_SENT = ("After your CONCEDED LINKS line write, on a line of its own, COUNTED PREMISES DEFENDER: followed by the PRESSED-WITNESS LEDGER "
            "premise numbers you counted in it, comma-separated, or none; after your CHALLENGER CONCEDED LINKS line write, on a line of its own, "
            "COUNTED PREMISES CHALLENGER: in the same form; each line names exactly as many premises as its count.").replace("'", "\\'")
OTHER = {
 'Panel_Build': [
  (r"""plain English meaning.','','%s','','RETURN STRICT JSON""" % OLD_SENT, r"""plain English meaning.','','RETURN STRICT JSON"""),
  (r"""'  "challenger_conceded_links": integer >= 0,',""",
   r"""'  "challenger_conceded_links": integer >= 0,','  "counted_premises_defender": array of integers -- the PRESSED-WITNESS LEDGER premise numbers (AGAINST THE DEFENDER) you counted in conceded_links; [] when none','  "counted_premises_challenger": array of integers -- the PRESSED-WITNESS LEDGER premise numbers (AGAINST THE CHALLENGER) you counted in challenger_conceded_links; [] when none',"""),
  (r"""conceded_links and challenger_conceded_links MUST equal the values your reasoning reaches under the rulebook.""",
   r"""conceded_links and challenger_conceded_links MUST equal the values your reasoning reaches under the rulebook; each counted_premises array MUST list exactly the premises its count counts."""),
 ],
 'Build_Independent_Verdict': [("followed by its plain English meaning. %s'}" % OLD_SENT, "followed by its plain English meaning.'}")],
 'Format_Markdown': [("'K-G8': 'Counted premises line differs from the count (K-G8)'", "'K-G8': 'Counted premises list differs from the count (K-G8)'")],
}

def apply(src, pairs, name):
    for a, b in pairs:
        n = src.count(a)
        if n != 1:
            raise SystemExit('ABORT %s: anchor found %d times: %s' % (name, n, a[:100]))
        src = src.replace(a, b)
    return src

def main(base, out):
    os.makedirs(out, exist_ok=True)
    plan = {}
    for n in CALLS:
        src = open(os.path.join(base, n + '.js')).read()
        plan[n] = raise_pairs(src) + CALLS[n]
    for n in CURE_NODES:
        plan.setdefault(n, []).extend(LIB)
    for n, p in OTHER.items():
        plan.setdefault(n, []).extend(p)
    rec = {}
    for f in sorted(os.listdir(base)):
        if not f.endswith('.js'):
            continue
        name = f[:-3]; src = open(os.path.join(base, f)).read(); pairs = plan.get(name, [])
        new = apply(src, pairs, name)
        rev = new
        for a, b in reversed(pairs):
            if rev.count(b) != 1:
                raise SystemExit('ABORT %s: replacement not unique for reverse: %s' % (name, b[:90]))
            rev = rev.replace(b, a)
        if rev != src:
            raise SystemExit('ABORT %s: reverse does not give the base' % name)
        open(os.path.join(out, f), 'w').write(new)
        rec[name] = {'base10': hashlib.md5(src.encode()).hexdigest(), 'new10': hashlib.md5(new.encode()).hexdigest(), 'pairs': len(pairs)}
    json.dump(rec, open(os.path.join(out, '..', 'NEW10_MD5S.json'), 'w'), indent=1, sort_keys=True)
    for n in sorted(rec):
        print(n, rec[n]['pairs'], rec[n]['base10'][:8], '->', rec[n]['new10'][:8])
    print(len(rec), 'nodes written,', sum(1 for n in rec if rec[n]['pairs']), 'changed')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
