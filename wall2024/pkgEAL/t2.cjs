const fs=require('fs');const lib=f=>{const W=JSON.parse(fs.readFileSync(f,'utf8'));const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;return JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));};
const L0=lib(__dirname+'/../w287/fresh_s205.json'),L1=lib(__dirname+'/target.json');const R=JSON.parse(fs.readFileSync(__dirname+'/../a287/runs.json','utf8'));
const run=(L,judges)=>new Function('judges',L.slice(240,329).join('\n')+'\n'+L[2976]+'\n'+L[2977]+'\nconst AG=[];const __FC={};\n'+L.slice(2979,2983).join('\n')+'\nreturn AG;')(judges);
for(const [t,{j}] of Object.entries(R)){const judges=j.map(x=>({seat:x.judge_seat,t:String(x.verdict_raw).replace(/\\n/g,'\n').replace(/\\"/g,'"')}));
 const a=run(L0,judges),b=run(L1,judges);const per=AG=>{const c={};AG.forEach(g=>g.grades.forEach(x=>c[x.seat]=(c[x.seat]||0)+1));return JSON.stringify(c);};
 const same=a.every(g=>{const h=b.find(x=>x.key===g.key);return h&&JSON.stringify(h)===JSON.stringify(g);});
 console.log(t.slice(5,10),'groups',a.length,'->',b.length,'grades per seat',per(a),'->',per(b),'old groups byte-equal',same);
 const nw=b.filter(g=>!a.find(x=>x.key===g.key));for(const g of nw.slice(0,2))console.log('  new',JSON.stringify({v:g.verse,rk:g.rk,means:g.means.slice(0,80),ans:g.answer.slice(0,50),gr:g.grades.map(x=>x.seat+':'+x.grade)}));}
{const {j}=R['ODV1-37113-vaaf3hwh'];const judges=j.map(x=>({seat:x.judge_seat,t:String(x.verdict_raw).replace(/\\n/g,'\n').replace(/\\"/g,'"')}));const a=run(L0,judges),b=run(L1,judges);let pre=0,grown=0;
for(const g of a){const h=b.find(x=>x.key===g.key);const {grades:g1,...r1}=g,{grades:g2,...r2}=h;if(JSON.stringify(r1)===JSON.stringify(r2)&&JSON.stringify(g2.slice(0,g1.length))===JSON.stringify(g1)){pre++;if(g2.length>g1.length)grown++;}}console.log('37113 old groups: fields equal and grades prefix-kept',pre,'of',a.length,'; grown by sol/luna grades',grown);}
