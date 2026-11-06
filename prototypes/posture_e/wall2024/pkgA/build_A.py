# Package A (Commitment 10 + K-CON), built from a fresh live fetch (argv[1]). Writes nothing live.
import json,sys,hashlib,subprocess,os
D=os.path.dirname(os.path.abspath(__file__))
live=json.load(open(sys.argv[1]))['workflow']
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
c10=open(os.path.join(D,'c10.txt')).read().strip('\n')
# PART2 is a double-quoted JS literal: escape backslash, double quote, newline
c10js=c10.replace('\\','\\\\').replace('"','\\"').replace('\n','\\n')
C9_END="I quote the debate's own words that decide it.\";"
EDITS_A=[(C9_END, C9_END[:-2]+'\\n\\n'+c10js+'";'),
 ("/^### (Commitment \\d\\. [^\\n]+)$/gm","/^### (Commitment \\d+\\. [^\\n]+)$/gm"),
 ("'SILENCE':5,'K-V':6};","'SILENCE':5,'K-V':6,'K-CON':10};")]
EDITS_B=[("'C4-RENUM':'TRIAL','C4-PRESS':'TRIAL'};","'C4-RENUM':'TRIAL','C4-PRESS':'TRIAL','K-CON':'TRIAL'};"),
 ("{const P=wpLines2024(R);P.items.forEach(x=>items.push(x));P.marks.forEach(x=>marks.push(x));} // WALL-2024 check 2 (TRIAL, on K-W)",
  "{const P=wpLines2024(R);P.items.forEach(x=>items.push(x));P.marks.forEach(x=>marks.push(x));const Q=kconLines2024(text,P.items);Q.items.forEach(x=>items.push(x));Q.marks.forEach(x=>marks.push(x));} // WALL-2024 check 2 (TRIAL, on K-W); package A: K-CON (Commitment 10, TRIAL)")]
WP_FN_START='function wpLines2024(R){'
KCON=open(os.path.join(D,'kcon_slice.js')).read().strip('\n')
EDIT_RC=("'K-G11':5,'K-U':5,'K-V':6};const out=[];","'K-G11':5,'K-U':5,'K-V':6,'K-CON':10};const out=[];")
plan={'live_version':live['versionId'],'nodes':[]};bad=[]
for n in live['nodes']:
    c=n.get('parameters',{}).get('jsCode') or '';c2=c;done=[]
    if 'const PART2="' in c:
        for a,b in EDITS_A:
            if c2.count(a)!=1: bad.append(n['name']+': A anchor x'+str(c2.count(a))+' '+a[:40])
            else: c2=c2.replace(a,b);done.append('A:'+a[:24])
    if 'function kwLines421(' in c:
        for a,b in EDITS_B:
            if c2.count(a)!=1: bad.append(n['name']+': B anchor x'+str(c2.count(a))+' '+a[:40])
            else: c2=c2.replace(a,b);done.append('B:'+a[:24])
        i=c2.find(WP_FN_START);j=c2.find('\n function',i);j=c2.find('\nfunction ',i+10)
        if i<0: bad.append(n['name']+': no wpLines2024')
        else:
            k=c2.find('\n',c2.find(' return {items,marks};}',c2.find('rks.forEach',i)))  # end of wpLines2024
            c2=c2[:k]+'\n'+KCON+c2[k:];done.append('B:kcon fn')
    if n['name']=='Cure Build':
        if c2.count(EDIT_RC[0])!=1: bad.append('Cure Build RC anchor x'+str(c2.count(EDIT_RC[0])))
        else: c2=c2.replace(*EDIT_RC);done.append('RC')
    if c2!=c:
        open('/tmp/_c.js','w').write('(async function(){'+c2+'\n})')
        r=subprocess.run(['node','-e',"new Function('return '+require('fs').readFileSync('/tmp/_c.js','utf8'))"],capture_output=True,text=True)
        if r.returncode: bad.append('PARSE '+n['name']+r.stderr[:200])
        plan['nodes'].append({'name':n['name'],'id':n['id'],'old_sha':sha(c),'new_sha':sha(c2),'delta':len(c2)-len(c),'edits':done})
        os.makedirs(os.path.join(D,'patched'),exist_ok=True);open(os.path.join(D,'patched',n['name'].replace(' ','_')+'.js'),'w').write(c2)
json.dump(plan,open(os.path.join(D,'plan_A.json'),'w'),indent=1)
print(live['versionId'],len(plan['nodes']),'nodes');[print(' ',x['name'],x['old_sha'],'->',x['new_sha'],x['delta'],x['edits']) for x in plan['nodes']]
print('BAD',bad) if bad else print('all anchors unique, all parse')
