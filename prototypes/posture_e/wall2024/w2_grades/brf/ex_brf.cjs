// press note and CR4 note on the stored executions (ex*_full.json), Build Synthesis harness of run_brf.cjs
const fs=require('fs');process.env.QUIET=1;
const src=fs.readFileSync(__dirname+'/run_brf.cjs','utf8');const cut=src.indexOf('const of=(h,p)');eval(src.slice(0,cut)+';globalThis.H=H;');
const h0=H['live|Build Synthesis'],h1=H['cand|Build Synthesis'];
for(const e of (process.env.EX||'33149 33371 33490 33497 34299 34626 34703 34726').split(' ')){let X;try{X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex'+e+'_full.json'));}catch(err){console.log(e,'unreadable');continue;}
 const rd=(X.data||X).resultData.runData;const L=n=>{try{return rd[n][rd[n].length-1].data.main[0][0].json.labelled;}catch(err){return null;}};
 const F={cr1:L('D1 Extract'),gr1:L('C1B Extract'),cr2:L('D2B Extract'),gr2:L('C2B Extract'),cr3:L('D3B Extract'),dr3:L('C3B Extract'),cr4:L('D4B Extract'),dr4:L('C4B Extract')};
 if(Object.values(F).some(v=>v==null)){console.log(e,'missing rounds');continue;}
 console.log(e,'press live',JSON.stringify(h0.C4P.of(F)),'cand',JSON.stringify(h1.C4P.of(F)),'| CR4 live',JSON.stringify(h0.C4P.ofD(F)),'cand',JSON.stringify(h1.C4P.ofD(F)));}
