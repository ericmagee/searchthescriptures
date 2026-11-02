const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
// PANEL FALLBACK (BB-5685 design, BB-5693 S3, WALL-0966 1328-1330). Runs after the three panel calls and before Panel Payloads.
// It classifies each slot with Panel Payloads' own checks. No failure: it passes through. Exactly one failure, with the fallback
// on (or a dry test input) and a reserve seat free: the run goes to the reserve judge. Anything else throws the FAIL-CLOSED text,
// and the run ends at Panel Failure Note with the transcript saved, as before the fallback.
const FALLBACK_ON=true;
const S=$('Init Seats').first().json;const P=$('Panel Build').first().json;const RES=$('Resolve Seats').first().json.reserve||null;const TAGS=['HELD','PARTIAL','BROKEN'];const STAND=['SELF-SUPPORTED','PROP-DEPENDENT','COLLAPSED'];
const SLOT_NODES=[['Panel Judge 1 deepseek','Panel Judge 1 openai','Panel Judge 1 gemini','Panel Judge 1 grok','Panel Judge 1 mimo','Panel Judge 1 openrouter'],['Panel Judge 2 openai','Panel Judge 2 gemini','Panel Judge 2 grok','Panel Judge 2 mimo','Panel Judge 2 openrouter'],['Panel Judge 3 openai','Panel Judge 3 gemini','Panel Judge 3 grok','Panel Judge 3 mimo','Panel Judge 3 openrouter']];
const ran=names=>names.filter(n=>{try{return $(n).isExecuted;}catch(e){return false;}});
function envelope(seat,j){
 if(j&&j.choices&&j.choices[0]&&j.choices[0].message&&typeof j.choices[0].message.content==='string')return {text:j.choices[0].message.content,finish:j.choices[0].finish_reason||null};
 if(j&&j.candidates&&j.candidates[0]&&j.candidates[0].content&&Array.isArray(j.candidates[0].content.parts)){const t=j.candidates[0].content.parts.filter(p=>!p.thought&&typeof p.text==='string').map(p=>p.text).join('');if(t)return {text:t,finish:j.candidates[0].finishReason||null};}
 throw new Error('FAIL-CLOSED: seat "'+seat+'" returned an envelope this parser does not recognise. Top-level keys: ['+Object.keys(j||{}).join(',')+']. NO ROW IS WRITTEN.'+RT);}
