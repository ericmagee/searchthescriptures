# pkgALT: item C (WALL-2024 2266 design; 2268 rulings; 2269 notes; 2272). Run from wall2024/.
# Alternates get the ruling 428 read, the send-back, E-APPLY and the gate, as panel seats do.
# Base: pkgTG/patched/Alternate_Merge.js (after pkgGATE rev 2 and pkgTG). The node "Alternate Merge" is renamed "Alternate Merge Seat" (code
# unchanged). New: Alt Seated, 12 clones (Alt Judge Enforcer x4, Alt Send Back x4, Alt Gate x4), and a new "Alternate Merge" (Alt Apply) before Dry?.
# Also: Gate Build and Gate Record are regenerated on pkgTG's library, so the library is one text in every node (W2 2270).
import hashlib,json,os,re,uuid
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
rd=lambda p:open(p).read()
O='pkgALT/patched';os.makedirs(O,exist_ok=True)
AMs=rd('pkgTG/patched/Alternate_Merge.js');MARK="let PP=$('Panel Cure Check')"
assert AMs.count(MARK)==1;lib=AMs[:AMs.index(MARK)]
# main-chain gate nodes on pkgTG's library
gb=lib+'\n'+rd('pkgGATE/agr_tail.js')+'\n'+rd('pkgGATE/gate_build_tail.js');gr=lib+'\n'+rd('pkgGATE/gate_record_tail.js')
open(O+'/Gate_Build.js','w').write(gb);open(O+'/Gate_Record.js','w').write(gr)
open(O+'/Alternate_Merge_Seat.js','w').write(AMs)
N=json.load(open('pkgALT/base_nodes_68fe.json'));G=json.load(open('pkgGATE/nodes_GATE.json'))['nodes'];GN={n['name']:n for n in G}
# the name substitutions (the only differences a clone may have; test_ALT checks it)
MAP={'Panel Cure Check':'Alt Seated','Panel Build':'Alt Seated','Enforcer Record':'Alt Seated','Regrade Load':'Alt Seated','Final Output':'Alt Seated',
 'Judge Enforcer Build':'Alt Judge Enforcer Build','Judge Enforcer Record':'Alt Judge Enforcer Record',
 'Send Back Build':'Alt Send Back Build','Send Back Call openrouter':'Alt Send Back Call openrouter','Send Back Record':'Alt Send Back Record',
 'Gate Build':'Alt Gate Build','Gate Call openrouter':'Alt Gate Call openrouter','Gate Record':'Alt Gate Record'}
LIT=[("seat_role:'panel'","seat_role:'alternate'"),("x.seat_role==='panel'","x.seat_role==='alternate'"),("x.rule==='E-SYN'?'synthesis':'panel'","x.rule==='E-SYN'?'synthesis':'alternate'"),
 ("const XN=['Panel Judge 1 openrouter',","const XN=['Alternate Call openrouter','Alternate Cure Call openrouter','Panel Judge 1 openrouter',")]
def sub(t):
    t=re.sub(r"""(['"])(%s)\1"""%'|'.join(re.escape(k) for k in sorted(MAP,key=len,reverse=True)),lambda m:m.group(1)+MAP[m.group(2)]+m.group(1),t)
    for a,b in LIT:t=t.replace(a,b)
    return t
src={'Alt Judge Enforcer Build':N['Judge Enforcer Build']['parameters']['jsCode'],'Alt Judge Enforcer Record':N['Judge Enforcer Record']['parameters']['jsCode'],
 'Alt Send Back Build':N['Send Back Build']['parameters']['jsCode'],'Alt Send Back Record':rd('pkgSBP/patched/Send_Back_Record.js')}
plan={'base':'pkgTG/patched/Alternate_Merge.js (renamed Alternate Merge Seat); 68fe69cd prewrite for the 428 and send-back nodes; pkgSBP Send Back Record; pkgGATE tails','files':[]}
def put(name,code,base_desc,base_code):
    f=name.replace(' ','_').replace('?','')+'.js';open(O+'/'+f,'w').write(code);plan['files'].append({'file':f,'name':name,'base':base_desc,'base_sha':sha(base_code) if base_code else None,'final_sha':sha(code)})
for nm,code in src.items():put(nm,sub(code),nm[4:],code)
# gate clones: the library is kept byte for byte; only the tail is substituted
for nm,tail in [('Alt Gate Build',rd('pkgGATE/agr_tail.js')+'\n'+rd('pkgGATE/gate_build_tail.js')),('Alt Gate Record',rd('pkgGATE/gate_record_tail.js'))]:
    put(nm,lib+'\n'+sub(tail),nm[4:]+' (library unchanged, tail substituted)',lib+'\n'+tail)
