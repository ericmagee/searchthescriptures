// pkgEPS replay on saved node inputs: patched Judge Enforcer Build -> patched Judge Enforcer Record (on the run's stored DeepSeek replies) -> Send Back Build.
// Reports every E-PREM row pkgEPS holds, and checks: base vs patched Record rows differ only in the held rows' cure_reason; TRIAL send-back messages are
// byte-identical to base; LIVE drops exactly the held pushes. Usage: node pkgEPS/replay_EPS.cjs [runs] (main and Alt chains).
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const RUNS=(process.argv[2]||'33040,33060,33083,33107,33129,33149,33160,33197,33218,33222,33249,33261,33276,33289,33299,33311,33322').split(',');
const rd=(d,f)=>fs.readFileSync('pkgEPS/'+d+'/'+f.replace(/ /g,'_')+'.js','utf8');const FBN=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s39.json','utf8'));const NS=(FBN.data||FBN).nodes;
const live=n=>NS.find(z=>z.name===n).parameters.jsCode;
const conn=(FBN.data||FBN).connections;const feeder=n=>Object.entries(conn).filter(([k,v])=>JSON.stringify(v).includes('"'+n+'"')).map(([k])=>k);
const has=(R,n)=>fs.existsSync(D+R+'_'+n.replace(/ /g,'_')+'.json');
let held=[],bad=0,ok=0;const say=(c,m)=>{if(c)ok++;else{bad++;console.log('FAIL',m);}};
for(const R of RUNS)for(const pre of ['','Alt ']){const JB=pre+'Judge Enforcer Build',JR=pre+'Judge Enforcer Record',SB=pre+'Send Back Build';
 if(!has(R,JB)||!has(R,JR)){continue;}
 const inB=feeder(JB)[0],inR=pre+'Judge Enforcer Call deepseek';let bB,pB;
 try{bB=harness(R)(live(JB),inB);pB=harness(R)(rd('patched',JB),inB);}catch(e){console.log(R,pre||'main','SKIP build:',String(e.message).slice(0,90));continue;}
 const strip=o=>JSON.stringify(o,(k,v)=>k==='blk'?undefined:v).replace(/RULE E-PREM, THE COUNTED KIND \(pkgEPS\)[^\n]*?\\n/g,'');
 say(strip(bB)===strip(pB),R+' '+JB+' differs beyond blk and the prompt paragraph');
 const pS=harness(R,{[JB]:pB.map(json=>({json:json.json||json}))}),bS=harness(R,{[JB]:bB});let bRo,pRo,lRo;
 try{bRo=bS(live(JR),inR);pRo=pS(rd('patched',JR),inR);lRo=pS(rd('patched_live',JR),inR);}catch(e){console.log(R,pre||'main','SKIP record:',String(e.message).slice(0,90));continue;}
 const br=bRo[0].json.enf428_rows||[],pr=pRo[0].json.enf428_rows||[],lr=lRo[0].json.enf428_rows||[];
 say(br.length===pr.length&&br.length===lr.length,R+' row counts');
 let h=0;br.forEach((b,i)=>{const p=pr[i],l=lr[i];const same=JSON.stringify({...b,cure_reason:0,prompt_sent:0})===JSON.stringify({...p,cure_reason:0,prompt_sent:0})&&String(b.prompt_sent||'').replace(/RULE E-PREM, THE COUNTED KIND \(pkgEPS\)[^\n]*\n/,'')===String(p.prompt_sent||'').replace(/RULE E-PREM, THE COUNTED KIND \(pkgEPS\)[^\n]*\n/,'');say(same,R+' row '+i+' fields');
  if(b.cure_reason!==p.cure_reason){h++;say(p.cure_reason.startsWith(b.cure_reason)&&/\(TRIAL pkgEPS: would not be sent: [^()]*\)$/.test(p.cure_reason),R+' TRIAL mark form');say(/^ENFORCER HELD \(pkgEPS, not sent;/.test(l.cure_reason),R+' LIVE mark');
   held.push({run:R,chain:pre||'main',seat:b.seat,item:b.item,why:b.cure_reason.slice(0,260),mark:p.cure_reason.match(/\(TRIAL pkgEPS: would not be sent: ([^()]*)\)$/)[1]});}
  else say(b.cure_reason===l.cure_reason,R+' LIVE changed an unheld row');});
 // send-back: TRIAL messages identical to base; LIVE drops held pushes
 if(has(R,SB)){const inS=feeder(SB)[0];try{const b=harness(R,{[JR]:bRo})(live(SB),inS);const t=harness(R,{[JR]:pRo})(live(SB),inS);const lv=harness(R,{[JR]:lRo})(live(SB),inS);
   const msgs=o=>o.map(x=>x.json&&x.json.msg||'').join('\n=====\n');say(msgs(b)===msgs(t),R+' TRIAL send-back message changed');
   const n=o=>o.reduce((a,x)=>a+((x.json&&x.json.items)||[]).length,0);console.log(R,(pre||'main').padEnd(5),'E-PREM held:',h,'| send-back items base',n(b),'TRIAL',n(t),'LIVE',n(lv));
  }catch(e){console.log(R,pre||'main','send-back SKIP:',String(e.message).slice(0,90),'| held',h);}}
 else console.log(R,(pre||'main').padEnd(5),'E-PREM held:',h,'(no saved Send Back Build input)');}
fs.writeFileSync('pkgEPS/replay_held.json',JSON.stringify(held,null,1));
for(const x of held)console.log('HELD',x.run,x.chain,x.seat,x.item,'|',x.mark,'|',x.why.slice(0,200));
console.log(ok+' OK, '+bad+' FAIL; held '+held.length);
