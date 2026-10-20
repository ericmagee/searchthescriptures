import hashlib
def md5(s): return hashlib.md5((s if s.endswith('\n') else s+'\n').encode()).hexdigest()[:8]
def rep(s,a,b,n=1):
    assert s.count(a)==n,(a[:70],s.count(a)); return s.replace(a,b)
T=open('approved_j6.txt').read().rstrip('\n')
assert hashlib.md5(T.encode()).hexdigest()=='cfc42fe5ad97093bdc937f69f43065bc' and '"' not in T and '\\' not in T
code=T.replace('\n','"+NL+"')
END='fully compatible with a BROKEN debate.'
out={}
for nm in ['Build_Independent_Verdict','Panel_Build']:
    s=open('../bb6820/'+nm+'.new.js').read()
    a=s.index('CHALLENGER CHAIN MARK: <FOOTED|STRAINED|SLACK>'); b=s.index(END,a)+len(END)
    assert s.count('CHALLENGER CHAIN MARK: <FOOTED|STRAINED|SLACK>')==1 and s[a-9:a]=='+NL+NL+"' [1:] or True
    t=s[:a]+code+s[b:]
    if nm=='Panel_Build':
        t=rep(t,'OUT-OF-ROUND CONCESSIONS and CHALLENGER CHAIN MARK','OUT-OF-ROUND CONCESSIONS, DEFENDER CHAIN MARK and CHALLENGER CHAIN MARK')
    out[nm]=(s,t)
# extractor (J4)
s=open('../bb6819/Extract_Independent_Verdict.new.js').read()
t=rep(s,"if(challenger_chain_mark==='FORGED')challenger_chain_mark='FOOTED';\n",
 "if(challenger_chain_mark==='FORGED')challenger_chain_mark='FOOTED';\n"
 "// ORDER (BB-6839): the defender's chain takes the same mark, read by the same rule. No REVIEW flag when its line is absent (raised, BB-6840).\n"
 "const dcmM=src0.match(/^[ \\t]*(?:#+[ \\t]*|[-•][ \\t]*)?DEFENDER CHAIN MARK[ \\t]*:?[ \\t]*(FOOTED|FORGED|STRAINED|SLACK)\\b/im);\n"
 "let defender_chain_mark=dcmM?dcmM[1].toUpperCase():null;\n"
 "if(defender_chain_mark==='FORGED')defender_chain_mark='FOOTED';\n")
t=rep(t,"challenger_chain_mark,data_class","challenger_chain_mark,defender_chain_mark,data_class")
out['Extract_Independent_Verdict']=(s,t)
# save body (J2)
s=open('../bb6822/Build_Save_Body.new.js').read()
t=rep(s,"challenger_chain_mark:(['FOOTED','STRAINED','SLACK'].indexOf(d.challenger_chain_mark)!==-1)?d.challenger_chain_mark:null,",
 "challenger_chain_mark:(['FOOTED','STRAINED','SLACK'].indexOf(d.challenger_chain_mark)!==-1)?d.challenger_chain_mark:null,defender_chain_mark:(['FOOTED','STRAINED','SLACK'].indexOf(d.defender_chain_mark)!==-1)?d.defender_chain_mark:null,")
out['Build_Save_Body']=(s,t)
for k,(s,t) in out.items():
    open(k+'.new.js','w').write(t); print(k,md5(s),len(s),'->',md5(t),len(t),'%+d'%(len(t)-len(s)))
