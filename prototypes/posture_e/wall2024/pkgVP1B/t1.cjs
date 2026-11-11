const fs=require('fs');const K=JSON.parse(fs.readFileSync('keep.json','utf8'));
const mk=file=>{let d=JSON.parse(fs.readFileSync(file));d=d.data||d;d=d.workflow||d;const t=d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
 const L=JSON.parse(t.slice(t.indexOf('\n/*LIB*/')+8,t.lastIndexOf('\n/*MAP*/'))),M=JSON.parse(t.slice(t.lastIndexOf('\n/*MAP*/')+8,t.lastIndexOf('\n/*END*/')));
 const o=[];for(const p of M['Gate Record'].p){if(Array.isArray(p)){if(typeof p[0]==='string')o.push(p[0]);else for(let i=p[0];i<=p[1];i++)o.push(L[i]);}else o.push(L[p]);}let s=o.join('\n');const i=s.lastIndexOf('\nconst PASS=');s=s.slice(0,i)+'\nreturn __H(n=>eval(n));'+s.slice(i);
 return fn=>new Function('$','$input','__H',s)(()=>{throw new Error('no $')},{},fn);};
const live=mk('/mnt/project-files/wall2024/fetchback_live_s119.json'),cand=mk('/mnt/project-files/w3/parent_s119_VP1B.json');
let body=null;const walk=(v,d,seat)=>{if(body||d>6||!v||typeof v!=='object')return;if(Array.isArray(v)){v.forEach(x=>walk(x,d+1,seat));return;}if(v.seat===seat&&v.body&&v.body.messages){body=v.body;return;}for(const k in v)walk(v[k],d+1,seat);};walk(K['Panel Judges Prep'],0,'luna');
const SB=K['Send Back Record'][0].bodies,GR=K['Gate Record'][0].bodies;
const run=(h,T)=>{let out;h(ev=>{const R=ev('ciRounds')(ev('gatePromptText2024')(body));out=ev('gateAnsOpen2024')(T,R).map(x=>x.key);});return out;};
const texts={};['luna','terra','sol'].forEach((s,i)=>{texts['SB '+s]=SB[i];texts['GATE '+s]=GR[i];});
texts['final luna']=fs.readFileSync('luna_final.txt','utf8');
console.log('head',JSON.stringify(SB[0].slice(0,150)));
for(const k in texts){const a=run(live,texts[k]),b=run(cand,texts[k]);console.log('##',k,'\n live:',a.join(' ; ')||'none','\n cand:',b.join(' ; ')||'none');}
module.exports={run,live,cand,texts};
