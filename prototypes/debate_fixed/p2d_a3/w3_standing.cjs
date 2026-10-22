// W3 (pen Worker_A3, 7403 item 3): per counted panel judge, fires when the defense standing after cure is SELF-SUPPORTED
// (header standing, replaced by a CURED K-G3 CORRECTED STANDING row for that judge) while the ledger sent to the judges lists
// one or more verses cited against the defender and not named in its later rounds ("(n of m)" with n > 0). Reads the report only.
const md=require('fs').readFileSync(process.argv[2],'utf8');
const led=[...md.matchAll(/not named in a later round of the defender, \[CR2\] or \[CR3\] \((\d+) of \d+\)/g)].map(m=>+m[1]);
const ledgerN=led.length?Math.max(...led):0;
const judges=[...md.matchAll(/^## Panel judge \d+: (\w+) [^\n]*\n[\s\S]*?\*\*Defense standing:\*\* ([A-Z-]+)/gm)].map(m=>({j:m[1],st:m[2]}));
for(const x of judges){
 const cor=md.split('\n').find(l=>new RegExp('^\\| Panel judge '+x.j+' \\| DEFENDER STANDING \\| Standing \\(K-G3\\) \\| \\*\\*CURED\\*\\*').test(l)&&/CORRECTED STANDING: DEFENDER (PROP-DEPENDENT|COLLAPSED)/.test(l));
 const st=cor?cor.match(/CORRECTED STANDING: DEFENDER ([A-Z-]+)/)[1]:x.st;
 const fire=st==='SELF-SUPPORTED'&&ledgerN>0;
 console.log(x.j,'standing',x.st,cor?'-> corrected '+st:'','| ledger',ledgerN,'=>',fire?'FIRES':'SILENT');}
