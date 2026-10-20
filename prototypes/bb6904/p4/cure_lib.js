// BB-6904 (c), portion 4: the cure call. One extra call per violating seat: its own flagged lines, the rule, and the instruction to cure
// each line by exhibiting two lower layers of different kinds on it, or to answer in writing why it stands. The statement is run through
// the same K-B counter (drvKinds, git 0b3cbac): a line is CURED only if its restated line passes; anything else, a missing line, a failed
// or unparsed call, leaves it UNCURED (6945 AMEND 3). No grade, count or outcome is changed here (portion 5, the operator's choice).
const CURE_FAMS=['deepseek','openai','gemini','grok','mimo','openrouter']; // Cure Route output order; covers all six (6913 note 2)
const CURE_RULE="DEBATE RULE VIOLATION. After you answered, the system checked every COLLISION POINTS line you graded DEFENDER LINK BROKEN or CHALLENGER LINK BROKEN. "
 +"Each such line must exhibit, on the line itself, at least two lower layers of DIFFERENT kinds, each tagged: [L1] with the KJV words quoted; "
 +"[L2] with the Hebrew or Greek word in its own script, with its transliteration marks, or with its Strong's number; [L3] with the cross-reference named. "
 +"Two quotations at one layer are one layer. The lines below do not. For each one, either CURE it, by writing that one line again with the same grade and "
 +"the two layers exhibited on it, or ANSWER in writing why it stands. Reply with one line per flagged link and nothing else, each line beginning with "
 +"its label exactly as given below followed by a colon. Do not change any other line, grade or count. A line that is not cured leaves that ground "
 +"uncounted toward BROKEN.";
function cureAsk(items){return CURE_RULE+'\n\nFLAGGED LINES:\n'+items.map(x=>x.link+': '+String(x.line||'').trim()).join('\n');}
// Append the judge's own answer and the cure request to the judge's own request body, per family envelope.
function cureBody(fam,body,answer,ask){const b=JSON.parse(JSON.stringify(body));
 if(fam==='gemini'){b.contents=(b.contents||[]).concat([{role:'model',parts:[{text:answer}]},{role:'user',parts:[{text:ask}]}]);return b;}
 b.messages=(b.messages||[]).concat([{role:'assistant',content:answer},{role:'user',content:ask}]);
 if(b.response_format)delete b.response_format; // a JSON-only reserve (qwen) must be free to answer in lines
 return b;}
// One reply envelope to text, never throwing: chat form, Gemini form, or a failure named.
function cureText(j){
 if(j&&Array.isArray(j.choices)&&j.choices[0]&&j.choices[0].message&&typeof j.choices[0].message.content==='string')return {ok:true,text:j.choices[0].message.content,finish:j.choices[0].finish_reason||null};
 if(j&&Array.isArray(j.candidates)&&j.candidates[0]&&j.candidates[0].content&&Array.isArray(j.candidates[0].content.parts)){const t=j.candidates[0].content.parts.filter(p=>!p.thought&&typeof p.text==='string').map(p=>p.text).join('');if(t)return {ok:true,text:t,finish:j.candidates[0].finishReason||null};}
 const why=(j&&j.error)?('error: '+String(typeof j.error==='string'?j.error:(j.error.message||JSON.stringify(j.error))).slice(0,160)):('unrecognised reply, keys ['+Object.keys(j||{}).join(',')+']');
 return {ok:false,text:null,why};}
// Judge each K-B item against the statement. The restated line is the statement line that begins with the item's label.
function cureVerdicts(items,reply){const norm=s=>String(s).replace(/[*_`]+/g,'').replace(/\s+/g,' ').trim().toUpperCase();
 const lines=reply&&reply.ok?String(reply.text).split('\n').map(s=>s.trim()).filter(Boolean):[];
 return items.map(x=>{const lab=norm(x.link);
  if(x.rule!=='K-B')return {...x,status:'UNCURED',why:'cure test for '+x.rule+' awaits the advisor ruling (6945 AMEND 4)',statement:null,kinds:[]};
  if(!reply||!reply.ok)return {...x,status:'UNCURED',why:'cure call failed: '+(reply?reply.why:'no reply'),statement:null,kinds:[]};
  const st=lines.find(l=>norm(l).startsWith(lab+':'))||lines.find(l=>norm(l).startsWith(lab));
  if(!st)return {...x,status:'UNCURED',why:'no statement line for '+x.link,statement:null,kinds:[]};
  const k=drvKinds(st);return {...x,status:k.length>=2?'CURED':'UNCURED',why:k.length>=2?null:'statement exhibits '+k.length+' layer kind'+(k.length===1?'':'s'),statement:st,kinds:k};});}
function cureReport(seat,v){return v.map(x=>'[AUDIT v21: DEBATE RULE VIOLATION REPORT -- '+(seat?seat+' ':'')+x.link+' ('+x.rule+'): '+x.status
 +(x.kinds&&x.kinds.length?' ('+x.kinds.join(', ')+')':'')+(x.why?'; '+x.why:'')+(x.statement?'. STATEMENT: '+x.statement.slice(0,600):'')+']');}
