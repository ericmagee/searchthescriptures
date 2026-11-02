# patch.py (claude_direct): builds new/<node>.js from base/<node>.js (the live code of ORACLE_DEBATE_V1 version 57222efa, read by GET on
# 2026-11-02). Offline; writes only new/. Anchored replacements: it refuses when an anchor is not found the expected number of times.
# ORDER (operator, 2026-11-02: "yes, I want it ... it best to do it now than do it after the fact"): Anthropic cache diagnostics on the Claude
# debater calls.
#  H1 ROUTE: every debater whose model_config api_model starts with "anthropic/" gets family 'anthropic' (Resolve Seats), so the Build nodes take FAMS index 0 and the existing
#     "<round> Call anthropic" nodes (POST https://api.anthropic.com/v1/messages, credential "Anthropic key" rGnzgJBTBRDmDPA4, anthropic-version
#     2023-06-01, timeout 900 s, retry 3 x 5 s, error output to Failure Salvage) carry every Claude debater call. No node or link is added.
#  H2 MODEL ID: the anthropic body maps the stored OpenRouter id to the direct id in code (__AID): "anthropic/claude-sonnet-5.5" -> "claude-sonnet-5-5"
#     (prefix dropped, dots to hyphens). model_config is unchanged; the stored defender_model/claude_model keep the api_model as today.
#  H3 DIAGNOSTICS: every direct Claude body carries "diagnostics": {"previous_message_id": <id or null>}; the chain is per seat per run: the seat's
#     first Claude call sends null, each later call the "msg_..." id of that seat's previous "<round> Call anthropic" output.
#  H4 EXTRACT: the anthropic branch reads the response's diagnostics and id, writes one CACHE DIAG line (cache_diag) per Claude call, and stores
#     input_tokens as the whole prompt (input_tokens + cache_creation_input_tokens + cache_read_input_tokens), the same measure as the OpenRouter
#     prompt_tokens it replaces, so the run's token columns add up as before; the uncached part is kept as input_uncached_tokens. The refusal
#     check (stop_reason "refusal") also names stop_details.category; the truncation check (stop_reason "max_tokens") is unchanged.
#  H5 SAVE BODY: the CACHE DIAG lines of the round Extracts are copied into review_notes (the existing review-line mechanism; no new column).
import os,sys,re
H=os.path.dirname(os.path.abspath(__file__));B=H+'/base';N=H+'/new';os.makedirs(N,exist_ok=True)
def rep(s,old,new,nm,count=1):
    c=s.count(old)
    if c!=count: sys.exit(f'{nm}: anchor found {c} times, want {count}: {old[:120]!r}')
    return s.replace(old,new)
rd=lambda nm:open(f'{B}/{nm}.js').read()
OUT={}
ROUNDS=['D1','C1','D2','C2','D3','C3','D4','C4']

# ======================= H1: Resolve Seats, the direct route by model =======================
# (coordinator, 2026-11-02, "what happens when we switch to Opus or Fable or Haiku?": a model switch is only a model_config change.) Any debater
# whose model_config api_model starts with "anthropic/" takes family 'anthropic' (the "<round> Call anthropic" nodes), whatever its engine; the
# direct id is checked against the known form here, before any call, and fails closed with a VALIDATION message naming the model.
AID_JS=("const __AID=m=>{const x=String(m||'');return /^anthropic\\//.test(x)?x.slice(10).replace(/\\./g,'-'):x;};"
        "const __AOK=id=>/^claude-(?:opus|sonnet|haiku|fable|mythos)-\\d+(?:-\\d+)?$/.test(String(id||''));")
