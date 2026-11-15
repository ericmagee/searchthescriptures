// ASK 331 tests: the one test on every stored counted refused cure (20 days), plants, and E-GATE plants.
const fs=require('fs');const T=require('../tools/lib.cjs');const NEW=T.unpack(JSON.parse(fs.readFileSync('target_331.json')));
const $=()=>({isExecuted:false,all:()=>[],first:()=>({json:{}})});const X=T.load(T.rb(NEW.L,NEW.M['Send Back Record']),$);const XG=T.load(T.rb(NEW.L,NEW.M['Gate Record']),$);
if(X.__oa331.toString()!==XG.__oa331.toString())throw new Error('two copies differ');
const rows=JSON.parse(fs.readFileSync('sbrows.json'));const toOf=r=>{const m=String(r.resp||'').match(/\|\|\s*CHANGE\s+TO\s*:?\s*([\s\S]*?)\s*(?:\|\||$)/i);return m?m[1]:null;};
let flip=[],keep=0,noch=0;
let kre=0,napp=0;for(const r of rows){const to=toOf(r);if(to==null){noch++;continue;}
 if(r.rule==='E-GATE'){if(/\(K re-read\)/.test(r.item)){kre++;continue;}if(!/the gate change was applied|the corrected text still raises it/.test(r.reason)){napp++;continue;}}
 const o=X.__oa331(r.flagged,to);if(o.ok)flip.push(r);else keep++;}
