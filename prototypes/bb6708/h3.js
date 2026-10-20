const fs=require('fs');const rep=JSON.parse(fs.readFileSync('h_out.json'));
const t=Object.keys(rep).find(k=>k.includes('27088'));const R=rep[t];
const un=s=>JSON.parse('"'+s+'"');
console.log('TOKEN',t);
for(const n of ['D3_Build','C3_Build']){console.log('==',n,'added chars',R[n].addLen);for(const l of R[n].add)console.log(un(l));}
for(const n of ['Build_Independent_Verdict']){console.log('==',n,'added chars',R[n].addLen);for(const l of R[n].add)console.log(un(l));}
const d3=R.D3_Build.add.map(un).join('\n');
for(const v of ['Luke 1:31','Deuteronomy 22:23-24','Ruth 4:10','Genesis 48:5','1 Chronicles 2:34-35','Matthew 1:16'])console.log('DoD1',v,d3.includes(v));
const c3=R.C3_Build.add.map(un).filter(l=>/^round/.test(l));let n=0;for(const l of c3){const m=l.replace(/^[^:]*: /,'');if(m!=='none')n+=m.split(', ').length;}console.log('challenger widened count',n);
