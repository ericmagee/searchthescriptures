# pkgCR (W3 2325): (1) a CORRECTED RESULT line counts when it opens with its tag, whatever reason follows after a separator ("HELD-1 -- [DR3] names ..."),
# as judge_fix4 F3 already reads a RETRACTED line. Before, only the bare tag was read, so the line fell to malformed and every RETRACTED
# item of that reply was "RETRACTED without exactly one CORRECTED RESULT line" (runs 32905 and 33014, chatgpt: the only two replies in the
# log that wrote a reason after the tag; 33014 removed the seat on 3 K-G4 items). (2) The UNANSWERED-WITNESS label (g4Label2024) names the RETRACTED form and its one CORRECTED RESULT line. Base: the live stack (pkgGDUP/patched for its 6 gate nodes,
# pkgGD/patched for the other 13). All 19 cure-library nodes. Run from wall2024/.
import os,json,hashlib
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
A="else if(k[1]==='CORRECTED RESULT'&&(m=r.match(/^(BROKEN-1|BROKEN-2|PARTIAL-1|PARTIAL-2|PARTIAL-3|HELD-1)$/)))o.result.push({tag:m[1],word:m[1].split('-')[0],line:l});"
B="else if(k[1]==='CORRECTED RESULT'&&(m=r.match(/^(BROKEN-1|BROKEN-2|PARTIAL-1|PARTIAL-2|PARTIAL-3|HELD-1)(?:\\s*(?:--|\\u2014|\\u2013|:|;|,|\\()[\\s\\S]*)?$/i))){m[1]=m[1].toUpperCase();o.result.push({tag:m[1],word:m[1].split('-')[0],line:l});} /* pkgCR: the tag, then any reason after a separator (as judge_fix4 F3 reads RETRACTED) */"
LA="it was answered: cure it with RETRACTED, or with one FORCED line"
LB="it was answered: cure it with RETRACTED: D<n> vs C<m> and exactly one CORRECTED RESULT line for your whole reply (CORRECTED RESULT: <BROKEN-1 | BROKEN-2 | PARTIAL-1 | PARTIAL-2 | PARTIAL-3 | HELD-1>, a reason may follow after \" -- \"), or with one FORCED line"
plan={'base':'pkgGDUP/patched (6 gate nodes) + pkgGD/patched (13)','nodes':[]}
for f in sorted(os.listdir('pkgGD/patched')):
    src=('pkgGDUP/patched/' if os.path.exists('pkgGDUP/patched/'+f) else 'pkgGD/patched/')+f
    o=open(src).read();assert o.count(A)==1,(f,o.count(A));s=o.replace(A,B)
    assert s.count(LA)==1,(f,'label',s.count(LA));s=s.replace(LA,LB)
    open('pkgCR/patched/'+f,'w').write(s);plan['nodes'].append({'file':f,'name':f[:-3].replace('_',' '),'base':src.split('/')[0],'base_sha':sha(o),'final_sha':sha(s)})
json.dump(plan,open('pkgCR/plan_CR.json','w'),indent=1);print(len(plan['nodes']),'nodes')
