#!/usr/bin/env python3
"""s435 (WALL-1963 revision 8, piece 4a): E-OOR and E-CHAIN code checks (E-WD dropped, ruling 445), and the Send Back Build K-W exclusion (ruling 445), built on top of s434's new nodes. The base for the
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
# E-WD (rules4.txt, the W ids, the WITHDRAWN values) dropped: ruling 445 (WALL-1963 reply 2009). rules4.txt is kept in git as the record.
# Send Back Build (ruling 445): a withdrawal row (rule K-W, rulings 421/424) is never sent back. Base: live cf21f231 (sbbase/).
SB='Send Back Build';shutil.copy(os.path.join(R,'sbbase',SB+'.js'),os.path.join(R,'base',SB+'.js'));OUT[SB]=open(os.path.join(R,'sbbase',SB+'.js')).read();M['nodes']=M['nodes']+[SB]
rep(SB,"x.seat_role==='panel'&&/^ENFORCER","x.seat_role==='panel'&&x.rule!=='K-W' /* ruling 445: \"withdrawals will not be included in send-backs\" */&&/^ENFORCER")
rep(SB,"// an enforcer DISAGREES with (the withdrawal enforcer of rulings 421/424, and E-ANS, E-VOID, E-COL of ruling 428)","// an enforcer DISAGREES with (E-ANS, E-VOID, E-COL of ruling 428 and the later enforcer rules; never a withdrawal row, K-W, ruling 445)")
for nm,c in OUT.items(): open(os.path.join(R,'new',nm+'.js'),'w').write(c)
json.dump({'base_versionId':M['base_versionId'],'nodes':M['nodes']},open(os.path.join(R,'manifest.json'),'w'),indent=1)
print('built',sorted(OUT))
