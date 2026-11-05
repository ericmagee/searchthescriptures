# Builds the check-2 patch from a fresh live fetch (argv[1], n8n get_workflow_details JSON). Writes nothing live.
import json,sys,hashlib,subprocess,os
live=json.load(open(sys.argv[1]))['workflow']
slice_=open(os.path.join(os.path.dirname(__file__),'wp_slice.js')).read()
def fn(c):
    i=c.find('function kwLines421(');j=c.find('\nfunction ',i+10);return c[i:j]
OLD_TAIL="\n return {items,marks};}"
CALL="\n {const P=wpLines2024(R);P.items.forEach(x=>items.push(x));P.marks.forEach(x=>marks.push(x));} // WALL-2024 check 2 (TRIAL, on K-W)"
out={'live_version':live['versionId'],'nodes':[]}
F0=None
for n in live['nodes']:
    c=n.get('parameters',{}).get('jsCode') or ''
    if c.count('function kwLines421(')==0: continue
    assert c.count('function kwLines421(')==1 and 'wpLines2024' not in c, n['name']
    F=fn(c); F0=F0 or F; assert F==F0, 'kwLines421 differs in '+n['name']
    assert F.endswith(OLD_TAIL) and F.count(OLD_TAIL)==1
    F2=F[:-len(OLD_TAIL)]+CALL+OLD_TAIL+'\n'+slice_.rstrip('\n')
    c2=c.replace(F,F2,1); assert c2.count(F)==0 or F in F2
    open('/tmp/_c.js','w').write('(async function(){'+c2+'\n})')
    r=subprocess.run(['node','-e',"new Function('return '+require('fs').readFileSync('/tmp/_c.js','utf8'))"],capture_output=True,text=True)
    assert r.returncode==0, n['name']+r.stderr
    out['nodes'].append({'name':n['name'],'id':n['id'],'old_sha':hashlib.sha256(c.encode()).hexdigest()[:16],'new_sha':hashlib.sha256(c2.encode()).hexdigest()[:16],'len_delta':len(c2)-len(c)})
    if n['name']=='Panel Payloads': open('patched_panel_payloads.js','w').write(c2)
out['kw_old_sha']=hashlib.sha256(F0.encode()).hexdigest()[:16]
out['kw_new']=F2; json.dump(out,open('patch_plan.json','w'),indent=1)
print(out['live_version'],len(out['nodes']),'nodes');[print(' ',x['name'],x['old_sha'],'->',x['new_sha'],x['len_delta']) for x in out['nodes']]
