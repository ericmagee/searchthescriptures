const fs=require('fs');process.env.LIVE='/mnt/project-files/wall2024/fetchback_live_s115.json';process.env.CAND='/mnt/project-files/wall2024/parent_s115_BRF3c.json';
const src=fs.readFileSync(__dirname+'/run_brf.cjs','utf8');eval(src.slice(0,src.indexOf('const of=(h,p)'))+';globalThis.H=H;globalThis.NODES=NODES;');
const of=(h,p)=>p.F?h.C4P.of(p.F):h.C4P.ofD(p.FD);let mm=0,n=0;
for(const p of JSON.parse(fs.readFileSync(__dirname+'/plants_brf3c.json'))){const live=of(H['live|Build Synthesis'],p);const exp=p.cand==='LIVE'?live:p.cand;const outs=new Set();
 for(const nd of NODES){const g=JSON.stringify(of(H['cand|'+nd],p));outs.add(g);n++;if(g!==JSON.stringify(exp))mm++;}
 console.log(p.id,'| live',JSON.stringify(live),'| cand',[...outs].join(' / '),'| expected',JSON.stringify(exp),[...outs][0]===JSON.stringify(exp)&&outs.size===1?'OK':'MISMATCH');}
console.log('checks',n,'mismatches',mm);
