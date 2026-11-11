const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const P='/mnt/project-files/wall2024/';
const S=L(P+'fetchback_live_s120.json'),E=L(P+'parent_s120_EHF2.json'),J=L(P+'joint_s120_VP1B_KWN_G4Mr2_EHF2.json'),J0=L(P+'joint_s120_VP1B_KWN_G4Mr2.json');
const RD=JSON.parse(fs.readFileSync(P+'ex34852_full.json','utf8')).data.resultData.runData;
const txt=o=>Array.isArray(o)?o.map(i=>JSON.stringify(i.json||i)):[];
const cnt=(s,p)=>s.split(p).length-1;
(async()=>{const N='Send Back Build';const a=txt(await run(S.code(N),N,RD)),b=txt(await run(E.code(N),N,RD)),c=txt(await run(J.code(N),N,RD));
const st=RD[N][0].data.main[0].map(i=>JSON.stringify(i.json));
for(let i=0;i<a.length;i++){const s=JSON.parse(a[i]).seat;console.log(s,'| live==stored',a[i]===st[i],'| "gate asks for it" live',cnt(a[i],'gate asks for it'),'EHF2',cnt(b[i],'gate asks for it'),'joint',cnt(c[i],'gate asks for it'),'| FORCED form live',cnt(a[i],'FORCED: <Dn vs Cm>'),'EHF2',cnt(b[i],'FORCED: <Dn vs Cm>'),'| len live',a[i].length,'EHF2',b[i].length,'diff',b[i].length-a[i].length,'| joint==EHF2',c[i]===b[i]);}
for(let i=0;i<b.length;i++){const k=b[i].indexOf('ITEM S7');if(k>=0)console.log('S7 seat',JSON.parse(b[i]).seat,':',b[i].slice(k,k+2500).replace(/\\\\n/g,' ').match(/CHANGE TO the BROKEN line[^]{0,300}/)?.[0]);}
let tot=0;for(let i=0;i<a.length;i++)tot+=b[i].length-a[i].length;console.log('prompt delta all seats (JSON chars)',tot);
})();
(async()=>{await new Promise(r=>setTimeout(r,50));const N='Send Back Build';const g=o=>o.map(i=>i.json||i);const a=g(await run(S.code(N),N,RD)),b=g(await run(E.code(N),N,RD));
const strs=o=>{let n=0;const w=v=>{if(typeof v==='string')n+=v.length;else if(v&&typeof v==='object')Object.values(v).forEach(w);};w(o);return n;};
let t=0;for(let i=0;i<a.length;i++){const d=strs(b[i])-strs(a[i]);t+=d;console.log('text delta',a[i].seat,d);}console.log('text delta total',t);
let i=-1;const s=JSON.stringify(b[1]);while((i=s.indexOf('with its FORCED line',i+1))>=0)console.log('3115 form:',s.slice(i-200,i+60).replace(/\\\\n/g,' '));})();
