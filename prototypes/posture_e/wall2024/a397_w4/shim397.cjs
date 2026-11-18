// ASK 397 shim: LAY.scan of the live library (base) and the ASK 397 target, loaded from the rebuilt "Send Back Build" stub, over every stored judgment.
// Answer text per debate from debate_results (all round columns); run6 reads the two sides joined, so the side mapping does not change the result.
const fs=require('fs');const T=require('../tools/lib.cjs');
const ld=f=>{const U=T.unpack(JSON.parse(fs.readFileSync(f)));return T.load(T.rb(U.L,U.M['Send Back Build']));};
const A=ld('rdf/fresh_eng_pre397.json'),Z=ld('a397/t397.json');
const J=JSON.parse(fs.readFileSync('a394/judall.json')),RN=JSON.parse(fs.readFileSync('a397/rounds_all.json'));
const tx=r=>String(r||'').replace(/\\n/g,'\n').replace(/\\"/g,'"');
let ctx={};try{ctx=Z.ECL.ctxLive();}catch(e){}
let bad=0,nj=0,withNew=0,tot=0,maxSeat=0;const per=[];const kinds={};
for(const j of J){const d=RN[j.debate_id];if(!d)continue;nj++;
 const R={DR1:d.claude_r1,CR1:d.engine_r1,DR2:d.claude_r2,CR2:d.engine_r2,DR3:d.engine_r3,CR3:d.challenger_r3,DR4:d.defender_r4,CR4:d.challenger_r4};for(const k of Object.keys(R))if(R[k]==null)delete R[k];
 const t=tx(j.verdict_raw).split('\n').filter(l=>!/^\s*\[(?:AUDIT|EXTRACTOR)\b/.test(l)).join('\n');
 const a=A.LAY.scan(t,R,ctx),z=Z.LAY.scan(t,R,ctx);const zo=z.filter(x=>!x.ls397),zn=z.filter(x=>x.ls397);
 if(JSON.stringify(a)!==JSON.stringify(zo)){bad++;console.log('OLD ITEMS DIFFER judgment',j.id);}
 if(zn.length){withNew++;tot+=zn.length;maxSeat=Math.max(maxSeat,zn.length);per.push([j.id,j.judge_seat,zn.map(x=>x.label).join(' ')]);}}
console.log('judgments read',nj,'| existing items equal in every judgment:',bad===0,'(differ '+bad+')');
console.log('judgments with new items',withNew,'| new items',tot,'| most in one judgment',maxSeat);
fs.writeFileSync('a397/shim397_out.txt',per.map(p=>p.join('\t')).join('\n'));
const bySeat={};per.forEach(([,s,l])=>{bySeat[s]=(bySeat[s]||0)+l.split(' ').length});console.log('new items by seat',JSON.stringify(bySeat));
