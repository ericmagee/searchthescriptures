// K-B exhibit counter, two variants. Clause = text up to the next ; or sentence end or " -- ".
const REF=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/;
const SRC=/[\u0590-\u05FF\u0100-\u024F\u00C2\u00CA\u00CE\u00D4\u00DB\u00E2\u00EA\u00EE\u00F4\u00FB\u0300-\u036F\u0370-\u03FF\u1E00-\u1EFF\u1F00-\u1FFF\u02BE\u02BF]|\b[GH]\d{2,5}\b/; // BB-6926 option A, Latin range narrowed to transliteration letters as the node's DRV_SRC (git 0b3cbac, BB-6936/6940)
const QUOTE=/(?:^|[\s(\[{])["“'‘][^"”\n]{4,}?["”'’](?=$|[\s.,;:!?)\]}])/; // a mark inside a word (Joseph's) never opens or closes a quote (BB-6898 D1)
const NEG=/\b(?:no|without|lacks?|lacking|not)\s+(?:\[L[1-4]\]\s*(?:or|and|\/)\s*)*$/i;
function exhibits(line,needQuote,formC,distinct){
  const re=/\[L([1-3])\](?:\s*\/\s*\[L[1-3]\])*/g;let m,n=0;const met=new Set(); // distinct: count layer kinds met, not tags (BB-6899)
  while((m=re.exec(line))!==null){
    const before=line.slice(Math.max(0,m.index-30),m.index);
    if(NEG.test(before))continue;
    let rest=line.slice(m.index+m[0].length);
    const cut=rest.search(/;|\.\s|\s--\s|\s—\s|\[L[1-4]\]/);if(cut>=0)rest=rest.slice(0,cut);
    if(formC){const ts=[...m[0].matchAll(/L([1-3])/g)].map(x=>x[1]);const ok=ts.filter(t=>(t==='1'&&QUOTE.test(rest))||(t==='2'&&SRC.test(rest))||(t==='3'&&REF.test(rest)));if(ok.length){n++;ok.forEach(t=>met.add(t));}continue;}
    const anchor=REF.test(rest)||SRC.test(rest);
    if(anchor&&(!needQuote||QUOTE.test(rest)))n++;
  }
  return distinct?met.size:n;
}
const L=JSON.parse(require('fs').readFileSync(0,'utf8'));
for(const [name,line] of L){console.log(name.padEnd(34),'A(ref/src only):',exhibits(line,false),' B(ref/src + quote):',exhibits(line,true),' C tags:',exhibits(line,false,true),' C distinct layers:',exhibits(line,false,true,true));}
