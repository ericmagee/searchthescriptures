// ASK 354 tests. Usage: node trud.cjs <target> <base>. REAL = stored judgment text; PLANT = made for the test.
const fs=require('fs');const {unpack,rb,load}=require('../../g349/tools/lib.cjs');const S=JSON.stringify;
let fails=0,n=0;const ok=(t,c,d)=>{n++;console.log((c?'ok  ':'FAIL')+' '+t+(d?' :: '+d:''));if(!c)fails++;};
const tw=JSON.parse(fs.readFileSync(process.argv[2])),lw=JSON.parse(fs.readFileSync(process.argv[3]));const tu=unpack(tw),lu=unpack(lw);
const dl=tu.L.map((l,i)=>l!==lu.L[i]?i:-1).filter(i=>i>=0);ok('library lines changed are 514, 517, 701, 849, 1263, 1311, 2174, 2278, 3318',dl.join()==='514,517,701,849,1263,1311,2174,2278,3318'&&tu.L.length===lu.L.length,dl.join());
ok('only the Shared Library node changed; connections equal',S(tw.nodes.filter(x=>x.name!=='Shared Library'))===S(lw.nodes.filter(x=>x.name!=='Shared Library'))&&S(tw.connections)===S(lw.connections));
ok('every MAP entry rebuilds to its n',Object.keys(tu.M).every(k=>rb(tu.L,tu.M[k]).length===tu.M[k].n));
ok('each changed line keeps its live text except the anchored inserts',[701,2278].every(i=>tu.L[i].startsWith(lu.L[i])));
const ROWS=JSON.parse(fs.readFileSync('rows.json'));const $=nm=>({all:()=>nm==='Cited Verses'?ROWS.map(r=>({json:r})):[],first:()=>({json:{}}),isExecuted:true});
const P=load(rb(tu.L,tu.M['Panel Payloads']),$),CC=load(rb(tu.L,tu.M['Panel Cure Check']),$);
ok('Panel Payloads exposes rudLines2024; Panel Cure Check exposes rudCure; K-RUD TRIAL',typeof P.rudLines2024==='function'&&typeof CC.rudCure==='function'&&CC.ENF_STATUS['K-RUD']==='TRIAL');
ok('a silent K-RUD item does not count; K-KJV silence still counts',!CC.enfSilent({rule:'K-RUD',silent:true})&&CC.enfSilent({rule:'K-KJV',silent:true}));
ok('cure label names K-RUD',CC.cureLabel({rule:'K-RUD',link:'RESULT ON D1 vs C1'})==='K-RUD RESULT ON D1 vs C1');
const J=JSON.parse(fs.readFileSync('../rows42.json'));const t1208=J.find(x=>x.id===1208).reasoning;
let o=P.rudLines2024(t1208,ROWS);const kinds=o.items.map(x=>x.kind+':'+x.pair+':'+x.phrase).join(' | ');
ok('REAL 1208 (luna, run 37891): RESULT and KEYSTONE both caught on D1 vs C1 "before they came together"',kinds==='RESULT:D1 vs C1:before they came together | KEYSTONE:D1 vs C1:before they came together',kinds);
console.log('     line: '+(o.items[0]||{}).line);
ok('REAL 1208: the KEYSTONE "thy father" (D5 vs C4, 2 words, sentence says open) is not caught',!o.items.some(x=>/thy father/.test(x.phrase)));
const U='D1 vs C1 (Matthew 1:18): UNDERDETERMINED -- GROUND: [L1] Matthew 1:18 “before they came together, she was found with child of the Holy Ghost” -- the record leaves open whether “before they came together” means before the taking or before union (Commitment 7).';
const run=(...ls)=>P.rudLines2024(ls.join('\n'),ROWS);
o=run(U,'RESULT: DEFENDER WINS -- Matthew 1:18 says she was found with child of the Holy Ghost before they came together.');ok('PLANT: phrase used without quotation marks: caught',o.items.length===1,o.items.length);
o=run(U,'RESULT: DEFENDER WINS -- Matthew 1:25 says “knew her not till she had brought forth her firstborn son”.');ok('PLANT: RESULT on another verse: passes',o.items.length===0);
o=run(U,'RESULT: DEFENDER WINS -- Matthew 1:18 says she was “found with child of the Holy Ghost”.');ok('PLANT: RESULT quotes the verse but not the open phrase: passes',o.items.length===0);
o=run(U,'RESULT: UNDERDETERMINED -- derived after the send-back from the judge\'s own changed lines (S1): HELD-1. GROUND: [L1] Matthew 1:18 “before they came together, she was found with child of the Holy Ghost”');ok('PLANT: engine-derived RESULT: passes',o.items.length===0);
o=run('D1 vs C1 (Matthew 1:18): UNDERDETERMINED -- GROUND: [L1] Matthew 1:18 “before they came together, she was found with child of the Holy Ghost” -- the record leaves the timing open (Commitment 7).','RESULT: DEFENDER WINS -- before they came together she was found with child.');ok('PLANT: no quotation after "open": passes',o.items.length===0);
o=run('D1 vs C1 (Matthew 1:18): UNDERDETERMINED -- the record leaves it open -- GROUND: [L1] Matthew 1:18 “before they came together, she was found with child of the Holy Ghost”','RESULT: DEFENDER WINS -- before they came together, she was found with child of the Holy Ghost.');ok('PLANT: phrase only in the GROUND quotation, before "open"? (GROUND after open): the whole GROUND quote is the phrase',o.items.length===1,'GROUND quote after "open" counts: '+o.items.length);
o=run(U,'RESULT: DEFENDER WINS -- the record leaves open whether before they came together means union, but D3 decides.');ok('PLANT: the RESULT sentence itself says open: passes',o.items.length===0);
o=run(U.replace('Matthew 1:18 “before','Matthew 1:18 “before').replace(/Matthew 1:18/g,'Matthew 1:19'),'RESULT: DEFENDER WINS -- before they came together.');ok('PLANT: verse not read this run: no item, NOT CHECKED mark',o.items.length===0&&o.marks.some(m=>/NOT CHECKED/.test(m)),o.marks.join(' '));
o=run(U,'KEYSTONE: D5 -- STANDS -- D5 rests on Matthew 1:18, before they came together.');ok('PLANT: KEYSTONE caught',o.items.length===1&&o.items[0].kind==='KEYSTONE');
ok('PLANT: empty verdict, no rows: nothing',P.rudLines2024('',ROWS).items.length===0&&P.rudLines2024(t1208,[]).items.length===0);
// cures
const it={rule:'K-RUD',side:'JUDGE',link:'RESULT ON D1 vs C1',pair:'D1 vs C1',kind:'RESULT',ref:'Matthew 1:18',phrase:'before they came together',line:'x'};
const cu=t=>CC.rudCure(it,t);
ok('CURE: D1 vs C1 regraded CHALLENGER LINK BROKEN',cu('RESTATED: D1 vs C1 (Matthew 1:18): CHALLENGER LINK BROKEN -- reason').st==='CURED');
ok('CURE: D1 vs C1 restated UNDERDETERMINED does not cure',cu('RESTATED: D1 vs C1 (Matthew 1:18): UNDERDETERMINED -- reason').st==='UNCURED');
ok('CURE: RESULT written again without the phrase',cu('RESULT: DEFENDER WINS -- D3 vs C3 decides on Matthew 1:25 “knew her not till she had brought forth her firstborn son”.').st==='CURED');
ok('CURE: RESULT written again with the phrase does not cure',cu('RESULT: DEFENDER WINS -- before they came together.').st==='UNCURED');
ok('CURE: NOT HELD naming the label',cu('NOT HELD: D1 vs C1 -- the RESULT uses the finding, not the timing.').st==='CURED');
ok('CURE: no status begins "retracted"',['RESTATED: D1 vs C1 (Matthew 1:18): STANDS -- r','RESULT: X','NOT HELD: D1 vs C1 r','nothing'].every(t=>!/^(?:retracted|regraded LINK BROKEN)/.test(cu(t).why)));
ok('CURE: another rule returns null',CC.rudCure({rule:'K-ML'},'x')===null);
// list only through cureRecompute (W1 7448 method)
const keys=Object.keys(tu.M).filter(k=>/function cureRecompute/.test(rb(tu.L,tu.M[k])));const RC=load(rb(tu.L,tu.M[keys[0]]),$);const RL=load(rb(lu.L,lu.M[keys[0]]),$);
const text=['D1 vs C1 (Matthew 1:18): CHALLENGER LINK BROKEN -- x (Commitment 3) -- GROUND: [L1] Matthew 1:18 "before they came together"','DEFENSE STANDING: HELD','CONCEDED LINKS: 0','CHALLENGE STANDING: BROKEN','CHALLENGER CONCEDED LINKS: 1','RESULT: DEFENDER PREVAILS (HELD)'].join('\n');
const F0={verdict_tag:'HELD',defense_standing:'HELD',conceded_links:0,challenge_standing:'BROKEN',challenger_conceded_links:1};
const reply={ok:true,text:'RETRACTED: D1 vs C1 -- [DR3] reads "the coming together is the taking under one roof"\nCORRECTED RESULT: BROKEN-1'};
const rcT=RC.cureRecompute('luna',text,F0,[it],[Object.assign({},it,{status:'UNCURED',why:'TRIAL rule'})],reply);
ok('LIST ONLY: a retraction on a link only K-RUD names is not applied (standings unchanged)',!rcT||!(rcT.retracted||[]).length,S(rcT&&rcT.retracted));
const g4={rule:'K-G4',side:'CHALLENGER',link:'D1 vs C1',line:'D1 vs C1 x'};
const rcL=RC.cureRecompute('luna',text,F0,[it,g4],[Object.assign({},it,{status:'UNCURED',why:'TRIAL rule'}),Object.assign({},g4,{status:'CURED',why:'retracted'})],reply);
const rcB=RL.cureRecompute('luna',text,F0,[g4],[Object.assign({},g4,{status:'CURED',why:'retracted'})],reply);
ok('LIST ONLY: with a LIVE item on the same link the retraction applies as on live',S(rcL&&rcL.retracted)===S(rcB&&rcB.retracted),S(rcL&&rcL.retracted)+' vs live '+S(rcB&&rcB.retracted));
const rcLiveOnly=RL.cureRecompute('luna',text,F0,[it],[Object.assign({},it,{status:'UNCURED',why:'TRIAL rule'})],reply);
ok('LIST ONLY control: the same K-RUD-only reply on the live library (no guard) applies the retraction',S(rcLiveOnly&&rcLiveOnly.retracted)==='["D1 vs C1"]',S(rcLiveOnly&&rcLiveOnly.retracted));
for(const [nm,l] of [['a','RESULT: UNDERDETERMINED -- D1 vs C1 leaves “before they came together” unsettled, and no other line decides.'],['b','RESULT: UNDERDETERMINED -- the sides dispute what “before they came together” means.'],['c','KEYSTONE: D1 -- STANDS -- whether before they came together means union remains disputed; D3 carries it.'],['d','RESULT: DEFENDER WINS -- whether before they came together means union is contested, and D3 decides.']]){const r=run(U,l);ok('PLANT (W1 7493 F1 '+nm+'): a RESULT or KEYSTONE that keeps the point open: not caught',r.items.length===0,r.items.length);}
{const r=run(U,'RESULT: DEFENDER WINS -- D1 vs C1 is settled by Matthew 1:18: before they came together she was found with child.');ok('PLANT rev 2: a decisive clause with the phrase is still caught',r.items.length===1,r.items.length);}
console.log(n+' checks, '+(fails?'FAILS '+fails:'ALL OK'));
