// pkgD38 test. Run from wall2024/: node --max-old-space-size=8000 pkgD38/test_D38.cjs
// Base = pkgLIB/strip_R1B (LIB v15_R1B, live s56); patched = pkgLIB/strip_D38.
// 1. Static: the 6 gate/merge nodes carry the function and the one gate line; the other 16 are byte-identical.
// 2. Units on d38Items2024 alone (positives and negatives).
// 3. Bars on 33592 Gate Build: grok BASIS premise 5, KEY D6, COL D5 vs C5; gemini PREM challenger premise 1.
// 4. Replay: every saved run x all 22 nodes; every changed output listed; every D38 item listed.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const BASEW='/mnt/project-files/wall2024/fetchback_live_s52.json';
const B0=f=>fs.readFileSync('pkgLIB/strip_R1B/patched/'+f,'utf8'),P1=f=>fs.readFileSync('pkgLIB/strip_D38/patched/'+f,'utf8');
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK '+m);}else{bad++;log('FAIL '+m);}};
const CH=['Alt_Gate_Build.js','Alt_Gate_Record.js','Alternate_Merge.js','Alternate_Merge_Seat.js','Gate_Build.js','Gate_Record.js'];
const all=fs.readdirSync('pkgLIB/strip_R1B/patched').filter(f=>f.endsWith('.js')).sort();
for(const f of all){const a=B0(f),b=P1(f);if(CH.includes(f))T(a!==b&&b.includes('function d38Items2024(')&&(b.match(/src:'E-GATE D38'/g)||[]).length===1,f+' carries d38Items2024 and the one gate line');else T(a===b,f+' unchanged');}
{const {rebuild}=require('../pkgLIB/unpack.cjs');const lib=fs.readFileSync('pkgLIB_v16_D38/patched/Shared_Library.js','utf8');let k=0;for(const f of all)if(rebuild(fs.readFileSync('pkgLIB_v16_D38/patched/'+f,'utf8'),lib)===P1(f))k++;T(k===22,'pkgLIB_v16_D38: '+k+' of 22 stubs rebuild the strip_D38 source byte for byte');}
// 2. units: the function with the library's own rcLines and reader, cut from the patched Gate Record
{const src=P1('Gate_Record.js');const cut=(a,b)=>{const i=src.indexOf(a);return src.slice(i,src.indexOf(b,i)+b.length);};
 const rl=cut('const __RL=(function(){','return module.exports;})();');const rc=src.slice(src.indexOf('function rcLines('),src.indexOf('\nconst rcOne='));const d38=src.slice(src.indexOf('const D38_STATUS='),src.indexOf('function gateItems2024('));
 const d38Items2024=new Function(rl+'\n'+rc+'\n'+d38+'\nreturn d38Items2024;')();
 const base=['COLLISION POINTS:','D2 vs C4: DEFENDER LINK BROKEN (Commitment 3) -- the answer does not fit -- GROUND: [L1] Romans 1:3 "made of the seed of David"','D5 vs C5: DEFENDER LINK BROKEN (Commitment 3) -- no fit -- GROUND: [L1] 2 Samuel 7:12 "out of thy bowels"','KEYSTONE: D6 -- BROKEN -- link 6 counted','CONCEDED LINKS: 3 -- recomputed after the cure from the cured lines (CORRECTED COUNT DEFENDER 3).','CHALLENGER CONCEDED LINKS: 0 -- none counted.','RULING -- D5 vs C5 -- DEFENDER LINK BROKEN','RULING -- KEYSTONE D6 -- BROKEN','RULING -- LINK 6 -- UNEXHIBITED'];
 const raw='{"counted_premises_defender":[2,5,6],"counted_premises_challenger":[]}';const T0=base.join('\n');
 const T1=T0.replace('D5 vs C5: DEFENDER LINK BROKEN (Commitment 3) -- no fit','D5 vs C5: UNDERDETERMINED -- the record leaves it open').replace('KEYSTONE: D6 -- BROKEN','KEYSTONE: D6 -- STANDS');
 const ty=x=>x.map(z=>z.key).sort().join(', ');
 T(ty(d38Items2024(T0,T0,raw))==='','unit: an agreeing text raises nothing');
 T(ty(d38Items2024(T0,T1,raw))==='D38|BASIS|DEFENDER|5, D38|COL|D5 VS C5, D38|KEY|D6','unit: the 33592 grok shape raises BASIS 5, COL D5 vs C5, KEY D6 ('+ty(d38Items2024(T0,T1,raw))+')');
 const T2=T1.replace('RULING -- D5 vs C5 -- DEFENDER LINK BROKEN','RULING -- D5 vs C5 -- UNDERDETERMINED').replace('RULING -- KEYSTONE D6 -- BROKEN','RULING -- KEYSTONE D6 -- STANDS');
 T(ty(d38Items2024(T0,T2,raw))==='D38|BASIS|DEFENDER|5','unit: cards changed to agree clear COL and KEY, BASIS stays');
 const T3=T2.replace('CONCEDED LINKS: 3 -- recomputed after the cure from the cured lines (CORRECTED COUNT DEFENDER 3).','CONCEDED LINKS: 2 -- premise 2 broken at collision; LINK 6 UNEXHIBITED.');
 T(ty(d38Items2024(T0,T3,raw))==='','unit: a recounted line (changed this pass) clears BASIS');
 const T4=T1.replace('CONCEDED LINKS: 3 -- recomputed','CONCEDED LINKS: 3 -- premise 5 CONCEDED in [CR3]; recomputed');const T40=T0.replace('CONCEDED LINKS: 3 -- recomputed','CONCEDED LINKS: 3 -- premise 5 CONCEDED in [CR3]; recomputed');
 T(!ty(d38Items2024(T40,T4,raw)).includes('BASIS'),'unit: a count line that grounds premise 5 as CONCEDED raises no BASIS');
 const G0=['COLLISION POINTS:','D2 vs C1: UNDERDETERMINED -- open','CHALLENGER CONCEDED LINKS: 0 -- recomputed after the cure','RULING -- premise 1 against Challenger -- UNEXHIBITED'].join('\n');
 T(ty(d38Items2024(G0,G0,'{}'))==='D38|PREM|CHALLENGER|1','unit: the 33592 gemini shape raises PREM challenger 1');
 T(ty(d38Items2024(G0,G0.replace('CHALLENGER CONCEDED LINKS: 0','CHALLENGER CONCEDED LINKS: 1'),'{}'))==='','unit: a count of 1 clears PREM');
 T(ty(d38Items2024(G0,G0.replace('UNEXHIBITED','SUPPORTED'),'{}'))==='','unit: a SUPPORTED card raises nothing');}
