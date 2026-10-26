const DRV_REF=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/;
const DRV_SRC=/[֐-׿Ā-ɏÂÊÎÔÛâêîôû̀-ͯͰ-ϿḀ-ỿἀ-῿ʾʿ]|\b[GH]\d{2,5}\b/; // BB-6926 option A: own script (Hebrew, Greek), transliteration marks, or a Strong's number; no italic alternative
const DRV_QUOTE=/(?:^|[\s(\[{])["“'‘][^"”\n]{4,}?["”'’](?=$|[\s.,;:!?)\]}])/; // a mark inside a word (Joseph's) never opens or closes a quote (BB-6898 D1)
const DRV_NEG=/\b(?:no|without|lacks?|lacking|not)\s+(?:\[L[1-4]\]\s*(?:or|and|\/)\s*)*$/i;
function drvExhibits(line,needQuote,formC,distinct){
  const re=/\[L([1-3])\](?:\s*\/\s*\[L[1-3]\])*/g;let m,n=0;const met=new Set(); // distinct: count layer kinds met, not tags (BB-6899)
  while((m=re.exec(line))!==null){
    const before=line.slice(Math.max(0,m.index-30),m.index);
    if(DRV_NEG.test(before))continue;
    let rest=line.slice(m.index+m[0].length);
    const cut=rest.search(/;|(?<!\.)\.\s|\s--\s|\s—\s|\[L[1-4]\]/);if(cut>=0)rest=rest.slice(0,cut);
    if(formC){const ts=[...m[0].matchAll(/L([1-3])/g)].map(x=>x[1]);const ok=ts.filter(t=>(t==='1'&&DRV_QUOTE.test(rest))||(t==='2'&&DRV_SRC.test(rest))||(t==='3'&&DRV_REF.test(rest)));if(ok.length){n++;ok.forEach(t=>met.add(t));}continue;}
    const anchor=DRV_REF.test(rest)||DRV_SRC.test(rest);
    if(anchor&&(!needQuote||DRV_QUOTE.test(rest)))n++;
  }
  return distinct?[...met].sort().map(t=>'L'+t):n;
}
const drvKinds=(line)=>drvExhibits(line,false,true,true);
const line=process.argv[2];
console.log('LIVE as written:',JSON.stringify(drvKinds(line)));
console.log('LIVE tag before Genesis 24:16:',JSON.stringify(drvKinds(line.replace('with Genesis 24:16 [L3]','with [L3] Genesis 24:16'))));
