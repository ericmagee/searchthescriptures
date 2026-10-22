# THE DEBATE FIXED (BB-7397), DoD 9, design (B) BB-7436, P2D rev 5 BB-7438. Builder Worker_E. Falsifiers: FALSIFIERS9.txt (git 6a086b0).
# Applied on top of Worker_A3's new/ at git 3ac66c8 (base9/). Every edit is an (old, new) pair; old must occur exactly once in its node,
# and the pairs undone in reverse must give base9 back, else the build aborts.
# Usage: python3 patch_dod9.py <base9 dir> <out dir>
import sys, os, json, hashlib

CP = ("After your CONCEDED LINKS line write, on a line of its own, COUNTED PREMISES DEFENDER: followed by the PRESSED-WITNESS LEDGER "
      "premise numbers you counted in it, comma-separated, or none; after your CHALLENGER CONCEDED LINKS line write, on a line of its own, "
      "COUNTED PREMISES CHALLENGER: in the same form; each line names exactly as many premises as its count.")
CP_JS = CP.replace("'", "\\'")
PLAIN_JS = ("Name people and things only in the KJV\\'s own words or in plain English; no titles, honorifics or capitalised epithets the text "
            "does not use (it says \\'the child\\', not \\'the Boy\\'); every Greek or Hebrew word you use is followed by its plain English meaning.")

RAISE_NODES = ['Panel_Payloads', 'Alternate_Payloads', 'Extract_Independent_Verdict']
CURE_NODES = ['Cure_Build', 'Cure_Normalize', 'Cure_Check', 'Panel_Cure_Build_1', 'Panel_Cure_Normalize_1', 'Panel_Cure_Build_2',
              'Panel_Cure_Normalize_2', 'Panel_Cure_Build_3', 'Panel_Cure_Normalize_3', 'Panel_Cure_Check', 'Alternate_Build',
              'Alternate_Cure_Build', 'Alternate_Cure_Normalize', 'Alternate_Merge']

def cut(src, start, end):
    i = src.find(start)
    if i < 0 or src.count(start) != 1:
        raise SystemExit('ABORT cut: start not once: ' + start[:80])
    j = src.find(end, i)
    if j < 0:
        raise SystemExit('ABORT cut: end not found: ' + end[:80])
    return src[i:j + len(end)]

NEW_CP_FN = r'''// THE DEBATE FIXED (BB-7397, DoD 9, design (B) BB-7436): the judge's own COUNTED PREMISES line per side, read by number. The prose reader
// is retired (BB-7431: it misread 97 of 285 stored count lines). "none" is the empty set; a value of numbers, commas, "and", "&" and the word
// premise(s) gives those numbers; any other value is UNREADABLE and is treated as absent. Where the line is absent, the checks by number fall
// back to the stated count (A): an item only at a count of 0.
function drvCP(T,side,LK){const m=T.match(new RegExp('^[ \\t>#-]*COUNTED PREMISES '+side+'[ \\t]*:[ \\t]*(.*)$','im'));if(!m)return {present:false,why:'absent'};
 const v=m[1].replace(/\([^()]*\)/g,' ').trim().replace(/[.;]+$/,'').trim();if(/^none$/i.test(v))return {present:true,set:new Set(),line:m[0]};
 // BB-7447 D9-1: "premise(s)" or "LINK(s)" labels the numbers after it; "a-b", "a to b" are ranges; a defender LINK n maps through the
 // ledger's "(LINK n)" (no map, or the challenger side: LINK n is premise n).
 if(!/\d/.test(v)||/[^0-9,&\s]/.test(v.replace(/\b(?:and|premises?|links?|to)\b/gi,' ').replace(/[-–]/g,' ')))return {present:false,why:'unreadable',line:m[0]};
 const set=new Set();let lab='P';const add=n=>{if(lab==='L'&&side==='DEFENDER'&&LK&&LK[n])LK[n].forEach(q=>set.add(q));else set.add(n);};
 for(const t of v.matchAll(/(premises?)|(links?)|(\d+)\s*(?:-|–|\bto\b)\s*(\d+)|(\d+)/gi)){if(t[1])lab='P';else if(t[2])lab='L';
  else if(t[3]){for(let z=+t[3];z<=+t[4]&&z-+t[3]<50;z++)add(z);}else add(+t[5]);}
 return {present:true,set,line:m[0]};}
// The ledger's own map from a defender link to the premises graded against it ("A challenger premise written LINK i: is graded against Di"):
// LINK m -> the premise numbers written "(LINK m)". No LINK label in the ledger: null, and premise n stands for D<n>.
function drvLinkMap(ptext){if(typeof ptext!=='string')return null;const i=ptext.indexOf('AGAINST THE DEFENDER, answered in [CR3]:');const j=i<0?-1:ptext.indexOf('AGAINST THE CHALLENGER, answered in [DR3]:',i);
 if(i<0||j<0)return null;const M={};let any=false;for(const l of ptext.slice(i,j).split('\n')){const m=l.trim().match(/^premise (\d+) \(LINK (\d+)\)/);if(m){any=true;(M[+m[2]]=M[+m[2]]||[]).push(+m[1]);}}
 return any?M:null;}'''

