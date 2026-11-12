// Wall 5200 item D10a: run 35379 close-round new-verse check (D4) named "1 Corinthians 1:18". Rebuild REFP and C4P from live s151 Build Save Body,
// rebuild the rounds from the stored close-enforcer prompt, and trace the flagged reference.
const fs=require('fs');const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s151.json','utf8'));const c=W.nodes.find(n=>n.name==='Build Save Body').parameters.jsCode;
const i0=c.indexOf('const REFP'),i1=c.indexOf('C4P=(()=>{'),i2=c.indexOf('return {',i1);const end=c.indexOf('})();',i2)+5;
const src=c.slice(i0,end);const {REFP,C4P}=new Function(src+'\nreturn {REFP,C4P};')();
const R=require('../../pkgCNP/rounds.cjs')(process.argv[2]);const F=R[Object.keys(R).find(k=>k.includes('35379'))];
console.log('ofD:',C4P.ofD(F));
const t=F.cr4;const j=t.indexOf('1:18 places');console.log('context:',JSON.stringify(t.slice(j-140,j+40)));
for(const r of REFP.parse(t.slice(j-140,j+40),{scoped:true}))console.log(JSON.stringify(r));
// candidate: a reference with no book of its own counts as bare (drop the r.pos>r.at condition)
const src2=src.replace('bare:r.head&&!r.book&&r.pos>r.at','bare:!r.book');if(src2===src)throw new Error('anchor');const X=new Function(src2+'\nreturn {C4P};')().C4P;
const o=X.ofD(F);console.log('candidate ofD:',[...o],'moved to named-earlier list:',o.u);
const t2=t.replace('1:18 places','Matthew 1:18 places');console.log('control, the same close with the book written out (live):',C4P.ofD({...F,cr4:t2}));
