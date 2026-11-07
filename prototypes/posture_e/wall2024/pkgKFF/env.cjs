// Library env for pkgKFF tests: the live s28 declarations kffLines reads, copied byte for byte from Panel Cure Check (lib_extract), plus kff_lib.js.
const fs=require('fs');const {closure}=require('../pkgEPK/lib_extract.cjs');
const FB='/mnt/project-files/wall2024/fetchback_live_s28.json';
const NS=(()=>{const w=JSON.parse(fs.readFileSync(FB,'utf8'));const W=w.data||w;return W.nodes||W.workflow.nodes;})();
const code=n=>NS.find(z=>z.name===n).parameters.jsCode;
const LIBTXT=closure(code('Panel Cure Check'),['KF_LINE','__kfLB','krulNorm','kkjvNoMargin','KKJV_REF','kkjvRows','kfLines','cureRounds']);
const KFF=fs.readFileSync(__dirname+'/kff_lib.js','utf8');
function load(rows){const $=n=>{if(n==='Cited Verses')return {all:()=>(rows||[]).map(j=>({json:j}))};throw new Error('unexecuted '+n);};
 return new Function('$',(typeof LIBTXT==='string'?LIBTXT:LIBTXT.text||LIBTXT.join('\n'))+'\n'+KFF+';return {kffLines,kffPairs,kfLines,cureRounds,krulNorm,KF_LINE};')($);}
module.exports={load,NS,code,FB};
