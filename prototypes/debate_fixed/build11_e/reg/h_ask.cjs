// Probe harness (Worker_A3, drift BB-7414): cureLabel and cureAsk cut from each cure node's own source (the library up to
// "function cureCorrected"); prints the FLAGGED ITEMS lines a K-G6 item, a K-G1 item and a K-G3 item produce.
const fs=require('fs');const [dir]=process.argv.slice(2);
const files=fs.readdirSync(dir).filter(f=>/Cure|Alternate_Build|Alternate_Merge/.test(f)&&f.endsWith('.js')).sort();
const items=[{rule:'K-G6',side:'DEFENDER',link:'DEFENDER premise 1',line:'premise 1 (LINK 1): ... NOT NAMED: Psalm 132:11'},
 {rule:'K-G1',side:'CHALLENGER',link:'CHALLENGER LINK 2',line:'LINK 2: CONCEDED'},{rule:'K-G3',side:'DEFENDER',link:null,line:null}];
for(const f of files){const s=fs.readFileSync(dir+'/'+f,'utf8');const i=s.indexOf('\nfunction cureCorrected');
 const F=new Function(s.slice(0,i)+'\n;return {cureAsk,cureLabel};')();const t=String(F.cureAsk(items,{DEFENDER:['LINK 4'],CHALLENGER:[]})||'');
 const k=t.indexOf('FLAGGED ITEMS:');console.log(f.padEnd(28),JSON.stringify(k<0?'(no FLAGGED ITEMS)':t.slice(k+15).split('\n').slice(0,3)));}
