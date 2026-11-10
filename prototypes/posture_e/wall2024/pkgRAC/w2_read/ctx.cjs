// prints each anti-cheat pair with the text around both quotations in their rounds. node pkgRAC/w2_read/ctx.cjs [n,n,...] [width]
const fs=require('fs');const P=require('./pairs.json');const IN='/mnt/project-files/wall2024/inputs/';const RK={CR1:'cr1',CR2:'cr2',CR3:'cr3',CR4:'cr4',DR1:'gr1',DR2:'gr2',DR3:'dr3',DR4:'dr4'};
const fin=r=>{const x=JSON.parse(fs.readFileSync(IN+r+'_Final_Output.json','utf8'));const y=Array.isArray(x)?x[x.length-1]:x;return ((y.data&&y.data.main)||y.main)[0].slice(-1)[0].json;};
const want=(process.argv[2]||'').split(',').filter(Boolean).map(Number);const W=+(process.argv[3]||500);
const N=s=>String(s).replace(/[“”]/g,'"').replace(/[’‘]/g,"'");
P.forEach((p,ix)=>{p.k=ix+1;});for(const p of P){if(want.length&&!want.includes(p.k))continue;const F=fin(p.run);
 const show=(q,rk)=>{const T=N(F[RK[rk]]||'');const qq=N(q).replace(/\s*\.\.\.\s*|…/g,'|').split('|')[0].slice(0,40);let i=T.indexOf(qq);if(i<0)i=T.toLowerCase().indexOf(qq.toLowerCase());return i<0?'[not found: '+qq+']':T.slice(Math.max(0,i-W),i+qq.length+W);};
 console.log('\n==================== #'+p.k+' '+p.run+' '+p.id+' '+p.side+' (anti-cheat verse '+p.why+')');
 console.log('--- EARLIER '+p.earlier_round+': "'+p.earlier_q+'"\n'+show(p.earlier_q,p.earlier_round));
 console.log('--- CLOSING '+p.closing_round+': "'+p.closing_q+'"\n'+show(p.closing_q,p.closing_round));}
