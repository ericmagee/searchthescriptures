const R=require(process.argv[2]||'./refp.cjs');
const F=[
 ['Matthew 1:18, 20',12],
 ['Matthew 1:18, 2 witnesses',12],
 ['Matthew 1:18, 99',12],
 ['Matthew 1:1-17',12],
 ['Matthew 1:1-17',30],
 ['Matthew 1:18 and 20',12],
 ['Matthew 1:18, 20, and 2 witnesses',12],
 ['Matthew 1:18,20',12],
 ['Matthew 1:18; 2:1',12],
 ['Matthew 1:26',12],
 ['Matthew 1:18-20, 25',12],
 ['Matthew 1:18, 2:1',12],
 ['Psalms 119:1-176',12],
 ['Isaiah 7:14, 3 times',12],
 ['Matthew 1:18 to 1:25',12],
];
for(const [t,cap] of F){console.log(JSON.stringify(t),'cap',cap,'=>',R.keys(t,{cap}).map(k=>k.key.replace(/^\S+ /,'')).join(' | ').slice(0,120));}
