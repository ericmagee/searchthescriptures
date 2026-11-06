# pkgKCR: the K-CON cure reader also reads a CONTRADICTION, NOT HELD or REASSERTED IN answer written after a RESPONSE: <item> | or a STATEMENT: label
# (Wall 2252 cases B and E). The quote rule is unchanged: 6 consecutive words of the flagged sentence. A NOT HELD with a reason only still does not cure.
# Base: pkgKCON/patched for 16 nodes, pkgVC/patched for Panel Payloads.
import os,hashlib,json
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
OLD1="const ln=T.split('\\n').find(l=>/^\\s*(?:[-•*]\\s*)?\\**(CONTRADICTION\\b|NOT HELD\\b|REASSERTED IN\\b)/i.test(l)&&!/NONE FOUND/i.test(l)&&runs.some(r=>(' '+krulNorm(l)+' ').includes(' '+r+' ')));"
NEW1="const ln=T.split('\\n').find(l0=>{const l=kconUnlabel(l0);return /^\\s*(?:[-•*]\\s*)?\\**(CONTRADICTION\\b|NOT HELD\\b|REASSERTED IN\\b)/i.test(l)&&!/NONE FOUND/i.test(l)&&runs.some(r=>(' '+krulNorm(l)+' ').includes(' '+r+' '));});"
OLD2=" const L=String(WT||'').replace(/[*_`]+/g,'').split('\\n').filter(l=>/^\\s*(?:[-•>]|\\d+[.)])?\\s*(CONTRADICTION\\b|NOT HELD\\b|REASSERTED IN\\b)/i.test(l)).map(l=>' '+nw(l).join(' ')+' ');"
NEW2=" const L=String(WT||'').replace(/[*_`]+/g,'').split('\\n').map(kconUnlabel).filter(l=>/^\\s*(?:[-•>]|\\d+[.)])?\\s*(CONTRADICTION\\b|NOT HELD\\b|REASSERTED IN\\b)/i.test(l)).map(l=>' '+nw(l).join(' ')+' ');"
FN=("// pkgKCR (W1, Wall 2252 B and E): a cure line may carry its K-CON answer after a label: \"RESPONSE: <item> | NOT HELD -- ...\" or \"STATEMENT: NOT HELD -- ...\".\n"
    "function kconUnlabel(l){return String(l==null?'':l).replace(/^\\s*(?:[-•*>]\\s*)?\\**\\s*(?:RESPONSE\\**\\s*:[^|\\n]*\\|\\s*|STATEMENT\\**\\s*:\\s*)\\**\\s*/i,'');}\n")
plan={'base':'pkgKCON/patched (Panel Payloads: pkgVC/patched)','nodes':[]}
for n in sorted(os.listdir('pkgKCON/patched')):
    src='pkgVC/patched/'+n if n=='Panel_Payloads.js' else 'pkgKCON/patched/'+n
    o=open(src).read();s=o;ed=[]
    assert s.count(OLD1)==1,(n,'OLD1');s=s.replace(OLD1,NEW1);ed.append('krulCure K-CON reads labelled lines')
    k=s.count(OLD2)
    if k:assert k==1;s=s.replace(OLD2,NEW2);ed.append('vcCaught2024 reads labelled lines')
    a=s.index('function krulCure(');s=s[:a]+FN+s[a:]
    open('pkgKCR/patched/'+n,'w').write(s)
    plan['nodes'].append({'file':n,'name':n[:-3].replace('_',' '),'base':src,'base_sha':sha(o),'final_sha':sha(s),'edits':ed})
json.dump(plan,open('pkgKCR/plan_KCR.json','w'),indent=1);print(len(plan['nodes']),'nodes;',sum(len(x['edits']) for x in plan['nodes']),'edits')
