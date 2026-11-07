// pkgUNXA tests. Run from wall2024/: node pkgUNXA/test_UNXA.cjs
//  A. build identity and compile  B. the replay (47 runs + grok 33222 alternate)  C. parity: every K-UNX item the live code raises is unchanged
//  D. true-breach control  E. negative controls  F. the cure block on mocks  G. the real extractor nodes on the saved 33222 inputs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const E=require('./env.cjs');const {patch}=require('./patch.cjs');const K=E.load(true),K0=E.load(false);let ok=0,bad=0;const out=[];
const t=(n,c,info)=>{(c?ok++:bad++);out.push((c?'OK   ':'FAIL ')+n+(info?' :: '+info:''));};
// A
const plan=JSON.parse(fs.readFileSync(__dirname+'/plan_UNXA.json','utf8'));const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s16.json','utf8'));const LIVE=(W.data||W).nodes;
t('A1 22 nodes in the plan, every live node holding kunxLines',plan.nodes.length===22&&LIVE.filter(n=>/function kunxLines/.test(n.parameters&&n.parameters.jsCode||'')).length===22);
for(const n of plan.nodes){const s0=n.base==='s16'?LIVE.find(z=>z.name===n.name).parameters.jsCode:fs.readFileSync(plan.base6+'/'+n.file,'utf8');const s=fs.readFileSync(__dirname+'/patched/'+n.file,'utf8');
 let c=true;try{new Function('$','$input','$json','$execution',s);}catch(e){c=false;}t('A2 '+n.name+': base sha, patched sha, compiles',sha(s0)===n.base_sha&&sha(s)===n.final_sha&&c&&s.startsWith(s0.slice(0,200)),n.base+' '+n.base_sha+' -> '+n.final_sha);}
const P6=JSON.parse(fs.readFileSync('pkgPSG/plan_PSG.json','utf8')).nodes;t('A3 the 6 gate-library bases are the PSG finals',plan.nodes.filter(n=>n.base!=='s16').every(n=>P6.find(p=>p.name===n.name).final_sha===n.base_sha));
// B
const rows=E.rows();const g=JSON.parse(fs.readFileSync(__dirname+'/data/grok_33222.json','utf8'));const r22=rows.find(r=>r.run.includes('33222'));
let tot=0,par=true,parN=0;const raised=[];
for(const r of rows){const PT=E.PT(r);for(const j of r.j.concat(r===r22?[{seat:'grok(alt)',v:g.v}]:[])){tot++;const T=E.clean(j.v);const a=K.kunxLines(T,PT).items,b=K0.kunxLines(T,PT).items;
 const old=a.filter(x=>!x.a);parN+=b.length;if(JSON.stringify(old)!==JSON.stringify(b))par=false;for(const x of a.filter(x=>x.a))raised.push(r.run.slice(5,10)+' '+j.seat+' '+x.side[0]+x.premise+' '+x.a+' '+x.l1ref);}}
