# BB-8403 step 1: S1 panel order (Init Seats, Format Markdown); S2 chatgpt routed through OpenRouter (6 maps in 5 nodes).
import hashlib,sys
OLD_ORDER="['deepseek','gemini','grok','chatgpt','mimo','glm','qwen']"
NEW_ORDER="['deepseek','gemini','glm','chatgpt','mimo','qwen','grok']"
EDITS={
 'Init_Seats.js':[("const ORDER="+OLD_ORDER+";","const ORDER="+NEW_ORDER+";"),
                  ("chatgpt:{fam:'openai',mc:'chatgpt'}","chatgpt:{fam:'openrouter',mc:'chatgpt'}"),
                  ("const JFAM_I={deepseek:'deepseek',gemini:'gemini',grok:'grok',chatgpt:'openai',","const JFAM_I={deepseek:'deepseek',gemini:'gemini',grok:'grok',chatgpt:'openrouter',")],
 'Resolve_Seats.js':[("const JFAM={deepseek:'deepseek',gemini:'gemini',grok:'grok',chatgpt:'openai',","const JFAM={deepseek:'deepseek',gemini:'gemini',grok:'grok',chatgpt:'openrouter',")],
 'Build_Synthesis.js':[("const __JFAM2={deepseek:'deepseek',gemini:'gemini',grok:'grok',chatgpt:'openai',","const __JFAM2={deepseek:'deepseek',gemini:'gemini',grok:'grok',chatgpt:'openrouter',")],
 'Build_Independent_Verdict.js':[("const __JFAM2={deepseek:'deepseek',gemini:'gemini',grok:'grok',chatgpt:'openai',","const __JFAM2={deepseek:'deepseek',gemini:'gemini',grok:'grok',chatgpt:'openrouter',")],
 'Build_Diagnostic_Prompt.js':[("const __JFAM2={deepseek:'deepseek',gemini:'gemini',grok:'grok',chatgpt:'openai',","const __JFAM2={deepseek:'deepseek',gemini:'gemini',grok:'grok',chatgpt:'openrouter',")],
 'Format_Markdown.js':[("const ORDER = "+OLD_ORDER+";","const ORDER = "+NEW_ORDER+";")],
}
for f,eds in EDITS.items():
    t=open('base/'+f,encoding='utf-8').read()
    for a,b in eds:
        n=t.count(a)
        if n!=1: sys.exit(f'{f}: anchor count {n}: {a}')
        t=t.replace(a,b)
    open('new/'+f,'w',encoding='utf-8').write(t)
    print(f, hashlib.md5(open('base/'+f,'rb').read()).hexdigest()[:8],'->',hashlib.md5(t.encode()).hexdigest()[:8])
