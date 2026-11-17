// ASK 356 build (Wall 7523 plan; W1 7526/7530, W3 7525/7531: option 1 FLAG after the apply). Base: live s242 (1278baca).
// Usage: node build356.cjs <base.json> <out.json> <lib.cjs>
const fs=require('fs');const {unpack,rb}=require(process.argv[4]);
const W=JSON.parse(fs.readFileSync(process.argv[2]));if(!/^1278baca/.test(W.versionId))throw new Error('base moved: '+W.versionId);
const U=unpack(W);const L=U.L.slice();
const rep=(i,a,b)=>{const n=L[i].split(a).length-1;if(n!==1)throw new Error('line '+i+': anchor found '+n+' times');L[i]=L[i].replace(a,()=>b);};
// 1. line 1753: after the pkgVNV items (last), the K-RUD pair items on the applied text T1; TRIAL, record only (live:false)
rep(1753,"/* pkgVNV: last, so earlier gate ids keep their numbers */",
"/* pkgVNV: last, so earlier gate ids keep their numbers */ for(const x of rudPair2024(T1))items.push({kind:'RULE K-RUD',src:'E-GATE RUD',key:x.key,why:x.why,lines:x.lines,live:false}); /* ASK 356: after pkgVNV, so earlier gate ids keep their numbers; TRIAL, record only */");
// 2. line 1754: the reader
const FN=String.raw` function rudPair2024(T){/* ASK 356 (K-RUD pair test; Wall 7523, 7528, 7530, 7531): on the corrected text after the apply, a RESULT graded DEFENDER WINS or CHALLENGER WINS that names a pair "Dn vs Cm" as deciding, where the judge's own collision line for that pair grades it UNDERDETERMINED. A clause holding an open word, or naming the pair only to set it aside, is passed over. TRIAL, record only. */try{const t=String(T||'').replace(/\\n/g,'\n').replace(/\\+"/g,'"').replace(/[*_\x60]+/g,'');const L=t.split('\n').map(l=>l.trim());const nm=p=>p.replace(/\s+vs\.?\s+/i,' vs ').toUpperCase().replace('VS','vs');const und=new Map();
 for(const l of L){const m=l.match(/^(?:[-•]\s*|\d+[.)]\s*)?(D\d+\s+vs\.?\s+C\d+)\b[^\n]*?:\s*UNDERDETERMINED\b/i);if(m&&!und.has(nm(m[1])))und.set(nm(m[1]),l);}
 if(!und.size)return [];const OW=/\b(?:open|unsettled|undecided|unresolved|disputed|contested|underdetermined|not decided|undetermined)\b|\bremains?\s+(?:in\s+)?(?:doubt|question|uncertain)\b/i;
 const aside=(s,i,n)=>{const pre=s.slice(Math.max(0,i-60),i),post=s.slice(i+n,i+n+60);return /\b(?:not|no|neither|nor|aside|apart from|without|except|other than)\s+(?:\S+\s+){0,2}$/i.test(pre)||/^\s*(?:\S+\s+){0,2}?(?:not|no|neither|nor|aside)\b/i.test(post)||/^\s*(?:\S+\s+){0,2}?(?:does|do|did|is|are)\s+not\b/i.test(post);};
 const out=[];const seen=new Set();for(const l of L){const rm=l.match(/^RESULT\s*:\s*((?:DEFENDER|CHALLENGER)\s+WINS)\b(.*)$/i);if(!rm)continue;const body=rm[2];if(/\b(?:derived (?:after|by)|recomputed after)\b/i.test(body))continue;
  for(const s of body.split(/(?<=[.;:])\s+|\s+--\s+|,\s+/)){if(OW.test(s))continue;for(const m of s.matchAll(/\bD\d+\s+vs\.?\s+C\d+\b/gi)){const p=nm(m[0]);if(!und.has(p)||seen.has(p)||aside(s,m.index,m[0].length))continue;seen.add(p);
   out.push({key:'RUD PAIR '+p,lines:[l,und.get(p)],why:'TRIAL rule (K-RUD, ASK 356; record only, it removes no seat): your RESULT ('+rm[1].toUpperCase()+') rests on '+p+', but your own '+p+' line now grades it UNDERDETERMINED, and a line held open decides nothing (Commitment 13). Settle one: regrade '+p+' on the verse\'s own words, or write the RESULT again without resting on '+p+'.'});}}}
 return out;}catch(e){return [];}}`;
rep(1754,"return {R1,items,T1,newk_error:NK.error||null};}","return {R1,items,T1,newk_error:NK.error||null};}"+FN);
const M=JSON.parse(JSON.stringify(U.M));for(const k of Object.keys(M))M[k].n=rb(L,M[k]).length;
const T=U.hdr+'\n/*LIB*/'+JSON.stringify(L)+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
const out=JSON.parse(JSON.stringify(W));out.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=T;fs.writeFileSync(process.argv[3],JSON.stringify(out));
const T0=U.hdr+'\n/*LIB*/'+JSON.stringify(U.L)+'\n/*MAP*/'+JSON.stringify(U.M)+U.tail;console.log('base rebuild byte-equal',T0===U.T);
