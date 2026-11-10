// pkgKBF rev 1 (W1; coordinator 02:15Z 11-10): stacks on pkgKBN. RECORD-ONLY (enf428Cure, ruling 428).
// Limit fixed: a verse label in bold with the close before the punctuation ("- **On Job 14:1**, I grant ...") was not taken off by __lm,
// so the grant was not seen and a KEEP quoting only it read CURED (pkgKBN W1 grade case K2). Fix: in the verse-label pattern of __lm the
// emphasis marks may stand before the punctuation as well as after it: [.:,]?[*_]* becomes [*_]*[.:,]?[*_]*. The opening "**" is already
// taken off by the existing mark step, and the loop then takes the label. No other change.
//   node pkgKBF/build_KBF.cjs <base carrying pkgKBN> <out>
const fs=require('fs');const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};const [,,FB,OUT]=process.argv;if(!FB||!OUT)die('usage: build_KBF.cjs <base> <out>');
let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;if(d.nodes.length!==418)die('base has '+d.nodes.length+' nodes');
const E=[
 [String.raw`(?:\s*[-–,]\s*\d+)*[.:,]?[*_]*\s+(?=\S)/,'')`,String.raw`(?:\s*[-–,]\s*\d+)*[*_]*[.:,]?[*_]*\s+(?=\S)/,'')`],
 ["/* pkgKBN: a verse label","/* pkgKBF: emphasis marks may close a verse label before its comma or colon *//* pkgKBN: a verse label"]];
const NODES=['Send Back Record','Alt Send Back Record','R2 Alt Send Back Record'];
for(const nm of NODES){const n=d.nodes.find(z=>z.name===nm);if(!n)die('no node '+nm);let s=n.parameters.jsCode;if(!s.includes('pkgKBN'))die(nm+' lacks pkgKBN');if(s.includes('pkgKBF'))die(nm+' already has pkgKBF');
 for(const [a,b] of E){const k=s.split(a).length-1;if(k!==1)die(nm+': '+k+' hits for '+a.slice(0,60));const i=s.indexOf(a);s=s.slice(0,i)+b+s.slice(i+a.length);}
 new Function('$','$input','return (async()=>{\n'+s+'\n})();');n.parameters.jsCode=s;}
fs.writeFileSync(OUT,JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));console.log(OUT+': 418 nodes; changed '+NODES.join(', '));
