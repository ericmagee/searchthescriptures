#!/usr/bin/env python3
"""GLOSS CHECK (judge_fix10 G): 5 nodes over the committed live copy kf/fetchback_kf.json (156f7b20)."""
import json, os
ROOT=os.path.dirname(os.path.abspath(__file__))
BASE=json.load(open(os.path.join(ROOT,'..','kf','fetchback_kf.json')))
N={n['name']:n for n in BASE['nodes']}
GL=open(os.path.join(ROOT,'glosscheck.js')).read().strip()
RD=open(os.path.join(ROOT,'render.js')).read().rstrip('\n')
E={
 'L2 Lexicon Plan':[("const U=L2C.lexUrls(ow,{sheet:false});","const U=L2C.lexUrls(ow,{sheet:false}).map(u=>u.replace('select=strongs_number,original_script,transliteration&','select=strongs_number,original_script,transliteration,anchor_gloss&')); /* judge_fix10 G: the gloss is read for the GLOSS CHECK in L2 Count Plan only and dropped there */")],
 'L2 Count Plan':[("return [{json:{tags,claims,counts_url:",GL+"\nconst gloss=__GLOSS(tags,lex);\nreturn [{json:{tags,claims,gloss,counts_url:")],
 'Quote Report':[("return {l2:{tags:P.tags||[],counts},","return {l2:{tags:P.tags||[],counts,gloss:P.gloss||[]},"),("return {l2:{tags:P.tags||[],counts:[]},","return {l2:{tags:P.tags||[],counts:[],gloss:P.gloss||[]},")],
}
for nm in ('Panel Build','Build Independent Verdict'):
    E[nm]=[(" for(const c of (q.l2.counts||[]))L.push(c.side+' ['+c.round+'] count \"'+c.said+'\" ('+(c.num||'no number')+'): '+c.status);\n return L.join(String.fromCharCode(10));})();",
            " for(const c of (q.l2.counts||[]))L.push(c.side+' ['+c.round+'] count \"'+c.said+'\" ('+(c.num||'no number')+'): '+c.status);\n"+RD+"\n return L.join(String.fromCharCode(10));})();")]
for nm,eds in E.items():
    c=N[nm]['parameters']['jsCode'];open(os.path.join(ROOT,'base',nm+'.js'),'w').write(c)
    for a,b in eds:
        assert c.count(a)==1,(nm,a[:60],c.count(a));c=c.replace(a,b)
    open(os.path.join(ROOT,'new',nm+'.js'),'w').write(c)
print('nodes patched',len(E))
