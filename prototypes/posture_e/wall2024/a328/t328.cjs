// ASK 328 test: run Alternate Payloads and R2 Alternate Payloads (whole node, live s218 stack vs built) on run 37372's stored call outputs.
const fs=require('fs');const T=require('../tools/lib.cjs');
const OLD=T.unpack(JSON.parse(fs.readFileSync('../a325b/target_325.json'))),NEW=T.unpack(JSON.parse(fs.readFileSync('target_328.json')));
const EX=JSON.parse(fs.readFileSync('ex37372.json'));
const mk=(build,input)=>n=>{if(n===build[0])return {isExecuted:true,all:()=>build[1].map(j=>({json:j})),first:()=>({json:build[1][0]})};return {isExecuted:false,all:()=>[],first:()=>({json:{}})};};
const run=(U,node,$,inp)=>{const code=T.rb(U.L,U.M[node]);return new Function('$','$input','$json','$node','$execution','$workflow',code)($,{all:()=>inp.map(j=>({json:j})),first:()=>({json:inp[0]})},{}, {},{id:'t'},{id:'w'});};
let pass=0,tot=0;const ok=(nm,c,x)=>{tot++;if(c)pass++;console.log((c?'PASS ':'FAIL ')+nm+(x?' | '+x:''));};
const RE=r=>r.ok?null:String(r.why||'')+(r.usage_line?'\n'+r.usage_line:''); // the new reply_error expression (L1633)
const REo=r=>r.ok?null:String(r.why||''); // the live one
const cases=[
 ['call 1 (early reply)','Alternate Payloads',['Alternate Build',EX['Alternate Build'][0]],[], 'USAGE: prompt=104006 completion=64000 reasoning=63997 finish=length max_tokens=64000'],
 ['call 2 (R2 call)','R2 Alternate Payloads',['R2 Alternate Build',EX['R2 Alternate Build'][0]],EX['R2 Alternate Call openrouter'][0],'USAGE: prompt=104006 completion=64000 reasoning=56380 finish=length max_tokens=64000']];
for(const [nm,node,b,inp,want] of cases){let a,c;try{a=run(OLD,node,mk(b),inp);}catch(e){a='ERR '+e.message;}try{c=run(NEW,node,mk(b),inp);}catch(e){c='ERR '+e.message;}
 if(typeof a==='string'||typeof c==='string'){ok(nm+' runs',false,String(a).slice(0,200)+' / '+String(c).slice(0,200));continue;}
 const ra=a[0].json,rc=c[0].json;console.log('  '+nm+' why: '+rc.why);console.log('  '+nm+' usage_line: '+rc.usage_line);
 ok(nm+': why unchanged',ra.why===rc.why&&ra.ok===rc.ok&&rc.ok===false);
 const {usage_line,...rest}=rc;ok(nm+': every other field identical',JSON.stringify(ra)===JSON.stringify(rest));
 ok(nm+': reply_error ends with the expected USAGE line',RE(rc).endsWith('\n'+want)&&RE(rc).startsWith(REo(ra)),JSON.stringify(RE(rc).slice(-110)));
 ok(nm+': request body byte-identical',JSON.stringify(b[1][0].alt.body)===JSON.stringify(rc.alt.body));}
// plants on the function alone
const F=T.load(T.rb(NEW.L,NEW.M['Alternate Payloads']),()=>({isExecuted:false,all:()=>[],first:()=>({json:{}})})).__use328;
const NR='USAGE: prompt=not reported completion=not reported reasoning=not reported finish=not reported';
ok('plant: call failed (aborted), no reply',F({error:'aborted'},{body:{max_tokens:64000}})===NR+' max_tokens=64000',F({error:'aborted'},{body:{max_tokens:64000}}));
ok('plant: no max_tokens in the body',F({usage:{prompt_tokens:5,completion_tokens:2},choices:[{finish_reason:'stop'}]},{body:{}})==='USAGE: prompt=5 completion=2 reasoning=not reported finish=stop max_tokens=not reported');
ok('plant: native Gemini usage',F({usageMetadata:{promptTokenCount:9,candidatesTokenCount:4,thoughtsTokenCount:3},candidates:[{finishReason:'MAX_TOKENS'}]},{body:{max_tokens:10}})==='USAGE: prompt=9 completion=4 reasoning=3 finish=MAX_TOKENS max_tokens=10');
ok('plant: null reply',F(null,null)===NR+' max_tokens=not reported');
ok('plant: success row unchanged (no usage_line on ok)',RE({ok:true,why:null,usage_line:'x'})===null);
ok('plant: function does not change its inputs',(()=>{const r={usage:{prompt_tokens:1}},a={body:{max_tokens:7,model:'m'}};const s=JSON.stringify([r,a]);F(r,a);return JSON.stringify([r,a])===s;})());
console.log('TOTAL',pass,'of',tot);
