// pkgKBN (W2; coordinator 01:52Z 11-10): two pkgKBG limits. RECORD-ONLY (enf428Cure, ruling 428).
// (1) A lead-in before a verse label is not taken off: "On Luke 3:23, I grant ..." (comma after the reference) and "In / As to / Regarding / For Luke 3:23, I grant ..."
//     stay whole, so the grant is not seen as a grant and a KEEP quoting only it reads CURED. Fix (__lm): the label may end in a comma, and the lead-in may be
//     On, In, At, For, Under, As to, Regarding. __lm is also used by pkgKQG's bare test of the flagged answer, so a flagged answer in that form now reads bare too.
// (2) A thesis sentence opening "I affirm ..." is cut as bare (pkgKQG's grant test holds "affirm"); the reading stands (W2 3883) but the reason text calls it a
//     grant. Fix: the reason reads "another bare grant, affirmation or deferral". No reading changes.
//   node pkgKBN/build_KBN.cjs <base> <out>
const fs=require('fs');const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};const [,,FB,OUT]=process.argv;if(!FB||!OUT)die('usage: build_KBN.cjs <base> <out>');
let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;if(d.nodes.length!==418)die('base has '+d.nodes.length+' nodes');
const E=[
 [String.raw`.replace(/^(?:On\s+)?(?:[1-3]\s*)?[A-Z][a-z]+\.?\s+\d+:\d+(?:\s*[-–,]\s*\d+)*[.:]?[*_]*\s+(?=\S)/,'')`,
  String.raw`.replace(/^(?:(?:On|In|At|For|Under|As\s+to|Regarding)\s+)?(?:[1-3]\s*)?[A-Z][a-z]+\.?\s+\d+:\d+(?:\s*[-–,]\s*\d+)*[.:,]?[*_]*\s+(?=\S)/,'')`],
 ["KEEP whose reason quotes only another bare grant or deferral of the answering side","KEEP whose reason quotes only another bare grant, affirmation or deferral of the answering side"],
 ["const __bare=","/* pkgKBN: a verse label after On/In/At/For/Under/As to/Regarding and ending in a comma is opening matter; the reason names affirmations */const __bare="]];
const NODES=['Send Back Record','Alt Send Back Record','R2 Alt Send Back Record'];
for(const nm of NODES){const n=d.nodes.find(z=>z.name===nm);if(!n)die('no node '+nm);let s=n.parameters.jsCode;if(!s.includes('pkgKBG'))die(nm+' lacks pkgKBG');if(s.includes('pkgKBN'))die(nm+' already has pkgKBN');
 for(const [a,b] of E){const k=s.split(a).length-1;if(k!==1)die(nm+': '+k+' hits for '+a.slice(0,60));const i=s.indexOf(a);s=s.slice(0,i)+b+s.slice(i+a.length);}
 new Function('$','$input','return (async()=>{\n'+s+'\n})();');n.parameters.jsCode=s;}
fs.writeFileSync(OUT,JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));console.log(OUT+': 418 nodes; changed '+NODES.join(', '));
