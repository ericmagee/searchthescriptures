const [LV,TG]=process.argv.slice(2);const A=require(LV),B=require(TG);
const F=[['Psalms 2:7, 12 Kiss the Son','2:7 | 2:12'],['Psalms 2:7;12 Kiss the Son','2:7 | 2:12'],['Psalms 2:7; 12 Kiss','2:7'],['Romans 3:23;10:9','3:23 | 10:9'],['Romans 3:23; 10:9','3:23 | 10:9'],['John 3:16;1 John 4:8','3:16 | 4:8'],['Matthew 1:18;2 witnesses','1:18'],['Luke 21:26;35','21:26 | 21:35'],['Acts 1:8, 14','1:8 | 1:14'],['John 3:16, 18','3:16 | 3:18'],['Numbers 1:2, 18','1:2 | 1:18']];
let ok=0;for(const [t,want] of F){const f=R=>R.parse(t,{scoped:false}).map(i=>i.c+':'+i.v1+(i.v2>i.v1?'-'+i.v2:'')).join(' | ');const a=f(A),b=f(B);const p=b===want;ok+=p;console.log((p?'PASS':'FAIL')+' "'+t+'" live => '+a+' | target => '+b+' (want '+want+')');}
console.log(ok+' of '+F.length+' pass on the target');