// 3 + 4: replay
const fin=(RUN,nm)=>{const fe=feeder(BASEW,nm);return [...fe.filter(x=>/Call/.test(x)),...fe.filter(x=>!/Call/.test(x))].find(x=>fs.existsSync(D+RUN+'_'+x.replace(/ /g,'_')+'.json'));};
const runs=fs.readdirSync(D).filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).sort();const st=x=>JSON.stringify(x,(k,v)=>k==='at'||k==='created_at'||k==='t0'?undefined:v);
let n=0;const ch=[];const d38=[];const by={};
for(const RUN of runs){let H;try{H=harness(RUN);}catch(x){continue;}for(const f of all){const nm=f.replace(/\.js$/,'').replace(/_/g,' ');if(!fs.existsSync(D+RUN+'_'+f.replace(/\.js$/,'')+'.json'))continue;const i=fin(RUN,nm);if(!i)continue;
 let a,b,e0=null,e1=null;try{a=H(B0(f),i);}catch(x){e0=String(x.message).slice(0,100);}try{b=H(P1(f),i);}catch(x){e1=String(x.message).slice(0,100);}
 if(e0||e1){T(e0===e1,RUN+' '+nm+' same error both ('+e0+' | '+e1+')');continue;}n++;if(st(a)===st(b))continue;
 const its=[];for(const it of b){const r=it.json&&it.json.gate_report;if(r)for(const z of r)for(const x of (z.items||[]))if(x.src==='E-GATE D38')its.push({seat:z.seat,gid:x.gid,why:x.why});}
 if(f==='Gate_Build.js'){for(const x of its){d38.push(RUN+' '+x.seat+' '+x.gid+' '+x.why);const k=(x.why.match(/^your (RULING card grades (?:D\d+ vs|KEYSTONE|\w+ premise)|CONCEDED LINKS line|CHALLENGER CONCEDED LINKS line)/)||[])[1]||'?';by[k]=(by[k]||0)+1;}}
 ch.push(RUN+' '+nm+': changed'+(its.length?' ('+its.length+' D38 items)':' (no D38 item in its gate report)'));}}
log('replay: '+n+' node runs over '+runs.length+' runs; changed outputs: '+ch.length);for(const x of ch)log('   '+x);
log('D38 items raised in Gate Build: '+d38.length+' '+JSON.stringify(by));for(const x of d38)log('   '+x);
const has=(r,re)=>d38.some(x=>x.startsWith(r)&&re.test(x));
T(has('33592 grok',/CONCEDED LINKS line counts 3 with defender premise 5/),'bar 33592 grok: premise 5 counted after D5 vs C5 became UNDERDETERMINED is sent back');
T(has('33592 grok',/KEYSTONE D6 BROKEN, but your KEYSTONE line now reads D6 STANDS/),'bar 33592 grok: RULING KEYSTONE D6 BROKEN against KEYSTONE D6 STANDS is sent back');
T(has('33592 gemini',/challenger premise 1 UNEXHIBITED, which counts it, but your CHALLENGER CONCEDED LINKS line counts 0/),'bar 33592 gemini: count 0 against its premise 1 UNEXHIBITED RULING is sent back');
T(n>0,'replay ran');log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgD38/test_D38.txt',out.join('\n')+'\n');
