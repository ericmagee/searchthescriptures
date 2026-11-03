#!/usr/bin/env python3
"""Rulings 411 and 412 on top of the rebased fix set 9 (new9/ -> new/). Anchored, each anchor exactly once per node."""
import os, sys, glob, shutil
H = os.path.dirname(os.path.abspath(__file__)); S = os.path.join(H, 'new9'); N = os.path.join(H, 'new')
shutil.rmtree(N, ignore_errors=True); shutil.copytree(S, N)
def get(nm): return open(os.path.join(N, nm + '.js')).read()
def put(nm, s): open(os.path.join(N, nm + '.js'), 'w').write(s)
def rep(nm, old, new, count=1):
    s = get(nm); c = s.count(old)
    if c != count: sys.exit(f'STOP {nm}: anchor {c}x, want {count}: {old[:120]!r}')
    put(nm, s.replace(old, new))
def nodes_with(a): return sorted(os.path.basename(f)[:-3] for f in glob.glob(os.path.join(N, '*.js')) if a in open(f).read())
JUDGE = ['Panel Build', 'Build Independent Verdict']

# ---- ruling 411: a forced-link grade (with its FORCED line) is a BROKEN ground even when the witness was answered ----
A411 = "const __R396F=\""
for nm in JUDGE:
    rep(nm, A411, A411 + "FORCED LINK (ruling 411): a link that the meaning of a pressed witness will not fit is graded BROKEN as a forced link even when the holding side answered that witness, if its answer does not show the fit. ")
K = "  else if(conc===0&&DRV_WORDS.test(line)){items.push({rule:'K-G1',side,link:id,line});"
FN = ("function __kfHas(text,id){try{if(typeof KF_LINE==='undefined')return false;const T=String(text||'').replace(/\\\\n/g,'\\n').replace(/[*_`]+/g,'');"
      "return T.split('\\n').some(l=>{const m=l.trim().match(KF_LINE);return !!m&&m[1].replace(/\\s+vs\\.?\\s+/i,' vs ').toUpperCase()===String(id).toUpperCase();});}catch(e){return false;}}\n")
for nm in nodes_with(K):
    rep(nm, K, "  else if(__kfHas(text,id)){marks.push('[AUDIT v29: K-G1/K-G4 NOT RAISED -- '+id+' '+g[1]+' is graded as a forced link with a FORCED line (ruling 411: a link may fail by meaning though the witness was answered); K-F reads its quotations.]');} /* ruling 411 */\n" + K)
    rep(nm, "function drvCheck(", FN + "function drvCheck(")
C = "  if(x.rule==='K-G4'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));"
for nm in nodes_with(C):
    rep(nm, C, C + "\n   {const fz=(typeof KF_LINE==='undefined'||!reply||!reply.ok)?[]:String(cureUnwrap(reply.text)).split('\\n').map(l=>l.trim().replace(/[*_`]+/g,'')).filter(l=>{const m=l.match(KF_LINE);return !!m&&U(m[1].replace(/\\s+vs\\.?\\s+/i,' vs '))===U(x.link);});if(fz.length)return res('CURED','forced link: a FORCED line for '+x.link+' (ruling 411); K-F reads its quotations',fz);} /* ruling 411 */")
for nm in nodes_with("const __CURE396=\""):
    rep(nm, "const __CURE396=\"", "const __CURE396=\" FORCED LINK (ruling 411): a K-G4 item on a link you graded BROKEN because the link cannot take the witness's meaning, though the holding side answered it, is cured by one FORCED line for that item, its three quotations standing in the rounds named.")

