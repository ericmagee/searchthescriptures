const fs=require('fs');const c=fs.readFileSync('pcc.js','utf8');
const grab=(a)=>{const i=c.indexOf(a);let d=0,j=c.indexOf('{',i);for(let k=j;k<c.length;k++){if(c[k]=='{')d++;else if(c[k]=='}'){d--;if(!d)return c.slice(i,k+1);}}};
const bk=c.slice(c.indexOf('const CURE_BK'),c.indexOf(';',c.indexOf('const CURE_BK'))+1);
eval(bk.replace('const ','globalThis.')+grab('function cureRefs')+';globalThis.cureRefs=cureRefs;'+grab('function cureNamed')+';globalThis.cureNamed=cureNamed;');
const line='D2 vs C1 (Matthew 1:25): CHALLENGER LINK BROKEN -- [L1] "knew her not till she had brought forth"';
for(const f of ['engine_r2.txt','challenger_r3.txt']){const t=fs.readFileSync(f,'utf8');
 const n=cureNamed(line,t);console.log(f,'named:',n.map(z=>z.ref+' x'+z.blocks.length));
 console.log(' refs with 1:2x:',cureRefs(t).filter(r=>/1:2[45]$/.test(r.key)).map(r=>r.key));}
console.log('range test:',cureRefs('Matthew 1:24–25: x').map(r=>r.key));
