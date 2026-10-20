# Falsifiers for compose.py: each mutant breaks one check, and the run must FAIL naming it. The unmutated run must pass.
# Usage: python3 mutants.py <live details json (db281705)> <repo root>
import subprocess,sys,os,tempfile,json
LIVE,REPO=sys.argv[1:3];HERE=os.path.dirname(os.path.abspath(__file__));src=open(os.path.join(HERE,'compose.py')).read()
def run(code,live=LIVE):
 d=tempfile.mkdtemp();p=os.path.join(d,'c.py');open(p,'w').write(code)
 r=subprocess.run([sys.executable,p,live,REPO,os.path.join(d,'out')],capture_output=True,text=True);return r.returncode,r.stdout+r.stderr
def mut(old,new):assert src.count(old)==1,old;return src.replace(old,new)
# A live file of another version, for the version check.
w=json.load(open(LIVE));w['workflow']['versionId']='0000other';lv=os.path.join(tempfile.mkdtemp(),'live.json');json.dump(w,open(lv,'w'))
M=[
 ('duplicate SRC entry',mut("SRC=[\n","SRC=[\n ('Panel Build',('p2','p2/Panel_Build.new.js')),\n"),src,'nodes named twice in SRC'),
 ('SRC node missing',mut("('Panel Build',('p2'","('Panel Bulid',('p2'"),src,'SRC node Panel Bulid does not exist'),
 ('SRC node not Code',mut("('Panel Build',('p2'","('Write Judgment 1',('p2'"),src,'SRC node Write Judgment 1 is not a Code node'),
 ('file unaccounted',mut(" 'p3/drv_check.js':'library (portion 3 checker for the harnesses); not a node',\n",""),src,'neither used nor listed: p3/drv_check.js'),
 ('ops7 vs file',mut("('Alternate Merge',('p7','p7/out/Alternate_Merge.js'))","('Alternate Merge',('p7','p7/out/Alternate_Build.js'))"),src,'ops7 code for Alternate Merge differs'),
 ('missing reference',mut(" nodes[name]['parameters']['jsCode']=code;"," nodes[name]['parameters']['jsCode']=code+(\"\\n$('No Such Node')\" if name=='Panel Done' else '');"),src,'Panel Done reads missing node No Such Node'),
 ('connection to missing node',mut("# 3. Code: one source per node.","add_edge({'from':'Dry?','out':0,'to':'No Such Node'})\n# 3. Code: one source per node."),src,'missing node No Such Node'),
]
fails=0
rc,o=run(src);ok=rc==0 and 'OK:' in o;print(('PASS ' if ok else 'FAIL ')+'unmutated: passes');fails+=not ok
rc,o=run(src,lv);ok=rc!=0 and 'not db281705' in o;print(('PASS ' if ok else 'FAIL ')+'live of another version: refused');fails+=not ok
for name,code,_,want in M:
 rc,o=run(code);ok=rc!=0 and want in o;print(('PASS ' if ok else 'FAIL ')+name+': refused, naming it');fails+=not ok
 if not ok:print('   got: '+o[-300:])
print('failures',fails)
