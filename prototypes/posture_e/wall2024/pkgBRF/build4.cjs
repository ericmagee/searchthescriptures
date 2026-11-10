// W1 offline: pkgBRF rev 4 (answers W2 Wall 4445: rev 3c dropped a true new verse silently, Q5).
// Rev 3c rule kept: a reference headed by a capitalised non-book word ("So 1:18") whose chapter:verse an earlier round names under
// another book is not listed as NEW. Rev 4: it is not dropped either; a separate system line names it, says no book is written,
// names the earlier reference, and tells the judge to read the sentence for its book. Acts in C4P (12 nodes): [DR4] press check, [CR4] new-verse check.
// usage: node pkgBRF/build4.cjs <fetch-back> <out>
const fs=require('fs');const [inF,outF]=process.argv.slice(2);let D=JSON.parse(fs.readFileSync(inF,'utf8'));const W=(D.data||D).workflow||(D.data||D);
const E=[["out.push({label:b+' '+r.label,vs});}return out;};","out.push({label:b+' '+r.label,vs,cv:r.label,bare:r.head&&!r.book&&r.pos>r.at});}return out;};"],
 ["earlier.forEach(t=>refs(t).forEach(r=>r.vs.forEach(x=>S.add(x))));const seen=new Set();return refs(c4).filter(r=>!r.vs.some(x=>S.has(x))).map(r=>r.label).filter(l=>!seen.has(l)&&seen.add(l));};",
  "const u=[],K=x=>x.replace(/.* /,'');earlier.forEach(t=>refs(t).forEach(r=>r.vs.forEach(x=>{S.add(x);S[K(x)]=S[K(x)]||x;})));const seen=new Set();const o=refs(c4).filter(r=>{if(r.vs.some(x=>S.has(x)))return false;const m=r.bare&&r.vs.map(x=>S[K(x)]).find(Boolean);return m?(u.push([r.label,r.cv+' ('+m+' named earlier)']),false):true;}).map(r=>r.label).filter(l=>!seen.has(l)&&seen.add(l));o.u=[...new Set(u.filter(z=>!o.includes(z[0])).map(z=>z[1]))];return o;};\n const U=(n,w)=>n.u&&n.u.length?'\\n\\n[CLOSE-ROUND BOOK CHECK -- by code: '+w+' writes '+n.u.join(', ')+' with no book; not marked NEW, not cleared: read the sentence for its book.]':'';"],
 ["const note=F=>{const n=of(F);return n.length?","const note=F=>{const n=of(F);return (n.length?"],
 ["as a witness or as an answer.]':'';};","as a witness or as an answer.]':'')+U(n,'[DR4]');};"],
 ["const noteD=F=>{const n=ofD(F);return n.length?","const noteD=F=>{const n=ofD(F);return (n.length?"],
 ["a challenger link is disregarded.]':'';};","a challenger link is disregarded.]':'')+U(n,'[CR4]');};"]];
const code=()=>W.nodes.reduce((t,n)=>t+((n.parameters&&n.parameters.jsCode)||'').length,0);const c0=code();let n=0;
for(const x of W.nodes){let c=x.parameters&&x.parameters.jsCode;if(!c||!c.includes('const C4P='))continue;const i=c.indexOf('const C4P=');
 let h=c.slice(i);for(const [o,nw] of E){if(h.split(o).length-1!==1)throw new Error('anchor in '+x.name+': '+o.slice(0,40));h=h.replace(o,()=>nw);}
 x.parameters.jsCode=c.slice(0,i)+h;new Function('$','$input','return (async()=>{\n'+x.parameters.jsCode+'\n})');n++;}
console.log('nodes changed',n);console.log('SIZE (measured): code',c0,'->',code(),'=',(code()-c0>=0?'+':'')+(code()-c0),'; prompt text: none fixed; a system line of about 170 characters plus the references is added to judge input only when the case occurs');
fs.writeFileSync(outF,JSON.stringify(D));
