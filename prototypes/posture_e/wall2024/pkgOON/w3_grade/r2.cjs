const {run,store,base}=require('../../pkgGK1/w3_grade/k.cjs');const S=JSON.stringify;
(async()=>{const inp=process.argv[2];const a=await run('LIVE','Judge Enforcer Build',inp,store()),b=await run('OON2','Judge Enforcer Build',inp,store());
 const T=s=>s.replace(/"at":"[^"]+"/g,'"at":0').replace(/\\"at\\":\\"[^"\\]+\\"/g,"AT");const sa=T(S(a)),sb=T(S(b));console.log('items',a.length,b.length,'len',sa.length,sb.length,'diff',sa.length-sb.length);
 const OLD=' (\\"the verbatim sentence in which the ground was granted\\")',NEW='; quote it verbatim, or CHANGE TO: STRUCK';
 console.log('old phrase in live',sa.split(OLD).length-1,'| new phrase in cand',sb.split(NEW).length-1,'| old in cand',sb.split('ground was granted').length-1-(sa.split('ground was granted').length-1-(sa.split(OLD).length-1)));
 console.log('equal after reversing the replacement:',sa.split(OLD).join(NEW)===sb);
 const st=S(base['Judge Enforcer Build']);console.log('live replay equals stored node output:',sa===T(S(base["Judge Enforcer Build"].flat().filter(Boolean).map(x=>x.json))));
 const m=sb.match(/.{160}; quote it verbatim, or CHANGE TO: STRUCK.{60}/);console.log('sample:',m&&m[0]);})();
