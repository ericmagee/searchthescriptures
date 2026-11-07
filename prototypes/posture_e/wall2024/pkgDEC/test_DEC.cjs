// pkgDEC: base (pkgL1Q/patched) vs patched, each node run whole on every recent saved run (pkgGSL harness, live feeder as $input). Byte-identical or fail.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const rd=f=>fs.readFileSync(f,'utf8');
const F='/mnt/project-files/wall2024/fetchback_live_s45.json';const BS=process.env.BS||'pkgL1Q/patched',PT=process.env.PT||'pkgDEC/patched';
const runs=[...new Set(fs.readdirSync(D).filter(f=>/^33[2-9]\d\d_Panel_Cure_Check\.json$/.test(f)).map(f=>f.slice(0,5)))].sort();
const nodes=[['Send_Back_Record.js','Send Back Record'],['Alt_Send_Back_Record.js','Alt Send Back Record'],['Alternate_Merge_Seat.js','Alternate Merge Seat']];
(async()=>{let n=0,same=0,outs=0;const T={a:0,b:0};
 for(const R of runs)for(const [f,name] of nodes){const IN=feeder(F,name)[0];const one=async src=>{const t=process.hrtime.bigint();let r;try{r=await harness(R)('return (async()=>{'+src+'\n})()',IN);r='OUT '+JSON.stringify(r);}catch(e){r='ERR '+String(e&&e.message||e);}return [r,Number(process.hrtime.bigint()-t)/1e6];};
  const [a,ta]=await one(rd(BS+'/'+f)),[b,tb]=await one(rd(PT+'/'+f));n++;T.a+=ta;T.b+=tb;if(a===b){same++;if(a.startsWith('OUT'))outs++;}else console.log('DIFF '+R+' '+name+'\n  a '+a.slice(0,200)+'\n  b '+b.slice(0,200));}
 console.log(runs.length+' recent runs x 3 nodes = '+n+' node runs; identical '+same+' ('+outs+' with real output); time base '+T.a.toFixed(0)+' ms, patched '+T.b.toFixed(0)+' ms');console.log(same===n?'OK':'FAIL');})();
