# pkgG4W (W3 2294): the K-G4 class reads plain-words unanswered-witness grounds. A GROUND that says "did not answer", "does not answer",
# "not been answered", "no answer", "receives no answer", "gave no answer" or "left without answer" claims a pressed witness left unanswered
# (ruling 421), so the item is an UNANSWERED-WITNESS break, not a MEANING break. The new phrases are matched in the GROUND clause only, with
# quoted record words removed; the old DRV_WORDS test on the whole line is kept as it was. Used at the two K-G4 class points only: the cure
# check (__mb421) and the item label (g4Label2024). DRV_WORDS itself, and K-G1, are unchanged. Base: pkgG4L/patched (19 nodes). Run from wall2024/.
import os,json,hashlib
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
FN=("// pkgG4W (W3 2294): does a K-G4 line claim a pressed witness left unanswered? DRV_WORDS on the line as before, or a plain-words phrase in its\n"
    "// GROUND clause with the quoted record words taken out (2294 (a): never in the grade line's own quotations).\n"
    "function g4Unans2024(line){const s=String(line||'');if(DRV_WORDS.test(s))return true;const i=s.search(/\\bGROUND\\s*:/i);if(i<0)return false;\n"
    " const g=s.slice(i).replace(/\"[^\"]*\"|\\u201c[^\\u201d]*\\u201d|(^|[\\s(\\[])['\\u2018](?:[^'\\u2018\\u2019]|['\\u2019](?=[A-Za-z]))*?['\\u2019](?=$|[\\s.,;:!?)\\]])/g,'$1 ');\n"
    " return /\\b(?:did not answer|does not answer|not been answered|no answer|receives no answer|gave no answer|left without answer)\\b/i.test(g);}\n")
E=[("const __mb421=!DRV_WORDS.test(String(x.line||''));","const __mb421=!g4Unans2024(x.line);"),
   ("function g4Label2024(x){return DRV_WORDS.test(String(x.line||''))","function g4Label2024(x){return g4Unans2024(x.line)")]
plan={'base':'pkgG4L/patched','nodes':[]}
for f in sorted(os.listdir('pkgG4L/patched')):
    o=open('pkgG4L/patched/'+f).read();s=o
    for a,b in E:assert s.count(a)==1,(f,a);s=s.replace(a,b)
    a=s.index('// pkgG4L (W3 2291)');s=s[:a]+FN+s[a:]
    open('pkgG4W/patched/'+f,'w').write(s);plan['nodes'].append({'file':f,'name':f[:-3].replace('_',' '),'base_sha':sha(o),'final_sha':sha(s)})
json.dump(plan,open('pkgG4W/plan_G4W.json','w'),indent=1);print(len(plan['nodes']),'nodes')
