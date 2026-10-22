// pre-write check (not a test): cure matcher of new11 on stored 27893 text
const fs=require('fs');const [,,dir,rowFile]=process.argv;
const s0=fs.readFileSync(dir+'/Cure_Check.js','utf8').split('\n');const e=s0.findIndex(l=>l.startsWith('function cureProse'));
const L=new Function(s0.slice(0,e+2).join('\n')+'\nreturn {cureFound,cureFoundAll,cureText};')();
const j=JSON.parse(fs.readFileSync(rowFile,'utf8'));
const DR1=j.cha_r1;
const g=j.judges.find(x=>x.seat==='grok').verdict_raw;
const m=g.match(/PRESSED: D6 vs C1 \| \(DR1\) \| ([\s\S]*?) \/ SHORT:/);
console.log('pressed segment found:',!!m);
const seg=m?m[1]:'';
console.log('SEGMENT:',JSON.stringify(seg).slice(0,700));
const quotes=[...seg.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map(x=>x[1]);
console.log('n top-level quoted pieces:',quotes.length);
console.log('cureFoundAll(seg,DR1)=',JSON.stringify(L.cureFoundAll?L.cureFoundAll(seg,DR1):null));
for(const q of [seg]){console.log('cureFound(seg)=',L.cureFound(seg,DR1));}
const raw1="Matthew 1:22-23 quotes Isaiah 7:14";const raw2="Matthew 1:22–23 quotes Isaiah 7:14";
console.log('hyphen form in DR1:',DR1.includes(raw1),' en-dash form in DR1:',DR1.includes(raw2));
console.log('backslash-quote in grok row text:',g.includes('\\"'));
const q=quotes;const un=s=>s.replace(/\\"/g,'"');const dash=s=>s.replace(/1:22-23/g,'1:22–23');
const cases={q1_stored:q[0],q1_unescaped:un(q[0]),q1_unescaped_endash:dash(un(q[0])),q2_stored:q[1],q2_unescaped:un(q[1])};
for(const [k,v] of Object.entries(cases))console.log(k,'=>',L.cureFound('"'+v+'"',DR1),L.cureFoundAll('"'+v+'"',DR1));
console.log('grok cure line as passed above relies on stored text; deepseek quote form:',/Matthew 1:22–23 quotes Isaiah/.test(j.judges.find(x=>x.seat==='deepseek').verdict_raw));
