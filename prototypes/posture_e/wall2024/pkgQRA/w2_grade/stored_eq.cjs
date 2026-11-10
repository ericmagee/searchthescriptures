// W2 grade of pkgQRA: Judge Contradiction Build, live s102 against patched, on every stored run (no question round in any of them). Output must be equal.
process.chdir(__dirname+'/../..');const fs=require('fs');const H=require('../../pkgVP3/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;
const L=code(g('/mnt/project-files/wall2024/'+(process.env.LIVEFB||'fetchback_live_s102.json')+''),'Judge Contradiction Build'),P=code(g(''+(process.env.CAND||'pkgQRA/parent_s102_QRA.json')+''),'Judge Contradiction Build');
const runs=[...new Set(fs.readdirSync(H.IN).filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
(async()=>{let eq=0,diff=0,err=0,cand=0;for(const r of runs){let a,b;try{a=await H.run(L,r,'Final Output');}catch(e){a='ERR '+e.message.slice(0,80);}try{b=await H.run(P,r,'Final Output');}catch(e){b='ERR '+e.message.slice(0,80);}
 const strip=x=>{if(typeof x==='string')return x;const y=JSON.parse(JSON.stringify(x));y.forEach(i=>{if(i&&i.json)delete i.json.qra;});return JSON.stringify(y);};
 const qa=typeof b==='string'?null:JSON.stringify(b.map(i=>i.json&&i.json.qra));
 const nc=typeof a==='string'?0:a.reduce((s,i)=>s+((i.json&&i.json.cands)||[]).length,0);cand+=nc;
 if(typeof a==='string'&&typeof b==='string'&&a===b){err++;console.log('SAME ERROR '+r+' '+a);}else if(strip(a)===strip(b)){eq++;console.log('EQUAL '+r+' cands '+nc+' qra '+qa);}else{diff++;console.log('DIFF  '+r);}}
 console.log(runs.length+' stored runs: '+eq+' equal, '+err+' same error, '+diff+' differ; candidates in equal runs '+cand);process.exit(diff?1:0);})();
