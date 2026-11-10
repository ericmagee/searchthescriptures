const {go}=require('./o.cjs');const S=j=>JSON.stringify(j);
(async()=>{const {b}=await go();const r=await go({'Send Back Record':o=>{let n=0;o[0][0].json.sb_items.forEach(z=>{if(z.rule==='E-OOR'&&z.to==='NONE'){z.to='STRUCK';n++;}});console.log('replaced',n);}});
 const strip=x=>S(x).replace(/"to":"(?:NONE|STRUCK)"/g,'"to":"X"');console.log('STRONG: candidate on NONE equals live on STRUCK:',strip(b)===strip(r.a),'| candidate on STRUCK equals live on STRUCK:',S(r.a)===S(r.b));})();
