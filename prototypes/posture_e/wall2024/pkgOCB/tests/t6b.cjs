const {harness,live,feeder}=require(__dirname+'/../../pkgGSL/harness.cjs');const fs=require('fs');
const OLD='/mnt/project-files/wall2024/fetchback_live_s83.json',NEW=__dirname+'/../parent_s83_OCB.json';
const runs=[...new Set(fs.readdirSync('/mnt/project-files/wall2024/inputs/').filter(f=>f.endsWith('_index.json')).map(f=>f.split('_')[0]))];
const nodes=['Init with Guards','C4 Build','C4 Extract','C4G Extract','C4B Extract','D4 Build','D4 Extract','D4B Extract','Build Synthesis','Build Save Body','Format Markdown'];
const B1J=JSON.stringify("\n\nCONTRADICTION WATCH.").slice(1,-1);const strip=(s,n)=>{if(n==='Init with Guards'){const i=s.indexOf(B1J);if(i<0)return s;const e=s.indexOf('anything you stated earlier.',i);return s.slice(0,i)+s.slice(e+28);}if(/^C4.* Extract$/.test(n))return s.replace(/,"contradictions":\{[^{}]*(\[[^\]]*\])?[^{}]*\}/,'');return s;};
let eq=0,diff=[],err=0;
for(const r of runs){const H=harness(r);for(const n of nodes){const f=feeder(OLD,n)[0];let a,b;try{a=JSON.stringify(H(live(OLD,n),f));}catch(e){err++;continue;}try{b=JSON.stringify(H(live(NEW,n),f));}catch(e){diff.push(r+' '+n+' NEWERR '+e.message);continue;}
 (strip(a,n)===strip(b,n)?eq++:diff.push(r+' '+n));}}
console.log('runs',runs.length,'| node runs equal apart from B1 text and B4 field:',eq,'| differ:',diff.length,'| skipped (old errors too):',err);const g={};diff.forEach(x=>{const k=x.split(' ').slice(1).join(' ');g[k]=(g[k]||0)+1;});console.log(g);
