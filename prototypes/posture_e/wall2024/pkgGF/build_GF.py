# pkgGF (W3 2311): the gate's FORCED path. A RULE K-G4 gate item (a send-back change left a link graded LINK BROKEN that the re-read raises) is
# cured by one FORCED line for that link written in the item's own GATE line (as the CHANGE TO's companion reason, or after KEEP), checked by
# the same K-F test the panel cure uses (kfLines: KF_LINE form; MEANS, ANSWER and FAILS each found in the round named). Before, the gate read
# no FORCED line, so a meaning break (ruling 421: cured only by FORCED) could be cured at the gate only by dropping the grade. A FORCED line
# that fails the K-F test leaves the item UNCURED with the K-F reason. The gate prompt names the form. Base: pkgGK/patched. Run from wall2024/.
import json,hashlib
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
FN=("// pkgGF (W3 2311): a FORCED line for a RULE K-G4 gate item's link, in the item's own GATE line, checked by the panel cure's K-F test (kfLines).\n"
    "function gateForced2024(x,a,ctx){if(!a||x.kind!=='RULE K-G4')return null;const lk=String(x.key||'').split('|')[3]||'';if(!lk)return null;\n"
    " const segs=[a.to,a.why].concat(String(a.line||'').split('||')).map(s=>String(s||'').replace(/\\\\+\"/g,'\"').replace(/[*_`]+/g,'').trim()).filter(s=>/^FORCED\\s*:/i.test(s));\n"
    " const id=s=>{const m=s.match(/^FORCED\\s*:\\s*(D\\d+)\\s+vs\\.?\\s+(C\\d+)/i);return m?(m[1]+' VS '+m[2]).toUpperCase():null;};\n"
    " const mine=[...new Set(segs.filter(s=>id(s)===lk.toUpperCase()))];if(!mine.length)return null;const R=(ctx&&ctx.R)||{};\n"
    " for(const s of mine){const K=kfLines(s,R).items.filter(z=>z.rule==='K-F');if(!K.length)return {cured:true,why:'forced link: a FORCED line for '+lk+' in the gate reply passes the K-F test, each quotation found in the round it names (ruling 411)',line:s};}\n"
    " const K=kfLines(mine[0],R).items.filter(z=>z.rule==='K-F');return {cured:false,why:'the FORCED line for '+lk+' fails the K-F test: '+(K.length?K.map(z=>z.why).join('; '):'not read')+' (ruling 411)',line:mine[0]};}\n")
E_ALL=[("function gateCure2024(seat,raw,F,its,G,reply,ctx){",FN+"function gateCure2024(seat,raw,F,its,G,reply,ctx){"),
 ("  else if(a.ans==='KEEP'&&wd2299.has(x.sid))",
  "  else if(x.kind==='RULE K-G4'&&gateForced2024(x,a,ctx)){const g=gateForced2024(x,a,ctx);cured=g.cured;why=g.why;} // pkgGF (W3 2311): before the KEEP branches, so KEEP + FORCED is read\n  else if(a.ans==='KEEP'&&wd2299.has(x.sid))")]
E_PROMPT=[("that change is then withdrawn and your line stays as it was. ",
 "that change is then withdrawn and your line stays as it was. A RULE K-G4 item on a link you keep graded LINK BROKEN because the link cannot take the witness\\'s meaning (a meaning break, ruling 421) is cured by one FORCED line for that link, written as the reason of its GATE line, after KEEP or after your CHANGE TO: FORCED: D<i> vs C<j> -- MEANS [<round>]: \"<the MEANS sentence>\" -- ANSWER [<round>]: \"<the holding side\\'s answer>\" -- FAILS: \"<the layer of that answer that fails>\", each quotation word for word in the round it names (ruling 411). ")]
NODES=['Gate_Build','Alt_Gate_Build','Gate_Record','Alt_Gate_Record','Alternate_Merge','Alternate_Merge_Seat']
plan={'base':'pkgGK/patched (0485e2b)','nodes':[]}
for n in NODES:
    f=n+'.js';o=open('pkgGK/patched/'+f).read();s=o
    for a,b in E_ALL+(E_PROMPT if n.endswith('Gate_Build') else []):
        assert s.count(a)==1,(f,a[:60],s.count(a));s=s.replace(a,b)
    open('pkgGF/patched/'+f,'w').write(s);plan['nodes'].append({'file':f,'name':n.replace('_',' '),'base_sha':sha(o),'final_sha':sha(s)})
json.dump(plan,open('pkgGF/plan_GF.json','w'),indent=1);print(len(plan['nodes']),'nodes')