const RA=raised.filter(x=>/ASSUMES/.test(x)),RB=raised.filter(x=>/UNANSWERED/.test(x));
t('B1 142 verdicts read; 14 ASSUMES items raised, 1 unanswered item raised',tot===142&&RA.length===14&&RB.length===1,RA.length+' + '+RB.length);
t('B2 gemini 33222 premise 1 raised on its [L1] Acts 2:30',raised.includes('33222 gemini C1 ASSUMES Acts 2:30'));
t('B3 grok 33222 (alternate) premise 1 raised; the answer to Luke 1:34 has [L1] Luke 1:34 (W3 2727)',raised.includes('33222 grok(alt) C1 UNANSWERED Luke 1:34'));
// C
t('C1 parity: every K-UNX item the live code raises is raised unchanged ('+parN+' items)',par);
// D, E: controls written into a saved input (33222 chatgpt, CHALLENGER CONCEDED LINKS 0; [DR3] LINK 1 [L1] Acts 2:30)
const ch=r22.j.find(j=>j.seat==='chatgpt');const PT22=E.PT(r22);const T0=E.clean(ch.v);
const inj=cl=>T0.replace(/CHALLENGER CONCEDED LINKS: 0 -- [^\n]*/,'CHALLENGER CONCEDED LINKS: 1 -- Premise 1: UNEXHIBITED (STEP: Joseph knew Mary within the espousal -- ASSUMES: '+cl+'). Spared: premises 2 to 6.');
const D1=K.kunxLines(inj('Joseph knew Mary before taking her -- ROWS GIVE: Matthew 1:18 "before they came together, she was found with child of the Holy Ghost"'),PT22).items.filter(x=>x.a);
t('D1 true breach written into 33222 chatgpt: raised as ASSUMES on [L1] Acts 2:30',D1.length===1&&D1[0].a==='ASSUMES'&&D1[0].l1ref==='Acts 2:30'&&D1[0].conc===1,D1.map(x=>x.line.slice(0,160)).join(' | '));
const E1=K.kunxLines(inj('Joseph knew Mary before taking her -- ROWS GIVE: Acts 2:30 "of the fruit of his loins, according to the flesh" names David, not Joseph'),PT22).items.filter(x=>x.a);
t('E1 negative: the ASSUMES clause quotes 6 words in a row of the [L1]: not raised',E1.length===0);
const E2=K.kunxLines(inj('Joseph knew Mary before taking her -- ROWS GIVE: Matthew 1:18. The answer is VOID'),PT22).items.filter(x=>x.a);
t('E2 negative: another exempt ground (VOID) in the count: not raised',E2.length===0);
const E3=K.kunxLines(E.clean(g.v),E.PT({e3:r22.e3,c3:r22.c3.replace(/MEANS \[CR3\] P1\.3[^\n]*/,'')})).items.filter(x=>x.a);
t('E3 negative: grok 33222 with the MEANS P1.3 line taken out of [DR3]: premise 1 not raised',!E3.some(x=>x.premise===1&&x.side==='CHALLENGER'));
const E4=K.kunxLines(inj('Joseph knew Mary before taking her'),E.PT({e3:r22.e3,c3:r22.c3.replace(/^([ \t>*#_-]*LINK\s+1[^\n]*\n)[\s\S]*?(?=^[ \t>*#_-]*LINK\s+2)/m,'$1Footing: none.\n')})).items.filter(x=>x.a);
t('E4 negative: a block with fewer than two kinds: not raised',E4.length===0);
// F: the cure block, cut from the patched Panel Cure Check
const PCC=fs.readFileSync(__dirname+'/patched/Panel_Cure_Check.js','utf8');const a0=PCC.indexOf('  // pkgUNXA (TRIAL; W3 2721');const a1=PCC.indexOf("  if(x.rule==='K-LB'){const st=stmtOf(x);",a0);const BLK=PCC.slice(a0,a1);
const AM=fs.readFileSync(__dirname+'/base/Alternate_Merge.js','utf8');const s0=AM.indexOf('const __CSPOUT=(()=>{\n')+22;const env=patch(AM.slice(s0,AM.indexOf("const AM=$('Alternate Merge Seat')")));
const cure=(x,st,count)=>new Function('$','x','o',env+";const stmtOf=()=>o.st;const res=(st,why,l)=>({st,why,l});"+BLK+"return {st:'FELL THROUGH'};")(()=>{throw 0;},x,{st,count:count||[]});
const xa={rule:'K-UNX',a:'ASSUMES',side:'CHALLENGER',link:'CHALLENGER premise 1',premise:1,kinds:['L1','L2','L3'],conc:1,l1:'that of the fruit of his loins, according to the flesh, he would raise up Christ to sit on his throne',l1ref:'Acts 2:30'};
t('F1 a STATEMENT quoting the [L1] and saying what it lacks cures',cure(xa,'Acts 2:30 "of the fruit of his loins, according to the flesh" names David as the source and does not name Joseph or a knowing within the espousal').st==='CURED');
t('F2 a STATEMENT naming a missing layer only does not cure an ASSUMES item',cure(xa,'its [L4] does not follow').st==='UNCURED');
t('F3 a STATEMENT quoting the [L1] that says nothing it lacks does not cure',cure(xa,'Acts 2:30 "of the fruit of his loins, according to the flesh" is the footing').st==='UNCURED');
t('F4 a CORRECTED COUNT below 1 cures',cure(xa,null,[{side:'CHALLENGER',n:0,line:'CHALLENGER CONCEDED LINKS: 0'}]).st==='CURED');
t('F5 a KEEP does not cure',cure(xa,'KEEP').st==='UNCURED');
t('F6 a K-UNX item without a ground mark goes to the K-UNX block unchanged (a named [L4] cures it)',cure({...xa,a:undefined},'its [L4] does not follow').st==='CURED');
t('F7 the cure block is in all 19 cure and gate nodes',plan.nodes.filter(n=>n.edits.includes('cure')).length===19&&plan.nodes.filter(n=>n.edits.includes('cure')).every(n=>fs.readFileSync(__dirname+'/patched/'+n.file,'utf8').includes(BLK)));
// G: the real extractor nodes on the saved 33222 inputs (pkgGSL harness)
const {harness}=require('../pkgGSL/harness.cjs');const H=harness('33222');const items=o=>{const r=[];const w=v=>{if(Array.isArray(v))v.forEach(w);else if(v&&typeof v==='object'){if(v.rule==='K-UNX')r.push(v);Object.values(v).forEach(w);}};w(o);return [...new Map(r.map(x=>[x.link+x.a,x])).values()];};
const live=n=>LIVE.find(z=>z.name===n).parameters.jsCode,pat=n=>fs.readFileSync(__dirname+'/patched/'+n.replace(/ /g,'_')+'.js','utf8');
{const b=items(H(live('Panel Payloads'),'Reserve Needed?')),p=items(H(pat('Panel Payloads'),'Reserve Needed?'));t('G1 Panel Payloads on 33222: live raises no K-UNX; patched raises CHALLENGER premise 1 ASSUMES (gemini)',b.length===0&&p.length===1&&p[0].a==='ASSUMES'&&p[0].link==='CHALLENGER premise 1');}
{const b=items(H(live('Alternate Payloads'),'Alternate Call openrouter')),p=items(H(pat('Alternate Payloads'),'Alternate Call openrouter'));t('G2 Alternate Payloads on 33222: live raises none; patched raises CHALLENGER premise 1 UNANSWERED (grok first verdict, press Luke 1:35)',b.length===0&&p.length===1&&p[0].a==='UNANSWERED'&&p[0].press==='Luke 1:35');}
const txt=out.join('\n')+'\n'+ok+' OK, '+bad+' FAIL\n';fs.writeFileSync(__dirname+'/test_UNXA.txt',txt);console.log(txt);process.exit(bad?1:0);
