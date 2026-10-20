# BB-6904 step 6 (Worker_A3): (e) report shape, (f) token accounting. Draft only: nothing is written to the flow.
# Usage: python3 mk6.py <live workflow details json (db281705)> <Worker_E p4 dir> <out dir> [<5B Panel_Cure_Check.js>]
# Rev 4: the optional fourth argument is Worker_E's 5B Panel_Cure_Check.js (p5b/out); when given it replaces p4's file of that name, so
# the step 6 patches land on top of 5B's drv_uncured change instead of beside it (both edit the same node).
# Patches, each asserted to apply exactly once:
#  1. cureReport (in cure_lib.js and the six cure nodes that embed it): fixed field order, original line added (6904 e).
#  2. Format Markdown: a "Debate rule violations" section built from the stored rows (6913 note 1).
#  3. Build Save Body: the single cure call's tokens join the row's sums.
#  4. Panel Tokens: the panel cure calls' tokens join the panel sums.
import json,sys,hashlib,os
md5=lambda s:hashlib.md5((s if s.endswith('\n') else s+'\n').encode()).hexdigest()
w=json.load(open(sys.argv[1]))['workflow'];N={n['name']:n for n in w['nodes']};P4=sys.argv[2];OUT=sys.argv[3];P5B=sys.argv[4] if len(sys.argv)>4 else None;os.makedirs(OUT,exist_ok=True)
def once(src,old,new,what):
  n=src.count(old);assert n==1,'%s: anchor found %d times'%(what,n);return src.replace(old,new)
OLD_SAFE="const cureSafe=s=>String(s).replace(/\\[/g,'(').replace(/\\]/g,')');"
NEW_SAFE="const cureSafe=s=>String(s).replace(/\\[/g,'(').replace(/\\]/g,')').replace(/;(\\s*(?:SEAT|ITEM|RULE|RESULT|KINDS|WHY|LINE|STATEMENT):)/g,',$1');"
OLD_REP=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'old_report.txt')).read().rstrip('\n')
NEW_REP=("// Report line (step 6, 6904 e): fixed fields in fixed order, read back by Format Markdown. SEAT (panel only), ITEM, RULE, RESULT, then\n"
 "// KINDS, WHY, LINE (the judge's original line, cut at 300 characters with \"...\") and STATEMENT when present; judge text has its brackets made round and any \"; KEY:\" broken.\n"
 "function cureReport(seat,v){return v.map(x=>'[AUDIT v21: DEBATE RULE VIOLATION REPORT -- '+(seat?'SEAT: '+seat+'; ':'')+'ITEM: '+(x.rule==='K-G3'?x.side+' STANDING':x.link)+'; RULE: '+x.rule+'; RESULT: '+x.status\n"
 " +(x.kinds&&x.kinds.length?'; KINDS: '+x.kinds.join(', '):'')+(x.why?'; WHY: '+cureSafe(x.why):'')+(x.line?'; LINE: '+cureSafe((l=>l.length>300?l.slice(0,297)+'...':l)(String(x.line).replace(/\\s+/g,' ').trim())):'')\n"
 " +(x.statement?'; STATEMENT: '+cureSafe(x.statement.slice(0,600)):'')+']');}")
res={}
# Worker_E's p4 at 6c36658 (serial slots, BB-6987): the panel Build and Normalize are three files each.
for f in ['cure_lib.js','Cure_Build.js','Cure_Normalize.js','Cure_Check.js']+['Panel_Cure_%s_%d.js'%(n,k) for k in (1,2,3) for n in ('Build','Normalize')]+['Panel_Cure_Check.js']:
  src=P5B if (f=='Panel_Cure_Check.js' and P5B) else os.path.join(P4,f)
  s=open(src).read();b=md5(s);s=once(s,OLD_SAFE,NEW_SAFE,f+' cureSafe');s=once(s,OLD_REP,NEW_REP,f+' cureReport')
  open(os.path.join(OUT,f),'w').write(s);res[f]=(b[:8],md5(s)[:8],len(s)-len(open(src).read()))
