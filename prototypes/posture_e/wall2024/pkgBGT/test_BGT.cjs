// test_BGT: run base and patched L2 Count Plan on every saved run (harness); report every tag whose status changes and check that nothing else changes.
const {harness,rd,D}=require('../pkgGSL/harness.cjs');const fs=require('fs');
const B=rd(__dirname+'/base/L2_Count_Plan.js'),P=rd(__dirname+'/patched/L2_Count_Plan.js');
const runs=fs.readdirSync(D).filter(f=>/^\d+_L2_Lexicon\.json$/.test(f)).map(f=>f.split('_')[0]).sort();let ok=0,fail=0,skip=0,flips=[];
for(const R of runs){let b,p;try{b=harness(R)(B,'L2 Lexicon');}catch(e){skip++;console.log('SKIP',R,'base errors:',e.message);continue;}p=harness(R)(P,'L2 Lexicon');
 const bj=b[0].json,pj=p[0].json;const bt=bj.tags||[],pt=pj.tags||[];let bad=[];
 const strip=j=>{const o={...j};delete o.tags;return JSON.stringify(o);};
 if(strip(bj)!==strip(pj)){const wb=JSON.stringify(bj.counts),wp=JSON.stringify(pj.counts);bad.push('non-tag fields differ'+(wb!==wp?' (counts)':''));}
 if(bt.length!==pt.length)bad.push('tag count');
 bt.forEach((t,i)=>{const u=pt[i];if(JSON.stringify(t)===JSON.stringify(u))return;
  if(!(t.status==='NOT COUNTED'&&u.status==='COUNTED'))bad.push('unexpected change at tag '+i+': '+t.status+' -> '+u.status);
  const nw=u.words.filter((w,k)=>JSON.stringify(w)!==JSON.stringify(t.words[k]));if(nw.some(w=>w.route!=='KJV English word'))bad.push('a non-English word changed');
  flips.push(R+' '+t.round+': '+nw.map(w=>'"'+w.w+'" in '+w.in).join('; ')+' | '+t.status+' -> '+u.status+' | '+String(t.seg).slice(0,90).replace(/\s+/g,' '));});
 if(bad.length){fail++;console.log('FAIL',R,bad.join('; '));}else ok++;}
console.log('FLIPS ('+flips.length+'):');flips.forEach(f=>console.log('  '+f));console.log('TOTAL',ok,'OK,',fail,'FAIL,',skip,'skipped of',runs.length);
