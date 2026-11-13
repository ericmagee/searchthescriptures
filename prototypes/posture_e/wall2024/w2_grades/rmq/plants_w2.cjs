// W2 plants for pkgRMQ. usage (from wall2024/): node w2_grades/rmq/plants_w2.cjs <base s174> <new RMQ>
const fs=require('fs');const src=fs.readFileSync(__dirname+'/../../pkgRMQ/test.cjs','utf8');
const head=src.slice(0,src.indexOf('const b1=')).replace("require('../pkgLIB/unpack.cjs')","require('"+__dirname+"/../../pkgLIB/unpack.cjs')");
const body=`let ok2=0,n2c=0;const T2=(nm,c,info)=>{n2c++;if(c)ok2++;console.log((c?'OK   ':'FAIL ')+nm+(info?' | '+info:''));};
let v;
v=run(NN,['isaiah 7:16'],AQ,RETQ.replace('"Matthew 1:22 gives its own reading of the word"','"MATTHEW 1:22, gives its OWN reading of the word."'));T2('R1 case and punctuation differ: refused',v.status==='UNCURED'&&/pkgRMQ/.test(v.why),v.status);
v=run(NN,[],AQ,RETQ);T2('R2 acq set, acm empty (MISSES on the answer, verse cleared): quote still refused',v.status==='UNCURED',v.status);
v=run(NN,['isaiah 7:16'],AQ,RETQ.replace('"Matthew 1:22 gives its own reading of the word"','“Matthew 1:22 gives its own reading of the word”'));T2('R3 curly quotes: refused',v.status==='UNCURED',v.status);
v=run(NN,['isaiah 7:16'],['It is.'],RETQ);T2('R4 a 2-word graded answer does not block an unrelated 9-word quote',!/pkgRMQ/.test(String(v.why)),v.status+' '+String(v.why).slice(0,80));
v=run(NN,['isaiah 7:16'],AQ,RETQ.replace('"Matthew 1:22 gives its own reading of the word"','"its own reading of the word"'));T2('R5 5-word fragment of the answer: no cure by quote (under 6) and no throw',v.status!=='CURED'||!/Matthew 1:22/.test(v.why),v.status+' '+String(v.why).slice(0,100));
v=run(NN,['isaiah 7:16'],JSON.parse(JSON.stringify(AQ)),RETQ);T2('R6 acq after a JSON round trip: refused',v.status==='UNCURED',v.status);
console.log("W2 checks "+ok2+" of "+n2c);`;
eval(head+body);
