// ASK 376 (plan W3 Wall 7901 rev 2; plan reads W2 7902, W1 AGREE; clause a376_w3/clause.txt at 03dc00e9): a K-V ruling may name the kind as an
// exclusion the quote's words do not make. Two library lines: the KV_KIND line gains const KV_EXCL; kvRulingOk tests KV_EXCL on the masked copy only. Base: live s258.
const fs=require('fs');const {unpack,rb}=require('../tools/lib.cjs');
const w=JSON.parse(fs.readFileSync(process.argv[2]));const BASEV='da90bc97-6b13-454e-bdd3-1b98300ac557';if(w.versionId!==BASEV)throw new Error('base moved: '+w.versionId);
const CL=fs.readFileSync(process.argv[4],'utf8').trim();
const u=unpack(w);const L=u.L.slice();
const one=(f,label)=>{const ix=L.map((l,i)=>f(l)?i:-1).filter(i=>i>=0);if(ix.length!==1)throw new Error(label+' count '+ix.length);return ix[0];};
const iK=one(l=>l.startsWith('const KV_KIND=/'),'KV_KIND line');
if(L.some(l=>l.includes('KV_EXCL')))throw new Error('KV_EXCL already present');
L[iK]=L[iK]+' const KV_EXCL=/'+CL+'/i; /* ASK 376 (operator card; W3 7901): a K-V ruling may name the kind as an exclusion the quote\'s words do not make; tested on the masked copy only */';
const iR=one(l=>l.includes('function kvRulingOk('),'kvRulingOk line');
const MASK=String.raw`String(seg).replace(/["“][^"”\n]*["”]/g,'"Q"').replace(/(^|[\s(\[:;,])['‘](?:[^'’\n]|['’](?=[A-Za-z]))+?['’](?=$|[\s.,;:!?)\]])/g,"$1'Q'")`;
const OLD='const kind=KV_KIND.test(seg)||KV_KIND.test('+MASK+');';
const NEW='const kvM='+MASK+';const kind=KV_KIND.test(seg)||KV_KIND.test(kvM)||KV_EXCL.test(kvM); /* ASK 376 */';
if(L[iR].split(OLD).length!==2)throw new Error('kvRulingOk anchor');L[iR]=L[iR].replace(OLD,()=>NEW);
const M=JSON.parse(JSON.stringify(u.M));const fixed=[];for(const k in M){const len=rb(L,M[k]).length;if(len!==M[k].n){fixed.push(k);M[k].n=len;}}
const T=u.T;const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');
if(JSON.stringify(u.L)!==T.slice(iL+8,iM)||JSON.stringify(u.M)!==T.slice(iM+8,iE))throw new Error('LIB/MAP serialization differs; stop');
w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=T.slice(0,iL+8)+JSON.stringify(L)+T.slice(iM,iM+8)+JSON.stringify(M)+T.slice(iE);
fs.writeFileSync(process.argv[3],JSON.stringify(w));console.log('lines',iK,iR,'MAP n updated',fixed.length,fixed.join(', '));
