const {RD,out}=require('./x.cjs');
for(const n of ['QR Check','QR Retry Ask','QR Final','QR Merge']){const o=out(n);console.log('=====',n,o.length);o.forEach((it,i)=>{const j=it.json;const ks=Object.keys(j);console.log(i,ks.join(',').slice(0,300));
 const s=JSON.stringify(j, (k,v)=>typeof v==='string'&&v.length>600?v.slice(0,600)+'…':v);
 if(n==='QR Check')console.log(s.slice(0,5000));
 if(n==='QR Merge'){const q=j.qr||j.qround||j.questions||null;const t=JSON.stringify(j,(k,v)=>typeof v==='string'&&v.length>400?v.slice(0,400)+'…':v);let m;const re=/"redirect":[^]{0,400}/g;let c=0;while((m=re.exec(t))&&c<8){console.log('  R>',m[0].slice(0,400));c++}
  const re2=/PASSED[^"]{0,200}/g;c=0;while((m=re2.exec(t))&&c<12){console.log('  P>',m[0]);c++}}
 if(n==='QR Retry Ask'){console.log(' usage',JSON.stringify(j.usage||{}).slice(0,200),' model',j.model)}
})}
