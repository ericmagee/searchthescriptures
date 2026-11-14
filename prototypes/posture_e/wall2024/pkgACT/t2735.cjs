const L=require('../bfx/lib.cjs');const fs=require('fs');
const lib=f=>{const W=JSON.parse(fs.readFileSync(f,'utf8'));const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;return JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));};
const O=lib('../nrw/target.json'),N=lib('./target.json');
// 273
const mkR=LB=>new Function(LB[1890]+'\n'+LB[1891]+'\nreturn rounds;')();
const txt='=== [DR1] CHALLENGER R1 ===\nCommitment 15. My keystone stands.\n\n[COUNT LIST NOTE -- computed by the system (pkgCLN, ASK 269): every count ...]\n=== [CR2] X ===\nbody2\n\n[CLOSE-ROUND PRESS CHECK x]';
console.log('273 old',JSON.stringify(mkR(O)(txt)));console.log('273 new',JSON.stringify(mkR(N)(txt)));
// 275
const pick=LB=>s=>{const m=s.match(/\b(defender|challenger)\b[^.;:]{0,60}?\b(withdr(?:ew|awn|aws)|conced(?:ed|es)|grant(?:ed|s)|dropp?(?:ed|s)|narrow(?:ed|s))\b/i);if(!m)return null;const line=LB[3159];const i=line.indexOf('const sd=')>=0?line.indexOf('const __pv')>=0?line.indexOf('const __pv'):line.indexOf('const sd='):-1;const e=line.indexOf("'C';",i)+4;return new Function('s','m',line.slice(i,e)+'return sd;')(s,m);};
for(const s of ["The challenger's close restated C1-C6 and listed the defender's grants.","The defender granted that a sign can be a child of ordinary begetting.","The challenger conceded C3 to the defender.","The defender granted the challenger's point on Luke 1:27.","The challenger pressed the defender, who narrowed D6."])console.log('275',pick(O)(s),pick(N)(s),'|',s);
{const R=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).result;const a0=R.indexOf('\n[{"j":')+1,a1=R.lastIndexOf(']\n</untrusted')+1;const X=JSON.parse(R.slice(a0,a1))[0].j;
let n=0,ch=0;for(const x of X){const s=x.f;const a=pick(O)(s),b=pick(N)(s);if(a==null)continue;n++;if(a!==b){ch++;console.log('CHANGED',a,'->',b,'|',x.item,'|',s.slice(0,260));}}console.log('E-SYN rows',X.length,'picked',n,'changed',ch);}
