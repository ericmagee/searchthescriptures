#!/usr/bin/env python3
"""ASK 419 run-start check (W4). Run before every run start; it changes nothing. Exit 0 = GO, exit 1 = REFUSED (every failed item is listed).
usage: python3 runstart.py --engine <versionId> --child <versionId> --body <body.json> [--body-sha <sha256 prefix>]
         [--files <engine.json> <child.json>] [--running <executions.json>] [--no385]
Checks:
 0. LIVE GUARDS: when anything is read live (no --files, or no --running), --body-sha is required and --no385 is refused (W2 8923 C2).
 1. NOTHING RUNNING: no execution with status running or new (queued, not started) in any workflow, and none waiting in the debate's own workflows (engine, child,
    Early Alternate SX4ZWtgHNs96uBOo, Cure Call c7366RPLb8vdMQg6). Waiting executions of other workflows are listed, not refused
    (two of "Post a Directive" have waited since 2026-08-18 until the year 3000).
 2. VERSIONS: the live engine and child versionIds equal the ones given (the readback-matched versions of the last write), and each is active
    and published (activeVersionId equals versionId).
 3. LIBRARY (ASK 422(a) item 8): lib_sha of the engine and the child bodies are equal, and each equals the sha its own header names.
    map_sha (ASK 422(a) rev 3 item 10-11) of the engine and the child are equal: the child's MAP keys sorted, the engine's less MAPEXTRA ['REFP'],
    which the engine must hold; a changed shared entry, a child key missing from the engine, or an unlisted engine-only key differs.
 4. ONE COPY (ASK 385): a385/reg385.cjs passes on the live pair (skipped with --no385, which is printed).
 5. BODY: the body file parses; it has defender {engine, profile}, challenger {engine, profile} and a non-empty topic, and no other key;
    which seats may debate is the start webhook's own check, not repeated here; with --body-sha, the file's sha256 starts with the given prefix (the released body).
--files and --running read saved fetches instead of the live API (offline proof)."""
import json,os,sys,hashlib,re,subprocess,urllib.request,tempfile
A=sys.argv;arg=lambda k:A[A.index(k)+1] if k in A else None
API='https://truthapp.app.n8n.cloud/api/v1/';WF={'engine':'moMxiV4Irg1uRBZN','child':'MqQHRl7mQQ0z8QdT'}
def get(p):
  r=urllib.request.Request(API+p,headers={'X-N8N-API-KEY':os.environ['N8N_API_KEY'],'Accept':'application/json'});return json.load(urllib.request.urlopen(r,timeout=180))
def un(w): return w.get('data',w) if isinstance(w,dict) else w
def libsha(w):
  c=[n for n in w['nodes'] if n['name']=='Shared Library'][0]['parameters']['jsCode'];a=c.index('\n/*LIB*/')+8;b=c.index('\n/*MAP*/')
  s=hashlib.sha256(json.dumps(json.loads(c[a:b]),ensure_ascii=False,separators=(',',':')).encode('utf-8')).hexdigest()[:16]
  h=re.search(r'library sha ([0-9a-f]{16})',c[:a]);return s,(h.group(1) if h else None)
MAPEXTRA=['REFP']
def mapsha(w,side):
  c=[n for n in w['nodes'] if n['name']=='Shared Library'][0]['parameters']['jsCode'];M=json.loads(c[c.rindex('\n/*MAP*/')+8:c.rindex('\n/*END*/')]);k=list(M)
  if side=='engine':
    if not all(x in k for x in MAPEXTRA): return None
    k=[x for x in k if x not in MAPEXTRA]
  return hashlib.sha256(json.dumps([[x,M[x]] for x in sorted(k)],ensure_ascii=False,separators=(',',':')).encode('utf-8')).hexdigest()[:16]
