// pkgECQ replay on saved node inputs (main and Alt): base Build output -> Record base vs ECQ LIVE and TRIAL (ECQ changes no Build node).
// 'sides' = the Record finds the rounds in Panel Cure Normalize 1-3. Checks: Record rows equal except (CONCEDED) pushes ECQ holds (LIVE: HELD; TRIAL: unchanged + stripped mark). Lists them.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const BASE=process.env.BASE||'pkgEAH/patched';const LV=process.env.LV||'pkgECQ/patched_live_on_pkgEAH_patched',TR=process.env.TR||'pkgECQ/patched_on_pkgEAH_patched';
const RUNS=(process.argv[2]||'33218,33222,33249,33261,33276,33289,33299,33311,33322,33345,33371').split(',');
const rf=p=>fs.readFileSync(p.replace(/ /g,'_')+'.js','utf8');const FBN=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s39.json','utf8'));
const conn=(FBN.data||FBN).connections;const feeder=n=>Object.entries(conn).filter(([k,v])=>JSON.stringify(v).includes('"'+n+'"')).map(([k])=>k);
const has=(R,n)=>fs.existsSync(D+R+'_'+n.replace(/ /g,'_')+'.json');
let hits=[],bad=0,ok=0,conc=0;const say=(c,m)=>{if(c)ok++;else{bad++;console.log('FAIL',m);}};
for(const R of RUNS)for(const pre of ['','Alt ']){const JB=pre+'Judge Enforcer Build',JR=pre+'Judge Enforcer Record';if(!has(R,JB)||!has(R,JR))continue;
 let bB,pB;try{bB=harness(R)(rf(BASE+'/'+JB),feeder(JB)[0]);pB=bB;}catch(e){console.log(R,pre||'main','SKIP build',String(e.message).slice(0,80));continue;}
 let sides=false;try{const H=harness(R);const t=H("let R=null;for(const f of [()=>$('Panel Cure Normalize 1'),()=>$('Panel Cure Normalize 2'),()=>$('Panel Cure Normalize 3')]){try{const nd=f();if(nd.isExecuted)for(const it of nd.all()){const c=it.json&&it.json.cure;if(c&&c.rounds){R=c.rounds;break;}}}catch(e){}if(R)break;}return [{json:{r:!!R}}];","x");sides=!!(t[0]&&t[0].json.r);}catch(e){}const inR=pre+'Judge Enforcer Call deepseek';let b,l,p;
 try{b=harness(R,{[JB]:bB.map(j=>({json:j.json||j}))})(rf(BASE+'/'+JR),inR);const S=harness(R,{[JB]:pB.map(j=>({json:j.json||j}))});l=S(rf(LV+'/'+JR),inR);p=S(rf(TR+'/'+JR),inR);}catch(e){console.log(R,pre||'main','SKIP record',String(e.message).slice(0,80));continue;}
 const br=b[0].json.enf428_rows||[],lr=l[0].json.enf428_rows||[],pr=p[0].json.enf428_rows||[];say(br.length===lr.length&&br.length===pr.length,R+' counts');let n=0,c=0;
 br.forEach((x,i)=>{const L=lr[i],P=pr[i];say(JSON.stringify({...x,cure_reason:0})===JSON.stringify({...L,cure_reason:0})&&JSON.stringify({...x,cure_reason:0})===JSON.stringify({...P,cure_reason:0}),R+' row '+i+' fields');
  if(/\(right: COUNTED\): \(CONCEDED\)/.test(x.cure_reason))c++;
  if(x.cure_reason!==L.cure_reason||x.cure_reason!==P.cure_reason){n++;say(/^ENFORCER DISAGREE \(right: COUNTED\): \(CONCEDED\)/.test(x.cure_reason)&&/^ENFORCER HELD \(pkgEPS, not sent;[^]*CONCEDED\) quote|^ENFORCER HELD \(pkgEPS, not sent; W3 2842: the  CONCEDED  quote/.test(L.cure_reason)&&P.cure_reason.startsWith(x.cure_reason)&&/\(TRIAL pkgECQ would hold: [^()]*\)$/.test(P.cure_reason),R+' hold form: '+L.cure_reason.slice(0,120));
   hits.push({run:R,chain:pre||'main',seat:x.seat,item:x.item,mark:(P.cure_reason.match(/\(TRIAL pkgECQ would hold: ([^()]*)\)$/)||[])[1],why:x.cure_reason.slice(0,260)});}});
 conc+=c;console.log(R,(pre||'main').padEnd(5),'sides',sides,'(CONCEDED) pushes',c,'ECQ holds',n);}
for(const x of hits)console.log('HOLD',x.run,x.chain,x.seat,x.item,'|',x.mark,'|',x.why);
console.log(ok+' OK, '+bad+' FAIL; (CONCEDED) pushes '+conc+', ECQ holds '+hits.length);
