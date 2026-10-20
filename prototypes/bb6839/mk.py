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
    if nm=='Build_Independent_Verdict':
        t=rep(t,"const __out={...d,audit_prompt:'ODV1-A1',","// ORDER (BB-6843): ODV1-A2 = the J6 prompt, which asks for both chain-mark lines; the extractor flags either absent line only under it.\nconst __out={...d,audit_prompt:'ODV1-A2',",1)
    if nm=='Panel_Build':
        t=rep(t,'OUT-OF-ROUND CONCESSIONS and CHALLENGER CHAIN MARK','OUT-OF-ROUND CONCESSIONS, DEFENDER CHAIN MARK and CHALLENGER CHAIN MARK')
    out[nm]=(s,t)
# extractor (J4)
s=open('../bb6819/Extract_Independent_Verdict.new.js').read()
t=rep(s,"if(challenger_chain_mark==='FORGED')challenger_chain_mark='FOOTED';\n",
 "if(challenger_chain_mark==='FORGED')challenger_chain_mark='FOOTED';\n"
 "// ORDER (BB-6839, BB-6843): the defender's chain takes the same mark, read by the same rule; its absent line is flagged as the challenger's is,\n"
 "// but only on text from a prompt that asks for it (audit_prompt ODV1-A2, the J6 prompt); older text records it without a flag.\n"
 "const dcmM=src0.match(/^[ \\t]*(?:#+[ \\t]*|[-•][ \\t]*)?DEFENDER CHAIN MARK[ \\t]*:?[ \\t]*(FOOTED|FORGED|STRAINED|SLACK)\\b/im);\n"
 "let defender_chain_mark=dcmM?dcmM[1].toUpperCase():null;\n"
 "if(defender_chain_mark==='FORGED')defender_chain_mark='FOOTED';\n")
t=rep(t,"challenger_chain_mark,data_class","challenger_chain_mark,defender_chain_mark,data_class")
t=rep(t,"const asked=(prev&&(prev.audit_prompt==='W1-A1'||prev.audit_prompt==='ODV1-A1'));",
 "const asked=(prev&&(prev.audit_prompt==='W1-A1'||prev.audit_prompt==='ODV1-A1'||prev.audit_prompt==='ODV1-A2'));\nconst askedD=(prev&&prev.audit_prompt==='ODV1-A2');")
CHN="if(challenger_chain_mark===null){raw+=asked?'\\n\\n[AUDIT v18: CHALLENGER CHAIN MARK LINE ABSENT FROM A PROMPT THAT ASKS FOR IT. REVIEW THIS ROW.]':'\\n\\n[AUDIT v18: CHALLENGER CHAIN MARK not asked by the prompt that produced this text; null recorded, no flag.]';}\n"
t=rep(t,CHN,CHN+"if(defender_chain_mark===null){raw+=askedD?'\\n\\n[AUDIT v20: DEFENDER CHAIN MARK LINE ABSENT FROM A PROMPT THAT ASKS FOR IT. REVIEW THIS ROW.]':'\\n\\n[AUDIT v20: DEFENDER CHAIN MARK not asked by the prompt that produced this text; null recorded, no flag.]';}\n")
out['Extract_Independent_Verdict']=(s,t)
# save body (J2)
s=open('../bb6822/Build_Save_Body.new.js').read()
t=rep(s,"challenger_chain_mark:(['FOOTED','STRAINED','SLACK'].indexOf(d.challenger_chain_mark)!==-1)?d.challenger_chain_mark:null,",
 "challenger_chain_mark:(['FOOTED','STRAINED','SLACK'].indexOf(d.challenger_chain_mark)!==-1)?d.challenger_chain_mark:null,defender_chain_mark:(['FOOTED','STRAINED','SLACK'].indexOf(d.defender_chain_mark)!==-1)?d.defender_chain_mark:null,")
out['Build_Save_Body']=(s,t)
for k,(s,t) in out.items():
    open(k+'.new.js','w').write(t); print(k,md5(s),len(s),'->',md5(t),len(t),'%+d'%(len(t)-len(s)))
