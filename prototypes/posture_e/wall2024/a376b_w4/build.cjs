// ASK 376 rebuild (plan W3 7901 rev 2, refreshed 8798 C; first build W4 7907 on s258, PASS W2 7908): a K-V ruling may name the kind as an exclusion the quote's words
// do not make. Two Shared Library lines: the KV_KIND line gains const KV_EXCL (W3 clause.txt at 03dc00e9); kvRulingOk tests KV_EXCL on the masked copy only.
// MAP n recomputed for every entry; header library sha updated. Same edit for the engine and the child (both libraries hold the lines).
// Usage: node a376b/build.cjs IN OUT CLAUSE BASE_VERSIONID
const fs=require('fs'),cr=require('crypto');const acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const [IN,OUT,CLF,BASEV]=process.argv.slice(2);let w=JSON.parse(fs.readFileSync(IN));if(w.data&&w.data.nodes)w=w.data;if(w.versionId!==BASEV)throw new Error('base moved: '+w.versionId);
const CL=fs.readFileSync(CLF,'utf8').trim();
const U=T.unpack(w);const L=U.L,M=U.M;
const one=(f,label)=>{const ix=L.map((l,i)=>f(l)?i:-1).filter(i=>i>=0);if(ix.length!==1)throw new Error(label+' count '+ix.length);return ix[0];};
const iK=one(l=>l.startsWith('const KV_KIND=/'),'KV_KIND line');
if(L.some(l=>l.includes('KV_EXCL')))throw new Error('KV_EXCL already present');
L[iK]=L[iK]+' const KV_EXCL=/'+CL+'/i; /* ASK 376: a K-V ruling may name the kind as an exclusion the quote\'s words do not make; tested on the masked copy only */';
const iR=one(l=>l.includes('function kvRulingOk('),'kvRulingOk line');
const MASK=String.raw`String(seg).replace(/["“][^"”\n]*["”]/g,'"Q"').replace(/(^|[\s(\[:;,])['‘](?:[^'’\n]|['’](?=[A-Za-z]))+?['’](?=$|[\s.,;:!?)\]])/g,"$1'Q'")`;
const OLD='const kind=KV_KIND.test(seg)||KV_KIND.test('+MASK+');';
const NEW='const kvM='+MASK+';const kind=KV_KIND.test(seg)||KV_KIND.test(kvM)||KV_EXCL.test(kvM); /* ASK 376 */';
if(L[iR].split(OLD).length!==2)throw new Error('kvRulingOk anchor');L[iR]=L[iR].replace(OLD,()=>NEW);
const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
const LJ=JSON.stringify(L);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L.length+' lines');if(h2===U.hdr)throw new Error('hdr');
w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
const P=s=>acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});for(const k of Object.keys(M))P(T.rb(L,M[k]));
fs.writeFileSync(OUT,JSON.stringify(w));console.log('lines',iK,iR,'| MAP n changed',ch.length,'| lib sha',lsha);