bad=[];ok=[]
def chk(cond,good,fail): (ok if cond else bad).append(good if cond else fail)
want={'engine':arg('--engine'),'child':arg('--child')};body=arg('--body')
if not want['engine'] or not want['child'] or not body: sys.exit(__doc__)
LIVE=('--files' not in A) or ('--running' not in A)
if LIVE and not arg('--body-sha'): print('FAIL  0 LIVE: --body-sha is required (the released body)');print('REFUSED (1)');sys.exit(1)
if LIVE and '--no385' in A: print('FAIL  0 LIVE: --no385 is not allowed when reading live');print('REFUSED (1)');sys.exit(1)
# 1 nothing running
OWN={'moMxiV4Irg1uRBZN','MqQHRl7mQQ0z8QdT','SX4ZWtgHNs96uBOo','c7366RPLb8vdMQg6'}
if '--running' in A: R0=json.load(open(arg('--running')))
else: R0=[x for st in ('running','new','waiting') for x in get('executions?status=%s&limit=250'%st)['data']]
R=[x for x in R0 if x.get('status')!='waiting' or x.get('workflowId') in OWN];IGN=[x for x in R0 if x not in R]
chk(not R,'1 nothing running','1 RUNNING: '+', '.join('%s (%s, workflow %s)'%(x.get('id'),x.get('status'),x.get('workflowId')) for x in R[:20]))
if IGN: ok.append('1 waiting in other workflows, not refused: '+', '.join('%s (workflow %s)'%(x.get('id'),x.get('workflowId')) for x in IGN[:20]))
# 2 versions
if '--files' in A: i=A.index('--files');W={'engine':un(json.load(open(A[i+1]))),'child':un(json.load(open(A[i+2])))}
else: W={k:get('workflows/'+WF[k]) for k in WF}
for k in WF:
  w=W[k];v=w.get('versionId')
  chk(v==want[k],'2 %s version %s'%(k,v),'2 %s VERSION %s is not the expected %s'%(k,v,want[k]))
  chk(bool(w.get('active')) and w.get('activeVersionId')==v,'2 %s active and published'%k,'2 %s NOT PUBLISHED (active %s, activeVersionId %s)'%(k,w.get('active'),w.get('activeVersionId')))
# 3 library
S={}
for k in WF:
  try: S[k]=libsha(W[k])
  except Exception as e: S[k]=('unreadable','?');bad.append('3 %s LIBRARY UNREADABLE: %s'%(k,str(e)[:100]))
chk(S['engine'][0]==S['child'][0],'3 library sha equal %s'%S['engine'][0],'3 LIBRARY DIFFERS: engine %s, child %s'%(S['engine'][0],S['child'][0]))
for k in WF: chk(S[k][0]==S[k][1],'3 %s header names its sha'%k,'3 %s HEADER names %s, body is %s'%(k,S[k][1],S[k][0]))
MS={}
for k in WF:
  try: MS[k]=mapsha(W[k],k)
  except Exception as e: MS[k]='unreadable';bad.append('3 %s MAP UNREADABLE: %s'%(k,str(e)[:100]))
chk(MS['engine'] is not None and MS['engine']==MS['child'],'3 map_sha equal %s'%MS['engine'],'3 MAP DIFFERS: engine %s, child %s'%(MS['engine'] or 'none (an engine-only listed key is missing)',MS['child']))
# 4 one copy
if '--no385' in A: ok.append('4 ASK 385 check SKIPPED (--no385)')
else:
  d=tempfile.mkdtemp();fe,fc=os.path.join(d,'engine.json'),os.path.join(d,'child.json');json.dump(W['engine'],open(fe,'w'));json.dump(W['child'],open(fc,'w'))
  here=os.path.dirname(os.path.abspath(__file__));reg=[p for p in (os.path.join(here,'../a385/reg385.cjs'),os.path.join(here,'../a385_w4/reg385.cjs')) if os.path.exists(p)]
  rc=subprocess.call(['node',reg[0],fe,fc],stdout=subprocess.DEVNULL) if reg else 2
  chk(rc==0,'4 ASK 385 check PASS','4 ASK 385 CHECK '+('NOT FOUND' if not reg else 'FAILED'))
# 5 body
raw=open(body,'rb').read();sha=hashlib.sha256(raw).hexdigest()
try: B=json.loads(raw)
except Exception as e: B=None;bad.append('5 BODY does not parse: %s'%str(e)[:80])
if B is not None:
  side=lambda s:isinstance(B.get(s),dict) and isinstance(B[s].get('engine'),str) and B[s]['engine'] and isinstance(B[s].get('profile'),str) and B[s]['profile'] and set(B[s])<={'engine','profile'}
  chk(isinstance(B,dict) and set(B)=={'defender','challenger','topic'},'5 body keys','5 BODY KEYS %s, expected defender, challenger, topic'%(sorted(B) if isinstance(B,dict) else type(B).__name__))
  if isinstance(B,dict):
    for s in ('defender','challenger'): chk(side(s),'5 %s %s/%s'%(s,(B.get(s) or {}).get('engine'),(B.get(s) or {}).get('profile')),'5 BODY %s must be {engine, profile}: %s'%(s,json.dumps(B.get(s))[:120]))
    chk(isinstance(B.get('topic'),str) and B['topic'].strip()!='','5 topic "%s"'%str(B.get('topic'))[:80],'5 BODY TOPIC empty or missing')
if arg('--body-sha'): chk(sha.startswith(arg('--body-sha')),'5 body sha256 %s matches the released prefix'%sha[:12],'5 BODY SHA %s does not match the released %s'%(sha[:12],arg('--body-sha')))
else: ok.append('5 body sha256 %s (name it in the release)'%sha[:12])
for x in ok: print('ok   ',x)
for x in bad: print('FAIL ',x)
print('REFUSED (%d)'%len(bad) if bad else 'GO');sys.exit(1 if bad else 0)
