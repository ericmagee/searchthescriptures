const fs=require('fs');const W='/home/claude/searchthescriptures/prototypes/posture_e/wall2024';const {harness}=require(W+'/pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const code=(f,n)=>(j=>j.data||j.workflow||j)(JSON.parse(fs.readFileSync(f,'utf8'))).nodes.find(x=>x.name===n).parameters.jsCode;
const A=code('/mnt/project-files/wall2024/fetchback_live_s87.json','Alternate Merge');
const SR=new Set(['panel','reserve','alternate','single','synthesis']),KD=new Set(['cure','alternate_reply','failed_reply','enforcer_check','send_back']);
(async()=>{let runs=0,ok=0,rows=0;const REP={};const bad=[];const shapes={};
for(const f of fs.readdirSync(D).filter(f=>/^\d+_Alternate_Merge\.json$/.test(f))){const RUN=f.split('_')[0];runs++;
 let o;try{o=await harness(RUN,{})('return (async()=>{\n'+A+'\n})();','Alternate Merge');}catch(e){console.log(RUN,'offline error',String(e.message).slice(0,90));continue;}
 const L=(o&&o[0]&&o[0].json&&o[0].json.enforcer_log)||[];ok++;rows+=L.length;
 for(const r of L){const k=(r.seat_role)+"|"+(r.kind||"cure")+"|"+r.cure_status+"|"+(r.at==null?"noat":"at");if(!REP[k])REP[k]=Object.fromEntries(Object.entries(r).map(([a,b])=>[a,typeof b==="string"?b.slice(0,40):b]));shapes[k]=(shapes[k]||0)+1;
  const at=r.at;const atBad=at!=null&&at!==''&&isNaN(Date.parse(at));
  if((r.seat_role!=null&&!SR.has(r.seat_role))||!KD.has(r.kind||'cure')||!(r.cure_status==null||r.cure_status==='CURED'||r.cure_status==='UNCURED')||atBad)bad.push(RUN+' '+JSON.stringify({seat:r.seat,seat_role:r.seat_role,kind:r.kind,rule:r.rule,cure_status:r.cure_status,at}));}
 console.log(RUN,'rows',L.length);}
console.log('runs',runs,'ran',ok,'rows',rows,'bad',bad.length);console.log(bad.slice(0,20).join('\n'));console.log(JSON.stringify(shapes,null,0));fs.writeFileSync(process.env.OUT,JSON.stringify(Object.values(REP)));})();
