// FALSIFIERS10 harness (Worker_A3, 2c, BB-7455/7456): T1-T13 through drvLedger and drvBroken cut from each raise node's own source.
// Usage: node h_2c.cjs <dir> <report27665.md>
const fs=require('fs');const [dir,rep]=process.argv.slice(2);const rd=n=>fs.readFileSync(dir+'/'+n+'.js','utf8');let bad=0,pass=0;const MARKS=[];
const chk=(k,got,exp)=>{const ok=got===exp;ok?pass++:bad++;console.log((ok?'PASS ':'FAIL ')+k.padEnd(52),'got:',got,ok?'':'| expected: '+exp);};
const cutF=n=>{const s=rd(n);const a=s.indexOf('const DRV_REF=');const c=s.indexOf('function drvCheck(');let e=s.indexOf('\n',c);
 while(true){const nx=s.indexOf('\n',e+1);if(/^[^\s}+\/]/.test(s.slice(e+1,nx)))break;e=nx;}return new Function(s.slice(a,e)+';return {drvLedger,drvBroken,drvCheck};')();};
const pl=(n,l,nn)=>'premise '+n+' (LINK '+l+'): carried; NOT NAMED: '+nn;
const std=['AGAINST THE DEFENDER, answered in [CR3]:',pl(1,1,'Psalms 132:11'),pl(2,2,'none'),pl(3,3,'Matthew 1:3'),pl(4,4,'none'),pl(5,5,'none'),pl(6,6,'none'),
 'AGAINST THE CHALLENGER, answered in [DR3]:','premise 1: 1 verse(s); NOT NAMED: Luke 1:31','premise 2: 0; NOT NAMED: none','A verse marked NOT NAMED is unanswered by the rule.'].join('\n');
const shifted=std.replace(pl(5,5,'none'),pl(5,6,'none')).replace(pl(6,6,'none')+'\n','');
const BL='D6 vs C3 (Matthew 1:18): DEFENDER LINK BROKEN -- [L1] "before they came together" and [L3] Luke 1:34 named.';
const run=(F,pt,d,c,CPV,extra)=>{const T=['CONCEDED LINKS: '+d+' -- x',...(extra||[]),'CHALLENGER CONCEDED LINKS: '+c+' -- y','DEFENSE STANDING: PROP-DEPENDENT -- L=6 c='+d,'CHALLENGE STANDING: PROP-DEPENDENT -- L=2 c='+c,'COLLISION POINTS:',BL].join('\n');
 const P=F.drvCheck(T,d,c,'PROP-DEPENDENT','PROP-DEPENDENT',false);const L=F.drvLedger(T,pt,d,c,'PROP-DEPENDENT','PROP-DEPENDENT',CPV);const B=F.drvBroken(T,d,'PROP-DEPENDENT',P.items.concat(L.items),c,'PROP-DEPENDENT',pt,CPV);
 const it=L.items.concat(B.items).filter(x=>/K-G[678]/.test(x.rule)).map(x=>x.rule+' '+x.link).join(', ')||'none';MARKS.push(...L.marks,...B.marks);const mk=B.marks.filter(x=>/FIELD/.test(x)).map(x=>x.match(/PREMISES (\w+) FIELD ([A-Z]+)(?:: ([^ ]*))?/).slice(1).filter(Boolean).join(' ')).join('; ');return it+(mk?' | marks: '+mk:'');};
