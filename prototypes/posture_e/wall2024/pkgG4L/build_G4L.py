# pkgG4L (W3 2291, proposal W1 2289): each K-G4 item in the FLAGGED ITEMS list states the class the engine gives it and its one cure. Text only:
# the class is the same test the cure check uses (ruling 421: __mb421 = the line has no DRV_WORDS), so the label and the verdict cannot differ.
# 32985: 9 seats' K-G4 items were retracted as if answered-witness breaks and refused as meaning breaks; the judges were never told the class.
# Base: pkgKIND/final (whole stack over live 68fe69cd). Run from wall2024/.
import os,json,hashlib
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
OLD="x.rule==='K-AG')?String(x.line||'').trim()+(x.rule==='K-C'&&x.chain?'\\n  '+x.chain:''):"
NEW="x.rule==='K-AG')?String(x.line||'').trim()+(x.rule==='K-C'&&x.chain?'\\n  '+x.chain:'')+(x.rule==='K-G4'?g4Label2024(x):''):"
FN=("// pkgG4L (W3 2291): the class of a K-G4 item and its one cure, printed on the item. Same test as the cure check (ruling 421).\n"
    "function g4Label2024(x){return DRV_WORDS.test(String(x.line||''))\n"
    " ?' [UNANSWERED-WITNESS BREAK: your GROUND says a pressed witness was left unanswered. If a later round of that side names the witness, it was answered: cure it with RETRACTED, or with one FORCED line where the link still cannot take the witness\\'s meaning. Otherwise cure it with a PRESSED line quoting the round that pressed it.]'\n"
    " :' [MEANING BREAK: your GROUND names no pressed witness left unanswered, so this break rests on meaning. Only one FORCED line cures it. RETRACTED does not cure it: a retraction leaves the item uncured, and an uncured K-G4 item counts against your seat (LIVE rule).]';}\n")
plan={'base':'pkgKIND/final','nodes':[]}
for f in sorted(os.listdir('pkgKIND/final')):
    o=open('pkgKIND/final/'+f).read()
    if OLD not in o:continue
    assert o.count(OLD)==1,f;s=o.replace(OLD,NEW);a=s.index('function cureAsk(items,broken)');s=s[:a]+FN+s[a:]
    open('pkgG4L/patched/'+f,'w').write(s)
    plan['nodes'].append({'file':f,'name':f[:-3].replace('_',' '),'base_sha':sha(o),'final_sha':sha(s)})
json.dump(plan,open('pkgG4L/plan_G4L.json','w'),indent=1);print(len(plan['nodes']),'nodes')
