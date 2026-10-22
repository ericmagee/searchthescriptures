// F12 harness (Worker_E): the single judge's K-G1 item on D4 vs C3 (27795) through the dir's shared library cureVerdicts, with the reply's
// cure lines rebuilt from the report table line 109 (round tag [DR2]: the stored why, "no quotation found in the named round", is only reached
// after the PRESSED line parsed with a round). Rounds from the stored row. Extra cases in argv[4] (JSON list of {name,items,reply}).
const fs=require('fs');const [,,dir,roundsFile,casesFile]=process.argv;
const libSrc0=fs.readFileSync(dir+'/Cure_Check.js','utf8').split('\n');const __e=libSrc0.findIndex(l=>l.startsWith('function cureProse'));const libSrc=libSrc0.slice(0,__e+2).join('\n');
const L=new Function(libSrc+'\nreturn {cureVerdicts};')();
const X=JSON.parse(fs.readFileSync(roundsFile,'utf8'));const R={CR1:X.cr1,DR1:X.gr1,CR2:X.cr2,DR2:X.gr2,CR3:X.cr3,DR3:X.dr3};
for(const c of JSON.parse(fs.readFileSync(casesFile,'utf8'))){const v=L.cureVerdicts(c.items,{ok:true,text:c.reply},null,R);
 console.log(c.name,'=>',JSON.stringify(v.map(x=>({rule:x.rule,link:x.link,status:x.status,why:x.why}))));}
