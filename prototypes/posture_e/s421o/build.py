import json
d=json.load(open('s421n/fetchback_s421n.json'));C={n['name']:n['parameters'].get('jsCode') or '' for n in d['nodes']}
v=C['Enforcer Build'];open('s421o/base/Enforcer Build.js','w').write(v)
i=v.index('const excerpt=(rk,s)=>');j=v.index("const G=[];")
new_ex=open('s421o/excerpt.js').read()
v2=v[:i]+new_ex+v[j:]
a="\\nROUND EXCERPT ['+(g.rk||'?')+']:\\n'+excerpt(g.rk,g.sent)+"
assert v2.count(a)==1,v2.count(a)
v2=v2.replace(a,"\\nTHE SIDE\\'S OWN BLOCKS FOR THIS LINK, FROM EVERY ROUND OF THAT SIDE:\\n'+excerpt(g.rk,g.sent,g.lab)+")
a2="g={key:key(r),rule:r.rule,rk:rkOf(r),sent:sentOf(r),item:r.item,ans:[]};"
assert v2.count(a2)==1
v2=v2.replace(a2,"g={key:key(r),rule:r.rule,rk:rkOf(r),sent:sentOf(r),item:r.item,lab:(String(r.item||'').match(/(?:CR|DR)[1-4]\\s+(.+?)\\s+#\\d+$/)||[])[1]||null,ans:[]};")
a3="const key=r=>r.rule+'|'+rkOf(r)+'|'+clean(sentOf(r)).slice(0,120);"
assert v2.count(a3)==1
v2=v2.replace(a3,"const key=r=>r.rule+'|'+String(r.item||'').replace(/\\s*#\\d+$/,'')+'|'+clean(sentOf(r)).slice(0,120); /* ruling 424: \"I grant that.\" under D3 and under D5 are two items */")
rs=v2.index("const RULES=");re_=v2.index("const USER=")
v2=v2[:rs]+open('s421o/rules.js').read()+v2[re_:]
open('s421o/new/Enforcer Build.js','w').write(v2);print('ok')
