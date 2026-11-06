# Package C (operator ruling 2026-11-05 18:05 CST): the three DeepSeek enforcer calls get PART2 (post-A, with Commitment 10) as reference
# text, appended to their system message under its own label. Built from a live fetch (argv[1]) and pkgA's patched Accept Check. Writes nothing live.
import json,sys,hashlib,subprocess,os
D=os.path.dirname(os.path.abspath(__file__))
live=json.load(open(sys.argv[1]))['workflow']
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
src=open(os.path.join(D,'..','pkgA','patched','Accept_Check.js')).read()
i=src.index('const PART2="')+len('const PART2=');j=src.index('";\n',i)+1;P2LIT=src[i:j]   # the double-quoted JS literal, post-A
JA="const __JAGR='\\n\\nTHE JUDGES\\' AGREEMENT (what you enforce; not your posture). The judges whose lines you check accepted the text below before the debate was judged. It binds them; it does not make you a judge, and the instruction above stands.\\n\\n'+"+P2LIT+"; // package C (operator 2026-11-05 18:05 CST: the enforcer needs to know what to enforce on that judge)\n"
OLD="messages:[{role:'system',content:SYS},"; NEW="messages:[{role:'system',content:SYS+__JAGR},"
plan={'live_version':live['versionId'],'part2_literal_sha':sha(P2LIT),'nodes':[]};bad=[]
for n in live['nodes']:
    if n['name'] not in ('Enforcer Build','Judge Enforcer Build','Anticheat Build'):continue
    c=n['parameters']['jsCode']
    if c.count(OLD)!=1 or '__JAGR' in c: bad.append(n['name']+' anchor x'+str(c.count(OLD)));continue
    c2=JA+c.replace(OLD,NEW)
    open('/tmp/_c.js','w').write('(async function(){'+c2+'\n})')
    r=subprocess.run(['node','-e',"new Function('return '+require('fs').readFileSync('/tmp/_c.js','utf8'))"],capture_output=True,text=True)
    if r.returncode: bad.append('PARSE '+n['name']+r.stderr[:200])
    os.makedirs(os.path.join(D,'patched'),exist_ok=True);open(os.path.join(D,'patched',n['name'].replace(' ','_')+'.js'),'w').write(c2)
    plan['nodes'].append({'name':n['name'],'id':n['id'],'old_sha':sha(c),'new_sha':sha(c2),'delta':len(c2)-len(c)})
json.dump(plan,open(os.path.join(D,'plan_C.json'),'w'),indent=1)
print(plan['live_version'],[ (x['name'],x['old_sha'],x['new_sha'],x['delta']) for x in plan['nodes']]);print('BAD',bad) if bad else print('anchors unique, all parse')