KG8_TEXT = (' +"K-G8 (your COUNTED PREMISES line for a side names a different number of premises than that side\'s count): CORRECTED COUNT for '
            'that side equal to the number of premises your line names plus every K-G6 or K-G7 premise of that side, with the CORRECTED STANDING '
            'that count makes true.";')

def raise_pairs(src):
    old_counted = cut(src, "// The count line's own clauses (BB-7417 defects 1-2)", "  return {P,K};}")
    pairs = [(old_counted, NEW_CP_FN)]
    # drvBroken: the line, the ledger map, the absence marks and K-G8; the defender K-G7 tested on the line, else (A)
    pairs.append((
        r'''function drvBroken(text,dConc,dStand,prior,cConc,cStand){const items=[],marks=[];if(typeof text!=='string')return {items,marks};const T=text.replace(/[*_`]+/g,'');
 const cl=drvCountLine(T,'DEFENDER');const CS=cl===null?null:drvCounted(cl);const lm=T.match(/^[ \t>#-]*DEFENSE STANDING[ \t]*:[^\n]*?\bL\s*=\s*(\d+)/im);const L=lm?+lm[1]:null;
 const cm=T.match(/^[ \t>#-]*CHALLENGE STANDING[ \t]*:[^\n]*?\bL\s*=\s*(\d+)/im);const LC=cm?+cm[1]:null;''',
        r'''function drvBroken(text,dConc,dStand,prior,cConc,cStand,ptext){const items=[],marks=[];if(typeof text!=='string')return {items,marks};const T=text.replace(/[*_`]+/g,'');
 const cl=drvCountLine(T,'DEFENDER');const lm=T.match(/^[ \t>#-]*DEFENSE STANDING[ \t]*:[^\n]*?\bL\s*=\s*(\d+)/im);const L=lm?+lm[1]:null;
 const cm=T.match(/^[ \t>#-]*CHALLENGE STANDING[ \t]*:[^\n]*?\bL\s*=\s*(\d+)/im);const LC=cm?+cm[1]:null;
 // DoD 9: each side's COUNTED PREMISES line; its absence is written to the row; a line whose number differs from its count is K-G8.
 const LK=drvLinkMap(ptext);const CP={DEFENDER:drvCP(T,'DEFENDER',LK),CHALLENGER:drvCP(T,'CHALLENGER',LK)};
 for(const sd of ['DEFENDER','CHALLENGER']){if(drvCountLine(T,sd)===null)continue;const cp=CP[sd],sc=sd==='DEFENDER'?dConc:cConc;
  if(!cp.present){marks.push('[AUDIT v21: COUNTED PREMISES '+sd+' LINE '+(cp.why==='unreadable'?'UNREADABLE':'ABSENT')+' -- the checks by number fall back to the stated count (A).]');continue;}
  if(typeof sc==='number'&&cp.set.size!==sc){items.push({rule:'K-G8',side:sd,link:sd+' COUNTED PREMISES',line:cp.line,premise:null,conc:cp.set.size,st:sd==='DEFENDER'?dStand:cStand,L:sd==='DEFENDER'?L:LC});
   marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G8) -- COUNTED PREMISES '+sd+' names '+cp.set.size+' premise(s) while the count is '+sc+'. REVIEW THIS ROW.]');}}
 const dBase=CP.DEFENDER.present?CP.DEFENDER.set.size:dConc;'''))
    pairs.append((
        r'''  if(!CS||CS.P.has(n)||CS.K.has(n))continue;
  items.push({rule:'K-G7',side:'DEFENDER',link:id,line,premise:n,conc:dConc,st:dStand,L});
  marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G7) -- '+id+' DEFENDER LINK BROKEN while CONCEDED LINKS does not count premise '+n+'. REVIEW THIS ROW.]');}''',
        r'''  if(cl===null)continue;const ps=LK?(LK[n]||[]):[n];const viaA=!CP.DEFENDER.present||!ps.length;
  if(viaA){if(dConc!==0)continue;}else if(ps.some(q=>CP.DEFENDER.set.has(q)))continue;
  items.push({rule:'K-G7',side:'DEFENDER',link:id,line,premise:ps.length?ps[0]:null,conc:dBase,st:dStand,L});
  marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G7) -- '+id+' DEFENDER LINK BROKEN while '+(viaA?'CONCEDED LINKS is 0':'COUNTED PREMISES DEFENDER does not name premise '+ps.join(' or '))+'. REVIEW THIS ROW.]');}'''))
    # drvLedger: K-G6 on the line; (A) where it is absent
    pairs.append((
        r''' for(const side of ['DEFENDER','CHALLENGER']){const cl=countLine(side);if(cl===null)continue;const CS=drvCounted(cl);
  for(const l of LG[side]){const m=l.match(/^premise (\d+)(?: \(LINK (\d+)\))?: .*NOT NAMED: (.+)$/);if(!m||/^none\s*$/i.test(m[3]))continue;
   if(CS.P.has(+m[1])||CS.K.has(+(m[2]||m[1])))continue;
   const id=side+' premise '+m[1];
   items.push({rule:'K-G6',side,link:id,line:l,conc:side==='DEFENDER'?dConc:cConc,''',
        r''' for(const side of ['DEFENDER','CHALLENGER']){const cl=countLine(side);if(cl===null)continue;const cp=drvCP(T,side,drvLinkMap(ptext));const sc=side==='DEFENDER'?dConc:cConc;
  if(!cp.present&&sc!==0)continue;
  for(const l of LG[side]){const m=l.match(/^premise (\d+)(?: \(LINK (\d+)\))?: .*NOT NAMED: (.+)$/);if(!m||/^none\s*$/i.test(m[3]))continue;
   if(cp.present&&cp.set.has(+m[1]))continue;
   const id=side+' premise '+m[1];
   items.push({rule:'K-G6',side,link:id,line:l,conc:cp.present?cp.set.size:sc,'''))
    return pairs

