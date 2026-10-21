# BB-6904, write step (ruled BB-7022 item 4): compose ONE flow draft from the verified builds. Writes nothing to n8n.
# Every source is read from a git commit (git show), so the composition can be rebuilt after this container is gone.
# Structure (new nodes, connections, named-read edits) comes from p4 ops.json then p7 ops7.json, applied in that order on the live
# version. Code comes from exactly one source per node (SRC below). The script fails when:
#   - a node is named by two SRC entries;
#   - a SRC node does not exist after the structure is applied, or is not a Code node;
#   - a code file in a source folder is neither used nor listed in NOT_USED with its reason;
#   - p7's code in ops7.json (a new node or an edit) differs from the same node's file in p7/out;
#   - any $('Name') in any Code node, or any connection, names a node that does not exist;
#   - the live file is not version db281705.
#   - a node this draft writes carries a backslash-u escape outside its DRV_SRC line (step 3b, delivered bytes).
# Usage: python3 compose.py <live workflow details json (db281705)> <repo root> <out dir>
import json,sys,os,hashlib,subprocess,copy,re
fail=[]
md5=lambda s:hashlib.md5((s if s.endswith('\n') else s+'\n').encode()).hexdigest()[:8]
LIVE,REPO,OUT=sys.argv[1:4];os.makedirs(OUT,exist_ok=True)
def show(rev,path):return subprocess.run(['git','-C',REPO,'show',rev+':'+path],capture_output=True,text=True,check=True).stdout
def ls(rev,folder):return [l for l in subprocess.run(['git','-C',REPO,'ls-tree','--name-only',rev,folder+'/'],capture_output=True,text=True,check=True).stdout.split('\n') if l]
err=lambda m:fail.append(m)
P='prototypes/bb6904/'
E_REV='404300a' # Worker_E's builds p2, p4, p5b, p7, pinned (BB-7024 AMEND 1): the last commit that changed any of them
REVS={'p2':E_REV,'p3':'0b3cbac','p4':E_REV,'p5b':E_REV,'p6':'d0d5aab','p7':E_REV}
# Pinned and clean (BB-7025 item 2a): every source is a commit id (never a branch or HEAD) that resolves; and where a source folder
# exists in this checkout, its files must equal the pinned commit's (a folder edited after pinning fails until re-pinned).
for tag,rev in REVS.items():
 if not re.fullmatch(r'[0-9a-f]{7,40}',rev):fail.append('source %s is not pinned to a commit id: %s'%(tag,rev));continue
 if subprocess.run(['git','-C',REPO,'rev-parse','--verify','-q',rev+'^{commit}'],capture_output=True).returncode:fail.append('source %s: commit %s not found'%(tag,rev));continue
 if os.path.isdir(os.path.join(REPO,P+tag)):
  d=subprocess.run(['git','-C',REPO,'status','--porcelain','--',P+tag],capture_output=True,text=True).stdout.strip()
  c=subprocess.run(['git','-C',REPO,'diff','--quiet',rev,'--',P+tag],capture_output=True).returncode
  if d or c:fail.append('source %s: the checkout differs from the pinned commit %s (dirty or changed since); re-pin or restore'%(tag,rev))
# The one source of each changed Code node.
SRC=[
 ('Build Independent Verdict',('p2','p2/Build_Independent_Verdict.new.js')),
 ('Panel Build',('p2','p2/Panel_Build.new.js')),
 ('Extract Independent Verdict',('p3','p3/Extract_Independent_Verdict.new.js')),
 ('Panel Payloads',('p5b','p5b/out/Panel_Payloads.js')),
 ('Failure Salvage',('p5b','p5b/out/Failure_Salvage.js')),
 ('Build Save Body',('p6','p6/out/Build_Save_Body.js')),
 ('Panel Tokens',('p6','p6/out/Panel_Tokens.js')),
 ('Cure Build',('p6','p6/out/Cure_Build.js')),('Cure Normalize',('p6','p6/out/Cure_Normalize.js')),('Cure Check',('p6','p6/out/Cure_Check.js')),
 ('Panel Cure Check',('p6','p6/out/Panel_Cure_Check.js')),
 ('Init Seats',('p7','p7/out/Init_Seats.js')),('Resolve Seats',('p7','p7/out/Resolve_Seats.js')),
 ('Format Markdown',('p7','p7/out/Format_Markdown.js')),('Panel Done',('p7','p7/out/Panel_Done.js')),
 ('Alternate Build',('p7','p7/out/Alternate_Build.js')),('Alternate Payloads',('p7','p7/out/Alternate_Payloads.js')),
 ('Alternate Cure Build',('p7','p7/out/Alternate_Cure_Build.js')),('Alternate Cure Normalize',('p7','p7/out/Alternate_Cure_Normalize.js')),
 ('Alternate Merge',('p7','p7/out/Alternate_Merge.js')),
]
for k in (1,2,3):
 SRC+=[('Panel Cure Build %d'%k,('p6','p6/out/Panel_Cure_Build_%d.js'%k)),('Panel Cure Normalize %d'%k,('p6','p6/out/Panel_Cure_Normalize_%d.js'%k))]
