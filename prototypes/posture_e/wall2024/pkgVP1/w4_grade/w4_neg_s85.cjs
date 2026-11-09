// W4 grade of pkgVP1: E-GATE M edge cases on luna's real 34108 send-back (the Luke 1:34 [CR3] answer check changed MEETS -> MISSES; D1 vs C1 left UNDERDETERMINED).
const fs=require('fs'),path=require('path');const W=path.resolve(__dirname,'../..');const H=require('../harness.cjs');const RUN='34108';
let ok=0,bad=0;const T=(c,m)=>{if(c)ok++;else bad++;console.log((c?'OK   ':'FAIL ')+m);};
const src=(d,n)=>fs.readFileSync(path.join(W,'pkgLIB',d,'patched',n),'utf8');
(async()=>{
 const items=async(code,mut)=>{let G;await H.run(code,RUN,'Send Back Record',{},ev=>{const g=n=>ev(n);const PASS=H.out(RUN,'Send Back Record')[0][0].json;const PB=H.out(RUN,'Panel Build')[0][0].json;
  const p=JSON.parse(PASS.bodies.find(b=>JSON.parse(b).payload.judge_seat==='luna')).payload;let its=JSON.parse(JSON.stringify(PASS.sb_items.filter(x=>x.seat==='luna')));const j=PB.judges.find(q=>q.seat==='luna');const PT=g('gatePromptText2024')(j.body);
  const ctx={R:g('ciRounds')(PT),DL:g('drvLinks')(PT),ask:PT.includes('CITATION CHECK')};const F={verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links};
  let raw=p.verdict_raw;if(mut)[raw,its]=mut(raw,its);G=g('gateItems2024')('luna',raw,F,its,ctx);});return G.items.filter(x=>x.src==='E-GATE M');};
 const C=src('strip_VP1_s84','Gate_Record.js');
 const AC=x=>x.rule==='E-ANS'&&/Luke 1:34/.test(x.item)&&/\[CR3\]/.test(x.item);
 const setTo=f=>(r,its)=>{let n=0;its.forEach(x=>{if(AC(x)){x.to=f(x.to);n++;}});if(!n)throw new Error('no item');return [r,its];};
 const d1=f=>(r,its)=>{const i=r.indexOf('D1 vs C1 (Matthew 1:18): UNDERDETERMINED');if(i<0)throw new Error('no D1');return [r.slice(0,i)+f(r.slice(i,i+40))+r.slice(i+40),its];};
 const base=await items(C);T(base.length===1&&base[0].key==='ANSWER OPEN|LUKE 1:34|CR3|D1','0 baseline: one item, ANSWER OPEN|LUKE 1:34|CR3|D1');
 let r=await items(C,(raw,its)=>[raw,its.filter(x=>!AC(x))]);T(r.length===0,'1 no send-back change on that answer check (judge kept MEETS): no item');
 r=await items(C,setTo(t=>t.replace('-- MISSES --','-- MEETS --')));T(r.length===0,'2 the change keeps MEETS: no item');
 r=await items(C,setTo(t=>t.replace('-- MISSES --','-- FAILS --')));T(r.length===1,'3 the change writes FAILS: one item');
 r=await items(C,(raw,its)=>[raw,its.map(x=>AC(x)?{...x,ans:'KEEP'}:x)]);T(r.length===0,'4 the judge answered KEEP on that send-back: no item');
 r=await items(C,d1(s=>s.replace('UNDERDETERMINED','DEFENDER LINK BROKEN')));T(r.length===0,'5 D1 vs C1 already DEFENDER LINK BROKEN: no item');
 r=await items(C,d1(s=>s.replace('UNDERDETERMINED','CHALLENGER LINK BROKEN')));T(r.length===0,'6 D1 vs C1 CHALLENGER LINK BROKEN (no D1 line open): no item');
 r=await items(C,setTo(t=>t.replace('Luke 1:34','Luke 1:99')));T(r.every(x=>!/LUKE 1:99/.test(x.key)),'7 a verse not on the proven-press list: no item for it');
 r=await items(C,setTo(t=>t.replace('-- MISSES --','-- MISSES -- MEANS: NONE --')));T(r.length===1||r.length===0,'8 (record) MEANS: NONE written after the grade: '+r.length+' item(s)');
 const L=await items(src('strip_CEC','Gate_Record.js'));T(L.length===0,'9 live library (strip_CEC, s85): no E-GATE M item');
 console.log(ok+' OK, '+bad+' FAIL');})().catch(e=>{console.log('ERROR '+e.stack);});
