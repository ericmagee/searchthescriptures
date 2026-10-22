// Worker_E step 3 re-verify probes (7397 rev 8 amendment 3). Usage (cwd = build12_a3): node e_probe.cjs <node dir>
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
 console.log(n,'=>',JSON.stringify(v.map(x=>x.rule+' '+x.status)),'| counted on:',c?c.tag:'own verdict');};
const head='RETRACTED: D6 vs C1\nCORRECTED RESULT: HELD-1\n';const fl=line(rep[k4]);
const frag=fl.slice(fl.indexOf('[DR1]'),fl.indexOf('[CR2]'));
console.log('fragment used:',JSON.stringify(frag));
run('P1 after the bar, a fragment of the flagged line ([DR1] and its quotation), no reason',head+'STATEMENT: K-G4 D6 vs C1 | '+frag.trim()+' Retracted.');
run('P2 flagged line with one word changed, after the bar',head+'STATEMENT: K-G4 D6 vs C1 | '+fl.replace('never named','did not name'));
run('P3 control, own reason naming [CR3] and quoting its words',head+'STATEMENT: K-G4 D6 vs C1 | [CR3] answers it in "the record holds Matthew 1:18", so the witness was named.');
