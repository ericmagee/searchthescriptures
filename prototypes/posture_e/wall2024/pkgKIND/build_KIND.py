# pkgKIND: run 32985 lost its whole enforcer log (259 rows) because debate_enforcer_log_kind_check allows only cure, alternate_reply,
# failed_reply, enforcer_check and send_back, and E-APPLY wrote kind 'send_back_apply' (E-GATE would write 'gate'). This package maps both
# onto the allowed kind 'send_back'; the rule column (E-APPLY, E-GATE) keeps them apart. No schema change.
# It also assembles the WHOLE stack (PWQA, R2, KCON, VC, KCR, SBP, GATE rev 2, TG, ALT, SBS, EANS rev 2) as final files, with the live base
# taken from 68fe69cd (= 7071068c after the 32985 revert), so the live-test thread can write once from what is live now. Run from wall2024/.
import os,json,hashlib
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
SRC={}  # file -> path of its last package
for d in ['pkgGATE/patched','pkgALT/patched','pkgSBS/patched','pkgEANS/patched2']:
    for f in os.listdir(d):SRC[f]=d+'/'+f
B68=json.load(open('pkgALT/base_nodes_68fe.json'))
def live_base(f):
    n=f[:-3].replace('_',' ')
    if f=='Alternate_Merge.js':return None,None  # the new Alt Apply node takes the name "Alternate Merge"
    if os.path.exists('merged_TLRN/'+f) and f!='Alternate_Merge_Seat.js':return 'merged_TLRN/'+f,open('merged_TLRN/'+f).read()
    if f=='Alternate_Merge_Seat.js':return 'merged_TLRN/Alternate_Merge.js (node "Alternate Merge", renamed)',open('merged_TLRN/Alternate_Merge.js').read()
    if f=='Send_Back_Record.js':return 'pkgSBP/base/Send_Back_Record.js',open('pkgSBP/base/Send_Back_Record.js').read()
    if n in B68 and f!='Alternate_Merge.js':return 'pkgALT/base_nodes_68fe.json',B68[n]['parameters']['jsCode']
    return None,None
MAP=[("kind:'send_back_apply'","kind:'send_back'"),("kind:'gate'","kind:'send_back'")]
plan={'live':'68fe69cd code (7071068c)','nodes':[]}
for f in sorted(SRC):
    s0=open(SRC[f]).read();s=s0;k={}
    for a,b in MAP:k[a]=s.count(a);s=s.replace(a,b)
    open('pkgKIND/final/'+f,'w').write(s)
    bp,bt=live_base(f)
    plan['nodes'].append({'file':f,'name':f[:-3].replace('_',' '),'from':SRC[f],'live_base':bp or 'NEW NODE','live_base_sha':sha(bt) if bt else None,'final_sha':sha(s),'kind_edits':{a:n for a,n in k.items() if n}})
json.dump(plan,open('pkgKIND/plan_KIND.json','w'),indent=1)
for n in plan['nodes']:print(n['name'].ljust(28),str(n['live_base_sha']).ljust(17),n['final_sha'],n['kind_edits'])