# 2. Format Markdown
fm=N['Format Markdown']['parameters']['jsCode'];b=md5(fm)
ANCH="t += '---\\n\\n';\nt += '## How to read this debate"
SEC=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'fm_section.js')).read().rstrip('\n')+'\n'
fm2=once(fm,ANCH,SEC+ANCH,'Format Markdown');open(os.path.join(OUT,'Format_Markdown.js'),'w').write(fm2);res['Format Markdown']=(b[:8],md5(fm2)[:8],len(fm2)-len(fm))
# 3. Build Save Body: cure call usage (chat or Gemini form) joins __A.
bs=N['Build Save Body']['parameters']['jsCode'];b=md5(bs)
OLDA="const __A=__R.concat(__J);"
NEWA=("// Step 6 (6904 f): the single judge's cure call, when made, joins the sums; chat form (usage) or Gemini form (usageMetadata).\n"
 "const __CU=['deepseek','openai','gemini','grok','mimo','openrouter'].map(f=>{let j=null;try{if(!$('Cure Call '+f).isExecuted)return null;j=$('Cure Call '+f).first().json;}catch(e){return null;}if(!j)return null;"
 "if(j.usageMetadata){const m=j.usageMetadata;return {input_tokens:Number(m.promptTokenCount)||0,output_tokens:(Number(m.candidatesTokenCount)||0)+(Number(m.thoughtsTokenCount)||0),cache_creation_input_tokens:0,cache_read_input_tokens:Number(m.cachedContentTokenCount)||0};}"
 "const u=j.usage||{};return {input_tokens:Number(u.prompt_tokens)||0,output_tokens:Number(u.completion_tokens)||0,cache_creation_input_tokens:0,cache_read_input_tokens:Number((u.prompt_tokens_details&&u.prompt_tokens_details.cached_tokens)||u.prompt_cache_hit_tokens)||0};}).filter(Boolean);\n"
 "const __A=__R.concat(__J).concat(__CU);")
bs2=once(bs,OLDA,NEWA,'Build Save Body');open(os.path.join(OUT,'Build_Save_Body.js'),'w').write(bs2);res['Build Save Body']=(b[:8],md5(bs2)[:8],len(bs2)-len(bs))
# 4. Panel Tokens: every item of each panel cure call (one node may serve two seats of one family).
pt=N['Panel Tokens']['parameters']['jsCode'];b=md5(pt)
OLDG="const go=!!(pre&&S.regrade!==true&&S.dry!==true);"
NEWG=("// Step 6 (6904 f): the panel cure calls of the three serial slots (BB-6987) and the step 7 alternate calls (absent before step 7 is\n// published; a missing node is skipped) join the sums, every item of each node.\n"
 "for(const n of [1,2,3].flatMap(k=>['deepseek','openai','gemini','grok','mimo','openrouter'].map(f=>'Panel Cure Call '+k+' '+f)).concat(['Alternate Call openrouter','Alternate Cure Call openrouter'])){let a=[];try{if(!$(n).isExecuted)continue;a=$(n).all().map(x=>x.json);}catch(x){continue;}\n"
 " for(const j of a){if(!j)continue;if(j.usageMetadata){const m=j.usageMetadata;add.i+=Number(m.promptTokenCount)||0;add.o+=(Number(m.candidatesTokenCount)||0)+(Number(m.thoughtsTokenCount)||0);add.r+=Number(m.cachedContentTokenCount)||0;seen.push(n);}\n"
 "  else if(j.usage){const u=j.usage;add.i+=Number(u.prompt_tokens)||0;add.o+=Number(u.completion_tokens)||0;add.r+=Number((u.prompt_tokens_details&&u.prompt_tokens_details.cached_tokens)||u.prompt_cache_hit_tokens)||0;seen.push(n);}}}\n"
 +OLDG)
pt2=once(pt,OLDG,NEWG,'Panel Tokens');open(os.path.join(OUT,'Panel_Tokens.js'),'w').write(pt2);res['Panel Tokens']=(b[:8],md5(pt2)[:8],len(pt2)-len(pt))
for k,v in res.items():print('%-24s %s -> %s  %+d chars'%(k,*v))
