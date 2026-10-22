// DoD 9 harness (Worker_E): FALSIFIERS9.txt cases, each function run from each node's own source.
// Usage: node h_dod9.cjs <node dir> <report27665.md> <lines.json>
const fs=require('fs');const [dir,rep,linesF]=process.argv.slice(2);const rd=n=>fs.readFileSync(dir+'/'+n+'.js','utf8');
let bad=0,pass=0;const chk=(k,got,exp)=>{const ok=got===exp;ok?pass++:bad++;console.log((ok?'PASS ':'FAIL ')+k.padEnd(44),'got:',got,ok?'':'| expected: '+exp);};
const raiseF=n=>{const s=rd(n);const a=s.indexOf('function drvPromptText(');const b=s.indexOf('function drvCheck(');
 return new Function(s.slice(a,b)+';return {drvLedger,drvBroken,drvPromptText,drvCP,drvLinkMap};')();};
const LEDGER=(over)=>{const D=[1,2,3,4,5,6].map(n=>{const o=(over||{})[n]||{};return 'premise '+n+' ('+(o.link?'LINK '+o.link:'LINK '+n)+'): 2 verse(s) carried; '+((o.nn!==undefined?o.nn:(n===1||n===3))?'1 named; NOT NAMED: Verse '+n+':1':'2 named; NOT NAMED: none');});
 const C=[1,2,3,4,5,6].map(n=>'premise '+n+': 1 verse(s) carried; '+(((over||{}).cnn||[]).includes(n)?'0 named; NOT NAMED: Luke '+n+':1':'1 named; NOT NAMED: none'));
 return 'PRESSED-WITNESS LEDGER\nAGAINST THE DEFENDER, answered in [CR3]:\n'+D.join('\n')+'\ncited in [DR1] or [DR2] and not named ...\nAGAINST THE CHALLENGER, answered in [DR3]:\n'+C.join('\n')+'\nA verse marked NOT NAMED is unanswered by the rule; a verse marked NAMED may still be unanswered, and the judge decides that.';};
const JT=(o)=>['DEFENSE STANDING: PROP-DEPENDENT -- L=6 c='+o.d,'CONCEDED LINKS: '+o.d+(o.dItems?' -- '+o.dItems:''),...(o.dLine!==undefined?['COUNTED PREMISES DEFENDER: '+o.dLine]:[]),
 'CHALLENGE STANDING: PROP-DEPENDENT -- L=6 c='+o.c,'CHALLENGER CONCEDED LINKS: '+o.c,...(o.cLine!==undefined?['COUNTED PREMISES CHALLENGER: '+o.cLine]:[]),'COLLISION POINTS:',...(o.broken?[o.broken]:[])].join('\n');
const run=(F,o,over)=>{const pt=LEDGER(over);const t=JT(o);const L=F.drvLedger(t,pt,o.d,o.c,'PROP-DEPENDENT','PROP-DEPENDENT');const B=F.drvBroken(t,o.d,'PROP-DEPENDENT',L.items,o.c,'PROP-DEPENDENT',pt);
 const it=L.items.concat(B.items);const mk=L.marks.concat(B.marks);return {items:it.map(x=>x.rule+' '+x.link).join(', ')||'none',abs:mk.filter(m=>/COUNTED PREMISES \w+ LINE/.test(m)).map(m=>m.match(/PREMISES (\w+) LINE (\w+)/).slice(1).join(' ')).join(', ')||'none',raw:it};};
