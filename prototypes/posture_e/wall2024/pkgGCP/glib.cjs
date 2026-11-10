// Load Gate Record's library functions (pkgGCP build) with a $ made from the chain's outputs.
const fs=require('fs');const s=fs.readFileSync(__dirname+'/../'+(process.env.GLIB||'pkgLIB/strip_GCPL_on_S111/patched/Gate_Record.js')+'','utf8');const cut=s.indexOf("const PASS=$('Send Back Record')");
const cl=x=>JSON.parse(JSON.stringify(x));
module.exports=(out)=>{const $=name=>{const m=out(name);const it=m?m.find(o=>o&&o.length)||m[0]||[]:null;if(!it)return {isExecuted:false,first:()=>{throw new Error('unexecuted '+name)},all:()=>{throw new Error('unexecuted '+name)}};return {isExecuted:true,first:()=>cl(it[0]),all:()=>cl(it),last:()=>cl(it[it.length-1])};};
 return new Function('$','$input','$json','$execution',s.slice(0,cut)+'\n;return {gnkRun2024,sbApply2024,cureJText,gatePromptText2024,ciRounds,drvLinks,gcp2024,enfStatus,cureSafe};')($,{all:()=>[],first:()=>({json:{}})},{},{id:'x'});};
