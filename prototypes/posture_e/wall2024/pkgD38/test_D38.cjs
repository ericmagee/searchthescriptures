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
 T(ty(d38Items2024(G0,G0.replace('UNEXHIBITED','SUPPORTED'),'{}'))==='','unit: a SUPPORTED card raises nothing');
 // ASK 2 (W3 3120): a count from a cure -> card-only wording and a d38c flag; the judge's own count line -> both cures open, no flag
 {const a=d38Items2024(G0,G0,'{}')[0];T(/came from the cure \(the engine recount after the cure\)\. Change the RULING card, not the count/.test(a.why)&&/Oracle concede and is refused/.test(a.why)&&a.d38c&&a.d38c.lab==='CHALLENGER CONCEDED LINKS','unit ASK 2: an engine-recount count gives card-only wording and the d38c flag');
  const G1=G0.replace('CHALLENGER CONCEDED LINKS: 0 -- recomputed after the cure','CHALLENGER CONCEDED LINKS: 0 -- premises 1 to 6 spared');const b=d38Items2024(G1,G1,'{}')[0];
  T(b&&/Change one of the two lines so they agree/.test(b.why)&&!b.d38c,'unit ASK 2: the judge\'s own count line keeps both cures open, no flag');
  const G2=G1+'\nCORRECTED COUNT: CHALLENGER 0 -- premise 1 out';const c=d38Items2024(G2,G2,'{}')[0];T(c&&/came from the cure \(CORRECTED COUNT\)/.test(c.why)&&c.d38c,'unit ASK 2: a CORRECTED COUNT line for the side gives card-only wording');
  const G3=G1.replace('CHALLENGER CONCEDED LINKS','CONCEDED LINKS').replace('against Challenger','against Defender')+'\nCORRECTED COUNT: DEFENDER 0';const d=d38Items2024(G3,G3,'{}')[0];T(d&&/Raising CONCEDED LINKS here is refused/.test(d.why)&&!/Oracle/.test(d.why),'unit ASK 2: defender side wording names no Oracle concede');}}
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
T(n>0,'replay ran');
// 5. ASK 2 end to end on 33605 terra G5 (challenger premise 6, count from the engine recount): Gate Build -> synthetic gate reply -> Gate Record
{const c=JSON.parse(fs.readFileSync(D+'33605_Gate_Call_openrouter.json','utf8'));const orig=c[0].data.main[0];
 const mk=add=>{const o=JSON.parse(JSON.stringify(orig));const m=o[0].json.choices[0].message;m.content=m.content.replace(/\"\n\}\s*$/,add.map(l=>'\\n'+l.replace(/"/g,'\\"')).join('')+'"\n}');return o;};
 const GB=harness('33605')(P1('Gate_Build.js'),'Send Back Record');
 const go=add=>{const j=harness('33605',{'Gate Call openrouter':mk(add),'Gate Build':GB,'Gate Needed?':GB.filter(x=>!x.json.gate_skip)})(P1('Gate_Record.js'),'Gate Call openrouter')[0].json;
  const r=(j.gate_rows||[]).filter(z=>/^G5 CONTRADICTION/.test(String(z.item))||/E-APPLY G5/.test(String(z.item)));const cnt=(JSON.stringify(j.bodies||j).match(/challenger_conceded_links\\*"\s*:\s*(\d+)/)||[])[1];return {r,cnt};};
 const A=go(['GATE: G5 || CHANGE TO: CHALLENGER CONCEDED LINKS: 1 -- Premise 6 is UNEXHIBITED: its witness Genesis 24:43 was not named. || test']);
 T(A.r.some(z=>/^G5/.test(z.item)&&z.cure_status==='UNCURED')&&A.r.some(z=>/an Oracle concede, and is refused/.test(String(z.cure_reason)))&&A.cnt==='0','e2e 33605 terra G5: a gate change raising CHALLENGER CONCEDED LINKS to 1 is refused (NOT APPLIED), G5 stays UNCURED, stored count stays 0');
 const B=go(['GATE: G5 || CHANGE TO: RULING -- challenger premise 6 -- SUPPORTED -- the cure took premise 6 out of the count || test']);
 T(B.r.some(z=>/^G5/.test(z.item)&&z.cure_status==='CURED')&&B.cnt==='0','e2e 33605 terra G5: changing the RULING card cures G5, count 0');
 const C=go([]);T(C.r.some(z=>/^G5/.test(z.item)&&z.cure_status==='UNCURED'),'e2e 33605 terra G5: silence leaves G5 UNCURED');}log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgD38/test_D38.txt',out.join('\n')+'\n');
