// rev 2 test on the REBUILT stub source, in the node's own line order (W2 6420 method).
const fs=require('fs');const src=(f,node)=>{const W=JSON.parse(fs.readFileSync(f,'utf8'));const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')));return M[node].p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n').split('\n');};
const R=JSON.parse(fs.readFileSync(__dirname+'/../a287/runs.json','utf8'));
for(const node of ['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build']){
 const seg=f=>{const s=src(f,node);const a=s.findIndex(l=>l.startsWith('const N=s=>String(s||\'\').toLowerCase().replace(/[“”"’‘\'*_`\\[\\]]/g'));const b=s.findIndex((l,i)=>i>a&&l.startsWith(' if(m[5]===\'FAILS\')'));if(a<0||b<0||b-a>8)throw new Error(node+' segment '+a+' '+b);const ac2=s.findIndex(l=>l.includes('const __ac2='));const use=s.findIndex(l=>l.includes('__ac2(l)'));const rl=s.findIndex(l=>/^const __RL=/.test(l));return {code:s.slice(a,b+1).join('\n'),a,ac2,use,rl,n:s.length};};
 const o=seg(__dirname+'/../w287/fresh_s205.json'),n=seg(__dirname+'/target.json');
 console.log(node,'| stub lines',n.n,'| segment at',n.a,'| __ac2 declared line',n.ac2,'used line',n.use,'| __RL declared line',n.rl,'| new code reads __RL:',/__RL/.test(n.code));
 const run=c=>judges=>new Function('judges','const AG=[];const __FC={};\n'+c.replace('const AG=[];const __FC={};','')+'\nreturn AG;')(judges);
 for(const [t,{j}] of Object.entries(R)){const judges=j.map(x=>({seat:x.judge_seat,t:String(x.verdict_raw).replace(/\\n/g,'\n').replace(/\\"/g,'"')}));const A=run(o.code)(judges),B=run(n.code)(judges);
  const per=AG=>{const c={};AG.forEach(g=>g.grades.forEach(x=>c[x.seat]=(c[x.seat]||0)+1));return JSON.stringify(c);};
  let keep=0;for(const g of A){const h=B.find(x=>x.key===g.key);const {grades:g1,...r1}=g,{grades:g2,...r2}=h||{grades:[]};if(h&&JSON.stringify(r1)===JSON.stringify(r2)&&JSON.stringify(g2.slice(0,g1.length))===JSON.stringify(g1))keep++;}
  console.log('  ',t.slice(5,10),'groups',A.length,'->',B.length,per(A),'->',per(B),'old groups kept',keep+'/'+A.length);}}
