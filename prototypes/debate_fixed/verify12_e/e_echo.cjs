// Worker_E step 3 check (7397 rev 8): does a retraction pass DoD 18 when its STATEMENT only copies the flagged item's own label?
// Usage (cwd = build12_a3): node e_echo.cjs <node dir>
const fs=require('fs');const [,,dir]=process.argv;
const lib0=fs.readFileSync(dir+'/Cure_Check.js','utf8').split('\n');const e=lib0.findIndex(l=>l.startsWith('function cureProse'));
const L=new Function(lib0.slice(0,e+2).join('\n')+'\nreturn {cureVerdicts,cureCorrected};')();
const X=JSON.parse(fs.readFileSync('fx/rounds27893.json','utf8'));const R={CR1:X.cr1,DR1:X.gr1,CR2:X.cr2,DR2:X.gr2,CR3:X.cr3,DR3:X.dr3};
const rep=fs.readFileSync('fx/report27893.md','utf8').split('\n');
const k4=rep.findIndex(l=>l.startsWith('K-G4 D6 vs C1: D6 vs C1 (Matthew 1:18): DEFENDER LINK BROKEN'));const k7=k4+1;
const line=s=>s.slice(s.indexOf(': ')+2);
const items=[{rule:'K-G4',side:'DEFENDER',link:'D6 vs C1',line:line(rep[k4])},
 {rule:'K-G7',side:'DEFENDER',link:'D6 vs C1',line:line(rep[k7]),premise:6,conc:2,st:'PROP-DEPENDENT',L:6}];
const broken={DEFENDER:['D6 vs C1'],CHALLENGER:[]};
const run=(n,t)=>{const v=L.cureVerdicts(items,{ok:true,text:t},broken,R);const c=L.cureCorrected({ok:true,text:t},v);
 console.log(n,'=>',JSON.stringify(v.map(x=>x.rule+' '+x.status+' ('+x.why+')')),'| counted on:',c?c.tag:'own verdict');};
const head='RETRACTED: D6 vs C1\nCORRECTED RESULT: HELD-1\n';
run('E1 no reason (control)',head+'STATEMENT: K-G4 D6 vs C1 | Retracted the broken grade, which cures the pressing violation.\nSTATEMENT: K-G7 D6 vs C1 | Retracted, which cures the count violation.');
run('E2 STATEMENT copies the flagged item label in full, then no reason',head+'STATEMENT: '+rep[k4]+' | Retracted the broken grade, which cures the pressing violation.\nSTATEMENT: '+rep[k7]+' | Retracted, which cures the count violation.');
run('E3 prose line copies the BROKEN line itself',head+rep[k4].slice(rep[k4].indexOf(': ')+2));
