// pkgQRA: fixture for Judge Contradiction Build, cut from the dry regrade record (execution 34299 of run 34108).
//   node pkgQRA/make_fixture.cjs /mnt/project-files/wall2024/ex34299_full.json pkgQRA/fixture_34299.json
const fs=require('fs');const [,,IN,OUT]=process.argv;const j=JSON.parse(fs.readFileSync(IN,'utf8'));
const find=o=>{if(!o||typeof o!=='object')return null;if(o.runData)return o.runData;for(const k of Object.keys(o)){if(k==='runData')return o[k];}for(const k of ['data','resultData','execution']){if(o[k]){const r=find(o[k]);if(r)return r;}}return null;};
const RD=find(j);if(!RD)throw new Error('no runData');
const first=n=>{try{return RD[n][0].data.main[0][0].json;}catch(e){return undefined;}};
const fx={};for(const n of ['Init Seats','Resolve Seats','Regrade Load','Panel Payloads','QR Merge','Close Enforcer Record','Extract Independent Verdict','Judge Contradiction Build']){const v=first(n);if(v!==undefined)fx[n]=v;}
// keep the fixture small: QR Merge keeps qa only; Regrade Load keeps f only
if(fx['QR Merge'])fx['QR Merge']={qa:fx['QR Merge'].qa};if(fx['Regrade Load'])fx['Regrade Load']={f:fx['Regrade Load'].f};
if(fx['Resolve Seats'])fx['Resolve Seats']={deepseek:fx['Resolve Seats'].deepseek};
fs.writeFileSync(OUT,JSON.stringify(fx));console.log(Object.keys(fx).map(k=>k+' '+JSON.stringify(fx[k]).length).join('\n'));
