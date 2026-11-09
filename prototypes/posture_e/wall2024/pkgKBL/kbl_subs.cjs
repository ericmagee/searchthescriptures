// pkgKBL substitutions (W1, 11-09; class kb_layer_reader_inner_quote_g_number, W3 ruling Wall 3441, run 33846 grok D2 vs C2).
// [tag, old, new, count per file when present]
module.exports=[
 // 1. a short word in double quotes inside prose ("of") is shown with single marks before quotes are paired, so it no longer
 //    pairs with the opening mark of the next real quotation (33846: [L1] Matthew 1:18 and [L3] Matthew 1:20 were lost). Same length.
 ['lb.short',String.raw`function lbFoot(block,full){let t=String(block==null?'':block).replace(/\*\*/g,'').replace(/__/g,'');`,
  String.raw`function lbFoot(block,full){let t=String(block==null?'':block).replace(/\*\*/g,'').replace(/__/g,'');t=t.replace(/(?<![A-Za-z])["“]([A-Za-z]{1,3})["”](?![A-Za-z])/g,'‘$1’'); /* pkgKBL */`,0],
 // 2. a double-quoted span never runs across a | mark between GROUND segments, so one stray mark cannot shift the pairing in later segments.
 ['lb.bar',String.raw`const Q=[...t.matchAll(/["“][^"”\n]{4,}?["”]|`,String.raw`const Q=[...t.matchAll(/["“][^"”\n|]{4,}?["”]|`,0],
 // 3. [L2] in the form word (G4905, meaning) or word (meaning, H1234): the Strong's number no longer hides the meaning.
 ['lb.strong',String.raw`  for(const m of s.matchAll(/([*_])([^*_\n]{2,40})\1\s*\(`,
  String.raw`  for(const m of s.matchAll(/(?:^|[\s(,;:"“'‘\]])([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24})\s*\(\s*(?:[GH]\d{1,5}\s*[,:;]\s*["“'‘]?[a-z][^()\n]{1,80}?|["“'‘]?[a-z][^()\n\d]{1,80}?["”'’]?\s*[,;]\s*[GH]\d{1,5})\s*\)/g)){if(!DRV_TL_STOP.test(m[1])){met.add('L2');break;}} /* pkgKBL */
  for(const m of s.matchAll(/([*_])([^*_\n]{2,40})\1\s*\(`,0],
 // 4. the K-B ask asks for one RESTATED line (or a RETRACTED line) and never for a RESPONSE line, so a K-B item answered that way is
 //    read by the K-B cure branch instead of being logged "no written response" (33846 grok).
 ['cure.kb',String.raw`if(!respOf(x)){const z=res('UNCURED','no written response',null);`,
  String.raw`if(!respOf(x)&&!(x.rule==='K-B'&&(wd.has(U(x.link))||cureRest(o,x).length))){const z=res('UNCURED','no written response',null);`,0],
];