seat=rd('pkgALT/alt_seated.js');put('Alt Seated',seat,'new',None)
ap=lib+'\n'+rd('pkgALT/alt_apply_tail.js');put('Alternate Merge',ap,'new (Alt Apply)',None)
put('Gate Build',gb,'pkgGATE/patched/Gate_Build.js on pkgTG library',rd('pkgGATE/patched/Gate_Build.js'));put('Gate Record',gr,'pkgGATE/patched/Gate_Record.js on pkgTG library',rd('pkgGATE/patched/Gate_Record.js'))
put('Alternate Merge Seat',AMs,'pkgTG/patched/Alternate_Merge.js, renamed, code unchanged',AMs)
# n8n nodes
ids=lambda k:str(uuid.uuid5(uuid.NAMESPACE_URL,'odv1-altc-'+k))
x0,y0=12600,1300;nodes=[]
def code(nm,i):return {'id':ids(nm),'name':nm,'type':'n8n-nodes-base.code','typeVersion':2,'position':[x0+220*i,y0],'parameters':{'jsCode':'FILE:'+O+'/'+nm.replace(' ','_').replace('?','')+'.js'}}
def clone(base,nm,i):
    n=json.loads(json.dumps(base));n.update({'id':ids(nm),'name':nm,'position':[x0+220*i,y0-40 if n['type'].endswith('httpRequest') else y0]})
    p=n['parameters']
    if 'jsonBody' in p:p['jsonBody']=sub(p['jsonBody'])
    if 'conditions' in p:
        for c in p['conditions']['conditions']:c['id']='alt-'+c['id']
    return n
seq=[code('Alt Seated',0),code('Alt Judge Enforcer Build',1),clone(N['Judge Enforcer Needed?'],'Alt Judge Enforcer Needed?',2),clone(N['Judge Enforcer Call deepseek'],'Alt Judge Enforcer Call deepseek',3),code('Alt Judge Enforcer Record',4),
 code('Alt Send Back Build',5),clone(N['Send Back Needed?'],'Alt Send Back Needed?',6),clone(N['Send Back Call openrouter'],'Alt Send Back Call openrouter',7),code('Alt Send Back Record',8),
 code('Alt Gate Build',9),clone(GN['Gate Needed?'],'Alt Gate Needed?',10),clone(GN['Gate Call openrouter'],'Alt Gate Call openrouter',11),code('Alt Gate Record',12),code('Alternate Merge',13)]
seq[-1]['id']=ids('Alternate Merge (Alt Apply)')
conn={'rename':[['Alternate Merge','Alternate Merge Seat','the existing node keeps its id; its code becomes pkgALT/patched/Alternate_Merge_Seat.js; every connection INTO it keeps pointing at it under the new name']],
 'remove':[['Alternate Merge Seat',0,'Dry?']],
 'add':[['Alternate Merge Seat',0,'Alt Seated'],['Alt Seated',0,'Alt Judge Enforcer Build'],['Alt Judge Enforcer Build',0,'Alt Judge Enforcer Needed?'],['Alt Judge Enforcer Needed?',0,'Alt Judge Enforcer Call deepseek'],['Alt Judge Enforcer Needed?',1,'Alt Judge Enforcer Record'],['Alt Judge Enforcer Call deepseek',0,'Alt Judge Enforcer Record'],
  ['Alt Judge Enforcer Record',0,'Alt Send Back Build'],['Alt Send Back Build',0,'Alt Send Back Needed?'],['Alt Send Back Needed?',0,'Alt Send Back Call openrouter'],['Alt Send Back Needed?',1,'Alt Send Back Record'],['Alt Send Back Call openrouter',0,'Alt Send Back Record'],
  ['Alt Send Back Record',0,'Alt Gate Build'],['Alt Gate Build',0,'Alt Gate Needed?'],['Alt Gate Needed?',0,'Alt Gate Call openrouter'],['Alt Gate Needed?',1,'Alt Gate Record'],['Alt Gate Call openrouter',0,'Alt Gate Record'],['Alt Gate Record',0,'Alternate Merge'],['Alternate Merge',0,'Dry?']],
 'code_updates':{'Gate Build':O+'/Gate_Build.js','Gate Record':O+'/Gate_Record.js'},
 'note':'apply after pkgGATE rev 2 and pkgTG. Nodes after Dry? read $(\'Alternate Merge\') by name and now read the Alt Apply node.'}
json.dump({'nodes':seq,'connections':conn,'substitutions':{'names':MAP,'literals':LIT}},open('pkgALT/nodes_ALT.json','w'),indent=1)
json.dump(plan,open('pkgALT/plan_ALT.json','w'),indent=1)
print(len(plan['files']),'files;',len(seq),'new nodes')
