#!/usr/bin/env python3
"""s432 (WALL-1963 reply 1986, 1987; rulings 434, 438, 439): the send-back also takes rows beginning "ENFORCER NO ANSWER" (a judge left an item
unanswered; run 32749 had 11, all chatgpt K-W, none sent). Send Back Build's filter, reason strip and request wording; Format Markdown's line.
Base: a GET of live 384f8a5a (path in argv[1])."""
import json,os,sys
R=os.path.dirname(os.path.abspath(__file__))
L=json.load(open(sys.argv[1]));assert L['versionId'].startswith('384f8a5a'),L['versionId']
N={n['name']:n for n in L['nodes']};OUT={}
def rep(nm,a,b):
    c=OUT.get(nm) or N[nm]['parameters']['jsCode']
    if nm not in OUT: open(f'{R}/base/{nm}.js','w').write(c)
    k=c.count(a)
    if k!=1: raise SystemExit(f'{nm}: anchor count {k}: {a[:60]}')
    OUT[nm]=c.replace(a,b)
rep('Send Back Build',"/^ENFORCER DISAGREE\\b/.test(String(x.cure_reason||''))","/^ENFORCER (?:DISAGREE|NO ANSWER)\\b/.test(String(x.cure_reason||'')) /* s432: a NO ANSWER row is a reported violation too */")
rep('Send Back Build',"replace(/^ENFORCER DISAGREE\\s*:?\\s*/,'')","replace(/^ENFORCER (?:DISAGREE|NO ANSWER)\\s*:?\\s*/,'')")
rep('Send Back Build',"if(!dis.length)return skip('no enforcer disagreed with a panel judge line');","if(!dis.length)return skip('no enforcer reported a violation in a panel judge line');")
rep('Send Back Build',"'An enforcer has read some of your lines against the debate record and disagrees with them. Its reasons are quoted below.","'An enforcer has read some of your lines against the debate record and reports a violation in each. Its reasons are quoted below.")
rep('Format Markdown',"Each line an enforcer disagreed with went back once to the judge that wrote it","Each line in which an enforcer reported a violation (a disagreement, or an item the judge left unanswered) went back once to the judge that wrote it")
for nm,c in OUT.items(): open(f'{R}/new/{nm}.js','w').write(c)
json.dump({'base_versionId':L['versionId'],'nodes':sorted(OUT)},open(f'{R}/manifest.json','w'),indent=1)
print('built',sorted(OUT))
