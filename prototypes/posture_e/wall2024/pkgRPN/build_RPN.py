# pkgRPN (list WALL-3627 item 3, operator "all approve" 16:27Z 11-09): remove the 112 direct provider call nodes (openai, gemini, grok, mimo).
# Every seat's family is openrouter or deepseek (Init Seats ENG, Resolve Seats JFAM, alternates fixed openrouter; direct Anthropic path kept).
# Switch outputs that led to a removed node now lead to one Code node "Provider Removed Stop", which fails the run closed if ever reached.
# Run from wall2024/: python3 pkgRPN/build_RPN.py <fetchback s78> ; writes pkgLIB/strip_RPN (library sources) and pkgRPN/nonlib/<node>.js
import json,re,os,shutil,sys,hashlib
FB=sys.argv[1]
W=json.load(open(FB));N={n['name']:n for n in W['nodes']}
R=sorted(n['name'] for n in W['nodes'] if re.search(r' (openai|gemini|grok|mimo)$',n['name']))
assert len(R)==112,len(R)
assert all(N[r]['type'] in ('n8n-nodes-base.httpRequest','n8n-nodes-base.code') for r in R)
def T(s):
    for r in R:
        e=re.escape(r)
        s=re.sub(r'"'+e+r'":\(\)=>\$\(\''+e+r'\'\),','',s)
        s=re.sub(r',"'+e+r'":\(\)=>\$\(\''+e+r'\'\)','',s)
        s=s.replace('$("'+r+'");','')
        s=re.sub(r"'"+e+r"',",'',s); s=re.sub(r",'"+e+r"'",'',s)
        s=re.sub(r'"'+e+r'",\s?','',s); s=re.sub(r',\s?"'+e+r'"','',s)
    return s
def left(s): return [r for r in R if r in s]
# library sources
src='pkgLIB/strip_FUM';dst='pkgLIB/strip_RPN'
shutil.rmtree(dst,ignore_errors=True);shutil.copytree(src,dst)
ch=[]
for f in sorted(os.listdir(dst+'/patched')):
    p=dst+'/patched/'+f;s0=open(p).read();s=T(s0)
    assert not left(s),(f,left(s)[:3])
    if s!=s0: open(p,'w').write(s);ch.append(f)
print('library sources changed:',ch)
# non-library nodes
os.makedirs('pkgRPN/nonlib',exist_ok=True);nl=[]
LIBN=set(f[:-3].replace('_',' ') for f in os.listdir(dst+'/patched'))|{'Shared Library'}
for n in W['nodes']:
    if n['name'] in R or n['name'] in LIBN: continue
    t=json.dumps(n['parameters'])
    if not left(t): continue
    assert n['type']=='n8n-nodes-base.code',n['name']
    s=T(n['parameters']['jsCode']);assert not left(s),(n['name'],left(s)[:3])
    open('pkgRPN/nonlib/'+n['name'].replace(' ','_')+'.js','w').write(s);nl.append(n['name'])
print('non-library nodes changed:',nl)
json.dump({'removed':R,'library_changed':ch,'nonlib_changed':nl,'fetchback':FB,'fetchback_version':W['versionId']},open('pkgRPN/plan_RPN.json','w'),indent=1)