# ---- ruling 412 (1): a concession in the close round counts like one in the link round ----
for nm in JUDGE:
    rep(nm, "WITHDRAWN: a defender link that [CR3] itself states as conceded or withdrawn,",
        "WITHDRAWN: a defender link that [CR3], or the defender's close round [CR4], itself states as conceded or withdrawn (a concession in the close counts like one in the link round, ruling 412),")
    rep(nm, "the count of challenger-listed premises the defender CONCEDED or failed to exhibit its layer footing in [CR3].",
        "the count of challenger-listed premises the defender CONCEDED or failed to exhibit its layer footing in [CR3]; a premise the defender concedes in its close round [CR4] is counted CONCEDED (stated) the same way (ruling 412).")
    rep(nm, "the count of defender-listed premises the challenger CONCEDED or failed to exhibit its layer footing in [DR3].",
        "the count of defender-listed premises the challenger CONCEDED or failed to exhibit its layer footing in [DR3]; a premise the challenger concedes in its close round [DR4] is counted CONCEDED (stated) the same way (ruling 412).")
    s = get(nm)
    i = s.index("BINDING: these are recorded separately and DO NOT ENTER CONCEDED LINKS"); j = s.index("Never sum an out-of-round concession with a link-round count.", i) + len("Never sum an out-of-round concession with a link-round count.")
    put(nm, s[:i] + "BINDING (ruling 412): a concession made in a close round ([CR4] or [DR4]) of a declared link or of a listed premise ENTERS the counts exactly as a link-round concession does (w, CONCEDED LINKS, CHALLENGER CONCEDED LINKS, the standings, the CLAUSE line and the verdict); end its line here with COUNTED. Ground granted in [CR1], [DR1], [CR2] or [DR2] is recorded here and does not enter those counts." + s[j:])

# ---- ruling 412 (2): the ANSWER CHECK line (the rule text sits in a single-quoted JS string: apostrophes escaped, double quotes plain) ----
AC_OLD = "Re-citing the link\\'s own footing while passing over the witness pressed against it is not an answer."
AC_NEW = AC_OLD + (" ANSWER CHECK (ruling 412): an answer counts only when its reason holds against the row it names. For every answer whose reason makes a claim"
  " about the witness\\'s own row (what the verse is about, whom it governs, what it says), write one line in reasoning after the COLLISION POINTS lines:"
  " ANSWER CHECK: <book chapter:verse> -- [<round>] -- \"<the answer\\'s claim, quoted>\" -- HOLDS | FAILS -- \"<the row\\'s own words that decide it>\"."
  " An answer that FAILS leaves the witness unanswered (the UNANSWERED WITNESS test).")
for nm in JUDGE:
    rep(nm, AC_OLD, AC_NEW)

