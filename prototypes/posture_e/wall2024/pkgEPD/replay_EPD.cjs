// pkgEPD replay on saved node inputs: pkgEPS/patched_live Build -> Record base (pkgETC/patched_on_pkgEPS_patched_live) vs pkgEPD/patched_live and patched (TRIAL).
// Checks: rows identical except LIVE rows EPD lifts (HELD -> DISAGREE); TRIAL differs only by the appended EPD note on held rows. Lists every lift.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const RUNS=(process.argv[2]||'33040,33060,33083,33107,33129,33149,33160,33197,33218,33222,33249,33261,33276,33289,33299,33311,33322').split(',');
const rf=p=>fs.readFileSync(p.replace(/ /g,'_')+'.js','utf8');const FBN=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s39.json','utf8'));
const conn=(FBN.data||FBN).connections;const feeder=n=>Object.entries(conn).filter(([k,v])=>JSON.stringify(v).includes('"'+n+'"')).map(([k])=>k);
const has=(R,n)=>fs.existsSync(D+R+'_'+n.replace(/ /g,'_')+'.json');
let lifts=[],bad=0,ok=0,heldBase=0;const say=(c,m)=>{if(c)ok++;else{bad++;console.log('FAIL',m);}};
for(const R of RUNS)for(const pre of ['','Alt ']){const JB=pre+'Judge Enforcer Build',JR=pre+'Judge Enforcer Record';if(!has(R,JB)||!has(R,JR))continue;
 let B;try{B=harness(R)(rf('pkgEPS/patched_live/'+JB),feeder(JB)[0]);}catch(e){console.log(R,pre||'main','SKIP build',String(e.message).slice(0,80));continue;}
 const S=harness(R,{[JB]:B.map(j=>({json:j.json||j}))});const inR=pre+'Judge Enforcer Call deepseek';let b,l,p;
 try{b=S(rf('pkgETC/patched_on_pkgEPS_patched_live/'+JR),inR);l=S(rf('pkgEPD/patched_live/'+JR),inR);p=S(rf('pkgEPD/patched/'+JR),inR);}catch(e){console.log(R,pre||'main','SKIP record',String(e.message).slice(0,80));continue;}
 const br=b[0].json.enf428_rows||[],lr=l[0].json.enf428_rows||[],pr=p[0].json.enf428_rows||[];say(br.length===lr.length&&br.length===pr.length,R+' counts');let n=0,h=0;
 br.forEach((x,i)=>{const L=lr[i],P=pr[i];say(JSON.stringify({...x,cure_reason:0})===JSON.stringify({...L,cure_reason:0})&&JSON.stringify({...x,cure_reason:0})===JSON.stringify({...P,cure_reason:0}),R+' row '+i+' fields');
  if(/^ENFORCER HELD \(pkgEPS/.test(x.cure_reason))h++;
  if(x.cure_reason!==L.cure_reason){n++;say(/^ENFORCER HELD \(pkgEPS/.test(x.cure_reason)&&/^ENFORCER DISAGREE/.test(L.cure_reason)&&/TRIAL pkgEPD would send/.test(P.cure_reason),R+' lift form');lifts.push({run:R,chain:pre||'main',seat:x.seat,item:x.item,why:L.cure_reason.slice(0,240)});}
  else say(x.cure_reason===P.cure_reason,R+' TRIAL changed a row EPD does not lift');});
 heldBase+=h;console.log(R,(pre||'main').padEnd(5),'EPS held',h,'EPD lifts',n);}
for(const x of lifts)console.log('LIFT',x.run,x.chain,x.seat,x.item,'|',x.why);
console.log(ok+' OK, '+bad+' FAIL; EPS held '+heldBase+', EPD lifts '+lifts.length);
