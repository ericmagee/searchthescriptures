#!/usr/bin/env python3
# Post-write readback (W2). Reads fetch-back files on disk only; no n8n call.
# Usage: python3 readback.py <spec.json>
# spec: {ask, fetch:{engine,child}, target:{engine,child}, base:{engine,child}, nodes:{engine:[...],child:[...]}, lib_idx:[...], lib_sha, map_n_changed:{engine:n,child:n}}
# Lines printed: PASS/FAIL per check; last line READBACK MATCH or READBACK MISMATCH.
import json,sys,hashlib,subprocess
sys.path.insert(0,'/mnt/project-files/ask516/w4/b')
S=json.load(open(sys.argv[1]));R=[]
md5=lambda p:hashlib.md5(open(p,'rb').read()).hexdigest()[:8]
def chk(ok,msg):R.append(ok);print(('PASS ' if ok else 'FAIL ')+msg)
def J(p):return json.load(open(p))
def canon(n):return json.dumps({k:n.get(k) for k in ('name','type','typeVersion','parameters','credentials','disabled')},sort_keys=True)
def nodes(w):return {n['name']:canon(n) for n in w['nodes']}
def lib(w):
  T=[n for n in w['nodes'] if n['name']=='Shared Library'][0]['parameters']['jsCode']
  a=T.index('\n/*LIB*/')+8;b=T.rindex('\n/*MAP*/');c=b+8;e=T.rindex('\n/*END*/')
  import re;h=re.search(r'library sha ([0-9a-f]{16})',T)
  return json.loads(T[a:b]),json.loads(T[c:e]),(h.group(1) if h else None)
print('ASK',S['ask'],'readback; files:',{k:md5(v) for g in ('fetch','target','base') for k,v in [(g+'_'+x,S[g][x]) for x in ('engine','child')]})
for k in ('engine','child'):
  F,T,B=J(S['fetch'][k]),J(S['target'][k]),J(S['base'][k])
  nf,nt,nb=nodes(F),nodes(T),nodes(B)
  # 1. fetch-back equals target, node by node, and connections
  dif=[n for n in set(nf)|set(nt) if nf.get(n)!=nt.get(n)]
  chk(not dif,f'{k}: fetch-back equals target on every node ({len(nf)} nodes)'+(f'; differ: {sorted(dif)}' if dif else ''))
  chk(json.dumps(F.get('connections'),sort_keys=True)==json.dumps(T.get('connections'),sort_keys=True),f'{k}: connections equal target')
  if 'settings' in T and 'settings' in F: chk(json.dumps(F['settings'],sort_keys=True)==json.dumps(T['settings'],sort_keys=True),f'{k}: settings equal target')
  # 2. node-by-node diff against the pre-write base: only the named nodes changed
  ch=sorted(n for n in set(nf)|set(nb) if nf.get(n)!=nb.get(n))
  chk(ch==sorted(S['nodes'][k]),f'{k}: nodes changed from base {ch}, expected {sorted(S["nodes"][k])}')
  chk(json.dumps(F.get('connections'),sort_keys=True)==json.dumps(B.get('connections'),sort_keys=True),f'{k}: connections equal base')
  chk(F.get('versionId')!=B.get('versionId'),f'{k}: versionId moved {B.get("versionId")} -> {F.get("versionId")}')
  # 3. Library: changed indexes, MAP p/keys, n count, header sha
  Lf,Mf,hf=lib(F);Lb,Mb,hb=lib(B)
  idx=[i for i in range(max(len(Lf),len(Lb))) if (Lf[i] if i<len(Lf) else None)!=(Lb[i] if i<len(Lb) else None)]
  chk(idx==sorted(S['lib_idx']),f'{k}: Library indexes changed {idx}, expected {sorted(S["lib_idx"])}')
  chk(set(Mf)==set(Mb) and all(Mf[x]['p']==Mb[x]['p'] for x in Mf),f'{k}: MAP keys and p equal base')
  nn=sum(1 for x in Mf if Mf[x]['n']!=Mb[x]['n']);chk(nn==S['map_n_changed'][k],f'{k}: MAP n changed {nn}, expected {S["map_n_changed"][k]}')
  chk(hf==S['lib_sha'],f'{k}: header sha {hb} -> {hf}, expected {S["lib_sha"]}')
  r=subprocess.run(['node','/mnt/project-files/ask519/w4/libcheck/runcheck.js',S['fetch'][k]],capture_output=True,text=True)
  chk(r.returncode==0 and ' OK ' in r.stdout+' ',f'{k}: runcheck: {(r.stdout+r.stderr).strip()[:160]}')
LE,_,_=lib(J(S['fetch']['engine']));LC,_,_=lib(J(S['fetch']['child']));chk(LE==LC,'engine and child Library text equal')
r=subprocess.run(['node','/mnt/project-files/ask539/w4/build/test539.js','--pair',S['fetch']['engine'],S['fetch']['child']],capture_output=True,text=True)
chk('PASSES' in r.stdout,'Library Check pair: '+r.stdout.strip().split('\n')[-1][-160:])
for c in S.get('extra',[]):
  r=subprocess.run(c['cmd'],shell=True,capture_output=True,text=True);chk(c['expect'] in r.stdout,c['name']+': '+r.stdout.strip()[-200:])
print('READBACK MATCH' if all(R) else 'READBACK MISMATCH ('+str(R.count(False))+' fail)')