s=rd('Resolve Seats')
s=rep(s,"const seatModel=s=>{const x=need(s.mc_seat);return {...s,model:x.api_model,tok:tok(s.fam,Number(x.max_tokens))};};",
      "// claude_direct H1/H2 (operator 2026-11-02, cache diagnostics): a debater whose api_model starts with \"anthropic/\" goes to the direct Anthropic API\n"
      "// (family anthropic), any engine; the direct id is the api_model without \"anthropic/\" and with \".\" as \"-\" (anthropic/claude-sonnet-5.5 ->\n"
      "// claude-sonnet-5-5). An id not of the form claude-<opus|sonnet|haiku|fable|mythos>-<n>[-<n>] fails closed. The stored model stays the api_model.\n"
      +AID_JS+"\n"
      "const seatModel=s=>{const x=need(s.mc_seat);const dir=/^anthropic\\//.test(String(x.api_model));if(dir&&!__AOK(__AID(x.api_model)))fail('VALIDATION: seat \"'+s.mc_seat+'\" api_model \"'+x.api_model+'\" maps to the direct Anthropic id \"'+__AID(x.api_model)+'\", which is not a known form (claude-<opus|sonnet|haiku|fable|mythos>-<n>[-<n>]); no call made.');"
      "const f=dir?'anthropic':s.fam;return {...s,fam:f,...(dir?{direct_model:__AID(x.api_model),via_engine_fam:s.fam}:{}),model:x.api_model,tok:tok(f,Number(x.max_tokens))};};",'Resolve Seats')
OUT['Resolve Seats']=s

# ======================= H2 + H3: the Build nodes =======================
for r in ROUNDS:
    nm=r+' Build';s=rd(nm);side,num=r[0],int(r[1])
    blk=("// claude_direct H2/H3 (operator 2026-11-02, cache diagnostics): the direct Anthropic body. __AID maps the stored OpenRouter id to the direct\n"
         "// model id (\"anthropic/claude-sonnet-5.5\" -> \"claude-sonnet-5-5\"). __DIAGPREV: the seat's previous Claude response id in this run, read from\n"
         "// the output of that seat's latest executed \"<round> Call anthropic\" node before this round; null on the seat's first Claude call.\n"
         f"const __RND='{r}';"+AID_JS+"const __AIDV=m=>{const id=__AID(m);if(!__AOK(id))throw new Error('VALIDATION: '+__RND+' the model \"'+m+'\" maps to the direct Anthropic id \"'+id+'\", which is not a known form; no call made.'+RT);return id;};\n"
         "const __DIAGPREV=sd=>{const n=+__RND[1];const top=sd===__RND[0]?n-1:(sd==='D'?n:n-1);for(let k=top;k>=1;k--){let o=null;try{const p=$(sd+k+' Call anthropic');if(!p||!p.isExecuted)continue;o=p.first().json;}catch(e){continue;}if(o&&typeof o.id==='string'&&/^msg_/.test(o.id))return o.id;}return null;};\n"
         "let __DPREV=null;\n")
    s=rep(s,"const FAMS=['anthropic',",blk+"const FAMS=['anthropic',",nm)
    s=rep(s,"if(fam==='anthropic')return {model,max_tokens:tok,system:__sysB(sys),messages:__mk(msgs)};",
          "if(fam==='anthropic')return {model:__AIDV(model),max_tokens:tok,system:__sysB(sys),messages:__mk(msgs),diagnostics:{previous_message_id:__DPREV}};",nm)
    s=rep(s,"const call=(seat,sys,msgs)=>{const idx=FAMS.indexOf(seat.fam);",
          "const call=(seat,sys,msgs)=>{const idx=FAMS.indexOf(seat.fam);__DPREV=seat.fam==='anthropic'?__DIAGPREV(seat===R.defender?'D':'C'):null;",nm)
    s=rep(s,"body:__orc(bodyFor(seat.fam,seat.model,seat.tok,sys,msgs),seat.fam,seat.model,TOK+':'+(seat===R.defender?'defender':'challenger'))};};",
          "body:__orc(bodyFor(seat.fam,seat.model,seat.tok,sys,msgs),seat.fam,seat.model,TOK+':'+(seat===R.defender?'defender':'challenger')),...(seat.fam==='anthropic'?{diag_prev:__DPREV}:{})};};",nm)
    OUT[nm]=s

# ======================= H4: the Extract nodes =======================
ANT_OLD=(" if(fam==='anthropic'){text=((d.content||[]).filter(c=>c.type==='text').map(c=>c.text).join('\\n'))||null;trunc=d.stop_reason==='max_tokens';"
         "const x=d.usage||{};u={input_tokens:x.input_tokens||0,output_tokens:x.output_tokens||0,cache_creation_input_tokens:x.cache_creation_input_tokens||0,cache_read_input_tokens:x.cache_read_input_tokens||0};}")