const BR='D6 vs C3 (Matthew 1:18): DEFENDER LINK BROKEN -- [L1] "before they came together" and [L2] heos.';
const NODES=['Panel_Payloads','Alternate_Payloads','Extract_Independent_Verdict'];
for(const n of NODES){const F=raiseF(n);const R=(k,o,over,exp,expAbs)=>{const r=run(F,o,over);chk(k+' '+n+' items',r.items,exp);if(expAbs!==undefined)chk(k+' '+n+' absence',r.abs,expAbs);};
 R('P1',{d:2,dLine:'1, 3',c:0,cLine:'none'},null,'none','none');
 R('P2',{d:1,dLine:'1',c:0,cLine:'none'},null,'K-G6 DEFENDER premise 3');
 R('P3',{d:0,c:0,cLine:'none'},null,'K-G6 DEFENDER premise 1, K-G6 DEFENDER premise 3','DEFENDER ABSENT');
 R('P4',{d:2,c:0,cLine:'none'},null,'none','DEFENDER ABSENT');
 R('P5',{d:2,dLine:'1',c:0,cLine:'none'},null,'K-G6 DEFENDER premise 3, K-G8 DEFENDER COUNTED PREMISES');
 R('P6',{d:2,dLine:'1, 3',c:0,cLine:'none',broken:BR},null,'K-G7 D6 vs C3');
 R('P7',{d:3,dLine:'1, 3, 6',c:0,cLine:'none',broken:BR},null,'none');
 R('P8',{d:3,dLine:'1, 3, 5',c:0,cLine:'none',broken:BR},{5:{link:6},6:{link:7}},'none');
 R('P9',{d:0,c:0,cLine:'none',broken:BR},null,'K-G6 DEFENDER premise 1, K-G6 DEFENDER premise 3, K-G7 D6 vs C3','DEFENDER ABSENT');
 R('P10',{d:1,dItems:'premise 6 UNEXHIBITED',c:0,cLine:'none',broken:BR},null,'none','DEFENDER ABSENT');
 R('P11',{d:2,dLine:'1 and three',c:0,cLine:'none'},null,'none','DEFENDER UNREADABLE');
 R('P12',{d:2,dLine:'premises 1 and 3',c:0,cLine:'none'},null,'none','none');
 for(const [k,it] of [['a','premises 1 and 3 UNEXHIBITED'],['b','UNEXHIBITED: premise 1, premise 3'],['c','(UNEXHIBITED: premise 1, premise 3)'],['d','D1 UNEXHIBITED (no footing offered), D3 UNEXHIBITED (no footing offered)'],['e','premise 1 not conceded; premise 3 answered, not conceded']])
  R('P13'+k,{d:2,dItems:it,dLine:'1, 3',c:0,cLine:'none'},null,'none','none');
 R('P14',{d:2,dLine:'1, 3',c:0,cLine:'1'},{cnn:[1]},'K-G8 CHALLENGER COUNTED PREMISES');}
// CURE, all 14 cure nodes
const files=fs.readdirSync(dir).filter(f=>/Cure|Alternate_Build|Alternate_Merge/.test(f)&&f.endsWith('.js')).sort();
const K8=(conc)=>({rule:'K-G8',side:'DEFENDER',link:'DEFENDER COUNTED PREMISES',line:'COUNTED PREMISES DEFENDER: 1',premise:null,conc,st:'PROP-DEPENDENT',L:6});
const K6=n=>({rule:'K-G6',side:'DEFENDER',link:'DEFENDER premise '+n,line:'premise '+n+' (LINK '+n+'): NOT NAMED: x',conc:1,st:'PROP-DEPENDENT',L:6});
const Q={Q1:[[K8(1),K6(3)],['CORRECTED COUNT: DEFENDER 2','CORRECTED STANDING: DEFENDER PROP-DEPENDENT'],'CURED CURED'],
 Q2:[[K8(1),K6(3)],['CORRECTED COUNT: DEFENDER 1','CORRECTED STANDING: DEFENDER PROP-DEPENDENT'],'UNCURED UNCURED'],
 Q3a:[[K8(2)],['CORRECTED COUNT: DEFENDER 2','CORRECTED STANDING: DEFENDER PROP-DEPENDENT'],'CURED'],Q3b:[[K8(2)],[],'UNCURED']};
const tally={};
for(const f of files){const s=fs.readFileSync(dir+'/'+f,'utf8');const i=s.indexOf('\nfunction cureCorrected');const a=s.indexOf('function cureSet(');const b=s.indexOf('const cureCorrLine=');
 const F=new Function(s.slice(0,i)+'\n'+s.slice(a,b)+'\n;return {cureVerdicts,cureSet};')();
 for(const [k,[items,lines,exp]] of Object.entries(Q)){const v=F.cureVerdicts(items,{ok:true,text:lines.join('\n')},{DEFENDER:[],CHALLENGER:[]},{});const got=v.map(x=>x.status).join(' ');
  const key=k+' => '+got+(got===exp?'':' (expected '+exp+')');tally[key]=(tally[key]||0)+1;if(got===exp)pass++;else bad++;}}
