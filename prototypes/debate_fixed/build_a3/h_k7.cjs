// FALSIFIERS3 harness (Worker_A3, DoD 7, BB-7420): K-G7 raised and cured, every function run from each node's own source.
// Usage: node h_k7.cjs <dir> <report27665.md>
const fs=require('fs');const [dir,rep]=process.argv.slice(2);const md=fs.readFileSync(rep,'utf8');const rd=n=>fs.readFileSync(dir+'/'+n+'.js','utf8');
const sec=h=>{const i=md.indexOf(h);const j=md.indexOf('\n## ',i+5);return md.slice(i,j);};
const sent=md.slice(md.indexOf('## What the judges were sent'));const T1=sent.slice(sent.indexOf('### Text 1'),sent.indexOf('### Text 2'));const T2=sent.slice(sent.indexOf('### Text 2'),sent.indexOf('### Cure call'));
const hdr=t=>({d:+(t.match(/\*\*Defense standing:\*\* [A-Z-]+, (\d+)/)||[0,0])[1],c:+(t.match(/\*\*Challenge standing:\*\* [A-Z-]+, (\d+)/)||[0,0])[1],
 ds:(t.match(/\*\*Defense standing:\*\* ([A-Z-]+)/)||[0,'SELF-SUPPORTED'])[1],cs:(t.match(/\*\*Challenge standing:\*\* ([A-Z-]+)/)||[0,'PROP-DEPENDENT'])[1]});
let bad=0;const chk=(k,got,exp)=>{const ok=got===exp;if(!ok)bad++;console.log(k,ok?'PASS':'FAIL','got:',got,'| expected:',exp);};
const k7=items=>items.filter(x=>x.rule==='K-G7').map(x=>x.link).join(', ')||'none';
const snip=n=>{const s=rd(n);const a=s.indexOf('const DRV_REF=');const c=s.indexOf('function drvCheck(');let e=s.indexOf('\n',c);
 while(true){const nx=s.indexOf('\n',e+1);if(/^[^\s}+\/]/.test(s.slice(e+1,nx)))break;e=nx;}const i=s.indexOf('let drvAsk=false;');const j=s.indexOf('p.drv_uncured=DRV.items.length;',i);
 return new Function('WT','jd','a','p','marks',s.slice(a,e)+'\n'+s.slice(i,j)+'\nreturn DRV.items;');};
const P=(d,c,ds,cs)=>({conceded_links:d,challenger_conceded_links:c,defense_standing:ds,challenge_standing:cs});
const J=[['Panel judge 1: Gemini','Gemini',T2,'D6 vs C3'],['Panel judge 2: Grok','Grok',T2,'none'],['Panel judge 3: GLM','GLM',T2,'none'],['Single judge: DeepSeek','DeepSeek',T1,'D6 vs C3']];
const BL='D6 vs C3 (Matthew 1:18): DEFENDER LINK BROKEN -- [L1] "before they came together" (Matthew 1:18) and [L3] the cross-reference Luke 1:34 named.';
const syn=(cl,extra)=>[cl,'CHALLENGER CONCEDED LINKS: 0','DEFENSE STANDING: PROP-DEPENDENT -- L=6 c=1','COLLISION POINTS:',extra||BL].join('\n');
for(const n of ['Panel_Payloads','Alternate_Payloads']){let f;try{f=snip(n);}catch(x){console.log(n,'ERROR',x.message);bad++;continue;}
 for(const [h,w,T,exp] of J){const t=sec('## '+h);const q=hdr(t);try{chk('M1 '+n+' '+w,k7(f(t,{body:{messages:[{role:'user',content:T}]}},{body:{messages:[{role:'user',content:T}]}},P(q.d,q.c,q.ds,q.cs),[])),exp);}catch(x){chk('M1 '+n+' '+w,'ERROR '+x.message,exp);}}
 const run=(t,d)=>{try{return k7(f(t,{body:{}},{body:{}},P(d,0,'PROP-DEPENDENT','SELF-SUPPORTED'),[]));}catch(x){return 'ERROR '+x.message;}};
 chk('M2a '+n,run(syn('CONCEDED LINKS: 1 -- premise 6 UNEXHIBITED'),1),'none');
 chk('M2b '+n,run(syn('CONCEDED LINKS: 1 -- LINK 6 CONCEDED'),1),'none');
 chk('M2c '+n,run(syn('CONCEDED LINKS: 1 -- premise 2 UNEXHIBITED'),1),'D6 vs C3');
 chk('M3 '+n,run(syn('CONCEDED LINKS: 0 -- none',BL.replace('named.','named; the witness was left unanswered.')),0),'none');
 chk('M4 '+n,run(syn('CONCEDED LINKS: 1 -- premise 2 UNEXHIBITED','D2 vs C4 (Luke 1:34): CHALLENGER LINK BROKEN -- [L1] "How shall this be" (Luke 1:34) and [L3] Matthew 1:18 named.'),1),'none');}
 const CL='D3 vs C2 (Luke 1:34): CHALLENGER LINK BROKEN -- [L1] "How shall this be" (Luke 1:34) and [L3] Matthew 1:18 never named in [DR3].';
 const synC=(cc,line)=>['CONCEDED LINKS: 1 -- premise 6 UNEXHIBITED','CHALLENGER CONCEDED LINKS: '+cc,'DEFENSE STANDING: PROP-DEPENDENT -- L=6 c=1','CHALLENGE STANDING: SELF-SUPPORTED -- L=6 c='+cc,'COLLISION POINTS:',line].join('\n');
 const runC=(t,c)=>{try{const it=f(t,{body:{}},{body:{}},P(1,c,'PROP-DEPENDENT','SELF-SUPPORTED'),[]);return it.filter(x=>x.rule==='K-G7'||x.rule==='K-G1').map(x=>x.rule+' '+x.link).join(', ')||'none';}catch(x){return 'ERROR '+x.message;}};
 chk('M6 '+n,runC(synC(0,CL),0),'K-G7 D3 vs C2');
 chk('M7 '+n,runC(synC(0,CL.replace('never named in [DR3]','left unanswered')),0),'K-G1 D3 vs C2');
 chk('M8 '+n,runC(synC(1,CL),1),'none');
{const s=rd('Extract_Independent_Verdict');for(const [h,w,T,exp] of [J[3]]){const t=sec('## '+h);const body=t.slice(t.indexOf('\n')+1);
 const $=n=>({first:()=>({json:{verdictBody:{messages:[{role:'user',content:T}]}}}),all:()=>[],isExecuted:true});
 try{const r=new Function('$','$input',s)($,{first:()=>({json:{choices:[{message:{content:body},finish_reason:'stop'}]}})});chk('M1 Extract '+w,k7(r[0].json.debate_rule_violations||[]),exp);}catch(x){chk('M1 Extract '+w,'ERROR '+x.message,exp);}}}
