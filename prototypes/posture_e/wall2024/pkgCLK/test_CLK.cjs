// replay Close Enforcer Record (live s119 vs pkgCLK) on 34852 (from ex34852_full.json) and on every stored run in inputs/ that holds its input.
const fs=require('fs');const H=require('../pkgEAD/harness_clone.cjs');
let A=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s119.json','utf8'));A=A.data||A;A=A.workflow||A;
const live=A.nodes.find(n=>n.name==='Close Enforcer Record').parameters.jsCode,neu=fs.readFileSync(__dirname+'/Close_Enforcer_Record.js','utf8');
const run=(src,$,inp)=>{const $input={first:()=>inp[0],all:()=>inp,item:inp[0]};return new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);};
const pick=o=>(o.cec.rows||[]).map(r=>r.id+' '+r.side+' LINK '+r.link+' '+r.status+(r.relink?' | '+r.relink:'')).join('\n')+'\nCONFIRMED: '+(o.cec.confirmed||[]).map(x=>x.side+' LINK '+x.link).join(', ');
(async()=>{let tot=0,chg=0;
 for(const EX of (process.argv[2]||'34852').split(',')){
 const d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex'+EX+'_full.json','utf8'));if(!(d.data||d).resultData.runData['Close Enforcer Call deepseek']){console.log(EX,'no Close Enforcer call');continue;}const rr=(d.data||d).resultData.runData;
 const nodeOut=n=>{const r=rr[n];if(!r)return null;return r[r.length-1].data.main[0]||[];};
 const $=n=>{const o=nodeOut(n);const it=o||[];return {isExecuted:!!o,first:()=>it[0],all:()=>it,item:it[0]};};
 const inp=nodeOut('Close Enforcer Call deepseek');const a=(await run(live,$,inp))[0].json,b=(await run(neu,$,inp))[0].json;
 console.log('== '+EX+' live\n'+pick(a)+'\n== '+EX+' pkgCLK\n'+pick(b));tot++;if(pick(a)!==pick(b))chg++;
 const stored=(await run(live,$,inp))[0].json;console.log('live replay equals stored output: '+(JSON.stringify(stored.cec.rows)===JSON.stringify(nodeOut('Close Enforcer Record')[0].json.cec.rows)));}
 // stored runs
 const runs=[...new Set(fs.readdirSync(H.IN).filter(f=>/_Close_Enforcer_Call_deepseek\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
 for(const r of runs){const $1=H.mk$(r,{});const i=$1('Close Enforcer Call deepseek');const I=i.all();let x,y;try{x=(await run(live,$1,I))[0].json;y=(await run(neu,$1,I))[0].json;}catch(e){console.log(r,'ERR',e.message);continue;}tot++;
  if(pick(x)!==pick(y)){chg++;console.log('== '+r+' CHANGED\n live: '+pick(x).replace(/\n/g,'\n       ')+'\n clk:  '+pick(y).replace(/\n/g,'\n       '));}else console.log(r,'same ('+(x.cec.rows||[]).length+' rows, confirmed '+(x.cec.confirmed||[]).length+')');}
 console.log('replays '+tot+', changed '+chg);})();
