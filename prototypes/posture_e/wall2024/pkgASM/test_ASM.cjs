// pkgASM test. Run from wall2024/ after build_ASM.cjs. A: build identity. B: replay parity and the 4 act items. C: real 33222 Panel Payloads raise.
// D: the act test on its own (true and negative). E: the cure block cut from the patched Panel Cure Check, on mocks.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const {patch}=require('../pkgUNXA/patch.cjs');const {patchASM}=require('./patch_asm.cjs');
let ok=0,bad=0;const out=[];const t=(n,c,d)=>{const l=(c?'OK  ':'FAIL')+' '+n+(d?' | '+d:'');console.log(l);out.push(l);c?ok++:bad++;};
const plan=JSON.parse(fs.readFileSync('pkgASM/plan_ASM.json','utf8'));const PU=JSON.parse(fs.readFileSync('pkgUNXA/plan_UNXA.json','utf8'));
t('A1 22 nodes, each base is the pkgUNXA final',plan.nodes.length===22&&plan.nodes.every(n=>PU.nodes.find(u=>u.name===n.name).final_sha===n.base_sha));
t('A2 the cure edit is in the same 19 nodes as the K-UNX-A cure',plan.nodes.filter(n=>n.cure).length===19&&plan.nodes.filter(n=>n.cure).every(n=>PU.nodes.find(u=>u.name===n.name).edits.includes('cure')));
t('A3 every patched file equals its plan sha',plan.nodes.every(n=>sha(fs.readFileSync('pkgASM/patched/'+n.file,'utf8'))===n.final_sha));
const R=fs.readFileSync('pkgASM/replay_ASM.txt','utf8');const h=R.split('\n')[0];
t('B1 replay (142 verdicts): no K-UNX-A item lost or changed; E-ASM alone adds 0',/142 verdicts/.test(h)&&/E-ASM alone adds 0\. Lost or changed otherwise: 0\./.test(h),h);
t('B2 the 4 act items are the 4 found by hand (Wall 2724): 32924 gemini C1 and C6, 33218 gemini C1, 33222 gemini C1',['32924 gemini    CHALLENGER premise 1','32924 gemini    CHALLENGER premise 6','33218 gemini    CHALLENGER premise 1','33222 gemini    CHALLENGER premise 1'].every(s=>R.includes('BOTH  '+s))&&(R.match(/^BOTH /gm)||[]).length===4);
const AM=fs.readFileSync('pkgUNXA/base/Alternate_Merge.js','utf8');const s0=AM.indexOf('const __CSPOUT=(()=>{\n')+22;const env=patchASM(patch(AM.slice(s0,AM.indexOf("const AM=$('Alternate Merge Seat')"))),false).code;
const K=new Function('$','$input',env+';return {unxaAct};')(()=>{throw 0;},null);
const act=s=>K.unxaAct(s);
t('D1 acts: knew, knowing, begot, conceived',act('ASSUMES: Joseph knew Mary before taking her -- ROWS GIVE: x')==='knew'&&act('ASSUMES: an act of knowing between Joseph and Mary')==='knowing'&&act('ASSUMES: Joseph begot Jesus')==='begot'&&act('ASSUMES: she conceived by Joseph')==='conceived');
t('D2 not acts: a house fact, "begetter", "known as", "known that", and an act named only in ROWS GIVE',!act('ASSUMES: the receiving house differs from the begetter\'s house')&&!act('ASSUMES: Mary was known as of the house of David')&&!act('ASSUMES: it is known that Mary is of Judah')&&!act('ASSUMES: Mary is of the house of David -- ROWS GIVE: "knew her not till"'));
// C: the real Panel Payloads node on the saved 33222 inputs (pkgGSL harness, as pkgUNXA's G tests)
{const {harness}=require('../pkgGSL/harness.cjs');const H=harness('33222');const items=o=>{const r=[];const w=v=>{if(Array.isArray(v))v.forEach(w);else if(v&&typeof v==='object'){if(v.rule==='K-UNX')r.push(v);Object.values(v).forEach(w);}};w(o);return [...new Map(r.map(x=>[x.link+x.a,x])).values()];};
 const rd=d=>fs.readFileSync(d+'/Panel_Payloads.js','utf8');const a=items(H(rd('pkgUNXA/patched'),'Reserve Needed?')),b=items(H(rd('pkgASM/patched'),'Reserve Needed?'));
 t('C1 real 33222 Panel Payloads: pkgUNXA raises gemini CHALLENGER premise 1 ASSUMES; pkgASM raises the same one item, now carrying asm "knew"',a.length===1&&b.length===1&&b[0].link===a[0].link&&b[0].a==='ASSUMES'&&b[0].asm==='knew'&&/never an ASSUMES/.test(b[0].why),b[0]?b[0].line.slice(0,300):'');}
