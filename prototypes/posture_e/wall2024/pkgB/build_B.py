# Package B on top of package A (pkgA/patched) and the live fetch (argv[1]) for nodes A does not touch. Writes nothing live.
import json,sys,hashlib,subprocess,os
D=os.path.dirname(os.path.abspath(__file__));A=os.path.join(D,'..','pkgA','patched')
live=json.load(open(sys.argv[1]))['workflow'];sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
AGR=open(os.path.join(D,'agr_slice.js')).read().strip('\n');KCMT=open(os.path.join(D,'kcmt_slice.js')).read().strip('\n')
WALK=('Panel Build','Build Independent Verdict','Reserve Build','Alternate Build')
plan={'live_version':live['versionId'],'base':'pkgA/patched where present, else live','nodes':[]};bad=[]
def one(c,a,b,name):
    if c.count(a)!=1: bad.append(name+' anchor x'+str(c.count(a))+': '+a[:50]);return c
    return c.replace(a,b)
for n in live['nodes']:
    c0=n.get('parameters',{}).get('jsCode') or '';ap=os.path.join(A,n['name'].replace(' ','_')+'.js')
    base=open(ap).read() if os.path.exists(ap) else c0;c=base;ed=[]
    if n['name'] in WALK:
        c=one(c,'const __MT=(items)=>{',AGR+'\nconst __MT=(items)=>{',n['name']);c=one(c,'\nreturn __MT(__R);\n','\nreturn __AGR_SB(__MT(__R));\n',n['name']);ed.append('B:reminder walker')
    if n['name']=='Send Back Build':
        c=AGR+'\n'+c;c=one(c,"{role:'user',content:msg}]};","{role:'user',content:msg+__agrTail(j.body.messages)}]};",n['name'])
        c=one(c,"x.rule!=='K-W' /*","x.rule!=='K-W'&&x.rule!=='K-CON' /* package A/B: K-CON is TRIAL and not sent back (W1, W3, 2026-11-05); ",n['name']);ed.append('B:send-back reminder + K-CON excluded')
    if 'function kwLines421(' in c:
        c=one(c,"'K-CON':'TRIAL'};","'K-CON':'TRIAL','K-CMT':'TRIAL'};",n['name'])
        c=one(c,"const Q=kconLines2024(text,P.items);Q.items.forEach(x=>items.push(x));Q.marks.forEach(x=>marks.push(x));}","const Q=kconLines2024(text,P.items);Q.items.forEach(x=>items.push(x));Q.marks.forEach(x=>marks.push(x));const Z=kcmtLines2024(text);Z.items.forEach(x=>items.push(x));Z.marks.forEach(x=>marks.push(x));}",n['name'])
        c=one(c,'function kconLines2024(',KCMT+'\nfunction kconLines2024(',n['name']);ed.append('B:K-CMT')
    if c!=base:
        open('/tmp/_c.js','w').write('(async function(){'+c+'\n})')
        r=subprocess.run(['node','-e',"new Function('return '+require('fs').readFileSync('/tmp/_c.js','utf8'))"],capture_output=True,text=True)
        if r.returncode: bad.append('PARSE '+n['name']+r.stderr[:300])
        os.makedirs(os.path.join(D,'patched'),exist_ok=True);open(os.path.join(D,'patched',n['name'].replace(' ','_')+'.js'),'w').write(c)
        plan['nodes'].append({'name':n['name'],'id':n['id'],'live_sha':sha(c0),'after_A_sha':sha(base) if base!=c0 else None,'after_AB_sha':sha(c),'edits':ed})
json.dump(plan,open(os.path.join(D,'plan_B.json'),'w'),indent=1)
print(len(plan['nodes']),'nodes');[print(' ',x['name'],x['edits']) for x in plan['nodes']];print('BAD',bad) if bad else print('anchors unique, all parse')
