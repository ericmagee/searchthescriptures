import sys,hashlib
# D3 of BB-8327: K-S and the new chain-stating key K-C gain a clearing branch in Build Save Body __FK and Format Markdown flagKey.
ITEM=r'(D\d+(?: vs C\d+)?|REASONING|KEYSTONE|RESULT|(?:DEFENSE|CHALLENGE) STANDING|(?:CHALLENGER )?CONCEDED LINKS)(?=[ ;:.,\]]|$)'
def patch(src, anchor, new):
    n=src.count(anchor)
    assert n==1, (anchor[:60], n)
    return src.replace(anchor, new)
b=open('base/Build_Save_Body.js',encoding='utf-8').read()
A1="const __FK=x=>{let m=x.match(/\\((K-G\\d)\\) -- (D\\d+ vs C\\d+)/);"
N1="const __FK=x=>{let m=x.match(/\\((K-S|K-C)\\) -- "+ITEM+"/);if(m)return m[1]+'|'+m[2].toUpperCase();m=x.match(/\\((K-G\\d)\\) -- (D\\d+ vs C\\d+)/);"
b2=patch(b,A1,N1)
f=open('base/Format_Markdown.js',encoding='utf-8').read()
A2="const flagKey = x => { let m = x.match(/\\((K-G\\d)\\) -- (D\\d+ vs C\\d+)/);"
N2="const flagKey = x => { let m = x.match(/\\((K-S|K-C)\\) -- "+ITEM+"/); if (m) return m[1] + '|' + m[2].toUpperCase(); m = x.match(/\\((K-G\\d)\\) -- (D\\d+ vs C\\d+)/);"
f2=patch(f,A2,N2)
open('new/Build_Save_Body.js','w',encoding='utf-8').write(b2)
open('new/Format_Markdown.js','w',encoding='utf-8').write(f2)
for p in ['base/Build_Save_Body.js','new/Build_Save_Body.js','base/Format_Markdown.js','new/Format_Markdown.js']:
    s=open(p,encoding='utf-8').read(); print(p,len(s),hashlib.md5(s.encode()).hexdigest())
