// W2 pkgSEG (measure only; outside review of run 35856, point 5): S-E flagged the synthesis sentence "The defender ... withdrew or narrowed
// specified limbs, and continued to contest the challenger's chain ..." although the defender wrote "I withdraw Link 5 as an independent proof."
// Cause: the object words are the synthesis's own words after the verb, up to six, across clause ends ("narrowed, specified, limbs, continued,
// contest, challengers"); S-E needs one of them within 200 characters of an affirmed "withdraw" in a defender round. None stands there.
// Fix: take the object words only up to the first comma or semicolon, and drop generic words (another withdraw-type verb, "specified",
// "limbs", "claims", "points", ...). With no object word left, S-E asks only that the side affirmed the verb (the existing empty-words path).
// Build Save Body only. usage: node pkgSEG/build.cjs <parent in> <parent out>
const fs=require('fs');const [,,fin,fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const n=W.nodes.find(x=>x.name==='Build Save Body');let s=n.parameters.jsCode;const s0=s;
const R=(a,b)=>{const k=s.split(a).length-1;if(k!==1)throw new Error('anchor x'+k+': '+a.slice(0,70));s=s.replace(a,()=>b);};
R(".replace(/[\"“][^\"”]*[\"”]/g,' ')).split(' ').filter(w=>w.length>=5&&!STOPW.has(w)&&!/^\\d/.test(w)).slice(0,6);",
  ".replace(/[\"“][^\"”]*[\"”]/g,' ').split(/[,;]/)[0]).split(' ').filter(w=>w.length>=5&&!STOPW.has(w)&&!SEGW.has(w)&&!/^\\d/.test(w)).slice(0,6);");
R("const FAM={w:","const SEGW=new Set('narrowed narrows narrowing specified certain several various limbs claims points parts others withdrawing conceding retracting dropping qualified'.split(' '));\n  const FAM={w:");
new Function('$','$input','$execution','return (async()=>{'+s+'})');n.parameters.jsCode=s;fs.writeFileSync(fout,JSON.stringify(raw));
console.log('Build Save Body',s0.length,'->',s.length,'+'+(s.length-s0.length));
