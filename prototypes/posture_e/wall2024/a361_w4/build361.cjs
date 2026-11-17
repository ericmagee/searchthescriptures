// ASK 361 (plan Wall 7583; agreed W1 7589 B1 B2, W2 7591 N1-N3, W3 7596 B3 B4): the pkgVNV reader also reads "not ... (as) void" and a retracted void ruling card. Base: live s245 (aefe76c1) unless given.
const fs=require('fs');const {unpack,rb}=require('../tools/lib.cjs');
const w=JSON.parse(fs.readFileSync(process.argv[2]||'../rdf/fetchback_s245.json'));const BASEV=process.argv[3]||'aefe76c1-9054-4420-aa3f-ceca3a65369e';if(w.versionId!==BASEV)throw new Error('base moved: '+w.versionId);
const u=unpack(w);const L=u.L.slice();
const rep=(i,o,n)=>{const c=L[i].split(o).length-1;if(c!==1)throw new Error('line '+i+' anchor count '+c);L[i]=L[i].replace(o,()=>n);};
const OLD=String.raw`const b=m[2];const ns=pwNums2024(m[1]); /* rev 2: plural lists via the pkgPWR reader */ if(/\b(?:is|are|was)?\s*not\s+VOID\b|\bno\s+longer\s+VOID\b/i.test(b))`;
const NEW=String.raw`let b=m[2];const ns=pwNums2024(m[1]); /* rev 2: plural lists via the pkgPWR reader */ let __rv=false;b=b.replace(/\b(?:(not\s+)?void\s+(?:ruling\s+)?(?:card|ruling|finding)\b[^.;]*?\b(?:retracted|withdrawn)\b|(?:retract(?:s|ed)?|withdraw(?:s|n)?)\s+(?:(?:the|its|my|that|this|earlier|prior|former)\s+)*(not\s+)?void\s+(?:ruling\s+)?(?:card|ruling|finding)\b)/gi,(x,n1,n2)=>{if(!n1&&!n2)__rv=true;return ' ';}); /* ASK 361: a retracted void ruling card reads as not VOID; a retracted NOT VOID card reads as neither */ if(__rv||/\b(?:is|are|was)?\s*not\s+VOID\b|\bno\s+longer\s+VOID\b/i.test(b)||/\bnot\s+(?:(?:(?!(?:only|merely|just|simply|solely|because|since|but|yet|even|if|unless|whether)\b)[\w'’-]+\s+)?(?:as|[\w'’-]+(?:ed|en)|held|found|shown|made|kept|left|read)\s+)?void\b(?!\s+of\b)/i.test(b)) /* ASK 361: "not", then at most a word and "as" or a participle, then "void" (as in "not excluded as void", "not ruled void"), any case; not "not only/merely void", not "the void charges", not "void of", never across a comma */`;
rep(1754,OLD,NEW);
if(!L[1754].includes('function rudPair2024'))throw new Error('rudPair2024 missing');
const M=JSON.parse(JSON.stringify(u.M));const fixed=[];for(const k in M){const len=rb(L,M[k]).length;if(len!==M[k].n){fixed.push(k);M[k].n=len;}}
const T=u.T;const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');
if(JSON.stringify(u.L)!==T.slice(iL+8,iM)||JSON.stringify(u.M)!==T.slice(iM+8,iE))throw new Error('LIB/MAP serialization differs; stop');
w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=T.slice(0,iL+8)+JSON.stringify(L)+T.slice(iM,iM+8)+JSON.stringify(M)+T.slice(iE);
fs.writeFileSync(process.argv[4]||'target_361.json',JSON.stringify(w));console.log('MAP n updated',fixed.length,fixed.join(', '));
