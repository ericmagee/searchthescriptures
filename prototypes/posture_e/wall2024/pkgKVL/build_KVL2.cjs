// pkgKVL rev 2 (W2; W1 3892 and W3 FAIL on rev 1: a debater's own claim in quotation marks beside a reference was taken as verse text).
// Record-only (enf428Cure, ruling 428). Stacks on pkgKBG rev 5 + pkgKDV rev 2 (anchor: pkgKVQ's __vq definition, kept by both).
// Gap (unchanged from rev 1): pkgKVQ cuts a quoted verse of 6 words or more only on a line that names a verse reference; the same verse words quoted on a
//   line with no reference count as the side's own words, so a KEEP quoting only them reads CURED.
// Rev 2 fix (W3's way (a)): on a line with no verse reference, a quoted span of 6 words or more is cut only when its words stand, in order and whole,
//   in the KJV text of a verse the run itself serves ("Cited Verses", the record's KJV rows). Nothing the debaters write is used as verse text,
//   so a debater's quoted claim beside a reference is never taken as verse. Lines with a verse reference are pkgKVQ's, unchanged.
//   A span of verse words plus words of its own is not cut. Verse words the run does not serve, and unquoted verse words, are not cut (limits; safe direction).
//   node pkgKVL/build_KVL2.cjs <base with pkgKVQ> <out>
const fs=require('fs');const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};const [,,FB,OUT]=process.argv;if(!FB||!OUT)die('usage: build_KVL2.cjs <base> <out>');
let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;if(d.nodes.length!==418)die('base has '+d.nodes.length+' nodes');
const A0=String.raw`const __vq=s=>String(s).split('\n').map(l=>/\b(?:[1-3]\s*)?[A-Z][a-z]+\.?\s+\d+:\d+/.test(l)?l.replace(/"[^"\n]*"|“[^”\n]*”/g,m=>m.replace(/[^A-Za-z0-9]+/g,' ').trim().split(' ').length>=6?' . zqvz . ':m):l).join('\n');`;
const A1=String.raw`const __VR=/\b(?:[1-3]\s*)?[A-Z][a-z]+\.?\s+\d+:\d+/,__VQ=/"[^"\n]*"|“[^”\n]*”/g;let __vK=null;const __kjv=()=>{if(__vK)return __vK;let rows=[];try{rows=(typeof $==='function'?$('Cited Verses').all():[]).map(i=>i&&i.json).filter(r=>r&&r.book&&typeof r.text==='string');}catch(e){rows=[];}__vK=rows.map(r=>' '+N(r.text)+' ');return __vK;};const __vq=s=>String(s).split('\n').map(l=>__VR.test(l)?l.replace(__VQ,m=>m.replace(/[^A-Za-z0-9]+/g,' ').trim().split(' ').length>=6?' . zqvz . ':m):l.replace(__VQ,m=>{const n=N(m);return n.split(' ').length>=6&&__kjv().some(v=>v.includes(' '+n+' '))?' . zqvz . ':m;})).join('\n'); /* pkgKVL rev 2: on a line with no verse reference, a quoted span of 6 words or more is cut when it stands whole in the KJV text of a verse the run serves (Cited Verses) */`;
const NODES=['Send Back Record','Alt Send Back Record','R2 Alt Send Back Record'];
for(const nm of NODES){const n=d.nodes.find(z=>z.name===nm);if(!n)die('no node '+nm);let s=n.parameters.jsCode;if(!s.includes('pkgKVQ'))die(nm+' lacks pkgKVQ');if(s.includes('pkgKVL'))die(nm+' already has pkgKVL');
 if(!/\bconst N=|\bfunction N\(|\bN=\(?\w*\)?=>/.test(s))die(nm+': no N()');
 if(s.split(A0).length!==2)die(nm+': __vq anchor '+(s.split(A0).length-1)+' hits');s=s.replace(A0,()=>A1);new Function('$','$input','return (async()=>{\n'+s+'\n})();');n.parameters.jsCode=s;}
fs.writeFileSync(OUT,JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));console.log(OUT+': 418 nodes; changed '+NODES.join(', '));
