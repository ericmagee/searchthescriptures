// pkgSGA3 item diff: node pkgSGA3/diff_items.cjs <base strip> <new strip> <node file stem> [runs...]  (all saved runs if none given)
// Runs the node on the saved feeder (live s61) and lists gate/send-back items whose key (kind|sid or key) is present on one side only.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const F='/mnt/project-files/wall2024/fetchback_live_s61.json';
const [A,B,stem,...rs]=process.argv.slice(2);const name=stem.replace(/_/g,' ');const IN=feeder(F,name)[0];
const runs=rs.length?rs:[...new Set(fs.readdirSync(D).filter(f=>/_Panel_Cure_Check\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
const a0=fs.readFileSync(A+'/patched/'+stem+'.js','utf8'),b0=fs.readFileSync(B+'/patched/'+stem+'.js','utf8');
const keys=o=>{const out=new Map();const walk=(v,seat)=>{if(Array.isArray(v)){v.forEach(x=>walk(x,seat));return;}if(!v||typeof v!=='object')return;const s=v.seat||v.judge_seat||seat;
 if(Array.isArray(v.items))for(const it of v.items)if(it&&typeof it==='object'&&(it.kind||it.rule))out.set(s+'|'+(it.key||((it.kind||it.rule)+'|'+(it.sid||it.gid||''))),String(it.why||'').slice(0,160)+' :: '+String(it.to||'').slice(0,100));
 for(const k of Object.keys(v))if(k!=='items')walk(v[k],s);};walk(o,'?');return out;};
(async()=>{let tot=0;for(const R of runs){const run=async src=>{try{return await Promise.resolve(harness(R)('return (async()=>{'+src+'\n})()',IN));}catch(e){return {ERR:String(e&&e.message||e).slice(0,100)};}};
 const a=await run(a0),b=await run(b0);if(JSON.stringify(a)===JSON.stringify(b))continue;tot++;const ka=keys(a),kb=keys(b);
 const gone=[...ka].filter(([k])=>!kb.has(k)),added=[...kb].filter(([k])=>!ka.has(k));console.log('RUN '+R+': items gone '+gone.length+', added '+added.length+(a.ERR||b.ERR?' ERR '+(a.ERR||'')+' / '+(b.ERR||''):''));
 for(const [k,v] of gone)console.log('  - '+k+'  '+v);for(const [k,v] of added)console.log('  + '+k+'  '+v);}
 console.log('runs with any change: '+tot+' of '+runs.length);})();
