import re,hashlib
RF_TMPL=("// ORDER (BB-6755): a provider refusal is a failed call, not a round: it throws, and the error output takes it to Failure Salvage as a no-text reply does.\n"
"const RF=(()=>{const d=$input.first().json||{};if(B.fam==='anthropic')return d.stop_reason==='refusal'?'stop_reason=refusal':null;"
"const GB=['SAFETY','RECITATION','BLOCKLIST','PROHIBITED_CONTENT','SPII','IMAGE_SAFETY','IMAGE_PROHIBITED_CONTENT'];"
"if(B.fam==='gemini'){const pf=d.promptFeedback||{};if(pf.blockReason)return 'promptFeedback.blockReason='+pf.blockReason;const f=((d.candidates||[])[0]||{}).finishReason;return GB.includes(f)?'finishReason='+f:null;}"
"const c=(d.choices||[])[0]||{};if(c.finish_reason==='content_filter')return 'finish_reason=content_filter';"
"if(c.native_finish_reason==='content_filter'||c.native_finish_reason==='refusal'||GB.includes(c.native_finish_reason))return 'native_finish_reason='+c.native_finish_reason;"
"if(c.message&&typeof c.message.refusal==='string'&&c.message.refusal.trim()!=='')return 'message.refusal: '+c.message.refusal.trim().slice(0,200);return null;})();\n"
"if(RF)throw new Error('VALIDATION: {LAB} refused by the provider: '+RF+'; output_tokens='+e.u.output_tokens+'. A refusal is not a debate round.'+RT);\n")
ANCH=" // ORDER J (BB-6200)"
out={}
for r in ['D1','C1','D2','C2','D3','C3']:
    s=open(f'base/{r}_Extract.js').read()
    lab=re.search(r"'VALIDATION: ("+r+r" \((?:DEFENDER|CHALLENGER), )'\+B\.fam\+' '\+B\.model\+'\) returned no text",s).group(1)
    ins=RF_TMPL.replace("'VALIDATION: {LAB} refused","'VALIDATION: "+lab+"'+B.fam+' '+B.model+') refused")
    assert s.count(ANCH)==1;s=s.replace(ANCH,ins+ANCH);out[f'{r}_Extract']=s
OLD=r"\**D?([0-9]+)\./i"; NEW=r"\**D?([0-9]+)(?:\.|\s+-{1,3}(?:\s|$))/i"
s=open('base/Extract_Independent_Verdict.js').read();assert s.count(OLD)==2,s.count(OLD)
s=s.replace(OLD,NEW)
C="const chainCount=(t)=>{";assert s.count(C)==1
s=s.replace(C,"// ORDER (BB-6755): a chain line may also be written with a dash after its number (\"D1 -\", \"1 -\"; dashes are folded first).\n"+C)
out['Extract_Independent_Verdict']=s
s=open('base/Panel_Payloads.js').read();assert s.count(OLD)==1;s=s.replace(OLD,NEW);out['Panel_Payloads']=s
for k,v in out.items():
    open(k+'.new.js','w').write(v)
    b=open('base/'+k+'.js').read()
    print(k,'base',hashlib.md5((b+'\n').encode()).hexdigest()[:8],len(b),'new',hashlib.md5((v+'\n').encode()).hexdigest()[:8],len(v))
