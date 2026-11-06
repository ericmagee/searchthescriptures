# pkgP: K-CMT precision (W3 ruling, WALL-2024 reply 2216). Base: merged_TLRN (= live 68fe69cd).
import glob,os,json,hashlib
BASE='../merged_TLRN'; OUT='patched'; os.makedirs(OUT,exist_ok=True)
OLD_FILTER="const L=T.split('\\n').map(l=>l.trim()).filter(l=>l&&!/^\\[AUDIT\\b/.test(l)&&/\\b(BROKEN|FORCED|MISSES|VOID|UNPROVEN)\\b/.test(l)&&!/\\bCommitment\\s*\\d+\\b/i.test(l));"
NEW_FILTER="const L=T.split('\\n').map(l=>l.trim()).filter(l=>l&&kcmtGrade2024(l));"
GRADE_FN=r'''// K-CMT precision (W3 ruling, WALL-2024 reply 2216): only the judge's own contested grade lines count. Not counted: the engine's
// RESULT ... recomputed line; the CLAUSE formula line (its own form check reads it); DEFENSE / CHALLENGE STANDING lines; ruling-card lines (RULING / CLAIM / NAMED BY /
// RULE / APPLIED; K-RUL reads the card); grade words inside quotation marks (ANSWER CHECK MEANS/ANSWER quotes, quoted reasons);
// a grade word in a negation ("None is VOID", "No premise is VOID", "not VOID"); in an ANSWER CHECK line, any word but its verdict slot
// (the grade after ANSWER, e.g. MISSES). "Commitments 3 and 7" names a commitment.
function kcmtGrade2024(l){if(/^\[AUDIT\b/.test(l))return false;const h=l.replace(/^[-*•>\s]+/,'').replace(/^\*\*/,'');
 if(/^RESULT\s*:.*\brecomputed\b/i.test(h))return false;if(/^CLAUSE\s*:/i.test(h))return false;if(/^(?:DEFENSE|CHALLENGE)\s+STANDING\s*:/i.test(h))return false; /* a standing is graded by its standing word; a VOID in it counts rulings made on the CONCEDED LINKS line */
 if(/^(?:RULING\s*(?:--|—|–|:)|CLAIM\s*:|NAMED BY\s*:|RULE\s*:|APPLIED\s*:)/i.test(h))return false;
 if(/\bCommitments?\s*\d+/i.test(h))return false;
 let t=h.replace(/"[^"]*"|“[^”]*”/g,' ');
 if(/^ANSWER CHECK\s*:/i.test(h)){const a=t.lastIndexOf('ANSWER:');const sg=(a<0?'':t.slice(a)).split(/\s(?:--|—|–)\s/);t=sg.length>1?sg[1]:'';} /* an ANSWER CHECK grades by its verdict slot after ANSWER; a trailing "premise N is VOID" points to a VOID ruled elsewhere */
 t=t.replace(/\b(?:none|no\s+\w+(?:\s+\w+)?)\s+(?:(?:is|are|was|were)\s+)?(?:counted\s+as\s+)?(?:BROKEN|FORCED|MISSES|VOID|UNPROVEN)\b/gi,' ').replace(/\bnot\s+(?:BROKEN|FORCED|MISSES|VOID|UNPROVEN)\b/gi,' ');
 return /\b(BROKEN|FORCED|MISSES|VOID|UNPROVEN)\b/.test(t);}
'''
FN_ANCHOR="function kcmtLines2024(text){"
OLD_CURE="if(/\\bCommitment\\s*\\d+\\b/i.test(rp)||/\\bNOT A GRADE\\b/.test(rp))"
NEW_CURE="if(/\\bCommitments?\\s*\\d+/i.test(rp)||/\\bNOT A GRADE\\b/.test(rp))"
plan={}
for f in sorted(glob.glob(BASE+'/*.js')):
    n=os.path.basename(f); s=open(f).read(); o=s; ed=[]
    if s.count(OLD_FILTER):
        assert s.count(OLD_FILTER)==1 and s.count(FN_ANCHOR)==1, n
        s=s.replace(OLD_FILTER,NEW_FILTER).replace(FN_ANCHOR,GRADE_FN+FN_ANCHOR); ed+=['kcmt filter','kcmtGrade2024']
    if s.count(OLD_CURE):
        assert s.count(OLD_CURE)==1, n
        s=s.replace(OLD_CURE,NEW_CURE); ed.append('K-CMT cure plural')
    if ed:
        open(OUT+'/'+n,'w').write(s); plan[n]={'edits':ed,'base_sha':hashlib.sha256(o.encode()).hexdigest()[:12],'new_sha':hashlib.sha256(s.encode()).hexdigest()[:12]}
json.dump(plan,open('plan_P.json','w'),indent=1); print(len(plan)); [print(k,v['edits']) for k,v in plan.items()]
