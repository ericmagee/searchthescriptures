# pkgTG: TRIAL cure guard (W3 approved, Wall 2248). The cure instructions say that a TRIAL item asks only for its own form and is never a reason
# to retract or regrade a line (32980: chatgpt's K-RUL replies added "the broken grade is retracted"). For K-RUL: write the card; a missing card
# is not a reason to change the grade. For K-CON: a NOT HELD must quote the flagged sentence (Wall 2252 case A).
# Base: pkgKCR/patched (live-test stack f10fae2); Alternate Merge from pkgGATE/patched (stacks after pkgGATE).
import os,hashlib,json
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
OLD='RESPONSE: <the flagged item, as labelled above> | NOT HELD: <your reason>.";'
NEW=('RESPONSE: <the flagged item, as labelled above> | NOT HELD: <your reason>. '
     'A TRIAL item (its mark says TRIAL rule) asks only for its own form: write that form, or NOT HELD. A TRIAL item never asks you to retract or regrade a line, and it is not a reason to change any grade; retract or regrade a line only for a reason from the rounds. '
     'For a K-RUL item, write the card; a missing card is not a reason to change the grade. '
     'For a K-CON item, a NOT HELD line must quote the flagged sentence, at least six words in a row, or the item stays uncured.";')
plan={'base':'pkgKCR/patched; Alternate Merge from pkgGATE/patched','nodes':[]}
for n in sorted(os.listdir('pkgKCR/patched')):
    src=('pkgGATE/patched/' if n=='Alternate_Merge.js' else 'pkgKCR/patched/')+n
    o=open(src).read()
    if OLD not in o:continue
    assert o.count(OLD)==1,n;s=o.replace(OLD,NEW)
    open('pkgTG/patched/'+n,'w').write(s)
    plan['nodes'].append({'file':n,'name':n[:-3].replace('_',' '),'base':src,'base_sha':sha(o),'final_sha':sha(s),'edits':['TRIAL cure guard sentences']})
json.dump(plan,open('pkgTG/plan_TG.json','w'),indent=1);print(len(plan['nodes']),'nodes')
