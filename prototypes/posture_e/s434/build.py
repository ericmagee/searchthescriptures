#!/usr/bin/env python3
"""s434 (WALL-1963 revision 6, piece 3; rulings 428, 439): the enforcer reads each listed premise as each judge ruled it (E-PREM) and each judge's
verdict lines (E-RES). Judge Enforcer Build and Judge Enforcer Record. Base: a GET of live cf21f231 (path in argv[1])."""
import json,os,sys
R=os.path.dirname(os.path.abspath(__file__))
L=json.load(open(sys.argv[1]));assert L['versionId'].startswith('cf21f231'),L['versionId']
N={n['name']:n for n in L['nodes']};OUT={}
def rep(nm,a,b):
    c=OUT.get(nm) or N[nm]['parameters']['jsCode']
    if nm not in OUT: open(f'{R}/base/{nm}.js','w').write(c)
    k=c.count(a)
    if k!=1: raise SystemExit(f'{nm}: anchor count {k}: {a[:60]}')
    OUT[nm]=c.replace(a,b)
rep('Judge Enforcer Build',"let SY='';",open(f'{R}/items.js').read()+"let SY='';")
rep('Judge Enforcer Build'," +'NO ANSWER, for every rule:",open(f'{R}/rules.txt').read()+" +'NO ANSWER, for every rule:")
rep('Judge Enforcer Build',"| STANDS | UNDERDETERMINED | TRUE | OVERSTATED --","| STANDS | UNDERDETERMINED | COUNTED | SPARED | FOLLOWS | DOES NOT FOLLOW | TRUE | OVERSTATED --")
rep('Judge Enforcer Build',"if(!items.length)return skip('no ANSWER CHECK line, VOID ruling, collision line or synthesis claim was read');","if(!items.length)return skip('no judge decision line and no synthesis claim was read');")
rep('Judge Enforcer Record',"([BVKYHZ]\\d+\\.\\d+)","([BVKYHZPR]\\d+\\.\\d+)")
rep('Judge Enforcer Record',"|STANDS|UNDERDETERMINED|TRUE|OVERSTATED)","|STANDS|UNDERDETERMINED|COUNTED|SPARED|DOES NOT FOLLOW|FOLLOWS|TRUE|OVERSTATED)")
rep('Judge Enforcer Record',"'E-SYN','E-HOLD','E-KEY']","'E-SYN','E-HOLD','E-KEY','E-PREM','E-RES']")
rep('Judge Enforcer Build',"if(!items.length)return skip('no judge decision line and no synthesis claim was read');","if(!items.length)return [{json:{je_skip:true,why:'no judge decision line and no synthesis claim was read',items:[],code_rows}}];")
rep('Judge Enforcer Build',"return calls.filter(c=>c.length).map((c,ci)=>({json:{je_skip:false,","return calls.filter(c=>c.length).map((c,ci)=>({json:{je_skip:false,code_rows:ci===0?code_rows:[],")
rep('Judge Enforcer Record',"if(first.je_skip)return [{json:{...PASS,enf428:{skipped:true,why:first.why||''},enf428_rows:[]}}];","const CODE=first.code_rows||[]; /* s434: code-checked violations of the verdict lines (ruling 443) */\nif(first.je_skip)return [{json:{...PASS,enf428:{skipped:true,why:first.why||'',code_violations:CODE.length},enf428_rows:CODE}}];")
rep('Judge Enforcer Record',"return [{json:{...PASS,enf428:{skipped:false,","rows.push(...CODE);\nreturn [{json:{...PASS,enf428:{code_violations:CODE.length,skipped:false,")
for nm,c in OUT.items(): open(f'{R}/new/{nm}.js','w').write(c)
json.dump({'base_versionId':L['versionId'],'nodes':sorted(OUT)},open(f'{R}/manifest.json','w'),indent=1)
print('built',sorted(OUT))
