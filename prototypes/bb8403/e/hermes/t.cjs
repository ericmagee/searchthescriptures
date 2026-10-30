const {cureRefs,cureNamed}=require(process.argv[2]+'/cure.cjs');const fs=require('fs');
const line='D2 vs C1 (Matthew 1:25): CHALLENGER LINK BROKEN -- x';
for(const k of ['C2','C3']){const t=fs.readFileSync(process.argv[2]+'/'+k+'.txt','utf8');
 const r=cureRefs(t).filter(x=>/1:2[45]/.test(x.key)).map(x=>x.key);
 const n=cureNamed(line,t);console.log(k,'refs 1:24/25:',JSON.stringify(r),'| named for gemini line:',n.map(z=>z.ref));}
