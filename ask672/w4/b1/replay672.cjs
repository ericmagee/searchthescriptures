const fs=require('fs');const D=process.argv[2];
const VP4N0=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const OLD=eval('(()=>{'+fs.readFileSync(__dirname+'/old_vp524.js','utf8')+';return vp524Verses;})()');
const NEW=eval('(()=>{'+fs.readFileSync(__dirname+'/new_vp524.js','utf8')+';return vp524Verses;})()');
const R=f=>fs.readFileSync(D+'/'+f+'.txt','utf8');
const key=v=>v.ref+'|'+VP4N0(v.w);
let lost=0;
for(const f of ['cr1','cr2','cr3','dr1','dr2','dr3']){const o=OLD([R(f)]),n=NEW([R(f)]);const ns=new Set(n.map(key));
 const l=o.filter(v=>!ns.has(key(v)));lost+=l.length;
 console.log(f,'old',o.length,'new',n.length,'old-not-in-new',l.length);}
const C=NEW([R('cr1'),R('cr2'),R('cr3')]),V=' '+C.map(v=>VP4N0(v.w)).join(' | ')+' ';
for(const q of ['Behold, a virgin shall be with child, and shall bring forth a son','To a virgin espoused to a man'])console.log('GOOD challenger list holds:',q,V.includes(' '+VP4N0(q)+' '));
const bad=['D5 vs C6 (Matthew 1:23): DEFENDER LINK BROKEN -- MISSES (Commitment 7) -- x','The Son is called "thy father" (*patḗr*, G3962) in that verse','[L4] Rebutting [CR1] "Luke qualifies son of Joseph with as was supposed, and John reports":','ANSWER CHECK: Luke 1:35 -- [CR3] -- MEANS: "the angel answers Mary\'s how with the Holy Ghost" -- ANSWER: "The therefore" -- MISSES'];
for(const b of bad)console.log('BAD new matches:',NEW([b]).length,'|',b.slice(0,60));
console.log('LOST TOTAL',lost);
