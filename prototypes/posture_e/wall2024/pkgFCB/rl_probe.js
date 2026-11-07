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
function normLine(l){return String(l==null?'':l).replace(/\\+/g,'').replace(/[*_`]+/g,'').replace(/^\s*(?:[-\u2022>]|\d+[.)])\s*/,'').replace(/[ \t]+/g,' ').trim();