for(const n of ['Panel_Payloads','Alternate_Payloads','Extract_Independent_Verdict']){let F;try{F=cutF(n);}catch(e){chk(n+' load',e.message,'ok');continue;}const p=n.slice(0,5)+' ';
 chk(p+'T1 [1,3,6]/3, C [1]/1',run(F,std,3,1,{DEFENDER:[1,3,6],CHALLENGER:[1]}),'none');
 chk(p+'T2 [1,6]/2',run(F,std,2,1,{DEFENDER:[1,6],CHALLENGER:[1]}),'K-G6 DEFENDER premise 3');
 chk(p+'T3 []/0',run(F,std,0,1,{DEFENDER:[],CHALLENGER:[1]}),'K-G6 DEFENDER premise 1, K-G6 DEFENDER premise 3, K-G7 D6 vs C3');
 chk(p+'T4 absent/2',run(F,std,2,1,{CHALLENGER:[1]}),'none | marks: DEFENDER ABSENT');
 chk(p+'T5 absent/0',run(F,std,0,1,{CHALLENGER:[1]}),'K-G6 DEFENDER premise 1, K-G6 DEFENDER premise 3, K-G7 D6 vs C3 | marks: DEFENDER ABSENT');
 chk(p+'T6 ["1","3"]/2',run(F,std,2,1,{DEFENDER:["1","3"],CHALLENGER:[1]}),'none | marks: DEFENDER INVALID ("1","3")');
 chk(p+'T7 [1.5]/1',run(F,std,1,1,{DEFENDER:[1.5],CHALLENGER:[1]}),'none | marks: DEFENDER INVALID (1.5)');
 chk(p+'T8 "LINK 1, LINK 3"/2',run(F,std,2,1,{DEFENDER:"LINK 1, LINK 3",CHALLENGER:[1]}),'none | marks: DEFENDER INVALID "LINK');
 chk(p+'T9 [1,3]/3',run(F,std,3,1,{DEFENDER:[1,3],CHALLENGER:[1]}),'K-G8 DEFENDER COUNTED PREMISES, K-G7 D6 vs C3');
 chk(p+'T10 shifted, [5]/1 (K-G7 only, as declared)',(run(F,shifted,1,1,{DEFENDER:[5],CHALLENGER:[1]}).match(/K-G7[^,|]*/g)||['none']).join(', '),'none');
 chk(p+'T11 C []/0',run(F,std,3,0,{DEFENDER:[1,3,6],CHALLENGER:[]}),'K-G6 CHALLENGER premise 1');
 chk(p+'T12 prose line, key absent/0',run(F,std,0,1,{CHALLENGER:[1]},['COUNTED PREMISES DEFENDER: 1, 3, 6']),'K-G6 DEFENDER premise 1, K-G6 DEFENDER premise 3, K-G7 D6 vs C3 | marks: DEFENDER ABSENT');}
 chk(p+'F-dup [1,1,3]/3',run(F,std,3,1,{DEFENDER:[1,1,3],CHALLENGER:[1]}),'K-G8 DEFENDER COUNTED PREMISES, K-G7 D6 vs C3');
 chk(p+'F-dup [1,1,3]/2',run(F,std,2,1,{DEFENDER:[1,1,3],CHALLENGER:[1]}),'K-G7 D6 vs C3');
 chk(p+'F-range [0]/1',run(F,std,1,1,{DEFENDER:[0],CHALLENGER:[1]}),'none | marks: DEFENDER INVALID (0)');
 chk(p+'F-range [7]/1 (6 premises)',run(F,std,1,1,{DEFENDER:[7],CHALLENGER:[1]}),'none | marks: DEFENDER INVALID (7)');
 chk(p+'F-range [-1]/1',run(F,std,1,1,{DEFENDER:[-1],CHALLENGER:[1]}),'none | marks: DEFENDER INVALID (-1)');
// T13: Extract Independent Verdict, whole node, on the single judge's stored text and Text 1
{const md=fs.readFileSync(rep,'utf8');const sec=h=>{const i=md.indexOf(h);const j=md.indexOf('\n## ',i+5);return md.slice(i,j);};const sent=md.slice(md.indexOf('## What the judges were sent'));
 const T1=sent.slice(sent.indexOf('### Text 1'),sent.indexOf('### Text 2'));const t=sec('## Single judge: DeepSeek');const body=t.slice(t.indexOf('\n')+1);
 const $=()=>({first:()=>({json:{verdictBody:{messages:[{role:'user',content:T1}]}}}),all:()=>[],isExecuted:true});
 try{const r=new Function('$','$input',rd('Extract_Independent_Verdict'))($,{first:()=>({json:{choices:[{message:{content:body},finish_reason:'stop'}]}})});
  chk('T13 Extract on 27665 single judge',(r[0].json.debate_rule_violations||[]).filter(x=>/K-G[678]/.test(x.rule)).map(x=>x.rule+' '+x.link).join(', '),'K-G6 DEFENDER premise 1, K-G6 DEFENDER premise 3, K-G7 D6 vs C3');}catch(e){chk('T13',e.message,'ok');}}
// TEXT
{const pb=rd('Panel_Build'),bv=rd('Build_Independent_Verdict');chk('TEXT schema lines in Panel Build',String((pb.match(/"counted_premises_(?:defender|challenger)": array of integers/g)||[]).length),'2');
 chk('TEXT no line sentence (Panel Build, BIV)',String((pb+bv).split('COUNTED PREMISES DEFENDER: followed').length-1),'0');}
console.log('MARKS md5 '+require('crypto').createHash('md5').update(MARKS.join('\n')).digest('hex'));
console.log('TOTAL pass',pass,'fail',bad);
