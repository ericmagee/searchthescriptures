import sys,hashlib
L='/tmp/claude-0/-home-user-searchthescriptures/58ba9d31-f07a-5e6e-a230-4fe44a036213/scratchpad/fix27035/live/'
lib=open('lib.js').read()
def load(n):
    s=open(L+n).read()
    assert s.endswith('\n'); return s[:-1]   # strip the jq -r newline: build files equal the stored jsCode
def rep(s,a,b):
    c=s.count(a); assert c==1,(a[:70],c); return s.replace(a,b)
out={}
s=load('Panel_Build.js')
s=rep(s,"const NL=String.fromCharCode(10);\nconst KJVC=", lib+"\nconst LEDGER=PWL.judgeBlock({cr1:F.cr1,gr1:F.gr1,cr2:F.cr2,gr2:F.gr2,cr3:F.cr3,dr3:F.dr3});\nconst NL=String.fromCharCode(10);\nconst KJVC=")
s=rep(s,",KJVC,'',",",KJVC,'',LEDGER,'',")
out['Panel_Build']=s
s=load('Build_Independent_Verdict.js')
s=rep(s,"const d=$('Final Output').first().json;const NL=String.fromCharCode(10);","const d=$('Final Output').first().json;const NL=String.fromCharCode(10);\n"+lib+"\nconst LEDGER=PWL.judgeBlock({cr1:d.cr1,gr1:d.gr1,cr2:d.cr2,gr2:d.gr2,cr3:d.cr3,dr3:d.dr3});")
s=rep(s,"+NL+NL+KJVC+NL+NL+","+NL+NL+KJVC+NL+NL+LEDGER+NL+NL+")
out['Build_Independent_Verdict']=s
s=load('D3_Build.js')
s=rep(s,"const sys=I.dsys;",lib+"\nconst PV=PWL.roundBlock($('C2 Extract').first().json.raw,PWL.DEF_RE);\nconst sys=I.dsys;")
s=rep(s,"$('C2 Extract').first().json.raw+'\\n\\nLINK ROUND","$('C2 Extract').first().json.raw+(PV?'\\n\\n'+PV:'')+'\\n\\nLINK ROUND")
out['D3_Build']=s
s=load('C3_Build.js')
s=rep(s,"const sys=I.csys;",lib+"\nconst PV=PWL.roundBlock($('D3 Extract').first().json.raw,PWL.CH_RE);\nconst sys=I.csys;")
s=rep(s,"$('D3 Extract').first().json.raw+'\\n\\nLINK ROUND","$('D3 Extract').first().json.raw+(PV?'\\n\\n'+PV:'')+'\\n\\nLINK ROUND")
out['C3_Build']=s
for k,v in out.items():
    open(k+'.new.js','w').write(v)
    print(k,hashlib.md5(v.encode()).hexdigest(),len(v.encode()))
