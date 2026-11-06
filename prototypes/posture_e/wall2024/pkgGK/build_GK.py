# pkgGK (W3 2302): (a) the gate's re-read K-G4 item is decided by the panel cure check's K-G4 test (pkgGK/g4cure.js); (c) E-APPLY's K-S3 row match
# reads the quote as the row's first quoted span, so a tag written without "--" ("... TOUCHES NO LINK") is not read as part of the quote (32998
# chatgpt S2 to S4). (b) is W1's pkgGKW (KEEP withdraws a refused E-APPLY change), the base here for 6 gate-library nodes.
# (d) (W3 2306): kg4Witnesses takes a line's anchor verses as its witnesses only when it names none outside its first parentheses, and only those
# the pressing round names (32998 chatgpt G5: the pressed witnesses Isaiah 7:16 and 8:8 are the anchor). In all 19 cure-library nodes (13 from pkgG4W). Run from wall2024/.
import json,hashlib
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
G4=open('pkgGK/g4cure.js').read()
E=[("function gateCure2024(seat,raw,F,its,G,reply,ctx){",G4+"function gateCure2024(seat,raw,F,its,G,reply,ctx){"),
 ("  else{cured=!now.has(x.key)&&applied.has(x.gid);",
  "  else if(x.kind==='RULE K-G4'&&applied.has(x.gid)&&now.has(x.key)){const g=gateG4Cure2024(x,(R2.items||[]).find(z=>z.key===x.key),a.to,ctx);cured=g.cured;why=g.why;} // pkgGK (a)\n  else{cured=!now.has(x.key)&&applied.has(x.gid);"),
 ("if(!o){const m=to.match(SB_ROW);if(m){const q=nrm(m[3]).replace(/^[\"\\u201c]+|[\"\\u201d]+$/g,'').toUpperCase();",
  "if(!o){const m=to.match(SB_ROW);const rq=s=>{const t=nrm(s);const k=t.match(/[\"\\u201c]([^\"\\u201d]+)[\"\\u201d]/);return (k?k[1]:t.replace(/\\s+(?:TOUCHES NO LINK|COUNTED)\\b[\\s\\S]*$/i,'').replace(/^[\"\\u201c]+|[\"\\u201d]+$/g,'')).trim().toUpperCase();}; /* pkgGK (c): the row's first quoted span, so a tag written without \"--\" is not read into the quote (32998 chatgpt S2 to S4) */if(m){const q=rq(m[3]);"),
 ("&&nrm(r[3]).replace(/^[\"\\u201c]+|[\"\\u201d]+$/g,'').toUpperCase()===q;})||null;}}","&&rq(r[3])===q;})||null;}}")]
NODES=['Gate_Build','Alt_Gate_Build','Gate_Record','Alt_Gate_Record','Alternate_Merge','Alternate_Merge_Seat']
plan={'base':'pkgGKW/patched (5a227f3)','nodes':[]}
for n in NODES:
    f=n+'.js';o=open('pkgGKW/patched/'+f).read();s=o
    for a,b in E:
        assert s.count(a)==1,(f,a[:60],s.count(a));s=s.replace(a,b)
    open('pkgGK/patched/'+f,'w').write(s);plan['nodes'].append({'file':f,'name':n.replace('_',' '),'base_sha':sha(o),'final_sha':sha(s)})
D_OLD="const P=new Set(cureRefs(pressText||'').map(r=>r.key));const BP=B0.filter(k=>P.has(k));return BP.length?BP:B0;}"
D_NEW="const P=new Set(cureRefs(pressText||'').map(r=>r.key));if(!B0.length){const AP=[...an].filter(k=>P.has(k));if(AP.length)return AP;} /* pkgGK (d), W3 2306: a line that names no witness outside its anchor takes the anchor verses the pressing round names */const BP=B0.filter(k=>P.has(k));return BP.length?BP:B0;}"
import os
done={x['file']:x for x in plan['nodes']}
for f in sorted(os.listdir('pkgG4W/patched')):
    src='pkgGK/patched/'+f if f in done else 'pkgG4W/patched/'+f
    s0=open(src).read()
    if s0.count(D_OLD)==0:continue
    assert s0.count(D_OLD)==1,f
    s1=s0.replace(D_OLD,D_NEW);open('pkgGK/patched/'+f,'w').write(s1)
    if f in done:done[f]['final_sha']=sha(s1)
    else:o=open('pkgG4W/patched/'+f).read();plan['nodes'].append({'file':f,'name':f[:-3].replace('_',' '),'base':'pkgG4W/patched','base_sha':sha(o),'final_sha':sha(s1)})
plan['base']='pkgGKW/patched (5a227f3) for the 6 gate-library nodes; pkgG4W/patched (45fa978) for the other 13'
json.dump(plan,open('pkgGK/plan_GK.json','w'),indent=1);print(len(plan['nodes']),'nodes');[print(' ',x['name'],x['base_sha'],'->',x['final_sha']) for x in plan['nodes']]
