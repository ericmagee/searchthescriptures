# BB-6904 rev 12 step 12 (Worker_E): patch by anchor; every anchor must occur exactly once in its node, else abort.
import os,sys
B,N=sys.argv[1],sys.argv[2]
JUDGE=['Build_Independent_Verdict.js','Panel_Build.js']
J=[
 ("[CR3] (defender) and [DR3] (challenger). The POST",
  "[CR3] (defender) and [DR3] (challenger); an ANSWER to a pressed witness is read from any later round of the side that holds the link, its round 2 or its link round. The POST"),
 ("in a round before this link round (against the defender","in an earlier round (against the defender"),
 ("is ANSWERED only when this link round quotes it",
  "is ANSWERED when any later round of the side that holds the link (for the defender: [CR2] or [CR3]; for the challenger: [DR2] or [DR3]) quotes it"),
 ("broken side's link round left any of those witnesses UNANSWERED","broken side's later rounds left any of those witnesses UNANSWERED"),
 ("only when the link round answered every such witness","only when the side's later rounds answered every such witness"),
 ("a witness the link round leaves unanswered is graded","a witness the side's later rounds leave unanswered is graded"),
 # BB-7379 option 1: the system ledger tests every later round of the side, its round 2 and its link round, after the round that first cites the verse.
 ("dCited:citedNotNamed([['[DR1]',F.gr1],['[DR2]',F.gr2]],F.cr3),cCited:citedNotNamed([['[CR1]',F.cr1],['[CR2]',F.cr2],['[CR3]',F.cr3]],F.dr3)",
  "dCited:citedNotNamed([['[DR1]',F.gr1],['[DR2]',F.gr2]],[['[CR2]',F.cr2],['[CR3]',F.cr3]]),cCited:citedNotNamed([['[CR1]',F.cr1],['[CR2]',F.cr2],['[CR3]',F.cr3]],[['[DR2]',F.gr2],['[DR3]',F.dr3]])"),
 (" const citedNotNamed=(rounds,answering)=>{const N=namedIn(answering);let total=0;const not=[];for(const x of citedRounds(rounds))for(const i of x.items){total++;if(!i.r.cvs.some(cv=>isNamed(N,i.r.book,cv)))not.push(i.label);}return {total,not};};",
  " // BB-6904 rev 12 (7379): a verse counts as named when any later round of the answering side names it, later than the round that first cites it.\n const citedNotNamed=(rounds,answers)=>{const O=['[CR1]','[DR1]','[CR2]','[DR2]','[CR3]','[DR3]'];const NA=answers.map(([k,t])=>[O.indexOf(k),namedIn(t)]);let total=0;const not=[];for(const x of citedRounds(rounds)){const at=O.indexOf(x.name);const Ns=NA.filter(a=>a[0]>at).map(a=>a[1]);for(const i of x.items){total++;if(!Ns.some(N=>i.r.cvs.some(cv=>isNamed(N,i.r.book,cv))))not.push(i.label);}}return {total,not};};"),
 ("[citedLine(L.dCited,'[DR1] or [DR2]','[CR3]')]","[citedLine(L.dCited,'[DR1] or [DR2]','a later round of the defender, [CR2] or [CR3]')]"),
 ("[citedLine(L.cCited,'[CR1], [CR2] or [CR3]','[DR3]')]","[citedLine(L.cCited,'[CR1], [CR2] or [CR3]','a later round of the challenger, [DR2] or [DR3]')]"),
 ("lists every verse the opposing side cited in the rounds before that link round that the link round does not name;",
  "lists every verse the opposing side cited before that link round that no later round of the side that holds the link names (for the defender [CR2] or [CR3], for the challenger [DR2] or [DR3], later than the round that first cites the verse);"),
]
C=[
 ('+"For a K-G1 or K-G4 link whose cited verse the answering link round names ([CR3] against the defender, [DR3] against the challenger), add a SHORT line "\n +"quoting the words of that link round that answer it',
  '+"For a K-G1 or K-G4 link whose cited verse any later round of the side that holds the link names ([CR2] or [CR3] against the defender, [DR2] or [DR3] against the challenger), add a SHORT line "\n +"quoting the words of that round that answer it'),
 ('+"SHORT: D<n> vs C<m> | [<link round>] | \\"<the words of that link round, quoted exactly>\\" | <why they do not overturn the link>\\n"',
  '+"SHORT: D<n> vs C<m> | [<answering round>] | \\"<the words of that round, quoted exactly>\\" | <why they do not overturn the link>\\n"'),
 ('where the link round names the verse, it must also quote "\n +"the link round\'s own answer.',
  'where a later round of the side that holds the link names the verse, it must also quote "\n +"that round\'s own answer.'),
 ("\\s*\\|\\s*\\[(CR3|DR3)\\]\\s*\\|\\s*","\\s*\\|\\s*\\[(CR2|CR3|DR2|DR3)\\]\\s*\\|\\s*"),
 ("  const lrK=x.side==='DEFENDER'?'CR3':'DR3';const LR=typeof R[lrK]==='string'?R[lrK]:'';\n  const named=(x.rule==='K-G1'||x.rule==='K-G4')&&LR?cureNamed(x.line,LR):[];const namedTxt=named.map(n=>n.ref).join(', ');\n  const shortOk=()=>!named.length||o.short.some(s=>U(s.link)===U(x.link)&&s.round===lrK&&named.some(n=>n.blocks.some(b=>cureFound(s.q,b))))||stmtQ(stmtOf(x)).some(q=>named.some(n=>n.blocks.some(b=>cureFound(q,b))));\n",
  "  // BB-6904 rev 12 (7374, 7377): the answer is read from any later round of the side that holds the link, its round 2 or its link round,\n"
  "  // that comes after the round named as pressing the witness (order CR1 DR1 CR2 DR2 CR3 DR3).\n"
  "  const ORD=['CR1','DR1','CR2','DR2','CR3','DR3'];const ansK=pr=>(x.side==='DEFENDER'?['CR2','CR3']:['DR2','DR3']).filter(k=>!pr||ORD.indexOf(k)>ORD.indexOf(pr));\n"
  "  const namedIn=pr=>(x.rule==='K-G1'||x.rule==='K-G4')?ansK(pr).filter(k=>typeof R[k]==='string'&&R[k]).map(k=>({k,n:cureNamed(x.line,R[k])})).filter(z=>z.n.length):[];\n"
  "  const nmTxt=pr=>namedIn(pr).map(z=>'['+z.k+'] '+z.n.map(n=>n.ref).join(', ')).join('; ');\n"
  "  // A quotation is the answer only in that round's own words: it is not also found in a round of the other side before it (a verse's own\n"
  "  // words, quoted by both sides, never count as the answer).\n"
  "  const ownQ=(q,k)=>!(x.side==='DEFENDER'?['DR1','DR2','DR3']:['CR1','CR2','CR3']).some(o2=>ORD.indexOf(o2)<ORD.indexOf(k)&&typeof R[o2]==='string'&&cureFound(q,R[o2]));\n"
  "  const shortOk=pr=>{const nm=namedIn(pr);return !nm.length||o.short.some(s=>U(s.link)===U(x.link)&&nm.some(z=>z.k===s.round&&ownQ(s.q,z.k)&&z.n.some(n=>n.blocks.some(b=>cureFound(s.q,b)))))||stmtQ(stmtOf(x)).some(q=>nm.some(z=>ownQ(q,z.k)&&z.n.some(n=>n.blocks.some(b=>cureFound(q,b)))));};\n"),
 ("    if(!shortOk())return res('UNCURED','statement quotes '+sp.round+'; the link round '+lrK+' names '+namedTxt+' and neither a SHORT line nor the statement quotes its answer',lines.concat([sp.line]));\n    return res('CURED','statement passes the check: quotation found in '+sp.round+(named.length?'; answer quoted from '+lrK:''),lines.concat([sp.line]));}\n",
  "    if(!shortOk(sp.round))return res('UNCURED','statement quotes '+sp.round+'; the later round '+nmTxt(sp.round)+' and neither a SHORT line nor the statement quotes its answer',lines.concat([sp.line]));\n    return res('CURED','statement passes the check: quotation found in '+sp.round+(nmTxt(sp.round)?'; answer quoted for '+nmTxt(sp.round):''),lines.concat([sp.line]));}\n"),
 ("   if(!shortOk())return res('UNCURED','the link round '+lrK+' names '+namedTxt+'; no SHORT line quoting its answer',lines);\n   return res('CURED','pressed: quotation found in '+hit.round+(named.length?'; SHORT found in '+lrK+\"'s answer to \"+namedTxt:''),lines);}\n",
  "   if(!shortOk(hit.round))return res('UNCURED','the later round '+nmTxt(hit.round)+'; no SHORT line quoting its answer',lines);\n   return res('CURED','pressed: quotation found in '+hit.round+(nmTxt(hit.round)?'; SHORT found for '+nmTxt(hit.round):''),lines);}\n"),
 ("    if(!shortOk())return res('UNCURED','the link round '+lrK+' names '+namedTxt+'; neither a SHORT line nor the statement quotes its answer',lines.concat([sp.line]));\n",
  "    if(!shortOk(sp.round))return res('UNCURED','the later round '+nmTxt(sp.round)+'; neither a SHORT line nor the statement quotes its answer',lines.concat([sp.line]));\n"),
 ("   if(hit&&!shortOk())return res('UNCURED','the link round '+lrK+' names '+namedTxt+'; no SHORT line quoting its answer',lines);\n",
  "   if(hit&&!shortOk(hit.round))return res('UNCURED','the later round '+nmTxt(hit.round)+'; no SHORT line quoting its answer',lines);\n"),
]
os.makedirs(N,exist_ok=True)
for f in sorted(os.listdir(B)):
    if not f.endswith('.js'):continue
    s=open(os.path.join(B,f),encoding='utf-8').read()
    for a,b in (J if f in JUDGE else C):
        n=s.count(a)
        if n!=1: sys.exit('ABORT %s: anchor count %d: %s'%(f,n,a[:80]))
        s=s.replace(a,b)
    if f not in JUDGE:
        for bad in ['lrK','namedTxt','(CR3|DR3)']:
            if bad in s: sys.exit('ABORT %s: leftover %s'%(f,bad))
    open(os.path.join(N,f),'w',encoding='utf-8').write(s)
    print('patched',f)