# Code files present in a source folder and deliberately not used, each with its reason.
NOT_USED={
 'p3/Panel_Payloads.new.js':'5B builds Panel Payloads on it (p5b/out/Panel_Payloads.js is used)',
 'p4/Cure_Build.js':'step 6 rev 4 patches it (p6/out)','p4/Cure_Normalize.js':'step 6 rev 4 patches it (p6/out)','p4/Cure_Check.js':'step 6 rev 4 patches it (p6/out)',
 'p4/Panel_Cure_Check.js':'5B and step 6 rev 4 patch it; rev 4 carries both (BB-7021)',
 'p4/cure_lib.js':'library, embedded in the cure nodes; not a node','p4/drv_block_0b3cbac.js':'library, embedded; not a node',
 'p5b/out/Panel_Cure_Check.js':'step 6 rev 4 is built on it and carries both changes (BB-7021)',
 'p6/out/Format_Markdown.js':'p7 builds Format Markdown on it (p7/out/Format_Markdown.js is used)',
 'p6/out/cure_lib.js':'library, embedded; not a node',
 'p3/drv_block.js':'library (portion 3 check block), embedded in the extractor nodes; not a node',
 'p3/drv_check.js':'library (portion 3 checker for the harnesses); not a node',
}
for k in (1,2,3):
 NOT_USED['p4/Panel_Cure_Build_%d.js'%k]='step 6 rev 4 patches it (p6/out)';NOT_USED['p4/Panel_Cure_Normalize_%d.js'%k]='step 6 rev 4 patches it (p6/out)'
# 1. Live base.
w=json.load(open(LIVE))['workflow']
if not str(w.get('versionId','')).startswith('db281705'):err('live file is version %s, not db281705'%w.get('versionId'))
live={n['name']:n for n in w['nodes']}
nodes={n['name']:copy.deepcopy(n) for n in w['nodes']};C=copy.deepcopy(w['connections'])
claims={}
def add_edge(e):
 C.setdefault(e['from'],{}).setdefault('main',[]);m=C[e['from']]['main']
 while len(m)<=e['out']:m.append([])
 m[e['out']].append({'node':e['to'],'type':'main','index':0})
def rm_edge(e):
 m=C.get(e['from'],{}).get('main',[]);l=m[e['out']] if e['out']<len(m) else []
 k=[x for x in l if x['node']==e['to']]
 if len(k)!=1:err('connection to remove not found once: %s'%e)
 else:l.remove(k[0])
# 2. Structure: p4 then p7.
for tag,path in (('p4','p4/ops.json'),('p7','p7/out/ops7.json')):
 ops=json.loads(show(REVS[tag],P+path))
 for n in ops['nodes_add']:
  if n['name'] in nodes:err('%s adds %s, which exists'%(tag,n['name']))
  nodes[n['name']]=copy.deepcopy(n);claims.setdefault(n['name'],[]).append(tag+' add')
 for e in ops['connections_remove']:rm_edge(e)
 for e in ops['connections_add']:add_edge(e)
 for e in ops['edits']:
  if e['node'] not in nodes:err('%s edits missing node %s'%(tag,e['node']));continue
  nodes[e['node']]['parameters']=copy.deepcopy(e['parameters']);claims.setdefault(e['node'],[]).append(tag+' edit')
# Nodes edited by both p4 and p7 (BB-7024 AMEND 2): p7's edit replaces the whole parameter set. Every leaf p4 changed must hold p4's
# value in p7, or p4's value after the one declared supersession (p7 moves p4's named read on from Panel Cure Check to Alternate
# Merge), or be listed in SUPERSEDED with its reason, where the named-read counts are still checked.
SUP=("$('Panel Cure Check')","$('Alternate Merge')")
SUPERSEDED={('Panel Done','jsCode'):'p7 adds its Record Alternates check (PD_ADD) on top of p4\'s moved read'}
def leaves(x,pre=()):
 if isinstance(x,dict):
  for k,v in x.items():yield from leaves(v,pre+(k,))
 elif isinstance(x,list):
  for i,v in enumerate(x):yield from leaves(v,pre+(i,))
 else:yield pre,x
o4=json.loads(show(REVS['p4'],P+'p4/ops.json'));o7e={e['node']:e for e in json.loads(show(REVS['p7'],P+'p7/out/ops7.json'))['edits']}
both=[e for e in o4['edits'] if e['node'] in o7e]
for e4 in both:
 n=e4['node'];L=dict(leaves(live[n]['parameters']));A=dict(leaves(e4['parameters']));B=dict(leaves(o7e[n]['parameters']))
 for k,v in A.items():
  if L.get(k)==v:continue
  b=B.get(k);key=(n,k[-1] if k else '')
  if b==v or (isinstance(v,str) and b==v.replace(*SUP)):continue
  if key in SUPERSEDED and isinstance(v,str) and isinstance(b,str):
   if b.count(SUP[1])>=v.count(SUP[0]) and b.count(e4['old'])==v.count(e4['old']):continue
   err('%s %s: superseded leaf lost p4\'s moved read'%(n,'/'.join(map(str,k))));continue
  err('%s %s: p4 changed it and p7 neither keeps nor supersedes it'%(n,'/'.join(map(str,k))))
