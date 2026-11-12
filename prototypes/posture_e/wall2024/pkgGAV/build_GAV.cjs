// pkgGAV rev 2: the grants finder (OGR) reads a grant verb after one or two adverbs ("I also concede", "I now withdraw"),
// and four more grant verbs (admit, retract, give up, no longer rest). Rev 2 (W3 Wall 5407, W1 5406, W4 5408):
// "set aside" left out (it also rejects the other side's point); the heading skip takes the same adverbs and verbs;
// a verb list ending in "nothing" is skipped; a question, and a sentence opened by If/Unless/Should/Nor, are skipped.
// Same edits in all four OGR copies. node build_GAV.cjs <in.json> <out.json>
const fs=require('fs');const [,,IN,OUT]=process.argv;const w=JSON.parse(fs.readFileSync(IN,'utf8'));
const ADV='(?:(?:also|now|further|readily|freely|fully|plainly|openly|likewise|therefore|thus|hereby|still|so)\\s+){0,2}';
const VB='(?:do\\s+not\\s+claim|no\\s+longer\\s+claim|no\\s+longer\\s+rest|withdraw|grant|concede|drop|admit|retract|give\\s+up)';
const R=[
[String.raw`const RX=/\bI\s+(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)\b|`,
 'const RX=/\\bI\\s+'+ADV+VB+'\\b|'],
[String.raw`if(/^\s*(?:none|nothing|no)\b/i.test(t.slice(m.index+m[0].length)))continue;`,
 String.raw`if(/^(?:\s*,?\s*(?:and\s+|or\s+)?(?:set\s+aside|`+VB+String.raw`))*\s*(?:none|nothing|no)\b/i.test(t.slice(m.index+m[0].length)))continue;/*pkgGAV*/`],
[String.raw`if(/^what i (?:grant|withdraw|concede|drop)(?: and what i (?:grant|withdraw|concede|drop))?$/.test(W(s)))continue;`,
 String.raw`if(/^what i (?:\w+ ){0,2}(?:grant|withdraw|concede|drop|admit|retract|give up|set aside|release|no longer (?:claim|rest)|do not claim)(?: and what i (?:\w+ ){0,2}(?:grant|withdraw|concede|drop|admit|retract|give up|set aside|release|no longer (?:claim|rest)|do not claim))?$/.test(W(s)))continue;if(/\?["')\]]?$/.test(ss[0].trim())||/^(?:if|unless|should|nor)\b/i.test(__ld.trim()))continue;`],
];
const NODES=['C4 Build','C4 Extract','C4G Extract','C4B Extract'];const rep={};
for(const nm of NODES){const n=w.nodes.find(x=>x.name===nm);let c=n.parameters.jsCode;const c0=c;
 for(const [o,nw] of R){const k=c.split(o).length-1;if(k!==1)throw new Error(nm+' anchor found '+k+': '+o.slice(0,40));c=c.replace(o,()=>nw);}
 n.parameters.jsCode=c;rep[nm]=c.length-c0.length;}
fs.writeFileSync(OUT,JSON.stringify(w,null,2));console.log(JSON.stringify(rep));
