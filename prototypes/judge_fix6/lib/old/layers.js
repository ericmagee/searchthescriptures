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
    if(formC){const ts=[...m[0].matchAll(/L([1-3])/g)].map(x=>x[1]);const ok=ts.filter(t=>(t==='1'&&DRV_QUOTE.test(rest))||(t==='2'&&(DRV_SRC.test(rest)||drvTranslit(rest,line.slice(Math.max(0,m.index-60),m.index))))||(t==='3'&&(DRV_REF.test(rest)||DRV_REF_END.test(line.slice(Math.max(0,m.index-40),m.index)))));if(ok.length){n++;ok.forEach(t=>met.add(t));}continue;}
    const anchor=DRV_REF.test(rest)||DRV_SRC.test(rest);
    if(anchor&&(!needQuote||DRV_QUOTE.test(rest)))n++;
  }
  return distinct?[...met].sort().map(t=>'L'+t):n;
}
// judge_fix3 A1 (run 32255, DeepSeek D5 vs C2: "[L2] sperma, seed", "[L2] genomenou (made, come to be)", "[L2] ek sou (out of you)" were refused,
// and the seat was not counted): an [L2] tag counts when it sits on a source-language word written in plain letters with its English meaning
// beside it, in parentheses or after a comma, colon, "=" or "meaning". The word stands directly after the tag, or directly before it with
// its meaning ("ek (out of) [L2]", run 32255 Qwen). An English word is never a transliteration (stop list); script, marks and Strong's numbers count as before.
const DRV_TL_STOP=/^(?:the|a|an|and|or|of|in|on|at|to|for|with|by|from|this|that|these|those|its|his|her|their|our|your|word|words|term|terms|verb|verbs|noun|nouns|root|roots|lexical|lexicon|ground|grounds|sense|meaning|greek|hebrew|aramaic|same|no|not|none|see|cf|which|where|who|is|are|was|were|be|been|as|it|he|she|they|we|i|but|if|so|also|only|both|each|every|any|all|text|verse|row|rows|layer|link|chain|here|there|than|then|when|while|after|before|under|over|into|upon|unto|thee|thou|thy|ye|hath|shall|unto)$/i;
const DRV_TL_AFTER=/^\s*[*_]*\s*(?:(?:Greek|Hebrew|Aramaic)\s+)?[*_]*([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})[*_]*\s*(?:\(\s*[^()\n]{2,80}\)|,\s*["“]?[a-z]|:\s*["“]?[a-z]|=\s*["“]?[a-z]|\s+(?:meaning|means|i\.e\.)\b)/;
const DRV_TL_BEFORE=/(?:^|[\s(,;])[*_]*([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})[*_]*\s*\(\s*[^()\n]{2,80}\)\s*$/;
const drvTranslit=(rest,before)=>{const ok=m=>{if(!m)return false;const w=m[1].split(/\s+/);while(w.length&&DRV_TL_STOP.test(w[0]))w.shift();return w.length>0&&!DRV_TL_STOP.test(w[w.length-1]);};return ok(String(rest||'').match(DRV_TL_AFTER))||ok(String(before||'').match(DRV_TL_BEFORE));};
const drvKinds=(line)=>drvExhibits(line,false,true,true);