// pkgKDV rev 2 (W2; W3 3903: anchor the deferral at the sentence start). Rev 1 header follows.
// pkgKDV (W2; coordinator 00:24Z 11-10, from W2's finding in the pkgKBG grade, Wall 3856). STACKS ON pkgKBG (which carries pkgKVQ); base live s94.
// Gap: pkgKQG's deferral test (__df, used for the flagged answer and, through pkgKBG, for the side's other sentences) knows only
//   "under/in/at/see LINK n", "under/in/see CRn" and "answered it fully/above/below/later/there". A deferral to another verse's answer,
//   "Matthew 17:5 is answered under Luke 9:34." or "Isaiah 8:3 is answered with Isaiah 7:14.", is not bare, so a KEEP quoting only it reads CURED.
// Fix (__df in Send Back Record, Alt Send Back Record, R2 Alt Send Back Record): also a deferral, still 15 words or fewer:
//   "(is|are|was|were|be|been) answered (under|with|in|at|by|as in|as under|together with) <verse reference>" and
//   with the verse reference (optionally a verse range) ENDING the sentence, so "is answered in Luke 2:49 by \"my Father's.\"" (which states the answer) is not a deferral.
//   node pkgKDV/build_KDV.cjs <base with pkgKBG> <out>
const fs=require('fs');const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};
const [,,FB,OUT]=process.argv;if(!FB||!OUT)die('usage: build_KDV.cjs <base with pkgKBG> <out>');
let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;if(d.nodes.length!==418)die('base has '+d.nodes.length+' nodes');
const A0=String.raw`const __df=x=>/\b(?:under|in|at|see)\s+LINK\s*\d|`;
const A1=String.raw`const __df=x=>/^["“]?(?:(?:[1-3]\s*)?[A-Z][a-z]+\.?\s+\d+:\d+(?:\s*[-–]\s*\d+)?[.:,]?\s+|(?:this|it|that|the\s+same)\s+)?(?:is|are|was|were|be|been)\s+answered\s+(?:(?:above|below)\s+)?(?:under|with|in|at|by|as\s+in|as\s+under|together\s+with)\s+(?:[1-3]\s*)?[A-Z][a-z]+\.?\s+\d+:\d+(?:\s*[-–]\s*\d+)?\s*[.;:]?\s*(?:\*\*|["”’)\]])*\s*$|\b(?:under|in|at|see)\s+LINK\s*\d|`;
const TAG=' /* pkgKDV rev 2: a deferral to another verse\'s answer ("X is answered under Y 1:2") is a deferral only when nothing but a verse reference, this, it, that or the same stands before "is answered" (W3 3903) */';
const NODES=['Send Back Record','Alt Send Back Record','R2 Alt Send Back Record'];
for(const nm of NODES){const n=d.nodes.find(z=>z.name===nm);if(!n)die('no node '+nm);let s=n.parameters.jsCode;
 if(!s.includes('pkgKBG'))die(nm+' lacks pkgKBG');if(s.includes('pkgKDV'))die(nm+' already has pkgKDV');
 if(s.split(A0).length!==2)die(nm+': __df anchor '+(s.split(A0).length-1)+' hits');s=s.replace(A0,A1);
 const E='const __bare=';if(s.split(E).length!==2)die(nm+': __bare anchor');s=s.replace(E,TAG.trim()+E);
 new Function('$','$input','return (async()=>{\n'+s+'\n})();');n.parameters.jsCode=s;}
fs.writeFileSync(OUT,JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));console.log(OUT+': 418 nodes; changed '+NODES.join(', '));
