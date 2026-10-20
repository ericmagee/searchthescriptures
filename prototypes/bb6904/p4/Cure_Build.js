// BB-6904 (b), portion 3: DEBATE RULE VIOLATION, rule B on the judge's own BROKEN lines. A line graded DEFENDER LINK BROKEN or
// CHALLENGER LINK BROKEN must exhibit, on the line itself, two lower layers of different kinds (6903): [L1] with quoted words, [L2] with
// a source word (own script, transliteration marks, or a Strong's number; 6926; the Latin range narrowed to transliteration letters, 6936),
// [L3] with a named reference. A tag after "no", "without", "lacks" or "not" never counts. K-G1 (6892): a BROKEN line resting on a
// witness left unanswered while that side's stated conceded count is 0. K-G3 (6934): a side graded SELF-SUPPORTED while any of its
// links is graded BROKEN. K-G2: an absent CITATION CHECK line on text from a prompt that asks for it, recorded only. The counter is
// kb.cjs (git 29caa5c), names prefixed. Lines are chosen the extractor's way: a "D<n> vs" collision entry whose first grade is DEFENDER
// or CHALLENGER LINK BROKEN. No grade is changed; each violation is a review line (6890 AMEND 2).
const DRV_REF=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/;
const DRV_SRC=/[\u0590-\u05FF\u0100-\u024F\u00C2\u00CA\u00CE\u00D4\u00DB\u00E2\u00EA\u00EE\u00F4\u00FB\u0300-\u036F\u0370-\u03FF\u1E00-\u1EFF\u1F00-\u1FFF\u02BE\u02BF]|\b[GH]\d{2,5}\b/; // BB-6926 option A: own script (Hebrew, Greek), transliteration marks, or a Strong's number; no italic alternative
const DRV_QUOTE=/(?:^|[\s(\[{])["“'‘][^"”\n]{4,}?["”'’](?=$|[\s.,;:!?)\]}])/; // a mark inside a word (Joseph's) never opens or closes a quote (BB-6898 D1)
const DRV_NEG=/\b(?:no|without|lacks?|lacking|not)\s+(?:\[L[1-4]\]\s*(?:or|and|\/)\s*)*$/i;
function drvExhibits(line,needQuote,formC,distinct){
  const re=/\[L([1-3])\](?:\s*\/\s*\[L[1-3]\])*/g;let m,n=0;const met=new Set(); // distinct: count layer kinds met, not tags (BB-6899)
  while((m=re.exec(line))!==null){
    const before=line.slice(Math.max(0,m.index-30),m.index);
    if(DRV_NEG.test(before))continue;
    let rest=line.slice(m.index+m[0].length);
    const cut=rest.search(/;|\.\s|\s--\s|\s—\s|\[L[1-4]\]/);if(cut>=0)rest=rest.slice(0,cut);
    if(formC){const ts=[...m[0].matchAll(/L([1-3])/g)].map(x=>x[1]);const ok=ts.filter(t=>(t==='1'&&DRV_QUOTE.test(rest))||(t==='2'&&DRV_SRC.test(rest))||(t==='3'&&DRV_REF.test(rest)));if(ok.length){n++;ok.forEach(t=>met.add(t));}continue;}
    const anchor=DRV_REF.test(rest)||DRV_SRC.test(rest);
    if(anchor&&(!needQuote||DRV_QUOTE.test(rest)))n++;
  }
  return distinct?[...met].sort().map(t=>'L'+t):n;
}
const drvKinds=(line)=>drvExhibits(line,false,true,true);
const DRV_WORDS=/\b(?:unanswered|not answered|unnamed|not named|none named|neither named|unaddressed)\b/i;
function drvCheck(text,dConc,cConc,dStand,cStand,askedCC){const items=[],marks=[];if(typeof text!=='string')return {items,marks};const cnt={DEFENDER:0,CHALLENGER:0};
 for(const line of text.split('\n')){const u=line.toUpperCase().replace(/[*_`]+/g,'').trim();
  const m=u.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(!m||!/^VS\.?\s/.test(m[2]))continue;
  const g=m[2].match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);if(!g||g[1]==='UNDERDETERMINED')continue;
  const side=g[1].split(' ')[0];cnt[side]++;const id=(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+m[1]])[1].replace(/\s+VS\.?\s+/,' vs ');
  const k=drvKinds(line);
  if(k.length<2){items.push({rule:'K-B',side,link:id,kinds:k,line});marks.push('[AUDIT v21: DEBATE RULE VIOLATION -- '+id+' '+g[1]+' exhibits '+k.length+' layer kind'+(k.length===1?'':'s')+(k.length?' ('+k.join(', ')+')':'')+' of the two rule B requires on the line itself. REVIEW THIS ROW.]');}
  const conc=side==='DEFENDER'?dConc:cConc;
  if(conc===0&&DRV_WORDS.test(line)){items.push({rule:'K-G1',side,link:id,line});marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G1) -- '+id+' '+g[1]+' rests on a witness left unanswered while '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+' is 0. REVIEW THIS ROW.]');}}
 for(const [side,st,lab] of [['DEFENDER',dStand,'DEFENSE'],['CHALLENGER',cStand,'CHALLENGE']]){
  if(st==='SELF-SUPPORTED'&&cnt[side]>0){items.push({rule:'K-G3',side,link:null,line:null});marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G3) -- '+lab+' STANDING SELF-SUPPORTED while '+cnt[side]+' '+side+' LINK BROKEN line'+(cnt[side]===1?'':'s')+' stand. REVIEW THIS ROW.]');}}
 if(askedCC&&!/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?CITATION CHECK\b/im.test(text.replace(/[*_`]+/g,'')))marks.push('[AUDIT v21: CITATION CHECK LINE ABSENT FROM A PROMPT THAT ASKS FOR IT (K-G2); recorded, not counted as a violation.]');
 return {items,marks};}

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

const E=$input.first().json;const B=$('Build Independent Verdict').first().json;
const items=(E.debate_rule_violations||[]).filter(x=>x.rule==='K-B');const fam=CURE_FAMS[B.jidx];
let answer=null;try{answer=$('Verdict Normalizer').first().json.choices[0].message.content;}catch(e){answer=null;}
if(!fam||typeof answer!=='string'||!items.length)return [{json:{cure:{who:'single',skip:'no request could be built (family '+B.jidx+')',items}}}];
return [{json:{cure:{who:'single',seat:B.judge_model,fam,jidx:B.jidx,model:B.judge_model,items,body:cureBody(fam,B.verdictBody,answer,cureAsk(items))}}}];
