// W1 offline: pkgBRF rev 3, close-round press check only (C4P in 12 nodes). A reference written without its own book ("So 1:18")
// is not a NEW PRESS when its chapter:verse was named, under any book, in an earlier challenger round. The parser is unchanged.
// usage: node pkgBRF/build3.cjs <fetch-back> <out>
const fs=require('fs');const [inF,outF]=process.argv.slice(2);let D=JSON.parse(fs.readFileSync(inF,'utf8'));const W=(D.data||D).workflow||(D.data||D);
const E=[["out.push({label:b+' '+r.label,vs});}return out;};","out.push({label:b+' '+r.label,vs,bare:!r.book});}return out;};"],
 ["earlier.forEach(t=>refs(t).forEach(r=>r.vs.forEach(x=>S.add(x))));const seen=new Set();return refs(c4).filter(r=>!r.vs.some(x=>S.has(x)))",
  "earlier.forEach(t=>refs(t).forEach(r=>r.vs.forEach(x=>S.add(x).add(x.replace(/.* /,'')))));const seen=new Set();return refs(c4).filter(r=>!r.vs.some(x=>S.has(r.bare?x.replace(/.* /,''):x)))"]];
const code=()=>W.nodes.reduce((t,n)=>t+((n.parameters&&n.parameters.jsCode)||'').length,0);const c0=code();let n=0;
for(const x of W.nodes){let c=x.parameters&&x.parameters.jsCode;if(!c||!c.includes('const C4P='))continue;const i=c.indexOf('const C4P=');
 let h=c.slice(i);for(const [o,nw] of E){if(h.split(o).length-1<1)throw new Error('anchor in '+x.name+': '+o.slice(0,40));h=h.replace(o,nw);}
 x.parameters.jsCode=c.slice(0,i)+h;new Function('$','$input','return (async()=>{\n'+x.parameters.jsCode+'\n})');n++;}
console.log('nodes changed',n);console.log('SIZE (measured): code',c0,'->',code(),'=',(code()-c0>=0?'+':'')+(code()-c0),'; prompt text: none added');
fs.writeFileSync(outF,JSON.stringify(D));
