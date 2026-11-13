// pkgGAV: the grants finder (OGR RX) reads a grant verb after one or two adverbs ("I also concede", "I now withdraw"),
// and five more grant verbs ("admit", "set aside", "retract", "give up", "no longer rest"). Same RX in all four OGR copies.
// node build_GAV.cjs <in.json> <out.json>
const fs=require('fs');const [,,IN,OUT]=process.argv;const w=JSON.parse(fs.readFileSync(IN,'utf8'));
const OLD=String.raw`const RX=/\bI\s+(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)\b|`;
const NEW=String.raw`const RX=/\bI\s+(?:(?:also|now|further|readily|freely|fully|plainly|openly|likewise|therefore|thus|hereby|still|so)\s+){0,2}(?:do\s+not\s+claim|no\s+longer\s+claim|no\s+longer\s+rest|withdraw|grant|concede|drop|admit|set\s+aside|retract|give\s+up)\b|`;
const NODES=['C4 Build','C4 Extract','C4G Extract','C4B Extract'];const rep={};
for(const nm of NODES){const n=w.nodes.find(x=>x.name===nm);const c=n.parameters.jsCode;const k=c.split(OLD).length-1;if(k!==1)throw new Error(nm+' RX found '+k);
 n.parameters.jsCode=c.replace(OLD,NEW);rep[nm]=n.parameters.jsCode.length-c.length;}
fs.writeFileSync(OUT,JSON.stringify(w,null,2));console.log(JSON.stringify(rep));
module.exports={OLD,NEW};
