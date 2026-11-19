#!/usr/bin/env python3
"""ASK 476 (W3): one Shared Library copy. The engine sends its library text to the child in the pass (lib); the child's 13 library stubs and
Library Check read pass.lib from Alternate Pass In; the child's Shared Library node is removed. Library Check proves the text it received is the
engine's (lib sha and map sha both equal to what the engine computed) and strips lib from the items it passes on, so the 1 MB text is stored once
per child call (in the trigger's output). Every edit is an exact pattern with an expected count; any count off REFUSES.
usage: python3 build476.py ENGINE.json CHILD.json OUT_ENGINE.json OUT_CHILD.json"""
import json,sys,hashlib
EI,CI,EO,CO=sys.argv[1:5]
def ld(f):
  w=json.load(open(f));return w.get('data',w) if isinstance(w.get('data'),dict) and 'nodes' in w.get('data',{}) else w
E=ld(EI);C=ld(CI)
def one(t,o,n,who):
  k=t.count(o)
  if k!=1: raise SystemExit('REFUSE '+who+': pattern occurs '+str(k)+' times: '+o[:80])
  return t.replace(o,n)
# engine: Alternate Pass Call sends lib
EN={n['name']:n for n in E['nodes']}
a=EN['Alternate Pass Call']['parameters']['workflowInputs']['value']
a['pass']=one(a['pass'],'parent_exec: $execution.id, ','parent_exec: $execution.id, lib: $("Shared Library").params.jsCode, ','Alternate Pass Call')
# child: the stubs
CN={n['name']:n for n in C['nodes']}
OLD="const __LT=$('Shared Library').params.jsCode;";NEW="const __LT=$('Alternate Pass In').first().json.pass.lib;if(typeof __LT!=='string')throw new Error('pkgLIB1: the pass holds no library text');"
st=[]
for n in C['nodes']:
  j=n['parameters'].get('jsCode')
  if not isinstance(j,str) or n['name'] in ('Shared Library','Library Check (ASK 422a)'):continue
  if OLD in j:n['parameters']['jsCode']=one(j,OLD,NEW,n['name']);st.append(n['name'])
if len(st)!=13: raise SystemExit('REFUSE: expected 13 child stubs, got '+str(len(st)))
# child: Library Check
lc=CN['Library Check (ASK 422a)']['parameters']
j=lc['jsCode']
j=one(j,"const __lc=$('Shared Library').params.jsCode;const __own=__LIBSHA422(__lc),__ownm=__MAPSHA422(__lc,'child');",
 "const __lc=typeof __p.lib==='string'?__p.lib:'';const __own=__LIBSHA422(__lc),__ownm=__MAPSHA422(__lc,'engine');",'Library Check')
j=one(j,"return __it.map((i,k)=>({json:{...i.json,lib422:{engine:__eng,child:__own,engine_map:__engm,child_map:__ownm,same:true}},pairedItem:{item:k}}));",
 "return __it.map((i,k)=>{const {lib:__x,...__ps}=(i.json&&i.json.pass)||{};return {json:{...i.json,pass:__ps,lib422:{engine:__eng,child:__own,engine_map:__engm,child_map:__ownm,same:true,received:__lc.length}},pairedItem:{item:k}};});",'Library Check')
lc['jsCode']=j
# child: remove the Shared Library node
if sum(1 for n in C['nodes'] if n['name']=='Shared Library')!=1: raise SystemExit('REFUSE: child Shared Library node count')
if any('Shared Library' in json.dumps(v) for v in C['connections'].values()) or 'Shared Library' in C['connections']: raise SystemExit('REFUSE: child Shared Library is wired')
C['nodes']=[n for n in C['nodes'] if n['name']!='Shared Library']
left=[n['name'] for n in C['nodes'] if "$('Shared Library')" in json.dumps(n['parameters']) or '$(\\"Shared Library\\")' in json.dumps(n['parameters'])]
if left: raise SystemExit('REFUSE: child nodes still name Shared Library: '+str(left))
for f,w in ((EO,E),(CO,C)):
  s=json.dumps(w,ensure_ascii=False);open(f,'w').write(s);print(f,'md5',hashlib.md5(s.encode()).hexdigest())
print('engine: Alternate Pass Call sends lib | child stubs',len(st),'| Library Check reads pass.lib | child nodes',len(C['nodes']))
