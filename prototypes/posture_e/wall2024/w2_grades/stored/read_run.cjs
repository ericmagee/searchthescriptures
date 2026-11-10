// W2: read pkgACM, pkgRLF2 and pkgGUB in a stored execution: each node run with live code and with the package taken out; a difference = the package acted.
// usage: node w2_grades/stored/read_run.cjs <exec> <live fetch-back>
const R=require('./node_replay.cjs');const [,, ,LIVE]=process.argv;const fs=require('fs');
const s108='/mnt/project-files/wall2024/fetchback_live_s108.json';
(async()=>{const has=n=>!!R.rd[n];
 // pkgACM
 if(has('Anticheat Record')){const a=(await R.run(R.src(s108,'Anticheat Record'),'Anticheat Record'))[0].json.acx,b=(await R.run(R.src(LIVE,'Anticheat Record'),'Anticheat Record'))[0].json.acx;
  const st=R.out('Anticheat Record')[0][0].json.acx;console.log('ACM: stored rows',(st.rows||[]).length,'no_answer',JSON.stringify(st.no_answer),'| without ACM no_answer',JSON.stringify(a.no_answer),'| live code no_answer',JSON.stringify(b.no_answer),'| live equals stored:',JSON.stringify(b)===JSON.stringify(st));}
 else console.log('ACM: Anticheat Record did not run');
 // pkgRLF2
 if(has('Close Enforcer Record')){const pick=o=>{const j=o[0].json;return JSON.stringify({c:(j.cec||{}).confirmed,r:((j.cec||{}).rows||[]).map(r=>[r.side,r.link,r.status||r.result,String(r.why||'').slice(0,80)])});};
  const a=pick(await R.run(R.src(s108,'Close Enforcer Record'),'Close Enforcer Record')),b=pick(await R.run(R.src(LIVE,'Close Enforcer Record'),'Close Enforcer Record'));
  console.log('RLF2: without RLF2 (s108 node)',a.slice(0,600),'\n      live',b.slice(0,600),'\n      differ:',a!==b);}
 else console.log('RLF2: Close Enforcer Record did not run');
 // pkgGUB
 for(const n of ['Gate Record','Alt Gate Record','R2 Alt Gate Record']){if(!has(n)){console.log('GUB',n,'did not run');continue;}const c=R.src(LIVE,n);const c0=c.replace('const __gub=(r,seat,vr,rs)=>{','const __gub=(r,seat,vr,rs)=>{return true;');if(c0===c){console.log('GUB patch missed',n);continue;}
  const dv=j=>(j.bodies||[]).map(s=>{const p=JSON.parse(s).payload;return p.judge_seat+':'+p.drv_uncured}).join(' ');
  const a=(await R.run(c0,n))[0].json,b=(await R.run(c,n))[0].json;const und=(b.bodies||[]).flatMap(s=>{const p=JSON.parse(s).payload;return String(p.verdict_raw).split('\n').filter(l=>/\(pkgUND\)/.test(l)&&/AUDIT v4\d/.test(l)).map(l=>p.judge_seat+': '+l.slice(0,200));});
  console.log('GUB',n,'| without GUB',dv(a),'| live',dv(b),'| stored',dv(R.out(n)[0][0].json),'| pkgUND count lines',und.length);und.forEach(l=>console.log('    '+l));}})().catch(e=>{console.error(e.stack);process.exit(1)});
