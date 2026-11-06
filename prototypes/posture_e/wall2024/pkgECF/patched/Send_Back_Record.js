// pkgSBX: the shared line reader (reader/readLines.cjs sha 3c0bdf1f9cd7fb3f), as in the library nodes
const __RL=(function(){const module={exports:{}};const exports=module.exports;
// readLines (W3 line_form_spec.md, phase 1: shadow only, no caller uses it yet).
// readLine(line) -> {form, f:{...fields}, norm} or {form:null, why}. readLines(text) -> rows, one per non-empty line, with its line number.
// Grade words are upper-case and case-sensitive (spec 0.6); labels (vs, GROUND, Commitment, MEANS, ANSWER, FAILS) are case-insensitive.
const SEP='(?:--|\\u2014|\\u2013)';                       // spec 0.5: "--", em dash, en dash
const PAIR='(D\\d+)\\s+[vV][sS]\\.?\\s+(C\\d+)';            // spec 1: D<i> vs C<j>, "vs." allowed
const RND='\\[{0,2}\\s*((?:CR|DR)[1-4]|(?:Defender|Challenger)\\s*R(?:ound)?\\s*[1-4])\\s*\\]{0,2}'; // W3 spec 8.2: [Defender Rn] = CRn, [Challenger Rn] = DRn
const rnd=x=>{const u=String(x).toUpperCase().replace(/\s+/g,'');const w=u.match(/^(DEFENDER|CHALLENGER)R(?:OUND)?(\d)$/);return w?(w[1]==='DEFENDER'?'CR':'DR')+w[2]:u;};        // [CR3], CR3, [[CR3]] (KF_LINE accepts the double bracket)
const TAG='\\(\\s*[Cc]ommitment\\s+(\\d+)\\s*\\)';
const COL_GRADE='DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS|WITHDRAWN';
const RES_TAG='BROKEN-1|BROKEN-2|PARTIAL-1|PARTIAL-2|PARTIAL-3|HELD-1';
const STAND='SELF-SUPPORTED|PROP-DEPENDENT|COLLAPSED|FORFEIT(?:ED)?';

// spec 0: normalisation of one stored text (unescape once) and of one line (markdown, list mark, spaces)
// spec 0.1 for a stored judgment: a panel row is a JSON object whose "reasoning" (or "reason") holds the judge's lines; a malformed object still
// gives its reasoning (as cureJText); otherwise the text is the single judge's, before its AUDIT lines.
function judgeText(raw){const s=String(raw==null?'':s0(raw));const a=s.indexOf('{');if(a>=0&&/"reason(?:ing)?"\s*:/.test(s)){try{const o=JSON.parse(s.slice(a,s.lastIndexOf('}')+1));if(o&&typeof o.reasoning==='string')return {text:o.reasoning,src:'json'};if(o&&typeof o.reason==='string')return {text:o.reason,src:'json'};}catch(e){}
  const m=s.slice(a).match(/"reason(?:ing)?"\s*:\s*"([\s\S]*)"\s*\}/);if(m)return {text:m[1].replace(/\\n/g,'\n').replace(/\\"/g,'"').replace(/\\\\/g,'\\'),src:'json-malformed'};}
 const i=s.indexOf('\n\n[AUDIT');return {text:unescapeOnce(i<0?s:s.slice(0,i)),src:'plain'};}
function s0(x){return typeof x==='string'?x:JSON.stringify(x);}
function unescapeOnce(t){t=String(t==null?'':t);if(!/\n/.test(t)&&/\\n/.test(t))t=t.replace(/\\n/g,'\n');return t.replace(/\\"/g,'"');}
// W3 spec 7 G1: after the single unescape for the storage kind, every remaining backslash is an escaping artefact and is removed. norm() is the one
// normalisation every matcher (the gate's line matching included) calls.
function normLine(l){return String(l==null?'':l).replace(/\\+/g,'').replace(/[*_`]+/g,'').replace(/^\s*(?:[-\u2022>]|\d+[.)])\s*/,'').replace(/[ \t]+/g,' ').trim();}
// spec 1 QUOTE: opens with " “ or ', may hold other quotes, ends at the last closing mark before the next field separator or the end
function quoteAt(s,next){const m=s.match(/^\s*:?\s*(["\u201c'])/);if(!m)return null;const body=s.slice(m[0].length);
 // with a next-field label (ANSWER, FAILS) the quote runs to that field, so a quote holding " -- " or inner quotes is read whole (33021 gemini, 33020 grok)
 let sep=-1;if(next){const k=body.search(new RegExp('\\s'+SEP+'\\s*'+next+'\\b','i'));if(k>=0)sep=k;}if(sep<0)sep=body.search(new RegExp('\\s'+SEP+'\\s'));const seg=sep<0?body:body.slice(0,sep);const close=Math.max(seg.lastIndexOf('"'),seg.lastIndexOf('\u201d'),m[1]==="'"?seg.lastIndexOf("'"):-1);
 if(close<0)return null;return {q:seg.slice(0,close),rest:body.slice(close+1)};}

const P={};
P.FORCED=s=>{const m=s.match(new RegExp('^FORCED\\s*(?:'+TAG+')?\\s*:\\s*'+PAIR+'(?:\\s*'+TAG.replace('(\\d+)','(\\d+)')+')?\\s*'+SEP+'\\s*MEANS\\s*'+RND+'\\s*:?','i'));if(!m)return null; /* W3 spec 11: the tag may also follow the pair */
 const f={tag:m[1]?+m[1]:(m[4]?+m[4]:null),pair:m[2]+' vs '+m[3],meansRound:rnd(m[5])};let r=s.slice(m[0].length);let q=quoteAt(r,'ANSWER');if(!q)return {why:'FORCED: MEANS has no quotation',code:'FORCED_MEANS_HAS_NO_QUOTATION'};f.means=q.q;r=q.rest.replace(/^\s*\([^\n]*?\)/,'');
 let a=r.match(new RegExp('^\\s*'+SEP+'\\s*ANSWER\\s*'+RND+'\\s*:?','i'));if(!a)return {why:'FORCED: no ANSWER <round> after MEANS',code:'FORCED_NO_ANSWER_ROUND_AFTER_MEANS'};f.answerRound=rnd(a[1]);r=r.slice(a[0].length);q=quoteAt(r,'FAILS');if(!q)return {why:'FORCED: ANSWER has no quotation',code:'FORCED_ANSWER_HAS_NO_QUOTATION'};f.answer=q.q;r=q.rest.replace(/^\s*\([^\n]*?\)/,'');
 a=r.match(new RegExp('^\\s*'+SEP+'\\s*FAILS\\s*:?','i'));if(!a)return {why:'FORCED: no FAILS after ANSWER',code:'FORCED_NO_FAILS_AFTER_ANSWER'};r=r.slice(a[0].length);q=quoteAt(r);if(!q)return {why:'FORCED: FAILS has no quotation',code:'FORCED_FAILS_HAS_NO_QUOTATION'};f.fails=q.q;f.tail=q.rest.trim();
 f.breaks=f.meansRound.startsWith('CR')?'CHALLENGER':'DEFENDER';return f;};                     // KS: MEANS [CR] breaks the challenger
P.COLLISION=s=>{const m=s.match(new RegExp('^(RESTATED\\s*:\\s*)?'+PAIR+'\\b'));if(!m)return null;let r=s.slice(m[0].length);
 const f={restated:!!m[1],pair:m[2]+' vs '+m[3]};const v=r.match(/^\s*\(([^)\n]*)\)/);if(v){f.verse=v[1].trim();r=r.slice(v[0].length);}
 const c=r.match(/^[^:\n(]*:/);if(!c)return {why:'COLLISION: no ":" after the pair (CP2)',code:'COLLISION_NO_COLON_AFTER_THE_PAIR_CP2'};const pre=c[0].slice(0,-1).trim();if(pre)f.text=pre;r=r.slice(c[0].length);
 const g=r.match(new RegExp('^\\s*('+COL_GRADE+')\\b'));if(!g){const lc=r.match(new RegExp('^\\s*('+COL_GRADE+')\\b','i'));return lc?{why:'COLLISION: grade word not upper case (CP2)',code:'COLLISION_GRADE_NOT_UPPER_CASE_CP2'}:{why:'COLLISION: no grade word after ":"',code:'COLLISION_NO_GRADE_WORD'};}
 f.grade=g[1];r=r.slice(g[0].length);const t=r.match(new RegExp('^\\s*'+TAG));if(t){f.tag=+t[1];r=r.slice(t[0].length);}
 const gi=r.search(/\bGROUND\s*:/i);if(gi>=0){f.ground=r.slice(gi).replace(/^GROUND\s*:\s*/i,'').trim();r=r.slice(0,gi);}f.reason=r.replace(new RegExp('^\\s*'+SEP+'\\s*'),'').replace(new RegExp('\\s*'+SEP+'\\s*$'),'').trim();return f;};
P['ANSWER CHECK']=s=>{const m=s.match(new RegExp('^ANSWER CHECK\\s*:\\s*(.+?)\\s*'+SEP+'\\s*(?:(\\[[^\\]\\n]*\\](?:\\s*(?:[,/;]|and)\\s*\\[[^\\]\\n]*\\])*)|((?:CR|DR)[1-4](?:\\s*[,/;]\\s*(?:CR|DR)[1-4])*))\\s*'+SEP+'\\s*','i'));if(!m)return /^ANSWER CHECK\s*:/i.test(s)?{why:'ANSWER CHECK: no <verse> -- <round> head',code:'ANSWER_CHECK_NO_VERSE_ROUND_HEAD'}:null;
 const rr=(m[2]!=null?m[2].replace(/\]\s*(?:[,/;]|and)\s*\[/gi,', ').replace(/^\[|\]$/g,''):m[3]).trim(); /* one bracket, or several ([CR3], [CR4]) */const rounds=[];for(const x of rr.split(/\s*[,/;]\s*|\s+and\s+/i)){let y=x.trim().toUpperCase();const w=y.match(/^(DEFENDER|CHALLENGER)\s*R(?:OUND)?\s*(\d)$/);if(w)y=(w[1]==='DEFENDER'?'CR':'DR')+w[2];if(/^(CR|DR)[1-4]$/.test(y))rounds.push(y);}
 const f={verse:m[1].trim(),roundRaw:rr,rounds};if(!rounds.length)f.roundNone=true;                                  let r=s.slice(m[0].length); // [ledger], [NONE] (33014): no round
 const fld=(k)=>{const a=r.match(new RegExp('^'+k+'\\s*:?','i'));if(!a)return undefined;r=r.slice(a[0].length);const q=quoteAt(r,k==='MEANS'?'ANSWER':'(?:MEETS|MISSES|FAILS|UNPROVEN)');let v;
  if(q){v=q.q;const t=q.rest.search(new RegExp('\\s'+SEP+'\\s'));f[k.toLowerCase()+'Note']=(t<0?q.rest:q.rest.slice(0,t)).trim()||undefined;r=t<0?'':q.rest.slice(t);}   // text after the quote, before the next field (33025 grok)
  else{const t=r.search(new RegExp('\\s'+SEP+'\\s'));v=(t<0?r:r.slice(0,t)).trim();f[k.toLowerCase()+'Bare']=true;r=t<0?'':r.slice(t);}            // MEANS: NONE (33025 chatgpt)
  r=r.replace(new RegExp('^\\s*'+SEP+'\\s*'),'');return v;};
 const mv=fld('MEANS');if(mv!==undefined)f.means=mv;const av=fld('ANSWER');if(av!==undefined)f.answer=av;
 const g=r.match(/^(MEETS|MISSES|FAILS|UNPROVEN)\b/);if(!g){const lc=r.match(/^(MEETS|MISSES|FAILS|UNPROVEN)\b/i);return lc?{why:'ANSWER CHECK: grade word not upper case',code:'ANSWER_CHECK_GRADE_NOT_UPPER_CASE'}:{why:'ANSWER CHECK: no MEETS, MISSES, FAILS or UNPROVEN after the answer',code:'ANSWER_CHECK_NO_GRADE_WORD'};}
 f.grade=g[1];f.gradeRead=g[1]==='FAILS'?'MISSES':g[1];r=r.slice(g[0].length);const t=r.match(new RegExp('^\\s*'+TAG));if(t){f.tag=+t[1];r=r.slice(t[0].length);}f.tail=r.replace(new RegExp('^\\s*'+SEP+'\\s*'),'').trim();return f;};
P.KEYSTONE=s=>{const m=s.match(/^KEYSTONE\s*:\s*(D\d+)\s*(?:--|\u2014|\u2013|-|:)?\s*(STANDS|BROKEN|WITHDRAWN)\b/);if(!m)return /^KEYSTONE\s*:/i.test(s)?{why:'KEYSTONE: no D<i> and STANDS, BROKEN or WITHDRAWN',code:'KEYSTONE_NO_D_I_AND_STANDS_BROKEN_OR_WITHDRAWN'}:null;
 const r=s.slice(m[0].length);return {link:m[1],grade:m[2],tag:m[3]?+m[3]:null,reason:r.replace(new RegExp('^\\s*'+SEP+'\\s*'),'').trim(),derived:/derived by the engine/i.test(r)};};
P.RESULT=s=>{const m=s.match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)\b/);if(!m)return /^RESULT\s*:/i.test(s)?{why:'RESULT: no DEFENDER WINS, CHALLENGER WINS or UNDERDETERMINED',code:'RESULT_NO_DEFENDER_WINS_CHALLENGER_WINS_OR_UNDERDETERMINED'}:null;return {result:m[1],reason:s.slice(m[0].length).replace(new RegExp('^\\s*'+SEP+'\\s*'),'').trim()};};
P['CORRECTED RESULT']=s=>{const m=s.match(new RegExp('^CORRECTED RESULT\\s*:\\s*('+RES_TAG+')(?:\\s*(?:--|\\u2014|\\u2013|:|;|,|\\()([\\s\\S]*))?$','i'));if(!m)return /^CORRECTED RESULT\s*:/i.test(s)?{why:'CORRECTED RESULT: no tag',code:'CORRECTED_RESULT_NO_TAG'}:null;return {tag:m[1].toUpperCase(),reason:(m[2]||'').trim()};}; // pkgCR: case-insensitive tag, as live
P['CORRECTED COUNT']=s=>{const m=s.match(/^CORRECTED COUNT\s*:\s*(DEFENDER|CHALLENGER)\s+(\d+)/i);return m?{side:m[1].toUpperCase(),n:+m[2]}:(/^CORRECTED COUNT\s*:/i.test(s)?{why:'CORRECTED COUNT: no <SIDE> <n>',code:'CORRECTED_COUNT_NO_SIDE_N'}:null);};
P['CORRECTED STANDING']=s=>{const m=s.match(new RegExp('^CORRECTED STANDING\\s*:\\s*(DEFENDER|CHALLENGER)\\s+('+STAND+')','i'));return m?{side:m[1].toUpperCase(),standing:m[2].toUpperCase()}:(/^CORRECTED STANDING\s*:/i.test(s)?{why:'CORRECTED STANDING: no <SIDE> <standing>',code:'CORRECTED_STANDING_NO_SIDE_STANDING'}:null);};
P.RETRACTED=s=>{const m=s.match(new RegExp('^RETRACTED\\s*:\\s*'+PAIR,'i'));return m?{pair:m[1]+' vs '+m[2],reason:s.slice(m[0].length).replace(new RegExp('^\\s*(?:'+SEP+'|:)\\s*'),'').trim()}:(/^RETRACTED\s*:/i.test(s)?{why:'RETRACTED: no pair',code:'RETRACTED_NO_PAIR'}:null);};
P['NOT PRESSED']=s=>{const m=s.match(/^NOT PRESSED\s*:\s*(.+?)(?:\s*(?:--|\u2014|\u2013)\s*(.*))?$/i);return m?{verse:m[1].trim(),reason:(m[2]||'').trim()}:null;};
P.PRESSED=s=>{if(!/^PRESSED\s*:/i.test(s))return null;const r=s.replace(/^PRESSED\s*:\s*/i,'');                 // two live forms (W1 2373 b1)
 let m=r.match(new RegExp('^'+PAIR+'\\s*'+SEP+'\\s*'+RND+'\\s*'+SEP+'\\s*'));if(m){const q=quoteAt(r.slice(m[0].length));return {kind:'cure',pair:m[1]+' vs '+m[2],round:m[3].toUpperCase(),quote:q?q.q:null};}
 m=r.match(new RegExp('^(.+?)\\s*'+SEP+'\\s*'+RND+'\\s*'+SEP+'\\s*'));if(m){const q=quoteAt(r.slice(m[0].length));const st=q?(q.rest.match(new RegExp('^\\s*'+SEP+'\\s*(UNANSWERED|ANSWERED IN\\s*'+RND+')'))||[]):[];
  return {kind:'ledger',verse:m[1].trim(),round:m[2].toUpperCase(),quote:q?q.q:null,state:st[1]?(st[1].startsWith('UNANSWERED')?'UNANSWERED':'ANSWERED'):null,answeredIn:st[2]?st[2].toUpperCase():null};}
 return {kind:'other',text:r};};
P.STANDING=s=>{const m=s.match(new RegExp('^(DEFENSE|CHALLENGE) STANDING\\s*:\\s*('+STAND+')\\b','i'));if(!m)return /^(DEFENSE|CHALLENGE) STANDING\s*:/i.test(s)?{why:'STANDING: no standing word',code:'STANDING_NO_STANDING_WORD'}:null;
 const L=s.match(/\bL\s*=\s*(\d+)/i),c=s.match(/\bc\s*=\s*(\d+)/i);return {side:m[1].toUpperCase(),standing:m[2].toUpperCase(),L:L?+L[1]:null,c:c?+c[1]:null};};
P.CONCEDED=s=>{const m=s.match(/^(CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:\s*(\d+)\b/i);if(!m)return /^(CHALLENGER )?CONCEDED LINKS\s*:/i.test(s)?{why:'CONCEDED: no count',code:'CONCEDED_NO_COUNT'}:null;
 const ent=[...s.slice(m[0].length).matchAll(/premise\s+(\d+)\s+(?:is\s+)?(UNEXHIBITED|CONCEDED|VOID|SPARED)/gi)].map(x=>({premise:+x[1],state:x[2].toUpperCase()}));return {side:/^CHALLENGER/i.test(m[1])?'CHALLENGER':'DEFENDER',n:+m[2],entries:ent};};
P.CLAUSE=s=>{const m=s.match(/^CLAUSE\s*:\s*(BROKEN-1|BROKEN-2|PARTIAL-1|PARTIAL-2|PARTIAL-3|HELD-1)?/i);if(!m)return null;const g=k=>{const x=s.match(new RegExp('\\b'+k+'\\s*=\\s*(\\d+)','i'));return x?+x[1]:null;};return {tag:m[1]?m[1].toUpperCase():null,n:g('n'),w:g('w'),k:g('k')};};
P.RULING=s=>{const m=s.match(new RegExp('^RULING\\s*(?:'+SEP+'|:)\\s*(.+?)\\s*'+SEP+'\\s*(.+)$','i'));return m?{subject:m[1].trim(),grade:m[2].trim()}:(/^RULING\b/i.test(s)?{why:'RULING: no subject and grade',code:'RULING_NO_SUBJECT_AND_GRADE'}:null);};
P['OUT-OF-ROUND']=s=>{const m=s.match(/^(DEFENDER|CHALLENGER)\s*\|\s*\[?\s*((?:CR|DR)\d)\s*\]?\s*\|\s*(.*)$/i);if(!m)return null;const t=m[3].match(/\s*(?:--\s*)?(COUNTED|TOUCHES NO LINK)\b\s*(?:--\s*)?(.*)$/);
 let sen=(t?m[3].slice(0,t.index):m[3]).trim();let why=t?t[2].trim():'';if(!t){const d=sen.match(/\s+(?:--|\u2014|\u2013)\s+/);if(d){why=sen.slice(d.index+d[0].length).trim();sen=sen.slice(0,d.index).trim();}} /* spec 0.5: an untagged row's sentence ends at the first field separator */
 return {side:m[1].toUpperCase(),round:m[2].toUpperCase(),sentence:sen,tag:t?t[1]:null,why};};
P.STATEMENT=s=>{const m=s.match(/^(STATEMENT|RESPONSE)\s*:\s*(.*)$/i);if(!m)return null;const p=m[2].split(/\s*\|\s*/);return {which:m[1].toUpperCase(),item:p.length>1?p[0]:null,text:p.length>1?p.slice(1).join(' | '):p[0]};};
P['LINK STATE']=s=>{const m=s.match(new RegExp('^(D\\d+)\\s*:?\\s*(?:--|\\u2014|\\u2013|-|:)?\\s*(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS|BROKEN|WITHDRAWN)\\b(?:\\s*'+TAG+')?'));if(!m)return null;const r=s.slice(m[0].length); /* W3 spec 10: LINK STATE D<i>: GRADE [TAG] [-- REASON] */const gi=r.search(/\bGROUND\s*:/i);
 return {link:m[1],grade:m[2],ground:gi>=0?r.slice(gi).replace(/^GROUND\s*:\s*/i,'').trim():'',reason:(gi>=0?r.slice(0,gi):r).replace(new RegExp('^\\s*'+SEP+'\\s*'),'').replace(new RegExp('\\s*'+SEP+'\\s*$'),'').trim()};}; // rcLines counts "D<i>: WITHDRAWN"; SB_FORM accepts "D<i>:" and "D<i> --"
P['RULING PART']=s=>{const m=s.match(/^(CLAIM|NAMED BY|RULE|APPLIED)\s*:\s*(.*)$/i);return m?{part:m[1].toUpperCase(),text:m[2].trim()}:null;}; // krulLines reads the four parts under a RULING
P['CHAIN MARK']=s=>{const m=s.match(/^(DEFENDER|CHALLENGER) CHAIN MARK\s*:\s*([A-Z][A-Z-]*)\b/i);return m?{side:m[1].toUpperCase(),mark:m[2].toUpperCase(),reason:s.slice(m[0].length).replace(new RegExp('^\\s*'+SEP+'\\s*'),'').trim()}:null;};
P['CITATION CHECK']=s=>{const m=s.match(/^(?:#+\s*)?CITATION CHECK\b\s*:?\s*(.*)$/i);return m?{text:m[1]}:null;};
P.HEADING=s=>{const m=s.match(/^#*\s*([A-Z][A-Z \-/()]{3,60}):\s*$/);return m?{heading:m[1].trim()}:null;};
P.SHORT=s=>{const m=s.match(/^SHORT\s*:\s*(.*)$/i);return m?{text:m[1]}:null;};
P.REPLY=s=>{const m=s.match(/^(?:(SENDBACK|GATE)\s*:?\s*)?(?:ITEM\s*)?#?\s*([SG])\s*(\d+)\s*:?\s*\|\|\s*(KEEP|CHANGE\s+TO\s*:?([\s\S]*?))\s*(?:\|\|\s*(.*))?$/i);if(!m)return null; // pkgSBP id variants
 const to=m[5]!=null?m[5].trim():null;return {kind:(m[1]||(m[2].toUpperCase()==='G'?'GATE':'SENDBACK')).toUpperCase(),id:m[2].toUpperCase()+m[3],answer:/^KEEP$/i.test(m[4])?'KEEP':'CHANGE',to,toRow:to?readLine(to.replace(/^["\u201c]([\s\S]*)["\u201d]$/,'$1')):null,sentence:(m[6]||'').trim()};};
// W3 spec 8.3 and 10: PREMISE <k> [is] [:] STATUS [TAG] [-- : ,] [REASON]; the engine's own 'premise k ruled X:' label is removed first. Label any case, status upper case.
P.PREMISE=s=>{const t=s.replace(/^premise\s+\d+\s+ruled\s+[A-Z ]+?\s*:\s*(?=premise\b)/i,'');const m=t.match(new RegExp('^premise\\s+(\\d+)\\s*(?:is\\s+)?:?\\s*(UNEXHIBITED|CONCEDED|NOT VOID|VOID|SPARED|COUNTED)\\b(?:\\s*'+TAG+')?\\s*(?:'+SEP+'|:|,)?\\s*','i'));if(!m)return null;
 if(m[2]!==m[2].toUpperCase())return {why:'PREMISE: status word not upper case',code:'PREMISE_STATUS_NOT_UPPER_CASE'};return {premise:+m[1],status:m[2],tag:m[3]?+m[3]:null,reason:t.slice(m[0].length).trim(),engineLabel:t!==s};};
const ORDER=['REPLY','FORCED','CORRECTED RESULT','CORRECTED COUNT','CORRECTED STANDING','RETRACTED','NOT PRESSED','PRESSED','COLLISION','ANSWER CHECK','KEYSTONE','RESULT','CLAUSE','STANDING','CONCEDED','PREMISE','RULING','RULING PART','CHAIN MARK','LINK STATE','CITATION CHECK','OUT-OF-ROUND','STATEMENT','SHORT','HEADING'];
// W3 spec 7 G12: RESTATED wraps any of these forms; the inner text is parsed as that form. G3: a form-labelled line that fails gets MALFORMED_<FORM> (detail keeps the reason code).
const RESTATABLE=['COLLISION','FORCED','ANSWER CHECK','KEYSTONE','STANDING','CONCEDED','RESULT'];
function readLine(line){const norm=normLine(line);if(!norm)return {form:null,why:'empty',code:'EMPTY',norm};
 const rs=norm.match(/^RESTATED\s*:\s*/i);if(rs){const r=readLine(norm.slice(rs[0].length));if(r.form&&RESTATABLE.includes(r.form))return {form:r.form,f:Object.assign({},r.f,{restated:true}),norm};
  if(r.form==null&&r.tried&&RESTATABLE.includes(r.tried))return Object.assign({},r,{norm});return {form:null,tried:'RESTATED',why:'RESTATED wraps no spec form',code:'NOT_A_FORM',norm};}
 for(const k of ORDER){const f=P[k](norm);if(!f)continue;if(f.code)return {form:null,tried:k,why:f.why,code:'MALFORMED_'+k.replace(/[^A-Z]+/g,'_'),detail:f.code,norm};return {form:k,f,norm};}
 {const lab=[[/^FORCED\b/i,'FORCED'],[/^D\d+\s+vs\.?\s+C\d+\b/i,'COLLISION'],[/^ANSWER CHECK\s*:/i,'ANSWER CHECK'],[/^KEYSTONE\s*:/i,'KEYSTONE']].find(([r])=>r.test(norm));
  if(lab)return {form:null,tried:lab[1],why:lab[1]+' label, line does not parse',code:'MALFORMED_'+lab[1].replace(/[^A-Z]+/g,'_'),detail:'NO_PARSE',norm};} /* W3 spec 7 G3 */
 return {form:null,why:'no line form',code:'NO_LINE_FORM',norm};}
// W2 interface: n is the 0-based index in text.split('\n') of the unescaped text; {n, form, fields} or {n, form:null, why, code}. code is the stable refusal code (W3 2377 follow-up); why is prose only.
// readLines(jtext): jtext is the judge text as the engine reads it (cureJText(raw,true) for a verdict, the stored text for a reply); it is NOT unescaped again (spec 0.1, 32973). readStored(raw) applies judgeText first.
function readStored(raw){return readLines(judgeText(raw).text);}
function readLines(text){return String(text==null?'':text).split('\n').map((l,i)=>{const r=readLine(l);return r.form?{n:i,form:r.form,fields:r.f,norm:r.norm}:{n:i,form:null,why:r.why,code:r.code,detail:r.detail||null,tried:r.tried||null,norm:r.norm};}).filter(r=>r.code!=='EMPTY');}
module.exports={norm:normLine,readLine,readLines,readStored,judgeText,normLine,unescapeOnce,quoteAt,FORMS:ORDER};

return module.exports;})();
function __sbxRL(l){try{return __RL.readLine(String(l==null?'':l));}catch(e){return {form:null};}}
// ruling 428, the send-back half: reads each judge's SENDBACK lines and records one debate_enforcer_log row (kind send_back) per item: the
// judge's line, the enforcer's reason, and the judge's answer (KEEP or CHANGE TO, with its sentence). The judge keeps the decision. NOT BUILT
// here: a CHANGE does not yet recompute the judge's counts or result; it is recorded and printed in the run document.
const PASS=$('Judge Enforcer Record').first().json;
const B=$('Send Back Build').all().map(x=>x.json);const first=B[0]||{};const T=new Date().toISOString();
const ns=(first.sb_not_sent||[]).map(x=>({run_token:null,seat:x.seat,seat_role:'panel',judge_model:null,kind:'send_back',rule:x.rule,item:x.item||null,flagged_line:null,prompt_sent:null,full_reply:null,reply_error:'NOT SENT: '+x.why,response_line:null,cure_status:null,cure_reason:'SEND-BACK NOT SENT: '+x.why+' (ruling 428)',at:T}));
if(first.sb_skip)return [{json:{...PASS,sendback:{skipped:true,why:first.sb_why||'',not_sent:ns.length,tally:{}},sb_rows:ns,sb_items:[]}}];
const R=$input.all().map(x=>x.json);const rows=[...ns];const errors=[];const tally={KEEP:0,CHANGE:0,'NO ANSWER':0};const shown=[];const SIL={}; /* pkgSBS: seat -> silent S numbers */const ECF={}; /* pkgECF: seat -> uncured E-COL items */
function psGrades(l){const g={};let t=String(l==null?'':l).replace(/\\+"/g,'"').replace(/[*_`]+/g,'');const m=t.match(/^\s*(?:[-•]\s*|\d+[.)]\s*)?(DEFENDER\s+|CHALLENGER\s+)?CONCEDED LINKS\s*:\s*(\d+)?\s*(?:--|—|–)?/i);if(!m)return null;t=t.slice(m[0].length);
 t=t.replace(/\([^()]*\)/g,' ').replace(/"[^"\n]*"|“[^”\n]*”/g,' ').replace(/(^|[\s(\[:;,])['‘](?:[^'’\n]|['’](?=[A-Za-z]))+?['’](?=$|[\s.,;:!?)\]])/g,'$1 ')
  .replace(/\[[^\]]*\]/g,' ').replace(/\b\d+:\d+(?:[-–]\d+)?\b/g,' ').replace(/\b(?:Commitment|Link|LINK|links?)\s+\d+\b/g,' ').replace(/\b[CDL]\d+\b/g,' ').replace(/\b[123]\s+(?:Samuel|Kings|Chronicles|Corinthians|Thessalonians|Timothy|Peter|John)\b/g,' ')
  .replace(/\b(\d)\s*[–—-]\s*(\d)\b/g,(x,a,b)=>{const o=[];for(let i=+a;i<=+b;i++)o.push(i);return o.join(', ');});
 const W=/\b(VOID|UNEXHIBITED|CONCEDED|counted|spared|SUPPORTED|NARROWED|STANDS)\b/ig; /* the clause's grade is its first grade word (a later "counted" or "VOID" in the prose does not regrade it) */
 for(const c0 of t.split(/;|\.(?=\s|$)/)){const c=c0.replace(/\bnone\s+counted\b/ig,' ');W.lastIndex=0;const w=W.exec(c);if(!w)continue;const k=w[1].toUpperCase();const G=k==='VOID'?'VOID':(k==='UNEXHIBITED'||k==='CONCEDED'||k==='COUNTED')?'COUNTED':'SPARED';
  for(const n of (c.match(/\b\d\b/g)||[]).map(Number))if(n>0&&!(n in g))g[n]=G;}
 return {side:m[1]&&/^CHALLENGER/i.test(m[1])?'CHALLENGER':'DEFENDER',n:m[2]!=null?+m[2]:null,g};}
// pkgEC2 (W3 Wall 2446): the LIVE cure reading for E-ANS and E-PREM send-backs. Record-only until W3 promotes the rules.
function enf428Cure(it,a,R,named){ /* named: the premise numbers of every E-PREM item the seat was sent on the same flagged line (pkgPS); default the item's own */
 const N=s=>String(s==null?'':s).toLowerCase().replace(/\\+"/g,'"').replace(/[‘’“”"'`*_]/g,'').replace(/[—–-]/g,' ').replace(/[^a-z0-9Ͱ-Ͽἀ-῿֐-׿ ]+/g,' ').replace(/\s+/g,' ').trim();
 const side=k=>/^CR/i.test(k)?'C':/^DR/i.test(k)?'D':null;const has=(k,q)=>{const t=R&&typeof R[k]==='string'?' '+N(R[k])+' ':'';return !!t&&t.includes(' '+N(q)+' ');};
 const six=(why,ks)=>{const w=N(why).split(' ').filter(Boolean);for(let i=0;i+6<=w.length;i++){const r=w.slice(i,i+6).join(' ');if(ks.some(k=>has(k,r)))return r;}return null;};
 const res=(c,why)=>({status:c?'CURED':'UNCURED',why});if(!a||a.ans==='NO ANSWER')return res(false,'no answer to the send-back');
 const AC=/ANSWER CHECK:\s*(.+?)\s*--\s*\[((?:CR|DR)[1-4](?:\s*[;,]\s*(?:CR|DR)[1-4])*)\]\s*--\s*MEANS:\s*["'“‘]([\s\S]*?)["'”’]\s*--\s*ANSWER:\s*["'“‘]([\s\S]*)["'”’]\s*--\s*(MEETS|MISSES|FAILS)\b/i;
 const pieces=s=>String(s).split(/["'”’]\s*;\s*["'“‘]|\.{3}|…/).map(x=>x.trim()).filter(x=>N(x).split(' ').length>=3);
 if(it.rule==='E-ANS'){const f=String(it.line||'').replace(/\\+"/g,'"').match(AC);if(!f)return res(false,'the flagged line is not read as an ANSWER CHECK line');const fs=side(f[2]);const SR=Object.keys(R||{}).filter(k=>side(k)===fs);
  if(a.ans==='KEEP'){const q=six(a.why,SR);return res(!!q,q?'KEEP whose reason quotes the answering side\'s round: "'+q+'"':'KEEP whose reason quotes no 6 words in a row of the answering side\'s rounds');}
  const t=String(a.to||'').replace(/\\+"/g,'"').match(AC);if(!t)return res(false,'the CHANGE TO is not an ANSWER CHECK line');if(N(t[1])!==N(f[1]))return res(false,'the CHANGE TO names another verse ('+t[1]+')');
  if(/^(MISSES|FAILS)$/i.test(t[5]))return res(true,'CHANGE TO grades MISSES');const ks=t[2].split(/\s*[;,]\s*/).map(k=>k.toUpperCase());
  if(ks.some(k=>side(k)!==fs))return res(false,'the CHANGE TO moves the answer to the other side\'s round');const ps=pieces(t[4]);if(!ps.length)return res(false,'the CHANGE TO quotes no answer of 3 or more words');
  const miss=ps.filter(p=>!ks.some(k=>has(k,p)));if(miss.length)return res(false,'the CHANGE TO answer is not found word for word in ['+ks.join('; ')+']: "'+miss[0].slice(0,120)+'"');
  const fa=N(f[4]),ta=N(t[4]);if(ta===fa||fa.includes(ta))return res(false,'the CHANGE TO MEETS quotes the flagged answer again (or a shorter cut of it)');
  return res(true,'CHANGE TO MEETS with a fuller answer found in ['+ks.join('; ')+']');}
 if(it.rule==='E-PREM'){const m=String(it.item||'').match(/against the (defender|challenger)\s+(\d+)/i);if(!m)return res(false,'the item names no premise');const n=+m[2];const fs=/^d/i.test(m[1])?'C':'D'; /* the defender's premise is answered in the defender's rounds (CR) */
  const right=(String(it.reason||'').match(/\(right:\s*([A-Z ]+?)\)/)||[])[1]||null;const SR=Object.keys(R||{}).filter(k=>side(k)===fs);const ALL=Object.keys(R||{}).filter(k=>side(k));
  if(a.ans==='KEEP'){const q=six(a.why,SR);return res(!!q,q?'KEEP whose reason quotes the side\'s round: "'+q+'"':'KEEP whose reason quotes no 6 words in a row of the side\'s rounds');}
  const to=String(a.to||'');let g=null;const P=typeof psGrades==='function'?psGrades(to):null;if(P&&(n in P.g))g=P.g[n];
  if(!g){const z=to.match(new RegExp('\\bpremises?\\s+(?:\\d+\\s*(?:,|and|&)\\s*)*'+n+'\\b[^.;]{0,80}?\\b(VOID|UNEXHIBITED|CONCEDED|COUNTED|SPARED|SUPPORTED|NARROWED|STANDS)\\b','i'));if(z){const k=z[1].toUpperCase();g=k==='VOID'?'VOID':/UNEXHIBITED|CONCEDED|COUNTED/.test(k)?'COUNTED':'SPARED';}}
  if(!g)return res(false,'the CHANGE TO gives premise '+n+' no grade the engine reads');
  {const Q=typeof psGrades==='function'?psGrades(it.line):null;if(P&&Q){const nm=named&&named.size?named:new Set([n]);const known=k=>(k in Q.g)?Q.g[k]:(!Object.keys(Q.g).length&&Q.n===0?'SPARED':null);const out=Object.keys(P.g).map(Number).filter(k=>known(k)!=null&&known(k)!==P.g[k]&&!nm.has(k));
   if(out.length||P.side!==Q.side||(P.n!=null&&Q.n!=null&&Math.abs(P.n-Q.n)>nm.size))return res(false,'the CHANGE TO regrades '+(out.length?'premise'+(out.length>1?'s ':' ')+out.join(', '):'the count or side')+' beyond its items (pkgPS refuses it)');}}const want=right&&/VOID/.test(right)?'VOID':right&&/COUNTED|UNEXHIBITED|CONCEDED/.test(right)?'COUNTED':right?'SPARED':null;
  if(want&&g!==want)return res(false,'the CHANGE TO grades premise '+n+' '+g+', not the enforcer\'s '+want);
  const qs=[...to.matchAll(/["“]([^"”]{8,240})["”]/g)].map(x=>x[1]).filter(q=>N(q).split(' ').length>=3);const miss=qs.filter(q=>!ALL.some(k=>has(k,q)));
  if(miss.length)return res(false,'a quote in the CHANGE TO is not found in any round: "'+miss[0].slice(0,120)+'"');return res(true,'CHANGE TO grades premise '+n+' '+g+(qs.length?', its quotes found in the rounds':''));}
 if(it.rule==='E-COL'){const L=String(it.line||'').replace(/\\+"/g,'"');const pm=(L.match(/\b(D\d+)\s*vs\.?\s*(C\d+)\b/i)||String(it.item||'').match(/\b(D\d+)\s*vs\.?\s*(C\d+)\b/i));
  const am=L.match(/ANSWER\s*\[\s*(?:([CD])R|(Defender|Challenger))/i);const fs=am?(am[1]?am[1].toUpperCase():(/^d/i.test(am[2])?'C':'D')):/CHALLENGER LINK BROKEN/.test(L)?'D':/DEFENDER LINK BROKEN/.test(L)?'C':null; /* pkgECF: the answering side; its rounds are CR (defender) or DR (challenger) */
  if(!fs)return res(false,'the line names no answering side');const FORC=/^\s*FORCED\b/i.test(L);const SR=Object.keys(R||{}).filter(k=>FORC?side(k)===fs:!!side(k)); /* a FORCED line keeps by the answering side's words; a LINK BROKEN line also by the quoted pressing sentence (ruling 392) */
  const qd=s=>six(String(s||'').replace(/\\+"/g,'"'),SR); /* 6 words in a row of those rounds, anywhere in the sentence (inner quotation marks split a quoted span) */
  if(a.ans==='CHANGE'){const to=String(a.to||'');const pr=pm?new RegExp('\\b'+pm[1]+'\\s*vs\\.?\\s*'+pm[2]+'\\b','i'):null;
   if(!/\b(?:BROKEN|FORCED)\b/.test(to)&&(!pr||pr.test(to)||/^\s*RETRACTED\b/i.test(to)))return res(true,'CHANGE TO a line that does not grade the pair BROKEN or FORCED');
   const q=qd(to+' '+(a.why||''));return res(!!q,q?'CHANGE TO keeps the break and quotes the answering side\'s round: "'+q+'"':'CHANGE TO keeps the break (BROKEN or FORCED) and quotes no 6 words in a row of the answering side\'s round');}
  const q=qd(a.why);return res(!!q,q?(FORC?'KEEP whose sentence quotes the answering side\'s round: "':'KEEP whose sentence quotes a round: "')+q+'"':(FORC?'KEEP whose sentence quotes no 6 words in a row of the answering side\'s round':'KEEP whose sentence quotes no 6 words in a row of any round'));}
 return res(false,'not an E-ANS, E-PREM or E-COL item');}
let __RD=null;for(const n of ['Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3']){try{if($(n).isExecuted)for(const it of $(n).all()){const c=it.json&&it.json.cure;if(c&&c.rounds){__RD=c.rounds;break;}}}catch(e){}if(__RD)break;} /* pkgEC2: the rounds, read as Judge Enforcer Build reads them */
B.forEach((b,ci)=>{let txt='',err=null;try{txt=String(R[ci].choices[0].message.content||'');}catch(e){err=String((R[ci]&&R[ci].error&&(R[ci].error.message||R[ci].error))||'no reply').slice(0,200);errors.push(b.seat+': '+err);}
 /* WALL-1963 reply 1965 DEFECT 1: a judge whose system message demands strict JSON may wrap its lines in a JSON string (run 32725, Panel Cure
  Call 2), so escaped line breaks and quotes are undone first and a SENDBACK line is read wherever it starts in a line. */
 const J=/^\s*[{\[]/.test(txt);const A={};const T2=txt.replace(/\\n/g,'\n').replace(/\\"/g,'"');for(const l0 of T2.split('\n')){const l=l0.replace(/[*_`]+/g,'').trim();/* WALL-2024 2243 A (run 32980: gemini wrote "SENDBACK: ITEM S1 || ..." on all 17 items, and every one was logged NO ANSWER): the id may
   follow "ITEM" or "#", the colon may be missing, and the S and its number may be spaced; KEEP and CHANGE TO in any case; a CHANGE TO with no closing "|| reason" is read to the end of
   its line (32980 gemini S1 to S7, S11, S12, S14 to S17). */
  {const r=__sbxRL(l);if(r&&r.form==='REPLY'&&r.f&&r.f.kind==='SENDBACK'){const id=r.f.id; /* pkgSBX: the reader decides whether the line is a SENDBACK answer, its id and KEEP or CHANGE */
   const m0=l.match(/SENDBACK\s*:?\s*(?:ITEM\s*)?#?\s*(S\s*\d+)\s*:?\s*\|\|\s*(KEEP|CHANGE\s+TO\s*:?([\s\S]*?))\s*(?:\|\|\s*(.*))?$/i);const same=m0&&m0[1].replace(/\s+/g,'').toUpperCase()===id&&(/^KEEP$/i.test(m0[2].trim())?'KEEP':'CHANGE')===r.f.answer;
   /* the payload and sentence keep the judge's own characters when the old pattern reads the same id and answer (the reader's spec-0 normalisation strips backslashes) */
   if(!A[id])A[id]=same?{ans:r.f.answer,to:(m0[3]||'').trim(),why:(J?String(m0[4]||'').replace(/"\s*,?\s*[}\]]*\s*$/,''):String(m0[4]||'')).trim(),line:l}:{ans:r.f.answer,to:String(r.f.to||'').trim(),why:(J?String(r.f.sentence||'').replace(/"\s*,?\s*[}\]]*\s*$/,''):String(r.f.sentence||'')).trim(),line:l};continue;}}
  const m=l.match(/SENDBACK\s*:?\s*(?:ITEM\s*)?#?\s*(S\s*\d+)\s*:?\s*\|\|\s*(KEEP|CHANGE\s+TO\s*:?([\s\S]*?))\s*(?:\|\|\s*(.*))?$/i);if(m){m[1]=m[1].replace(/\s+/g,'');m[4]=m[4]||'';}
  if(m&&!A[m[1].toUpperCase()])A[m[1].toUpperCase()]={ans:/^KEEP$/i.test(m[2].trim())?'KEEP':'CHANGE',to:(m[3]||'').trim(),why:(J?m[4].replace(/"\s*,?\s*[}\]]*\s*$/,''):m[4]).trim(),line:l};}
 (b.items||[]).forEach((it,k)=>{const a=A[it.sid];const ans=a?a.ans:'NO ANSWER';tally[ans]++;
  let __ec=null;if(it.rule==='E-ANS'||it.rule==='E-PREM'||it.rule==='E-COL'){try{const nm=it.rule==='E-PREM'?new Set((b.items||[]).filter(y=>y.rule==='E-PREM'&&String(y.line)===String(it.line)).map(y=>+((String(y.item||'').match(/(\d+)\s*$/)||[])[1]))):null;
   __ec=__RD?enf428Cure({rule:it.rule,item:it.item,line:it.line,reason:it.reason},a||{ans:'NO ANSWER'},__RD,nm):{status:'UNREAD',why:'no rounds found in the Panel Cure Normalize nodes'};}catch(e){__ec={status:'UNREAD',why:'cure reading error: '+String(e&&e.message||e).slice(0,160)};}} /* pkgEC2 (W3 2446): record-only */
  const named=!a&&!err&&new RegExp('\\bS\\s*'+String(it.sid).replace(/^S/i,'')+'(?!\\d)').test(T2);const silent=!a&&!err&&!named;if(silent)(SIL[b.seat]=SIL[b.seat]||[]).push(it.sid); /* pkgSBS (W3 2274): silence counts; a written but unread answer does not */
  shown.push({seat:b.seat,sid:it.sid,rule:it.rule,item:it.item,line:it.line,reason:it.reason,ans,to:a?a.to:'',why:a?a.why:(err?'no reply: '+err:'no SENDBACK line for this item')});
  rows.push({run_token:b.run_token,seat:b.seat,seat_role:'panel',judge_model:b.api_model,kind:'send_back',rule:it.rule,item:it.item||null,flagged_line:String(it.line).slice(0,1500),
   prompt_sent:k===0?b.msg:null,full_reply:k===0?(txt||null):null,reply_error:err,response_line:a?a.line.slice(0,1500):null,cure_status:null,
   cure_reason:'SEND-BACK '+ans+(a&&a.to?' TO: '+a.to.slice(0,600):'')+(a&&a.why?' -- '+a.why.slice(0,600):'')+' | ENFORCER: '+String(it.reason).slice(0,600)+' (ruling 428; the judge keeps the decision)'+(silent?' | SILENT: no written answer; counted in drv_uncured (silence rule, WALL-2024 2274)':named?' | WRITTEN, NOT READ: the reply names '+it.sid+' but no SENDBACK line could be read; not silence, not counted':'')+(__ec?(it.rule==='E-COL'?' | CURE (E-COL ENFORCED, pkgECF): ':' | CURE (record-only until promoted): ')+__ec.status+' -- '+String(__ec.why).slice(0,400):''),at:T});
  if(it.rule==='E-COL'&&__ec&&__ec.status!=='CURED'&&!silent&&!err){(ECF[b.seat]=ECF[b.seat]||[]).push(it.sid+' ('+String(it.item||'').slice(0,60)+': '+String(__ec.why).slice(0,160)+')');rows[rows.length-1].cure_status='UNCURED';} /* pkgECF (C): an UNCURED E-COL answer counts; silence is counted already (pkgSBS) */
  else if(it.rule==='E-COL'&&__ec&&__ec.status==='CURED')rows[rows.length-1].cure_status='CURED';});});
let bodies=null,anySil=false;const silent_counted=[];const ecol_counted=[];
/* pkgECF (C): each seat's uncured E-COL answers are added to its drv_uncured, as silence is */
if(Object.keys(ECF).length){bodies=(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies).slice();
 for(const [seat,its] of Object.entries(ECF)){const i=bodies.findIndex(x=>{try{return JSON.parse(x).payload.judge_seat===seat;}catch(e){return false;}});if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;
  p.drv_uncured=(p.drv_uncured||0)+its.length;anySil=true;ecol_counted.push({seat,items:its});
  p.verdict_raw=p.verdict_raw+'\n[AUDIT v41: E-COL UNCURED (pkgECF, W3 2534) -- SEAT: '+seat+'; ITEMS: '+its.join('; ')+'; counted in drv_uncured. REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}} /* pkgSBS: add each seat's silent items to its drv_uncured, as Gate Record does for uncured gate items */
if(Object.keys(SIL).length){bodies=(bodies||(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies)).slice();
 for(const [seat,sids] of Object.entries(SIL)){const i=bodies.findIndex(x=>{try{return JSON.parse(x).payload.judge_seat===seat;}catch(e){return false;}});if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;
  p.drv_uncured=(p.drv_uncured||0)+sids.length;anySil=true;silent_counted.push({seat,items:sids});
  p.verdict_raw=p.verdict_raw+'\n[AUDIT v40: SEND-BACK SILENCE -- SEAT: '+seat+'; ITEMS: '+sids.join(', ')+'; no written answer to '+(sids.length===1?'this send-back item':'these send-back items')+'; counted in drv_uncured (silence rule, WALL-2024 2274). REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}
return [{json:{...PASS,...(bodies?{bodies}:{}),alt_needed:!!PASS.alt_needed||anySil,sendback:{skipped:false,calls:B.length,not_sent:ns.length,tally,errors,silent_counted,ecol_counted},sb_rows:rows,sb_items:shown}}];
