// W1: pkgBRF rev 5 on a base that already carries rev 4 (live s116): the book line names every earlier verse with that chapter:verse.
// usage: node pkgBRF/build5_on4.cjs <fetch-back with rev 4> <out>
const fs=require('fs');const [inF,outF]=process.argv.slice(2);let D=JSON.parse(fs.readFileSync(inF,'utf8'));const W=(D.data||D).workflow||(D.data||D);
const E=[["earlier.forEach(t=>refs(t).forEach(r=>r.vs.forEach(x=>{S.add(x);S[K(x)]=S[K(x)]||x;})));","earlier.forEach(t=>refs(t).forEach(r=>r.vs.forEach(x=>{S.add(x);const q=S[K(x)]=S[K(x)]||[];q.includes(x)||q.push(x);})));"],
 ["const m=r.bare&&r.vs.map(x=>S[K(x)]).find(Boolean);","const m=r.bare&&[...new Set(r.vs.flatMap(x=>S[K(x)]||[]))].join(', ');"]];
const code=()=>W.nodes.reduce((t,n)=>t+((n.parameters&&n.parameters.jsCode)||'').length,0);const c0=code();let n=0;
for(const x of W.nodes){let c=x.parameters&&x.parameters.jsCode;if(!c||!c.includes('const C4P='))continue;for(const [o,nw] of E){if(c.split(o).length!==2)throw new Error('anchor in '+x.name);c=c.replace(o,()=>nw);}x.parameters.jsCode=c;new Function('$','$input','return (async()=>{\n'+c+'\n})');n++;}
console.log('nodes changed',n,'| SIZE (measured): code',c0,'->',code(),'=',(code()-c0>=0?'+':'')+(code()-c0),'| prompt 0 fixed');fs.writeFileSync(outF,JSON.stringify(D));
