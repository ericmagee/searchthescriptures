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
const CURE_RULE_G="COUNT AND STANDING (same rule). Your own numbers must agree with your own COLLISION POINTS lines. For each item below, either CORRECT it or WITHDRAW. "
 +"K-G1 (a conceded count of 0 beside a link you graded BROKEN on a witness left unanswered): CORRECT by writing the corrected line, CONCEDED LINKS: <n> (or CHALLENGER CONCEDED LINKS: <n>), "
 +"with n at least the number of such links, and for each such link quoting the sentence of the earlier round that pressed the witness and naming that round ([DR1], [DR2], [CR1], [CR2] or [CR3]); "
 +"or WITHDRAW the BROKEN grade on that link. K-G3 (a standing graded SELF-SUPPORTED while links of that side are graded BROKEN): CORRECT by writing the corrected line, "
 +"DEFENSE STANDING: <PROP-DEPENDENT or COLLAPSED> (or CHALLENGE STANDING), or WITHDRAW the BROKEN grade on each such link, naming each. "
 +"Begin each answer with its label exactly as given below followed by a colon; an answer may run to the next label.";
const cureLabel=x=>x.rule==='K-B'?x.link:(x.rule==='K-G1'?'K-G1 '+x.link:'K-G3 '+x.side);
function cureAsk(items,broken){const kb=items.filter(x=>x.rule==='K-B'),kg=items.filter(x=>x.rule!=='K-B');let t='';
 if(kb.length)t+=CURE_RULE+'\n\nFLAGGED LINES:\n'+kb.map(x=>x.link+': '+String(x.line||'').trim()).join('\n');
 if(kg.length)t+=(t?'\n\n':'')+CURE_RULE_G+'\n\nFLAGGED ITEMS:\n'+kg.map(x=>cureLabel(x)+': '+(x.rule==='K-G1'?String(x.line||'').trim():x.side+' STANDING SELF-SUPPORTED while these '+x.side+' links are graded BROKEN: '+((broken||{})[x.side]||[]).join(', '))).join('\n');
 return t;}
