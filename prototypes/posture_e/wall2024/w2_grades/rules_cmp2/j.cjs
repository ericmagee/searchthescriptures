const fs=require('fs');const D='/mnt/project-files/wall2024/';const X=JSON.parse(fs.readFileSync(D+'fetchback_live_s145.json','utf8'));const W=(X.data||X).workflow||(X.data||X);
const c=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const LIB=JSON.parse(c.slice(c.indexOf('\n/*LIB*/')+8,c.lastIndexOf('\n/*MAP*/')));
const cand=LIB.map((l,i)=>[i,l.length,/Commitment 1\b|COMMITMENT 1\b/i.test(l)&&/15/.test(l)]).filter(x=>x[2]&&x[1]>5000);console.log('JAGR candidates',cand.map(x=>x[0]+':'+x[1]).join(' '));
const j=LIB[cand.length?cand[0][0]:2974];
const T={'UNPROVEN':/UNPROVEN/,'PRESSED WITH':/PRESSED WITH/,'verbatim':/verbatim/i,'NEW IN CLOSE':/NEW IN CLOSE/i,'NOT COUNTED':/NOT COUNTED/,'another verse':/another verse|ARE AT/i,'citation':/citation/i,'reference':/reference/i};
for(const [k,re] of Object.entries(T))console.log(k.padEnd(14),'JAGR:',(j.match(new RegExp(re.source,re.flags+'g'))||[]).length);
const ea=LIB.find(l=>/RULE E-ANS/.test(l));const m=[...ea.matchAll(/[^.]*reference[^.]*\./gi)].map(x=>x[0].trim());console.log('E-ANS reference sentences:',m);
const vr=LIB.find(l=>/RULE E-VOID/.test(l));console.log('E-VOID len',vr.length,'| quote mentions:',[...vr.matchAll(/[^.]*quote[^.]*\./gi)].map(x=>x[0].trim().slice(0,200)));
const u=require('../../agree_scan/uniq.json');u.filter(r=>/^E-(COL|HOLD)/.test(r.rule)&&/UNPROVEN/.test(r.fl+r.cr)).forEach(r=>console.log('UNPROVEN row',r.run,r.seat,r.rule,(r.cr||'').slice(0,160)));
