// F10b harness (Worker_E): the review-lines block of Build Save Body (from "const RVW=" to "const RN=") run on a stored independent_verdict_raw.
const fs=require('fs');const [,,dir,rowFile]=process.argv;const src=fs.readFileSync(dir+'/Build_Save_Body.js','utf8');
const a=src.indexOf('const RVW=');const b=src.indexOf('const RN=FF.length');const seg=src.slice(a,b);
const row=JSON.parse(fs.readFileSync(rowFile,'utf8'));const raw=process.argv[4]==='nocure'?String(row.independent_verdict_raw).replace(/\[AUDIT v21: DEBATE RULE VIOLATION REPORT[^\]\n]*\]/g,''):row.independent_verdict_raw;
const FF=new Function('d','FF',seg+'\nreturn FF;')({independent_verdict_raw:raw},[]);
FF.forEach(x=>console.log(x.slice(0,150)+' ... '+x.slice(-70)));
