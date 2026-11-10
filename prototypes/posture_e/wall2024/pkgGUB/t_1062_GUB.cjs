// pkgGUB on stored judgment 1062: GCCN rev 2's G1 patch with the pkgGUB filter and line, run on that row's own count line and gate lines.
// UND is a stub that throws, to show the pkgUND rule is not re-run on a line another rule (pkgECF, v41) counted.
const fs=require('fs');const G=fs.readFileSync(__dirname+'/gub_line.js','utf8').trim();
let P=fs.readFileSync(__dirname+'/../pkgGCC/patches/'+(process.env.GUBBASE==='GCCN2'?'G1n2':'G1n3')+'.to','utf8').replace("/^E-APPLY S\\d+$/.test(r.src)&&String(p.verdict_raw)","/^E-APPLY S\\d+$/.test(r.src)&&__gub(r,g.seat,p.verdict_raw,res)&&String(p.verdict_raw)");
if(!P.includes('__gub('))throw new Error('filter not found');
process.argv[2]='__GUB';const code=G+'\n'+P;fs.writeFileSync(__dirname+'/../pkgGCC/patches/__GUB.to',code);
global.PASS={sb_items:[]};global.UND={cure:()=>{throw new Error('UND called');}};
require('../pkgGCC/t_1062.cjs');setTimeout(()=>fs.unlinkSync(__dirname+'/../pkgGCC/patches/__GUB.to'),50);
