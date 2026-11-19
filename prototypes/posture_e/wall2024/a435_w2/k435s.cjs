const fs=require('fs');const ex=f=>JSON.parse(JSON.parse(fs.readFileSync(f)).nodes.find(x=>x.name==='Shared Library').parameters.jsCode.match(/\/\*LIB\*\/(\[.*?\])\n/s)[1]);
const mk=s=>new Function(s+'\nreturn REFP;')();const [LV,TG,DB]=process.argv.slice(2);const A=mk(ex(LV).slice(490,512).join('\n')),B=mk(ex(TG).slice(490,512).join('\n'));
const D=JSON.parse(fs.readFileSync(DB));const F=['claude_r1','engine_r1','claude_r2','engine_r2','engine_r3','challenger_r3','defender_r4','challenger_r4','synthesis'];let texts=0,g=0,l=0;
for(const r of D)for(const f of F){const t=r[f];if(!t)continue;texts++;const a=new Set(A.keys(t,{scoped:true,cap:12}).map(k=>k.key)),b=new Set(B.keys(t,{scoped:true,cap:12}).map(k=>k.key));
 for(const k of b)if(!a.has(k)){g++;console.log('GAINED',r.run_token,f,k);}for(const k of a)if(!b.has(k)){l++;console.log('LOST',r.run_token,f,k);}}
console.log('texts',texts,'keys gained',g,'keys lost',l);
