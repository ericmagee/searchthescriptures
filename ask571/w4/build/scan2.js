const fs=require('fs'),crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s).digest('hex').slice(0,8);
const W=JSON.parse(fs.readFileSync(process.argv[2]||'/mnt/project-files/fairjudge/w4build/base_engine.json'));
const A="for(const k of order)for(const r of (IX.V[k]||[]))";
const by={};
for(const x of W.nodes){const s=x.parameters&&x.parameters.jsCode;if(!s||s.indexOf('const L2C=(()=>{')<0||x.name==='Shared Library')continue;
const i=s.indexOf('const L2C=(()=>{');const e=s.indexOf('\n})();',i);const blk=s.slice(i,e+6);
const ret=blk.slice(blk.lastIndexOf('return'),blk.length).slice(0,200);
const ci=s.indexOf('const CAPC=');const ai=s.indexOf(A);
(by[md5(blk)]=by[md5(blk)]||[]).push(x.name);
console.log(x.name.padEnd(18),'L2C',i,'-',e+6,'len',blk.length,md5(blk),'| CAPC@',ci,ci>i&&ci<e?'IN':'out','| sheetA@',ai,ai>i&&ai<e?'IN':'out','| after:',JSON.stringify(s.slice(e+6,e+80)));}
console.log(by);
