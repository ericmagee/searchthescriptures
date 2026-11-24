// ASK 596 standing set runner (W4). node run.cjs <engine.json> <child.json> [--detail <out.json>]
// Runs every file in inv/ on the two workflow files. Fetches nothing; writes nothing unless --detail is given.
const fs=require('fs');const path=require('path');const {load,Marker}=require('./lib.cjs');
const [ef,cf]=process.argv.slice(2);if(!ef||!cf){console.log('usage: node run.cjs <engine.json> <child.json>');process.exit(2);}
const t0=Date.now();const E=load(ef),C=load(cf);const BASE=JSON.parse(fs.readFileSync(path.join(__dirname,'baseline.json'),'utf8'));
let pass=0,fail=0;const DET={};const fx={};
const ctx={E,C,T:(id,ok,msg)=>{ok?pass++:fail++;console.log((ok?'PASS ':'FAIL ')+id+' '+msg);},
 F:f=>fx[f]||(fx[f]=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures',f),'utf8'))),base:k=>BASE[k],detail:(k,v)=>{DET[k]=v;},
 group:(name,fn)=>{console.log('== '+name);try{fn();}catch(e){fail++;console.log('FAIL '+name+': '+(e&&e.marker?e.message:'error: '+(e&&e.message||e)));}}};
console.log('STANDING SET on '+path.basename(ef)+' ('+(E.versionId||'no version')+') and '+path.basename(cf)+' ('+(C.versionId||'no version')+')');
for(const f of fs.readdirSync(path.join(__dirname,'inv')).filter(f=>f.endsWith('.cjs')).sort()){console.log('# '+f);require(path.join(__dirname,'inv',f))(ctx);}
const i=process.argv.indexOf('--detail');if(i>0)fs.writeFileSync(process.argv[i+1],JSON.stringify(DET,null,1));
console.log('STANDING: '+pass+' PASS, '+fail+' FAIL ('+((Date.now()-t0)/1000).toFixed(1)+' s)');process.exit(fail?1:0);