// The BROKEN links of each side on the judge's own lines, selected as drvCheck selects them (portion 3).
function cureBroken(text){const out={DEFENDER:[],CHALLENGER:[]};if(typeof text!=='string')return out;
 for(const line of text.split('\n')){const u=line.toUpperCase().replace(/[*_`]+/g,'').trim();const m=u.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(!m||!/^VS\.?\s/.test(m[2]))continue;
  const g=m[2].match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);if(!g||g[1]==='UNDERDETERMINED')continue;
  const id=(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+m[1]])[1].replace(/\s+VS\.?\s+/,' vs ');out[g[1].split(' ')[0]].push(id);}
 return out;}
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
// The round texts the judge was shown, read from its own request body. Each transcript block opens with its label on a line of its own, in
// either live form: single judge "[CR1]" or "[CR3 -- LINK ROUND ...]"; panel "=== [CR1] DEFENDER R1 ===" (BB-6951 defect 2). A block runs to
// the next; [DR3] ends at the counting rule (single) or at the end of the text (panel).
function cureRounds(body){const parts=[];const add=c=>{if(typeof c==='string')parts.push(c);else if(Array.isArray(c))c.forEach(p=>{if(p&&typeof p.text==='string')parts.push(p.text);});};
 try{(body.messages||[]).forEach(m=>{if(m&&m.role!=='assistant')add(m.content);});(body.contents||[]).forEach(m=>{if(m&&m.role!=='model')add(m.parts);});}catch(e){}
 const t=parts.join('\n');const re=/^(?:===[ \t]+)?\[(CR1|DR1|CR2|DR2|CR3|DR3)(?:\]|[ \t]--[^\n]*\])(?:[^\n]*===)?[ \t]*$/gm;const at=[];let m;while((m=re.exec(t)))at.push({k:m[1],s:m.index,e:m.index+m[0].length});
 const out={};at.forEach((x,i)=>{if(out[x.k]!=null)return;let end=i+1<at.length?at[i+1].s:t.length;const c=t.indexOf('\n\nCOUNTING RULE',x.e);if(c>=0&&c<end)end=c;out[x.k]=t.slice(x.e,end);});
 return out;}
// The rounds that press a witness against each side (the judge prompt's UNANSWERED WITNESS rule).
const CURE_PRESS={DEFENDER:['DR1','DR2'],CHALLENGER:['CR1','CR2','CR3']};
const cureQ=s=>String(s).toLowerCase().replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[—–]/g,'-').replace(/\s+/g,' ').trim();
// Quotations in a statement: the same marks at word edges as DRV_QUOTE (BB-6898 D1).
const cureQuotes=s=>{const re=/(?:^|[\s(\[{])["“'‘]([^"”\n]{4,}?)["”'’](?=$|[\s.,;:!?)\]}])/g;const o=[];let m;while((m=re.exec(s)))o.push(m[1]);return o;};
// A quotation is found in a round when every piece of it (split at an ellipsis), stripped of edge punctuation, occurs in that round's text,
// and the pieces hold at least three words.
function cureFound(q,txt){const T=cureQ(txt);const ps=q.split(/\.{3}|…/).map(x=>cureQ(x).replace(/^[\s.,;:!?'"-]+|[\s.,;:!?'"-]+$/g,'')).filter(Boolean);
 return ps.length>0&&ps.join(' ').split(' ').length>=3&&ps.every(x=>T.includes(x));}
// Withdrawal clauses: a clause (cut at . ; ! ? before a space or the end, or a line end) holding WITHDRAW with no negation before it in that
// clause and no NOTHING or NONE right after. After the WITHDRAW, the clause is cut at the first negation or exception (BUT, EXCEPT, SAVE,
// OTHER THAN, KEEP, RETAIN): what precedes the cut is kept, what follows is excepted (BB-6951 defect 1).
const CURE_NEG=/\b(?:NOT|NO|NEVER|NOR|CANNOT|CAN'?T|WON'?T|DON'?T|DOESN'?T|DIDN'?T|SHAN'?T|DECLINES?|DECLINED|REFUSES?|REFUSED|WITHOUT)\b/;
const CURE_EXC=new RegExp(CURE_NEG.source.replace('(?:','(?:BUT|EXCEPT|SAVE|OTHER THAN|KEEPS?|KEPT|RETAINS?|RETAINED|'));
function cureWithdrawals(blockLines){const kept=[],except=[];for(const l of blockLines)for(const c of String(l).toUpperCase().replace(/[’‘]/g,"'").split(/[.;!?]+(?=\s|$)/)){
 const re=/\bWITHDRAW(?:S|N|ING)?\b/g;let m;while((m=re.exec(c))){if(CURE_NEG.test(c.slice(0,m.index)))continue;const after=c.slice(m.index+m[0].length);if(/^\s*(?:NOTHING|NONE)\b/.test(after))continue;
  const e=after.search(CURE_EXC);const cut=e<0?c.length:m.index+m[0].length+e;kept.push(c.slice(0,cut));if(cut<c.length)except.push(c.slice(cut));break;}}
 return {kept,except};}
// Judge each item against the statement (6904 c; 6946). The reply is cut into blocks, each opened by a line that begins with an item's label.
// K-B: the block's first line, alone, must pass the same K-B counter (two kinds) and keep the grade (that side's LINK BROKEN, found as
// drvCheck finds it). K-G1: CORRECT = a corrected conceded count for that side at least the number of that side's K-G1 links, and a quotation
// found in the text of a round named in the block that presses that side (defender [DR1], [DR2]; challenger [CR1]-[CR3]); or WITHDRAW.
// K-G3: CORRECT = a corrected standing for that side other than SELF-SUPPORTED; or WITHDRAW, the withdrawal clauses naming every BROKEN
// link of that side. A WITHDRAW counts only in a clause with no negation before it (BB-6948 defect 1).
// Anything else, a missing block, a failed or unparsed call: UNCURED. No grade or count is changed (portion 5).
function cureVerdicts(items,reply,broken,rounds){const norm=s=>String(s).replace(/[*_`]+/g,'').replace(/\s+/g,' ').trim().toUpperCase();
 const lines=reply&&reply.ok?String(reply.text).split('\n').map(s=>s.trim()).filter(Boolean):[];
 const labs=items.map(x=>norm(cureLabel(x)));const isLab=l=>labs.some(b=>norm(l).startsWith(b+':')||norm(l).startsWith(b+' :'));
 const block=lab=>{const k=lines.findIndex(l=>norm(l).startsWith(lab+':')||norm(l).startsWith(lab+' :'));if(k<0)return null;const b=[lines[k]];for(let i=k+1;i<lines.length&&!isLab(lines[i]);i++)b.push(lines[i]);return b;};
 const whole=norm(lines.join('\n'));const nK1={DEFENDER:items.filter(x=>x.rule==='K-G1'&&x.side==='DEFENDER').length,CHALLENGER:items.filter(x=>x.rule==='K-G1'&&x.side==='CHALLENGER').length};
 return items.map(x=>{const lab=norm(cureLabel(x));const res=(status,why,statement,kinds)=>({...x,status,why,statement,kinds:kinds||[]});
  if(!reply||!reply.ok)return res('UNCURED','cure call failed: '+(reply?reply.why:'no reply'),null);
  const b=block(lab);if(!b)return res('UNCURED','no statement for '+cureLabel(x),null);const bt=norm(b.join(' '));
  if(x.rule==='K-B'){const k=drvKinds(b[0]);const g=norm(b[0]).slice(lab.length).match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);
   if(!g||g[1]!==x.side+' LINK BROKEN')return res('UNCURED','statement does not keep the grade '+x.side+' LINK BROKEN'+(g?' (it reads '+g[1]+')':''),b[0],k);
   return res(k.length>=2?'CURED':'UNCURED',k.length>=2?null:'statement exhibits '+k.length+' layer kind'+(k.length===1?'':'s'),b[0],k);}
  const wd=cureWithdrawals(b);const wx=norm(wd.except.join(' '));
  if(wd.kept.length){const wt=norm(wd.kept.join(' '));
   if(x.rule==='K-G1')return wx.includes(norm(x.link))?res('UNCURED','withdrawal excepts '+x.link,b.join(' ')):res('CURED','withdrawn',b.join(' '));
   const need=((broken||{})[x.side]||[]).map(norm);if(!need.length)return res('UNCURED','the BROKEN links of '+x.side+' could not be read from the judgment',b.join(' '));const miss=need.filter(l=>!wt.includes(l)||wx.includes(l));
   return miss.length?res('UNCURED','withdrawal does not name '+miss.join(', '),b.join(' ')):res('CURED','withdrawn: '+need.join(', '),b.join(' '));}
  if(x.rule==='K-G1'){const lab2=x.side==='DEFENDER'?/(?:^|[^A-Z])CONCEDED LINKS\s*:\s*(\d+)/:/CHALLENGER CONCEDED LINKS\s*:\s*(\d+)/;
   const src=x.side==='DEFENDER'?whole.replace(/CHALLENGER CONCEDED LINKS\s*:\s*\d+/g,''):whole;const m=src.match(lab2);const n=m?+m[1]:null;
   const qs=cureQuotes(b.join(' '));const named=CURE_PRESS[x.side].filter(k=>bt.includes('['+k+']'));const R=rounds||{};
   const inR=q=>named.filter(k=>typeof R[k]==='string'&&cureFound(q,R[k]));const hit=qs.find(q=>inR(q).length);const unread=named.length&&named.every(k=>typeof R[k]!=='string');
   if(n!==null&&n>=nK1[x.side]&&hit)return res('CURED','corrected: '+(x.side==='DEFENDER'?'CONCEDED':'CHALLENGER CONCEDED')+' LINKS '+n+'; quotation found in '+inR(hit).join(', '),b.join(' '));
   return res('UNCURED','correction incomplete: count '+(n===null?'not given':n+(n<nK1[x.side]?' (below '+nK1[x.side]+')':''))+(qs.length?'':', no quoted sentence')
    +(named.length?'':', no round named of '+CURE_PRESS[x.side].join(', '))+(qs.length&&named.length&&!hit?(unread?', the named round text could not be read':', no quotation found in the named round'):''),b.join(' '));}
  if(x.rule==='K-G3'){const lab3=x.side==='DEFENDER'?'DEFENSE':'CHALLENGE';const m=whole.match(new RegExp(lab3+'\\s+STANDING\\s*:\\s*(SELF-SUPPORTED|PROP-DEPENDENT|COLLAPSED)'));
   if(m&&m[1]!=='SELF-SUPPORTED')return res('CURED','corrected: '+lab3+' STANDING '+m[1],b.join(' '));
   return res('UNCURED','correction incomplete: standing '+(m?m[1]:'not given'),b.join(' '));}
  return res('UNCURED','unknown rule',null);});}
