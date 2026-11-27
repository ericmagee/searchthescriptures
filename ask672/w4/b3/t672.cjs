// ASK 672 rev 3 join tests (W1 12821 C4)
const fs=require('fs');const VP4N0=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const F=f=>eval('(()=>{'+fs.readFileSync(__dirname+'/'+f,'utf8')+';return vp524Verses;})()');const B2=F('../b2/new_vp524.js'),B3=F('new_vp524.js');
const T=[
 ['"a virgin shall be with child" (Matthew 1:23); "I know not a man" (Luke 1:34)',{'Matthew 1:23':['a virgin shall be with child'],'Luke 1:34':['I know not a man']}],
 ['Matthew 1:23 "a virgin shall be with child"; Luke 1:34 "I know not a man"',{'Matthew 1:23':['a virgin shall be with child'],'Luke 1:34':['I know not a man']}],
 ['Matthew 1:23: "a virgin shall be with child" Luke 1:34: "I know not a man"',{'Matthew 1:23':['a virgin shall be with child'],'Luke 1:34':['I know not a man']}],
 ['"a virgin shall be with child" (Matthew 1:23), "I know not a man" (Luke 1:34), "the Holy Ghost shall come upon thee" (Luke 1:35)',{'Matthew 1:23':['a virgin shall be with child'],'Luke 1:34':['I know not a man'],'Luke 1:35':['the Holy Ghost shall come upon thee']}],
 ['Luke 1:34 margin: "I know not a man"',{'Luke 1:34':['I know not a man']}],
 ['"I know not a man" -- Luke 1:34',{'Luke 1:34':['I know not a man']}],
 ['The Son is called "thy father" (*patḗr*, G3962) in that verse',{}],
];
let pass=0,b2w=0;for(const [t,exp] of T){for(const [lab,f] of [['B2',B2],['B3',B3]]){const got={};for(const v of f([t]))(got[v.ref]=got[v.ref]||[]).push(v.w);const ok=JSON.stringify(Object.keys(got).sort().map(k=>[k,got[k]]))===JSON.stringify(Object.keys(exp).sort().map(k=>[k,exp[k]]));
 if(lab==='B3'){if(ok)pass++;console.log(ok?'PASS':'FAIL','B3',t.slice(0,70),JSON.stringify(got));}else if(!ok){b2w++;console.log('B2 WRONG',t.slice(0,70),JSON.stringify(got));}}}
console.log('B3 PASS',pass,'of',T.length,'| B2 wrong on',b2w);
