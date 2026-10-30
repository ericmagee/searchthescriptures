// BB-8172 (v), BB-8219 falsifier: a premise verse pressed in [DR1] and answered in [CR2] reads NAMED (base: NOT NAMED); a premise verse
// named nowhere stays NOT NAMED. Judges' ledger (judgeBlock) of Panel Build and Build Independent Verdict, base vs the directory given.
const fs=require('fs'),path=require('path');const ND=process.argv[2]||'new';
const pwl=(dir,nm)=>{const t=fs.readFileSync(path.join(__dirname,dir,nm+'.js'),'utf8');const a=t.indexOf('const PWL=(()=>{');const e=t.indexOf('})();',a);return new Function(t.slice(a,e+5)+'\nreturn PWL;')();};
const F={cr1:'The father is named at Luke 2:48.',gr1:'Luke 3:23 says "as was supposed" of Joseph.',
 cr2:'Luke 3:23 "as was supposed" reports the public view; it names the father.',
 gr2:'Closing.\n\nUNSUPPORTED-L4 PREMISES\n1. LINK 1: the naming rows prove begetting; against Luke 3:23.\n2. LINK 2: the seed rows need a man; against Isaiah 7:14.',
 cr3:'LINK 1: SUPPORTED. The naming rows stand.\nLINK 2: SUPPORTED. The seed rows stand.',dr3:'LINK 1: SUPPORTED.'};
const out={};for(const nm of ['Panel_Build','Build_Independent_Verdict'])for(const d of ['base',ND]){const L=pwl(d,nm).judgeBlock(F).split('\n').filter(l=>/premise|AGAINST THE DEFENDER|answering side|answering link/i.test(l));out[nm+'.'+d]=L.map(l=>l.length>160?l.slice(0,160)+'...':l);}
console.log(JSON.stringify(out,null,1));
