const c=require('./target.json').nodes.find(n=>n.name==='L2 Count Plan').parameters.jsCode;const nx=c.indexOf("const S=$('Citation Scan')");const i=c.indexOf('const __SPC=');
const L2C=new Function(c.slice(0,nx)+';return L2C;')();const SPC=new Function('L2C',c.slice(i,c.indexOf(' /* pkgSPC',i))+';return __SPC;')(L2C);
const ow=require('./ow37032.json');const RD=[...new Set(ow.map(r=>r.book+' '+r.chapter+':'+r.verse))];
const mk=(seg,verses,words)=>({side:'C',round:'DR4',seg,verses,words});
const P=[['good H2030',mk('*harah* (H2030), "pregnant," stands in Isaiah 7:14.',['Isaiah 7:14'],[{w:'harah',kind:'latin'},{w:'H2030',kind:'strongs'}])],
['bad H2029',mk('*harah* (H2029) stands in Isaiah 7:14.',['Isaiah 7:14'],[{w:'harah',kind:'latin'},{w:'H2029',kind:'strongs'}])],
['bad voice',mk('*gennēsei* (G1080) is passive in Luke 1:13.',['Luke 1:13'],[{w:'gennēsei',kind:'latin'},{w:'G1080',kind:'strongs'}])],
['good voice',mk('*egennēthē* (G1080) is passive in Matthew 1:16.',['Matthew 1:16'],[{w:'egennēthē',kind:'latin'},{w:'G1080',kind:'strongs'}])],
['good active',mk('*gennēsei* (G1080) is active in Luke 1:13.',['Luke 1:13'],[{w:'gennēsei',kind:'latin'},{w:'G1080',kind:'strongs'}])]];
for(const [n,t] of P){const ck=L2C.check([t],ow,[],RD);SPC(ck,ow,[]);console.log(n,'|',ck[0].status,'|',JSON.stringify(ck[0].place||null));}