for(const k of Object.keys(tally).sort())console.log('CURE '+tally[k]+'/'+files.length+' '+k);
// 27665 through (A). Counts as stored on the judgment rows and the debate row (debate_judgments 786-788, debate_results 921f5530), Gemini, Grok, GLM read by SQL about 20:08 CDT; the single judge from report27665.md line 23 (3 links conceded) and its line "CHALLENGER CONCEDED LINKS: 3".
const STORED={Gemini:{d:0,c:1},Grok:{d:2,c:3},GLM:{d:0,c:3},DeepSeek:{d:0,c:3}};
const md=fs.readFileSync(rep,'utf8');const sec=h=>{const i=md.indexOf(h);const j=md.indexOf('\n## ',i+5);return md.slice(i,j);};
const sent=md.slice(md.indexOf('## What the judges were sent'));const T1=sent.slice(sent.indexOf('### Text 1'),sent.indexOf('### Text 2'));const T2=sent.slice(sent.indexOf('### Text 2'),sent.indexOf('### Cure call'));
const hdr=t=>({d:+(t.match(/\*\*Defense standing:\*\* [A-Z-]+, (\d+)/)||[0,0])[1],c:+(t.match(/\*\*Challenge standing:\*\* [A-Z-]+, (\d+)/)||[0,0])[1]});
const J=[['Panel judge 1: Gemini','Gemini',T2,'K-G6 DEFENDER premise 1, K-G6 DEFENDER premise 3, K-G7 D6 vs C3'],['Panel judge 2: Grok','Grok',T2,'none'],
 ['Panel judge 3: GLM','GLM',T2,'K-G6 DEFENDER premise 1, K-G6 DEFENDER premise 3'],['Single judge: DeepSeek','DeepSeek',T1,'K-G6 DEFENDER premise 1, K-G6 DEFENDER premise 3, K-G7 D6 vs C3']];
for(const n of NODES){const F=raiseF(n);for(const [h,w,T,exp] of J){const t=sec('## '+h);const q=STORED[w];const pt=F.drvPromptText({messages:[{role:'user',content:T}]});
 const L=F.drvLedger(t,pt,q.d,q.c,'X','Y');const B=F.drvBroken(t,q.d,'X',L.items,q.c,'Y',pt);chk('27665 '+n+' '+w+' (d='+q.d+' c='+q.c+')',L.items.concat(B.items).map(x=>x.rule+' '+x.link).join(', ')||'none',exp);
 chk('27665 '+n+' '+w+' absence',B.marks.filter(m=>/COUNTED PREMISES \w+ LINE ABSENT/.test(m)).length+'',w==='Gemini'||w==='DeepSeek'||w==='GLM'||w==='Grok'?'2':'2');}}
// CORPUS: the 285 stored count lines carry no COUNTED PREMISES line
const LN=JSON.parse(fs.readFileSync(linesF,'utf8'));const rows=Array.isArray(LN)?LN:(LN.rows||LN.lines);
for(const n of NODES){const F=raiseF(n);let present=0,items=0;for(const r of rows){const t=r.line.replace(/[*_`]+/g,'');if(F.drvCP(t,'DEFENDER').present||F.drvCP(t,'CHALLENGER').present)present++;
  const side=/^\s*[>#-]*\s*CHALLENGER/i.test(t)?'c':'d';const o=side==='d'?{d:r.stated,c:0}:{d:0,c:r.stated};
  const L=F.drvLedger(t,LEDGER(),o.d,o.c,'X','Y');const B=F.drvBroken(t,o.d,'X',L.items,o.c,'Y',LEDGER());items+=L.items.length+B.items.filter(x=>x.rule!=='K-G7'||x.side!=='CHALLENGER').length;}
 chk('CORPUS '+n+' lines with a COUNTED line',present+' of '+rows.length,'0 of '+rows.length);chk('CORPUS '+n+' items at a stated count >= 1',items+'','0');}
console.log('TOTAL pass',pass,'fail',bad);
