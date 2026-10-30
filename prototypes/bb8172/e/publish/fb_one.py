# fetch-back for one node: python3 fb_one.py <saved get_workflow_details file> <File_Name.js>; also reports the whole-workflow summary line.
import json,sys,os,hashlib,subprocess
H=os.path.dirname(os.path.abspath(__file__))
def nodes_of(x):
    if isinstance(x,dict):
        if isinstance(x.get('nodes'),list): return x
        for v in x.values():
            r=nodes_of(v)
            if r: return r
d=json.load(open(sys.argv[1]));w=d.get('workflow',{});N=nodes_of(d);L={n['name']:n for n in N['nodes']}
f=sys.argv[2];nm=f[:-3].replace('_',' ');t=open(os.path.join(H,'new',f),encoding='utf-8').read();live=L[nm]['parameters'].get('jsCode','')
m=lambda s:hashlib.md5(s.encode()).hexdigest()
print(nm,'EQUAL' if live==t else 'MISMATCH','live',m(live),'file',m(t),'| draft',w.get('versionId'),'active',w.get('activeVersionId'))
print(subprocess.run(['python3',os.path.join(H,'fb_check.py'),sys.argv[1]],capture_output=True,text=True).stdout.splitlines()[0])
