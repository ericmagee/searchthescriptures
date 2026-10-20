import hashlib
def md5(s): return hashlib.md5((s if s.endswith('\n') else s+'\n').encode()).hexdigest()[:8]
def rep(s,a,b,n):
    assert s.count(a)==n,(a,s.count(a)); return s.replace(a,b)
out={}
for nm in ['Build_Independent_Verdict','Panel_Build']:
    s=open('base/'+nm+'.js').read()
    s=rep(s,'CHALLENGER CHAIN MARK: <FORGED|STRAINED|SLACK>','CHALLENGER CHAIN MARK: <FOOTED|STRAINED|SLACK>',1)
    s=rep(s,'OUT-OF-ROUND CONCESSIONS. FORGED = every','OUT-OF-ROUND CONCESSIONS. FOOTED = every',1)
    s=rep(s,'A FORGED challenger chain','A FOOTED challenger chain',1)
    assert 'FORGED' not in s; out[nm]=s
s=open('base/Extract_Independent_Verdict.js').read()
s=rep(s,"const ccmM=src0.match(/^[ \\t]*(?:#+[ \\t]*|[-•][ \\t]*)?CHALLENGER CHAIN MARK[ \\t]*:?[ \\t]*(FORGED|STRAINED|SLACK)\\b/im);\nlet challenger_chain_mark=ccmM?ccmM[1].toUpperCase():null;\n",
 "// ORDER (BB-6819): the top mark is FOOTED (was FORGED). Old raw text still reads: FORGED is stored as FOOTED.\nconst ccmM=src0.match(/^[ \\t]*(?:#+[ \\t]*|[-•][ \\t]*)?CHALLENGER CHAIN MARK[ \\t]*:?[ \\t]*(FOOTED|FORGED|STRAINED|SLACK)\\b/im);\nlet challenger_chain_mark=ccmM?ccmM[1].toUpperCase():null;\nif(challenger_chain_mark==='FORGED')challenger_chain_mark='FOOTED';\n",1)
out['Extract_Independent_Verdict']=s
s=open('base/Build_Save_Body.js').read()
s=rep(s,"(['FORGED','STRAINED','SLACK'].indexOf(d.challenger_chain_mark)!==-1)","(['FOOTED','STRAINED','SLACK'].indexOf(d.challenger_chain_mark)!==-1)",1)
assert 'FORGED' not in s; out['Build_Save_Body']=s
for k,v in out.items():
    open(k+'.new.js','w').write(v); b=open('base/'+k+'.js').read()
    print(k,'base',md5(b),len(b),'new',md5(v),len(v),'delta',len(v)-len(b))
