const L=require('./lib.cjs');
const an=L.items('Alternate Needed?')[0];
for(const s of an.summary){console.log(s.seat,s.api_model,'first tag',s.verdict_tag,'raw',s.raw_chars,s.finish_reason,'flags',s.flags,'drv',s.drv.length,'substitute',s.substitute);
 const by={};for(const c of s.cure){const k=c.rule+'/'+c.status;by[k]=(by[k]||0)+1;}console.log('  cure',JSON.stringify(by));
 console.log('  keys',Object.keys(s).join(','));}
for(const n of ['Close Enforcer Record','Judge Contradiction Record','Assume Check Record','Panel Check','Panel Cure Check','Reserve Needed?']){
 const it=L.items(n);console.log('==',n,it.length);for(const x of it){const c=JSON.stringify(L.shape(x,0,1));console.log(c.slice(0,1500));}
}
