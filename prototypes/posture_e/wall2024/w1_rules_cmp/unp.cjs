const fs=require('fs');const P=JSON.parse(fs.readFileSync('jprompts.json'));const R=JSON.parse(fs.readFileSync('allrows.json'));
const seen=new Set();const U=R.filter(r=>{const k=r.run+r.seat+r.rule+(r.fl||"").slice(0,300)+(r.cr||"").slice(0,200);if(seen.has(k))return false;seen.add(k);return true;});
const refRe=/\b((?:[123] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d+):(\d+)/g;
const led={};
for(const run in P){const L=P[run].split('\n');let side=null;const D={},C={};
 for(const l of L){if(/^AGAINST THE DEFENDER/.test(l))side='D';else if(/^AGAINST THE CHALLENGER/.test(l))side='C';else if(/^CHALLENGER LINK NUMBERS/.test(l))side=null;
  const m=side&&l.match(/^premise (\d+)(?: \(LINK (\d+)\))?:/);if(!m)continue;
  const un=(l.match(/UNPROVEN, not a witness \(ruling 398\): ([^(]*)\(no MEANS/)||[])[1]||'';const unv=[...un.matchAll(refRe)].map(x=>x[1]+' '+x[2]+':'+x[3]);
  const pr=l.slice(l.indexOf('of the proven')>=0?l.indexOf('of the proven'):l.length);const prv=[...pr.split(/over the cap|other verses the premise names/)[0].matchAll(refRe)].map(x=>x[1]+' '+x[2]+':'+x[3]);
  const key=side==='D'?(m[2]||m[1]):m[1];const T=side==='D'?D:C;T[key]=T[key]||{un:new Set(),pr:new Set()};unv.forEach(v=>T[key].un.add(v));prv.forEach(v=>T[key].pr.add(v));}
 led[run]={D,C};}
let hits=0,n=0;
for(const r of U){if(r.rule!=='E-COL'||/^ENFORCER DISAGREE/.test(r.cr||'')||!r.cr)continue;n++;const fl=r.fl||'';const m=fl.match(/D(\d+) vs C(\d+)/);if(!m||!led[r.run])continue;
 const brokeC=/CHALLENGER LINK BROKEN/.test(fl)||(/^FORCED/.test(fl)&&/MEANS \[CR/.test(fl));const T=brokeC?led[r.run].C[m[2]]:led[r.run].D[m[1]];if(!T)continue;
 const head=fl.split(/ -- /).slice(0,2).join(' -- ');const vs=[...head.matchAll(refRe)].map(x=>x[1]+' '+x[2]+':'+x[3]);
 const bad=vs.filter(v=>T.un.has(v)&&!T.pr.has(v));if(bad.length){hits++;console.log('--',r.run,r.seat,brokeC?'C'+m[2]:'D'+m[1],'UNPROVEN:',bad.join(', '),'\n  FL:',fl.slice(0,450).replace(/\n/g,' '),'\n  CR:',(r.cr||'').slice(0,300).replace(/\n/g,' '));}}
console.log('E-COL non-DISAGREE rows',n,'hits',hits);
module.exports=led;
