// ASK 672 rev 3 join tests (W1 12821 C4)
const fs=require('fs');const VP4N0=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const F=f=>eval('(()=>{'+fs.readFileSync(__dirname+'/'+f,'utf8')+';return vp524Verses;})()');const B3o=F('../b4/new_vp524.js'),B3=F('new_vp524.js');
const T=[
 ['"a virgin shall be with child" (Matthew 1:23); "I know not a man" (Luke 1:34)',{'Matthew 1:23':['a virgin shall be with child'],'Luke 1:34':['I know not a man']}],
 ['Matthew 1:23 "a virgin shall be with child"; Luke 1:34 "I know not a man"',{'Matthew 1:23':['a virgin shall be with child'],'Luke 1:34':['I know not a man']}],
 ['Matthew 1:23: "a virgin shall be with child" Luke 1:34: "I know not a man"',{'Matthew 1:23':['a virgin shall be with child'],'Luke 1:34':['I know not a man']}],
 ['"a virgin shall be with child" (Matthew 1:23), "I know not a man" (Luke 1:34), "the Holy Ghost shall come upon thee" (Luke 1:35)',{'Matthew 1:23':['a virgin shall be with child'],'Luke 1:34':['I know not a man'],'Luke 1:35':['the Holy Ghost shall come upon thee']}],
 ['Luke 1:34 margin: "I know not a man"',{'Luke 1:34':['I know not a man']}],
 ['"I know not a man" -- Luke 1:34',{}],
 ['"a virgin shall be with child" Luke 1:34 "I know not a man"',{'Luke 1:34':['I know not a man']}],
 ['Isaiah 7:14 "Behold, a virgin shall conceive" (Isaiah 7:14); "I know not a man" (Luke 1:34)',{'Isaiah 7:14':['Behold, a virgin shall conceive'],'Luke 1:34':['I know not a man']}],
 ['"not ever")" PRESSED WITH: Luke 1:34 "How shall this be, seeing I know not a man?"; Luke 1:35 "The Holy Ghost shall come upon thee"; Luke 1:27 "the virgin\'s name was Mary."',{'Luke 1:34':['How shall this be, seeing I know not a man?'],'Luke 1:35':['The Holy Ghost shall come upon thee'],'Luke 1:27':["the virgin's name was Mary."]}],
 ['"his parents," Luke 2:41; "Joseph and his mother," Luke 2:33',{'Luke 2:41':['Joseph and his mother,']}],
 ['The Son is called "thy father" (*patḗr*, G3962) in that verse',{}],
];
let pass=0,b3d=0;for(const [t,exp] of T){for(const [lab,f] of [['B3o',B3o],['REV5',B3]]){const got={};for(const v of f([t]))(got[v.ref]=got[v.ref]||[]).push(v.w);const ok=JSON.stringify(Object.keys(got).sort().map(k=>[k,got[k]]))===JSON.stringify(Object.keys(exp).sort().map(k=>[k,exp[k]]));
 if(lab==='REV5'){if(ok)pass++;console.log(ok?'PASS':'FAIL','REV5',t.slice(0,70),JSON.stringify(got));}else if(!ok){b3d++;console.log('B3o DIFFERS',t.slice(0,70),JSON.stringify(got));}}}
console.log('B3 PASS',pass,'of',T.length,'| rev 3 differs on',b3d);