function cureReport(seat,v){return v.map(x=>'[AUDIT v21: DEBATE RULE VIOLATION REPORT -- '+(seat?seat+' ':'')+(x.rule==='K-G3'?x.side:x.link)+' ('+x.rule+'): '+x.status
 +(x.kinds&&x.kinds.length?' ('+x.kinds.join(', ')+')':'')+(x.why?'; '+x.why:'')+(x.statement?'. STATEMENT: '+x.statement.slice(0,600).replace(/\[/g,'(').replace(/\]/g,')'):'')+']');}

const PP=$('Panel Payloads').first().json;let rs=[];try{if($('Panel Cure Normalize').isExecuted)rs=$('Panel Cure Normalize').all().map(x=>x.json);}catch(e){rs=[];}
const bodies=PP.bodies.slice();const summary=(PP.summary||[]).map(s=>({...s}));
summary.forEach((s,i)=>{const all=s.drv||[];s.cure=[];if(!all.length)return;
 const r=rs.find(x=>x.cure&&x.cure.idx===i)||null;
 const v=cureVerdicts(all,r?r.reply:{ok:false,why:'no cure call was made for this seat'},r&&r.cure?r.cure.broken:null,r&&r.cure?r.cure.rounds:null);
 s.cure=v.map(x=>({rule:x.rule,side:x.side,link:x.link,status:x.status,kinds:x.kinds,why:x.why}));
 const b=JSON.parse(bodies[i]);b.payload.verdict_raw=b.payload.verdict_raw+'\n'+cureReport(s.seat,v).join('\n');bodies[i]=JSON.stringify(b);});
return [{json:{...PP,bodies,summary}}];
