# BB-6904 revision 4 (7107, 7108): the alternates' token cap and the null-content reason. Usage: mk8.py <composed.json> <out.json>
import json,sys,hashlib
src,out=sys.argv[1],sys.argv[2]
w=json.load(open(src));N={n['name']:n for n in w['nodes']}
def sub(name,old,new):
    c=N[name]['parameters']['jsCode']
    if c.count(old)!=1: sys.exit('FAIL '+name+': patch point found '+str(c.count(old))+' times, not 1')
    N[name]['parameters']['jsCode']=c.replace(old,new)
CAP='64000'
sub('Init Seats',
 "const ALT_MODELS={alt_minimax31:{api_model:'minimax/minimax-m3.1-flash',family:'minimax'},alt_minimax3:{api_model:'minimax/minimax-m3',family:'minimax'}};",
 "// Token cap (7107, 7108): at 32000 M3 spent 27413-29310 on reasoning and was cut off (27383, 7105). The ceiling is 262144; the call's\n"
 "// 900 s time limit binds first (about 84 tokens/s measured, 7109), so the cap is "+CAP+". The cure call inherits it from the body.\n"
 "const ALT_MAX_TOKENS="+CAP+";\n"
 "const ALT_MODELS={alt_minimax31:{api_model:'minimax/minimax-m3.1-flash',family:'minimax',max_tokens:ALT_MAX_TOKENS},alt_minimax3:{api_model:'minimax/minimax-m3',family:'minimax',max_tokens:ALT_MAX_TOKENS}};")
sub('Resolve Seats',
 "api_model:AM[k].api_model,max_tokens:32000,family:AM[k].family}))",
 "api_model:AM[k].api_model,max_tokens:capOf(k),family:AM[k].family}))")
sub('Resolve Seats',
 "const AM=S.alt_models||{};const alternates=",
 "const AM=S.alt_models||{};const capOf=k=>{const m=Number(AM[k]&&AM[k].max_tokens);if(!(m>0))fail('alternate \"'+k+'\" has no max_tokens (7107).');return m;};const alternates=")
sub('Alternate Build',
 "api_model:AM[qk].api_model,max_tokens:32000,family:AM[qk].family}]",
 "api_model:AM[qk].api_model,max_tokens:(()=>{const m=Number(AM[qk].max_tokens);if(!(m>0))throw new Error('FAIL-CLOSED: alternate \"'+qk+'\" has no max_tokens (7107).');return m;})(),family:AM[qk].family}]")
sub('Alternate Payloads',
 "function envelope(seat,j){\n",
 "function envelope(seat,j){\n // 7107 item 4: a normal chat envelope whose content is null names what happened.\n if(j&&j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content===null)throw new Error('seat \"'+seat+'\" returned content null (finish_reason '+(j.choices[0].finish_reason||'none')+'). NO ROW IS WRITTEN.'+RT);\n")
sub('Alternate Payloads',
 "const env=envelope(a.seat,raw);const v=verdict(a.seat,env.text);",
 "const env=envelope(a.seat,raw);let v;try{v=verdict(a.seat,env.text);}catch(e){throw new Error(String(e&&e.message||e)+' (finish_reason '+(env.finish||'none')+')');}")
json.dump(w,open(out,'w'),ensure_ascii=False,separators=(',',':'))
print('OK',hashlib.md5(open(out,'rb').read()).hexdigest())
