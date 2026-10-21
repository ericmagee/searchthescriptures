// BB-7043 option 1: compare the composition before and after step 3b (delivered bytes).
// Passes only if, in every Code node, the two differ on the DRV_SRC line alone, and that line's pattern matches the same
// characters before and after on every code point from 0 to 2FFFF (surrogates skipped) and on Strong's-number strings.
// Usage: node delivered_check.cjs <composed.json without step 3b> <composed.json with step 3b>
const fs=require('fs');
const [A,B]=process.argv.slice(2).map(f=>Object.fromEntries(JSON.parse(fs.readFileSync(f,'utf8')).nodes.map(n=>[n.name,n])));
const pat=l=>eval('('+l.replace(/^const DRV_SRC=/,'').replace(/;\s*\/\/.*$/,'').replace(/;\s*$/,'')+')');
let fail=0,changed=0;
const samples=['G1675','H5959','a G12 b','H05959','G123456','word','Gx12'];
for(const name of Object.keys(A)){
  const a=A[name],b=B[name];
  if(!b){console.log('FAIL missing '+name);fail++;continue;}
  const ca=a.parameters&&a.parameters.jsCode,cb=b.parameters&&b.parameters.jsCode;
  if(JSON.stringify({...a.parameters,jsCode:0})!==JSON.stringify({...b.parameters,jsCode:0})){console.log('FAIL other parameters differ: '+name);fail++;continue;}
  if(ca===cb)continue;
  const la=ca.split('\n'),lb=cb.split('\n');
  if(la.length!==lb.length){console.log('FAIL line count differs: '+name);fail++;continue;}
  const d=la.map((x,i)=>i).filter(i=>la[i]!==lb[i]);
  if(d.length!==1||!la[d[0]].startsWith('const DRV_SRC=')){console.log('FAIL lines other than DRV_SRC differ: '+name+' '+d.join(','));fail++;continue;}
  const ra=pat(la[d[0]]),rb=pat(lb[d[0]]);let n=0;
  for(let c=0;c<0x30000;c++){if(c>=0xD800&&c<0xE000)continue;const s=String.fromCodePoint(c);if(ra.test(s)!==rb.test(s))n++;}
  for(const s of samples)if(ra.test(s)!==rb.test(s))n++;
  if(/\\u[0-9a-fA-F]{4}/.test(lb[d[0]])){console.log('FAIL escape left on the delivered line: '+name);fail++;continue;}
  changed++;console.log((n?'FAIL ':'OK   ')+name+': DRV_SRC line only; '+n+' inputs match differently');if(n)fail++;
}
console.log('nodes changed '+changed+', failures '+fail);process.exit(fail?1:0);
