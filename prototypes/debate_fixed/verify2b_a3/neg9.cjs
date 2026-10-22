// A3 verify of E's 2b (BB-7443): negative and edge cases through drvLedger and drvBroken cut from new9/Panel_Payloads.js
const fs=require('fs');const s=fs.readFileSync('N/Panel_Payloads.js','utf8');const a=s.indexOf('const DRV_REF=');const c=s.indexOf('function drvCheck(');
const F=new Function(s.slice(a,c)+';return {drvLedger,drvBroken,drvCP};')();
const pl=(n,nn)=>'premise '+n+' (LINK '+n+'): carried; NOT NAMED: '+nn;
const ptext=['AGAINST THE DEFENDER, answered in [CR3]:',pl(1,'Psalms 132:11'),pl(2,'none'),pl(3,'Matthew 1:3'),pl(4,'none'),pl(5,'none'),pl(6,'none'),
 'AGAINST THE CHALLENGER, answered in [DR3]:','premise 1: 1 verse(s); NOT NAMED: Luke 1:31','premise 2: 0; NOT NAMED: none','A verse marked NOT NAMED is unanswered by the rule.'].join('\n');
const BL='D6 vs C3 (Matthew 1:18): DEFENDER LINK BROKEN -- [L1] "before they came together" and [L3] Luke 1:34.';
const run=(name,lines,d,cc,extra)=>{const T=['CONCEDED LINKS: '+d+' -- x',...lines,'CHALLENGER CONCEDED LINKS: '+cc+' -- y','DEFENSE STANDING: PROP-DEPENDENT -- L=6 c='+d,'COLLISION POINTS:',extra||BL].join('\n');
 const L=F.drvLedger(T,ptext,d,cc,'PROP-DEPENDENT','PROP-DEPENDENT');const B=F.drvBroken(T,d,'PROP-DEPENDENT',L.items,cc,'PROP-DEPENDENT',ptext);
 const it=L.items.concat(B.items).map(x=>x.rule+' '+x.link).join(', ')||'none';const mk=B.marks.filter(m=>/ABSENT|UNREADABLE/.test(m)).map(m=>m.match(/PREMISES (\w+) LINE (\w+)/).slice(1).join(' ')).join(', ');
 console.log(name.padEnd(48),'items:',it,'| marks:',mk||'none');};
run('a "LINK 1, LINK 3" count 2',['COUNTED PREMISES DEFENDER: LINK 1, LINK 3','COUNTED PREMISES CHALLENGER: none'],2,0);
run('b "1, 3 (UNEXHIBITED)" count 2',['COUNTED PREMISES DEFENDER: 1, 3 (UNEXHIBITED)','COUNTED PREMISES CHALLENGER: none'],2,0);
run('c "1, 1" count 2',['COUNTED PREMISES DEFENDER: 1, 1','COUNTED PREMISES CHALLENGER: none'],2,0);
run('d "none" count 0, D6 BROKEN',['COUNTED PREMISES DEFENDER: none','COUNTED PREMISES CHALLENGER: none'],0,0);
run('e "1, 3, 6" count 3, D6 BROKEN',['COUNTED PREMISES DEFENDER: 1, 3, 6','COUNTED PREMISES CHALLENGER: none'],3,0);
run('f bold "**...:** 1, 3" count 2',['**COUNTED PREMISES DEFENDER:** 1, 3','**COUNTED PREMISES CHALLENGER:** none'],2,0);
run('g lowercase, trailing period',['counted premises defender: 1,3.','counted premises challenger: none.'],2,0);
run('h C line "none" count 0, challenger NOT NAMED 1',['COUNTED PREMISES DEFENDER: 1, 3','COUNTED PREMISES CHALLENGER: none'],2,0);
run('i C line "1" count 1',['COUNTED PREMISES DEFENDER: 1, 3','COUNTED PREMISES CHALLENGER: 1'],2,1);
run('j no lines at all, counts 2 and 1',[],2,1);
run('k D "1, 3" count 2, K-G1 words on D6 line, count 0 would be K-G1',['COUNTED PREMISES DEFENDER: none','COUNTED PREMISES CHALLENGER: none'],0,0,BL.replace('named.','named; the witness was left unanswered.'));
run('l D line "premise 1, premise 3" count 2',['COUNTED PREMISES DEFENDER: premise 1, premise 3','COUNTED PREMISES CHALLENGER: none'],2,0);
run('m D line "1 to 3" count 3',['COUNTED PREMISES DEFENDER: 1 to 3','COUNTED PREMISES CHALLENGER: none'],3,0);
run('n D line "1-3" count 3',['COUNTED PREMISES DEFENDER: 1-3','COUNTED PREMISES CHALLENGER: none'],3,0);
