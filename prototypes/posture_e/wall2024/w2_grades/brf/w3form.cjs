const fs=require('fs');const src=fs.readFileSync(__dirname+'/run_brf.cjs','utf8');eval(src.slice(0,src.indexOf('const of=(h,p)'))+';globalThis.H=H;');
const F={gr1:'Matthew 1:18 tells of the espousal.',gr2:'y',dr3:'x',dr4:'Numbers 1:2 and 1:18 show the register.'};
for(const t of ['live','cand'])console.log(t,JSON.stringify(H[t+'|Build Synthesis'].C4P.of(F)),JSON.stringify(H[t+'|Build Synthesis'].REFP.parse(F.dr4,{scoped:true}).map(r=>[r.book,r.ctx,r.label])));
