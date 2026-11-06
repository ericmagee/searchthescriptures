// W3 spec 16 (Wall 2469): cure key forms. Run from wall2024/: node reader/test_spec16.cjs
const {readLine}=require('./readLines.cjs');let bad=0;const ok=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);if(!c)bad++;};
const r=l=>readLine(l);
let x=r('RETRACTED: K-G4 D1 vs C2 -- wrong grade');ok(x.form==='RETRACTED'&&x.f.pair==='D1 vs C2'&&x.f.reason==='wrong grade','16.1 RETRACTED with a rule id');
x=r('RETRACTED: D3 vs C1');ok(x.form==='RETRACTED'&&x.f.pair==='D3 vs C1','16.1 RETRACTED without a rule id unchanged');
x=r('PRESSED: D1 vs C2 | [CR2] | "the man was just"');ok(x.form==='PRESSED'&&x.f.kind==='cure'&&x.f.sep==='|'&&x.f.pair==='D1 vs C2'&&x.f.round==='CR2'&&x.f.quote==='the man was just','16.2 PRESSED | form');
x=r('PRESSED: D1 vs C2 -- [CR2] -- "q"');ok(x.form==='PRESSED'&&x.f.kind==='cure'&&!x.f.sep&&x.f.quote==='q','16.2 PRESSED -- form unchanged');
x=r('SHORT: D2 vs C3 | [DR1] | "text here" | the answer misses the point');ok(x.form==='SHORT'&&x.f.pair==='D2 vs C3'&&x.f.round==='DR1'&&x.f.quote==='text here'&&x.f.why==='the answer misses the point'&&x.f.text.startsWith('D2 vs C3'),'16.2 SHORT | form with why, text kept');
x=r('SHORT: D2 vs C3 | [DR1] | "text here" | short');ok(x.form==='SHORT'&&!x.f.pair,'16.2 SHORT why under 10 chars: no fields (as the old cure regex)');
x=r('SHORT: free text');ok(x.form==='SHORT'&&x.f.text==='free text'&&!x.f.pair,'16.2 SHORT free text unchanged');
x=r('RESTATED: C5 vs D5: STANDS -- ok');ok(x.form==='COLLISION'&&x.f.restated&&x.f.pair==='D5 vs C5','16.3 reversed pair inside RESTATED read D first');
x=r('C5 vs D5: STANDS -- ok');ok(x.form===null,'16.3 reversed pair outside RESTATED still refused');
console.log(bad?bad+' FAIL':'all OK');process.exit(bad?1:0);
