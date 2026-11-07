const fs=require('fs');process.chdir('/home/claude/searchthescriptures/prototypes/posture_e/wall2024');const {harness,feeder}=require('../pkgGSL/harness.cjs');
const IN=feeder('/mnt/project-files/wall2024/fetchback_live_s49.json','Enforcer Build')[0];
(async()=>{const b=await harness('33461')('return (async()=>{'+fs.readFileSync('pkgEST/patched/Enforcer_Build.js','utf8')+'\n})()',IN);const all=[];const w=o=>{if(typeof o==='string')all.push(o);else if(o&&typeof o==='object')Object.values(o).forEach(w);};w(b);
const L=all.join('\n').split('\n').filter(l=>/^- A\d+\.\d+ \(sol\)/.test(l)&&/STATEMENT: .*(TOUCHES NO LINK|BREAKS LINK)/i.test(l));console.log(L.length);console.log(L[0]&&L[0].slice(0,700));})();