// READER REPAIR (BB-5700 step 3): a judge sometimes leaves a double quotation mark unescaped inside the text of its last key, "reasoning"
// (ODV1-25634, gemini). When JSON.parse fails, escape only the bare quotation marks inside that one string value and parse once more.
// The five graded keys come before "reasoning" in the required form and are never touched; if any key follows "reasoning", the repair
// swallows it, the closed-set checks then fail, and the seat fails closed as before.
function repairReasoning(x){const m=/"reasoning"\s*:\s*"/.exec(x);if(!m)return null;const vs=m.index+m[0].length;
 const ve=x.lastIndexOf('"');if(ve<vs||!/^"\s*}\s*$/.test(x.slice(ve)))return null;let out='',bs=0;
 for(let i=vs;i<ve;i++){const c=x[i];if(c==='\\'){bs++;out+=c;continue;}if(c==='"'&&bs%2===0)out+='\\"';else out+=c;bs=0;}
 return x.slice(0,vs)+out+x.slice(ve);}
function verdict(seat,text){let s=String(text).trim();s=s.replace(/^```[a-zA-Z]*\s*/,'').replace(/```\s*$/,'').trim();const a=s.indexOf('{');const b=s.lastIndexOf('}');
 if(a===-1||b===-1||b<=a)throw new Error('FAIL-CLOSED: seat "'+seat+'" returned no JSON object. First 200 chars: '+s.slice(0,200)+RT);
 const x=s.slice(a,b+1);try{return JSON.parse(x);}catch(e){const r=repairReasoning(x);if(r!==null){try{return JSON.parse(r);}catch(e2){}}throw new Error('FAIL-CLOSED: seat "'+seat+'" JSON did not parse: '+e.message+RT);}}
function intOrFail(seat,f,v){const n=Number(v);if(!Number.isInteger(n)||n<0)throw new Error('FAIL-CLOSED: seat "'+seat+'" field '+f+' is not an integer >= 0. Got: '+JSON.stringify(v)+RT);return n;}
function classify(seat,raw){
 if(raw&&raw.error){const e=raw.error;const m=String((typeof e==='string')?e:((e&&(e.message||e.description))||JSON.stringify(e))).slice(0,300);const code=(e&&typeof e==='object'&&(e.httpCode||e.status||e.statusCode))||null;
  const kind=/timeout|timed out|ETIMEDOUT|ECONNABORTED/i.test(m)?'timeout':(/\b40[13]\b|refus|safety|blocked|content.?policy/i.test(m+' '+(code||''))?'refused':'error');
  const det=(code?'status '+code+': ':'')+m;return {ok:false,kind,detail:det,msg:'FAIL-CLOSED: seat "'+seat+'" judge call failed ('+kind+'): '+det+RT};}
 try{const env=envelope(seat,raw);const v=verdict(seat,env.text);
  if(TAGS.indexOf(v.verdict_tag)===-1)throw new Error('FAIL-CLOSED: seat "'+seat+'" verdict_tag "'+v.verdict_tag+'" is outside the closed set.'+RT);
  if(STAND.indexOf(v.defense_standing)===-1)throw new Error('FAIL-CLOSED: seat "'+seat+'" defense_standing "'+v.defense_standing+'" is outside the closed set.'+RT);
  if(STAND.indexOf(v.challenge_standing)===-1)throw new Error('FAIL-CLOSED: seat "'+seat+'" challenge_standing "'+v.challenge_standing+'" is outside the closed set.'+RT);
  intOrFail(seat,'conceded_links',v.conceded_links);intOrFail(seat,'challenger_conceded_links',v.challenger_conceded_links);return {ok:true};}
 catch(e){const m=String(e.message);return {ok:false,kind:'no_usable_judgment',detail:m.replace(RT,'').slice(0,300),msg:m};}}
const fails=[];
P.judges.forEach((jd,i)=>{const r=ran(SLOT_NODES[i]);if(r.length!==1)throw new Error('FAIL-CLOSED: panel slot '+(i+1)+' ('+jd.seat+') ran '+r.length+' judge nodes ['+r.join(', ')+'], expected exactly 1.'+RT);
 const items=$(r[0]).all();if(!items||items.length!==1)throw new Error('FAIL-CLOSED: '+r[0]+' produced '+(items?items.length:0)+' items.'+RT);
 const raw=items[0].json;if(raw&&raw.judges&&raw.transcript_chars)throw new Error('FAIL-CLOSED: '+r[0]+' output is the build item passed through, not a provider response.'+RT);
 let c=classify(jd.seat,raw);
 if(S.dry===true&&S.test_fail_seat===jd.seat)c={ok:false,kind:'test',detail:'dry test input test_fail_seat',msg:'FAIL-CLOSED: seat "'+jd.seat+'" marked failed by the dry test input test_fail_seat.'+RT};
 if(!c.ok)fails.push({slot:i,seat:jd.seat,kind:c.kind,detail:c.detail,msg:c.msg});});
if(fails.length===0)return [{json:{run_token:TOK,sub:null}}];
const testOn=S.dry===true&&S.test_fail_seat!==null&&S.test_no_fallback!==true;
const allowed=testOn||(FALLBACK_ON&&!(S.dry===true&&S.test_no_fallback===true));
if(fails.length===1&&allowed&&RES){const f=fails[0];
 return [{json:{run_token:TOK,sub:{slot:f.slot,failed_seat:f.seat,substitute:RES.seat,failure_kind:f.kind,detail:f.detail,at:new Date().toISOString()}}}];}
throw new Error(fails[0].msg+(fails.length>1?' ['+fails.length+' panel seats failed: '+fails.map(f=>f.seat).join(', ')+'; one substitution per run]':'')+((fails.length===1&&allowed&&!RES)?' [no reserve seat is free]':''));
