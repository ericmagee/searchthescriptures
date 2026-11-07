// pkgKG1L end to end on every saved run: Gate Build -> Gate Record and Alt Gate Build -> Alt Gate Record, base (pkgLIB v10 full source) vs patched,
// each with the saved live gate reply. Prints each run where a gate item's cure or the K-G1 lines change; base must equal the saved live gate field.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const rd=f=>fs.readFileSync(f,'utf8');const F='/mnt/project-files/wall2024/fetchback_live_s48.json';const D='/mnt/project-files/wall2024/inputs/';
const PAIRS=[['Gate Build','Gate Record','Gate Call openrouter'],['Alt Gate Build','Alt Gate Record','Alt Gate Call openrouter']];
const runs=[...new Set(fs.readdirSync(D).filter(x=>/^33\d{3}_Gate_Record\.json$/.test(x)).map(x=>x.slice(0,5)))].sort();
(async()=>{let n=0,same=0,liveEq=0,liveN=0;
for(const R of runs)for(const [GB,GR,GC] of PAIRS){if(!fs.existsSync(D+R+'_'+GR.replace(/ /g,'_')+'.json'))continue;
 const run=async(node,dir,inp,over)=>{try{return await harness(R,over)('return (async()=>{'+rd(dir+node.replace(/ /g,'_')+'.js')+'\n})()',inp);}catch(e){return 'ERR '+e.message;}};
 const gbA=await run(GB,'pkgKG1L/base_v10/',feeder(F,GB)[0]),gbB=await run(GB,'pkgKG1L/patched/',feeder(F,GB)[0]);
 const grA=await run(GR,'pkgKG1L/base_v10/',GC,{[GB]:gbA}),grB=await run(GR,'pkgKG1L/patched/',GC,{[GB]:gbB});
 const j=o=>(o&&o[0]&&o[0].json)||{};const g=o=>JSON.stringify(j(o).gate||null);
 const sv=JSON.parse(rd(D+R+'_'+GR.replace(/ /g,'_')+'.json'));const svr=(sv[0]||sv);const svm=(svr.data&&svr.data.main)||svr.main||[[]];const svj=((svm[0]||[])[0]||{}).json||{};liveN++;if(g(grA)===JSON.stringify(svj.gate||null))liveEq++;else console.log('note '+R+' '+GR+': base gate field differs from saved live (harness)');
 const rows=o=>JSON.stringify((j(o).gate_rows||[]).map(r=>[r.seat,r.item,r.cure_status]));n++;
 const k1=o=>JSON.stringify(o).match(/"kind":"RULE K-G1"[^}]*"lines":\[[^\]]*\]/g)||[];
 if(g(grA)===g(grB)&&rows(grA)===rows(grB)&&JSON.stringify(k1(gbA))===JSON.stringify(k1(gbB)))same++;
 else{console.log('CHANGED '+R+' '+GR+'\n  base gate '+g(grA).slice(0,400)+'\n  KG1L gate '+g(grB).slice(0,400));for(const x of k1(gbB))console.log('  KG1L K-G1 item: '+x.slice(-500));}}
console.log(runs.length+' runs, '+n+' gate pairs; unchanged '+same+', changed '+(n-same)+'; base equals saved live gate field '+liveEq+'/'+liveN);})();
