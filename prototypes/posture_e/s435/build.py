#!/usr/bin/env python3
"""s435 (WALL-1963 revision 8, piece 4a): E-OOR and E-CHAIN code checks, E-WD model reading, built on top of s434's new nodes. The base for the
write is s434's base (live cf21f231): pieces 3 and 4 are written together (WALL-1963 reply 2003)."""
import json,os,shutil
R=os.path.dirname(os.path.abspath(__file__));P=os.path.join(R,'..','s434')
M=json.load(open(os.path.join(P,'manifest.json')))
OUT={nm:open(os.path.join(P,'new',nm+'.js')).read() for nm in M['nodes']}
for nm in M['nodes']: shutil.copy(os.path.join(P,'base',nm+'.js'),os.path.join(R,'base',nm+'.js'))
def rep(nm,a,b):
    k=OUT[nm].count(a)
    if k!=1: raise SystemExit(f'{nm}: anchor count {k}: {a[:60]}')
    OUT[nm]=OUT[nm].replace(a,b)
A="if(!items.length)return [{json:{je_skip:true,why:'no judge decision line and no synthesis claim was read',items:[],code_rows}}];"
rep('Judge Enforcer Build',A,open(os.path.join(R,'items4.js')).read()+A)
rep('Judge Enforcer Build'," +'NO ANSWER, for every rule:",open(os.path.join(R,'rules4.txt')).read()+" +'NO ANSWER, for every rule:")
rep('Judge Enforcer Build',"| FOLLOWS | DOES NOT FOLLOW | TRUE | OVERSTATED --","| FOLLOWS | DOES NOT FOLLOW | WITHDRAWN | NOT WITHDRAWN | TRUE | OVERSTATED --")
rep('Judge Enforcer Record',"([BVKYHZPR]\\d+\\.\\d+)","([BVKYHZPRW]\\d+\\.\\d+)")
rep('Judge Enforcer Record',"|DOES NOT FOLLOW|FOLLOWS|TRUE|OVERSTATED)","|DOES NOT FOLLOW|FOLLOWS|NOT WITHDRAWN|WITHDRAWN|TRUE|OVERSTATED)")
rep('Judge Enforcer Record',"'E-HOLD','E-KEY','E-PREM','E-RES']","'E-HOLD','E-KEY','E-PREM','E-RES','E-WD']")
for nm,c in OUT.items(): open(os.path.join(R,'new',nm+'.js'),'w').write(c)
json.dump({'base_versionId':M['base_versionId'],'nodes':M['nodes']},open(os.path.join(R,'manifest.json'),'w'),indent=1)
print('built',sorted(OUT))
