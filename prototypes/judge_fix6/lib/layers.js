const DRV_REF=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/;
const DRV_REF_END=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}(?:\s?[-–]\s?\d{1,3})?[\s*_]*$/; // BB-7994 step 6b: a reference written just before its [L3] tag ("Job 15:14 [L3]") names the reference
const DRV_SRC=/[֐-׿Ā-ɏÂÊÎÔÛâêîôû̀-ͯͰ-ϿḀ-ỿἀ-῿ʾʿ]|\b[GH]\d{2,5}\b/; // BB-6926 option A: own script (Hebrew, Greek), transliteration marks, or a Strong's number; no italic alternative
// judge_fix6 H2 (run 32293: GLM's statements quoted the KJV in single marks, 'And he said unto me ...', and the single judge nested a quotation in
// another, "1 Chronicles 28:6 "And he said ... father.""): a quotation is double marks or single marks, each closed by its own kind of mark; a
// mark inside a word (Joseph's, Father's) never opens or closes one (BB-6898 D1), and a closing mark may stand before another mark (a nested quotation).
const DRV_QUOTE=/(?:^|[\s(\[{"“'‘:,;—–-])(?:["“][^"”\n]{4,}?["”]|['‘][^\n]{4,}?['’])(?=$|[\s.,;:!?)\]}"”'’—–-])/;
const DRV_NEG=/\b(?:no|without|lacks?|lacking|not)\s+(?:\[L[1-4]\]\s*(?:or|and|\/)\s*)*$/i;
// judge_fix3 A1 (run 32255, DeepSeek D5 vs C2: "[L2] sperma, seed", "[L2] genomenou (made, come to be)", "[L2] ek sou (out of you)" were refused,
// and the seat was not counted): an [L2] tag counts when it sits on a source-language word written in plain letters with its English meaning
// beside it, in parentheses or after a comma, colon, "=" or "meaning". The word stands directly after the tag, or directly before it with
// its meaning ("ek (out of) [L2]", run 32255 Qwen). An English word is never a transliteration (stop list); script, marks and Strong's numbers count as before.
// judge_fix6 H1 (run 32293: "[L2] John 1:13 "Which were born ..." ... Romans 1:3 adds kata sarka (according to flesh)" and "[L2] The loins-word of
// Acts 2:30 (osphys, loins) ..." were read as no source word, because the plain-letter word did not stand first): the word with its meaning
// counts ANYWHERE in the tag's text: a plain-letter word followed by its meaning in parentheses ("kata sarka (according to flesh)"), or a word
// and its meaning together in parentheses after a comma ("(osphys, loins)"). The meaning starts with a small letter and holds no verse number.
const DRV_TL_STOP=/^(?:the|a|an|and|or|of|in|on|at|to|for|with|by|from|this|that|these|those|its|his|her|their|our|your|word|words|term|terms|verb|verbs|noun|nouns|root|roots|lexical|lexicon|ground|grounds|sense|meaning|greek|hebrew|aramaic|same|no|not|none|see|cf|which|where|who|is|are|was|were|be|been|as|it|he|she|they|we|i|but|if|so|also|only|both|each|every|any|all|text|verse|row|rows|layer|link|chain|here|there|than|then|when|while|after|before|under|over|into|upon|unto|thee|thou|thy|ye|hath|shall|unto)$/i;
const DRV_TL_AFTER=/^\s*[*_]*\s*(?:(?:Greek|Hebrew|Aramaic)\s+)?[*_]*([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})[*_]*\s*(?:\(\s*[^()\n]{2,80}\)|,\s*["“]?[a-z]|:\s*["“]?[a-z]|=\s*["“]?[a-z]|\s+(?:meaning|means|i\.e\.)\b)/;
const DRV_TL_BEFORE=/(?:^|[\s(,;])[*_]*([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})[*_]*\s*\(\s*[^()\n]{2,80}\)\s*$/;
const DRV_TL_ANY=/(?:^|[\s(,;:"“'‘])[*_]*([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})[*_]*\s*\(\s*([a-z][^()\n]{1,80}?)\s*\)/g;
const DRV_TL_PAIR=/\(\s*[*_]*([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})[*_]*\s*,\s*([a-z][a-z'’ -]{1,40}?)\s*\)/g;
const drvTranslit=(rest,before)=>{const ok=m=>{if(!m)return false;const w=m[1].split(/\s+/);while(w.length&&DRV_TL_STOP.test(w[0]))w.shift();return w.length>0&&!DRV_TL_STOP.test(w[w.length-1]);};
 const gl=m=>!/\d|^(?:see|cf|compare|or|i\.e)\b/i.test(String(m[2]||''));const any=rx=>[...String(rest||'').matchAll(rx)].some(m=>ok(m)&&gl(m));
 return ok(String(rest||'').match(DRV_TL_AFTER))||ok(String(before||'').match(DRV_TL_BEFORE))||any(DRV_TL_ANY)||any(DRV_TL_PAIR);};
// judge_fix6 H1: ONE layer reader, drvLayers, for rule B's K-B, the link-round check K-LB and every cure check (drvKinds is drvLayers). Each tag
// [L1], [L2] or [L3] (or a joined "[L1]/[L2]", "[L1] and [L2]") is read from its end to the next layer tag or a blank line, whichever comes first;
// a tag after "no", "without", "lacks" or "not" never counts. [L1] needs KJV words in quotation marks (double or single); [L2] a source word (its
// script, transliteration marks, a Strong's number, or plain letters with the English meaning beside it, anywhere in the tag's text); [L3] a
// reference by book, chapter and verse (in the text, or written just before the tag). It returns the layer kinds met, sorted.
function drvLayers(text){const t=String(text==null?'':text).replace(/\*\*/g,'').replace(/__/g,'');const re=/\[L([1-3])\](?:\s*(?:\/|and|,)?\s*\[L([1-3])\])*/g;const at=[];let m;
 while((m=re.exec(t)))at.push({i:m.index,e:m.index+m[0].length,ts:[...m[0].matchAll(/L([1-3])/g)].map(x=>x[1])});const met=new Set();
 at.forEach(x=>{if(DRV_NEG.test(t.slice(Math.max(0,x.i-30),x.i)))return;const tail=t.slice(x.e);let end=tail.search(/\[L[1-4]\]|\n\s*\n/);end=end<0?t.length:x.e+end;
  const rest=t.slice(x.e,end);
  for(const ty of x.ts){if(ty==='1'&&DRV_QUOTE.test(rest))met.add('L1');if(ty==='2'&&(DRV_SRC.test(rest)||drvTranslit(rest,t.slice(Math.max(0,x.i-60),x.i))))met.add('L2');
   if(ty==='3'&&(DRV_REF.test(rest)||DRV_REF_END.test(t.slice(Math.max(0,x.i-40),x.i))))met.add('L3');}});
 return [...met].sort();}
// The older name, kept for any caller: the kinds met (distinct) or their number.
function drvExhibits(line,needQuote,formC,distinct){const k=drvLayers(line);return distinct?k:k.length;}
const drvKinds=(line)=>drvLayers(line);
