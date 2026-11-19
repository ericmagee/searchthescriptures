// ASK 435 build (W2): REFP of live 2d40e6ad against the target's REFP on the stored debates (every round and synthesis, scoped and unscoped).
// Usage: node r435s.cjs LIVE_ENGINE.json TARGET_ENGINE.json DEBATES.json
const fs=require('fs');const ex=f=>JSON.parse(JSON.parse(fs.readFileSync(f)).nodes.find(x=>x.name==='Shared Library').parameters.jsCode.match(/\/\*LIB\*\/(\[.*?\])\n/s)[1]);
const mk=s=>new Function(s+'\nreturn REFP;')();const [LV,TG,DB]=process.argv.slice(2);const A=mk(ex(LV).slice(490,512).join('\n')),B=mk(ex(TG).slice(490,512).join('\n'));
const D=JSON.parse(fs.readFileSync(DB));const F=['claude_r1','engine_r1','claude_r2','engine_r2','engine_r3','challenger_r3','defender_r4','challenger_r4','synthesis'];let texts=0,diff=0,lost=0,gained=0;const ex2=[];const runs=new Set();
for(const r of D)for(const f of F){const t=r[f];if(!t)continue;texts++;for(const sc of [false,true]){const a=A.parse(t,{scoped:sc}).map(i=>i.at+'|'+(i.book||i.ctx)+' '+i.label),b=B.parse(t,{scoped:sc}).map(i=>i.at+'|'+(i.book||i.ctx)+' '+i.label);const sa=new Set(a),sb=new Set(b);const g=b.filter(x=>!sa.has(x)),l=a.filter(x=>!sb.has(x));
 if(g.length||l.length){diff++;gained+=g.length;lost+=l.length;runs.add(r.run_token);if(!sc)for(const x of g.concat(l.map(y=>'LOST '+y))){const at=+x.replace('LOST ','').split('|')[0];ex2.push(r.run_token+' '+f+' '+x.replace(/^\d+\|/,'')+' :: '+t.slice(at,at+70).replace(/\n/g,' '));}}}}
console.log('texts',texts,'texts x modes with a difference',diff,'items gained',gained,'items lost',lost,'runs',runs.size);ex2.forEach(x=>console.log('  ',x));
