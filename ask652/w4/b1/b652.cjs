// ASK 652 build (W4), on the ASK 651 target: the premise reader skips a reference that PRS.premise did not class as a pressed verse (PRSP.verses) or as a press past its cap (PRSP.over). D4 Build, Panel Build, Build Independent Verdict. node b652.cjs in_651_target.json out_target.json
const fs=require('fs');const [,,BE,OUT]=process.argv;const E=JSON.parse(fs.readFileSync(BE,'utf8'));
const A="for(const r of refs(xw)){const label=((r.book||r.ctx)?((r.book||r.ctx)+' '):'')+r.label;";
const INS="if(PRSP&&!r.cvs.some(cv=>{const z=(r.book||r.ctx||'')+' '+cv;return PRSP.verses.some(v=>v.key===z)||(PRSP.over||[]).includes(z);}))continue; /* ASK 652: a verse inside a press line ([L3], MEANS) is not a press: not labelled, not counted to the cap */";
for(const nm of ['D4 Build','Panel Build','Build Independent Verdict']){const n=E.nodes.find(k=>k.name===nm);const s=n.parameters.jsCode;
 if(s.split(A).length!==2)throw new Error('ASK 652 build: anchor not found exactly once in '+nm);
 const i=s.indexOf(A);if(s.lastIndexOf('const PRSP=',i)<0||i-s.lastIndexOf('const PRSP=',i)>1000)throw new Error('ASK 652 build: PRSP not defined just before the loop in '+nm);
 n.parameters.jsCode=s.replace(A,()=>A+INS);}
fs.writeFileSync(OUT,JSON.stringify(E));console.log('ASK 652 built:',OUT);