CALLS = {
 'Panel_Payloads': (r'''const DB=drvBroken(WT,p.conceded_links,p.defense_standing,DRV.items,p.challenger_conceded_links,p.challenge_standing);''',
                    r'''const DB=drvBroken(WT,p.conceded_links,p.defense_standing,DRV.items,p.challenger_conceded_links,p.challenge_standing,drvPromptText(jd.body));'''),
 'Alternate_Payloads': (r'''const DB=drvBroken(WT,p.conceded_links,p.defense_standing,DRV.items,p.challenger_conceded_links,p.challenge_standing);''',
                        r'''const DB=drvBroken(WT,p.conceded_links,p.defense_standing,DRV.items,p.challenger_conceded_links,p.challenge_standing,drvPromptText(a.body));'''),
 'Extract_Independent_Verdict': (r'''const DB=drvBroken(raw0,conceded_links,defense_standing,DRV.items,challenger_conceded_links,challenge_standing);''',
                                 r'''const DB=drvBroken(raw0,conceded_links,defense_standing,DRV.items,challenger_conceded_links,challenge_standing,drvPromptText(prev&&prev.verdictBody));'''),
}

LIB = [
 (r'''CORRECTED COUNT for CHALLENGER, or RETRACTED and one CORRECTED RESULT.";''',
  r'''CORRECTED COUNT for CHALLENGER, or RETRACTED and one CORRECTED RESULT. "''' + '\n' + KG8_TEXT),
 (r'''const cureLabel=x=>x.rule==='K-B'?x.link:((x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6'||x.rule==='K-G7')?''',
  r'''const cureLabel=x=>x.rule==='K-B'?x.link:((x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8')?'''),
 (r'''kg.map(x=>cureLabel(x)+': '+((x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6'||x.rule==='K-G7')?''',
  r'''kg.map(x=>cureLabel(x)+': '+((x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8')?'''),
 (r'''   return kCount(x,'no RETRACTED line with one CORRECTED RESULT');}
  return res('UNCURED','unknown rule',null);});}''',
  r'''   return kCount(x,'no RETRACTED line with one CORRECTED RESULT');}
  // DoD 9 K-G8: the side's COUNTED PREMISES line and its count differ; cured by the count the line and the side's K-G6/K-G7 premises make.
  if(x.rule==='K-G8')return kCount(x,'no other cure');
  return res('UNCURED','unknown rule',null);});}'''),
 (r'''const ks=(v||[]).filter(x=>x.side===side&&(x.rule==='K-G1'||x.rule==='K-G3'||x.rule==='K-G6'||x.rule==='K-G7'));''',
  r'''const ks=(v||[]).filter(x=>x.side===side&&(x.rule==='K-G1'||x.rule==='K-G3'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'));'''),
]

