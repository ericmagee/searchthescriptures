// Offline check: the patched kwLines421 (from patched Panel Payloads) against wpf.cjs and against the live kwLines421.
const fs=require('fs');const {run}=require('../wpf.cjs');
const plan=JSON.parse(fs.readFileSync('patch_plan.json','utf8'));
const pick=(c,name)=>{const i=c.indexOf('function '+name+'(');const j=c.indexOf('\nfunction ',i+10);return c.slice(i,j<0?undefined:j);};
const pp=fs.readFileSync('kw_new.js','utf8');
const NEW=new Function(pick(pp,'kwLines421')+'\n'+pick(pp,'wpLines2024')+'\nreturn kwLines421;')();
const OLDsrc=fs.readFileSync('kw_old.js','utf8');
const OLD=new Function(OLDsrc+'\nreturn kwLines421;')();
let bad=0;
for(const id of ['32643','32677','32717','32791','32905']){const f=JSON.parse(fs.readFileSync(`../fixtures/${id}.json`,'utf8'));
 const R={CR1:f.cr1,DR1:f.gr1,CR2:f.cr2,DR2:f.gr2,CR3:f.cr3,DR3:f.dr3,CR4:f.cr4,DR4:f.dr4};
 const a=NEW('',R),o=OLD('',R),w=run(f).flags;
 const added=a.items.slice(o.items.length);const same=JSON.stringify(a.items.slice(0,o.items.length))===JSON.stringify(o.items);
 const ok=same&&added.length===w.length;if(!ok)bad++;
 console.log(`${id}: K-W before ${o.items.length}, after ${a.items.length}, old items unchanged ${same}, new ${added.length}, wpf.cjs flags ${w.length} ${ok?'OK':'MISMATCH'}`);
 added.forEach(x=>console.log('   ',x.link,'|',x.line.slice(0,230)));}
for(const [k,line,exp] of [['S1','Matthew 1:19 shows Joseph as a man who knew her within the espousal.',0],['S2',"Matthew 1:19 shows that Joseph knew the child was another's.",1]]){
 const f=JSON.parse(fs.readFileSync('../fixtures/32905.json','utf8'));const R={CR1:f.cr1,DR1:f.gr1,CR2:f.cr2,DR2:f.gr2,CR3:f.cr3,DR3:f.dr3,CR4:line,DR4:f.dr4};
 const n=NEW('',R).items.length-OLD('',R).items.length;if(n!==exp)bad++;console.log(`${k}: new ${n}, expected ${exp} ${n===exp?'OK':'FAIL'}`);}
console.log(bad?`FAIL ${bad}`:'ALL OK');
