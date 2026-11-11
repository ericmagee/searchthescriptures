// W2 second reading of W1 Wall 5028 item 3 and Wall 5033 A: clause presence on live s145, and stored rows
const fs=require('fs');const D='/mnt/project-files/wall2024/';const X=JSON.parse(fs.readFileSync(D+'fetchback_live_s145.json','utf8'));const W=(X.data||X).workflow||(X.data||X);
const c=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const LIB=JSON.parse(c.slice(c.indexOf('\n/*LIB*/')+8,c.lastIndexOf('\n/*MAP*/')));
const ri=LIB.findIndex(l=>/RULE E-VOID/.test(l));const rules=LIB.filter(l=>/RULE E-[A-Z0-9]+/.test(l)).join('\n');const jagr=LIB.find(l=>/Commitment 15|COMMITMENT 15/i.test(l))||'';
console.log('RULE lines',LIB.map((l,i)=>/RULE E-[A-Z0-9]+/.test(l)?i:-1).filter(i=>i>=0).join(','),'rules chars',rules.length,'JAGR chars',jagr.length);
const T={'UNPROVEN':/UNPROVEN/,'PRESSED WITH':/PRESSED WITH/,'verbatim':/verbatim/i,'NEW IN CLOSE':/NEW IN CLOSE/i,'NOT COUNTED':/NOT COUNTED/,'another verse / ARE AT':/another verse|ARE AT/i,'citation error':/citation error|citation/i,'without its reference':/without (?:its|the) reference|reference/i};
for(const [k,re] of Object.entries(T)){const rl=rules.split('\n').filter(l=>re.test(l)).map(l=>(l.match(/RULE E-[A-Z0-9]+/g)||[]).join('/'));console.log(k.padEnd(22),'RULES:',rl.length?rl.join(' '):0,'| JAGR:',re.test(jagr)?'yes':'no');}
const u=require('../../agree_scan/uniq.json');const E=u.filter(r=>/^E-/.test(r.rule));const dis=r=>/ENFORCER DISAGREE/.test(r.cr||'');
const by=(re,rules)=>E.filter(r=>rules.includes(r.rule.split(' ')[0])&&re.test((r.fl||'')+' '+(r.cr||'')+' '+(r.item||'')));
const pr=(t,a)=>{console.log('\n'+t,a.length,'(DISAGREE',a.filter(dis).length+')');a.filter(dis).forEach(r=>console.log('  D',r.run,r.seat,r.rule,'|',(r.fl||'').slice(0,160),'||',(r.cr||'').slice(0,200)));};
pr('E-VOID all DISAGREE',E.filter(r=>r.rule.startsWith('E-VOID')&&dis(r)));
pr('E-VOID/E-PREM rows naming verbatim/no quote',by(/verbatim|no quote|not quoted|quote not found/i,['E-VOID','E-PREM']));
pr('E-VOID/E-PREM rows naming PRESSED WITH',by(/PRESSED WITH/i,['E-VOID','E-PREM']));
pr('E-COL/E-HOLD rows naming UNPROVEN',by(/UNPROVEN/,['E-COL','E-HOLD']));
pr('E-ANS/E-COL rows naming citation/reference/another verse',by(/citation|cited at|another verse|without (?:its|the|a) reference|wrong verse|ARE AT/i,['E-ANS','E-COL']));
pr('E-ANS rows naming CR4/DR4/close',by(/\[(?:CR|DR)4\]|NEW IN CLOSE|closing round|in (?:its|the) close/i,['E-ANS']));
