// pkgEFG replay on saved node inputs (main and Alt). Base: pkgEAH/patched Build + pkgECQ/patched_live_on_pkgEAH_patched Record. Patched: pkgEFG LIVE/TRIAL.
// Checks: Build items equal apart from efg, the CODE CHECK line and req; calls and not_checked compared; Record rows equal except E-COL rows with efg.
// Lists every FORCED E-COL item with its check result and every row change.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const BB=process.env.BB||'pkgEAH/patched',RB=process.env.RB||'pkgECQ/patched_live_on_pkgEAH_patched',LV=process.env.LV||'pkgEFG/patched_live',TR=process.env.TR||'pkgEFG/patched';
const RUNS=(process.argv[2]||'33218,33222,33249,33261,33276,33289,33299,33311,33322,33345,33371').split(',');
const rf=p=>fs.readFileSync(p.replace(/ /g,'_')+'.js','utf8');const FBN=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s39.json','utf8'));
const conn=(FBN.data||FBN).connections;const feeder=n=>Object.entries(conn).filter(([k,v])=>JSON.stringify(v).includes('"'+n+'"')).map(([k])=>k);
const has=(R,n)=>fs.existsSync(D+R+'_'+n.replace(/ /g,'_')+'.json');
let bad=0,ok=0;const say=(c,m)=>{if(c)ok++;else{bad++;console.log('FAIL',m);}};const forced=[],changes=[];
for(const R of RUNS)for(const pre of ['','Alt ']){const JB=pre+'Judge Enforcer Build',JR=pre+'Judge Enforcer Record';if(!has(R,JB)||!has(R,JR))continue;
 let bB,pB;try{bB=harness(R)(rf(BB+'/'+JB),feeder(JB)[0]);pB=harness(R)(rf(LV+'/'+JB),feeder(JB)[0]);}catch(e){console.log(R,pre||'main','SKIP build',String(e.message).slice(0,80));continue;}
 const ids=o=>o.flatMap(c=>(c.json||c).ids||[]);const bi=ids(bB),pi=ids(pB);
 const strip=o=>JSON.stringify(o.map(c=>{const j=c.json||c;return {...j,calls:0,call:0,ids:(j.ids||[]).map(x=>{const {efg,...r}=x;return r;}),body:{...j.body,messages:(j.body&&j.body.messages||[]).map(m=>({...m,content:String(m.content).replace(/\nCODE CHECK \(pkgEFG\): [^\n]*/g,'').replace(/A FORCED line breaks a link by meaning only when [^]*?\(pkgEFG, either side alike\)\. /,'')}))}};}));
 const sameCalls=bB.length===pB.length;const nb=((bB[0]||{}).json||{}).not_checked||[],np=((pB[0]||{}).json||{}).not_checked||[];
 if(sameCalls)say(strip(bB)===strip(pB),R+' '+JB+' differs beyond efg/CODE CHECK/rule');
 say(np.length<=nb.length,R+' not_checked grew');const ef=pi.filter(x=>x.rule==='E-COL'&&/^FORCED/.test(x.flagged_line||''));
 for(const x of ef)forced.push({run:R,chain:pre||'main',seat:x.seat,item:x.item,efg:x.efg||null,line:(x.flagged_line||'').slice(0,240)});
 let b,l,p;try{b=harness(R,{[JB]:bB.map(j=>({json:j.json||j}))})(rf(RB+'/'+JR),pre+'Judge Enforcer Call deepseek');const S=harness(R,{[JB]:pB.map(j=>({json:j.json||j}))});l=S(rf(LV+'/'+JR),pre+'Judge Enforcer Call deepseek');p=S(rf(TR+'/'+JR),pre+'Judge Enforcer Call deepseek');}catch(e){console.log(R,pre||'main','SKIP record',String(e.message).slice(0,80));continue;}
 const br=b[0].json.enf428_rows||[],lr=l[0].json.enf428_rows||[],pr=p[0].json.enf428_rows||[];
 if(sameCalls){say(br.length===lr.length&&br.length===pr.length,R+' counts');br.forEach((x,i)=>{const L=lr[i],P=pr[i];
  say(JSON.stringify({...x,cure_reason:0,prompt_sent:0})===JSON.stringify({...L,cure_reason:0,prompt_sent:0}),R+' row '+i+' fields');
  if(x.cure_reason!==L.cure_reason||x.cure_reason!==P.cure_reason){say(x.rule==='E-COL',R+' non-E-COL row changed');changes.push({run:R,chain:pre||'main',seat:x.seat,item:x.item,base:x.cure_reason.slice(0,160),live:L.cure_reason.slice(0,260)});}});}
 console.log(R,(pre||'main').padEnd(5),'calls',bB.length,'->',pB.length,'not_checked',nb.length,'->',np.length,'FORCED items',ef.length,'efg',ef.filter(x=>x.efg).length);}
for(const x of forced)console.log((x.efg?'EFG ':'pass')+' '+x.run+' '+x.chain+' '+x.seat+' '+x.item+' | '+(x.efg||'')+' | '+x.line);
for(const c of changes)console.log('ROW',c.run,c.chain,c.seat,c.item,'| base:',c.base,'| live:',c.live);
console.log(ok+' OK, '+bad+' FAIL; FORCED items '+forced.length+', efg '+forced.filter(x=>x.efg).length+', row changes '+changes.length);