const PCC=fs.readFileSync('pkgASM/patched/Panel_Cure_Check.js','utf8');const a0=PCC.indexOf('  // pkgUNXA (TRIAL; W3 2721');const a1=PCC.indexOf("  if(x.rule==='K-LB'){const st=stmtOf(x);",a0);const BLK=PCC.slice(a0,a1);
t('E0 the cure block holds the pkgASM branch',/pkgASM \(TRIAL\)/.test(BLK));
const cure=(x,st,count)=>new Function('$','x','o',env+";const stmtOf=()=>o.st;const res=(st,why,l)=>({st,why,l});"+BLK+"return {st:'FELL THROUGH'};")(()=>{throw 0;},x,{st,count:count||[]});
const L1='that of the fruit of his loins, according to the flesh, he would raise up Christ to sit on his throne';
const xb={rule:'K-UNX',a:'ASSUMES',asm:'knew',side:'CHALLENGER',link:'CHALLENGER premise 1',premise:1,kinds:['L1','L2','L3'],conc:1,l1:L1,l1ref:'Acts 2:30'};const xo={...xb,a:'ASM'};
const Q='Acts 2:30 "of the fruit of his loins, according to the flesh" names David as the source and does not name Joseph';
t('E1 both: quoting the [L1] with a lack but keeping "ASSUMES: Joseph knew Mary" does not cure',cure(xb,Q+'. ASSUMES: Joseph knew Mary before taking her').st==='UNCURED');
t('E2 both: the K-UNX-A STATEMENT alone (no ASSUMES:) does not cure',cure(xb,Q).st==='UNCURED');
t('E3 both: an ASSUMES: given fact plus the [L1] quote and a lack cures',cure(xb,'ASSUMES: Mary is of the house of David. '+Q).st==='CURED');
t('E4 both: an ASSUMES: given fact without the [L1] quote does not cure (K-UNX-A still owed)',cure(xb,'ASSUMES: Mary is of the house of David').st==='UNCURED');
t('E5 ASM alone: an ASSUMES: given fact cures',cure(xo,'ASSUMES: Mary is of the house of David').st==='CURED');
t('E6 ASM alone: an ASSUMES that still names a begetting does not cure',cure(xo,'ASSUMES: Joseph begot the child').st==='UNCURED');
t('E7 a CORRECTED COUNT below the count cures (both and alone)',cure(xb,null,[{side:'CHALLENGER',n:0,line:'CHALLENGER CONCEDED LINKS: 0'}]).st==='CURED'&&cure(xo,null,[{side:'CHALLENGER',n:0,line:'CHALLENGER CONCEDED LINKS: 0'}]).st==='CURED');
t('E8 a KEEP does not cure',cure(xb,'KEEP').st==='UNCURED'&&cure(xo,'KEEP').st==='UNCURED');
t('E9 a K-UNX-A item with no act is cured exactly as before',cure({...xb,asm:''},Q).st==='CURED'&&cure({...xb,asm:''},'its [L4] does not follow').st==='UNCURED');
fs.writeFileSync('pkgASM/test_ASM.txt',out.join('\n')+'\n'+ok+' OK, '+bad+' FAIL\n');console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
