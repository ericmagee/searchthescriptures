// C1: PART2 once under the label, the "do not judge" instruction unchanged; the label text evaluates to the post-A PART2.
const fs=require('fs');const live=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).workflow;const LN={};live.nodes.forEach(n=>LN[n.name]=n.parameters.jsCode);
const A=fs.readFileSync('../pkgA/patched/Accept_Check.js','utf8');const i=A.indexOf('const POSTURE=(()=>{'),j=A.indexOf('return {PART2,HEADS',i),k=A.indexOf('})();',j);const P2=new Function(A.slice(i,k+5)+'\nreturn POSTURE.PART2;')();
let fail=0;for(const n of ['Enforcer Build','Judge Enforcer Build','Anticheat Build']){const s=fs.readFileSync('patched/'+n.replace(/ /g,'_')+'.js','utf8');
 const ja=new Function(s.split('\n')[0]+'\nreturn __JAGR;')();
 const sysOld=(LN[n].match(/const SYS='[^\n]*?';/)||[''])[0],sysNew=(s.match(/const SYS='[^\n]*?';/)||[''])[0];
 const c1=ja.endsWith(P2)&&ja.split('### Commitment 10.').length===2&&/THE JUDGES' AGREEMENT \(what you enforce; not your posture\)/.test(ja)&&sysOld&&sysOld===sysNew&&s.slice(s.indexOf('\n')+1).replace("content:SYS+__JAGR},","content:SYS},")===LN[n];
 console.log((c1?'OK  ':'FAIL')+' C1 '+n+`: label + PART2 (${P2.length} chars, 10 commitments) once at the end of the system message; SYS unchanged; no other byte changed`);if(!c1)fail++;}
console.log(fail?'FAILED '+fail:'ALL OK');