print('edited by both p4 and p7: %d nodes, every p4 change kept or superseded as declared'%len(both) if not fail else 'edited by both: see FAIL')
ops7=json.loads(show(REVS['p7'],P+'p7/out/ops7.json'));o7code={n['name']:n['parameters'].get('jsCode') for n in ops7['nodes_add']}
o7code.update({e['node']:e['parameters'].get('jsCode') for e in ops7['edits'] if e['parameters'].get('jsCode') is not None})
# 3. Code: one source per node.
used=set()
for name,(tag,path) in SRC:
 if name not in nodes:err('SRC node %s does not exist'%name);continue
 if nodes[name]['type']!='n8n-nodes-base.code':err('SRC node %s is not a Code node'%name);continue
 code=show(REVS[tag],P+path);used.add(path)
 if name in o7code and o7code[name]!=code:err('ops7 code for %s differs from %s'%(name,path))
 nodes[name]['parameters']['jsCode']=code;claims.setdefault(name,[]).append('code '+tag+':'+path)
names=[k for k,_ in SRC];dup=[k for k in set(names) if names.count(k)>1]
if dup:err('nodes named twice in SRC: %s'%dup)
# 3b. Delivered bytes (BB-7043 option 1, ruled in Worker_E's thread 2026-10-20): the n8n update tool decodes a backslash-u escape into
# its character (BB-4530; measured again at act 3 batch 3), so a node sent with one cannot be read back byte-exact. The reviewed escapes
# sit only on the DRV_SRC line; there they are written as the characters the tool delivers. An escape on any other line of a node this
# draft writes fails the run. Behaviour of the changed line is checked separately (delivered_check.cjs).
ESC=re.compile(r'(?<!\\)\\u([0-9a-fA-F]{4})')
def deliver(name,code):
 out=[]
 for line in code.split('\n'):
  if ESC.search(line):
   if not line.startswith('const DRV_SRC='):err('%s: backslash-u escape outside the DRV_SRC line: %s'%(name,line[:60]))
   else:line=ESC.sub(lambda m:chr(int(m.group(1),16)),line)
  out.append(line)
 return '\n'.join(out)
for name,n in nodes.items():
 if n['type']!='n8n-nodes-base.code' or not isinstance(n['parameters'].get('jsCode'),str):continue
 if name in live and live[name]['parameters']==n['parameters']:continue
 c0=n['parameters']['jsCode'];c1=deliver(name,c0)
 if c1!=c0:n['parameters']['jsCode']=c1;claims.setdefault(name,[]).append('delivered bytes')
# 4. Every code file accounted for.
for tag in ('p2','p3','p4','p5b','p6','p7'):
 folder={'p5b':'p5b/out','p6':'p6/out','p7':'p7/out'}.get(tag,tag)
 for f in ls(REVS[tag],P+folder):
  rel=f[len(P):]
  if f.endswith('.js') and rel not in used and rel not in NOT_USED:err('code file neither used nor listed: %s@%s'%(rel,REVS[tag]))
# 5. References.
names_all=set(nodes)
for n in nodes.values():
 for ref in re.findall(r"\$\('([^']+)'\)",json.dumps(n['parameters'])):
  if ref not in names_all:err('%s reads missing node %s'%(n['name'],ref))
for a,v in C.items():
 if a not in names_all:err('connection from missing node %s'%a)
 for outs in v.get('main',[]):
  for x in outs or []:
   if x['node'] not in names_all:err('connection %s -> missing node %s'%(a,x['node']))
# 6. Report.
rows=[]
for name in sorted(nodes):
 n=nodes[name];cur=json.dumps(n['parameters'],sort_keys=True);old=json.dumps(live[name]['parameters'],sort_keys=True) if name in live else None
 if old==cur:continue
 src='; '.join(claims.get(name,['?']))
 h=md5(n['parameters']['jsCode']) if n['type']=='n8n-nodes-base.code' else md5(cur)
 rows.append('%-34s %-8s %s  %s'%(name,'new' if name not in live else 'changed',h,src))
print('base %s | nodes %d (live %d) | changed or new %d | unchanged %d'%(w.get('versionId'),len(nodes),len(live),len(rows),len(nodes)-len(rows)))
print('sources: '+', '.join('%s@%s'%(k,v) for k,v in REVS.items()))
for r in rows:print('  '+r)
out={'name':w.get('name'),'nodes':list(nodes.values()),'connections':C,'settings':w.get('settings'),'base_version':w.get('versionId'),'sources':REVS}
open(os.path.join(OUT,'composed.json'),'w').write(json.dumps(out,indent=1,ensure_ascii=False))
open(os.path.join(OUT,'MANIFEST.txt'),'w').write('\n'.join(rows)+'\n')
if fail:
 print('FAILED %d'%len(fail));[print('  FAIL '+m) for m in fail];sys.exit(1)
print('OK: every changed node has one source; every code file accounted for; every reference and connection resolves')
