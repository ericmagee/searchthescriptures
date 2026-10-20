// K-B exhibit counter, two variants. Clause = text up to the next ; or sentence end or " -- ".
const REF=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/;
const SRC=/[\u00C0-\u024F\u0370-\u03FF\u1F00-\u1FFF]|\b[a-z]+[ēōāīū][a-z]*\b|\*[A-Za-z'-]+\*|\b[GH]\d{2,5}\b/;
const QUOTE=/(?:^|[\s(\[{])["“'‘][^"”\n]{4,}?["”'’](?=$|[\s.,;:!?)\]}])/; // a mark inside a word (Joseph's) never opens or closes a quote (BB-6898 D1)
const NEG=/\b(?:no|without|lacks?|lacking|not)\s+(?:\[L[1-4]\]\s*(?:or|and|\/)\s*)*$/i;
function exhibits(line,needQuote,formC){
  const re=/\[L([1-3])\](?:\s*\/\s*\[L[1-3]\])*/g;let m,n=0;
  while((m=re.exec(line))!==null){
    const before=line.slice(Math.max(0,m.index-30),m.index);
    if(NEG.test(before))continue;
    let rest=line.slice(m.index+m[0].length);
    const cut=rest.search(/;|\.\s|\s--\s|\s—\s|\[L[1-4]\]/);if(cut>=0)rest=rest.slice(0,cut);
    if(formC){const ts=[...m[0].matchAll(/L([1-3])/g)].map(x=>x[1]);if(ts.some(t=>(t==='1'&&QUOTE.test(rest))||(t==='2'&&SRC.test(rest))||(t==='3'&&REF.test(rest))))n++;continue;}
    const anchor=REF.test(rest)||SRC.test(rest);
    if(anchor&&(!needQuote||QUOTE.test(rest)))n++;
  }
  return n;
}
const L=JSON.parse(require('fs').readFileSync(0,'utf8'));
for(const [name,line] of L){console.log(name.padEnd(34),'A(ref/src only):',exhibits(line,false),' B(ref/src + quote):',exhibits(line,true),' C(by layer):',exhibits(line,false,true));}