# ---- ruling 412 (3, 4): close-round marks: footing new to the closing side; a sentence that takes back an earlier grant ----
C4X = r"""
// ruling 412 (3, 4; reviews of run 32373): two TRIAL marks on each close round, for the judges. (4) a verse the closing side cites in its close for
// the first time (the other side cited it before), outside an ANSWER line, is NEW TO THIS SIDE: not footing. (3) a close sentence that names a verse
// the same side granted or narrowed earlier, and asserts what the grant gave up, is a POSSIBLE REVERSAL: the earlier grant stands; the sentence is
// disregarded as footing.
const C4X=(()=>{
 const own=(F,sd)=>sd==='D'?[F.cr1,F.cr2,F.cr3]:[F.gr1,F.gr2,F.dr3];const oth=(F,sd)=>sd==='D'?[F.gr1,F.gr2,F.dr3]:[F.cr1,F.cr2,F.cr3];const cl=(F,sd)=>String((sd==='D'?F.cr4:F.dr4)||'');
 const keys=t=>{const S=new Set();C4P.refs(String(t||'')).forEach(r=>r.vs.forEach(x=>S.add(x)));return S;};
 const sents=t=>String(t||'').replace(/[*_`]+/g,'').split(/\n+|(?<=[.!?]["”’']?)\s+(?=[A-Z\[("“])/).map(x=>x.trim()).filter(Boolean);
 const newToSide=(F,sd)=>{const O=new Set(),T=new Set();own(F,sd).forEach(t=>keys(t).forEach(k=>O.add(k)));oth(F,sd).forEach(t=>keys(t).forEach(k=>T.add(k)));
  const body=cl(F,sd).split('\n').filter(l=>!/^\s*[-*•>]*\s*\**\s*ANSWER\s*:/i.test(l)).join('\n');const out=[];const seen=new Set();
  for(const r of C4P.refs(body)){if(r.vs.some(x=>O.has(x)))continue;if(!r.vs.some(x=>T.has(x)))continue;if(seen.has(r.label))continue;seen.add(r.label);out.push(r.label);}return out;};
 const GR=/\b(?:I\s+(?:concede|grant|drop)|[Gg]ranted\b|not\s+decisive\s+alone|alone\s+(?:would\s+not|does\s+not|is\s+not|proves\s+no)|(?:do|does)\s+not\s+rest\s+on\s+it\s+alone|not\s+(?:its|the)\s+sole\s+support|does\s+not\s+by\s+(?:itself|themselves)|do\s+not\s+by\s+themselves)/i;
 const STRONG=/\b(?:leaves?\s+no\s+gap|no\s+gap|excludes?|denies|deny|proves?|cannot|can\s+not|there\s+is\s+no|no\s+room|closes?\s+(?:the|this)\s+gap)\b/i;
 const reversal=(F,sd)=>{const G=[];own(F,sd).slice(1).forEach(t=>sents(t).forEach(s=>{if(GR.test(s)){const k=keys(s);if(k.size)G.push({s,k});}}));const out=[];
  for(const s of sents(cl(F,sd))){if(GR.test(s)||!STRONG.test(s))continue;const k=keys(s);if(!k.size)continue;const g=G.find(x=>[...k].some(y=>x.k.has(y)));if(g&&out.length<6)out.push({close:s.slice(0,300),grant:g.s.slice(0,300)});}return out;};
 const note=(F,sd)=>{if(!cl(F,sd).trim())return '';const R=sd==='D'?'CR4':'DR4';let t='';const n=newToSide(F,sd);
  if(n.length)t+='\n\n[CLOSE-ROUND NEW-FOOTING CHECK -- computed by the system, not by a model; a TRIAL check (ruling 412): ['+R+'] cites '+n.length+' verse(s) that this side never cited before and the other side did: '+n.join(', ')+'. Outside an ANSWER line such a verse is NEW TO THIS SIDE IN CLOSE: it is not footing for any link.]';
  const v=reversal(F,sd);if(v.length)t+='\n\n[CLOSE-ROUND REVERSAL CHECK -- computed by the system, not by a model; a TRIAL check (ruling 412): '+v.length+' sentence(s) in ['+R+'] name a verse this side granted or narrowed earlier, and assert more than the grant left: '+v.map((x,i)=>'('+(i+1)+') ['+R+'] "'+x.close.replace(/[\[\]"]/g,'')+'" -- earlier: "'+x.grant.replace(/[\[\]"]/g,'')+'"').join(' ')+'. Where the close takes the grant back, the earlier grant stands and the close sentence is DISREGARDED as footing.]';
  return t;};
 return {newToSide,reversal,note};})();
"""
for nm in JUDGE:
    s = get(nm); i = s.index('const C4P=(()=>{'); j = s.index('return {refs,fresh,of,note,ofD,noteD,renum,noteR,declared,dlinks,cblocks,press,noteP,noteL,all,storeLine,stored};})();', i)
    j = s.index('})();', j) + 5
    put(nm, s[:j] + C4X + s[j:])
rep('Panel Build', "+C4P.noteD(F)+C4P.noteR(F,'D')+C4P.noteP(F,'D',__CGS('D')):null]", "+C4P.noteD(F)+C4P.noteR(F,'D')+C4P.noteP(F,'D',__CGS('D'))+C4X.note(F,'D'):null]")
rep('Panel Build', "+C4P.note(F)+C4P.noteR(F,'C')+C4P.noteP(F,'C',__CGS('C')):null]", "+C4P.note(F)+C4P.noteR(F,'C')+C4P.noteP(F,'C',__CGS('C'))+C4X.note(F,'C'):null]")
print('done; changed nodes:', len(os.listdir(N)))
rep('Build Independent Verdict', "+C4P.noteD(d)+C4P.noteR(d,'D')+C4P.noteP(d,'D',__CGS('D')):'')", "+C4P.noteD(d)+C4P.noteR(d,'D')+C4P.noteP(d,'D',__CGS('D'))+C4X.note(d,'D'):'')")
rep('Build Independent Verdict', "+C4P.note(d)+C4P.noteR(d,'C')+C4P.noteP(d,'C',__CGS('C')):'')", "+C4P.note(d)+C4P.noteR(d,'C')+C4P.noteP(d,'C',__CGS('C'))+C4X.note(d,'C'):'')")
print('single judge close marks added')