console.log('E-GATE rows excluded: K re-read items',kre,'| gate change not applied',napp);
console.log('REPLAY: counted refused cures',rows.length,'| no CHANGE TO (KEEP or none, counted)',noch,'| CHANGE TO still counted',keep,'| off the tally under 331',flip.length);
for(const r of flip)console.log('  OFF',r.id,r.run,r.seat,r.role,r.rule,String(r.item).slice(0,50),'|',X.__oa331(r.flagged,toOf(r)).why.slice(0,120));
let pass=0,tot=0;const ok=(nm,c,w)=>{tot++;if(c)pass++;console.log((c?'PASS ':'FAIL ')+nm+(w?' | '+w:''));};
const s40025=rows.find(r=>r.id===40025),s41074=rows.find(r=>r.id===41074);
ok('37281 sol Luke 2:48 (row 40025) is off the tally',X.__oa331(s40025.flagged,toOf(s40025)).ok);
ok('37372 sol E-GATE G3 (row 41074) is off the tally',X.__oa331(s41074.flagged,toOf(s41074)).ok);
const AC='ANSWER CHECK: Luke 2:48 -- [CR4] -- MEANS: "Mary names Joseph." -- ANSWER: "The row is Mary\'s speech." -- MEETS -- ground';
ok('grade differs is counted',!X.__oa331(AC,AC.replace('-- MEETS','-- MISSES')).ok);
const CL='CONCEDED LINKS: 2 -- Premise 5: UNEXHIBITED; Premise 6: UNEXHIBITED';
ok('count differs is counted',!X.__oa331(CL,CL.replace('LINKS: 2','LINKS: 1')).ok);
const ST='DEFENSE STANDING: PROP-DEPENDENT -- L=6 c=2 -- x';
ok('standing differs is counted',!X.__oa331(ST,ST.replace('PROP-DEPENDENT','SELF-SUPPORTED')).ok);
ok('same standing and counts is off',X.__oa331(ST,ST.replace('-- x','-- a fuller ground')).ok);
ok('unreadable line is counted',!X.__oa331('The answer is fine.','The answer is still fine.').ok);
ok('KEEP is counted',!X.__oaSkip({line:AC},{ans:'KEEP',to:''},{},'sol'));
ok('NO ANSWER is counted',!X.__oaSkip({line:AC},null,{},'sol'));
const BOD={'Panel Cure Check':[JSON.stringify({payload:{judge_seat:'sol',verdict_raw:'x\n'+AC+'\ny'}})],'Alt Seated':[JSON.stringify({payload:{judge_seat:'hydrogen',verdict_raw:'x\n'+AC+'\ny'}})]};
const $b=n=>BOD[n]?{isExecuted:true,first:()=>({json:{bodies:BOD[n]}}),all:()=>[]}:{isExecuted:false,all:()=>[],first:()=>({json:{}})};const XB=T.load(T.rb(NEW.L,NEW.M['Alt Send Back Record']),$b);
const row={cure_reason:'SEND-BACK CHANGE'};ok('panel seat: matching CHANGE TO is off, reason written once',XB.__oaSkip({line:AC},{ans:'CHANGE',to:AC+' more'},row,'sol')&&XB.__oaSkip({line:AC},{ans:'CHANGE',to:AC},row,'sol')&&(row.cure_reason.match(/OPTION A/g)||[]).length===1&&!/counted in drv_uncured/.test(row.cure_reason));
ok('alternate seat (Alt Seated bodies): matching CHANGE TO is off',XB.__oaSkip({line:AC},{ans:'CHANGE',to:AC},{},'hydrogen'));
ok('line not in the seat text (cannot be replaced) is counted',!XB.__oaSkip({line:AC.replace('Mary','Marie')},{ans:'CHANGE',to:AC.replace('Mary','Marie')},{},'sol'));
ok('seat with no body found is counted',!XB.__oaSkip({line:AC},{ans:'CHANGE',to:AC},{},'luna'));
ok('NOT HELD under CHANGE TO is counted',!XB.__oaSkip({line:AC},{ans:'CHANGE',to:'NOT HELD: '+AC},{},'sol'));
ok('collision grade equal is off',X.__oa331('D1 vs C1 (Matthew 1:25): CHALLENGER LINK BROKEN -- a','D1 vs C1 (Matthew 1:25): CHALLENGER LINK BROKEN -- b').ok);
ok('collision grade changed is counted',!X.__oa331('D1 vs C1 (Matthew 1:25): CHALLENGER LINK BROKEN -- a','D1 vs C1 (Matthew 1:25): UNDERDETERMINED -- b').ok);
ok('RETRACTED is counted',!X.__oa331(AC,'RETRACTED: '+AC.replace('MEETS','')).ok||X.__oa331(AC,'RETRACTED -- the grade is withdrawn').ok===false);
console.log('TOTAL',pass,'of',tot);
// E-GATE: the inserted gate loop, run on synthetic gate results (W1 6942 five plants plus K re-read and not applied)
{const l=NEW.L[3466];const snip=l.slice(0,l.indexOf('/* pkgOPA */'));const run=new Function('res','G','applied','raw','__oa331',snip+';return res;');
 const J='ANSWER CHECK: Genesis 24:16 -- [DR3] -- MEANS: "x" -- ANSWER: "y" -- MISSES -- the old ground';
 const mk=(gid,ans,to,o)=>Object.assign({gid,kind:'CONTRADICTION',src:'E-GATE M',live:true,ans,to,cured:false,why:'the corrected text still raises it'},o||{});
 const res=[mk('G1','CHANGE',J.replace('the old ground','a new ground')),mk('G2','CHANGE',J.replace('MISSES','MEETS')),mk('G3','CHANGE','CONCEDED LINKS: 2 -- x',{}),mk('G4','CHANGE','The answer is weak.'),mk('G5','KEEP',''),mk('G6','CHANGE',J,{live:false}),mk('G7','CHANGE',J,{src:'K re-read',kind:'RULE K-G4'}),mk('G8','CHANGE',J)];
 const G=res.map(r=>({gid:r.gid,lines:[r.gid==='G3'?'CONCEDED LINKS: 1 -- x':J]}));const out=run(res,G,new Set(['G1','G2','G3','G4','G5','G6','G7']),'text\n'+J+'\nCONCEDED LINKS: 1 -- x\n',XB.__oa331);
 const oa=g=>!!out.find(r=>r.gid===g).oa;
 ok('E-GATE equal grade and counts: off the tally',oa('G1'));ok('E-GATE different grade: counted',!oa('G2'));ok('E-GATE different count: counted',!oa('G3'));ok('E-GATE no readable grade: counted',!oa('G4'));
 ok('E-GATE KEEP: counted',!oa('G5'));ok('E-GATE RECORD-ONLY row: unchanged',!oa('G6'));ok('E-GATE K re-read item: counted',!oa('G7'));ok('E-GATE change not applied: counted',!oa('G8'));}
console.log('TOTAL',pass,'of',tot);