OTHER = {
 'Panel_Build': [(r'''neither reading is presumed.','','%s',''' % PLAIN_JS,
                  r'''neither reading is presumed.','','%s','','%s',''' % (PLAIN_JS, CP_JS))],
 'Build_Independent_Verdict': [(r'''debate participants. %s'}''' % PLAIN_JS,
                                r'''debate participants. %s %s'}''' % (PLAIN_JS, CP_JS))],
 'Format_Markdown': [(r''''K-G7': 'BROKEN on a premise the count leaves out (K-G7)' };''',
                      r''''K-G7': 'BROKEN on a premise the count leaves out (K-G7)', 'K-G8': 'Counted premises line differs from the count (K-G8)' };''')],
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
    rp0 = None
    for n in RAISE_NODES:
        src = open(os.path.join(base, n + '.js')).read()
        rp = raise_pairs(src)
        if rp0 is not None and rp[0][0] != rp0:
            raise SystemExit('ABORT: the prose reader differs between raise nodes')
        rp0 = rp[0][0]
        plan[n] = rp + [CALLS[n]]
    for n in CURE_NODES:
        plan.setdefault(n, []).extend(LIB)
    for n, p in OTHER.items():
        plan.setdefault(n, []).extend(p)
    rec = {}
    for n in sorted(os.listdir(base)):
        if not n.endswith('.js'):
            continue
        name = n[:-3]
        src = open(os.path.join(base, n)).read()
        pairs = plan.get(name, [])
        new = apply(src, pairs, name)
        rev = new
        for a, b in reversed(pairs):
            if rev.count(b) != 1:
                raise SystemExit('ABORT %s: replacement not unique for reverse: %s' % (name, b[:90]))
            rev = rev.replace(b, a)
        if rev != src:
            raise SystemExit('ABORT %s: reverse does not give the base' % name)
        open(os.path.join(out, n), 'w').write(new)
        rec[name] = {'base9': hashlib.md5(src.encode()).hexdigest(), 'new9': hashlib.md5(new.encode()).hexdigest(), 'pairs': len(pairs)}
    json.dump(rec, open(os.path.join(out, '..', 'NEW9_MD5S.json'), 'w'), indent=1, sort_keys=True)
    for n in sorted(rec):
        print(n, rec[n]['pairs'], rec[n]['base9'][:8], '->', rec[n]['new9'][:8])
    print(len(rec), 'nodes written,', sum(1 for n in rec if rec[n]['pairs']), 'changed')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
