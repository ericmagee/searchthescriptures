// BB-6904 (b), portion 3: DEBATE RULE VIOLATION, rule B on the judge's own BROKEN lines. A line graded DEFENDER LINK BROKEN or
// CHALLENGER LINK BROKEN must exhibit, on the line itself, two lower layers of different kinds (6903): [L1] with quoted words, [L2] with
// a source word (own script, transliteration marks, or a Strong's number; 6926; the Latin range narrowed to transliteration letters, 6936),
// [L3] with a named reference. A tag after "no", "without", "lacks" or "not" never counts. K-G1 (6892): a BROKEN line resting on a
// witness left unanswered while that side's stated conceded count is 0. K-G3 (6934): a side graded SELF-SUPPORTED while any of its
// links is graded BROKEN. K-G2: an absent CITATION CHECK line on text from a prompt that asks for it, recorded only. The counter is
// kb.cjs (git 29caa5c), names prefixed. Lines are chosen the extractor's way: a "D<n> vs" collision entry whose first grade is DEFENDER
// or CHALLENGER LINK BROKEN. No grade is changed; each violation is a review line (6890 AMEND 2).
const DRV_REF=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/;
const DRV_REF_END=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}(?:\s?[-–]\s?\d{1,3})?[\s*_]*$/; // BB-7994 step 6b: a reference written just before its [L3] tag ("Job 15:14 [L3]") names the reference
const DRV_SRC=/[֐-׿Ā-ɏÂÊÎÔÛâêîôû̀-ͯͰ-ϿḀ-ỿἀ-῿ʾʿ]|\b[GH]\d{2,5}\b/; // BB-6926 option A: own script (Hebrew, Greek), transliteration marks, or a Strong's number; no italic alternative
const DRV_QUOTE=/(?:^|[\s(\[{])["“'‘][^"”\n]{4,}?["”'’](?=$|[\s.,;:!?)\]}])/; // a mark inside a word (Joseph's) never opens or closes a quote (BB-6898 D1)
const DRV_NEG=/\b(?:no|without|lacks?|lacking|not)\s+(?:\[L[1-4]\]\s*(?:or|and|\/)\s*)*$/i;
function drvExhibits(line,needQuote,formC,distinct){
  const re=/\[L([1-3])\](?:\s*\/\s*\[L[1-3]\])*/g;let m,n=0;const met=new Set(); // distinct: count layer kinds met, not tags (BB-6899)
  while((m=re.exec(line))!==null){
    const before=line.slice(Math.max(0,m.index-30),m.index);
    if(DRV_NEG.test(before))continue;
    let rest=line.slice(m.index+m[0].length);
    // BB-7994 step 6b: a quotation that opens the text runs to its closing mark before any cut ("Adam knew Eve his wife; and she conceived").
    {const q=rest.match(/^\s*["“]/);let from=0;if(q){const k=rest.slice(q[0].length).search(/["”]/);if(k>=0)from=q[0].length+k+1;}
     const cut=rest.slice(from).search(/;|(?<!\.)\.\s|\s--\s|\s—\s|\[L[1-4]\]/);if(cut>=0)rest=rest.slice(0,from+cut);}
    if(formC){const ts=[...m[0].matchAll(/L([1-3])/g)].map(x=>x[1]);const ok=ts.filter(t=>(t==='1'&&DRV_QUOTE.test(rest))||(t==='2'&&DRV_SRC.test(rest))||(t==='3'&&(DRV_REF.test(rest)||DRV_REF_END.test(line.slice(Math.max(0,m.index-40),m.index)))));if(ok.length){n++;ok.forEach(t=>met.add(t));}continue;}
    const anchor=DRV_REF.test(rest)||DRV_SRC.test(rest);
    if(anchor&&(!needQuote||DRV_QUOTE.test(rest)))n++;
  }
  return distinct?[...met].sort().map(t=>'L'+t):n;
}
const drvKinds=(line)=>drvExhibits(line,false,true,true);
const DRV_WORDS=/\b(?:unanswered|not answered|unnamed|not named|none named|neither named|unaddressed)\b/i;
// P2D v6a item 1b (BB-8136): K-S, a STANDS or UNDERDETERMINED line whose ground is that a single verse does not state a link or its
// contrary, naming no later round ([CR2], [CR3], [DR2], [DR3]) that answered the witness. Sent to the cure to be regraded on the answered test.
const DRV_STATE=/\b(?:do|does|did)\s+not\s+state\b|\bnot\s+stated\b|\bnever\s+states?\b|\bneither\s+states?\b|\bnor\s+states?\b|\bno\s+(?:\S+\s+){0,4}?(?:verse|row|witness|quotation|passage|text)s?\b(?:\s+\S+){0,4}?\s+(?:states?|names?)\b|\bno\s+\[L[1-4]\](?:\s*\/\s*\[L[1-4]\])*\s+(?:states?|names?)\b|\b(?:met\s+by|without)\s+any\s+(?:verse|row|witness|quotation)\s+that\s+(?:states?|names?)\b/i;
const DRV_ANS=/[\[(](?:CR|DR)[23]\b/i;
// BB-8172 C2 (B): a bare round (CR2, CR3, DR2, DR3 without a bracket) counts as a named round for the K-S2 mark only.
const DRV_BARE=/(?:^|[^\[(A-Za-z0-9])(?:CR|DR)[23]\b/i;
// BB-8172 C2 (A): K-U, a STANDS or UNDERDETERMINED line that itself says a witness went unnamed or unanswered (8193, the 7 MARK lines).
// Positive forms only; a form counts only when the clause before it (since the last ; . or --) holds no negator, so "no witness ...
// was left unanswered" and "neither reading was left unanswered" are not marked (8193, the 14 NO MARK lines).
const DRV_UNANS=[/\b(?:was|were|is|are)\s+(?:left\s+)?(?:not\s+named|unnamed|unanswered|not\s+answered)\b/gi,/,\s*not\s+named\b/gi,/\bleft\s+(?:\S+\s+){1,8}?unnamed\b/gi,/\bunanswered\s+(?:[1-3]\s+)?[A-Z][a-z]+\s+\d+:\d+/g,/\bthe\s+unanswered\s+[a-z]+/gi];
const DRV_UNEG=/\b(?:no|neither|nor|not|never|without|cannot)\b/i;
function drvUnans(line){for(const rx of DRV_UNANS){rx.lastIndex=0;let m;while((m=rx.exec(line))){const pre=line.slice(0,m.index);
  const cl=pre.split(/;|\.(?=\s)|--|\u2014/).pop();if(!DRV_UNEG.test(cl))return m[0];}}return null;}
function drvCheck(text,dConc,cConc,dStand,cStand,askedCC){const items=[],marks=[];if(typeof text!=='string')return {items,marks};const cnt={DEFENDER:0,CHALLENGER:0};
 const LS=text.split('\n');for(let li=0;li<LS.length;li++){const line=LS[li];const u=line.toUpperCase().replace(/[*_`]+/g,'').trim();
  {const ms=u.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(ms){const vs=/^VS\.?\s/.test(ms[2]);const gs=vs?((ms[2].match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/)||[])[1]||null):(/^STANDS\b/.test(ms[2])?'STANDS':null);
   if((gs==='UNDERDETERMINED'||gs==='STANDS')&&DRV_STATE.test(line)&&!DRV_ANS.test(line)){const sid=vs?(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+ms[1]])[1].replace(/\s+VS\.?\s+/,' vs '):'D'+ms[1];
    items.push({rule:'K-S',side:null,link:sid,line});marks.push('[AUDIT v22: DEBATE RULE VIOLATION (K-S) -- '+sid+' '+gs+' rests on a single verse not stating a link or its contrary and names no round that answered the witness. REVIEW THIS ROW.]');}
   // BB-8172 C2: marks only, never items, so nothing here reaches the cure, drv_uncured or a grade (8192, 8193).
   if(gs==='UNDERDETERMINED'||gs==='STANDS'){const sid=vs?(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+ms[1]])[1].replace(/\s+VS\.?\s+/,' vs '):'D'+ms[1];
    if(DRV_STATE.test(line)&&(DRV_ANS.test(line)||DRV_BARE.test(line)))marks.push('[AUDIT v22: DEBATE RULE VIOLATION (K-S2) -- '+sid+' '+gs+' gives as a ground that a verse does not state a link or its contrary, beside the round it names; that is never a ground. REVIEW THIS ROW.]');
    const un=drvUnans(line);if(un)marks.push('[AUDIT v22: DEBATE RULE VIOLATION (K-U) -- '+sid+' '+gs+' says a witness went unanswered ("'+un+'"); a witness left unanswered is a BROKEN ground. REVIEW THIS ROW.]');}}}
  const m=u.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(!m||!/^VS\.?\s/.test(m[2]))continue;
  const g=m[2].match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);if(!g||g[1]==='UNDERDETERMINED')continue;
  const side=g[1].split(' ')[0];cnt[side]++;const id=(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+m[1]])[1].replace(/\s+VS\.?\s+/,' vs ');
  // BB-7994 step 6b (BB-8044, 8056): the line under a BROKEN line carries its footing when it is not itself a collision, a label line or a concession line (SIDE | round |).
  const nx=String(LS[li+1]||''),nu=nx.toUpperCase().replace(/[*_`]+/g,'').trim();
  const k=(nu&&!/^(?:[-•]|\d+[.)])?\s*[DC]\d+\b/.test(nu)&&!/^[A-Z][A-Z \-]{2,}:/.test(nu)&&!/^(?:DEFENDER|CHALLENGER)\s*\|/.test(nu))?[...new Set([...drvKinds(line),...drvKinds(nx)])].sort():drvKinds(line);
  if(k.length<2){items.push({rule:'K-B',side,link:id,kinds:k,line});marks.push('[AUDIT v21: DEBATE RULE VIOLATION -- '+id+' '+g[1]+' exhibits '+k.length+' layer kind'+(k.length===1?'':'s')+(k.length?' ('+k.join(', ')+')':'')+' of the two rule B requires on the line or the line under it. REVIEW THIS ROW.]');}
  const conc=side==='DEFENDER'?dConc:cConc;
  if(conc===0&&DRV_WORDS.test(line)){items.push({rule:'K-G1',side,link:id,line});marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G1) -- '+id+' '+g[1]+' rests on a witness left unanswered while '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+' is 0. REVIEW THIS ROW.]');}
  // BB-6904 rev 8 K-G4: every other LINK BROKEN line answers the pressing-sentence rule too; cured by a PRESSED line whose quotation is
  // found in the named pressing round, or by RETRACTED (7176, 7184, 7186).
  else{items.push({rule:'K-G4',side,link:id,line});marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G4) -- '+id+' '+g[1]+' counts a witness as unanswered; the rule counts it only with the quoted pressing sentence and its round. REVIEW THIS ROW.]');}}
 for(const [side,st,lab] of [['DEFENDER',dStand,'DEFENSE'],['CHALLENGER',cStand,'CHALLENGE']]){
  if(st==='SELF-SUPPORTED'&&cnt[side]>0){items.push({rule:'K-G3',side,link:null,line:null});marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G3) -- '+lab+' STANDING SELF-SUPPORTED while '+cnt[side]+' '+side+' LINK BROKEN line'+(cnt[side]===1?'':'s')+' stand. REVIEW THIS ROW.]');}}
 if(askedCC&&!/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?CITATION CHECK\b/im.test(text.replace(/[*_`]+/g,'')))marks.push('[AUDIT v21: CITATION CHECK LINE ABSENT FROM A PROMPT THAT ASKS FOR IT (K-G2); recorded, not counted as a violation.]');
 return {items,marks};}

// BB-6904 (c), portion 4: the cure call. One extra call per violating seat: its own flagged items, the rule, and a FIXED ANSWER FORM
// (BB-6952). The check reads only lines in that form; prose in the reply is recorded in the report and never read for a cure, so there is
// no negation to parse: a link not on a RETRACTED line is not retracted, and a malformed line cures nothing. A RESTATED line is run through
// the same K-B counter (drvKinds, git 0b3cbac). A missing line, a failed or unparsed call leaves the item UNCURED (6945 AMEND 3). No grade,
// count or outcome is changed here (portion 5, the operator's choice).
const CURE_FAMS=['deepseek','openai','gemini','grok','mimo','openrouter']; // Cure Route output order; covers all six (6913 note 2)
const CURE_RULE="DEBATE RULE VIOLATION. After you answered, the system checked every COLLISION POINTS line you graded DEFENDER LINK BROKEN or CHALLENGER LINK BROKEN. "
 +"Each such line must exhibit, on the line itself or on the line directly under it, at least two lower layers of DIFFERENT kinds, each tagged: [L1] with the KJV words quoted; "
 +"[L2] with the Hebrew or Greek word in its own script, with its transliteration marks, or with its Strong's number; [L3] with the cross-reference named. "
 +"Two quotations at one layer are one layer. The lines below do not. For each one, either cure it with one RESTATED line: that collision line again, "
 +"beginning with its link, with the same grade and the two layers exhibited on it; or answer in prose why it stands (recorded; prose cures nothing). "
 +"Do not change any other line, grade or count. A line that is not cured leaves the violation standing, and this judgment is then not counted.";
const CURE_RULE_G="COUNT AND STANDING (same rule). Your own numbers must agree with your own COLLISION POINTS lines. "
 +"K-G1 (a conceded count of 0 beside a link you graded BROKEN on a witness left unanswered): cure it either with CORRECTED COUNT for that side, "
 +"the number at least the number of that side's K-G1 links, together with, for each such link, a PRESSED line quoting the words of the earlier round "
 +"that pressed the witness (against the defender: [DR1] or [DR2]; against the challenger: [CR1], [CR2] or [CR3]); or with RETRACTED for that link. "
 +"K-G4 (any other link you graded BROKEN on a witness left unanswered): cure it with a PRESSED line quoting the words of the earlier round that "
 +"pressed the witness (rounds as for K-G1), or with RETRACTED for that link. "
 +"For a K-G1 or K-G4 link whose cited verse any later round of the side that holds the link names ([CR2] or [CR3] against the defender, [DR2] or [DR3] against the challenger), add a SHORT line "
 +"quoting the words of that round that answer it and saying from the text why they do not overturn the link; without it the link is not cured. "
 +"K-G3 (a standing graded SELF-SUPPORTED while links of that side are graded BROKEN): cure it either with CORRECTED STANDING for that side, "
 +"PROP-DEPENDENT or COLLAPSED, or with one RETRACTED line for each BROKEN link of that side. "
 +"K-G6 (a premise listed against a side that the PRESSED-WITNESS LEDGER marks NOT NAMED, which your CONCEDED LINKS or CHALLENGER CONCEDED LINKS "
 +"does not count): the rule you were given reads \"A verse marked NOT NAMED is unanswered by the rule\" and \"A premise whose pressed witness goes "
 +"unanswered is UNEXHIBITED: it counts toward CONCEDED LINKS and the standings\". Cure it either by counting it: CORRECTED COUNT for that side, "
 +"your count plus every K-G6 premise of that side you do not answer by statement, with CORRECTED STANDING for that side that the count makes true "
 +"(PROP-DEPENDENT, or COLLAPSED when twice the count exceeds the number of premises listed against that side); or by a STATEMENT for that premise "
 +"that quotes, word for word, the words of the transcript that show the verse is not a pressed witness of that premise. "
 +"K-G7 (a COLLISION POINTS line you graded DEFENDER LINK BROKEN on D<n> while your CONCEDED LINKS does not count premise n): a link is BROKEN "
 +"only for a witness left unanswered, and a premise whose witness goes unanswered is counted. Cure it either by counting it: CORRECTED COUNT "
 +"for DEFENDER, your count plus every such premise and every K-G6 premise of that side, with the CORRECTED STANDING that count makes true; "
 +"or by regrading it: a RETRACTED line for that link and exactly one CORRECTED RESULT. The same holds for a CHALLENGER LINK BROKEN line for "
 +"a witness left unanswered while your CHALLENGER CONCEDED LINKS is 0: CORRECTED COUNT for CHALLENGER, or RETRACTED and one CORRECTED RESULT. "
 +"K-G8 (your counted_premises array for a side lists a different number of premises than that side's count): CORRECTED COUNT for that side equal to the number of premises your array lists plus every K-G6 or K-G7 premise of that side, with the CORRECTED STANDING that count makes true. K-S (a link marked STANDS, or a collision graded UNDERDETERMINED, whose ground is that a verse does not state a link or its contrary, with no round named that answered the witness): A link marked STANDS, or a collision graded UNDERDETERMINED, against a witness the other side exhibited names in the same line the round that answered that witness. A witness left unanswered is a BROKEN ground. That a single verse does not state a link or its contrary is never a ground for STANDS or UNDERDETERMINED, for either side. Cure it with one RESTATED line for that link (D<n> vs C<m>, or D<n> for a STANDS line), regraded: it names the round that answered the witness ([CR2] or [CR3] for a defender link, [DR2] or [DR3] for a challenger link), or it grades the line LINK BROKEN, with exactly one CORRECTED RESULT.";
const CURE_FORM="ANSWER FORM. Write each cure as one line of its own, beginning with its keyword in capitals exactly as shown:\n"
 +"RESTATED: <the full collision line, beginning D<n> vs C<m>>\n"
 +"RETRACTED: D<n> vs C<m>\n"
 +"CORRECTED RESULT: <BROKEN-1 | BROKEN-2 | PARTIAL-1 | PARTIAL-2 | PARTIAL-3 | HELD-1>\n"
 +"CORRECTED COUNT: <DEFENDER or CHALLENGER> <number>\n"
 +"CORRECTED STANDING: <DEFENDER or CHALLENGER> <PROP-DEPENDENT or COLLAPSED>\n"
 +"PRESSED: D<n> vs C<m> | [<round>] | \"<the words of that round, quoted exactly>\"\n"
 +"SHORT: D<n> vs C<m> | [<answering round>] | \"<the words of that round, quoted exactly>\" | <why they do not overturn the link>\n"
 +"STATEMENT: <the flagged item, as labelled above> | <in your own words, why the line stands as you graded it, or what you corrected and why>\n"
 +"RETRACTED: D<n> vs C<m> retracts your BROKEN grade on that line; a retracted line is not a BROKEN line, so that one line cures every item flagged on it (layer, count, pressing). A BROKEN line you retract is regraded in the same reply: UNDERDETERMINED only with the round that answered each witness named; a witness left unanswered keeps the line BROKEN in the corrected form. A retraction counts only beside one CORRECTED RESULT line: your CLAUSE tag as it stands after your retractions, and that result is the one counted. A STATEMENT line never retracts anything. A judge that retracts a BROKEN line writes the reason in one sentence; a retraction of every BROKEN line that flips the verdict with no reason stated is not a cure, and that judge is not counted. A reason for a retraction names what in the rounds makes the retracted line wrong: the round, and the words or the verse it rests on. A sentence that names only the flag, the rule or the cure it performs is not a reason.\n"
 +"Write one STATEMENT line for every flagged item, cured or not; it is recorded beside the item. Instead of a cure line you may state why the line stands: "
 +"the statement is run through the same check as the cure. For a layer item it must exhibit two different kinds of layer; for a K-G1 or K-G4 "
 +"item it must name the round that pressed the witness and quote that round's words; where a later round of the side that holds the link names the verse, it must also quote "
 +"that round's own answer. For a K-G6 item it must quote, word for word, the transcript's words that show the verse is not a pressed witness of that premise. Cured if it passes; else the violation stands. "
 +"Only these lines are read. A link not on a RETRACTED line is not retracted. A line not in this form cures nothing. Any other text is recorded only.";
const cureLabel=x=>x.rule==='K-B'?x.link:((x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'||x.rule==='K-S')?x.rule+' '+x.link:'K-G3 '+x.side);
function cureAsk(items,broken){const kb=items.filter(x=>x.rule==='K-B'),kg=items.filter(x=>x.rule!=='K-B');let t='';
 if(kb.length)t+=CURE_RULE+'\n\nFLAGGED LINES:\n'+kb.map(x=>x.link+': '+String(x.line||'').trim()).join('\n');
 if(kg.length)t+=(t?'\n\n':'')+CURE_RULE_G+'\n\nFLAGGED ITEMS:\n'+kg.map(x=>cureLabel(x)+': '+((x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'||x.rule==='K-S')?String(x.line||'').trim():x.side+' STANDING SELF-SUPPORTED while these '+x.side+' links are graded BROKEN: '+((broken||{})[x.side]||[]).join(', '))).join('\n');
 return t+'\n\n'+CURE_FORM;}
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
const cureQ=s=>String(s).replace(/\\(["'\\nrt])/g,(m,c)=>c==='n'?'\n':c==='t'?'\t':c==='r'?'\r':c).replace(/[*_`]+/g,'').toLowerCase().replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[—–]/g,'-').replace(/["']/g,'').replace(/\((l[1-4]|[cd]r[1-3])\)/g,'[$1]').replace(/\s+/g,' ').trim(); // BB-7357: quote marks folded, (Ln) read as [Ln], brackets kept; BB-7397 rev 8 DoD 15: backslash escapes (\" \' \\ \n \t \r) read as the characters they stand for, first
// A quotation is found in a round when every piece of it (split at an ellipsis), stripped of edge punctuation, occurs in that round's text,
// and the pieces hold at least three words.
function cureFound(q,txt){const T=cureQ(txt);const ps=q.split(/\.{3}|…/).map(x=>cureQ(x).replace(/^[\s.,;:!?'"-]+|[\s.,;:!?'"-]+$/g,'')).filter(Boolean);
 return ps.length>0&&ps.join(' ').split(' ').length>=3&&ps.every(x=>T.includes(x));}
// DoD 12 (BB-7397 rev 7, choice (i) BB-7495): a PRESSED line may carry several quotations of the named round, joined as "..." and "..."; a
// quotation not found whole is split at a closing mark, a joiner (and, &, a comma or a semicolon) and an opening mark, and counts when every piece
// is found in that round. A quotation found whole is read as before.
function cureFoundAll(q,txt){if(cureFound(q,txt))return true;const ps=String(q).split(/["”]\s*(?:and|&|,|;)\s*["“]/).map(s=>s.trim()).filter(Boolean);
 return ps.length>1&&ps.every(p=>cureFound(p,txt));}
// The reply in the fixed form (BB-6952). A line is read only when, after trimming and stripping * or ` at its ends, it begins with one of the
// five keywords and a colon; it then must match its form exactly, or it is malformed. Every other line is prose.
const CURE_KEY=/^(RESTATED|RETRACTED|CORRECTED RESULT|CORRECTED COUNT|CORRECTED STANDING|PRESSED|SHORT|STATEMENT)[ \t]*:[ \t]*(.*)$/;
const cureId=(d,c)=>'D'+d+' vs C'+c;
// A reply that is one JSON object (a panel judge keeps its answer form) is read through its reasoning, reason or answer string.
const cureUnwrap=t=>{try{const j=JSON.parse(String(t).trim().replace(/^```(?:json)?\s*|\s*```$/g,''));if(j&&typeof j==='object'){for(const k of ['reasoning','reason','answer'])if(typeof j[k]==='string')return j[k];}}catch(e){}return t;};
function cureLines(text){text=cureUnwrap(text);const o={restated:[],withdrawn:[],result:[],count:[],standing:[],pressed:[],short:[],statement:[],malformed:[],prose:[]};
 for(const raw of String(text||'').split('\n')){const l=raw.trim().replace(/^[*`]+|[*`]+$/g,'').trim();if(!l)continue;const k=l.match(CURE_KEY);if(!k){o.prose.push(l);continue;}
  const r=k[2].trim();let m;
  if(k[1]==='RETRACTED'&&(m=r.match(/^D(\d+)\s+vs\.?\s+C(\d+)$/i)))o.withdrawn.push({link:cureId(m[1],m[2]),line:l});
  else if(k[1]==='CORRECTED RESULT'&&(m=r.match(/^(BROKEN-1|BROKEN-2|PARTIAL-1|PARTIAL-2|PARTIAL-3|HELD-1)$/)))o.result.push({tag:m[1],word:m[1].split('-')[0],line:l});
  else if(k[1]==='CORRECTED COUNT'&&(m=r.match(/^(DEFENDER|CHALLENGER)\s+(\d+)$/)))o.count.push({side:m[1],n:+m[2],line:l});
  else if(k[1]==='CORRECTED STANDING'&&(m=r.match(/^(DEFENDER|CHALLENGER)\s+(SELF-SUPPORTED|PROP-DEPENDENT|COLLAPSED)$/)))o.standing.push({side:m[1],st:m[2],line:l});
  else if(k[1]==='PRESSED'&&(m=r.match(/^D(\d+)\s+vs\.?\s+C(\d+)\s*\|\s*\[(DR1|DR2|CR1|CR2|CR3)\]\s*\|\s*["“](.+)["”]$/i)))o.pressed.push({link:cureId(m[1],m[2]),round:m[3].toUpperCase(),q:m[4],line:l});
  else if(k[1]==='STATEMENT'&&(m=r.match(/^(.+?)\s*\|\s*(\S.{9,})$/)))o.statement.push({label:m[1].trim(),text:m[2].trim(),line:l});
  else if(k[1]==='SHORT'&&(m=r.match(/^D(\d+)\s+vs\.?\s+C(\d+)\s*\|\s*\[(CR2|CR3|DR2|DR3)\]\s*\|\s*["“](.+?)["”]\s*\|\s*(\S.{9,})$/i)))o.short.push({link:cureId(m[1],m[2]),round:m[3].toUpperCase(),q:m[4],why:m[5],line:l});
  else if(k[1]==='RESTATED'&&(m=r.match(/^D(\d+)(?:\s+vs\.?\s+C(\d+))?\b/i))){const g=r.slice(m[0].length).toUpperCase().match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS)/);
   o.restated.push({link:m[2]?cureId(m[1],m[2]):'D'+m[1],grade:g?g[1]:null,text:r,line:l});}
  else o.malformed.push(l);}
 return o;}
// Judge each item against the fixed-form lines (6904 c; 6946; 6952).
// K-B: exactly one RESTATED line for the link; its grade (the first after the link, as drvCheck finds it) is that side's LINK BROKEN; the line
// passes the K-B counter (two kinds). K-G1: RETRACTED for the link; or one CORRECTED COUNT for that side at least the number of that side's
// K-G1 links, and a PRESSED line for the link whose round presses that side (defender [DR1], [DR2]; challenger [CR1]-[CR3], 6950) and whose
// quotation is found in that round's text. K-G3: one CORRECTED STANDING for that side other than SELF-SUPPORTED; or a RETRACTED line for every
// BROKEN link of that side (none readable: UNCURED, 6949). Two differing lines for one count or standing, or two restatements: UNCURED.
// BB-6904 rev 8 K-G5: verse references in a text, each with its position: a book (capitalised word, first three letters; 1-3 prefix kept;
// Mt Mk Lk Jn Ex Ro read as Matthew Mark Luke John Exodus Romans), chapter:verse, a range (at most 30 verses), comma lists ("1:16, 1:18",
// "1:16,18,20"); a bare chapter:verse with no book before it takes the last book named ("Matthew 1:19 ... 1:25").
const CURE_BK={mt:'mat',mk:'mar',lk:'luk',jn:'joh',ex:'exo',ro:'rom'};
function cureRefs(t){const out=[];const s=String(t||'');let last=null;const re=/(?:((?:[1-3]\s)?[A-Z][a-z]+)\.?\s+)?(\d{1,3}):(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?((?:\s*,\s*(?:\d{1,3}:)?\d{1,3}(?:\s*[-–]\s*\d{1,3})?)*)/g;let m;
 while((m=re.exec(s))){let bk=last;if(m[1]){const b=m[1].toLowerCase().replace(/\s+/g,' ');const n=b.match(/^([1-3]) (.+)$/);const base0=n?n[2]:b;bk=(n?n[1]+' ':'')+(CURE_BK[base0]||base0.slice(0,3));last=bk;}
  if(!bk)continue;const add=(c,v1,v2)=>{if(!v2||v2<v1||v2-v1>30)v2=v1;for(let v=v1;v<=v2;v++)out.push({key:bk+' '+c+':'+v,pos:m.index});};
  let ch=+m[2];add(ch,+m[3],m[4]?+m[4]:0);
  for(const p of (m[5]||'').split(',').map(x=>x.trim()).filter(Boolean)){const q=p.match(/^(?:(\d{1,3}):)?(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?$/);if(!q)continue;if(q[1])ch=+q[1];add(ch,+q[2],q[3]?+q[3]:0);}}
 return out;}
// The verses of a line's first parentheses that the link round names, each with the link round's answer to it: the text from 300 characters
// before each naming to 1,200 after, kept inside the LINK block that holds the naming (7194 defect 1: a whole block let an unrelated sentence cure).
// BB-7397 rev 9 DoD 19: w widens each window by w characters on each side, inside the LINK block; left and right hold the two margins alone,
// so a quotation found in the widened text and in neither margin alone overlaps the window. w 0 is the window as before.
function cureNamed(line,LR,w){w=w>0?w:0;const p=String(line||'').match(/\(([^)]*\d+:\d+[^)]*)\)/);if(!p)return [];const want=new Set(cureRefs(p[1]).map(r=>r.key));if(!want.size)return [];
 const heads=[];const hr=/^[ \t>*#_-]*LINK\s+\d+/gmi;let h;while((h=hr.exec(LR)))heads.push(h.index);
 const span=(pos)=>{let a=0,b=LR.length;for(const x of heads){if(x<=pos)a=x;else{b=x;break;}}const lo=Math.max(a,pos-300),hi=Math.min(b,pos+1200);return {t:LR.slice(Math.max(a,lo-w),Math.min(b,hi+w)),l:LR.slice(Math.max(a,lo-w),lo),r:LR.slice(hi,Math.min(b,hi+w))};};
 const by={};for(const r of cureRefs(LR))if(want.has(r.key))(by[r.key]=by[r.key]||[]).push(span(r.pos));
 return Object.keys(by).map(k=>({ref:k,blocks:by[k].map(x=>x.t),left:by[k].map(x=>x.l),right:by[k].map(x=>x.r)}));}
// BB-7397 rev 8 DoD 18 (rulings 105; the test of 7564 item 1): a RETRACTED line counts only beside a reason, a STATEMENT or prose line of the
// reply that names the same link, a round ([CR1]-[DR3]) and words in quotation marks (3+ words) or a verse. Placement is free; a line that
// names only the flag, the rule or the cure carries none of these and is no reason. Returns the links (upper case) that have a reason.
// Amendment 3 (7571, Worker_E's 7570): the flagged item's own words are the flag, not a reason. A STATEMENT is tested after its bar only, and
// from every carrier the text of a flagged item's line (flags: the items' lines; whitespace and emphasis folded) is removed before the test.
function cureReasoned(o,flags){const U=s=>String(s).toUpperCase();const out=new Set();
 const fold=s=>String(s||'').replace(/[*_`]+/g,'').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/\s+/g,' ').trim();
 const F=[...new Set((flags||[]).map(fold).filter(Boolean))].sort((a,b)=>b.length-a.length);
 const strip=s=>{let t=fold(s);for(const f of F)t=t.split(f).join(' ');return t.replace(/\s+/g,' ').trim();};
 const carriers=o.statement.map(s=>({name:fold(s.label)+' '+strip(s.text),body:strip(s.text)})).concat(o.prose.map(p=>{const t=strip(p);return {name:t,body:t};}));
 for(const w of o.withdrawn){const m=String(w.link).match(/^D(\d+) vs C(\d+)$/);if(!m)continue;const re=new RegExp('\\bD'+m[1]+'\\s+vs\\.?\\s+C'+m[2]+'\\b','i');
  if(carriers.some(c=>re.test(c.name)&&/[\[(]?\b[CD]R[1-3]\b/i.test(c.body)&&(/["“][^"”]*\S\s+\S+\s+\S[^"”]*["”]/.test(c.body)||cureRefs(c.body).length>0)))out.add(U(w.link));}
 return out;}
function cureVerdicts(items,reply,broken,rounds){const U=s=>String(s).toUpperCase();const o=cureLines(reply&&reply.ok?reply.text:'');const R=rounds||{};
 const nK1={DEFENDER:items.filter(x=>x.rule==='K-G1'&&x.side==='DEFENDER').length,CHALLENGER:items.filter(x=>x.rule==='K-G1'&&x.side==='CHALLENGER').length};
 const rsn=cureReasoned(o,items.map(x=>x.line)); // DoD 18; amendment 3: the items' own lines are no reason
 const wd=new Set(o.result.length===1?o.withdrawn.filter(w=>rsn.has(U(w.link))).map(w=>U(w.link)):[]); // BB-7330: a retraction counts only beside exactly one CORRECTED RESULT line
 const rxNoWhy=new Set(o.result.length===1?o.withdrawn.filter(w=>!rsn.has(U(w.link))).map(w=>U(w.link)):[]); // DoD 18: retracted with no reason
 const rxNoRes=new Set(o.result.length!==1?o.withdrawn.map(w=>U(w.link)):[]);
 // ITEM 5: the judge's own STATEMENT for this item: by its link, or for a standing item by its side; the first one written is kept.
 const stmtOf=(x)=>{const st=o.statement.find(s=>x.link?U(s.label).includes(U(x.link)):(U(s.label).includes(x.side)&&U(s.label).includes(U(x.rule))));return st?st.text:null;};
 // 6904 (c): a statement is run through the item's own check. Quotations in it (straight or curly marks, 3+ words) and round names ([DR1] etc.).
 const stmtQ=(t)=>[...String(t||'').matchAll(/["“]([^"”]{8,})["”]/g)].map(m=>m[1]);
 const stmtPress=(x)=>{const t=stmtOf(x);if(!t)return null;for(const rk of CURE_PRESS[x.side]){if(!new RegExp('\\['+rk+'\\]').test(t)||typeof R[rk]!=='string')continue;const q=stmtQ(t).find(q=>cureFound(q,R[rk]));if(q)return {round:rk,q,line:'STATEMENT: '+t};}return null;};
 return items.map(x=>{const res=(status,why,lines,kinds)=>{const keys=(x.rule==='K-B'||x.rule==='K-S')?[x.link]:(x.rule==='K-G1'||x.rule==='K-G4')?[x.link,x.side]:[x.side].concat((broken||{})[x.side]||[]);
   const bad=status==='UNCURED'?o.malformed.find(l=>keys.some(k=>k&&U(l).includes(U(k)))):null;
   return {...x,judge_statement:stmtOf(x),status,why:(why||'')+(bad?(why?'; ':'')+'malformed line: '+bad.slice(0,160):'')||null,statement:(l=>l&&l.length?l.join(' / '):null)(status==='CURED'&&/^retracted/.test(why||'')&&o.result.length===1?(lines||[]).concat([o.result[0].line]):lines),kinds:kinds||[]};}; // BB-7330: a cure by retraction shows its CORRECTED RESULT line
  if(!reply||!reply.ok)return res('UNCURED','cure call failed: '+(reply?reply.why:'no reply'),null);
  if(x.link&&rxNoRes.has(U(x.link)))return res('UNCURED','RETRACTED without exactly one CORRECTED RESULT line',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
  if(x.link&&rxNoWhy.has(U(x.link)))return res('UNCURED','RETRACTED with no reason naming the round and its words or verse (rulings 105)',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
  // BB-6904 rev 8 K-G5 (operational_doc 27 class 1): the verses of the line's parentheses that the answering link round names; for those a
  // SHORT line must quote that link round's own answer: words found near its naming of the verse (cureNamed: 300 characters before to 1,200
  // after, inside its LINK block). References are read by cureRefs (lists, ranges, short book names, inherited book).
  // BB-6904 rev 12 (7374, 7377): the answer is read from any later round of the side that holds the link, its round 2 or its link round,
  // that comes after the round named as pressing the witness (order CR1 DR1 CR2 DR2 CR3 DR3).
  const ORD=['CR1','DR1','CR2','DR2','CR3','DR3'];const ansK=pr=>(x.side==='DEFENDER'?['CR2','CR3']:['DR2','DR3']).filter(k=>!pr||ORD.indexOf(k)>ORD.indexOf(pr));
  const namedIn=pr=>(x.rule==='K-G1'||x.rule==='K-G4')?ansK(pr).filter(k=>typeof R[k]==='string'&&R[k]).map(k=>({k,n:cureNamed(x.line,R[k])})).filter(z=>z.n.length):[];
  const nmTxt=pr=>namedIn(pr).map(z=>'['+z.k+'] '+z.n.map(n=>n.ref).join(', ')).join('; ');
  // A quotation is the answer only in that round's own words: it is not also found in a round of the other side before it (a verse's own
  // words, quoted by both sides, never count as the answer).
  const ownQ=(q,k)=>!(x.side==='DEFENDER'?['DR1','DR2','DR3']:['CR1','CR2','CR3']).some(o2=>ORD.indexOf(o2)<ORD.indexOf(k)&&typeof R[o2]==='string'&&cureFound(q,R[o2]));
  // BB-7397 rev 9 DoD 19: a quotation counts when it overlaps a window: found in the window widened by twice its length and 40 characters,
  // and in neither margin alone (a second occurrence inside a margin makes the test refuse, never accept).
  const inWin=(q,z)=>cureNamed(x.line,R[z.k],2*String(q).length+40).some(n=>n.blocks.some((b,i)=>cureFound(q,b)&&!cureFound(q,n.left[i])&&!cureFound(q,n.right[i])));
  const shortOk=pr=>{const nm=namedIn(pr);return !nm.length||o.short.some(s=>U(s.link)===U(x.link)&&nm.some(z=>z.k===s.round&&ownQ(s.q,z.k)&&inWin(s.q,z)))||stmtQ(stmtOf(x)).some(q=>nm.some(z=>ownQ(q,z.k)&&inWin(q,z)));};
  if(x.rule==='K-G4'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   const ps=o.pressed.filter(p=>U(p.link)===U(x.link));const sl=o.short.filter(s=>U(s.link)===U(x.link)).map(s=>s.line);const lines=ps.map(p=>p.line).concat(sl);
   if(!ps.length){const sp=stmtPress(x);if(!sp)return res('UNCURED','no PRESSED line, no RETRACTED line, and no statement that names a pressing round and quotes it, for '+x.link,lines);
    if(!shortOk(sp.round))return res('UNCURED','statement quotes '+sp.round+'; the later round '+nmTxt(sp.round)+' and neither a SHORT line nor the statement quotes its answer',lines.concat([sp.line]));
    return res('CURED','statement passes the check: quotation found in '+sp.round+(nmTxt(sp.round)?'; answer quoted for '+nmTxt(sp.round):''),lines.concat([sp.line]));}
   const ok=ps.filter(p=>CURE_PRESS[x.side].includes(p.round));if(!ok.length)return res('UNCURED','PRESSED round '+ps.map(p=>'['+p.round+']').join(', ')+' does not press the '+x.side.toLowerCase(),lines);
   const hit=ok.find(p=>typeof R[p.round]==='string'&&cureFoundAll(p.q,R[p.round]));if(!hit)return res('UNCURED',ok.every(p=>typeof R[p.round]!=='string')?'the named round text could not be read':'no quotation found in the named round',lines);
   if(!shortOk(hit.round))return res('UNCURED','the later round '+nmTxt(hit.round)+'; no SHORT line quoting its answer',lines);
   return res('CURED','pressed: quotation found in '+hit.round+(nmTxt(hit.round)?'; SHORT found for '+nmTxt(hit.round):''),lines);}
  if(x.rule==='K-B'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));const rs=o.restated.filter(r=>U(r.link)===U(x.link));
   if(!rs.length){const st=stmtOf(x);if(!st)return res('UNCURED','no RESTATED line and no statement for '+x.link,null);const sk=drvKinds(st);
    return res(sk.length>=2?'CURED':'UNCURED',sk.length>=2?'statement passes K-B':'statement exhibits '+sk.length+' layer kind'+(sk.length===1?'':'s')+'; the violation stands',['STATEMENT: '+st],sk);}if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   const k=drvKinds(rs[0].text);if(rs[0].grade!==x.side+' LINK BROKEN')return res('UNCURED','statement does not keep the grade '+x.side+' LINK BROKEN'+(rs[0].grade?' (it reads '+rs[0].grade+')':''),[rs[0].line],k);
   return res(k.length>=2?'CURED':'UNCURED',k.length>=2?null:'statement exhibits '+k.length+' layer kind'+(k.length===1?'':'s'),[rs[0].line],k);}
  if(x.rule==='K-G1'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   const cs=o.count.filter(c=>c.side===x.side);const ns=[...new Set(cs.map(c=>c.n))];const ps=o.pressed.filter(p=>U(p.link)===U(x.link));const lines=cs.map(c=>c.line).concat(ps.map(p=>p.line));
   if(!ns.length)return res('UNCURED','no CORRECTED COUNT for '+x.side+' and no RETRACTED line for '+x.link,lines);
   if(ns.length>1)return res('UNCURED','two differing CORRECTED COUNT lines for '+x.side,lines);
   if(ns[0]<nK1[x.side])return res('UNCURED','corrected count '+ns[0]+' is below '+nK1[x.side],lines);
   if(!ps.length){const sp=stmtPress(x);if(!sp)return res('UNCURED','no PRESSED line and no statement that names a pressing round and quotes it, for '+x.link,lines);
    if(!shortOk(sp.round))return res('UNCURED','the later round '+nmTxt(sp.round)+'; neither a SHORT line nor the statement quotes its answer',lines.concat([sp.line]));
    return res('CURED','corrected: '+x.side+' COUNT '+ns[0]+'; statement passes the check: quotation found in '+sp.round,lines.concat([sp.line]));}
   const ok=ps.filter(p=>CURE_PRESS[x.side].includes(p.round));if(!ok.length)return res('UNCURED','PRESSED round '+ps.map(p=>'['+p.round+']').join(', ')+' does not press the '+x.side.toLowerCase()+' (it must be '+CURE_PRESS[x.side].map(k=>'['+k+']').join(', ')+')',lines);
   const hit=ok.find(p=>typeof R[p.round]==='string'&&cureFoundAll(p.q,R[p.round]));
   if(hit&&!shortOk(hit.round))return res('UNCURED','the later round '+nmTxt(hit.round)+'; no SHORT line quoting its answer',lines);
   if(hit)return res('CURED','corrected: '+x.side+' COUNT '+ns[0]+'; quotation found in '+hit.round,lines);
   return res('UNCURED',ok.every(p=>typeof R[p.round]!=='string')?'the named round text could not be read':'no quotation found in the named round',lines);}
  if(x.rule==='K-G3'){const ss=o.standing.filter(s=>s.side===x.side);const sv=[...new Set(ss.map(s=>s.st))];
   if(sv.length>1)return res('UNCURED','two differing CORRECTED STANDING lines for '+x.side,ss.map(s=>s.line));
   if(sv.length===1&&sv[0]!=='SELF-SUPPORTED')return res('CURED','corrected: '+x.side+' STANDING '+sv[0],ss.map(s=>s.line));
   const need=((broken||{})[x.side]||[]).map(U);const wl=o.withdrawn.filter(w=>need.includes(U(w.link))).map(w=>w.line);
   if(!need.length)return res('UNCURED','the BROKEN links of '+x.side+' could not be read from the judgment',ss.map(s=>s.line).concat(wl));
   const miss=need.filter(l=>!wd.has(l));if(!wl.length&&!ss.length)return res('UNCURED','no CORRECTED STANDING for '+x.side+' and no RETRACTED line',null);
   if(miss.length)return res('UNCURED',(sv[0]==='SELF-SUPPORTED'?'standing kept SELF-SUPPORTED; ':'')+(miss.some(l=>rxNoRes.has(l))?'RETRACTED without exactly one CORRECTED RESULT line; ':'')+(miss.some(l=>rxNoWhy.has(l))?'RETRACTED with no reason naming the round and its words or verse (rulings 105); ':'')+'no counted RETRACTED line for '+miss.join(', '),ss.map(s=>s.line).concat(wl));
   return res('CURED','retracted: '+need.join(', '),wl);}
  // THE DEBATE FIXED (BB-7397, DoD 3, binding note BB-7409) K-G6: a premise the ledger marks NOT NAMED that the judge's count does not
  // count. Cured by a statement quoting the transcript, or by a CORRECTED COUNT at least the original count plus the side's K-G6 premises
  // not answered by statement, with the CORRECTED STANDING that count makes true (COLLAPSED when 2c > L, else PROP-DEPENDENT).
  // DoD 7 (BB-7420) K-G7: a DEFENDER LINK BROKEN line on a premise the judge's count leaves uncounted. K-G6 and K-G7 share one count: the
  // side's count plus the union of its K-G6 premises not cured by statement and its K-G7 premises not retracted. K-G7 is also cured by a
  // RETRACTED line for the link beside exactly one CORRECTED RESULT (the seat is then counted on that result, cureCorrected).
  const sq=y=>{const q=stmtQ(stmtOf(y));return Object.keys(R).find(k=>typeof R[k]==='string'&&q.some(z=>cureFound(z,R[k])))||null;};
  const kNeed=sd=>{const ps=new Set();for(const y of items){if(y.side!==sd)continue;
   if(y.rule==='K-G6'&&!sq(y))ps.add('P'+(String(y.link).match(/(\d+)\s*$/)||[0,y.link])[1]);if(y.rule==='K-G7'&&!wd.has(U(y.link)))ps.add(y.premise!=null?'P'+y.premise:'L'+U(y.link));}return ps.size;};
  const kCount=(x,none)=>{const needN=(x.conc||0)+kNeed(x.side);
   const cs=o.count.filter(c=>c.side===x.side);const ns=[...new Set(cs.map(c=>c.n))];const ss=o.standing.filter(s=>s.side===x.side);const sv=[...new Set(ss.map(s=>s.st))];const lines=cs.map(c=>c.line).concat(ss.map(s=>s.line));
   if(!ns.length)return res('UNCURED','no CORRECTED COUNT for '+x.side+' and '+none+' for '+x.link,lines);
   if(ns.length>1)return res('UNCURED','two differing CORRECTED COUNT lines for '+x.side,lines);
   if(ns[0]<needN)return res('UNCURED','corrected count '+ns[0]+' is below '+needN,lines);
   if(sv.length>1)return res('UNCURED','two differing CORRECTED STANDING lines for '+x.side,lines);
   const want=(x.L&&2*ns[0]>x.L)?'COLLAPSED':'PROP-DEPENDENT';const got=sv.length===1?sv[0]:(x.st||null);
   if(got!==want)return res('UNCURED','count '+ns[0]+' of '+(x.L||'?')+' makes the '+x.side+' standing '+want+'; it reads '+(got||'none'),lines);
   return res('CURED','counted: '+x.side+' COUNT '+ns[0]+', STANDING '+want,lines);};
  if(x.rule==='K-G6'){if(o.count.some(c=>c.side===x.side&&c.n>(x.conc||0)))return kCount(x,'no statement quoting the transcript');const rk=sq(x);if(rk)return res('CURED','statement quotes the transcript ('+rk+')',['STATEMENT: '+stmtOf(x)]);
   return kCount(x,'no statement quoting the transcript');}
  if(x.rule==='K-G7'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   return kCount(x,'no RETRACTED line with one CORRECTED RESULT');}
  // DoD 9 K-G8: the side's counted_premises array and its count differ; cured by the count the line and the side's K-G6/K-G7 premises make.
  if(x.rule==='K-G8')return kCount(x,'no other cure');
  // P2D v6a item 1b: K-S is cured by one RESTATED line for the link that names an answering round, or that grades it LINK BROKEN beside one CORRECTED RESULT.
  if(x.rule==='K-S'){const rs=o.restated.filter(r=>U(r.link)===U(x.link));
   if(!rs.length)return res('UNCURED','no RESTATED line for '+x.link,null);if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   if(/LINK BROKEN$/.test(rs[0].grade||'')){if(o.result.length!==1)return res('UNCURED','regraded LINK BROKEN without exactly one CORRECTED RESULT line',[rs[0].line]);return res('CURED','regraded LINK BROKEN',[rs[0].line,o.result[0].line]);}
   if(!DRV_ANS.test(rs[0].text))return res('UNCURED','the restated line names no round that answered the witness',[rs[0].line]);
   return res('CURED','regraded: answering round named',[rs[0].line]);}
  return res('UNCURED','unknown rule',null);});}
// BB-7330 (option 2, the operator's "2" at 14:51 CDT): where a RETRACTED line cured an item, the seat is counted on its one CORRECTED RESULT.
function cureCorrected(reply,v){const o=cureLines(reply&&reply.ok?reply.text:'');if(o.result.length!==1)return null;
 if(!(v||[]).some(x=>x.status==='CURED'&&/^(?:retracted|regraded LINK BROKEN)/.test(x.why||'')))return null;const rsn=cureReasoned(o,(v||[]).map(x=>x.line));return {tag:o.result[0].tag,word:o.result[0].word,links:[...new Set(o.withdrawn.filter(w=>rsn.has(String(w.link).toUpperCase())).map(w=>w.link))]};}
// THE DEBATE FIXED (BB-7397, DoD 5, BB-7406): a cure's CORRECTED STANDING and CORRECTED COUNT for a side with a CURED count or standing item
// (K-G1, K-G3, K-G6, K-G7) are written to the row's columns; the original is kept in the judge's text by an AUDIT line.
function cureSet(reply,v){const o=cureLines(reply&&reply.ok?reply.text:'');const out={};
 // BB-7417 defect 3: a side is written only when every count or standing item of that side is CURED, and not when each is a K-G6
 // statement cure (no count was checked).
 for(const side of ['DEFENDER','CHALLENGER']){const ks=(v||[]).filter(x=>x.side===side&&(x.rule==='K-G1'||x.rule==='K-G3'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'));
  if(!ks.length||ks.some(x=>x.status!=='CURED')||ks.every(x=>x.rule==='K-G6'&&/^statement/.test(String(x.why||''))))continue;
  const ns=[...new Set(o.count.filter(c=>c.side===side).map(c=>c.n))];const sv=[...new Set(o.standing.filter(s=>s.side===side).map(s=>s.st))];
  if(ns.length===1||sv.length===1)out[side]={n:ns.length===1?ns[0]:null,st:sv.length===1?sv[0]:null};}
 return Object.keys(out).length?out:null;}
function cureSetApply(p,cs,seat){const F={DEFENDER:['defense_standing','conceded_links'],CHALLENGER:['challenge_standing','challenger_conceded_links']};const lines=[];
 for(const side of Object.keys(cs||{})){const fs=F[side][0],fn=F[side][1],c=cs[side];const was=(p[fs]||'?')+', '+(p[fn]==null?'?':p[fn]);
  if(c.st)p[fs]=c.st;if(c.n!=null)p[fn]=c.n;
  lines.push('[AUDIT v21: CORRECTED STANDING -- '+(seat?'SEAT: '+seat+'; ':'')+'SIDE: '+side+'; ORIGINAL: '+was+'; COUNTED: '+(p[fs]||'?')+', '+(p[fn]==null?'?':p[fn])+']');}
 return lines;}
// THE DEBATE FIXED rev 7, DoD 10 record half (ruled BB-7508 (i)): BB-7417 defect 3 stands, so a side whose count or standing items are not
// all CURED is not written; when the reply holds one CORRECTED COUNT for that side, one AUDIT line records the count and the items not cured.
function cureCountHeld(reply,v,cs,seat){const o=cureLines(reply&&reply.ok?reply.text:'');const lines=[];
 for(const side of ['DEFENDER','CHALLENGER']){if(cs&&cs[side])continue;const ns=[...new Set(o.count.filter(c=>c.side===side).map(c=>c.n))];if(ns.length!==1)continue;
  const nc=(v||[]).filter(x=>x.side===side&&(x.rule==='K-G1'||x.rule==='K-G3'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8')&&x.status!=='CURED');if(!nc.length)continue;
  lines.push('[AUDIT v21: CORRECTED COUNT NOT WRITTEN -- '+(seat?'SEAT: '+seat+'; ':'')+'SIDE: '+side+'; CORRECTED COUNT: '+ns[0]+'; NOT CURED: '+cureSafe(nc.map(x=>x.rule+' '+(x.rule==='K-G3'?x.side+' STANDING':x.link)).join(', '))+'; written only when every count or standing item of the side is CURED (BB-7417)]');}
 return lines;}
const cureCorrLine=(seat,orig,c)=>'[AUDIT v21: CORRECTED RESULT -- '+(seat?'SEAT: '+seat+'; ':'')+'ORIGINAL: '+orig+'; COUNTED: '+c.word+' ('+c.tag+'); RETRACTED: '+c.links.join(', ')+']';
const cureSafe=s=>String(s).replace(/\[/g,'(').replace(/\]/g,')').replace(/;(\s*(?:SEAT|ITEM|RULE|RESULT|KINDS|WHY|LINE|STATEMENT|JUDGE STATEMENT):)/g,',$1');
// Report line (step 6, 6904 e): fixed fields in fixed order, read back by Format Markdown. SEAT (panel only), ITEM, RULE, RESULT, then
// KINDS, WHY, LINE (the judge's original line, cut at 300 characters with "...") and STATEMENT when present; judge text has its brackets made round and any "; KEY:" broken.
// BB-7397 rev 9 DoD 24: STATEMENT and JUDGE STATEMENT above 600 characters are cut at the last space at or before 597, with "...".
function cureCut(s){s=String(s);if(s.length<=600)return s;const k=s.lastIndexOf(' ',597);return s.slice(0,k>0?k:597).replace(/\s+$/,'')+'...';}
function cureReport(seat,v){return v.map(x=>'[AUDIT v21: DEBATE RULE VIOLATION REPORT -- '+(seat?'SEAT: '+seat+'; ':'')+'ITEM: '+(x.rule==='K-G3'?x.side+' STANDING':x.link)+'; RULE: '+x.rule+'; RESULT: '+x.status
 +(x.kinds&&x.kinds.length?'; KINDS: '+x.kinds.join(', '):'')+(x.why?'; WHY: '+cureSafe(x.why):'')+(x.line?'; LINE: '+cureSafe((l=>l.length>300?l.slice(0,297)+'...':l)(String(x.line).replace(/\s+/g,' ').trim())):'')
 +(x.statement?'; STATEMENT: '+cureSafe(cureCut(x.statement)):'')+'; JUDGE STATEMENT: '+(x.judge_statement?cureSafe(cureCut(x.judge_statement)):'none written')+']');}
// The prose of the reply, recorded once and never read for a cure (BB-6952). Empty when the reply has no prose or the call failed.
function cureProse(seat,reply){const p=reply&&reply.ok?cureLines(reply.text).prose.join(' ').replace(/\s+/g,' ').trim():'';
 return p?['[AUDIT v21: DEBATE RULE VIOLATION REPLY -- '+(seat?seat+' ':'')+'prose recorded, not read for a cure: '+cureSafe(p.slice(0,600))+']']:[];}

const PP=$('Panel Payloads').first().json;const rs=[];for(const n of ['Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3']){try{if($(n).isExecuted)$(n).all().forEach(x=>rs.push(x.json));}catch(e){}}
const bodies=PP.bodies.slice();const summary=(PP.summary||[]).map(s=>({...s}));
summary.forEach((s,i)=>{const all=s.drv||[];s.cure=[];if(!all.length)return;
 const r=rs.find(x=>x.cure&&x.cure.idx===i)||null;
 const v=cureVerdicts(all,r?r.reply:{ok:false,why:'no cure call was made for this seat'},r&&r.cure?r.cure.broken:null,r&&r.cure?r.cure.rounds:null);
 s.cure=v.map(x=>({rule:x.rule,side:x.side,link:x.link,status:x.status,kinds:x.kinds,why:x.why}));
 const b=JSON.parse(bodies[i]);b.payload.drv_uncured=v.filter(x=>x.status!=='CURED').length;b.payload.verdict_raw=b.payload.verdict_raw+'\n'+cureReport(s.seat,v).concat(cureProse(s.seat,r?r.reply:null)).join('\n');
 const cc=cureCorrected(r?r.reply:null,v);if(cc){b.payload.verdict_raw=b.payload.verdict_raw+'\n'+cureCorrLine(s.seat,b.payload.verdict_tag,cc);b.payload.verdict_tag=cc.word;s.corrected=cc;}
 const cs=cureSet(r?r.reply:null,v);if(cs){b.payload.verdict_raw=b.payload.verdict_raw+'\n'+cureSetApply(b.payload,cs,s.seat).join('\n');s.corrected_standing=cs;}
 {const ch=cureCountHeld(r?r.reply:null,v,cs,s.seat);if(ch.length)b.payload.verdict_raw=b.payload.verdict_raw+'\n'+ch.join('\n');}
 bodies[i]=JSON.stringify(b);});
// BB-6904 portion F (7069 option 1): the alternate gate's decision is made here, so Alternate Needed? holds no logic of its own
// (an n8n expression rejects a statement body: BB-7068). True when any body's drv_uncured is above 0 (a malformed body counts as not
// above 0) or Init Seats carries qualify_alternate: the reads of the condition it replaces.
const altS=$('Init Seats').first().json;
const alt_needed=bodies.some(b=>{try{return (JSON.parse(b).payload.drv_uncured||0)>0;}catch(e){return false;}})||!!altS.qualify_alternate;
return [{json:{...PP,bodies,summary,alt_needed}}];