for r in ROUNDS:
    nm=r+' Extract';s=rd(nm)
    ANT_NEW=(" // claude_direct H4: direct Anthropic. input_tokens excludes the cache there; it is stored as the whole prompt (uncached + written + read), the\n"
             " // measure OpenRouter's prompt_tokens gave, so the run's sums keep their meaning; the cache diagnostics become one CACHE DIAG line.\n"
             " if(fam==='anthropic'){text=((d.content||[]).filter(c=>c.type==='text').map(c=>c.text).join('\\n'))||null;trunc=d.stop_reason==='max_tokens';"
             "const x=d.usage||{};const xi=Number(x.input_tokens)||0,xw=Number(x.cache_creation_input_tokens)||0,xr=Number(x.cache_read_input_tokens)||0;"
             "u={input_tokens:xi+xw+xr,output_tokens:Number(x.output_tokens)||0,cache_creation_input_tokens:xw,cache_read_input_tokens:xr,input_uncached_tokens:xi};"
             "id=typeof d.id==='string'?d.id:null;"
             "const dg=d.diagnostics;const cm=dg&&typeof dg==='object'?dg.cache_miss_reason:undefined;"
             "const why=(dg===null||dg===undefined)?(DP?'null (no divergence)':'null (first Claude call of the seat, previous_message_id=null)'):(cm===null||cm===undefined)?'pending (comparison not finished)':"
             "(String(cm.type||'unknown')+(cm.cache_missed_input_tokens!==undefined&&cm.cache_missed_input_tokens!==null?'; cache_missed_input_tokens='+cm.cache_missed_input_tokens:''));"
             f"cd='[CACHE DIAG {r}: cache_miss_reason='+why+'; read='+xr+'; write='+xw+'; uncached='+xi+'; previous_message_id='+(DP||'null')+'; message_id='+(id||'none')+']';}}")
    s=rep(s,ANT_OLD,ANT_NEW,nm)
    s=rep(s,"const readEnv=(fam,d)=>{let text=null,trunc=false,u={};","const readEnv=(fam,d)=>{let text=null,trunc=false,u={},cd=null,id=null;",nm)
    s=rep(s,"return {text,trunc,u};};","return {text,trunc,u,cd,id};};",nm)
    # DP (the previous_message_id this call sent) must exist before readEnv runs: read it from the Build's call object.
    s=rep(s,f"const B=$('{r} Build').first().json.call;const e=readEnv(B.fam,$input.first().json||{{}});",
          f"const B=$('{r} Build').first().json.call;const DP=B&&B.diag_prev?B.diag_prev:null;const e=readEnv(B.fam,$input.first().json||{{}});",nm)
    s=rep(s,"if(B.fam==='anthropic')return d.stop_reason==='refusal'?'stop_reason=refusal':null;",
          "if(B.fam==='anthropic')return d.stop_reason==='refusal'?'stop_reason=refusal'+(d.stop_details&&d.stop_details.category?' (category '+d.stop_details.category+')':''):null;",nm)
    s=rep(s,"usage:e.u,fam:B.fam,model:B.model","usage:e.u,fam:B.fam,model:B.model,cache_diag:e.cd,msg_id:e.id",nm)
    OUT[nm]=s

# ======================= H5: Build Save Body, the CACHE DIAG lines into review_notes =======================
s=rd('Build Save Body')
s=rep(s,"FF.push(__SU);",
      "FF.push(__SU);\n// claude_direct H5: one CACHE DIAG line per direct Claude call (the round Extracts' cache_diag), in round order; not a review flag.\n"
      "['D1','C1','D2','C2','D3','C3','D4','C4'].forEach(r=>{try{const x=$(r+' Extract').first().json;if(x&&typeof x.cache_diag==='string'&&x.cache_diag)FF.push(x.cache_diag);}catch(e){}});",'Build Save Body')
OUT['Build Save Body']=s

for nm,s in OUT.items(): open(f'{N}/{nm}.js','w').write(s)
print('wrote',len(OUT),'nodes:',', '.join(sorted(OUT)))