// cure, all 14 nodes
const files=fs.readdirSync(dir).filter(f=>/Cure|Alternate_Build|Alternate_Merge/.test(f)&&f.endsWith('.js')).sort();
const K7={rule:'K-G7',side:'DEFENDER',link:'D6 vs C3',line:BL,conc:0,st:'SELF-SUPPORTED',L:6,premise:6};
const K7C={rule:'K-G7',side:'CHALLENGER',link:'D3 vs C2',line:'D3 vs C2 (Luke 1:34): CHALLENGER LINK BROKEN -- never named',conc:0,st:'SELF-SUPPORTED',L:6,premise:null};
const K6={rule:'K-G6',side:'DEFENDER',link:'DEFENDER premise 1',line:'premise 1 (LINK 1): carried; NOT NAMED: Psalms 132:11',conc:0,st:'SELF-SUPPORTED',L:6};
const CASES={N1:[[K7],['CORRECTED COUNT: DEFENDER 1','CORRECTED STANDING: DEFENDER PROP-DEPENDENT'],'CURED'],N2:[[K7],['RETRACTED: D6 vs C3','CORRECTED RESULT: HELD-1'],'CURED'],
 N3:[[K7],[],'UNCURED'],N4:[[K7],['CORRECTED COUNT: DEFENDER 0','CORRECTED STANDING: DEFENDER PROP-DEPENDENT'],'UNCURED'],N5:[[K7],['CORRECTED COUNT: DEFENDER 1','CORRECTED STANDING: DEFENDER SELF-SUPPORTED'],'UNCURED'],
 N6a:[[K6,K7],['CORRECTED COUNT: DEFENDER 1','CORRECTED STANDING: DEFENDER PROP-DEPENDENT'],'UNCURED UNCURED'],N6b:[[K6,K7],['CORRECTED COUNT: DEFENDER 2','CORRECTED STANDING: DEFENDER PROP-DEPENDENT'],'CURED CURED'],
 N7a:[[K7C],['CORRECTED COUNT: CHALLENGER 1','CORRECTED STANDING: CHALLENGER PROP-DEPENDENT'],'CURED'],N7b:[[K7C],[],'UNCURED']};
const tally={};
for(const f of files){const s=fs.readFileSync(dir+'/'+f,'utf8');const i=s.indexOf('\nfunction cureCorrected');const a=s.indexOf('function cureCorrected(');const b=s.indexOf('const cureCorrLine=');
 let F;try{F=new Function(s.slice(0,i)+'\n'+s.slice(a,b)+'\n;return {cureVerdicts,cureCorrected,cureSet,cureAsk};')();}catch(x){tally['load ERROR '+x.message]=(tally['load ERROR '+x.message]||0)+1;continue;}
 for(const [k,[items,lines,exp]] of Object.entries(CASES)){let got;try{const rp={ok:true,text:lines.join('\n')};const v=F.cureVerdicts(items,rp,{DEFENDER:['D6 vs C3'],CHALLENGER:[]},{});got=v.map(x=>x.status).join(' ');
   if(k==='N1'){const cs=F.cureSet(rp,v);got+=' | set '+(cs&&cs.DEFENDER?cs.DEFENDER.n+' '+cs.DEFENDER.st:'none');}
   if(k==='N2'){const cc=F.cureCorrected(rp,v);got+=' | result '+(cc?cc.word:'none');}}catch(x){got='ERROR '+x.message;}
  const e2=k==='N1'?exp+' | set 1 PROP-DEPENDENT':k==='N2'?exp+' | result HELD':exp;const key=k+' '+(got===e2?'PASS':'FAIL')+' got: '+got+' | expected: '+e2;tally[key]=(tally[key]||0)+1;}
 const t=String(F.cureAsk([K7],{DEFENDER:['D6 vs C3'],CHALLENGER:[]})||'');const lab=t.includes('K-G7 D6 vs C3: D6 vs C3')?'PASS':'FAIL';const key='LABEL '+lab;tally[key]=(tally[key]||0)+1;}
for(const [k,n] of Object.entries(tally)){if(/FAIL|ERROR/.test(k))bad++;console.log(n+'/'+files.length,k);}
const fm=rd('Format_Markdown');const lab=(fm.match(/'K-G7': '([^']+)'/)||[0,null])[1];chk('TEXT Format Markdown K-G7 label',lab?'named':'absent','named');
console.log('FAILS',bad);
